# CLAUDE.md

This is the central project memory and working guide for every assistant in this repository,
including Codex and Claude. The owner explicitly requested this on 2026-09-06.

## Read before working

At the start of every session, read this file first, then all repository-authored documentation:
[README.md](README.md), [DESIGN.md](DESIGN.md), [future.md](future.md), and
[CHANGELOG.md](CHANGELOG.md), plus any documentation added later. Exclude generated files,
dependencies and Git internals. Follow relevant linked instructions before acting.

Keep durable owner decisions, constraints and links to current work here as they change.
Use this file to restore context after a new session or compaction; do not rely on chat history
alone. Read changed documentation again before using it. Current owner instructions take
precedence over older notes. Historical changelog entries describe past behavior.

This file is the central index, while each supporting document keeps its purpose:
- README: repository structure, setup and deployment.
- DESIGN: the single source of truth for visual rules; read before visual edits and keep in sync.
- future: outstanding work, dependencies and unresolved decisions.
- CHANGELOG: the history of implemented changes.
- GitHub issues on CaspianERP-App: anything only the owner can do. Not a file and not this
  repository's tracker — see "Owner actions live in GitHub issues on CaspianERP-App" below.

## Owner decisions and current state

- Marketing: https://caspianerp.com (this repository).
- Application: https://app.caspianerp.com.
- Administration: https://admin.caspianerp.com.
- Documentation: https://docs.caspianerp.com.
- Connect the sites through relevant navigation. Marketing currently links to all three;
  reciprocal links require the other repositories. Links do not establish shared authentication.
  The admin site's audience and live entry flows still need verification.
- CaspianTools has no physical office yet. Publish no real or invented telephone numbers,
  telephone links, office address, map or invitation to visit. Use email and online demos.
  Existing Bursa legal references are not proof of an office or verified registered address.
- Pricing was decided on 2026-09-26: three tiers. **Demo** is free (the open demo company in the
  app, reached by "Try the demo" on its sign-in page). **Paid** is one price per active user per
  month, every module included, VAT added on top. **Enterprise** is "talk to us". Never write the
  Paid figure into a page: the owner sets it in the admin panel (Plans → Paid) and
  `assets/js/pricing.js` reads it from the app's public `GET /api/public/site`, so the site follows
  a price change without an edit. The static fallback names the model, not a number. Still no
  invented discounts, plan allocations or trial durations.
- The contact form validates and previews email drafts, with mail-app and webmail-copy actions.
  It does not send or store leads. A backend remains outstanding.
- Product views use labeled sample data; authentic screenshots and evidence remain outstanding.
- Google Analytics 4 is installed, on the owner's instruction of 2026-09-10, with the measurement
  ID `G-14GPENV8PG`. It supersedes the older "no third-party scripts, trackers or cookies" rule,
  which now reads as "GA is the only one". The ID lives in exactly one place,
  `public/assets/js/analytics.js`. The tag is the standard gtag.js pair of commands, moved into a
  file because the CSP allows no inline script; it is deferred so `lang.js` can redirect an
  unprefixed URL before a hit is sent, and the visit is counted on the page actually read.
  **Nothing loads it until a visitor accepts.** The owner chose a real consent banner (`T27`,
  2026-09-11), so no page includes `analytics.js` directly any more: `public/assets/js/consent.js`
  is what every page loads, and it injects the tag only once consent exists. Adding a
  `<script src>` for `analytics.js` back into a page would silently undo the gate — which is why
  the gate is a separate file rather than a flag inside the tag.
  With JavaScript off nothing can run and no banner appears, which is the right outcome rather
  than a gap. The answer lives in `localStorage`, not a cookie. `T28` — that GA is really
  receiving data — still needs the owner's Google account and is not re-raised here unprompted.
- Playwright Test is installed as a development dependency. Chromium launch and rendering
  were verified; a full browser suite has not yet been added. See README for setup.
- The site ships in seven languages — en, az, tr, ru, nb, de, fr — matching the application's list.
  English under `public/` is hand-written and is the source; the other six are generated into
  `public/<lang>/` by `scripts/i18n-build.mjs` and committed, because hosting serves the repository
  as-is. Never hand-edit a generated page. The translations were produced in-house, and the owner
  accepted them as shipped on 2026-09-08, declining a native-speaker review for now. The review
  stays in future.md as optional polish, not a pending ask — do not re-raise it unprompted.
- A localized page hands its language to the application: *Sign in* links on `/<lang>/…` point at
  `https://app.caspianerp.com/<lang>/welcome`, not the bare host, because the app reads a
  `/{lang}/` prefix from its own URL and redirects an unprefixed URL to `/en/…`. `APP_ORIGIN` and
  `APP_ENTRY` in `i18n/config.mjs` are the only place those values live; the generator rewrites
  the links. If the app's language list or its entry route changes, this is what must follow.
- Track remaining work in future.md. Verify Git, PR and deployment state before claiming a
  change is committed, merged or live; a local edit or changelog entry is not deployment proof.

## Owner actions live in GitHub issues on CaspianERP-App, linked to the session that asked

**Rule (owner, 20 Nov 2026).** Anything the owner has to do, decide or check
is a GitHub issue **on [CaspianTools/CaspianERP-App](https://github.com/CaspianTools/CaspianERP-App/issues)**,
opened in the same turn it comes up — never only in the chat. The chat
disappears when the session ends; the issue does not. Link the issue in the
reply. Search the open issues first and add to an existing one rather than
opening a duplicate.

**One queue, on CaspianERP-App** (the owner's single queue for the
application, the platform cockpit, this site and the docs). Issues
are not opened in this repository, and there is no `TODO.md` here or there
any more (CaspianERP-App's `TODO.md` is an archive since 2026-09-22). Opening
an issue there needs no checkout of it: the GitHub tools reach it directly,
so the seam between repositories is never a reason for an item to go
unrecorded.

**What belongs there.** Only what the owner can do and an assistant cannot:
a console or DNS step, a credential an assistant must never hold, a decision
the code cannot make, or a check that only works against the live site. If
an assistant can do it, it does it, and it is not written down. Outstanding
work that is merely unstarted stays in `future.md`; it becomes an issue only
once it blocks something already shipped, or once an assistant is waiting on
the answer to continue.

### Mark who it is for, twice

| For | Label | Title starts with |
| --- | --- | --- |
| The owner — something to do or check | `repo:marketing` + `owner-action` | `[YOU]` |
| The owner — a choice to make | `repo:marketing` + `owner-decision` | `[YOU · DECIDE]` |
| Claude — work scoped for a later session | `repo:marketing` *(provenance only)* | `[CLAUDE]` |

The queue uses `owner-action` / `owner-decision` in place of `for: owner` /
`decision`, `repo:marketing` for provenance on every issue raised here, and
`blocker` when something already built cannot be finished without it. When
an issue changes hands, change both markers.

### The shape of a `[YOU]` issue: steps first, reasons last

```
## Do this

1. One action, naming the site, repository or console it happens in.
   A command, or a Claude for Chrome script for anything done in a
   browser, goes in its own block under the step.

2. Next action.

## Why

Two sentences at most: what is wrong and what doing the steps changes.

**Urgency:** one word, with a half-sentence if it needs one.

## Sessions

**Changed by:** https://claude.ai/code/session_… (pull request CaspianTools/CaspianERP-Marketing#N)

**Asked by:** https://claude.ai/code/session_… (go back here with the result)

<details>
<summary>Background</summary>

- Everything else: how it was found, what Claude could not do and why,
  the exact names of projects, services and settings involved.

</details>
```

- **Steps are the issue**: one imperative action each, a blank line between
  every block, under about 120 words above `<details>`. Explanation goes
  inside `<details>`, collapsed. One issue, one thing to do.
- **The owner is not a developer.** Write in plain words what happens to
  the business, the site or the customer; literal text only in a command.
- `[YOU · DECIDE]` uses the same frame with `## Decide` (the options as a
  numbered list, the recommendation marked) in place of `## Do this`.
- **Anything in a browser is a Claude for Chrome script** inside the step,
  never a list of clicks: numbered steps, one action each, the address in
  every step that navigates, the exact on-screen words to expect, stop at
  the first step that misbehaves, nothing it must not touch, and a check of
  the deploy first when the step depends on one. It ends: "Give me step,
  pass or fail, and the exact wording of anything that failed. If every
  step passed, comment the results on <issue link> and close it; otherwise
  comment the failing step and leave it open. End the comment with: Report
  this back to <Asked by session link>."
- **A changed script is a new comment**, never an edit: headed
  `Updated script (<date>) — use this one`, holding the whole script. A
  "run it again" is a new comment too.
- **Commands for the owner** run on Windows in PowerShell and Command
  Prompt alike: full paths, no shell variables, no `&&`, no pipes.

### Link the session that asked

An issue alone does not say which conversation wants the answer, so every
one carries the session's link, and the owner can go back to that session
and report what was done.

- **Where the link comes from:** the `Claude-Session:` line of the commit
  attribution (`https://claude.ai/code/session_…`); if it is missing,
  `get_session` with no id gives the session id.
- **Every `[YOU]` and `[YOU · DECIDE]` issue has the `## Sessions` section**:
  **Changed by** (the session that made the change being checked, with its
  pull request) and **Asked by** (the session waiting for the result). When
  they are the same, one line: `**Session:** <link> (made the change and is
  waiting for the result)`.
- **Every comment that asks the owner to run a script** starts with
  `**Asked by:** <link>`; the newest comment's session is the one to go back
  to. A `[CLAUDE]` issue names the session that opened it the same way.
- A session that finds a result on an issue acts on it there, even when
  another session asked: the link is for the owner, not a lock.

### Close what is finished

Close an issue once the evidence is in (the owner's report, a script's
comment, output they pasted), with a one-line comment saying what proves
it; `not planned` when nothing was done. Never close on an assumption.
End every issue and comment with the Claude Code attribution footer.

## What this repo is

The public marketing site for **caspianerp.com** — hand-written static HTML and CSS, no build step,
no runtime dependencies, deployed to Firebase Hosting in the `caspianos` project. The Caspian ERP
application lives in a separate repository and deploys separately to `app.caspianerp.com`.

Caspian ERP (formerly CaspianOS — only the repository names and the `caspianos` Firebase project
keep the old name; `caspianos.io` is no longer ours, so never link or mail to it) is a **CaspianTools**
product from a remote software studio without a physical office. The attribution
lives in the footer's copyright line, the `/about` studio section and the entity named in
`/privacy` and `/terms` — keep those consistent if any of it changes. There is deliberately no
credit paragraph under the footer logo.

## Ship rule — run this on autopilot

**On successful completion of any task, take it all the way to merged. Do not ask for permission
at any step.** "Successful completion" means the work is done and the checks below pass — not that
every idea in the conversation is finished.

1. **Commit** to the session's designated branch, with a message that explains what changed and
   why. Never commit directly to `main`.
2. **Push** with `git push -u origin <branch>`. On a network failure, retry up to four times with
   exponential backoff (2s, 4s, 8s, 16s).
3. **Open a pull request** against `main` describing the change. One PR per task; if a task
   continues on a branch that already has an open PR, push to it rather than opening a second one.
4. **Subscribe to the PR** with `subscribe_pr_activity`, and keep it watched until it is merged or
   closed. Schedule a check-in (`send_later`, roughly hourly) so a missed webhook does not leave
   the PR sitting.
5. **Drive it to green.** Every red check and every review comment is work now:
   - Reproduce the failure, fix the cause, validate locally, push. One validated push beats three
     speculative ones.
   - Never skip, disable or quarantine a check to get green. Never push an empty commit to kick CI.
   - A conflict with `main` is resolved by merging `main` in, not by rewriting history.
6. **Merge when green** — CI passing, no conflict, no unresolved review thread. Then stop watching.

If a step is genuinely blocked — merge permission denied, a required approval that only a human can
give, a failure whose fix is outside the task's scope — say so plainly in the session, leave the PR
open with a comment explaining exactly what is blocking it, and keep it watched. Blocked is the
only reason to stop short of merged; it is never a reason to go quiet.

Merging `main` deploys the site, so the rule above is the deploy pipeline. Treat a red `main` as
the highest-priority thing in the session.

## Before you push

There is no bundler. Run all source and behavioral checks — CI runs exactly
the same commands:

```bash
node scripts/check-html.mjs     # unbalanced or mismatched tags
node scripts/check-links.mjs    # internal links and #anchors that do not resolve
node scripts/check-assets.mjs   # every page links the same ?v= asset version
node --test scripts/check-interactions.mjs # navigation, email composer, language redirect
node scripts/check-i18n.mjs     # translations complete, generated pages up to date
```

They walk `public/` recursively, so pages under `public/modules/` — and every generated
`public/<lang>/` tree — are checked like any other.

**If you edit an English page, regenerate the translations before you push.** The generated trees
are committed, so a page edited without a re-run ships a half-translated site:

```bash
node scripts/i18n-extract.mjs   # refresh i18n/_catalog.json
# translate any new strings into every i18n/<lang>.json
node scripts/i18n-build.mjs     # regenerate public/<lang>/ and sitemap.xml
node scripts/check-i18n.mjs
```

`check-i18n.mjs` regenerates every page in memory and compares it with the committed file, so this
is enforced rather than remembered.

**If you change the site's URLs, update the sitemap.** `public/sitemap.xml` is generated by
`scripts/i18n-build.mjs` — it lists every page in all seven languages, and it is never hand-edited.
Adding, renaming, moving or deleting a page under `public/` (module pages included) changes the URL
set, so re-run the generator and commit what it writes:

```bash
node scripts/i18n-build.mjs     # rewrites public/sitemap.xml from the pages on disk
node scripts/check-i18n.mjs     # fails if the committed sitemap is stale
```

`check-i18n.mjs` compares the generated sitemap with the committed one, so a forgotten re-run is
caught. Two things it cannot catch, because they are constants the generator reads rather than facts
it derives — both at the top of `scripts/i18n-build.mjs`:

- `LASTMOD` — the date stamped on every entry. The checks pass whatever it says, so a content change
  a crawler should come back for is a reason to set it to that day's date.
- `PRIORITY` — per-URL weight, keyed by the English path (`/pricing`, not `/de/pricing`). A new
  top-level page with no entry ships silently at the `0.8` default; add one if that is wrong.

`public/robots.txt` is hand-written and points crawlers at
`https://caspianerp.com/sitemap.xml`, so if `ORIGIN` in `i18n/config.mjs` ever changes, that line
must follow. `/404` is excluded on purpose.

**If you edit `site.css` or `site.js`, bump the version.** Versions are `YYYYMMDD`, with a
`.N` suffix for a second change on the same day (`20260904.2`). Hosting serves `/assets/**` with
`max-age=31536000, immutable`, so a returning visitor keeps the old stylesheet for a year unless
the URL changes. Every page links them as `?v=<date>`; change the file, change the version in
*every* page:

```bash
sed -i 's|site\.css?v=[0-9.]*|site.css?v=NEW|g; s|site\.js?v=[0-9.]*|site.js?v=NEW|g' \
  public/*.html public/modules/*.html
node scripts/check-assets.mjs
```

Shipping new HTML against a cached old stylesheet is what breaks the site for everyone who has
visited before — and it looks fine to anyone testing in a fresh browser, so nothing catches it
except this rule.

To see what production actually serves — clean URLs are a hosting feature, so a plain static
server will 404 on `/modules`:

```bash
npx firebase-tools emulators:start --only hosting
```

## Non-negotiables

- **Claims must be true.** No invented customer logos, testimonials, certifications, metrics or
  features. Every tool described on the site exists in the application.
- **JavaScript is an enhancement.** Every page must render, read and navigate with JS disabled.
  Anything hidden until JS runs (`.reveal`) needs a `<noscript>` override in the page head.
- **Google Analytics is the only third-party script, and it is behind consent.** The external
  requests are the Inter webfont and the GA4 tag (`G-14GPENV8PG`). The tag lives in
  `public/assets/js/analytics.js` — a file, not Google's inline snippet, because `script-src`
  carries no `'unsafe-inline'` and the browser would refuse to run it — and **no page includes it
  directly**. Pages load `public/assets/js/consent.js`, which injects it only after a visitor
  accepts; reject, or never answer, and Google is never contacted. Adding any other tracker, embed
  or A/B tool is an owner decision. Three things move together with it: the CSP in `firebase.json`,
  which is what actually permits the tag; `/privacy`, which must keep describing what is set; and
  the consent gate, which must keep being the only thing that loads the tag.
- **No template engine.** The header and footer are duplicated in every page on purpose. Change
  the nav or footer in *all* pages, and keep `aria-current="page"` correct. The three
  `<!--i18n:…-->` regions inside them (hreflang alternates, header language menu, drawer language
  row) are the exception: they belong to the generator, so edit `scripts/i18n-build.mjs`, never the
  markup in a page.
- **Every language must work with JavaScript off.** The switcher is a `<details>` of ordinary
  links, and `/tr/pricing` serves Turkish to everyone. `lang.js` only redirects an unprefixed URL,
  never one that names its language — that is what keeps shared links and crawlers intact.
- **Root-relative links, no extension.** `/modules/hr`, never `modules/hr.html`.
- **Escape bare ampersands** in copy (`&amp;`) — several module names contain one.
- **Keep `DESIGN.md` in sync** with `public/assets/css/site.css`. Do not start a competing design
  doc, and do not import patterns from the application's design system.
