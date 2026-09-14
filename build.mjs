// Zero-dependency static site builder for NSA Cleaning LLC.
// - Renders src/pages/**/*.html through src/layout.html with partials (src/partials/*.html)
// - Page front matter: an HTML comment at the top:  <!--@meta { ...json... } -->
// - Inlines src/styles.css into <head>, hoists <style> blocks from page content into <head>
// - Emits dist/<path>/index.html (root → dist/index.html, /404 → dist/404.html)
// - Generates sitemap.xml + robots.txt, copies public/ → dist/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(ROOT, process.env.SRC_DIR || 'src');
const DIST = path.resolve(ROOT, process.env.OUT_DIR || 'dist');
const PUBLIC = path.join(ROOT, 'public');

loadDotEnv(path.join(ROOT, '.env'));
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
site.siteUrl = (process.env.SITE_URL || site.siteUrl).replace(/\/+$/, '');
site.gaMeasurementId = process.env.GA_MEASUREMENT_ID ?? site.gaMeasurementId ?? '';
site.turnstileSiteKey = process.env.TURNSTILE_SITE_KEY ?? site.turnstileSiteKey ?? '';
// Gray "photo coming soon" blocks. On by default; set PHOTO_PLACEHOLDERS=0 to hide them before launch.
site.photoPlaceholders = process.env.PHOTO_PLACEHOLDERS !== '0';
// Deploy to a subpath (e.g. GitHub Pages project site): BASE_PATH=/repo-name
site.basePath = (process.env.BASE_PATH || '').replace(/\/+$/, '');
// Preview build: noindex everywhere, robots.txt disallows all, quote form shows a notice instead of posting
site.preview = process.env.PREVIEW === '1';
site.year = String(new Date().getFullYear());
site.buildDate = new Date().toISOString().slice(0, 10);
site.businessSchema = buildBusinessSchema(site);

// ---------- tiny template engine ----------
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function lookup(ctx, expr) {
  expr = expr.trim();
  if (expr === 'this') return ctx.this;
  if (expr === '@index') return ctx['@index'];
  const parts = expr.split('.');
  let cur = parts[0] === 'this' ? ctx.this : ctx;
  for (const p of parts[0] === 'this' ? parts.slice(1) : parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}
function tokenize(tpl) {
  const re = /\{\{\{\s*([^}]+?)\s*\}\}\}|\{\{\s*([^}]+?)\s*\}\}/g;
  const out = []; let last = 0; let m;
  while ((m = re.exec(tpl))) {
    if (m.index > last) out.push({ t: 'text', v: tpl.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ t: 'raw', v: m[1] });
    else {
      const v = m[2];
      if (v.startsWith('#if ')) out.push({ t: 'if', v: v.slice(4).trim(), neg: false });
      else if (v.startsWith('#unless ')) out.push({ t: 'if', v: v.slice(8).trim(), neg: true });
      else if (v === '/if' || v === '/unless') out.push({ t: 'endif' });
      else if (v.startsWith('#each ')) out.push({ t: 'each', v: v.slice(6).trim() });
      else if (v === '/each') out.push({ t: 'endeach' });
      else if (v === 'else') out.push({ t: 'else' });
      else if (v.startsWith('> ') || v.startsWith('>')) out.push({ t: 'partial', v: v.replace(/^>\s*/, '') });
      else out.push({ t: 'var', v });
    }
    last = re.lastIndex;
  }
  if (last < tpl.length) out.push({ t: 'text', v: tpl.slice(last) });
  return out;
}
function parse(tokens) {
  let i = 0;
  function block(endTypes) {
    const nodes = [];
    while (i < tokens.length) {
      const tk = tokens[i];
      if (endTypes.includes(tk.t)) return nodes;
      i++;
      if (tk.t === 'if') {
        const body = block(['else', 'endif']);
        let alt = [];
        if (tokens[i]?.t === 'else') { i++; alt = block(['endif']); }
        if (tokens[i]?.t !== 'endif') throw new Error('Unclosed {{#if ' + tk.v + '}}');
        i++;
        nodes.push({ t: 'if', v: tk.v, neg: tk.neg, body, alt });
      } else if (tk.t === 'each') {
        const body = block(['endeach']);
        if (tokens[i]?.t !== 'endeach') throw new Error('Unclosed {{#each ' + tk.v + '}}');
        i++;
        nodes.push({ t: 'each', v: tk.v, body });
      } else nodes.push(tk);
    }
    return nodes;
  }
  const ast = block([]);
  if (i < tokens.length) throw new Error('Unexpected {{' + tokens[i].t + '}}');
  return ast;
}
const partialCache = new Map();
function loadPartial(name) {
  if (!partialCache.has(name)) {
    const p = path.join(SRC, 'partials', name + '.html');
    if (!fs.existsSync(p)) throw new Error('Missing partial: ' + name);
    partialCache.set(name, parse(tokenize(fs.readFileSync(p, 'utf8'))));
  }
  return partialCache.get(name);
}
function render(ast, ctx, depth = 0) {
  if (depth > 12) throw new Error('Partial recursion too deep');
  let out = '';
  for (const n of ast) {
    switch (n.t) {
      case 'text': out += n.v; break;
      case 'var': { const v = lookup(ctx, n.v); out += v == null ? '' : escapeHtml(v); break; }
      case 'raw': { const v = lookup(ctx, n.v); out += v == null ? '' : String(v); break; }
      case 'partial': out += render(loadPartial(n.v), ctx, depth + 1); break;
      case 'if': {
        let v = lookup(ctx, n.v);
        if (Array.isArray(v)) v = v.length > 0;
        const truthy = !!v;
        out += render((n.neg ? !truthy : truthy) ? n.body : n.alt, ctx, depth + 1);
        break;
      }
      case 'each': {
        const arr = lookup(ctx, n.v);
        if (Array.isArray(arr)) arr.forEach((item, idx) => {
          const sub = Object.assign(Object.create(ctx), { this: item, '@index': idx, '@first': idx === 0, '@last': idx === arr.length - 1 });
          out += render(n.body, sub, depth + 1);
        });
        break;
      }
    }
  }
  return out;
}
const renderString = (tpl, ctx) => render(parse(tokenize(tpl)), ctx);

// ---------- pages ----------
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });
}
function readPage(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^\s*<!--@meta\s*([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`Page ${path.relative(ROOT, file)} is missing the <!--@meta {...} --> front matter`);
  let meta;
  try { meta = JSON.parse(m[1]); } catch (e) { throw new Error(`Bad JSON front matter in ${path.relative(ROOT, file)}: ${e.message}`); }
  let body = raw.slice(m[0].length);
  const rel = path.relative(path.join(SRC, 'pages'), file).replace(/\\/g, '/').replace(/\.html$/, '');
  meta.path = meta.path || (rel === 'index' ? '/' : '/' + rel.replace(/\/index$/, ''));
  if (!meta.title) throw new Error(`Page ${rel} needs a title`);
  if (!meta.description) throw new Error(`Page ${rel} needs a description`);
  // hoist <style> blocks
  const styles = [];
  body = body.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => { styles.push(css.trim()); return ''; });
  meta.pageStyles = styles.length ? `<style>${styles.join('\n')}</style>` : '';
  return { meta, body, file };
}
function buildBusinessSchema(site) {
  const b = site.business;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'additionalType': 'https://schema.org/HomeAndConstructionBusiness',
    '@id': site.siteUrl + '/#business',
    name: b.legalName,
    legalName: b.legalName,
    url: site.siteUrl + '/',
    logo: site.siteUrl + '/images/logo-nsa-cleaning-640.png',
    image: site.siteUrl + site.defaultOgImage,
    telephone: b.phoneE164,
    email: b.email,
    priceRange: b.priceRange,
    foundingDate: String(b.foundingYear),
    knowsLanguage: b.languages,
    address: { '@type': 'PostalAddress', streetAddress: b.address.street, addressLocality: b.address.city, addressRegion: b.address.region, postalCode: b.address.postal, addressCountry: b.address.country },
    geo: { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng },
    areaServed: b.serviceArea.map((name) => ({ '@type': 'City', name: `${name}, NY` })),
    openingHoursSpecification: b.openingHours.map((spec) => {
      const [days, hours] = spec.split(' ');
      const [open, close] = hours.split('-');
      const map = { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' };
      const keys = Object.keys(map);
      const [a, z] = days.split('-');
      const dayOfWeek = z ? keys.slice(keys.indexOf(a), keys.indexOf(z) + 1).map((k) => map[k]) : [map[a]];
      return { '@type': 'OpeningHoursSpecification', dayOfWeek, opens: open, closes: close };
    }),
    sameAs: [b.facebook],
    contactPoint: [{ '@type': 'ContactPoint', telephone: b.phoneE164, contactType: 'customer service', areaServed: 'US', availableLanguage: b.languages }],
  };
}
function expandSchema(schema, site, page) {
  const list = Array.isArray(schema) ? schema : schema ? [schema] : [];
  return list.map((s) => (s === '@business' ? site.businessSchema : s)).map((s) => {
    const json = JSON.stringify(s).replace(/<\//g, '<\\/');
    return json;
  });
}


// Rewrites root-relative URLs so the site works when served from a subpath.
function applyBase(html, base) {
  if (!base) return html;
  html = html.replace(/\b(href|src|action|poster|data-src)="\/(?!\/)/g, `$1="${base}/`);
  const fixSet = (v) => v.split(',').map((part) => part.replace(/^(\s*)\/(?!\/)/, `$1${base}/`)).join(',');
  html = html.replace(/\b(srcset|imagesrcset)="([^"]+)"/g, (_, a, v) => `${a}="${fixSet(v)}"`);
  html = html.replace(/url\(\/(?!\/)/g, `url(${base}/`);
  return html;
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  if (fs.existsSync(PUBLIC)) fs.cpSync(PUBLIC, DIST, { recursive: true });
  if (fs.existsSync(path.join(SRC, 'assets'))) fs.cpSync(path.join(SRC, 'assets'), DIST, { recursive: true }); // page-specific extras
  fs.writeFileSync(path.join(DIST, '.nojekyll'), ''); // GitHub Pages: serve files as-is
  if (site.basePath) { // rewrite the web app manifest for a subpath deploy
    const mf = path.join(DIST, 'manifest.webmanifest');
    if (fs.existsSync(mf)) {
      const m = JSON.parse(fs.readFileSync(mf, 'utf8'));
      m.start_url = site.basePath + '/';
      m.icons = (m.icons || []).map((i) => ({ ...i, src: i.src.startsWith('/') ? site.basePath + i.src : i.src }));
      fs.writeFileSync(mf, JSON.stringify(m, null, 2) + '\n');
    }
  }

  const layout = parse(tokenize(fs.readFileSync(path.join(SRC, 'layout.html'), 'utf8')));
  const css = fs.existsSync(path.join(SRC, 'styles.css')) ? fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8') : '';
  // BUILD_TOLERANT=1 skips pages that fail to parse (used while several agents edit pages concurrently)
  const pages = walk(path.join(SRC, 'pages')).flatMap((f) => {
    try { return [readPage(f)]; }
    catch (e) { if (process.env.BUILD_TOLERANT) { console.warn('  ⚠ skipped', path.relative(ROOT, f), '—', e.message); return []; } throw e; }
  });
  const seen = new Set();
  const urls = [];
  for (const { meta, body, file } of pages) {
    if (seen.has(meta.path)) throw new Error('Duplicate page path ' + meta.path);
    seen.add(meta.path);
    const canonical = site.siteUrl + (meta.path === '/' ? '/' : meta.path);
    const page = {
      ...meta,
      canonical,
      ogImage: site.siteUrl + (meta.ogImage || site.defaultOgImage),
      robots: (meta.noindex || site.preview) ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
      jsonld: expandSchema(meta.schema, site, meta).map((j) => `<script type="application/ld+json">${j}</script>`).join('\n'),
    };
    const ctx = { site, page, isHome: meta.path === '/' };
    let content, html;
    try {
      content = renderString(body, ctx);
      html = render(layout, { ...ctx, content, styles: css ? `<style>${css}</style>` : '' });
      // Template tags that render to nothing leave whitespace-only lines; strip trailing spaces.
      // Safe here: the site has no <pre> and no textarea with meaningful content.
      html = html.replace(/[ \t]+$/gm, '');
      html = applyBase(html, site.basePath);
      { // guard: the client asked for nothing over-rounded (tokens are 2/3/4px)
        const big = [...content.matchAll(/border-radius:\s*(999px|\d{2,}px|50%)/g)].map((m) => m[1]);
        if (big.length) console.warn(`  ! ${meta.path}: ${big.length} inline border-radius over the token scale (${[...new Set(big)].join(', ')}) - use var(--r) / var(--r-lg) / var(--r-xl)`);
      }
    } catch (e) {
      if (process.env.BUILD_TOLERANT) { console.warn('  ⚠ skipped', meta.path, '—', e.message); continue; }
      throw new Error(`${meta.path}: ${e.message}`);
    }
    let outFile;
    if (meta.path === '/') outFile = path.join(DIST, 'index.html');
    else if (meta.path === '/404') outFile = path.join(DIST, '404.html');
    else outFile = path.join(DIST, meta.path.replace(/^\//, ''), 'index.html');
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html);
    if (!meta.noindex) urls.push({ loc: canonical, changefreq: meta.changefreq || 'monthly', priority: meta.priority ?? (meta.path === '/' ? 1.0 : 0.7) });
    console.log('  ✓', meta.path.padEnd(32), path.relative(ROOT, outFile), `${(html.length / 1024).toFixed(1)}KB`);
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url>\n    <loc>${escapeHtml(u.loc)}</loc>\n    <lastmod>${site.buildDate}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority.toFixed(1)}</priority>\n  </url>`).join('\n') + '\n</urlset>\n';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(DIST, 'robots.txt'), site.preview
    ? `# Preview build - not for indexing\nUser-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`);
  if (process.env.TURNSTILE_SECRET_KEY && !site.turnstileSiteKey) console.warn('  ⚠ TURNSTILE_SECRET_KEY is set but TURNSTILE_SITE_KEY is empty: the widget will not render and every submission will fail verification. Set both, then redeploy.');
  console.log(`\nBuilt ${pages.length} pages → ${path.relative(ROOT, DIST)}/  (siteUrl: ${site.siteUrl}, GA: ${site.gaMeasurementId ? 'on' : 'off'}, Turnstile: ${site.turnstileSiteKey ? 'on' : 'off'})`);
}
function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
try { build(); } catch (e) { console.error('\n✗ Build failed:', e.message); process.exit(1); }
