// Unit smoke tests for the quote handler (no network: no email provider configured → 502 on the happy path).
// Run: node scripts/test-api.mjs
import { handleQuote, validate, parseBody } from '../api/_lib/quote-core.js';
import vercelHandler from '../api/quote.js';

let failures = 0;
const expect = (label, actual, wanted) => {
  const ok = actual === wanted;
  if (!ok) failures++;
  console.log(`${ok ? '✓' : '✗'} ${label}: got ${JSON.stringify(actual)}${ok ? '' : ` (wanted ${JSON.stringify(wanted)})`}`);
};
const base = { 'content-type': 'application/json', host: 'lp.nsacleaning.com', origin: 'https://lp.nsacleaning.com' };
const call = (body, extra = {}, ip = '1.1.1.1', env = {}) =>
  handleQuote({ method: 'POST', headers: { ...base, ...extra }, ip, bodyText: JSON.stringify(body), env });
const fresh = () => Date.now() - 5000;

let r = await call({ name: 'A', email: 'bad', phone: '1', service: 'zzz', _ts: fresh() });
expect('invalid fields → 422', r.status, 422);
expect('errors include email', !!JSON.parse(r.body).errors.email, true);

r = await call({ name: 'Ann Lee', email: 'a@b.co', phone: '5189021180', service: 'deep', consent: 'on', _ts: fresh() }, {}, '1.1.1.2');
expect('valid but no provider → 502', r.status, 502);

r = await call({ name: 'Ann Lee', email: 'a@b.co', phone: '5189021180', service: 'deep', consent: 'on', _ts: Date.now() - 500 }, {}, '1.1.1.3');
expect('submitted too fast → 400', r.status, 400);

r = await call({ company_website: 'spam', _ts: fresh() }, {}, '1.1.1.4');
expect('honeypot filled → 200 (silent)', r.status, 200);

r = await handleQuote({ method: 'GET', headers: {}, ip: '', bodyText: '', env: {} });
expect('GET → 405', r.status, 405);

r = await call({ name: 'x' }, { origin: 'https://evil.example' }, '1.1.1.5');
expect('cross-origin → 403', r.status, 403);

r = await handleQuote({ method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', host: 'lp.nsacleaning.com' }, ip: '2.2.2.2', bodyText: 'name=Jo&email=x&_ts=' + fresh(), env: {} });
expect('form-encoded invalid → 303 back to contact', r.status, 303);
expect('redirect location', r.headers.location, '/contact?error=1#quote');

for (let i = 0; i < 5; i++) await call({ _ts: fresh() }, {}, '9.9.9.9');
r = await call({ _ts: fresh() }, {}, '9.9.9.9');
expect('6th request in window → 429', r.status, 429);

const v = validate({ name: 'John', message: 'line1\nline2\ttab', email: 'A@B.CO', phone: '(518) 902-1180', service: 'deep', consent: 'true' });
expect('control chars stripped', v.d.name, 'John');
expect('newline/tab kept in message', v.d.message, 'line1\nline2\ttab');
expect('email lowercased', v.d.email, 'a@b.co');
expect('no errors for valid data', Object.keys(v.errors).length, 0);

const v3 = validate({ name: 'Jane\rDoe', message: 'a\r\nb\rc' });
expect('bare \\r normalised to \\n in name', v3.d.name, 'Jane\nDoe');
expect('\\r\\n and \\r normalised to \\n', v3.d.message, 'a\nb\nc');

// Vercel adapter: a pre-parsed urlencoded body (object) must still be treated as a classic form post (303), not JSON
const fakeRes = () => { const r = { statusCode: 0, headers: {}, body: '', setHeader(k, v) { this.headers[k] = v; }, end(b) { this.body = b || ''; } }; return r; };
let res = fakeRes();
await vercelHandler({ method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', host: 'lp.nsacleaning.com' }, socket: {}, body: { name: 'Jo', email: 'x', _ts: String(fresh()) } }, res);
expect('vercel pre-parsed form body → 303', res.statusCode, 303);
expect('vercel pre-parsed form body → redirect location', res.headers.location, '/contact?error=1#quote');
res = fakeRes();
await vercelHandler({ method: 'POST', headers: { 'content-type': 'application/json', host: 'lp.nsacleaning.com' }, socket: {}, body: { name: 'Jo', email: 'x', _ts: fresh() } }, res);
expect('vercel pre-parsed JSON body → 422 JSON', res.statusCode, 422);
expect('vercel JSON reply content-type', String(res.headers['content-type']).startsWith('application/json'), true);

const v2 = validate({ name: 'Jo', email: 'a@b.co', phone: '5189021180', service: 'deep', consent: 'on', message: 'see http://a.com http://b.com http://c.com' });
expect('3 links in message rejected', !!v2.errors.message, true);

let threw = false;
try { parseBody('application/json', 'x'.repeat(30000)); } catch (e) { threw = e.status === 413; }
expect('oversized body → 413', threw, true);

r = await call({ name: 'Ann Lee', email: 'a@b.co', phone: '5189021180', service: 'deep', consent: 'on', _ts: fresh() }, {}, '1.1.1.6', { TURNSTILE_SECRET_KEY: 'x' });
expect('turnstile required when secret set → 400', r.status, 400);

console.log(failures ? `\n${failures} test(s) failed` : '\nAll API tests passed');
process.exit(failures ? 1 : 0);
