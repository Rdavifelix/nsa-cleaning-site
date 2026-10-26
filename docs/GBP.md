# NSA Cleaning LLC — Google Business Profile package

The package below was approved on 2026-10-26 and applied the same day (§0 is the record of what is on
the profile now; §1–§7 are the original package). Profile CID `12610868214912534386`, owner account in
Davi's Chrome as `nsacleaningllc0@gmail.com`. See `docs/SEO.md` §3 for why each change matters.

---

## SUSPENDED on 2026-10-26, about an hour after the edits below

Business Profile Manager shows status "Suspenso" and 0% verified; the panel says "Seu acesso foi
suspenso porque esse perfil não segue as diretrizes". Logged-out Google Maps returns "Google Maps can't
find NSA Cleaning LLC". The edits did go through before it (the panel shows House cleaning service,
(516) 440-3731 and the UTM link).

Most likely cause: **the profile showed a residential street address for a business that serves
customers at their location.** OpenStreetMap tags 321 25th St, Watervliet as a residential building,
and the Street View thumbnail on the profile is a house. That was already the case before 2026-10-26;
changing the primary category, the primary phone and the service areas in the same hour very likely
sent the profile to re-review, which caught it. The real reason is in the appeals tool
(support.google.com/business/workflow/13569690), step "select the decision"; read it there first.

Rules from Google's help page (answer 4569145): **an appeal can be submitted only once**; do not
create a new profile for the business; evidence must show the same name and address as the profile
(business registration, license, tax certificate, utility bill). If the appeal is denied, there is one
additional review with new evidence.

**Appeals tool, read 2026-10-26:** decision "Perfil da Empresa suspenso", reason **"Conteúdo enganoso"**
(misleading content), appealable, nothing submitted yet.

The phone change is the strongest trigger. The profile had been verified with (407) 728-0523; the edit
made **(516) 440-3731** primary. That number came onto the site on 2026-10-13 (commit 3544acb, Davi,
together with the GoHighLevel form and A2P), replacing the local (518) 902-1180 that Facebook still
shows. If 516 is a GoHighLevel number, it is not "under the direct control of the business" and it
routes calls through a third party, which is what Google's phone rule forbids; a manager swapping the
verified phone for it looks like a hijack or a lead-gen listing. The public residential address is the
second problem. A third one sits in the same policy section: the 1–5 star funnel on
`nsacleaningllc.com` sends only happy customers to Google ("selectively solicit positive reviews").

**Phone reverted 2026-10-26, ~18:16 BRT** (user's call): the profile is back to exactly what it had
before, a single phone, **(407) 728-0523**, no additional number. That is the number the profile was
verified with and the one its SMS chat already uses (`sms:+14077280523`), so it is Ronie's own line.
The site followed the same day (commit 75aca3f, live and checked): (407) 728-0523 is now its only
number, on all 40 pages and in the schema, and 516 appears nowhere. Facebook still shows
(518) 902-1180.

Do not edit the profile further until the address and the funnel are decided.

---

## 0. Applied on 2026-10-26

Every edit went to Google's review ("Your edit is pending review. It may take up to one day"). Check the
public profile on 2026-10-27; if an edit was rejected, the profile manager shows it as "Not approved".

| Field | Before | Now |
|---|---|---|
| Primary category | Cleaners | **House cleaning service** |
| Additional categories | — | Janitorial service · Carpet cleaning service · Pressure washing service · Painter and Decorator. "Commercial cleaning service", "Office cleaning service" and plain "Painter" do not exist in Google's list; Janitorial service is the commercial one. |
| Primary phone | (407) 728-0523 | (516) 440-3731 with 407 as additional; **reverted the same day to (407) 728-0523 alone** after the suspension (see above) |
| Website | `https://lp.nsacleaningllc.com/` | `https://lp.nsacleaningllc.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` |
| Service areas | 20, including **Watervliet, MI** (wrong state) and no Watervliet, NY or Delmar | The 20 in §4: Watervliet, MI and Wilton removed; Watervliet, NY and Delmar added (Google lists Delmar as "Bethlehem, NY") |
| Hours | Mon–Fri 8–5, Sat–Sun "Open 24 hours" | **Not changed.** Commercial 24/7 is verified (CONTENT.md §1), but whether residential runs on weekends is an open question (CONTENT.md §7.3). Ask Ronie before touching it. |
| Description | see below | see below (742 of 750 characters) |

Description before:

> NSA Cleaning LLC is a cleaning company in Watervliet, New York, serving homes and businesses from Albany to Lake George. In business since 2016, with more than 12 years of hands-on cleaning experience. Most of our week is recurring residential cleaning, weekly, bi-weekly or monthly. We also do deep cleaning, move-in and move-out cleaning, Airbnb turnovers, post-construction cleanup, deck and siding power washing, carpet cleaning and painting. For businesses we clean offices, medical clinics, hospitals, restaurants, dealerships, gyms and common areas, around your hours. Our team is insured, uniformed and trained to NSA standards. We bring all the supplies, travel is included, and we speak English, Portuguese and Spanish.

Description now (the §3 text merged with the facts the old one had; "dealerships" dropped to fit 750):

> NSA Cleaning LLC is a house cleaning and commercial cleaning company based in Watervliet, NY, serving Albany, Troy, Schenectady, Clifton Park, Saratoga Springs, Glens Falls, Lake George and every town within about an hour. Most of our week is recurring house cleaning, weekly, bi-weekly or monthly. We also do deep cleaning, move-in and move-out cleaning, Airbnb turnovers and post-construction cleanup. For businesses we clean offices, medical clinics, hospitals, restaurants, gyms and common areas, available 24/7. We also offer power washing, carpet cleaning and painting. Our team is insured and trained to NSA standards, we bring all the supplies, and travel is included. In business since 2016. We speak English, Spanish and Portuguese.

**Services** (Google's preset names where one fits, custom names otherwise; only what the site offers):

| Category | Services |
|---|---|
| House cleaning service | Deep clean · Moving-related cleaning · Office and workplace cleaning · Standard cleaning · Upholstery cleaning (these five were already there) · Recurring house cleaning · Airbnb and rental turnover cleaning · Post-construction cleaning |
| Janitorial service | Office cleaning · Medical institution cleaning · Fitness centre & gym cleaning · Multi-tenant cleaning · Restaurant cleaning · Car dealership cleaning |
| Carpet cleaning service | General carpet cleaning · Area rug cleaning · Pet stain and odour removal · Upholstery cleaning · Carpet shampoo and extraction · Stair carpet cleaning |
| Pressure washing service | Power/pressure washing · Deck power washing · Siding power washing · Dock and patio power washing |
| Painter and Decorator | Interior painting |

Left out on purpose: exterior painting (the painting page offers it only "if it is a fit"), gutter, roof,
window and soft-wash cleaning, steam cleaning (the site says shampoo and extraction), mattress, leather
and drapes, school, stadium, lab and cinema cleaning.

**Posts** (no phone number in any of them; "Learn more" button with `utm_campaign=gbp-post`; real NSA
job photos pulled from the live site; scheduled ones go out at 11:00):

| Date | Topic | Photo | Link |
|---|---|---|---|
| 2026-10-26 | Recurring plans, $160 / $195 | white kitchen, quartz island | `/recurring-cleaning/` |
| 2026-11-02 | Move-out cleaning, Troy and Schenectady | bedroom, hardwood floor | `/move-in-move-out-cleaning/` |
| 2026-11-09 | Commercial, 24/7 | bathroom, hex tile | `/commercial-cleaning/` |
| 2026-11-16 | Carpet and upholstery before the holidays | living room, sectional and rug | `/carpet-cleaning/` |
| 2026-11-23 | Rental turnovers, Saratoga Springs and Lake George | guest bedroom, towel animals | `/house-cleaning-saratoga-springs-ny/` |
| 2026-11-30 | Deep cleaning | bathtub after deep clean | `/deep-cleaning/` |
| 2027-04-12 | Spring power washing, decks and docks | lakeside cabin deck | `/power-washing/` |

The §6 "spring power washing" post was moved to April and replaced in November by the carpet post:
power washing in a Capital Region November is out of season. From December on, one new post a week.

**Found while doing this (not changed):**

- A Facebook page, "NSA cleaning Corp | Watervliet NY", ranks on page 1 for the brand and shows a
  **third phone number, (518) 902-1180**, and the name "Corp". Same email as the profile. It needs the
  516 number and the LLC name, or it splits the NAP the profile now carries.
- A Yelp listing "NSA CLEANING – Ballston Spa" also ranks for the brand. Not checked whether it is
  Ronie's.
- The profile shows a "Book online" button; its target was not checked.
- 3 reviews still have no reply.

## 1. Categories (the biggest single lever)

All eight businesses ranking for "house cleaning service Albany NY" use **House cleaning service** as
their primary category. NSA uses **Cleaners**, which Google also uses for dry cleaners.

- **Primary:** House cleaning service
- **Secondary:** Commercial cleaning service · Janitorial service · Carpet cleaning service ·
  Pressure washing service · Painter

Every secondary category matches a page on the site (`/commercial-cleaning`, `/carpet-cleaning`,
`/power-washing`, `/painting`), which is what keeps them credible.

## 2. Phone, website and hours (NAP)

| Field | Profile today | Site today | Do this |
|---|---|---|---|
| Phone | (407) 728-0523 | (516) 440-3731 | **Decided 2026-10-26: (516) 440-3731**, the number on the site, as the profile's primary phone. (407) 728-0523 can stay as an additional phone. Use 516 in every directory from now on. |
| Website | `https://lp.nsacleaningllc.com/` | — | Keep it, add tracking: `https://lp.nsacleaningllc.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` |
| Hours | Mon–Fri 8–5, Sat–Sun "Open 24 hours" | Residential 8–5, commercial 24/7 | Main hours **Mon–Fri 8 AM–5 PM**. Put the 24/7 commercial availability in *More hours* or in the description, not as "Open 24 hours" on weekends. |

## 3. Business description (709 characters, limit 750)

> NSA Cleaning LLC is a house cleaning and commercial cleaning company based in Watervliet, NY, serving Albany, Troy, Schenectady, Clifton Park, Saratoga Springs, Glens Falls, Lake George and every town within about an hour. We clean homes and apartments on weekly, bi-weekly and monthly plans, and we handle deep cleaning, move-in and move-out cleaning, Airbnb and rental turnovers, and post-construction cleanup. For businesses we clean offices, clinics, restaurants and common areas, available 24/7. We also offer power washing, carpet and upholstery cleaning, and painting. Our team is insured, we bring all supplies, and travel is included. In business since 2016. We speak English, Spanish and Portuguese.

## 4. Service areas (Google allows 20; Wilton is left out, lowest demand and next to Saratoga Springs)

Watervliet · Albany · Troy · Cohoes · Latham · Colonie · Schenectady · Rensselaer · East Greenbush ·
Delmar · Guilderland · Clifton Park · Halfmoon · Mechanicville · Ballston Spa · Malta ·
Saratoga Springs · Glens Falls · Queensbury · Lake George

## 5. Services (name, then description; each links to its page in the post or the site)

| Service | Description |
|---|---|
| Recurring house cleaning | Weekly, bi-weekly or monthly cleaning for apartments and houses. From $160 for apartments and $195 for houses. |
| Deep cleaning | Top-to-bottom cleaning: baseboards, grout, buildup, inside the oven and fridge on request. |
| Move-in and move-out cleaning | Empty homes cleaned for the next keys, inside cabinets, closets and appliances. |
| Airbnb and rental turnover cleaning | Beds made, towels folded, kitchen and bathrooms reset between guests. |
| Post-construction cleaning | Dust, debris and residue cleared after a renovation or a new build. |
| Office and commercial cleaning | Offices, clinics, restaurants and common areas, scheduled around your hours, 24/7. |
| Power washing | Decks, siding, docks and walkways. |
| Carpet and upholstery cleaning | Carpet shampoo plus sofas and upholstery. |
| Painting | Interior and exterior painting for homes and businesses. |

## 6. First posts (one a week; Google rejects posts with a phone number in the text)

1. **Recurring cleaning** — "Weekly, bi-weekly or monthly house cleaning from Albany to Lake George. Recurring plans start at $160 for apartments and $195 for houses, and travel is included." Button: *Learn more* → `/recurring-cleaning/?utm_source=google&utm_medium=organic&utm_campaign=gbp-post`
2. **Move-out season** — "Moving out of an apartment in Troy or Schenectady? We clean inside cabinets, closets and appliances so the place is ready for inspection." → `/house-cleaning-troy-ny/?utm_…`
3. **Commercial** — "Offices, clinics and restaurants cleaned before you open or after you close, 24/7, across the Capital Region." → `/commercial-cleaning/?utm_…`
4. **Saratoga rentals** — "Short-term rental hosts in Saratoga Springs: we turn over the place between check-out and check-in, beds made and towels folded." → `/house-cleaning-saratoga-springs-ny/?utm_…`
5. **Spring power washing** — "Decks, docks and siding cleared of the winter, from Clifton Park to Lake George." → `/power-washing/?utm_…`
6. **Deep cleaning** — "A first deep clean resets the house; a recurring plan keeps it there. Insured team, supplies included." → `/deep-cleaning/?utm_…`

Use a real NSA job photo on each post (the site's `raw-images/` originals).

## 7. Reviews

Ask every client at the end of the job, in person, with the plain Google review link. Do not filter
by rating first: Google forbids routing only happy customers to the review form, and the penalty can
remove the reviews already published. Reply to every review. A reply that names the service and the
city ("glad the move-out clean in Troy went well") is the kind of text the map reads.
