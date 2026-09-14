# NSA Cleaning LLC — Design System (for inner pages)

Read this before building any page under `src/pages/`. The home page (`src/pages/index.html`) is the reference implementation — copy its markup patterns. **Never edit `src/styles.css`, `src/layout.html` or `src/partials/*`.** Everything you need is a class listed here; page-specific tweaks go in a small `<style>` block (see §4). Facts/copy come only from `docs/CONTENT.md`.

Build: `node build.mjs` → `dist/`. Pages start with `<!--@meta { ...json... } -->`. Template syntax: `{{var}}` (escaped), `{{{var}}}` (raw HTML), `{{#if x}}…{{else}}…{{/if}}`, `{{#each list}}{{this}}{{/each}}`, `{{> partial}}`. Available data: `{{site.business.*}}` (phone, phoneHtml, phoneE164, phone2, phone2Html, phone2E164, email, address.street/city/region/postal, hoursResidential, hoursCommercial, serviceArea[], priceApartmentFrom, priceHouseFrom, yearsExperience, yearsInBusiness, foundingYear, owners[], facebook, facebookHandle), `{{site.nav}}`, `{{site.siteUrl}}`, `{{site.year}}`, `{{page.path}}`.

## 1. Tokens & layout

### Custom properties (`:root`, from `src/styles.css`)
| Token | Value | Use |
|---|---|---|
| `--blue` | `#0B70E0` | primary buttons, icons, accents (white text OK) |
| `--blue-dark` | `#0757B5` | links, small blue text on white, eyebrows |
| `--navy` | `#0A1F44` | headings, dark bands, featured cards |
| `--navy-2` | `#0F2B5B` | secondary navy |
| `--tint` | `#E8F1FD` | light blue fills (tiles, chips, icon boxes) |
| `--tint-2` | `#C9DBF6` | muted text on navy |
| `--sky` | `#8FC1F7` | icons/eyebrows on navy |
| `--yellow` | `#F5B400` | tiny accents only (sup, badges) — never buttons |
| `--ink` / `--ink-2` / `--muted` | `#111827` / `#374151` / `#4B5563` | body text / secondary text / captions |
| `--line` / `--line-2` | `#E5E7EB` / `#D1D5DB` | borders |
| `--bg` / `--bg-2` | `#F3F4F6` / `#F8FAFC` | placeholders / alt section background |
| `--red` / `--green` | `#B91C1C` / `#166534` | form errors / success |
| `--font` | Plus Jakarta Sans + system stack | already applied to `body` |
| `--r` / `--r-lg` / `--r-xl` | `2px` / `3px` / `4px` | radii (buttons, inputs, chips, badges / cards / photos and hero). **Client direction: the site is deliberately square.** Never use `999px` pills, `50%` on a UI element, or a hard-coded radius of 8px or more. The only round things left are the circular logo mark and the 8px status dot in `.photo-tag`; the arrow badges, step numbers, FAQ toggles and the slider handle are all squared off. `node build.mjs` prints a warning if a page introduces an inline radius above the scale. |
| `--shadow` / `--shadow-lg` | soft navy shadows | cards / floating cards |
| `--container` | `1240px` | `.container` max width |
| `--gutter` | `clamp(16px,4vw,32px)` | side padding |
| `--header-h` | `72px` | sticky header height (anchors already offset via `[id]{scroll-margin-top}`) |

### Type scale (fluid)
`--step-0` `clamp(.9375rem,.9rem + .2vw,1.0625rem)` body · `--step-1` `clamp(1.0625rem,1rem + .4vw,1.25rem)` leads, `.section-head p` · `--step-2` `clamp(1.375rem,1.2rem + .9vw,1.875rem)` big numbers, `.prose h2` · `--step-3` `clamp(1.75rem,1.35rem + 1.9vw,2.75rem)` `.section-head h2`, stats · `--step-4` `clamp(2.25rem,1.5rem + 2.7vw,3.625rem)` hero/page H1, `.cta-band h2`.
Headings (`h1–h4`) are navy, weight 800, letter-spacing −.02em, **no default size** — size comes from context (`.page-hero h1`, `.section-head h2`, `.tile h3` 1.25rem, `.plan h3` 1.5rem, `.why-item h3` 1.0625rem, `.prose h1/h2/h3`). Base resets: `p{margin:0 0 1em}`, `ul{margin:0;padding:0;list-style:none}` (bullets only inside `.prose`), `a{color:var(--blue-dark)}`, `:focus-visible{outline:3px solid var(--blue);outline-offset:3px}`.

### Spacing
No spacing tokens — use these fixed rhythms: `.section` `padding-block:clamp(56px,8vw,104px)`; `.section-head` `margin-bottom:clamp(28px,4vw,48px)`; card grids gap 12–16px; two-column layouts gap 36px → 56px at ≥900px; action rows (`.actions`, `.hero-cta`, `.cta-actions`) gap 12px, margin-top 24–30px. On screens <900px `body` has `padding-bottom:76px` for the sticky mobile CTA (from the footer partial) — nothing to do.

### Breakpoints used in styles.css
`min-width`: 560 (form 2-col), 600 (bento 2-col, `.tile-wide`), 800 (plans 3-col, gallery 4-col, footer), 900 (all two-column layouts, hero, stats 4-col, hides mobile CTA), 1000 (bento 4-col), 1100 (why-list 2-col), 1180 (desktop nav), 1200 (topbar), 1400 (nav phone). `max-width`: 559, 599, 899 (mobile-only tweaks). Design mobile-first; 900px is the main desktop switch.

### Layout classes
- `.container` — centered, max 1240px, side gutter. Every section's direct child.
- `.section` — vertical padding. `.section-alt` — `--bg-2` background (alternate with white sections). `.on-dark` — add to any navy/blue section or card: flips headings to white, eyebrow to sky/yellow, `.btn-ghost` to white outline, focus ring to white.
- `.section-head` — max 720px, holds `.eyebrow` + `h2` + `p`. Add `.center` to center it, or `.split-head` (flex, full width) with `<div>…</div>` + a right-aligned `.link-arrow` (see home "What we do").
- `.eyebrow` — small uppercase label with a blue dash before it. Use `<p class="eyebrow">`.

```html
<section class="section section-alt" id="included" aria-labelledby="included-title">
  <div class="container">
    <div class="section-head"><p class="eyebrow">What's included</p><h2 id="included-title">…</h2><p>…</p></div>
    …content…
  </div>
</section>
```

## 2. Components (exact class names — copy, don't restyle)

### Icons
The sprite `src/partials/icons.html` is injected **once by `src/layout.html`** (`{{> icons}}` right after the skip link) — do **not** include it in a page (duplicate ids). Usage: `<svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg>` (outline strokes in `currentColor`, 1.2em; containers like `.tile-icon`/`.why-icon` size it). Available ids: `i-check i-arrow i-arrow-ne i-phone i-mail i-shield i-star i-sparkle i-bucket i-home i-box i-tool i-building i-rug i-roller i-drop i-key i-utensils i-car i-clinic i-hospital i-gym i-tower i-users i-calendar i-globe i-clock i-thumb i-pin i-chat i-refresh i-award`.

### Buttons & links
`.btn` + one of `.btn-primary` (blue), `.btn-ghost` (outline; becomes white outline inside `.on-dark`), `.btn-white` (on dark backgrounds). Size: `.btn-lg`. Text link: `.link-arrow`. Action rows: `.hero-cta` (heroes), `.actions` (in sections), `.cta-actions` (CTA band, centered), `.plan-actions` (cards). Every quote CTA gets `data-track="cta_quote_<where>"`.
```html
<div class="hero-cta">
  <a class="btn btn-primary btn-lg" href="{{site.quoteHref}}" data-quote-open data-track="cta_quote_hero">Get a Free Quote</a>
  <a class="btn btn-ghost btn-lg" href="tel:{{site.business.phoneE164}}"><svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg>Call&nbsp;{{{site.business.phoneHtml}}}</a>
</div>
<a class="link-arrow" href="/pricing">See pricing <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a>
```

### Chips
```html
<ul class="chips" aria-label="Why choose NSA Cleaning">
  <li class="chip"><svg class="icon" aria-hidden="true"><use href="#i-shield"/></svg>Insured</li>
  <li class="chip chip-lang">English</li><li class="chip chip-lang" lang="pt">Português</li><li class="chip chip-lang" lang="es">Español</li>
</ul>
```

### Stats strip (navy band; 2 → 4 columns at ≥900)
```html
<section class="stats on-dark" aria-label="NSA Cleaning at a glance"><div class="container"><ul>
  <li class="stat"><b>{{site.business.yearsExperience}}<sup>+</sup></b><span>years of cleaning experience</span></li>
  <li class="stat"><b>1<sup>hr</sup></b><span>max travel from our Watervliet office</span></li>
</ul></div></section>
```

### Service tiles (`.bento`: 1 → 2 (≥600) → 4 (≥1000) columns)
Each tile is `<a class="tile" href>`. Variants: `.tile-photo` (image + dark gradient, white text), `.tile-solid` (blue), `.tile-navy` (navy), `.tile-cta` (full-width navy "Not sure?" box — a `<div class="tile tile-cta on-dark">` with `.tile-cta-actions`). Spans: `.tile-wide` (2 cols ≥600), `.tile-lg` (2×2 ≥1000). Optional `.tile-kicker`.
```html
<div class="bento">
  <a class="tile" href="/deep-cleaning">
    <span class="tile-icon"><svg class="icon" aria-hidden="true"><use href="#i-sparkle"/></svg></span>
    <span class="tile-arrow" aria-hidden="true"><svg class="icon" aria-hidden="true"><use href="#i-arrow-ne"/></svg></span>
    <div class="tile-body"><span class="tile-kicker">Residential</span><h3>Deep cleaning</h3><p>One sentence.</p></div>
  </a>
  <a class="tile tile-photo tile-wide" href="/power-washing">
    <img src="/images/SLUG-1024.webp" srcset="/images/SLUG-480.webp 480w, /images/SLUG-800.webp 800w, /images/SLUG-1024.webp 1024w" sizes="(min-width: 1240px) 600px, (min-width: 600px) 50vw, calc(100vw - 32px)" width="1024" height="768" alt="…" loading="lazy" decoding="async">
    <span class="tile-arrow" aria-hidden="true"><svg class="icon" aria-hidden="true"><use href="#i-arrow-ne"/></svg></span>
    <div class="tile-body"><h3>Power washing</h3><p>…</p></div>
  </a>
</div>
```
Non-wide photo tiles use `sizes="(min-width: 1240px) 300px, (min-width: 600px) 50vw, calc(100vw - 32px)"`.

### Plan cards (`.plans`: 1 → 3 columns at ≥800)
```html
<div class="plans">
  <article class="plan">
    <p class="plan-cad">Every week</p><h3>Weekly</h3><p>Short blurb.</p>
    <ul><li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Supplies and travel included</li></ul>
    <div class="plan-actions"><a class="btn btn-primary" href="{{site.quoteHref}}" data-quote-open data-track="cta_quote_plan_weekly">Get a Free Quote</a><a class="plan-link" href="/recurring-cleaning">Weekly plan details</a></div>
  </article>
  <article class="plan plan-featured on-dark">…same markup; use .btn-white…</article>
</div>
<div class="price-note"><div class="prices"><div><strong>${{site.business.priceApartmentFrom}}</strong><small>apartments from</small></div><div><strong>${{site.business.priceHouseFrom}}</strong><small>houses from</small></div></div><p>…<a href="/pricing">see how pricing works</a>.</p></div>
<p class="plans-note">…</p>
```

### Why list (`.why-list`: 1 → 2 columns at ≥1100; last item spans both)
```html
<ul class="why-list">
  <li class="why-item"><span class="why-icon"><svg class="icon" aria-hidden="true"><use href="#i-shield"/></svg></span><div><h3>Insured</h3><p>…</p></div></li>
</ul>
```
Inline check row above it: `<p class="why-card"><span><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Gray uniforms</span> …</p>`. Two-column with photo: `.container.why-grid` > `.why-visual` (`.why-media` > `.why-frame` > img, optional `.why-car` inset; `.why-caption`) + `<div>` (section-head + list + `.why-actions`). Commercial facility list: `<ul class="facilities"><li class="facility"><svg …#i-building…>Offices</li></ul>` inside `.on-dark`, plus `<span class="badge-247">…Available 24/7</span>`.

### Before / after slider
Needs `public/main.js` (already loaded on every page). `.compare[data-compare]`: BEFORE `<img>` first, AFTER `<img>` inside `.compare-after[data-compare-after]`, two labels, the handle and a range input. Use a before/after pair with the same aspect. Two-column wrapper `.ba-grid` (text | slider) with a `.ba-points` checklist.
```html
<div class="ba-grid">
  <div><div class="section-head"><p class="eyebrow">Real results</p><h2 id="results-title">…</h2><p>…</p></div>
    <ul class="ba-points"><li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg><span><b>Deep cleaning</b> reaches …</span></li></ul>
    <div class="actions"><a class="btn btn-primary" href="{{site.quoteHref}}" data-quote-open data-track="cta_quote_results">Get a Free Quote</a></div></div>
  <div>
    <div class="compare" data-compare>
      <img src="/images/bathtub-wide-before-deep-cleaning-774.webp" srcset="/images/bathtub-wide-before-deep-cleaning-480.webp 480w, /images/bathtub-wide-before-deep-cleaning-774.webp 774w" sizes="(min-width: 1240px) 640px, (min-width: 900px) 52vw, calc(100vw - 32px)" width="774" height="719" alt="Stained fiberglass tub and shower surround before deep cleaning" loading="lazy" decoding="async">
      <div class="compare-after" data-compare-after><img src="/images/bathtub-wide-after-deep-cleaning-774.webp" srcset="…" sizes="…" width="774" height="719" alt="Same tub and shower surround gleaming white after deep cleaning" loading="lazy" decoding="async"></div>
      <span class="compare-label is-before">Before</span><span class="compare-label is-after">After</span>
      <span class="compare-handle" aria-hidden="true"></span>
      <input type="range" min="0" max="100" value="50" aria-label="Compare before and after: drag to reveal">
    </div>
    <p class="compare-caption">Tub and shower surround — deep cleaning. Real client photos.</p>
  </div>
</div>
```
`.compare` is `aspect-ratio:774/719`; for another pair set it in the page `<style>` (e.g. `.compare{aspect-ratio:768/1024}`). Static alternative: a two-item `.gallery` captioned "Before" / "After".

### Gallery (2 → 4 columns at ≥800; 4:5 crops with caption)
```html
<ul class="gallery">
  <li><figure><img src="/images/SLUG-768.webp" srcset="/images/SLUG-480.webp 480w, /images/SLUG-768.webp 768w" sizes="(min-width: 1240px) 290px, (min-width: 800px) 25vw, 50vw" width="768" height="1024" alt="…" loading="lazy" decoding="async"><figcaption>Deck stairs · power washing</figcaption></figure></li>
</ul>
```
`.gallery` has `margin-top:clamp(40px,6vw,64px)` (designed to follow another block); precede it with a heading (`<h3 class="visually-hidden">Recent work</h3>` or a visible h2).

### Service area (city chips + map)
`.container.area-grid` > `<div>` (`.section-head` + `.city-chips` + `.actions`) + `.area-map` (img). Map slug `service-area-map-albany-to-lake-george` (800/1024 wide, 1024×1536).
```html
<ul class="city-chips" aria-label="Cities we serve">
  <li class="is-hq">Watervliet (HQ)</li>{{#each site.business.serviceArea}}<li>{{this}}</li>{{/each}}
</ul>
<div class="area-map"><img src="/images/service-area-map-albany-to-lake-george-1024.webp" srcset="/images/service-area-map-albany-to-lake-george-800.webp 800w, /images/service-area-map-albany-to-lake-george-1024.webp 1024w" sizes="(min-width: 1240px) 480px, (min-width: 900px) 40vw, calc(100vw - 32px)" width="1024" height="1536" alt="Service area map from Albany to Lake George, NY along I-87" loading="lazy" decoding="async"></div>
```

### FAQ (`<details>` accordions)
```html
<div class="container faq-grid">
  <div class="faq-side"><div class="section-head"><p class="eyebrow">Good to know</p><h2 id="faq-title">…</h2><p>…</p></div><a class="link-arrow" href="/faq">All FAQs <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a></div>
  <div class="faq">
    <details><summary>Are pets okay during a cleaning?</summary><p>Yes. We prefer pets in a crate or a closed room …</p></details>
  </div>
</div>
```
Each `<details>` = one `<summary>` + one `<p>` (only `p` is styled). Single-column (for `/faq`): drop `.faq-grid`/`.faq-side`; put `.section-head` then one `.faq` per topic group (with an `<h2>` above each group) inside `.container`.

### CTA band (last section before the footer)
```html
<section class="section cta-band on-dark" aria-labelledby="cta-title"><div class="container">
  <h2 id="cta-title">Ready for a deep-cleaned home in Albany?</h2>
  <p>Tell us what you need and we'll reply with a free quote — no obligation, no travel fees.</p>
  <div class="cta-actions"><a class="btn btn-white btn-lg" href="{{site.quoteHref}}" data-quote-open data-track="cta_quote_final">Get a Free Quote</a><a class="btn btn-ghost btn-lg" href="tel:{{site.business.phoneE164}}"><svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg>Call&nbsp;{{{site.business.phoneHtml}}}</a></div>
  <p class="cta-meta">{{site.business.address.city}}, {{site.business.address.region}} · Residential {{site.business.hoursResidential}} · Commercial {{site.business.hoursCommercial}} · <a href="mailto:{{site.business.email}}">{{site.business.email}}</a></p>
</div></section>
```

### Quote button and modal (every page)
There is **no form on the site**. The quote lives in the client's GoHighLevel account and opens in a modal.

Every call to action is the same element, wherever it appears:
```html
<a class="btn btn-primary btn-lg" href="{{site.quoteHref}}" data-quote-open data-track="cta_quote_hero">Get a Free Quote</a>
```
`site.quoteHref` is the hosted form URL when `GHL_FORM_URL` / `ghlFormUrl` is set, and `/contact` when it is not. `data-quote-open` is what `public/main.js` listens for. The modal itself is `src/partials/quote-modal.html`, injected once by the layout, so **pages add nothing**: no partial include, no `#quote` anchor, no `"turnstile": true` in the front matter.

Rules for a new page: use the snippet above for every quote call to action, keep the secondary action as the phone link, and never build a `<form>` into a page. If a page needs to point at the form from body copy, use the same `href` and attribute on an inline link.


### Page hero (inner pages) — `.page-hero`, `.page-hero--photo`
Compact hero on `--bg-2`: eyebrow, H1 (`<em>` colors the keyword/place), `.lead`, `.hero-cta`, optional `.hero-note` / `.chips`. Add `page-hero--photo` + a second child `.page-hero-photo` for a right-side 4:3 rounded photo (≥900px; stacks below on mobile).
```html
<section class="page-hero page-hero--photo" aria-labelledby="page-title"><div class="container">
  <div>
    <p class="eyebrow">Residential · Albany to Lake George</p>
    <h1 id="page-title">Deep Cleaning Service in <em>Albany, NY</em></h1>
    <p class="lead">One or two plain sentences: what it is, who it's for, what's included.</p>
    <div class="hero-cta"><a class="btn btn-primary btn-lg" href="{{site.quoteHref}}" data-quote-open data-track="cta_quote_hero">Get a Free Quote</a><a class="btn btn-ghost btn-lg" href="tel:{{site.business.phoneE164}}"><svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg>Call&nbsp;{{{site.business.phoneHtml}}}</a></div>
    <p class="hero-note"><b>Insured</b> · Supplies included · No travel fees · <span lang="es">Hablamos español</span></p>
  </div>
  <div class="page-hero-photo"><img src="/images/bathroom-hex-tile-after-deep-cleaning-768.webp" srcset="/images/bathroom-hex-tile-after-deep-cleaning-480.webp 480w, /images/bathroom-hex-tile-after-deep-cleaning-768.webp 768w" sizes="(min-width: 1240px) 520px, (min-width: 900px) 42vw, calc(100vw - 32px)" width="768" height="1024" alt="Small bathroom with hex tile floor after deep cleaning" fetchpriority="high" decoding="async"></div>
</div></section>
```
Without a photo: omit the modifier and the second child (the grid collapses to one column).

### Prose (legal / long text) — `.prose`
```html
<section class="section"><div class="container">
  <article class="prose">
    <h1>Privacy Policy</h1><p class="meta">Effective date: January 1, {{site.year}}</p>
    <h2>1. What we collect</h2><p>…</p><ul><li>…</li></ul>
    <table><thead><tr><th>Data</th><th>Why</th></tr></thead><tbody><tr><td>…</td><td>…</td></tr></tbody></table>
  </article>
</div></section>
```
72ch column, 1.7 line-height, real bullets/numbers, underlined links, bordered tables. `.prose-wrap` is a lighter padding wrapper if `.section` feels too tall.

### Images
Files: `public/images/<slug>-<width>.webp`. Manifest: `raw-images/manifest.json` → `images[]` with `slug`, `alt`, `category`, `aspect` (w/h) and `generated[]` (exact `width`/`height`/`file`) — take `width`/`height` from there. Pattern: `src` = largest file, `srcset` = every width, `sizes` matched to the layout, `loading="lazy" decoding="async"`; the one hero image per page gets `fetchpriority="high"` and no `loading`. Use the manifest `alt` as the baseline.
Slugs by category (widths · w×h of the largest):
- exterior / power washing: `lakeside-cabin-deck-after-power-washing` (480/800/1024 · 1024×768), `log-cabin-siding-after-power-washing` (480/800/1024 · 1024×768), `cabin-deck-stairs-after-power-washing` (480/768 · 768×1024), also `lakeside-deck-fire-table-after-power-washing`, `cabin-deck-wicker-sofa-after-power-washing`, `cabin-deck-dining-area-after-power-washing`, `deck-power-washing-project-collage` (480/800/1200 · square), `dock-power-washing-in-progress`, `lakeside-dock-steps-after-power-washing`, `lakeside-cabin-deck-lounge-after-power-washing` (480/768 portrait).
- interior: `white-kitchen-quartz-island-after-cleaning`, `living-room-sectional-after-cleaning`, `master-bedroom-swan-towels-after-cleaning` (480/800/1024 · 1024×768); also `living-room-slat-wall-tv-after-cleaning`, `bedroom-hardwood-floor-after-cleaning` (same), `bathroom-hex-tile-after-deep-cleaning`, `small-bedroom-gray-bedding-airbnb-turnover` (480/768 · 768×1024).
- Airbnb / turnover: `guest-bedroom-towel-animals-airbnb-turnover`, `bedroom-white-bedding-towel-animals-airbnb`, `guest-bedroom-blue-curtains-airbnb-turnover` (480/800/1024 · 1024×768), `bedroom-navy-bedding-airbnb-turnover` (480/768 · 768×694).
- before/after pairs (same aspect): `bathtub-wide-{before,after}-deep-cleaning` (480/774 · 774×719), `bathtub-closeup-{before,after}-deep-cleaning` (480/662 · 662×719), `bathtub-shower-{before,after}-deep-cleaning` (480/768 · 768×1024). Skip `bathroom-tub-and-toilet-before-cleaning`.
- painting: `interior-painting-prep-crew`, `kitchen-masked-for-interior-painting` (480/768 · 768×1024), `hallway-wall-trim-fresh-paint` (480/576 · 576×1024).
- team / vehicle: `owner-portrait-suit`, `owner-portrait-outdoors` (480/800 · 800×1200), `nsa-cleaning-branded-company-car` (480/800/1024 · 1024×1024). Map: `service-area-map-albany-to-lake-george` (800/1024 · 1024×1536). Logo: `/images/logo-nsa-cleaning-320.webp` / `-640.webp`.
No stock photos, no external images, no invented slugs.

## 3. Page recipes

Filename = slug: `src/pages/deep-cleaning.html` → `/deep-cleaning` → `dist/deep-cleaning/index.html`. `404.html` → `/404` → `dist/404.html` (it already exists with a placeholder body — replace the body, keep `"noindex": true`). The path derives from the filename; never set `"path"`. Section ids + `aria-labelledby` must be unique within the page. Every page: one H1, ends with `.cta-band` (except legal), carries the quote CTA (`{{site.quoteHref}}` + `data-quote-open`), links to `/pricing` where price is mentioned, its hub and its siblings.

### (a) Service page — /recurring-cleaning, /deep-cleaning, /move-in-move-out-cleaning, /airbnb-cleaning, /post-construction-cleaning, /commercial-cleaning, /power-washing, /carpet-cleaning, /painting
1. `section.page-hero.page-hero--photo` — eyebrow "Residential · Albany to Lake George" (or Commercial / Exterior), H1 = keyword + place, `.lead`, `.hero-cta`, `.hero-note`, manifest photo for that service.
2. `section.section` "What's included" — `.section-head` + `.why-list` (tasks, `#i-check`/`#i-sparkle`) **or** `.bento` of 3–4 `.tile`s when there are sub-options (deep vs full deep; weekly / bi-weekly / monthly → use `.plans` on /recurring-cleaning).
3. `section.section.section-alt` "Who it's for" — `.section-head.center` + `.chips`, or a short `.why-list`; commercial: `.facilities` + `.badge-247` inside a `section.section.commercial.on-dark` (copy from home).
4. `section.section` "Real results" — `.ba-grid` + `.compare` when a before/after pair fits (deep, move-out, post-construction), otherwise `.gallery` of 2–4 real photos with captions.
5. `section.section.section-alt` "Pricing" — `.price-note` (recurring) or `.section-head` + `<p>` "Quoted individually, free quote, supplies and travel included" + `.actions` → `/pricing` and the quote CTA.
6. `section.section` FAQ — `.faq-grid`, 4–6 `<details>` specific to the service (CONTENT.md facts only).
7. `section.section.cta-band.on-dark`.

### (b) Hub page — /residential-cleaning, /services
1. `.page-hero` (photo optional) 2. `section.section` — `.section-head.split-head` + `.bento` with one `.tile` per child page (photo tiles for the strongest, `.tile-wide`/`.tile-lg` for the featured one, `.tile-cta` last) 3. `section.section.section-alt` — `.section-head.center` + `.why-list` (4 items) 4. `.cta-band`.

### (c) /contact
`.page-hero` (no photo, no buttons: eyebrow, H1 "Contact NSA Cleaning, Free Cleaning Quote in Albany, NY", `.lead`), then one `section.section` with a two-column grid via page `<style>`: `.contact-grid{display:grid;gap:36px}@media(min-width:900px){.contact-grid{grid-template-columns:1.1fr .9fr;gap:56px;align-items:start}}`. Left: the quote call to action (`.btn.btn-primary.btn-lg` with `data-quote-open`) plus a short paragraph on what happens after. Right: a details block — `<address>` with street/city/region/postal, both phones (`phone2` appears only here and in the footer), email, hours (residential / commercial), languages, Facebook (`rel="noopener" target="_blank"`), "Serving Albany to Lake George — about 1 hour from Watervliet" + `.link-arrow` → `/service-area`. **No map iframe** (the static map image is OK). Ends with a `.cta-band` carrying the same quote button.

### (d) Legal — /privacy-policy, /terms-and-conditions
`section.section` > `.container` > `article.prose` only (H1, `.meta` effective date, H2/H3, lists, optional table). No hero, no images, no CTA band. Content: what the quote form collects and why, cookie consent (analytics only after consent), cancellation 24h / 30% fee, satisfaction guarantee per service contract, contact details.

### (e) /404 and /thank-you
Short and centered: `section.section` > `.container` > `.section-head.center` with `<p class="eyebrow">` + `<h1>` + `<p>`, then `.cta-actions`. Page `<style>`: `.section-head h1{font-size:var(--step-3);margin-bottom:14px}`. 404: "Page not found" → buttons Home (`/`), All services (`/services`), Get a Free Quote. Thank-you: "Thanks — we got your request. We reply by phone or email." → Call button + Back to home; no form.

### Front-matter examples
Service page (BreadcrumbList + Service):
```json
{ "title": "Deep Cleaning Service in Albany, NY | NSA Cleaning LLC",
  "description": "Deep and full deep cleaning for homes from Albany to Lake George, NY. Insured team, supplies and travel included. Get a free quote from NSA Cleaning LLC today.",
  "priority": 0.8,
  "schema": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nsacleaningllc.com/" },
      { "@type": "ListItem", "position": 2, "name": "Residential Cleaning", "item": "https://nsacleaningllc.com/residential-cleaning" },
      { "@type": "ListItem", "position": 3, "name": "Deep Cleaning", "item": "https://nsacleaningllc.com/deep-cleaning" } ] },
    { "@context": "https://schema.org", "@type": "Service", "name": "Deep Cleaning", "serviceType": "Deep cleaning",
      "url": "https://nsacleaningllc.com/deep-cleaning",
      "description": "Detailed top-to-bottom cleaning for homes and apartments in the Albany, NY area.",
      "provider": { "@id": "https://nsacleaningllc.com/#business" },
      "areaServed": { "@type": "AdministrativeArea", "name": "Albany to Lake George, NY" } } ] }
```
/faq (FAQPage — questions/answers must match the visible `<details>` text):
```json
{ "title": "Cleaning FAQ — Pets, Supplies, Cancellations | NSA Cleaning LLC",
  "description": "Answers about pets, supplies, cancellations, tips and damage from NSA Cleaning LLC, serving Albany to Lake George, NY. Still unsure? Get a free quote.",
  "priority": 0.6,
  "schema": [ { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
    { "@type": "Question", "name": "Are pets okay during a cleaning?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We prefer pets in a crate or a closed room while we work, but friendly pets are fine — we work it out with each client." } } ] } ] }
```
/contact ("@business" + ContactPage):
```json
{ "title": "Contact NSA Cleaning LLC — Free Quote in Albany, NY",
  "description": "Request a free cleaning quote from NSA Cleaning LLC in Watervliet, NY. Call (518) 902-1180 or send the form — we reply by phone or email. Albany to Lake George.",
  "turnstile": true, "priority": 0.9,
  "schema": [ "@business", { "@context": "https://schema.org", "@type": "ContactPage", "name": "Contact NSA Cleaning LLC", "url": "https://nsacleaningllc.com/contact", "about": { "@id": "https://nsacleaningllc.com/#business" } } ] }
```
Legal: `{ "title": "Privacy Policy | NSA Cleaning LLC", "description": "How NSA Cleaning LLC handles the details you send through our quote form and website, and how cookies are used. Questions? Call (518) 902-1180.", "noindex": false, "priority": 0.3, "changefreq": "yearly" }`
/thank-you: `{ "title": "Request received | NSA Cleaning LLC", "description": "Your quote request was sent to NSA Cleaning LLC. We reply by phone or email.", "noindex": true }`
Optional keys: `"ogImage"` (must be 1200×630 — otherwise omit), `"changefreq"`, `"bodyClass"`, `"extraHead"` (raw HTML).

## 4. Rules

### Content
- Every fact, number, price, policy, city and service name comes from `docs/CONTENT.md`. The service list is closed. Don't invent response times, counts, certifications, guarantees or extra services.
- Forbidden: star ratings, review counts, awards, "#1", "top rated", "best in Albany", "licensed", "bonded", "eco-/green-certified", "background-checked", client/cleaning counts, testimonials or quotes with names, "same-day", "24/7" for residential (24/7 is commercial only), "free travel anywhere" (it's "travel included, up to about 1 hour from Watervliet"), naming which owner is in which photo (unconfirmed — say "one of the owners").
- **Punctuation: no em-dashes (—) and no en-dash used as punctuation.** They are the clearest tell of machine-written copy and the client asked for them to be gone. If a sentence needs one, the sentence is doing too much: split it in two, or use a comma. Do not swap the dash for a semicolon or a parenthesis, that is the same problem wearing a different hat. Hyphens inside compound words (move-in, bi-weekly, top-to-bottom, walk-through, I-87) are fine. No exclamation marks. No rhetorical questions as headings.
- **Run `npm run lint:copy` before committing copy.** `scripts/check-copy.mjs` fails on em-dashes, exclamation marks, forbidden claims and a list of generic AI phrases ("elevate", "seamless", "hassle-free", "peace of mind", "look no further", "when it comes to", …), and warns on "whether you're X or Y" and "not just X, it's Y".
- Tone: friendly, confident, plain English, "we" voice, short sentences. Title `{Topic} in Albany, NY | NSA Cleaning LLC` (≤60 chars); description 140–160 chars with a city, a benefit and a call to action. Languages line: "English, Portuguese and Spanish" or `<span lang="es">Hablamos español</span> · <span lang="pt">Falamos português</span>`.

### Headings
- Exactly one `<h1>`, containing the primary keyword + place (e.g. "Deep Cleaning Service in Albany, NY"); `<em>` inside it is fine.
- h1 → h2 (one per section) → h3 (cards/items). Never skip levels. `<section aria-labelledby="<h2 id>">`, or `aria-label` when there is no heading. Ids unique per page.

### Links
- Primary CTA on every page: **Get a Free Quote** as `<a href="{{site.quoteHref}}" data-quote-open>`, which opens the GoHighLevel modal. Secondary: the phone link. Never write a `<form>` into a page and never link to `#quote`.
- Link `/pricing` wherever a price is mentioned; link the parent hub (`/residential-cleaning` or `/services`) and 2–3 sibling services; `/service-area` when cities are listed.
- Allowed internal paths (root-relative, no trailing slash, no `.html`): `/` `/residential-cleaning` `/recurring-cleaning` `/deep-cleaning` `/move-in-move-out-cleaning` `/airbnb-cleaning` `/post-construction-cleaning` `/commercial-cleaning` `/services` `/power-washing` `/carpet-cleaning` `/painting` `/pricing` `/service-area` `/about` `/faq` `/contact` `/thank-you` `/privacy-policy` `/terms-and-conditions`, plus the quote CTA (`{{site.quoteHref}}` + `data-quote-open`, which resolves to the GoHighLevel URL), `tel:`, `mailto:{{site.business.email}}` and `{{site.business.facebook}}` (`rel="noopener" target="_blank"`). Nothing else — no external links, no `#` placeholders.

### Images & alt text
- Only slugs from `raw-images/manifest.json`; never external/stock images or invented filenames. Alt = what is visible (room, surface, state: "… after deep cleaning"), specific and short, no "image of", no keyword stuffing, no people's names. Before/after pairs say "before" / "after". Decorative or repeated images: `alt=""`.
- One `fetchpriority="high"` image per page (the hero); all others `loading="lazy" decoding="async"`; always `width`/`height` from the manifest.

### Accessibility
- Every control has a `<label for>`; icons `aria-hidden="true"`; icon-only links get `aria-label`; keep the global focus ring (never `outline:none`); tap targets ≥44px; `lang` attributes on non-English text; no text inside images.
- Known-good contrast pairs: white on `--blue`, `--blue-dark`, `--navy`; `--ink`, `--ink-2`, `--navy`, `--blue-dark` on white / `--bg` / `--bg-2` / `--tint`; `--tint-2` and `--sky` on `--navy` (text ≥ .9rem); `--muted` on white/`--bg-2` only. Never `--blue` text below 1.25rem on white, never `--yellow` text on white, never text over photos without the `.tile-photo` gradient.
- Reduced motion is handled globally — don't add animations or transitions.

### Page-specific CSS
Only a single `<style>` block at the top of the page body (the build hoists it into `<head>`), ≤ ~1 KB, scoped to a page-unique class (e.g. `.contact-grid`), using tokens (`var(--…)`) and the shared breakpoints (600 / 800 / 900px). No `!important`, no new colors or fonts, no restyling of shared classes. **Never edit** `src/styles.css`, `src/layout.html`, `src/partials/*`, `site.config.json`, `public/main.js`, `build.mjs`.

### Preview & checks (use your own OUT_DIR and port so agents don't collide)
```sh
BUILD_TOLERANT=1 OUT_DIR=/tmp/nsa-deep node build.mjs           # skips pages that fail to parse
node scripts/serve.mjs --root /tmp/nsa-deep --port 4110 &        # static preview (API → 501)
node scripts/shot.mjs http://localhost:4110/deep-cleaning docs/shots/deep-cleaning.png --full
node scripts/shot.mjs http://localhost:4110/deep-cleaning docs/shots/deep-cleaning-mobile.png --mobile --full
npx --no-install html-validate /tmp/nsa-deep/deep-cleaning/index.html
```
`shot.mjs` prints `horizontalOverflow` (must be `false`) and `errors` (must be `[]`). Check both 1440px and mobile shots; verify the H1, CTA links, `<details>` and images render. Never commit `dist/`; the final `node build.mjs` (no env vars) must pass for every page.
