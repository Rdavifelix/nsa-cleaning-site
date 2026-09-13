// Full-page screenshots with the system Chrome via puppeteer-core.
// Usage: node scripts/shot.mjs <url> <out.png> [--width 1440] [--mobile] [--full] [--height 900] [--dpr 1|2]
import puppeteer from 'puppeteer-core';
const args = process.argv.slice(2);
const url = args[0], out = args[1];
const opt = (k, dflt) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : dflt; };
const mobile = args.includes('--mobile');
const full = args.includes('--full');
const width = Number(opt('--width', mobile ? 390 : 1440));
const height = Number(opt('--height', mobile ? 844 : 900));
// full-page captures use DPR 1 by default: Chrome drops image tiles on very tall high-DPR captures
const dpr = Number(opt('--dpr', mobile && !full ? 2 : 1));
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
if (mobile) await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
if (full) {
  // force lazy images to load, then wait for every image to finish (max 12s) so full-page captures show real photos
  await page.evaluate(() => { document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; }); window.scrollTo(0, document.documentElement.scrollHeight); });
  await page.evaluate(() => Promise.race([
    Promise.all(Array.from(document.images).map((i) => i.complete ? Promise.resolve() : new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }))),
    new Promise((r) => setTimeout(r, 12000)),
  ]));
  await page.evaluate(() => window.scrollTo(0, 0));
  try { await page.waitForNetworkIdle({ idleTime: 400, timeout: 8000 }); } catch {}
}
await new Promise((r) => setTimeout(r, 300));
const overflow = await page.evaluate(() => ({ docW: document.documentElement.scrollWidth, winW: window.innerWidth, docH: document.documentElement.scrollHeight }));
await page.screenshot({ path: out, fullPage: full });
await browser.close();
console.log(JSON.stringify({ out, width, height, full, ...overflow, horizontalOverflow: overflow.docW > overflow.winW, errors }));
