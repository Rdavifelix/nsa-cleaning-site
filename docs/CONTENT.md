# NSA Cleaning LLC — Site Content Spec (source of truth)

All copy on the site must be consistent with this file. When in doubt, do NOT invent facts.

## 1. Business facts (verified with the client)
- **Legal name:** NSA Cleaning LLC (use exactly this; short form "NSA Cleaning" is fine in prose)
- **Phone:** (407) 728-0523, the only number, everywhere. Same as the Google Business Profile, which was verified with it. (516) 440-3731 was the main line from 2026-10-13 to 2026-10-26 and is no longer published; (518) 902-1180 before that.
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
- **Typography:** Libre Franklin (self-hosted variable font: `/fonts/LibreFranklin-Variable.woff2`, weights 100–900). Fallback: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. Use `font-display: swap`. Chosen over Plus Jakarta Sans because the geometric-grotesque families (Jakarta, Inter, Manrope, Figtree, Outfit) read as a generated template; Franklin Gothic bones suit a local trades business.
- **Shape:** the design is deliberately square. Radius tokens are 2/3/4px. No pills and no circles at all: the only circle on the site is the logo image. Run `node build.mjs` and check for radius warnings.
- **Punctuation:** no em-dashes (—), no exclamation marks, no rhetorical-question headings. Split the sentence or use a comma. Run `npm run lint:copy`.
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
- `/contact` — chat + phones + email + address + hours (the ONE conversion page)
- `/privacy-policy`, `/terms-and-conditions` — noindex not needed (index OK), lower priority
- `/404` — custom not-found page (noindex)

Title format: `{Page topic} in Albany, NY | NSA Cleaning LLC` (≤ 60 chars where possible). Meta descriptions 140–160 chars, include a city and a benefit, end with a call to action.

## 6. Conversion

> **Update 2026-10-08:** the site has no forms. The GoHighLevel modal form and the native form (with `/api/quote`) were removed; the **GoHighLevel chat widget** is the only opt-in. Every "Get a Free Quote" button opens the chat (`data-quote-open`, see README → *Lead capture*).

ONE clear primary CTA everywhere: **"Get a Free Quote"** → opens the chat widget (falls back to `/contact`). Secondary CTA: **Call (407) 728-0523** (`tel:+14077280523`). Mobile: sticky bottom bar with Call + Free Quote; the chat bubble sits above it.
Copy: say "send us a message" / "the chat", never "the form".

## 7. Open questions for the client (do not guess — flagged in README)
1. ~~Which portrait is Ronie and which is Alex~~ — **resolved 2026-09-13**: the studio portrait in the dark suit is **Ronie Bublak**; the portrait in the burgundy shirt in front of a bookshelf is **Alex Bublak**. Both are labelled "Co-owner" on /about. The third portrait (seated outdoors) was removed at the client's request. Confirm their exact job titles if they want something other than "Co-owner".
2. Referral offer exact terms ("50% for referral" — 50% off next cleaning? for whom?).
3. Residential service days: **answered 2026-10-29: residential cleaning also runs Saturday and Sunday.** Still open: are weekend hours the same 8:00 AM – 5:00 PM? Until confirmed, the schema keeps Mo–Fr 08:00–17:00 and the Google profile keeps its hours (profile edits wait until 2026-11-29).
4. Domain: nsacleaningllc.com is available (recommended). nsacleaning.com is taken.
5. "Pink cleaning" / "Delux cleaning and painting" notes were unclear — not used.
6. Google Analytics 4 measurement ID.
