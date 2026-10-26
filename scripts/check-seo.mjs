// SEO checks on the built site (dist/). No dependencies.
//   node scripts/check-seo.mjs [dist]      exits 1 on any blocking problem
//
// Checks every page for: one H1, title and description length, a canonical that does not point
// at a redirect, robots, valid JSON-LD with no unexpanded {{tokens}}, FAQPage questions that match
// the questions visible on the page (Google requires both), duplicate titles and descriptions,
// and a map on every city page. Then checks the sitemap against the pages.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const origin = (process.env.SITE_URL || site.siteUrl).replace(/\/+$/, '');

const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : e.name.endsWith('.html') && files.push(p); } })(DIST);

let blocking = 0, warnings = 0;
const block = (f, m) => { blocking++; console.log(`✗ ${f}: ${m}`); };
const warn = (f, m) => { warnings++; console.log(`⚠ ${f}: ${m}`); };
const titles = new Map(), descs = new Map(), canonicals = new Set();
const text = (s) => s.replace(/<[^>]+>/g, '')
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

for (const f of files) {
  const rel = '/' + path.relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');
  const h = fs.readFileSync(f, 'utf8');
  const noindex = /name="robots" content="noindex/.test(h);
  if (/\{\{[^}]*\}\}/.test(h.replace(/<script[\s\S]*?<\/script>/g, ''))) block(rel, 'unexpanded {{template}} token in the HTML');
  if (noindex) continue;

  const h1s = h.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) block(rel, `${h1s.length} H1 tags (want exactly 1)`);
  const title = text((h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
  const desc = ((h.match(/name="description" content="([^"]*)"/) || [])[1] || '').replace(/&amp;/g, '&');
  const canon = (h.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  if (!title) block(rel, 'no <title>'); else if (title.length > 60) warn(rel, `title ${title.length} chars: ${title}`);
  if (!desc) block(rel, 'no meta description'); else if (desc.length > 160 || desc.length < 110) warn(rel, `description ${desc.length} chars`);
  if (!canon) block(rel, 'no canonical');
  else {
    if (!canon.startsWith(origin)) block(rel, `canonical on another host: ${canon}`);
    if (site.trailingSlash && !canon.endsWith('/')) block(rel, `canonical without trailing slash points at a 301: ${canon}`);
    canonicals.add(canon);
  }
  titles.set(title, [...(titles.get(title) || []), rel]);
  descs.set(desc, [...(descs.get(desc) || []), rel]);

  let faqSchema = null;
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let j;
    try { j = JSON.parse(m[1]); } catch (e) { block(rel, `invalid JSON-LD: ${e.message}`); continue; }
    if (m[1].includes('{{')) block(rel, 'JSON-LD with an unexpanded {{token}}');
    for (const x of [].concat(j)) if (x['@type'] === 'FAQPage') faqSchema = x.mainEntity.map((q) => q.name);
  }
  if (faqSchema) {
    const visible = [...h.matchAll(/<summary>([\s\S]*?)<\/summary>/g)].map((m) => text(m[1]));
    const missing = faqSchema.filter((q) => !visible.includes(q));
    if (missing.length) block(rel, `FAQPage questions not visible on the page: ${missing.join(' | ')}`);
  }
  if (/^\/house-cleaning-[a-z-]+-ny\/$/.test(rel)) {
    if (!/<iframe class="city-map" src="https:\/\/www\.google\.com\/maps\/embed\?pb=/.test(h)) block(rel, 'city page without its Google map');
    if (!faqSchema) block(rel, 'city page without FAQPage schema');
  }
}
for (const [t, ps] of titles) if (ps.length > 1) block(ps.join(', '), `duplicate title "${t}"`);
for (const [d, ps] of descs) if (ps.length > 1) block(ps.join(', '), `duplicate description "${d.slice(0, 60)}…"`);

const sm = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
for (const c of canonicals) if (!locs.has(c)) block('sitemap', `indexable page missing: ${c}`);
for (const l of locs) if (!canonicals.has(l)) block('sitemap', `URL with no matching indexable page: ${l}`);

console.log(`\n${blocking ? '✗' : '✓'} SEO check: ${canonicals.size} indexable pages, ${locs.size} in the sitemap, ${blocking} blocking, ${warnings} warnings`);
process.exit(blocking ? 1 : 0);
