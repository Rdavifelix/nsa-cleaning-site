// Platform-agnostic handler for the "Get a Free Quote" form.
// Secrets (Turnstile secret, email API keys) come ONLY from `env` — never from the client.
const SERVICES = ['recurring', 'regular', 'deep', 'full-deep', 'move', 'airbnb', 'post-construction', 'commercial', 'power-washing', 'carpet', 'painting', 'other'];
const FREQUENCIES = ['one-time', 'weekly', 'biweekly', 'monthly', 'not-sure'];
const PROPERTY_TYPES = ['apartment', 'house', 'office', 'clinic', 'restaurant', 'other'];
const LABELS = {
  service: { recurring: 'Recurring cleaning', regular: 'Regular cleaning', deep: 'Deep cleaning', 'full-deep': 'Full deep cleaning', move: 'Move in / move out cleaning', airbnb: 'Airbnb / rental turnover', 'post-construction': 'Post-construction cleaning', commercial: 'Commercial cleaning', 'power-washing': 'Deck & siding power washing', carpet: 'Carpet shampoo & cleaning', painting: 'Painting (residential / commercial)', other: 'Other / not sure' },
  frequency: { 'one-time': 'One time', weekly: 'Weekly', biweekly: 'Bi-weekly', monthly: 'Monthly', 'not-sure': 'Not sure yet' },
  property_type: { apartment: 'Apartment', house: 'House', office: 'Office', clinic: 'Clinic / medical', restaurant: 'Restaurant', other: 'Other' },
};
export const FORM_OPTIONS = { SERVICES, FREQUENCIES, PROPERTY_TYPES, LABELS };
const MAX_BODY = 20 * 1024;
const RATE = { windowMs: 10 * 60 * 1000, max: 5 };
const buckets = new Map(); // best-effort, per warm instance

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Strip ASCII control characters (keeps \t and \n so multi-line messages survive; \r\n is normalised to \n first). Built from char codes on purpose.
const cc = String.fromCharCode;
const CONTROL_CHARS = new RegExp('[' + cc(0) + '-' + cc(8) + cc(11) + '-' + cc(31) + cc(127) + ']', 'g');
const str = (v, max) => (typeof v === 'string' ? v : Array.isArray(v) ? String(v[0] ?? '') : v == null ? '' : String(v)).replace(/\r\n?/g, '\n').replace(CONTROL_CHARS, '').trim().slice(0, max);

export function parseBody(contentType, text) {
  if (!text) return {};
  if (text.length > MAX_BODY) throw Object.assign(new Error('Payload too large'), { status: 413 });
  const ct = (contentType || '').toLowerCase();
  if (ct.includes('application/json')) {
    try { const o = JSON.parse(text); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; }
    catch { throw Object.assign(new Error('Invalid JSON'), { status: 400 }); }
  }
  if (ct.includes('multipart/form-data')) throw Object.assign(new Error('Unsupported content type'), { status: 415 });
  const out = {};
  for (const [k, v] of new URLSearchParams(text)) out[k] = k in out ? [].concat(out[k], v) : v;
  return out;
}

export function validate(data) {
  const errors = {};
  const d = {
    name: str(data.name, 80),
    email: str(data.email, 120).toLowerCase(),
    phone: str(data.phone, 30),
    service: str(data.service, 40),
    frequency: str(data.frequency, 20) || 'not-sure',
    property_type: str(data.property_type, 20) || 'other',
    address: str(data.address, 200),
    city: str(data.city, 80),
    preferred_date: str(data.preferred_date, 60),
    message: str(data.message, 2000),
    consent: ['1', 'true', 'on', 'yes'].includes(String(data.consent ?? '').toLowerCase()),
    honeypot: str(data.company_website, 200),
    ts: Number(data._ts || 0),
    page: str(data._page, 200),
    turnstile: str(data['cf-turnstile-response'], 4000),
  };
  if (d.name.length < 2) errors.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) errors.email = 'Please enter a valid email address.';
  const digits = d.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) errors.phone = 'Please enter a valid phone number.';
  if (!SERVICES.includes(d.service)) errors.service = 'Please choose a service.';
  if (!FREQUENCIES.includes(d.frequency)) errors.frequency = 'Please choose a frequency.';
  if (!PROPERTY_TYPES.includes(d.property_type)) errors.property_type = 'Please choose a property type.';
  if (!d.consent) errors.consent = 'Please agree to the Terms & Conditions and Privacy Policy.';
  const links = (d.message.match(/https?:\/\/|www\./gi) || []).length;
  if (links > 2) errors.message = 'Please remove links from your message.';
  return { d, errors };
}

async function verifyTurnstile(token, secret, ip) {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const j = await r.json().catch(() => ({}));
  return !!j.success;
}

function rateLimited(ip) {
  const now = Date.now();
  const arr = (buckets.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  if (arr.length >= RATE.max) { buckets.set(ip, arr); return true; }
  arr.push(now);
  buckets.set(ip, arr);
  if (buckets.size > 5000) buckets.clear();
  return false;
}

function renderEmail(d, meta) {
  const rows = [
    ['Name', d.name], ['Email', d.email], ['Phone', d.phone],
    ['Service', LABELS.service[d.service]], ['Frequency', LABELS.frequency[d.frequency]], ['Property type', LABELS.property_type[d.property_type]],
    ['Address', d.address], ['City', d.city], ['Preferred date', d.preferred_date], ['Message', d.message],
    ['Submitted from', d.page], ['IP', meta.ip || ''], ['Time', new Date().toISOString()],
  ].filter(([, v]) => v);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111"><h2 style="color:#0B70E0;margin:0 0 12px">New quote request — NSA Cleaning</h2><table cellpadding="6" style="border-collapse:collapse">` +
    rows.map(([k, v]) => `<tr><td style="font-weight:bold;vertical-align:top;border-bottom:1px solid #eee">${esc(k)}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`).join('') +
    `</table><p style="color:#666;font-size:12px">Reply directly to this email to answer the customer.</p></div>`;
  return { text, html, subject: `New quote request: ${LABELS.service[d.service]} — ${d.name.replace(/\s+/g, ' ')}` };
}

async function sendEmail(d, env, meta) {
  const to = String(env.QUOTE_TO_EMAIL || 'Nsacleaningllc@gmail.com').split(',').map((s) => s.trim()).filter(Boolean);
  const { text, html, subject } = renderEmail(d, meta);
  if (env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.QUOTE_FROM_EMAIL || 'NSA Cleaning Website <onboarding@resend.dev>', to, reply_to: d.email, subject, text, html }),
    });
    if (!r.ok) throw new Error(`Resend error ${r.status}: ${(await r.text()).slice(0, 300)}`);
    return 'resend';
  }
  if (env.WEB3FORMS_ACCESS_KEY) {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: env.WEB3FORMS_ACCESS_KEY, subject, from_name: 'NSA Cleaning Website', email: d.email, name: d.name, message: text, replyto: d.email }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.success) throw new Error(`Web3Forms error ${r.status}: ${JSON.stringify(j).slice(0, 300)}`);
    return 'web3forms';
  }
  throw new Error('No email provider configured (set RESEND_API_KEY or WEB3FORMS_ACCESS_KEY)');
}

/**
 * @param {{method:string, headers:Record<string,string|string[]>, ip:string, bodyText:string, env:Record<string,string|undefined>}} input
 * @returns {Promise<{status:number, headers:Record<string,string>, body:string}>}
 */
export async function handleQuote({ method, headers, ip, bodyText, env }) {
  const h = Object.fromEntries(Object.entries(headers || {}).map(([k, v]) => [k.toLowerCase(), Array.isArray(v) ? v[0] : v]));
  const wantsJson = (h.accept || '').includes('application/json') || (h['content-type'] || '').includes('application/json');
  const json = (status, obj) => ({ status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, body: JSON.stringify(obj) });
  const redirect = (to) => ({ status: 303, headers: { location: to, 'cache-control': 'no-store' }, body: '' });
  const fail = (status, obj, to) => (wantsJson ? json(status, obj) : redirect(to || '/contact?error=1#quote'));

  if (method !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

  // Same-origin check (defense in depth; CSP form-action 'self' also applies)
  let origin = h.origin || '';
  if (!origin && h.referer) { try { origin = new URL(h.referer).origin; } catch { origin = ''; } }
  const host = h['x-forwarded-host'] || h.host || '';
  if (origin && host && !origin.endsWith('//' + host)) return json(403, { ok: false, error: 'Cross-origin submissions are not allowed' });

  let data;
  try { data = parseBody(h['content-type'], bodyText); }
  catch (e) { return json(e.status || 400, { ok: false, error: e.message }); }
  const { d, errors } = validate(data);

  // Spam controls: honeypot, time trap, rate limit, Turnstile (when configured)
  if (d.honeypot) return wantsJson ? json(200, { ok: true, redirect: '/thank-you' }) : redirect('/thank-you'); // silently drop bots
  const age = Date.now() - d.ts;
  if (!d.ts || age < 3000 || age > 24 * 3600 * 1000) return fail(400, { ok: false, error: 'Please take a moment to fill out the form, then submit again.' });
  if (ip && rateLimited(ip)) return fail(429, { ok: false, error: 'Too many requests. Please try again later or call us.' });
  if (Object.keys(errors).length) return fail(422, { ok: false, errors });
  if (env.TURNSTILE_SECRET_KEY) {
    if (!d.turnstile || !(await verifyTurnstile(d.turnstile, env.TURNSTILE_SECRET_KEY, ip))) return fail(400, { ok: false, error: 'Verification failed. Please try again.' });
  }

  try {
    const provider = await sendEmail(d, env, { ip });
    console.log(`[quote] delivered via ${provider} (${d.service}, ${d.city || 'no city'})`);
  } catch (e) {
    console.error('[quote] delivery failed:', e.message);
    return fail(502, { ok: false, error: 'We could not send your request right now. Please call (518) 902-1180 or email Nsacleaningllc@gmail.com.' });
  }
  return wantsJson ? json(200, { ok: true, redirect: '/thank-you' }) : redirect('/thank-you');
}
