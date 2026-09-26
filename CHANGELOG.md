# Changelog

All notable changes to the Caspian ERP marketing site are documented in this file.

## [Unreleased]

### Changed
- **`/pricing` shows the three decided tiers, with the live price** (owner, 2026-09-26). The page
  had invited enquiries while no price was decided. Now: **Demo** — free, the open demo company in
  the app; **Paid** — one price per active user per month, every module included, VAT added on top;
  **Enterprise** — talk to us. A new FAQ answers who counts as a user, whether every module is
  included, VAT, trying first, migration and when Enterprise fits; the home page's pricing card and
  the page's meta description say the same.
  - **The figure is never written into a page.** The owner sets it in the admin panel (Plans →
    Paid); the app publishes it at `https://app.caspianerp.com/api/public/site`, and the new
    `assets/js/pricing.js` fills it in, formatted for the page's language. A price change therefore
    reaches all seven languages within minutes, with no edit here.
  - Without JavaScript, or with the app unreachable, the card reads "Priced per active user, per
    month, plus VAT" — true whatever the figure is. The request carries no cookie or identifier.
  - `connect-src` in the CSP now allows `https://app.caspianerp.com`, for that one request.
  - Thirty translations for the removed enquiry copy are gone from the dictionaries; the sitemap's
    `lastmod` is 2026-09-26.
  - The "Develop the pricing model" entry left `future.md`; how clients pay is still open, as
    CaspianERP-App#694.

### Added
- **A cookie consent banner, and Google Analytics behind it** (CaspianOS-App `TODO.md` → **T27**,
  the owner chose the banner over Consent Mode). GA4 shipped on 2026-09-10 with the plain tag: it
  set cookies and sent data on the first pageview, before any visitor had agreed. The site is served
  in German, French and Norwegian, so EEA visitors are expected, and there consent comes *before* a
  non-essential cookie — disclosure on `/privacy` is not consent.
  - **Nothing loads until someone says yes.** No page includes `analytics.js` any more; every page
    loads `assets/js/consent.js`, which injects the tag only once consent exists. Reject, or simply
    never answer, and Google is not contacted at all — no request, no cookie, no data.
  - Loading the tag in a cookie-less mode and asking afterwards was the cheaper option and was not
    taken: it still contacts Google on the first pageview, which is the thing being consented to.
  - **Reject is first, and the same size as Accept.** The cheaper choice for the visitor is not the
    harder one to reach; a banner that buries Reject is the pattern regulators single out.
  - **With JavaScript off no banner appears** — analytics cannot run and no cookie can be set, so
    there is nothing to consent to. That is the correct outcome, not a gap.
  - The answer is remembered in `localStorage`, **not a cookie**. A cookie recording that you
    refused cookies is a poor joke, and this is storage a visitor can clear with the rest of the
    site — doing so makes the banner ask again.
  - The banner is a pinned strip rather than a full-screen interstitial, so a visitor can read the
    page they came for while deciding. Seven languages, from the page's own `lang`.
  - `/privacy` rewritten in all seven languages to say the tag asks first and that refusing means
    Google is never contacted. `CLAUDE.md`, `README.md` and `DESIGN.md` now record that
    `consent.js` must remain the only thing that loads the tag — putting a `<script src>` for
    `analytics.js` back into a page would silently undo the gate.


### Changed
- **Google Analytics 4 is installed** (`G-14GPENV8PG`), on the owner's instruction. It replaces the
  standing "no third-party scripts, trackers or cookies" rule, which now reads as "GA is the only
  one" in `CLAUDE.md`, `README.md` and `DESIGN.md`.
  - **It is a file, not the pasted snippet.** Google hands you two inline `<script>` blocks; this
    site sends `script-src 'self'` with no `'unsafe-inline'`, so a browser would refuse to run
    them. `public/assets/js/analytics.js` runs the same commands in the same order and is the one
    place that knows the measurement ID.
  - **The CSP in `firebase.json` had to open up**, or nothing loads at all:
    `script-src` gains `https://*.googletagmanager.com`, `img-src` the two Google hosts, and an
    explicit `connect-src` replaces the inherited `default-src 'self'` that was silently blocking
    every measurement beacon. Verified in Chromium against the real header — `gtag()` defined,
    both commands queued on `dataLayer`, `gtag.js` requested, zero CSP violations, on an English
    page and a generated German one.
  - **Deferred on purpose.** `lang.js` may redirect an unprefixed URL to the visitor's language
    before the page paints; a deferred script has not run by then, so someone who lands on
    `/pricing` and is sent to `/de/pricing` is counted once, on the page they actually read.
  - **`/privacy` now says what is set**, in all seven languages, because the site cannot claim it
    sets no tracking cookies while GA sets them. The cookies section describes the first-party
    cookies, what is reported and what blocking them does, and Google Analytics joins the list of
    processors. The sentence about the application's necessary storage is unchanged, wording
    included.
- **Owner items now go to CaspianOS-App's `TODO.md`, and `CLAUDE.md` says so.** Anything only the
  owner can do — a console or DNS step, a credential an assistant must never hold, a decision the
  code cannot make — is recorded in that repository's `TODO.md`, the single queue for the
  application, the platform cockpit and this site. Saying it in a session is not handing it over:
  sessions end, and the item is then rediscovered weeks later by a session that has no idea it was
  already raised. There is deliberately **no `TODO.md` here**; work that is merely unstarted stays
  in `future.md`.
  - **The pricing model went across as `T26`.** Recorded there because it stopped being a marketing
    question: the cockpit can now create Stripe prices, and there are no agreed amounts to create
    them with, so it is the first blocker in the money chain. The scoping stays in `future.md` →
    "Develop the pricing model"; the decision itself is now queued where the owner will see it
    alongside the rest of the billing work.

### Added
- **The site ships in seven languages** — English, Azerbaijani, Turkish, Russian, Norwegian
  (bokmål), German and French, the same list the application supports. Every page exists at
  `/<lang>/…` (English stays at the root), fully translated including titles, meta descriptions,
  `aria-label`s and the strings `site.js` writes into the page.
- **A language menu in the header and the mobile drawer.** It is a native `<details>` full of
  ordinary links, so switching language needs no JavaScript; `site.js` only adds the
  click-outside/Escape close and remembers the choice in `localStorage`.
- **Automatic adaptation to the browser's language.** `public/assets/js/lang.js` runs before the
  page paints and redirects an *unprefixed* URL to the visitor's language — a remembered choice
  first, then `navigator.languages` (once per visit). A URL that names its language is never
  overridden, so shared links and crawlers keep working, and the redirect target is always
  prefixed, which makes a loop impossible.
- **`hreflang` alternates on every page**, including `x-default` pointing at English, and a
  sitemap listing all 147 URLs across the seven languages.
- **An i18n pipeline with no runtime cost.** `scripts/i18n-extract.mjs` collects every translatable
  string from the English pages into `i18n/_catalog.json`; `scripts/i18n-build.mjs` generates
  `public/<lang>/` and `sitemap.xml` from `i18n/<lang>.json`; `scripts/check-i18n.mjs` fails CI on
  an untranslated string, a stale generated page or an orphaned file. Generated output is committed,
  because Firebase Hosting serves the repository as-is.

### Changed
- **Links into the application carry the visitor's language.** A localized page's *Sign in* links
  now point at `https://app.caspianerp.com/<lang>/welcome` instead of the bare host. The
  application reads a `/{lang}/` prefix from its own URL and redirects every unprefixed URL to
  `/en/…`, so a bare link silently dropped the language the visitor had just chosen. English pages
  keep linking to the bare host. The application's list of languages matches the site's, so every
  prefix the generator writes is one the app understands.
- **`site.js` no longer hard-codes English.** The drawer's labels and every string the email
  composer writes now come from `data-text-*` attributes on the markup, and the contact form's
  preselected enquiry is matched by `data-interest` rather than by its visible text — so both work
  in a translated page.
- **`check-links.mjs` resolves directory indexes** (`/az` → `public/az/index.html`), matching how
  hosting actually serves the localized trees. Verified against the hosting emulator.
- **Corrected the language claims.** The home page, the Administration module page and its settings
  mock said five languages and listed the old set; all now say seven and name them.
- **Asset version bumped to `20260908`**, and `lang.js` joined the versioned-asset check.

### Changed
- **Rebranded from CaspianOS to Caspian ERP.** The wordmark, every page title, the copy, the
  Open Graph image, the sitemap and the canonical URLs now say Caspian ERP and `caspianerp.com`.
  The repository names and the `caspianos` Firebase project are unchanged.
- **Dropped `caspianos.io` everywhere.** The domain is no longer ours: the application now lives at
  `app.caspianerp.com` (every sign-in, sign-up and free-trial link, and the deep links on the
  module pages), the mailboxes are `hello@`, `support@`, `security@` and `privacy@caspianerp.com`
  (contact page, privacy policy, terms and the contact form's `mailto:` fallback), and the deploy
  workflow's warning names the right site.
- **Flat header.** The navigation is a transparent bar on the same ground as the hero, with no
  pill, border or shadow at rest; once the page scrolls it takes a translucent white ground and a
  hairline so it stays legible over dark sections.
- **The home hero lost its ink frame.** It is a flat `--paper` block that extends up behind the
  header, with the module ticker along its bottom edge.
- **Redesigned every page around a framed, editorial layout** (merged as #5): pill buttons, flat
  large-radius cards, inset rounded dark sections, warm cream soft sections, an editorial accordion,
  a dark rounded footer carrying the closing call to action, and a rebuilt home page.
- **Asset version bumped to `20260905.2`.**

## Header and footer chrome

### Changed
- **Removed the Company link from the header nav**, on all 22 pages and in the mobile drawer, so
  the two stay consistent. `/about` is still reachable from the footer's Company column.
- **Header links are centred.** `.nav` is now a three-track grid (`1fr auto 1fr`) with each item
  naming its column: brand left, links centre, actions right. The explicit `grid-column` matters —
  below 980px `.nav-links` is `display: none` and stops being a grid item, so without it the
  actions slid into the middle track instead of staying at the right edge.
- **Removed the tagline and the CaspianTools credit paragraph from under the footer logo.** The
  brand column now holds the logo alone, so `.footer-grid` is five equal columns rather than
  `1.6fr repeat(4, 1fr)`, and the dead `.footer-brand p` and `.footer-by` rules are gone.
  Attribution remains in the footer copyright line, on `/about` and in the legal pages.
- **Asset version bumped to `20260904.2`** for the stylesheet change. Versions now take an optional
  `.N` suffix for a second change on the same day; the documented `sed` in `CLAUDE.md`,
  `README.md` and `DESIGN.md` was widened from `[0-9]*` to `[0-9.]*` so it cannot corrupt one.

## Stale-CSS fix, motion and elevation

### Fixed
- **Returning visitors were being served a year-old stylesheet.** `firebase.json` caches
  `/assets/**` as `max-age=31536000, immutable`, and `site.css` never changes filename — so any
  browser that had visited before kept the pre-`/modules` CSS and rendered the new pages against
  it. The most visible symptom was the breadcrumb separator blowing up to a full-width chevron,
  because `.breadcrumb svg` did not exist in the cached copy. Every page now links
  `site.css` and `site.js` with a `?v=` version, and `scripts/check-assets.mjs` fails the build
  when pages disagree on it. Documented in `README.md`, `DESIGN.md` and `CLAUDE.md`.
- **`check-links.mjs` now strips query strings** before resolving a path, so a versioned asset
  URL is checked against the file on disk.

### Added
- **Motion and elevation across every page** (§20 of `site.css`):
  - Resting shadow plus a hover lift on `.card`, `.panel`, `.industry-card`, `.price-card`,
    `.stat` and `.flow-step` — `translateY(-3px)` to `--shadow-md`, with `.card-interactive` and
    the featured price card going to `-5px` and `--shadow-lg`.
  - Icon tiles nudge and scale when their card is hovered; buttons press on `:active`; the
    primary button deepens its brand glow; the app mock deepens its shadow.
  - A pure-CSS hero entrance (`caspian-rise`, staggered 0.02s–0.31s) that runs with JavaScript
    disabled, and a slide-in for the FAQ answer.
  - Staggered `.reveal` for grid siblings, 0.06s apart, capped from the seventh card.
  - `prefers-reduced-motion` now zeroes animation and transition *delays* as well as durations —
    zeroing only the duration left a staggered card blank for a third of a second.
- **`.reveal` on the cards that were missing it** across 18 pages, so the entrance animation is
  consistent rather than applying to whichever cards happened to be marked up first.
- **`scripts/check-assets.mjs`**, wired into the CI workflow alongside the HTML and link checks.

## Module pages and the CaspianTools rebrand

### Added
- **A landing page for every module** — twelve pages under `/modules/`: `hr`, `hseq`, `business`,
  `efficiency`, `procurement`, `manufacturing`, `crm`, `inventory`, `logistics`, `maintenance`,
  `finance` and `administration`. Each one runs the same section order — hero, an app mock built
  from the existing `.mock-*` components, the problem, what it does, a process flow, every tool
  with a one-line description, how it connects to three other modules, who uses it, what an
  administrator can configure, an FAQ and a CTA band. Copy is written for energy and oil & gas
  contractors first.
- **`.breadcrumb`, `.footer-by` and a dark-section `.link-arrow` colour** in `site.css`, documented
  in `DESIGN.md`.

### Changed
- **`/modules` is now a hub**, not a long-form directory: a card per module linking to its own
  page. The previous in-page anchors (`#hr` … `#admin`, including `#fleet`) are kept on the cards,
  so existing links still resolve.
- **Fleet is presented as Logistics.** `/modules/logistics` covers vehicles, journey management and
  the inter-site transfer orders it shares with Inventory; vehicle servicing stays in Maintenance,
  because a vehicle is an asset. `index.html` and `pricing.html` updated to match.
- **Administration is framed as the customization story** rather than a list of settings — module
  and tool switches, roles built from individual permissions, and the limits stated honestly.
- **Every module card on the home page now links to its page**, and the remaining "New" badges were
  dropped: every tool in the app's navigation is presented as available.
- **The site is branded as a CaspianTools product.** Footer credit and a `caspiantools.com` link on
  every page, a "CaspianOS is built by CaspianTools" section on `/about` (a software studio in
  Bursa, Türkiye), and `privacy.html` / `terms.html` now name CaspianTools, Bursa, Türkiye as the
  entity with Turkish governing law — replacing the `[Legal entity name]`, `[registered address]`
  and `[jurisdiction]` placeholders.
- **`scripts/check-html.mjs` and `scripts/check-links.mjs` walk subdirectories**, so the twelve new
  pages are validated in CI like every other page.
- **`sitemap.xml`** lists the twelve module pages.

## Initial release

### Added
- **The site itself** — ten static pages served from `public/`: home, module directory
  (`/modules`, anchored per department), industries, security & access control, pricing
  (plans + comparison table + FAQ), company, contact / book-a-demo, privacy policy, terms of
  service and a 404 page, plus `robots.txt` and `sitemap.xml`.
- **No build step and no dependencies.** One hand-written stylesheet
  (`public/assets/css/site.css`) carries the whole design system; `public/assets/js/site.js` is
  progressive enhancement only (sticky-header shadow, mobile drawer, module filter tabs, scroll
  reveal, footer year, and a contact form that composes a pre-filled `mailto:` because static
  hosting has no backend). Every page renders and navigates with JavaScript disabled — `.reveal`
  has a `<noscript>` override so nothing can stay invisible.
- **Every call to action points at `https://app.caspianos.io`** — sign in, sign up and free trial
  all land on the application.
- **Content drawn from the real product:** the eleven departments and their tool lists mirror the
  application's department configuration, and the security page describes the actual permission
  model (tenant isolation, permission-based RBAC enforced in the Firestore rules, verified
  invitations, platform-owned billing fields, audit log). No invented customer logos,
  testimonials, certifications or metrics.
- **SEO/social:** per-page title, meta description, canonical URL and Open Graph/Twitter tags, an
  SVG OG image, and a sitemap.
- **Accessibility:** skip link, one `<h1>` per page, labelled form controls, `aria-current` on the
  active nav item, table captions, and a `prefers-reduced-motion` bypass for every animation.
- **`firebase.json` + `.firebaserc`** — Firebase Hosting in the `caspianos` project, with clean
  URLs (`/modules`, not `/modules.html`), `404.html` as the not-found page, immutable caching for
  `assets/**`, `must-revalidate` for HTML, and security headers (CSP, HSTS,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- **`.github/workflows/deploy.yml`** — validates the configs, checks HTML tag balance and internal
  links on every push and pull request, then deploys to Firebase Hosting on `main`. Uses a
  `FIREBASE_SERVICE_ACCOUNT_MARKETING` secret (service account from the `caspianos` project with
  the **Firebase Hosting Admin** role); a missing secret makes the deploy job **skip with a
  warning** rather than fail. `workflow_dispatch` allows a manual re-run without a code push.
- **`scripts/check-html.mjs` and `scripts/check-links.mjs`** — the whole build gate for a site with
  no bundler: unbalanced tags and links to pages or anchors that do not exist both fail CI.
- **`DESIGN.md`** — the single source of truth for this site's design system, and why it is kept
  deliberately separate from the application's.

### Notes
- This site previously lived under `marketing/` in
  [CaspianOS-App](https://github.com/CaspianTools/CaspianOS-App); it was moved here so the public
  site and the application deploy independently, from separate repositories and separate Firebase
  projects.

## 2026-09-06 - Marketing audit fixes

- Replace provisional pricing and trial promises with demo and pricing enquiries.
- Focus the homepage on industrial operations and reconcile module counts.
- Link to app, documentation and admin; describe remote working without an office.
- Validate and preview email drafts, support copying to webmail, and provide a no-JS fallback.
- Keep mobile navigation usable without JavaScript and respect reduced-motion preferences.
- Label sample product views and refresh sitemap dates and asset versions.
- Add behavioral checks for navigation and the contact composer to CI.
