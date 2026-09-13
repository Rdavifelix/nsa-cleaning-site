// Vercel Serverless Function adapter (Node.js runtime). Route: POST /api/quote
import { handleQuote } from './_lib/quote-core.js';

// Vercel pre-parses the body by content-type (JSON → object, urlencoded → object, text → string, other → Buffer).
// Re-serialise it in its ORIGINAL encoding so the core's content-type handling (JSON reply vs 303 redirect) stays correct.
function reserialise(req) {
  const body = req.body;
  if (typeof body === 'string') return { text: body };
  if (Buffer.isBuffer(body)) return { text: body.toString('utf8') };
  const ct = String(req.headers['content-type'] || '').toLowerCase();
  if (ct.includes('application/x-www-form-urlencoded')) return { text: new URLSearchParams(body).toString() };
  return { text: JSON.stringify(body), contentType: 'application/json' };
}
async function readBody(req) {
  if (req.body !== undefined && req.body !== null) return reserialise(req);
  return await new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (c) => {
      data += c;
      if (data.length > 64 * 1024) { reject(Object.assign(new Error('Payload too large'), { status: 413 })); req.destroy(); }
    });
    req.on('end', () => resolve({ text: data }));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  let body;
  try { body = await readBody(req); }
  catch (e) { res.statusCode = e.status || 400; res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify({ ok: false, error: e.message })); }
  const headers = { ...req.headers };
  if (body.contentType) headers['content-type'] = body.contentType; // only when Vercel handed us a parsed JSON object
  const bodyText = body.text;
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '';
  const out = await handleQuote({ method: req.method, headers, ip, bodyText, env: process.env });
  res.statusCode = out.status;
  for (const [k, v] of Object.entries(out.headers)) res.setHeader(k, v);
  res.end(out.body);
}
