# NSA Cleaning LLC — Local SEO plan and record

Started 2026-10-26, when Ronie signed the "Google SEO - Trench OPS" plan. Same method as the
New Horizon site (`~/new-horizon-site`), adapted to a cleaning business. This file is the record:
what the research showed, what was built, what was decided and why, and what is still open.

---

## 1. Where it stood on 2026-10-26

| Item | State |
|---|---|
| Live site | `https://lp.nsacleaningllc.com/`, served from `Rdavifelix/nsa-cleaning-site` → `gh-pages` |
| Root domain `nsacleaningllc.com` | **Not the site.** It serves a GoHighLevel review funnel ("How would you rate our work? 1–5 stars"), with no title and no H1. `www` is a CNAME to GHL's site host. DNS is on Cloudflare. |
| Google Business Profile | Name NSA Cleaning LLC, **category "Cleaners"** (the generic one), website `lp.nsacleaningllc.com`, phone **(407) 728-0523**, 5.0 from **3 reviews**, hours Mon–Fri 8–5 and "Open 24 hours" Sat–Sun. CID `12610868214912534386`. |
| Canonicals | **Every page pointed at a URL that 301s** (`/about` → `/about/` on GitHub Pages). |
| Schema | Domain hardcoded in 18 pages' front matter. No map, no service catalog. |
| City pages | None. The service-area page listed 21 cities as plain text. |
| Search Console | Not verified for `lp.nsacleaningllc.com` (no verification tag on the site). |

## 2. Keyword research (Google Ads Keyword Planner, Albany-Schenectady-Troy DMA, Oct 2025–Sep 2026)

Monthly searches, ranges (the account used has no spend, so Google shows ranges, not exact counts).

| Volume | Keywords |
|---|---|
| 1K–10K | carpet cleaning (high competition, national chains) |
| 100–1K | house cleaning · house cleaning services · house cleaning near me · cleaning services · cleaning services near me · maid service near me |
| 10–100 | maid service, cleaning company, home cleaning, residential cleaning, deep cleaning (services), move out / move in cleaning, commercial cleaning, office cleaning, janitorial services, airbnb cleaning, post construction cleaning, power washing, house washing, house painting, apartment cleaning, recurring / weekly / biweekly cleaning, house cleaning cost / prices, medical office cleaning |

By city:

| Volume | Keywords |
|---|---|
| 100–1K | cleaning services albany · cleaning services schenectady |
| 10–100 | house cleaning albany, troy, schenectady, clifton park, saratoga springs, glens falls, queensbury, latham, ballston spa, mechanicville, lake george · cleaning services clifton park, glens falls, saratoga springs, troy · commercial / office cleaning albany |
| 0–10 | malta, wilton, and the small towns near the office |

Two things stand out. **"Near me" searches are as big as the city searches**, and those are decided
by the Google Business Profile and proximity, not by the site. And **commercial cleaning has little
volume but a top-of-page bid up to R$1,374**: a commercial contract is worth a lot, and offices,
clinics and hospitals are the work Ronie prefers (CONTENT.md §1).

Autocomplete also surfaced competitor brand searches: "pink cleaning", "acts cleaning", "maid spotless".

### Keywords to track (decided 2026-10-29)

Focus: **house cleaning**, then **commercial cleaning**. Two different tools, two different keyword
forms.

**Local Dominator geogrid (Google Maps), no city in the keyword**: the grid point supplies the location.
9x9 circular grid (64 points), 1.5 mi spacing, centered on the profile pin in Watervliet, weekly.

| # | Keyword | Why |
|---|---|---|
| 1 | house cleaning service | Exact name of the primary category; the head term |
| 2 | house cleaning near me | The most typed form (100–1K/mo in the DMA) |
| 3 | maid service | 100–1K "near me"; a different pack (franchises like The Maids, Molly Maid) |
| 4 | cleaning service | 100–1K; broad, the pack mixes residential and commercial |
| 5 | deep cleaning service | Highest-intent residential job |
| 6 | commercial cleaning service | Second service |
| 7 | office cleaning service | The commercial query with the clearest buyer |

About 1,800 credits a month (7 × 64 × 4). The profile was reinstated on 2026-10-29, so the grid can
run now; the first scan is the baseline.

**Local Dominator SERP Tracker (organic), with "ny" in the keyword** ("albany" alone pulls Albany GA,
OR and WA in autocomplete). These measure the site, so they work now.

| Keyword | Page that should rank |
|---|---|
| house cleaning albany ny | `/` |
| cleaning services albany ny | `/` (100–1K, the biggest city query) |
| maid service albany ny | `/` |
| house cleaning schenectady ny | `/house-cleaning-schenectady-ny/` (cleaning services schenectady: 100–1K) |
| house cleaning troy ny | `/house-cleaning-troy-ny/` |
| house cleaning saratoga springs ny | `/house-cleaning-saratoga-springs-ny/` |
| house cleaning clifton park ny | `/house-cleaning-clifton-park-ny/` |
| house cleaning latham ny | `/house-cleaning-latham-ny/` |
| commercial cleaning albany ny | `/commercial-cleaning/` |
| office cleaning albany ny | `/commercial-cleaning/` |

Not tracked on purpose: carpet cleaning (1K–10K but national chains, not the focus), "house washing"
(that is exterior power washing), anything with "jobs" (job seekers).

## 3. Competition (Google Maps, "house cleaning service Albany NY")

| Business | Primary category | Rating | Reviews |
|---|---|---|---|
| A Touch Above, Inc. | House cleaning service | 4.7 | 140 |
| ACTS Cleaning Services | House cleaning service | 4.9 | 136 |
| Hollys Housekeeping LLC | House cleaning service | 5.0 | 87 |
| The Maids in Albany | House cleaning service | 4.5 | 51 |
| Pro Cleaning Services I Inc | House cleaning service | 5.0 | 37 |
| Hainiel Cleaning Service | House cleaning service | 4.8 | 33 |
| The Blake Experience Cleaning | House cleaning service | 4.9 | 27 |
| Bedford Home Cleaning | House cleaning service | 4.8 | 16 |
| **NSA Cleaning LLC** | **Cleaners** | 5.0 | **3** (not in the list) |

All eight use **House cleaning service** as the primary category. That is the single cheapest fix
available, and it is on the profile, not the site.

## 4. What was built on the site (this commit)

- **20 city pages** at `/house-cleaning-<city>-ny/`, generated by `scripts/gen_cities.py`. Each has:
  H1 "House Cleaning Services in {City}, NY"; verified facts about the city (Wikipedia, checked
  2026-10-26); the real road distance and route from the office pin (OSRM); the services ordered by
  what that city needs; the official Google Maps embed of the city; recurring prices ($160 / $195);
  a four-question local FAQ with FAQPage schema; links to three or four neighboring city pages.
  About 570 words each, **50.8% of the text unique to the page on average** (5-gram shingles,
  minimum 44%), so they are local pages, not doorway pages.
- **No page claims a job in a city.** The photos are real NSA jobs, but nobody knows where each was
  taken (WhatsApp strips the location), so captions say "Real job by NSA Cleaning" and nothing more.
- **Albany has no city page on purpose.** The home page is the Albany page: its title, its H1 and the
  Google profile's website link all point there. A second Albany page would compete with it. The
  hub and the footer link "Albany" to the home page.
- **Home**: H1 is now "House & Commercial Cleaning Services in Albany, NY" (it said "from Albany to
  Lake George", which split the target); meta description now carries "house cleaning".
- **Trailing slash** everywhere (`site.trailingSlash`): canonical, sitemap, og:url, schema and every
  internal link use `/about/`, so no signal points at a redirect.
- **Schema**: `{{siteUrl}}` token instead of a hardcoded domain (moving to the root domain is now one
  line in `site.config.json`); `hasMap` and `sameAs` point at the Google profile; `hasOfferCatalog`
  lists the ten services; each city page has Service (with the city, its county and the starting
  price), BreadcrumbList and FAQPage.
- **Footer**: "Cleaning services by city" row (Albany plus the eight cities with measurable demand,
  plus the full list) and the official Google Maps embed of the business.
- **Search Console tag**: `googleSiteVerification` in `site.config.json` renders the meta tag.
- **Tooling**: `scripts/check-seo.mjs` (one H1, title and description length, canonical, sitemap
  parity, JSON-LD, FAQ parity, map on city pages); `scripts/deploy.sh` (refuses to publish a preview
  build to the live domain); `scripts/indexnow.mjs` with the key in `public/`.

## 5. Decisions taken, and reversible

| Decision | Why | To undo |
|---|---|---|
| City pages at `/house-cleaning-<city>-ny` | "house cleaning {city}" is the city search with demand; `-ny` because Albany, Troy, Delmar, Malta and Wilton exist in other states and autocomplete mixes them | rename in `gen_cities.py` and `cityPages` |
| No separate Albany page | cannibalization with the home page | add Albany to `CITIES` |
| Prices on every city page | verified (CONTENT.md §1) and a real differentiator: none of the top competitors shows a price in Maps | edit `PRICE_*` |

## 6. Open, in order of impact

1. **Google profile: applied 2026-10-26** (record in `docs/GBP.md` §0): House cleaning service as
   primary category plus four secondary, phone, UTM, description, 26 services, service areas fixed
   (one of them was Watervliet, **MI**), 7 posts (1 live, 6 scheduled to 2027-04-12). All pending
   Google's review on that date. Hours not changed until Ronie confirms weekend residential work.
2. **Phone NAP. Decided 2026-10-26: (516) 440-3731 everywhere**, the number already on the site and
   now the profile's primary phone. Still wrong elsewhere: the "NSA cleaning Corp" Facebook page shows
   (518) 902-1180.
3. **Reviews.** 3 against 16–140 for the eight businesses above. This is the gap that decides the map.
   The root domain currently hosts a 1–5 star funnel; Google's policy forbids routing only happy
   customers to the review form, and the penalty can remove existing reviews.
4. **Root domain.** `nsacleaningllc.com` is the brand domain and serves a review funnel with nothing
   indexable. The site belongs there, with the funnel on a subdomain. Needs DNS access (Cloudflare,
   or GHL if the domain was bought through it). After the move: `siteUrl` in the config, a 301 from
   `lp.` and a change of address in Search Console, as was done for New Horizon.
5. **Search Console: done 2026-10-26.** Property `https://lp.nsacleaningllc.com/` verified by meta tag
   (`googleSiteVerification` in the config; do not remove it) in the client's own account,
   `nsacleaningllc0@gmail.com`. Sitemap submitted: Success, 39 URLs. Indexing requested on 26/10 for 11 URLs:
   home (already indexed; recrawl for the new H1), troy, schenectady, saratoga-springs, clifton-park, latham,
   glens-falls, queensbury, watervliet, colonie, ballston-spa. The daily quota ran out at mechanicville.
   **2026-10-28:** indexing requested for the other 10 (mechanicville, lake-george, cohoes, rensselaer,
   east-greenbush, delmar, guilderland, halfmoon, malta, wilton); all 20 city pages plus the home have
   now been requested. Before the request, 6 were "Discovered - currently not indexed" and 4 (cohoes,
   east-greenbush, delmar, guilderland) "URL is unknown to Google". Sitemap resubmitted the same day
   (it had been read that morning: Success, 39 URLs). Home, troy and schenectady inspected as
   "URL is on Google". The Pages report was still "Processing data".
   **Inspection of all 39 URLs the same day: 29 indexed** (home, all 11 service pages, all 7
   institutional pages, and the 10 city pages requested on 2026-10-26). The 10 pending were exactly the
   city pages requested on 2026-10-28.
   **2026-10-29: all 39 indexed.** The 10 requested the day before were all "URL is on Google".
   From here, request indexing only for a page whose content changes, and watch Performance for
   impressions by city query. Bing Webmaster Tools (import from Search Console) not done:
   it needs an OAuth grant; IndexNow already told Bing about the 39 URLs.
6. **Deploy access: solved 2026-10-26.** Production is `Rdavifelix/nsa-cleaning-site`; `kauankamil-rgb`
   has write access since that day, so `npm run deploy` works from here.
