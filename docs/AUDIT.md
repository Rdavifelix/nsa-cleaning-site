# NSA Cleaning LLC — Launch audit report

Date: 2026-09-13 · Build: `node build.mjs` (21 pages, GA off, Turnstile off) · Served from `dist/` on localhost:4950 for all measurements.

## 1. Summary

A full audit of the static site ran across eight lenses (SEO, accessibility, performance, content accuracy vs `docs/CONTENT.md`, security/API, visual/layout, copy quality ("slop"), links/assets). Two independent skeptics reviewed every finding before it was fixed.

| | Count |
|---|---|
| Findings raised | 93 distinct (80 fixed + 4 not applied + 9 refuted) |
| Confirmed and fixed | 80 (all re-verified in this pass, see §4) |
| Fixed partially / left open with a reason | 8 (see §5) |
| Refuted (considered, not a defect) | 9 (see §6) |
| Pages audited | 21 (19 indexable + /thank-you + /404) |
| Lighthouse runs | 21 mobile + 2 desktop (re-run on the 6 pages touched in this pass) |
| Screenshots | 42 in `docs/shots/final/` (every page at 390 and 1440, full page) |

Final state: build, link check, HTML validation, JSON-LD parsing and the API test-suite all pass; no page overflows horizontally at 320, 390 or 1440; no console errors; Lighthouse mobile is 97–100 performance and 100/100/100 for accessibility, best practices and SEO on every indexable page.

Eight small leftovers from the fix round (text-only, marked "closed in this pass" in §4) were applied during re-verification: breadcrumb label on /services, three photo-tile kickers on /services and /residential-cleaning, "end-of-month slots fill first", "On most projects we come twice", the "same day the movers leave" FAQ (forbidden phrase), the /faq section heading, "written scope" on /commercial-cleaning, and three orphaned image renditions (91 KB) were deleted from `public/images/`.

## 2. Lighthouse

Lighthouse (project devDependency) via `scripts/lighthouse.sh`, headless Chrome, default mobile throttling (desktop preset for the two desktop rows). Scores are single runs; performance varies ±2 between runs.

| Preset | Path | Perf | A11y | BP | SEO | LCP | CLS | TBT | Weight | Audits <90 |
|---|---|---|---|---|---|---|---|---|---|---|
| mobile | / | 97 | 100 | 100 | 100 | 2.5 s | 0 | 50 ms | 299 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight forced-reflow-insight image-delivery-insight network-dependency-tree-insight |
| mobile | /residential-cleaning | 99 | 100 | 100 | 100 | 2.2 s | 0 | 0 ms | 322 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /recurring-cleaning | 100 | 100 | 100 | 100 | 1.8 s | 0 | 0 ms | 145 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /deep-cleaning | 99 | 100 | 100 | 100 | 1.9 s | 0 | 0 ms | 153 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /move-in-move-out-cleaning | 100 | 100 | 100 | 100 | 1.8 s | 0 | 0 ms | 146 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /airbnb-cleaning | 100 | 100 | 100 | 100 | 1.9 s | 0 | 0 ms | 148 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /post-construction-cleaning | 99 | 100 | 100 | 100 | 1.9 s | 0 | 0 ms | 166 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /commercial-cleaning | 100 | 100 | 100 | 100 | 1.7 s | 0 | 0 ms | 142 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight network-dependency-tree-insight |
| mobile | /services | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 ms | 361 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /power-washing | 99 | 100 | 100 | 100 | 2.2 s | 0 | 0 ms | 379 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight network-dependency-tree-insight |
| mobile | /carpet-cleaning | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 ms | 180 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight network-dependency-tree-insight |
| mobile | /painting | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 ms | 207 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /pricing | 100 | 100 | 100 | 100 | 1.6 s | 0 | 0 ms | 105 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /service-area | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 ms | 194 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /about | 99 | 100 | 100 | 100 | 1.8 s | 0 | 0 ms | 224 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight network-dependency-tree-insight |
| mobile | /faq | 100 | 100 | 100 | 100 | 1.5 s | 0 | 0 ms | 116 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /contact | 100 | 100 | 100 | 100 | 1.4 s | 0 | 0 ms | 200 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight |
| mobile | /thank-you | 100 | 100 | 100 | 69 | 1.6 s | 0 | 0 ms | 105 KB | unminified-javascript unused-css-rules is-crawlable bf-cache document-latency-insight image-delivery-insight network-dependency-tree-insight |
| mobile | /privacy-policy | 100 | 100 | 100 | 100 | 1.5 s | 0 | 0 ms | 101 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight network-dependency-tree-insight |
| mobile | /terms-and-conditions | 100 | 100 | 100 | 100 | 1.5 s | 0 | 0 ms | 103 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight network-dependency-tree-insight |
| mobile | /404 | 100 | 100 | 100 | 69 | 1.5 s | 0 | 0 ms | 104 KB | unminified-javascript unused-css-rules is-crawlable bf-cache document-latency-insight image-delivery-insight network-dependency-tree-insight |
| desktop | / | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | 411 KB | unminified-javascript bf-cache document-latency-insight image-delivery-insight |
| desktop | /contact | 100 | 100 | 100 | 100 | 0.4 s | 0 | 0 ms | 200 KB | unminified-javascript unused-css-rules bf-cache document-latency-insight image-delivery-insight network-dependency-tree-insight |

MOBILE min/median: performance 97/100 · accessibility 100/100 · best-practices 100/100 · seo 69/100 n= 21

Notes on the remaining "audits < 90":
- `is-crawlable` on /thank-you and /404 is intentional: both carry `<meta name="robots" content="noindex, nofollow">` and are not in the sitemap (SEO 69 on those two pages is expected).
- `unminified-javascript`: `main.js` is 10 KB unminified (about 4 KB gzipped). A build-time minifier was considered and not added — no zero-dependency minifier can be guaranteed not to break the script, and the saving is ~5 KB on one cached file. Left as is (known open item 6).
- `unused-css-rules`: the site inlines one shared stylesheet in every page; the "unused" part is the CSS for components that page does not use. Splitting per page would add build complexity for a ~10 KB gain.
- `bf-cache`, `document-latency-insight`, `image-delivery-insight`, `network-dependency-tree-insight`, `forced-reflow-insight`: informational insights from the local server (no compression, no cache headers on HTML); Vercel adds Brotli and the `vercel.json` cache headers in production.

## 3. Checks matrix

| Check | Result | Evidence |
|---|---|---|
| `node build.mjs` (strict) | PASS | 21 pages built, no warnings |
| `node scripts/check-links.mjs` | PASS | "No broken internal links across 21 pages" |
| `node scripts/test-api.mjs` | PASS | All API tests pass (validation, CR normalisation, Vercel pre-parsed form body → 303, JSON → 422, link spam, 413, Turnstile required when secret set) |
| html-validate on every `dist/**/*.html` | PASS | 0 errors on 21 files (html-validate 11.15) |
| JSON-LD | PASS | 37 blocks, 0 parse errors; every Service on a service page carries an inline LocalBusiness provider; LocalBusiness on /, /contact, /service-area; FAQPage on /faq and /pricing (no duplicated questions); BreadcrumbList on 20 pages with one label for /services |
| Sitemap | PASS | 19 `<loc>` entries = the 19 indexable pages; /thank-you and /404 excluded |
| robots.txt | PASS | `Allow: /`, `Disallow: /api/`, sitemap URL; no longer blocks /thank-you so its noindex is readable |
| 404 | PASS | `dist/404.html` built with noindex, own title, no console errors, no overflow |
| noindex | PASS | Only /thank-you and /404 carry `noindex, nofollow`; no HTML page links to /thank-you (JS redirect only) |
| Canonicals | PASS | 20 pages with one canonical each, no duplicates; og:type `website` on all pages |
| Titles / descriptions | PASS | Titles 59–64 chars ending "| NSA Cleaning LLC"; descriptions 144–162 chars |
| Security headers (`vercel.json`) | PASS (config) | HSTS preload, CSP (self + GTM/GA + Turnstile only), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP; cache rules for /images, /fonts and root icons no longer overlap; `/api/*` no-store. Headers only take effect on Vercel — confirm with `curl -I` after the first deploy. |
| Consent / analytics | PASS | With no GA id the cookie banner and the footer "Cookie settings" button are not rendered at all; with a GA id, decline unloads GA (`ga-disable-<id>`, consent update, `_ga*` cookies expired on host and apex) |
| Reflow at 320 px | PASS | nav toggle, sticky CTA, hero column and commercial CTA row all end at x=304 (no overflow) on /, /about, /contact, /commercial-cleaning |
| Mobile menu focus | PASS | With the menu open `main`, `footer`, topbar and sticky bar are `inert`; 40 Tabs stay inside the header; Escape closes and returns focus to the menu button |
| Horizontal overflow / console errors | PASS | 0 pages with overflow, 0 console or page errors at 390 and 1440 (the `requestfailed` lines in the shot log are 480w srcset candidates aborted by Chrome when the full-page capture forces the larger rendition; all four files return 200) |
| Orphaned assets | PASS | 0 unreferenced files in `dist/images` (72 renditions, 3.6 MB); `manifest.json`, the 640 px logo WebP and the italic font are no longer shipped |
| Radius tokens | PASS | No `border-radius` of 999px / 12px / ≥16px anywhere in `src/` |
| Forbidden claims (`docs/DESIGN.md` §4) | PASS | No ratings, counts, awards, "licensed", "bonded", "same-day", residential "24/7", "free travel anywhere", or owner-to-photo naming |

## 4. Fixed findings (re-verified)

Each was re-checked by reproducing the original evidence (grep on `src/`, DOM measurement in headless Chrome at 320/390/768/1440, or the tool that raised it).

SEO
- seo-1 — /pricing FAQPage schema now only carries the two pricing-specific questions; cancellation/tips marked up on /faq only. Verified.
- seo-2 — /service-area zone copy reduced to city lists, "Home base / I-87 north / Up to about 1 hour from Watervliet", travel included. Verified (no "20–45", "racing", "most of our").
- seo-4 — /recurring-cleaning title is "Weekly & Bi-weekly Cleaning in Albany, NY | NSA Cleaning LLC". Verified.
- seo-5 — Service.provider is an inline LocalBusiness on all 10 service pages. Verified.
- seo-6 — og:type is `website` on all 21 pages. Verified.
- seo-7 — robots.txt no longer disallows /thank-you. Verified.
- seo-8 — /services breadcrumb node named "Services" on all four pages (services.html closed in this pass). Verified.

Accessibility
- a11y-1 — Cookie banner not rendered without a GA id; `role="region"`; `inert` while the menu is open. Verified (no `[data-cookie-banner]` in dist).
- a11y-2 — Photo-tile scrim now 0.1 → 0.65 at 35% → 0.95; kicker removed from photo tiles. Verified on /, and in this pass on /services and /residential-cleaning.
- a11y-3 — Menu open sets `inert` outside the header; Escape/click returns focus to the button. Verified in-browser.
- a11y-4 — `.field,.field>*{min-width:0}` and a `max-width:359px` rule (icon button hidden, buttons wrap). Verified at 320 px.
- a11y-7 — /faq topic chips 44 px tall, `var(--r)` radius. Verified (7 × 44 px).
- a11y-8 — Footer "Cookie settings" is a `<button>` rendered only when GA is configured. Verified.

Performance
- perf-1 — Logo served as 96/144 px WebP (6.8/12.3 KB) with srcset in header and footer. Verified.
- perf-2 — Exterior photos re-encoded at q70 (hero 800w 112 → 82 KB, stairs 480w 71 → 55 KB). Verified.
- perf-3 — Owner portraits have a 640w rendition and tightened `sizes`. Verified.
- perf-5 — `vercel.json` root-asset cache rule excludes /images and /fonts. Verified.
- perf-6 — manifest.json, logo-640.webp and the italic font are no longer in dist. Verified.

Content accuracy
- content-1 — No "same-day" promise on /airbnb-cleaning (and, in this pass, the move-in FAQ). Verified.
- content-2 — /service-area invented local facts removed. Verified.
- content-3 — Banner only when analytics is configured. Verified.
- content-4 — Tub pair captioned "deep cleaning" on the move-out page; post-construction gallery reduced to the two painting-prep photos with a neutral caption. Verified. The residential alt "after a move-out cleaning" (see §5) is left.
- content-5 — No "most popular / most requested / most clients" claims. Verified (only "Most of our week is recurring residential" on /about, which CONTENT.md supports).
- content-6 — Recurring meta/hero no longer promise the same team; "where possible" wording kept. Verified.
- content-7 — No damage/supply "report" feature on /airbnb-cleaning. Verified.
- content-8 — Home plan cards replaced by the price box + one line to /pricing. Verified.
- content-9 — Deep-cleaning duration estimates removed; "end-of-month slots fill first" and "On most projects we come twice" closed in this pass. Verified.
- content-10 — "Written scope / in writing" promises removed from pricing and about; /commercial-cleaning closed in this pass ("walk-through and a free quote"). The home H2 "standards in writing" stays (refers to the service contract, CONTENT.md-backed).
- content-11 — /airbnb-cleaning local-color heading/paragraph reduced to the city list and one-hour range. Verified.
- content-14 — Submit button "Get a Free Quote"; success text "reply by phone or email during business hours". Verified.
- content-17 — Terms §5 charges the fee for cancellations only; the unpaid-invoice pause clause is gone. Verified.

Security / API
- security-1 — Adapter re-serialises Vercel-parsed urlencoded bodies; `<noscript>` fallback in the form; covered by tests. Verified.
- security-2 — Decline after accept disables GA and expires `_ga*` cookies. Verified.
- security-3 — CR normalised, control chars stripped, single-line subject; tests added. Verified.
- security-4 — README states the Turnstile keys must be set together and redeployed. Verified.

Visual
- visual-1 — Banner not rendered (GA off); when enabled it is a compact strip that hides the sticky bar. Verified.
- visual-2 — See a11y-2. Verified.
- visual-3 — `.why-item:last-child:nth-child(odd)` spans only when alone; home rows are 2,2,2,1. Verified.
- visual-4 — Deep-cleaning levels stack 1-2-3 at 600–999 px. Verified at 768.
- visual-5 — /faq accordion capped at 76ch (946 px at 1440). Verified; the `.plans-note` and move-in `.steps` parts are open (§5).
- visual-7 — Hero grid rows `auto 1fr`; aside starts 48 px under the CTAs (was 182 px). Verified.
- visual-9 — Moot: the commercial `.facilities` chip grid was deleted under slop-10; the home grid is single-column below 600 px. Verified.
- visual-10 — All inline radii use tokens. Verified.
- visual-11 — /contact form column is `position: sticky`. Verified.

Copy quality
- slop-1 — /service-area zones rewritten as one factual sentence each. Verified.
- slop-2 — Popularity claims removed site-wide. Verified.
- slop-3 — CTA-band "Ready for…?" headings rewritten as statements; the three functional section headings (deep, recurring, service-area) were kept on the skeptics' advice. Verified.
- slop-4 — Duplicate trust lists removed from /services and the residential why-card; recurring keeps one policy list. Verified.
- slop-5 — Home hero: quote-trust line, $0 highlight and "No travel fees" removed; chips trimmed. Verified.
- slop-7 — Photo-tile kickers removed on / (and /services, /residential-cleaning in this pass; "Regular · Deep · Full deep" kept as informational). Verified.
- slop-8 — See a11y-1. Verified.
- slop-10 — /commercial-cleaning badge and facilities chip grid deleted; "24/7" down to 3 mentions (meta, hero note, FAQ). Verified.
- slop-11 — "Insured & uniformed team" removed from the home facilities grid (7 items). Verified.
- slop-12 — All four `.why-card` chip rows deleted. Verified.
- slop-13 — /about "Values" section deleted. Verified.
- slop-14 — /about H2s rewritten without trailing periods (faq heading closed in this pass). Verified.
- slop-15 — /services eyebrow and duplicate tiles removed. Verified.
- slop-16 — /carpet-cleaning Airbnb-bedroom gallery and the policy item removed. Verified.
- slop-17 — /pricing plan cards deleted; link to /recurring-cleaning kept. Verified.
- slop-18 — /pricing FAQ duplicates and the #how section removed. Verified.
- slop-19 — Recurring page repeats trimmed (policy once, supplies/travel in hero note + price note only). Verified.
- slop-20 — /deep-cleaning #bring section deleted, levels intro rewritten, damage line folded into the guarantee bullet. Verified.
- slop-21 — Move-in checklist tiles use room names as headings; duplicate access FAQ and walk-through sentence removed. Verified.
- slop-22 — /airbnb-cleaning chip row and local color removed. Verified.
- slop-23 — Post-construction rhetorical opener removed; gallery reduced to the two on-topic photos. Verified.
- slop-24 — "Real client photos" kept only in before/after captions. Verified.
- slop-25 — Power-washing no longer sells exterior painting as a scheduled combo. Verified.
- slop-26 — "brought back to life" / "for a fresher home" / "Anything else? Just ask" removed. Verified.
- slop-28 — Double em-dash paragraph on /pricing and the recurring plan bullets rewritten. Verified.
- slop-29 — The three radial-gradient glows removed from styles.css. Verified.
- slop-30 — Per-zone city chips and the #work tile grid removed from /service-area. Verified.
- slop-31 — /pricing H1 "House Cleaning Prices in Albany, NY"; filler in the factors grid removed. Verified.
- slop-32 — /faq "five minutes" and cross-link tails removed. Verified.
- slop-33 — One shared caption "Ronie Bublak and Alex Bublak, owners" under both portraits. Verified.
- slop-34 — /contact "Before you send" section removed. Verified.

Links / assets
- links-1 — `manifest.json` no longer served. Verified.
- links-2 — Orphaned renditions removed (3 more removed in this pass). Verified: 0 orphans.
- links-3 — See a11y-8. Verified.
- links-4 — /contact CTA band no longer links to itself. Verified.
- links-5 — See visual-10. Verified.

## 5. Open / partially applied items

| Item | State | Reason |
|---|---|---|
| visual-5 (`.plans-note` 1176 px at 1440, move-in `.steps` single column 1092 px) | Partially applied after the audit: `.plans-note{max-width:70ch}` added; the move-in list stays single-column | Requires a change to the shared `src/styles.css` (`.plans-note{max-width:70ch}`) and a two-column rule for the move-in list; both were frozen during the fix round. Cosmetic; two lines of CSS if the client wants it. |
| perf-4 (no 480w service-area map) | Open | Needs a new rendition through `scripts/optimize-images.py` (raw-images/manifest.json) plus two srcset edits. Saves ~55 KB on 1x desktop only; the map is lazy-loaded on /contact. |
| slop-9 (business-type chips on /services, pressure chip on /power-washing) | Open (radius fixed) | Radii now use tokens; deleting the chip list and folding the types into a sentence is a content restructure the skeptics did not require. |
| content-4 (residential-cleaning.html:63 alt "after a move-out cleaning") | Applied after the audit (alt now "after cleaning") | Alt text only; the same photo is captioned "after cleaning" elsewhere. One-word change if the client wants full consistency. |
| content-8 (service-page policy/FAQ pruning) | Not applied | Skeptics judged that part overreaching: each landing page keeps one policy line and page-specific FAQs. |
| a11y-5 (input border 1.47:1) | Not applied | Not an AA failure — every field has a visible bold label (WCAG 1.4.11 exempts the boundary) and focus/error borders exceed 3:1. Darkening the border would override the `--line` tokens. |
| visual-8 (empty area in tall bento tiles) | Not applied | Comes from grid row-stretch; top-aligning only moves the void below the text and breaks the shared tile convention. Taste call. |
| Known open item 6 (main.js unminified) | Not applied | 10 KB file, ~4 KB over the wire; no safe zero-dependency minifier. |
| Word counts | Done | Service pages now 747–1,158 words (move-in 1,158, commercial 1,057, deep 981, post-construction 908, recurring 898, residential 820, painting 780, airbnb 758, power-washing 747, carpet 729); the remaining length is checklists and policies, not boilerplate. |

## 6. Refuted findings (considered, not changed)

- seo-3 — "restaurant cleaning" / "dealership cleaning" not present verbatim on /commercial-cleaning: the page targets "commercial cleaning Albany NY", the facility sections are named by facility type and the meta description lists restaurant and dealership cleaning; refuted as keyword-stuffing.
- a11y-6 — CTA-band meta text (`--tint-2` on the blue→navy gradient) possibly below 4.5:1 at the gradient's --blue end: refuted in the skeptic round, left unchanged. If the client wants extra margin the fix is one token (`.cta-meta{color:#fff}`).
- content-12 — Ribbon icon (`#i-award`) on the "Satisfaction guarantee" item on / and /about: a generic badge glyph with no award wording anywhere on the site; refuted, left unchanged.
- content-13 — Titles over 60 chars: four titles are 62–64 chars including the mandatory "| NSA Cleaning LLC" suffix; shortening would drop the keyword or the brand.
- content-15 — Privacy-policy wording on Turnstile and the email provider: the policy now says Turnstile "may process your IP address and some browser information" (no puzzle claim) and names "Resend or Web3Forms" because either can be configured per the README; refuted as a nit.
- content-16 — "10 years in business, since 2016" / "12+ years": the values are single config fields in `site.config.json` (`yearsInBusiness`, `yearsExperience`, `foundingYear`), correct for 2026 and CONTENT.md-backed; refuted, with a January review item in the launch checklist.
- visual-6 — Text below 14 px: the 13 px / 12 px instances are top-bar links, chips, captions, kickers and form fine print, not running body text (body is 17 px); WCAG AA sets no minimum size; refuted, left unchanged.
- slop-6 — Home stats strip (12+ years experience, 10 years in business since 2016, 3 languages, 1 hr max travel): all four are CONTENT.md facts and the two year figures describe different things (experience predates the company); refuted, left unchanged.
- slop-27 — "Whether it's … or …" constructions and the /services hub repeating the home how-it-works steps: refuted in the skeptic round (one sentence each, on landing pages read in isolation); the /pricing copy of the steps was removed separately under slop-18.

## 7. Before launch — client checklist

1. Domain: buy/point `nsacleaningllc.com` (CONTENT.md §7.4) to Vercel; set `SITE_URL=https://nsacleaningllc.com` in Vercel env and redeploy so canonicals, sitemap and OG URLs match. Add the `www` redirect in Vercel domain settings.
2. Env vars (Vercel → Settings → Environment Variables): `SITE_URL`, `QUOTE_TO_EMAIL` (default Nsacleaningllc@gmail.com), one email provider (`RESEND_API_KEY` + `QUOTE_FROM_EMAIL` on a verified domain, or `WEB3FORMS_ACCESS_KEY`), then send one real test quote from the live form and confirm the email arrives.
3. Google Analytics 4: create the property, set `GA_MEASUREMENT_ID` (G-…), redeploy. Only then does the cookie banner and the footer "Cookie settings" button appear.
4. Cloudflare Turnstile (optional spam protection): create a widget for the domain and set `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` together, then redeploy.
5. After the first deploy: `curl -I https://nsacleaningllc.com/` and confirm the HSTS, CSP and X-Frame-Options headers are present; open /thank-you and /404 to confirm they render.
6. Google Search Console: verify the domain, submit `https://nsacleaningllc.com/sitemap.xml`, and check that /thank-you and /404 are excluded (noindex).
7. Google Business Profile: claim/update the listing with the same name, phone (518) 902-1180, address 321 25th St, Watervliet NY, hours (Residential 8:00 AM – 5:00 PM, Commercial 24/7) and website URL so NAP matches the LocalBusiness schema.
8. Attorney review of `/privacy-policy` and `/terms-and-conditions` (cancellation fee, guarantee, damage coverage, referral terms) before they go live; update the "last updated" dates.
9. Confirm the portraits: which photo is Ronie and which is Alex, and their titles — then replace the shared caption on /about with per-card names.
10. Referral terms: confirm what "50% for referral" means (50% off the referrer's next cleaning?) — the site currently says "Refer a friend and get 50% off — ask us for details" on /pricing, /recurring-cleaning and /faq.
11. Residential service days: schema and copy assume Monday–Friday 8:00 AM – 5:00 PM; confirm whether weekends are offered.
12. Review the year-based claims ("10 years in business, since 2016", "12+ years of experience") each January.
13. Facebook: confirm the page handle `@nsacleaning` linked from /contact and the footer.
14. Optional: add the 480w map rendition and the two CSS caps listed in §5 if the client wants them.

Files: report `docs/AUDIT.md` · screenshots `docs/shots/final/*-390.png`, `*-1440.png` · Lighthouse JSON/HTML in the session scratchpad (`lh/m-*.report.html`, `lh/d-*.report.html`).
