# Design System

Source of truth: `public/assets/css/site.css`. See also `README.md` for the file layout and
deploy notes.

This site is a **separate visual system from the Caspian ERP application**. It shares the brand —
the same indigo primary, the same slate neutrals, the same lightning mark — but nothing else: no
Tailwind, no React, no shared classes, no shared components. Do not import application patterns
here, and do not copy marketing patterns (the paper hero, inset dark sections, scroll reveal,
48px pill buttons) into the app. The app keeps its own `DESIGN.md` in
[CaspianOS-App](https://github.com/CaspianTools/CaspianOS-App).

> **This file is the single source of truth for this site's design.** Whenever you create or edit
> anything visual here, read it first and keep it in sync. Do not start a competing design doc.

### Why it is separate

The app is a dense, information-first tool optimised for people who use it all day. The marketing
site is a low-density, persuasion-first page optimised for someone who has never seen the product.
Same brand, different job. Keeping them apart means a change to app chrome can never break the
public site, and the site ships with no build step at all.

### The look, in one paragraph

Editorial and flat. Big, tight, left-aligned headlines; every control is a pill; every surface is
a large-radius card that rests without a shadow and lifts on hover; dark blocks are **inset from the
viewport edge and rounded** rather than full-bleed bands; soft sections are warm cream rather than
cool grey; the home hero is a flat block on a paper-white ground that the header shares. Colour is used sparingly —
solid indigo for the primary action and the highlighted words, near-black for the dark blocks, and
the status tints only where they mean something. There are no gradients on text or buttons.

### Tokens (all defined as CSS custom properties on `:root`)

- **Brand:** `--indigo-600 #4f46e5` (primary, matches the app's `indigo-600`), `--indigo-500 #6366f1`,
  `--violet-500 #8b5cf6`, `--cyan-500 #06b6d4`. The primary is used **solid**: buttons, the active
  nav pill, the eyebrow tile, the highlighted words in a hero `<h1>` (`.grad`, kept as a class name
  but now a flat colour) and the "Most popular" pricing pill. The logo mark keeps its gradient.
- **Neutrals:** the same slate ramp as the app (`--slate-50` … `--slate-900`), plus `--ink #0e0f13`
  for dark sections, the footer and the app-mock frame, `--ink-2 #17181e` for cards on ink,
  `--cream #f7f2ec` for soft sections and `--paper #f9f8fb` for the home hero's ground.
- **Accents (status/category tints only):** `--emerald-500`, `--amber-500`, `--rose-500`, `--teal-500`.
  The collage badge in a split section is the one place emerald is used as a fill.
- **Radii:** `--r-sm 10` / `--r-md 14` / `--r-lg 20` / `--r-xl 28` / `--r-2xl 36` / `--r-pill`. Cards,
  tiles and panels are `--r-xl`; dark sections and the footer `--r-2xl`; buttons,
  chips, nav links and the filter tabs are pills.
- **Shadows:** `--shadow-xs/sm/md/lg` plus `--shadow-brand` (the indigo glow under primary buttons).
  Surfaces rest flat and take `--shadow-md` on hover; only the mock and the collage overlays rest with
  a shadow.
- **Layout:** `--container 1240px`, `--gutter 24px`, `--nav-h 64px`, and `--inset` — the gap between a
  dark block and the viewport edge (`clamp(10px, 1.6vw, 24px)`).
- **Type:** Inter (Google Fonts) with a full system-font fallback stack. Headings use `clamp()` so
  every size is fluid, with tight tracking (`-0.04em` to `-0.05em`) and `text-wrap: balance`;
  body is 16px/1.65.

### Structure

- **Sections** are `.section` (fluid 64–120px block padding) or `.section-tight`; `.section-soft`
  puts a section on `--cream`. Long pages alternate white / cream / dark so no two adjacent
  sections share a background.
- **Section headings** use `.section-head` — **left-aligned by default**, max 760px, with an
  optional `.eyebrow` above the `<h2>` and a muted paragraph below. `.section-head.center` centres
  it; `.section-head.split` is the magazine layout: heading in the left column, paragraph (and
  optionally a `.row` of actions) bottom-aligned in the right.
- **The eyebrow** (`.eyebrow`) is a kicker, not a pill: a 26px indigo tile holding the icon, an
  optional `<span class="num">01</span>` section number, then a short label. Home-page sections
  are numbered 01–08 in reading order.
- **Cards** are `.card` (+ `.card-pad`, + `.card-interactive`, which darkens the border on hover).
  Same idea as the app's card class, different implementation — the two are never shared.
- **Buttons** are pills: `.btn` + one of `.btn-primary` (solid indigo + brand shadow),
  `.btn-secondary` (white + border, border goes ink on hover), `.btn-ghost`, `.btn-dark`,
  `.btn-onDark`, `.btn-outline-onDark`, sized with `.btn-lg` / `.btn-sm` / `.btn-block`. Height is
  48px (56px for `-lg`) — deliberately larger than the app's controls. Primary calls to action end
  with the diagonal arrow icon. `.btn-round` is the circular icon-only button (carousel arrows).
- **Dark sections** (`.dark-section`) are inset by `--inset` on both sides, rounded to `--r-2xl`
  and flat `--ink` — no glow, no grid. Cards inside them are `.dark-card`, `.tile` (module tile
  with a corner arrow that turns diagonal on hover) or `.role-card`, never `.card`. `.dark-feature`
  is the wide two-column banner card at the end of a dark section.
- **The header** is **flat**: `.site-header` is sticky at the top with a transparent background,
  no border and no shadow, so it sits on whatever ground the page starts with — the `--paper` hero
  on the home page, white elsewhere. Once scrolled (`.is-stuck`) it takes a translucent white
  ground and a hairline so it stays legible over dark sections. `.nav` is a three-track grid
  (`1fr auto 1fr`): brand left, `.nav-links` centred, `.nav-actions` right. The current page's link
  is a filled indigo pill (`aria-current="page"`). Below 900px the middle track is empty and
  collapses, leaving the brand and the round menu button at the edges; the mobile drawer is a
  rounded card below the bar. There is no announcement bar.
- **The language menu** (`.lang`) sits in `.nav-actions`, left of the sign-in button, at every
  breakpoint — it is the only way to change language, so it never collapses into the drawer. It is a
  native `<details>`: `.lang-button` is the pill `<summary>` (globe, the uppercase code, a chevron
  that rotates when open), and `.lang-menu` is the absolutely positioned card of `.lang-option`
  links, with the current language marked `aria-current` and tinted `--indigo-50`. The drawer
  repeats the same links as `.mobile-lang`, a wrapping row of outlined pills under a small
  uppercase label. Both regions are **generated** — see README's i18n section — so never hand-edit
  them in a page.
- **The footer** (`.site-footer`) is a dark rounded card, inset like a dark section, and it carries
  the site's closing call to action: `.footer-hero` (kicker, oversized `<h2>`, paragraph and two
  buttons) above the five-column `.footer-grid` and the `.footer-bottom` bar. Because the footer
  is the CTA, pages no longer end with a separate dark CTA band. The brand column holds the logo
  alone — no tagline, no credit paragraph.
- **Breadcrumbs** (`.breadcrumb`) sit above the `<h1>` on the per-module pages only, left-aligned
  to match the hero. Links are indigo; the chevron is `--slate-300`.
- **Cross-module links inside a dark section** use `.link-arrow`, which is re-coloured to `#c7d2fe`
  under `.dark-section` so it stays legible on `--ink`.
- **Icons** are inline `<svg>` with `stroke-width="2"` in the Lucide idiom (the app uses the real
  `lucide-react` package; this site has no dependencies, so the paths are inlined). Icons in a
  tinted square use `.icon-tile` with a tint modifier (`.t-emerald`, `.t-cyan`, `.t-violet`,
  `.t-amber`, `.t-rose`, `.t-slate`, `.t-teal`), `.sm` for the 36px variant.

### Home page

The home page follows a fixed rhythm, and every section is numbered in its eyebrow:

1. **Paper hero** — `.hero-home` paints the `--paper` ground full-bleed and pulls it up behind the
   transparent header (negative top margin equal to `--nav-h`), so header and hero read as one
   surface. Inside, `.hero-frame` holds a two-column `.hero-grid`: copy on the left, the `.bento`
   on the right, and the `.ticker` of module names along the bottom edge, under a hairline. The bento is three true things: `.bento-stat` (module count and short shared-records copy), `.bento-panel` (a permits list, `role="img"`), and `.bento-side`
   (a `.bento-note` and the `.bento-pill` link). The ticker is a static wrapping list, its
   second list is `aria-hidden`, and its duplicate is hidden.
2. **Connected** (cream) — a `.split` with a `.collage` (panel + floating `.collage-badge` +
   `.collage-note`) beside the copy.
3. **Modules** (dark) — twelve `.tile`s in a `.grid-3`.
4. **How it works** — copy beside an `.accordion` of `<details name="how">`, one open by default.
5. **The process** (cream) — a `.scroller` of `.step-card`s with scroll-snap; the arrows in
   `.scroller-nav` are hidden until JS adds `html.js`.
6. **Who it is for** (dark) — six `.role-card`s and a `.dark-feature` banner.
7. **Go deeper** — three `.link-card`s with coloured `.link-cover`s standing in for photos.
8. **FAQ** (cream) — copy beside the `.faq` accordion.

### Per-module pages

Each of the twelve pages under `/modules/` uses the same section order, and the order is the
argument: hero → app mock → the problem → what it does → process flow → every tool → how it
connects (dark) → who uses it → what you can configure → FAQ → CTA band (dark). Backgrounds
alternate white / soft / dark so no two adjacent sections share one.

- The **app mock** (`.mock-*`) sits in an 8px ink frame with a 36px radius — the one device
  frame on the site — with the module's own sidebar and six `.mock-card`s. It is `role="img"` with a
  descriptive `aria-label`, and its interior is `aria-hidden`.
- The **configure** section pairs a `.check-list` with a `.panel` + `.table-mock` settings table.
  Every page ends that section with a link to `/modules/administration`.
- The **connects** section is the page's single dark section, and always links to three other
  module pages. The footer supplies the closing call to action.
- These pages were generated once from a script and are now **hand-edited like every other page**.
  There is no generator in this repository, and there should not be one — that is the same reason
  the header and footer are duplicated rather than templated.

### Motion & elevation

Restraint is the rule: nothing moves more than a few pixels, and nothing animates for longer than
about 0.6s. All of it lives in §20 of `site.css`.

- **Surfaces rest flat and lift on hover.** `.card`, `.industry-card`, `.price-card`, `.stat`,
  `.step-card` and `.flow-step` transition `transform`, `box-shadow` and `border-color`. The
  default lift is `translateY(-3px)` to `--shadow-md`; `.card-interactive` and the featured price
  card go further, to `-5px` and `--shadow-lg`. `.panel` frames data, not links, so it stays put.
- **Icon tiles answer their card** — a card hover nudges its `.icon-tile` up 2px and scales it to
  1.06. The tile itself is never the hover target.
- **Buttons press.** `-1px` on hover, back to `0` on `:active`, and `.btn-primary` deepens its
  brand glow.
- **Entrance is two mechanisms, not one.** The hero animates with pure CSS keyframes
  (`caspian-rise`) on `.hero .container > *` (the copy column's children on the home page),
  staggered 0.02s–0.31s, so it runs with JavaScript disabled. Everything below the fold uses `.reveal`, which needs JS and therefore needs the
  `<noscript>` override in the page head.
- **Grid siblings stagger.** `.grid > .reveal:nth-child(n)` adds 0.06s per card, capped at 0.36s
  from the seventh onward so a twelve-card grid does not crawl.
- **`prefers-reduced-motion` zeroes durations *and* delays.** Zeroing only the duration leaves a
  staggered card waiting a third of a second before appearing instantly, which reads as a bug.

### Rules

- **Language switching works with JS off.** The menu is a `<details>` full of ordinary links; JS
  only adds the click-outside/Escape close and remembers the choice. Never make a language reachable
  only through script.
- **JavaScript is an enhancement, never a requirement.** Every page must render, read and navigate
  with JS off. `public/assets/js/site.js` only adds the `html.js` marker, the sticky-header
  shadow, the mobile drawer, the module filter tabs, scroll reveal, the scroller arrows, the
  email draft composer and the footer year. Anything that hides content until JS runs
  (`.reveal`) **must** have a `<noscript>` override in the page head; anything that only works
  with JS (the scroller arrows) is hidden until `html.js` is present, never the other way round.
- **No inline icon lists inside a flex `<li>`.** `.check-list` and `.price-features` position their
  tick icon absolutely, because `display:flex` on the `<li>` turns an inline `<strong>` into its own
  flex item and shatters the sentence. Keep it that way.
- **Wide content scrolls inside its own container** (`.table-scroll`); the page body never scrolls
  horizontally.
- **One `<h1>` per page**, and a `.skip-link` before the header on every page.
- **Bump the asset version when you edit this stylesheet.** `site.css` is served immutable for a
  year, so every page links it as `?v=<date>` and all pages must agree. `check-assets.mjs`
  enforces it; forgetting means returning visitors render new HTML against old CSS.
- **Escape bare ampersands** in copy (`&amp;`). Several module names contain one
  ("Departments &amp; Tools", "Logistics &amp; Fleet") and a raw `&` is invalid HTML.
- **Google Analytics is the only third-party script, and it is behind consent.** The external
  requests are the Inter webfont and the GA4 tag (`G-14GPENV8PG`). The tag lives in
  `public/assets/js/analytics.js` — a file, not Google's inline snippet, because `script-src`
  carries no `'unsafe-inline'` and the browser would refuse to run it — and **no page includes it
  directly**. Pages load `public/assets/js/consent.js`, which injects it only after a visitor
  accepts; reject, or never answer, and Google is never contacted. Adding any other tracker, embed
  or A/B tool is an owner decision. Three things move together with it: the CSP in `firebase.json`,
  which is what actually permits the tag; `/privacy`, which must keep describing what is set; and
  the consent gate, which must keep being the only thing that loads the tag.
- **Claims must be true.** No invented customer logos, testimonials, certifications or metrics —
  the numbers in the hero bento come from the actual module and tool counts, the ticker lists the
  real modules, and the "who it is for" cards describe roles, not customers. The reference layout
  this design follows has a logo marquee and a testimonial grid; those were deliberately replaced
  with the module ticker and the role cards rather than filled with placeholders.


### Marketing audit update (2026-09-06)

- Primary acquisition actions request a demo; sign-in links open the application. Documentation
  and the admin portal are linked from the footer, with docs also in the mobile menu.
- Pricing shows the three decided tiers — Demo (free), Paid (per active user per month, every
  module, plus VAT; the figure is live from the app) and Enterprise (talk to us) — in the existing
  `.price-grid`, with Paid as the featured card. No trial durations or implementation-time promises.
- The home hero introduces industrial and field operations. Tool-count bars are removed;
  the module ticker is a static wrapping list. Product representations carry sample-data labels.
- The email composer validates and previews a draft, then offers explicit email and copy actions.
  It does not send or store leads. No-JS visitors get a direct email link and visible mobile nav.
- Manual scroller controls respect reduced-motion preferences; form anchors clear the header.
