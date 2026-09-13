// Copy linter: flags the tells of machine-written marketing copy.
// Usage: node scripts/check-copy.mjs [src|dist]   (default: src)
// Exits 1 if any "block" rule matches, 0 otherwise. Warnings never fail the run.
import fs from 'node:fs';
import path from 'node:path';

const TARGET = process.argv[2] || 'src';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIR = path.join(ROOT, TARGET);

// Rules. `block: true` fails the build; the rest are warnings to review by hand.
const RULES = [
  { id: 'em-dash', block: true, re: /—/g, why: 'Em-dash. Rewrite the sentence: split it in two, or use a comma.' },
  { id: 'en-dash-prose', block: true, re: /\s–\s/g, why: 'En-dash used as punctuation. Same fix as the em-dash.' },
  { id: 'exclamation', block: true, re: /!(?=[\s<"])/g, why: 'Exclamation mark. The brand voice is plain and calm.' },
  { id: 'ai-phrase', block: true, why: 'Generic AI phrasing. Say the specific thing instead.',
    re: /\b(elevate|seamless(ly)?|hassle[- ]free|look no further|peace of mind|tailored to your needs|top[- ]notch|nestled|delve|unlock|unparalleled|cutting[- ]edge|state[- ]of[- ]the[- ]art|world[- ]class|rest assured|we understand that|in today's [a-z]+ world|when it comes to|that's where we come in|the perfect solution|take your .{3,20} to the next level)\b/gi },
  { id: 'whether-or', block: false, why: 'The "whether X or Y" catch-all. Usually replaceable with the concrete case.',
    re: /\bwhether (you're|you are|it's|it is|your)\b/gi },
  { id: 'not-just', block: false, why: 'The "not just X, it\'s Y" construction.', re: /\b(it's|we're|this is) not just\b/gi },
  { id: 'rhetorical-heading', block: false, why: 'Rhetorical question as a heading. Make it a statement.',
    re: /<h[1-4][^>]*>[^<]*\b(ready|why (not|wait)|looking for|need a|tired of)\b[^<]*\?[^<]*<\/h[1-4]>/gi },
  { id: 'forbidden-claim', block: true, why: 'Claim the client cannot make (see docs/CONTENT.md §4).',
    re: /\b(licensed and insured|fully licensed|bonded|background[- ]checked|eco[- ]certified|award[- ]winning|top[- ]rated|#1 |5[- ]star|same[- ]day guarantee)\b/gi },
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.(html|md)$/.test(e.name) ? [p] : [];
  });
}

// Strip <script>/<style> so JSON-LD and CSS do not trigger prose rules.
const stripCode = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/<style[\s\S]*?<\/style>/gi, (m) => m.replace(/[^\n]/g, ' '));

let blocking = 0, warnings = 0;
for (const file of walk(DIR)) {
  const raw = fs.readFileSync(file, 'utf8');
  const text = stripCode(raw);
  const rel = path.relative(ROOT, file);
  for (const rule of RULES) {
    const hits = [...text.matchAll(rule.re)];
    if (!hits.length) continue;
    rule.block ? (blocking += hits.length) : (warnings += hits.length);
    const line = (i) => text.slice(0, i).split('\n').length;
    const sample = hits.slice(0, 3).map((h) => {
      const ctx = text.slice(Math.max(0, h.index - 45), h.index + 45).replace(/\s+/g, ' ').trim();
      return `      ${rel}:${line(h.index)}  …${ctx}…`;
    });
    console.log(`${rule.block ? '✗' : '⚠'} ${rule.id} (${hits.length}) ${rel}\n      ${rule.why}\n${sample.join('\n')}`);
  }
}

console.log(`\n${blocking ? '✗' : '✓'} copy check on ${TARGET}/: ${blocking} blocking, ${warnings} to review`);
process.exit(blocking ? 1 : 0);
