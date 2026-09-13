// Minimal static server for local preview. Usage:
//   node scripts/serve.mjs [--root dist] [--root public] [--port 4000]
// Multiple --root dirs are searched in order. Directories resolve to index.html; missing → 404.html.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const args = process.argv.slice(2);
const roots = []; let port = 4000;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--root') roots.push(path.resolve(args[++i]));
  else if (args[i] === '--port') port = Number(args[++i]);
}
if (!roots.length) roots.push(path.resolve('dist'));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.mp4': 'video/mp4' };
function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/+$/, '') || '/';
  for (const root of roots) {
    const candidates = clean === '/' ? [path.join(root, 'index.html')] : [path.join(root, clean), path.join(root, clean + '.html'), path.join(root, clean, 'index.html')];
    for (const c of candidates) {
      if (!c.startsWith(root)) continue;
      if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
    }
  }
  return null;
}
http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) { res.writeHead(501, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ ok: false, error: 'API not available in static preview' })); }
  let file = resolveFile(req.url); let status = 200;
  if (!file) { status = 404; for (const r of roots) { const f = path.join(r, '404.html'); if (fs.existsSync(f)) { file = f; break; } } }
  if (!file) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(status, { 'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving ${roots.join(', ')} at http://localhost:${port}`));
