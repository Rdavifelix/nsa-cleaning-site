// Crawls dist/ for internal links/assets and reports broken ones. Usage: node scripts/check-links.mjs [dist]
import fs from 'node:fs';
import path from 'node:path';
const DIST = path.resolve(process.argv[2] || 'dist');
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : files.push(p); } })(DIST);
const html = files.filter((f) => f.endsWith('.html'));
const exists = (url) => {
  let clean = url.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return true; // relative or external handled elsewhere
  clean = decodeURIComponent(clean).replace(/\/+$/, '');
  if (clean === '' ) return true;
  const c = [path.join(DIST, clean), path.join(DIST, clean + '.html'), path.join(DIST, clean, 'index.html')];
  return c.some((p) => fs.existsSync(p) && fs.statSync(p).isFile());
};
let broken = 0;
for (const f of html) {
  const src = fs.readFileSync(f, 'utf8');
  const rel = path.relative(DIST, f);
  const refs = [...src.matchAll(/(?:href|src|srcset|data-src|poster)=["']([^"']+)["']/g)].map((m) => m[1]).concat([...src.matchAll(/<meta[^>]+content=["'](\/[^"']+)["']/g)].map((m) => m[1]));
  const ids = new Set([...src.matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1]));
  for (const ref0 of refs) {
    for (const ref of ref0.split(',').map((s) => s.trim().split(' ')[0])) {
      if (!ref || ref.startsWith('http') || ref.startsWith('mailto:') || ref.startsWith('tel:') || ref.startsWith('data:') || ref.startsWith('javascript:')) continue;
      if (ref.startsWith('#')) { if (ref.length > 1 && !ids.has(ref.slice(1))) { console.log(`✗ ${rel}: missing anchor ${ref}`); broken++; } continue; }
      if (ref.startsWith('/') && !ref.startsWith('/api/') && !exists(ref)) { console.log(`✗ ${rel}: broken ${ref}`); broken++; }
      if (ref.startsWith('/') && ref.includes('#') && !ref.startsWith('/api/')) {
        const [p, anchor] = ref.split('#');
        const target = [path.join(DIST, p.replace(/\/+$/, ''), 'index.html'), path.join(DIST, p.replace(/^\//, '') || 'index.html')].find((x) => fs.existsSync(x) && fs.statSync(x).isFile());
        if (target && anchor && !new RegExp(`\\sid=["']${anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(fs.readFileSync(target, 'utf8'))) { console.log(`✗ ${rel}: missing anchor #${anchor} on ${p}`); broken++; }
      }
    }
  }
}
console.log(broken ? `\n${broken} broken reference(s)` : `\n✓ No broken internal links across ${html.length} pages`);
process.exit(broken ? 1 : 0);
