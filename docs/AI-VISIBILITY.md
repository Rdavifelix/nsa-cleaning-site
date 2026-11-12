# NSA Cleaning in AI answers (ChatGPT, Perplexity, Google AI Mode)

Started 2026-11-12. Same rules as the profile: no "licensed", "bonded", "eco" or "organic"; the phone is
always (407) 728-0523; no edits to the Google profile's core fields before 29/11.

## Baseline, 2026-11-12

Asked from the NSA Chrome (Google signed in as the business, so AI Mode is personalized; ChatGPT and
Perplexity logged out).

| Prompt | Google AI Mode | ChatGPT | Perplexity |
| --- | --- | --- | --- |
| best house cleaning service in Albany NY | not listed | not listed | no answer (asked to sign in) |
| house cleaning service near Watervliet NY | **listed 2nd**, described correctly | not listed | not listed |
| deep cleaning company in Troy NY | not listed | – | – |
| move out cleaning Schenectady NY | not listed | – | – |
| NSA Cleaning LLC Watervliet NY | correct summary (since 2016, insured, services, languages, area) | "couldn't confirm a listing"; offers nsacleaning.com and NSA Premier LLC instead | "couldn't find a reliable listing"; points to NSA Cleaning Services LLC (Illinois/Wisconsin) |

Who the assistants name instead: Hollys Housekeeping (93 reviews), BD Homes Cleaning (89), EASE Cleaning
(83), ACTS Cleaning (136), Clean 4U (209), Grace and Sons Global Concept (46, BBB A+), A Touch Above (140).

## Why NSA is missing

1. **Review count.** AI Mode builds its list from the map pack and quotes rating and count. Everyone it
   names in Albany has 46 to 209 reviews; NSA has 24.
2. **Nothing outside Google confirms the business.** ChatGPT and Perplexity cross-check directories, and
   in this niche they cited BBB, Yelp, Thumbtack, YellowPages and the companies' own sites. What they
   find for NSA disagrees with the Google profile:
   - Yelp: "NSA CLEANING – Ballston Spa", (518) 902-1180, 1.0 from 1 review, unclaimed.
   - Facebook (`/nsacleaning`): (518) 902-1180.
   - New York State registry (data.ny.gov, active corporations): **NSA Cleaning, LLC**, filed
     2020-11-12, Saratoga County, process address in Malta; and **NSA Premier LLC**, filed 2023-07-12,
     at 321 25th St, Watervliet (the profile's address). ChatGPT found the second and could not link it.
   - No BBB profile, no Bing Places listing, no Apple Business Connect listing.
3. **Same-name companies.** NSA Cleaning Services LLC (nsacleaningservicesllc.com, Illinois and
   Wisconsin, 414-698-9847) and nsacleaning.com (a template site with no phone or city; owner unknown).
4. **The brand domain is empty.** `nsacleaningllc.com` and `www` serve only a GHL "How would you rate our
   work?" form, with no title, name or city (GHL sites, `sites.ludicrous.cloud`; DNS on Cloudflare). The
   real site lives on the `lp.` subdomain, so the obvious domain tells an assistant nothing.

## Done on 2026-11-12 (site)

- `/llms.txt`, built from `site.config.json`: one-paragraph summary, contact, hours, languages,
  starting prices, service area, the line separating NSA from NSA Cleaning Services LLC, and links to
  every service and city page. A small signal (Google does not read it), but free.
- Business schema: `alternateName` "NSA Cleaning" and a `disambiguatingDescription` that places the
  company in Watervliet and the Capital Region.

## To do, in this order

Each needs a login or an account, so the user (or Ronie) does it; the data to paste is below.

1. **Bing Places for Business**: "Import from Google Business Profile" with the NSA Google account.
   Bing's index feeds Copilot and ChatGPT search. Check the imported phone is (407) 728-0523.
2. **Yelp**: claim the Ballston Spa listing (biz.yelp.com) and change it to the data below. Yelp feeds
   Perplexity, Apple Maps and Siri. Yelp forbids asking customers for reviews; just leave the link on
   the site.
3. **Facebook page**: phone to (407) 728-0523, website to the site, city to Watervliet.
4. **Apple Business Connect** (businessconnect.apple.com): claim or add the place, same data.
5. **BBB**: free business profile (accreditation is paid and optional). Both ChatGPT and Perplexity
   leaned on BBB for Watervliet competitors.
6. **Root domain**: in GHL, move the rating form off `/` (to `/feedback`, for example) and send `/` to
   `https://lp.nsacleaningllc.com/` with a 301 (a Cloudflare redirect rule does the same). Moving the
   whole site to the root is a separate decision, and the profile's website field can only change
   after 29/11.
7. **Reviews**: keep asking every client, spread over the week (no bursts like 11/11). 50 reviews puts
   NSA in the range of the companies AI Mode lists.
8. Then Thumbtack, Angi, Nextdoor and YellowPages, with the same data.

Ronie should also know that the state registry lists the LLC at a Malta address; changing it is his
call and is not required for any of the above.

## Data to paste (exactly the same everywhere)

- Name: `NSA Cleaning LLC`
- Address: `321 25th St, Watervliet, NY 12189` (if the Google profile hides the address after 29/11,
  hide it on the others too)
- Phone: `(407) 728-0523`
- Website: `https://lp.nsacleaningllc.com/`
- Email: `Nsacleaningllc@gmail.com`
- Hours: Monday to Friday 8:00 AM – 5:00 PM (commercial work 24/7 by appointment)
- Categories: House cleaning service (main); Commercial cleaning service; Carpet cleaning service;
  Pressure washing service; Painter
- Year started: 2016
- Languages: English, Spanish, Portuguese
- Short description (216 characters): `Insured house and commercial cleaning from Watervliet, NY, serving
  Albany to Lake George since 2016. Recurring, deep, move-out, Airbnb and post-construction cleaning,
  plus power washing, carpet cleaning and painting.`
- Long description: the one approved for the Google profile, `docs/GBP.md` §3.
- Logo: `~/Downloads/NSA-logo-sem-contato.png` (the version without the old phone and email).
- Photos: real jobs from `raw-images/` (kitchen, living room, bedrooms, decks).

## Re-measure

Same five prompts in the three assistants once a month, next on 2026-12-12. Log the result under a new
date heading here.
