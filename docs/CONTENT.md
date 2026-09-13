# NSA Cleaning LLC — Site Content Spec (source of truth)

All copy on the site must be consistent with this file. When in doubt, do NOT invent facts.

## 1. Business facts (verified with the client)
- **Legal name:** NSA Cleaning LLC (use exactly this; short form "NSA Cleaning" is fine in prose)
- **Phones:** (518) 902-1180 — primary, show everywhere · (407) 728-0523 — secondary (contact page/footer only)
- **Email:** Nsacleaningllc@gmail.com
- **Address:** 321 25th St, Watervliet, NY 12189
- **Facebook:** https://www.facebook.com/nsacleaning (@nsacleaning). No other social profiles.
- **Owners / contacts:** Ronie Bublak and Alex Bublak. (Photo → name mapping is UNCONFIRMED; see §7.)
- **Service area:** Albany to Lake George, Upstate NY (Capital Region + southern Adirondack corridor). We travel at most ~1 hour from the Watervliet office. Travel is included in the cleaning plan (no travel fees).
  Cities to mention: Albany, Watervliet, Troy, Cohoes, Latham, Colonie, Schenectady, Rensselaer, East Greenbush, Delmar, Guilderland, Clifton Park, Halfmoon, Mechanicville, Ballston Spa, Malta, Saratoga Springs, Wilton, Glens Falls, Queensbury, Lake George.
- **Hours:** Residential service 8:00 AM – 5:00 PM. Commercial service available 24/7.
- **Experience:** 12+ years of cleaning experience; 10 years in business (company founded ~2016).
- **Languages:** English, Portuguese, Spanish ("Hablamos español · Falamos português").
- **Insurance:** Insured. NOT bonded (never say "bonded"). A license is not required for cleaning in NY — never say "licensed".
- **Team:** Certified and trained to NSA standards. Both in-house staff and vetted subcontractors. Gray uniforms.
- **Guarantee:** Satisfaction or your money back (as stated in the service contract) → "Satisfaction guarantee — backed by our service contract".
- **Supplies:** We provide all supplies and equipment unless the client requests otherwise. Pet-/family-friendly ("friendly") supplies available and agreed during the walk-through.
- **Pets:** We prefer pets in a crate or a closed room; friendly pets are fine — we work it out with each client.
- **Damage:** If something is damaged, we cover it; larger items are covered by our insurance.
- **Tips:** Not required. If given, in cash directly to the cleaners.
- **Referral program:** "We offer 50% for referral" — wording to confirm (see §7). Safe phrasing: "Refer a friend and get 50% off — ask us for details."
- **Cancellation:** 24 hours' notice required. Cancellations with less than 24 hours' notice incur a 30% fee.
- **Pricing (recurring residential):** starts at **$160** for apartments and **$195** for houses, depending on size and needs. Everything else: request a free quote — we contact the client (quote via website form; we reply by phone/email).
- **Preferred work (emphasize these):** recurring residential cleaning; offices; clinics; hospitals; painting.

## 2. Services (exact list — do not add services)
Residential:
1. Recurring cleaning — weekly, bi-weekly, monthly
2. Regular cleaning (standard / maintenance clean)
3. Deep cleaning
4. Full deep cleaning (top-to-bottom, most detailed)
5. Move-in / move-out cleaning
6. Airbnb & short-term rental turnover cleaning
7. Post-construction (after construction) cleaning
Exterior / specialty:
8. Deck and siding power washing
9. Carpet shampoo and cleaning (flyer also mentions sofa/upholstery cleaning — OK to mention "upholstery")
10. Painting — residential and commercial
Commercial cleaning for: offices, restaurants, car dealerships, clinics, hospitals, gyms, building common areas.

## 3. Brand
- **Colors:** always blue and gray. Primary blue from the logo ≈ `#0B70E0` (hover/dark `#0757B5`, deep navy `#0A1F44` for headings/dark sections, light tint `#E8F1FD`). Grays: `#111827` text, `#4B5563` secondary text, `#E5E7EB` borders, `#F3F4F6` / `#F8FAFC` section backgrounds. Optional small accent: warm yellow `#F5B400` (present in the logo bucket and flyers) — use sparingly (badges/highlights), never as button color. Do NOT use pink or other hues.
- **Contrast:** all text must meet WCAG AA (≥ 4.5:1 normal, ≥ 3:1 large). White on `#0B70E0` = 4.76:1 (OK for buttons/large). Prefer `#0757B5`/navy for small blue text on white.
- **Logo:** `/images/logo-nsa-cleaning-640.webp` (+ `-320.webp`, `-640.png`) — circular, transparent background. Works on white and on navy.
- **Typography:** Plus Jakarta Sans (self-hosted variable font: `/fonts/PlusJakartaSans-Variable.woff2` 400–800, italic `/fonts/PlusJakartaSans-Italic.woff2`). Fallback: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. Use `font-display: swap`.
- **Tone:** friendly, confident, local, plain English. Short sentences. "We" voice. No hype, no fake numbers.

## 4. Things you must NOT claim
No star ratings, review counts, awards, "#1", "top rated", "licensed", "bonded", "eco-certified", "background-checked", specific number of clients/cleanings, or testimonials with invented names. (If a testimonials section is used, it must be clearly marked as a placeholder the client will fill, e.g. hidden by default — prefer NOT to include one.)

## 5. Pages & SEO targets (slug → primary keyword)
- `/` — "house cleaning services Albany NY" / "cleaning services Albany to Lake George"
- `/residential-cleaning` — "residential cleaning Albany NY" (hub page linking to the 5 residential services)
- `/recurring-cleaning` — "weekly biweekly monthly cleaning service Albany NY"
- `/deep-cleaning` — "deep cleaning service Albany NY" (covers deep + full deep)
- `/move-in-move-out-cleaning` — "move out cleaning Albany NY"
- `/airbnb-cleaning` — "Airbnb cleaning Lake George NY" / "vacation rental turnover cleaning Saratoga"
- `/post-construction-cleaning` — "post construction cleaning Albany NY"
- `/commercial-cleaning` — "commercial cleaning Albany NY", "office cleaning Albany", "medical office cleaning", "restaurant cleaning", "dealership cleaning", "gym cleaning"
- `/services` — all services overview (hub for the "More Services" menu)
- `/power-washing` — "deck and siding power washing Albany NY"
- `/carpet-cleaning` — "carpet shampoo cleaning Albany NY"
- `/painting` — "residential and commercial painting Albany NY"
- `/pricing` — "house cleaning prices Albany NY" (starting prices, what affects price, cancellation policy, referral)
- `/service-area` — "cleaning services Capital Region NY" (city list, map image, 1-hour radius)
- `/about` — company story, team, standards, languages
- `/faq` — FAQPage schema
- `/contact` — quote form + phones + email + address + hours (the ONE conversion page)
- `/thank-you` — noindex, conversion confirmation
- `/privacy-policy`, `/terms-and-conditions` — noindex not needed (index OK), lower priority
- `/404` — custom not-found page (noindex)

Title format: `{Page topic} in Albany, NY | NSA Cleaning LLC` (≤ 60 chars where possible). Meta descriptions 140–160 chars, include a city and a benefit, end with a call to action.

## 6. Conversion
ONE clear primary CTA everywhere: **"Get a Free Quote"** → `/contact#quote` (the home page also embeds the same form in its hero/first section, anchor `#quote`). Secondary CTA: **Call (518) 902-1180** (`tel:+15189021180`). Mobile: sticky bottom bar with Call + Free Quote.
Form fields (names are fixed — the API validates them): `name`*, `email`*, `phone`*, `service`* (values: recurring, regular, deep, full-deep, move, airbnb, post-construction, commercial, power-washing, carpet, painting, other), `frequency` (one-time, weekly, biweekly, monthly, not-sure), `property_type` (apartment, house, office, clinic, restaurant, other), `address`, `city`, `preferred_date`, `message`, `consent`* (checkbox), hidden: `company_website` (honeypot — visually hidden, `tabindex=-1`, `autocomplete=off`), `_ts`, `_page`. Optional Turnstile widget: `<div class="cf-turnstile" data-sitekey="{{site.turnstileSiteKey}}"></div>` only rendered when `site.turnstileSiteKey` is set (`{{#if site.turnstileSiteKey}}`), with `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`.
Each field needs a `<label>`, and an error slot `<p class="field-error" data-error-for="name" hidden></p>`; the form needs `data-quote-form`, `action="/api/quote"`, `method="post"`, and a `<p class="form-status" data-form-status aria-live="polite"></p>`.

## 7. Open questions for the client (do not guess — flagged in README)
1. Which portrait is Ronie and which is Alex, and their titles (Founder / Co-owner?).
2. Referral offer exact terms ("50% for referral" — 50% off next cleaning? for whom?).
3. Residential service days (Mon–Fri? weekends?). Schema currently assumes Mo–Fr 08:00–17:00.
4. Domain: nsacleaningllc.com is available (recommended). nsacleaning.com is taken.
5. "Pink cleaning" / "Delux cleaning and painting" notes were unclear — not used.
6. Google Analytics 4 measurement ID and (optional) Cloudflare Turnstile keys.
