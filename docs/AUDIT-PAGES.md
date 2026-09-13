# Pages audit — final integration (2026-09-13)

Strict build (`node build.mjs`, no `BUILD_TOLERANT`): **21 pages** built to `dist/`.

## Checks

| Check | Result |
|---|---|
| `node build.mjs` (strict) | 21/21 pages, no failures |
| `scripts/check-links.mjs` | No broken internal links across 21 pages |
| `html-validate` (all dist/*.html) | **15 errors before → 0 after** (9 `tel-non-breaking` on privacy/terms/thank-you, 6 `no-inline-style` on about/airbnb/power-washing). No warnings remain. |
| JSON-LD | 37 blocks across 21 pages, all parse, all have `@context` + `@type` (LocalBusiness ×3, BreadcrumbList ×18, Service ×11, FAQPage ×2, AboutPage, ContactPage, ItemList) |
| `dist/sitemap.xml` | 19 URLs, each exactly once; no `/404`, no `/thank-you` |
| `dist/robots.txt` | `Sitemap: https://nsacleaningllc.com/sitemap.xml` present; `Disallow: /thank-you` |
| `dist/404.html` | exists; `<meta name="robots" content="noindex, nofollow">` |
| `/thank-you` | `noindex, nofollow`; BreadcrumbList removed (spec: none on home/404/thank-you) |
| Screenshots | 42 PNGs in `docs/shots/pages/` (`<slug>-desktop.png` 1440 full, `<slug>-mobile.png` 390 full); `horizontalOverflow=false` and zero console errors on every page (404 page logs only its own HTTP 404) |

## Lighthouse (mobile, localhost, served from `dist/`)

| Page | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT | Non-perfect audits |
|---|---|---|---|---|---|---|---|---|
| `/` | 97 | 100 | 100 | 100 | 2.6 s | 0 | 70 ms | largest-contentful-paint (88), unminified-javascript, unused-css-rules, bf-cache, document-latency, forced-reflow, image-delivery |
| `/contact` | 100 | 100 | 100 | 100 | 1.5 s | 0 | 0 ms | unminified-javascript, unused-css-rules, bf-cache, document-latency, image-delivery |
| `/commercial-cleaning` | 100 | 100 | 100 | 100 | 1.7 s | 0 | 10 ms | unminified-javascript, unused-css-rules, bf-cache, document-latency, image-delivery, network-dependency-tree |
| `/pricing` | 100 | 100 | 100 | 100 | 1.6 s | 0 | 0 ms | unminified-javascript, unused-css-rules, bf-cache, document-latency, image-delivery, network-dependency-tree |

The recurring "failing" audits are shared-layout items (unminified `public/main.js`, unused rules in the single `styles.css`, bf-cache/`document-latency` from the local dev server with no caching headers). None are page-level. Home LCP 2.6 s is the hero photo on throttled mobile.

## Titles / descriptions

All titles ≤ 60 chars; all descriptions 148–160 chars.

| path | title len | desc len |
|---|---|---|
| / | 56 | 155 |
| /residential-cleaning | 53 | 156 |
| /recurring-cleaning | 59 | 155 |
| /deep-cleaning | 55 | 158 |
| /move-in-move-out-cleaning | 50 | 157 |
| /airbnb-cleaning | 53 | 155 |
| /post-construction-cleaning | 59 | 157 |
| /commercial-cleaning | 52 | 160 |
| /services | 54 | 155 |
| /power-washing | 60 | 155 |
| /carpet-cleaning | 58 | 149 |
| /painting | 59 | 156 |
| /pricing | 54 | 155 |
| /service-area | 58 | 156 |
| /about | 59 | 157 |
| /faq | 53 | 153 |
| /contact | 53 | 160 |
| /thank-you | 35 | 153 |
| /privacy-policy | 33 | 148 |
| /terms-and-conditions | 37 | 156 |
| /404 | 33 | 156 |

## Fixes applied during integration

- `privacy-policy`, `terms-and-conditions`: tel links now use `{{{site.business.phoneHtml}}}` (non-breaking).
- `thank-you`: "Urgent? Call" made non-breaking inside the tel link; BreadcrumbList schema removed.
- `about`, `airbnb-cleaning`, `power-washing`: inline `style=""` moved into page `<style>` classes (`.about-note`, `.ab-chips`, `.ab-pair`, `.pw-note`).
- `post-construction-cleaning`: "Phase 2 · Final clean" navy card paragraph was dark-on-navy (unreadable); added `.phase-navy h3/p` colors.
- `privacy-policy`: "What we store" table overflowed at 390px because of the unbreakable `nsa_cookie_consent` token; `<wbr>` added and `code` allowed to wrap.

## Word counts (main content, built HTML)

| Page | Words | Guideline |
|---|---|---|
| /residential-cleaning | 843 | 350–700 (hub page) |
| /recurring-cleaning | 1074 | over |
| /deep-cleaning | 1171 | over |
| /move-in-move-out-cleaning | 1219 | over |
| /airbnb-cleaning | 836 | over |
| /post-construction-cleaning | 933 | over |
| /commercial-cleaning | 1108 | over |
| /power-washing | 805 | over |
| /carpet-cleaning | 800 | over |
| /painting | 791 | over |
| /services, /about, /faq, /contact, /service-area | 630–754 | in range / n.a. |

## Remaining items (not changed; decide with client)

1. **Word counts above the 350–700 guideline** on every service page (see table). Reviewers confirmed no duplicate or filler content; trimming would remove real checklist/policy detail. Largest: move-in/move-out (1219), deep-cleaning (1171), commercial (1108, facility-scope sections could be cut), recurring (1074).
2. **`/service-area` zone descriptions** ("Airbnb turnovers are the big one" in Lake George/Queensbury, "rental turnovers around the racing season" in Saratoga, "about 20–45 minutes" to the Northway corridor, "up to about 1 hour" to Glens Falls) are unverified characterizations — confirm with the client or soften.
3. **Full-page capture artifacts (not bugs):** fixed elements (cookie banner, mobile sticky CTA bar) are painted over the hero at their viewport position in `--full` captures; some lazy images occasionally paint late (airbnb gallery, service-area map showed blank once and rendered on re-capture; files exist and serve 200). Viewport captures are clean.
4. **Lighthouse shared-layout items** (unminified `main.js`, unused CSS, bf-cache) live in frozen files (`public/main.js`, `src/styles.css`, server headers) — out of scope for page work.
5. `/privacy-policy` and `/terms-and-conditions` are indexable (`index, follow`) and in the sitemap; fine, but flagging in case legal pages should be `noindex`.
