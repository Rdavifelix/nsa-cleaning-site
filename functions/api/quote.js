// Cloudflare Pages Functions adapter (alternative hosting). Route: POST /api/quote
import { handleQuote } from '../../api/_lib/quote-core.js';

export async function onRequestPost({ request, env }) {
  const headers = Object.fromEntries(request.headers.entries());
  const out = await handleQuote({ method: 'POST', headers, ip: request.headers.get('cf-connecting-ip') || '', bodyText: await request.text(), env });
  return new Response(out.body, { status: out.status, headers: out.headers });
}

export async function onRequest({ request, next }) {
  if (request.method === 'POST') return next();
  return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers: { 'content-type': 'application/json' } });
}
