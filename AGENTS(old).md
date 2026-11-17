# AGENTS.md

# Artifact Studio

Artifact Studio is the long-term evolution of **Artifact Photo and Frame**, a custom framing business in Waihi, New Zealand. The framing business stays operational; the long-term direction combines craftsmanship, design, software development and digital services. Signage and the Google Business Profile now say **Artifact Studio**; the legal trading name has not changed.

The site replaced a WordPress site with a modern Astro application, deliberately avoiding unnecessary complexity. This document gives future AI assistants and developers the *why* behind decisions as well as the *what*, plus a short log and to-do list.

---

# Career Context

Andrew is a sole trader moving from **skilled physical production + business operation** toward **systems design + technical implementation + workflow integration** ("middle-stack integration": frontend, backend, APIs, operational workflows). He is studying a Bachelor of Interface Design at the University of Waikato (started 2023, about halfway) alongside running the business.

The website is deliberately **dual-purpose**: a real business asset and a live portfolio. Future tooling (framing calculator, Xero integration, supplier pricing pipelines) should be built and documented with that in mind. Avoid over-promising services that aren't commercially ready, and avoid positioning as a "junior web developer".

---

# Current State (November 2026)

Live at `https://artifactstudio.nz` on Cloudflare Pages.

```
VS Code → Git → GitHub → Cloudflare Pages → Production
```

GitHub is the source of truth. Never make changes manually in Cloudflare.

**Versions:** Astro 4.16.19, `@astrojs/cloudflare` 11.2.0, `@astrojs/tailwind` 5.1.5, React (islands only). `output: 'hybrid'`.

| Page | Status |
|---|---|
| Home, About, Services, Contact | Live, finalised copy |
| 404 (`src/pages/404.astro`) | Live |
| Style Guide (`/style-guide`, `/style-guide2`) | Deployed, unlinked, `noindex` |
| Calculator (`/calculator`) | Password-gated, unlinked from nav and footer |
| Sign (`/sign/`) | Standalone open-hours display for the shop iPad; unlinked, `noindex`, not in the sitemap. See Sign Display |

Mobile PageSpeed (Oct 2026): Performance 92, Accessibility 95, Best Practices 100, SEO 100.

---

# Business Context

Positioned as a premium creative practice, not just a framing shop. It should communicate thoughtful design, craftsmanship, technical capability and calm professionalism, and resemble a gallery or studio more than a software dashboard or a traditional retail site.

---

# Project Philosophy

Technology is introduced only when it provides genuine benefit.

- Prefer static pages; minimise client-side JavaScript
- Favour maintainability over cleverness; compose from reusable components
- Isolate complexity; keep hosting portable (avoid Cloudflare-specific features where possible, so a host change mostly means swapping the adapter)
- Optimise for long-term ownership; the site should be understandable after years away
- Build systems, not pages; keep business logic separate from presentation
- Don't over-promise services ahead of pricing/delivery readiness, and don't borrow credibility before an independent reputation is established

If a decision conflicts with these, revisit it consciously.

---

# Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Astro (hybrid) | Static by default, islands for interactivity |
| Styling | Tailwind CSS | Predictable, minimal CSS maintenance |
| Interactivity | React (islands only) | Framing calculator; no SPA |
| Hosting | Cloudflare Pages | Auto deploy, CDN, HTTPS, free tier |
| DNS | Cloudflare (both domains) | See Domain Migration |
| Email | Zoho (DNS on Cloudflare), routed to existing Gmail | Keeps contact history |
| Fonts | Adobe Fonts (kit `sak1ctd`, served from `use.typekit.net`) | Source Serif Pro + Akzidenz Grotesk Next Pro |

**Rendering:** static by default. Server-rendered: the Calculator and its auth endpoint. Keep the public site extremely fast. The sign page is prerendered static HTML, but deliberately bypasses the layout, Tailwind and bundled JS (see Sign Display).

## Design and typography

- `bg-brand-bg` (#f1f8fd), `bg-brand-accent` (#2c3082 deep navy), body text `stone-900`
- Source Serif Pro is `font-body` (H1–H3, lead paragraphs); Akzidenz Grotesk Next Pro is `font-header` (body, nav, buttons). An intentional inversion of the usual serif/sans pairing
- Custom Tailwind values go inside `theme.extend`
- Config changes (`astro.config.mjs`, `tailwind.config.mjs`) need a dev server restart; `src/` changes hot-reload
- Animation reinforces usability: CSS transitions, then Tailwind utilities, then Astro View Transitions, then React animation libraries only when justified

## Structure

`layouts/` shared shell; `components/` reusable UI; `pages/` routing; `data/` plain data modules; `assets/` processed images; `public/` static files; `styles/` global only. Components are reusable interface elements; pages compose them.

The one exception is `pages/sign.astro`, which is a self-contained page with no layout and no shared styles (see Sign Display).

---

# Page Content Decisions

**About:** two-column layout. Arc: owner-operated Waihi studio with a precision-manufacturing background; 2017 Waihi Beach Gallery, 2022 Artifact Photo and Frame; closing paragraph frames university study as continued curiosity (does not name the degree). The LinkedIn link belongs in that study paragraph, not the footer. *Parked:* naming suppliers (Larson-Juhl, Avon, Glasslines); revisit as plain text, never logos.

**Services:** two columns, **Custom Picture Framing** (real, sellable) and **Design & Digital** (ambitious, with the italic caveat "Bespoke digital projects — get in touch to discuss scope and pricing."). The "Install" service is discontinued.

**Contact:** address 51 Seddon Street, Waihi 3610; phone/WhatsApp 027 223 3561; email andrew@artifactstudio.nz; Google Maps iframe (no API key). **No contact form**, to avoid a server dependency; if wanted later, Web3Forms is the simplest option. Opening hours come from `src/data/hours.ts` (see below).

**Calculator:** business infrastructure, not marketing. Gated by `CALCULATOR_PASSWORD`, session cookie `frame_auth=ok` (8 h). The React island renders only after the server-side auth check. Not linked anywhere public.

**Sign:** business infrastructure, not marketing. A display page for an always-on old iPad in the shop, so the hours (including one-off closures) are visible at a glance. Not linked anywhere public. Hours are edited in one place, `src/data/hours.ts`. See Sign Display.

---

# Opening Hours and Structured Data

- Hours change with the university semester. Edit **`src/data/hours.ts`** (24-hour `HH:MM`; a day with no `opens`/`closes` shows as Closed; a day with a break gets two entries). The Contact page list and the schema's `openingHoursSpecification` both read it, so the visible hours and the JSON-LD cannot disagree
- The sign page (`src/pages/sign.astro`) also reads `hours.ts`, so one edit updates the Contact page, the schema and the sign together. Note: the sign's date-by-date `exceptions` (see Sign Display) are used by the sign only; the schema holds the regular pattern only
- Update Google Business Profile hours at the same time (Google compares them with the schema). Use GBP **special hours** for one-off closures; the schema holds the regular pattern only
- `src/components/LocalBusinessSchema.astro` emits LocalBusiness JSON-LD on the **homepage only**. It is one long line in the HTML, so search View Source for `ld+json`
- `alternateName` keeps the old trading name on purpose. `areaServed` is a hand-written list; keep it to places actually served. `priceRange` is deliberately omitted (quotes are per job)
- After a hours change, re-run the Rich Results Test (search.google.com/test/rich-results) to confirm the JSON is still valid

---

# Sign Display (`/sign/`)

A standalone page for an always-on old iPad in the shop, showing the opening hours. The aim is that hours are edited in **one place** (`src/data/hours.ts`, plus Google Business Profile) and the sign follows. The sign is a convenience display, so it must never show "open" when the shop is closed.

## Device and constraints

- Old iPad on iOS 9/10-era Safari. The exact model and iOS version are unconfirmed; check Settings → General → About. It loads `artifactstudio.nz` over HTTPS (padlock shows) and the Adobe Fonts load, but the normal site renders badly: flex `gap` is unsupported (the nav items run together) and it gets the stacked mobile layout.
- Kiosk setup on the iPad: open `/sign/`, Share → Add to Home Screen (full screen, no Safari bars; viewport height is noticeably better this way), Auto-Lock → Never, Guided Access on, Date & Time set automatically (NZ).
- The sign trusts the iPad's clock for the dates, the "today" row and the open/closed status, so a wrong clock means a wrong sign.
- It is always on and always charging. The battery is about 14 years old: check it for swelling, keep it ventilated if it is ever enclosed, and note the backlight stays on overnight (iOS 9 has no schedule).

## Implementation rules (do not break these)

- `src/pages/sign.astro` has **no layout, no Tailwind and no bundled JS**. Everything is hand-written inside the page.
- Use `<style is:inline>` and `<script is:inline>`. Astro bundles a plain `<script>` as a module, which old Safari will not run; `is:inline` leaves the code exactly as written (and stops style scoping).
- JavaScript is **ES5 only**: `var`, `function`, no arrow functions, template literals, `fetch`, `async`, `Intl` or `padStart`. Avoid ES3 reserved words as names (`short`, `long`).
- CSS is old-Safari-safe: a `<table>` for the grid, `vmin` sizes (so portrait and landscape both fit), and no flex `gap`, grid, custom properties, `clamp()`, `inset` or `aspect-ratio`.
- Hours reach the browser as JSON in `<script id="sign-data" type="application/json" is:inline set:html={data}>` and are read with `JSON.parse(document.getElementById('sign-data').textContent)`.
- `noindex`, not linked anywhere, not in `sitemap.xml`.
- `<meta http-equiv="refresh" content="300">` reloads the page every 5 minutes. If a reload fails, Safari shows its own error page, which fails loudly instead of leaving a stale "open".
- If the script cannot run, the table falls back to the weekly hours, built at build time from `hours.ts` with `formatTime`.

## Layout and styling

- Heading "Open Hours" in Source Serif Pro 400, `#2c3082`.
- A rolling seven days starting today, in three columns: day (left, 44%), date (centred, 24%, e.g. "17 Nov") and hours (right-aligned, 32%, e.g. "10 – 4", matching the printed sign).
- Today's row is inverted: `#2c3082` background, `#f1f8fd` text, weight 900.
- Under the table: a status line ("Open now until 4pm", "Opens today at 10am", "Closed now") and a small "Updated 5:19pm" time, so a stale page is visible.
- A date range under the heading was tried and removed as redundant, since each row shows its date.
- Colours: background `#f1f8fd`, accent `#2c3082`, text stone-900 `#1c1917`, muted stone-600 `#57534e`, row rules stone-300 `#d6d3d1`, "Updated" time stone-500 `#78716c`. The stone values are Tailwind palette picks and are not named in the style guide tokens.
- Type: Akzidenz Grotesk Next Pro at weights **500 and 900 only** (the weights in the Adobe kit; anything else is faux-bolded). The page links the kit directly (`https://use.typekit.net/sak1ctd.css`). The CSS family names used are `"source-serif-pro"` and `"akzidenz-grotesk-next-pro"`; confirm them against `tailwind.config.mjs`.

## Data and behaviour

- `hours.ts` exports `openingHours` (Monday first; `opens`/`closes` as 24-hour `HH:MM`; a day with neither is Closed) and `formatTime`.
- Optional one-off closures: add an `exceptions` export to `hours.ts`, keyed by date:

  ```ts
  export const exceptions: Record<string, { opens?: string; closes?: string }> = {
    // '2026-12-25': {},                                  // closed
    // '2026-12-24': { opens: '10:00', closes: '12:00' }, // short day
  };
  ```

  `sign.astro` imports `hours.ts` as a namespace and falls back to `{}`, so the build works without the export. The Contact page and the JSON-LD ignore `exceptions`; set GBP **special hours** for the same days.
- A closure renders like Tuesday: that date's row shows "Closed" and appears once the date is within the seven-day window; on the day the status line reads "Closed now". Short hours render as "10 – 12" with no special marker.
- Changing hours needs a push and a Cloudflare build (about a minute or two), then the iPad picks the change up at its next 5-minute reload.

## Status

- `public/sign.html` was the first test version, with the hours copied in by hand. Tested on the iPad: it loads and looks fine.
- `src/pages/sign.astro` is the real version, reading `hours.ts`. It is written but not yet built or tested in the repo: run `npm run build`, check `/sign/` on the iPad, then delete `public/sign.html`.

## Ideas and next steps

- "Closed today" wording for all-day closures (instead of "Closed now"), plus an optional `note` field in `exceptions` (for example "Public holiday" or "Back Wednesday") shown under the hours.
- Confirm the Adobe font family names and weights render correctly on the iPad.
- Check landscape fits without scrolling.
- Check the iPad's battery before leaving it on charge long term.

---

# Domain Migration (complete)

`artifactphotoandframe.co.nz` is a second Cloudflare zone. Eight static 301 Redirect Rules (query string not preserved) map every legacy `?page_id=` URL: Home to `/`; Contact (75) and Opening Hours (89) to `/contact`; About (73) to `/about`; Design (230), Print (286), Frame (64) to `/services`; Install (301, discontinued) to `/`. Old MX/cPanel mail was never used. Zoho email on `artifactstudio.nz` is unaffected.

Keep the old domain **registered indefinitely** (redirects run at Cloudflare's edge, no origin needed). Old flyers in circulation still print the old address.

---

# Discoverability

## Current setup

- `robots.txt` in `public/` includes a `Sitemap:` line. Cloudflare's managed robots.txt is **not** modifying it, so the live file matches the source
- Hand-written `public/sitemap.xml` listing the four public URLs in trailing-slash form. Submitted in Search Console (Domain property, so the **full URL** `https://artifactstudio.nz/sitemap.xml` is required). Revisit an integration only if the page count grows. The unlinked pages (Style Guide, Calculator, Sign) are deliberately not listed
- `Layout.astro` props: `title`, `description`, `image?`, `noindex?`. Emits meta description, canonical, Open Graph tags (`og:image` only if a page passes `image`) and optional `noindex`
- Canonicals **keep the trailing slash** (`/about/`, homepage `/`), matching how Cloudflare Pages serves pages
- Favicons: `favicon.svg` (theme-aware), `favicon.ico` (`sizes="any"`), `apple-touch-icon.png`, `favicon-192.png`
- Search Console: Domain properties verified for both domains (TXT records in Cloudflare)
- Googlebot access confirmed (URL Inspection live test passes; nothing in Cloudflare Bots, Security Level or custom rules blocks crawlers). Indexing requested for all four pages
- BingBot, Applebot and Googlebot already crawl the site. Bing Webmaster Tools not yet set up

## Crawler policy

The site is public marketing copy with little to protect, and the goal is to be **recommended by AI tools**. All AI crawlers are **allowed** in Cloudflare AI Crawl Control. Do not enable "block AI training bots", a blanket AI-bot block, or pay-per-crawl. ClaudeBot shows some unsuccessful requests with no status codes in the dashboard; probably old WordPress URLs or trailing-slash redirects. Check Security → Events if it needs investigating.

## Google Business Profile and listings

- Name is **Artifact Studio** (accepted). Primary category stays **Picture frame shop**. Add only categories for things customers physically buy locally; avoid a digital design/web category, which attracts out-of-area enquiries
- Per-service descriptions aren't available for this listing, so detail lives in the prose description; photos carry the rest
- Business is listed on Apple Maps
- Keep name, address and phone identical across GBP, Apple Maps, Facebook, Instagram and NZBN
- **Social handles are deliberately unchanged** until flyers are reprinted. Changing the Instagram handle breaks old links; changing only the display name is the lower-risk first step

## Analytics

Cloudflare's 30-day totals are mostly bots. Filtered to New Zealand and excluding AI crawlers, real traffic is roughly **85 pageviews, 50–60 visits per month**, mostly mobile. **Decision:** no Plausible or self-hosting at this volume. Use Cloudflare Web Analytics (free), Search Console and GBP insights, and ask new customers how they found the business. Revisit if the site's role grows (calculator, Design & Digital work). Filter recipe: Cloudflare → Analytics → Add filter, Country equals New Zealand, Verified Bot Category does not equal AI Crawler.

---

# Images and Performance

PageSpeed mobile was 64 (LCP 43.5 s, page about 14 MB) because 17 carousel images were 0.4–1.6 MB each. After the fixes it is 92 (LCP 2.9 s, TBT 0, CLS 0). The remaining cost is the render-blocking Adobe Fonts CSS (about 1 s on the throttled test); not worth chasing.

**Conventions:**
- Carousel images: WebP, about 480–640 px wide, 15–80 KB each. They display at 160 px (240 px when centred), so larger files are wasted bytes
- Hero: WebP, about 1200 px wide (1200×1295), **not** lazy-loaded, `fetchpriority="high"`
- Always give `<img>` explicit `width` and `height`; lazy-load everything below the fold; `preconnect` to `use.typekit.net` and `p.typekit.net` is in `Layout.astro`
- Compress from the originals (kept outside the repo), never from an already-compressed copy
- macOS `sips` cannot write WebP. Use `cwebp` (Homebrew `webp`; Homebrew warns that Intel Macs are unsupported but it works) or `npx sharp-cli`
- Consider Astro's `<Image>` (images in `src/assets/`) during the Astro upgrade
- Judge speed with PageSpeed **Mobile** and total page weight, not a warm desktop load: a 430 ms hero hid a 14 MB page

---

# Development Workflow

```
edit → test locally (npm run dev) → git add → commit → push → Cloudflare builds → Production
```

- Andrew prefers file-by-file walkthroughs with specific line changes, not full rewrites, and uses VS Code Source Control over terminal Git. He pairs local AI (Qwen via Continue → Ollama) with Claude
- Code snippets should show exactly which file and which lines change; don't use `...` placeholders that merge separate locations into one block
- Run `npm run build` before pushing when changing config, packages, integrations, adapters or routes (it mirrors Cloudflare). For small content or markup edits, the dev server plus a glance at the Deployments page is enough
- A failed Cloudflare build keeps serving the last good deployment
- Use branches for risky work (e.g. major upgrades). Commits are logical milestones, not arbitrary saves

---

# Gotchas (hard-won)

- **Cloudflare Pages SPA fallback:** with no `404` page, Pages serves the homepage (status 200) for any unknown path. `404.astro` fixes this; `/nothing-here` should show the 404
- **Trailing slashes:** Pages serves `/contact/` and 308-redirects `/contact`. Keep canonicals, sitemap and internal links on one form (currently trailing slash)
- **Cached responses:** `/robots.txt` was once cached as the homepage; fixed with Cloudflare → Caching → Purge Cache → Custom Purge (URL). Check `/sitemap.xml` with `curl -I` (expect 200 and `application/xml`) if it ever looks wrong
- **`@astrojs/sitemap` failed** on Astro 4.16.19 + `@astrojs/cloudflare` 11.2.0 with `Cannot read properties of undefined (reading 'reduce')` at `astro:build:done`. Rolled back; suspected version mismatch, unconfirmed. `astro add sitemap` installs the latest integration, which may expect a newer Astro
- **Search Console sitemap:** a Domain property rejects a relative path ("not a valid path"); use the absolute URL. "Couldn't fetch" is common right after submission even when the file is fine; wait a day and don't delete and resubmit. URL Inspection saying "URL is not on Google" for a sitemap file is normal
- **Search Console snapshot vs live test:** the stored crawl can list many resources as "Other error" when pages are heavy; judge with Test Live URL
- **Favicon caching:** browsers and Google cache favicons heavily; test in a private window
- **Astro scripts on old Safari:** a plain `<script>` in an `.astro` file is bundled as a module, which old iOS Safari will not run. Anything the sign page needs must be `<script is:inline>` and written in ES5
- **Tailwind on old Safari:** Tailwind's output uses features old iOS Safari lacks (flex `gap`, `inset`, newer colour syntax). This is why the main site's nav runs together on the old iPad and why `/sign/` is hand-written CSS
- The old WordPress site (still on Vetta hosting) keeps calling the new site (`WordPress/x.x; https://artifactphotoandframe.co.nz` user agent)

---

# Future Integrations

Xero, supplier import pipeline, quotation workflow, CRM. Xero pattern decided: a server endpoint (`src/pages/api/pricing.ts`), never browser-to-Xero; tokens stay server-side. Client code never talks directly to external business APIs. Supplier pricing arrives as CSV/Excel/PDF, not APIs; the calculator consumes processed lookup tables.

**Long-term direction:** `business website` becomes `business platform` (framing calculator, supplier pricing engine, quotation system, client tools, automation, software demonstrations, portfolio). The public site stays simple while functionality grows behind it.

---

# Socials

| Platform | Status |
|---|---|
| Instagram `artifactphotoandframe` | Live; handle change deferred until flyers are reprinted; display name can change now |
| Facebook (profile ID `100085633746216`) | Live; same approach |
| LinkedIn `linkedin.com/in/andrew-graham-bb25b6251` | Personal; linked from the About study paragraph, not the footer |

"Create once, reuse across channels": same raw content, different framing per audience (Instagram = local/visual; LinkedIn = process/craft/systems). Archive old posts that cite outdated hours, and pin a post pointing to `artifactstudio.nz/contact/`. Update `Footer.astro` hrefs when new URLs are live.

---

# Session Log

## November 2026: sign display

- Built an open-hours display page for an old iPad whose Safari cannot render the normal Astro/Tailwind pages: first as `public/sign.html`, then as `src/pages/sign.astro` reading `src/data/hours.ts`
- Styled from the brand tokens and fonts (Source Serif Pro heading, Akzidenz Grotesk Next Pro 500/900, navy today row); three columns (day, centred date, right-aligned hours) over a rolling seven days, with an open/closed status line and an "Updated" time
- Tested `public/sign.html` on the iPad: loads over HTTPS and looks fine; works best from the Home Screen
- Decided hours are updated only in `hours.ts` and Google Business Profile; designed an optional date-keyed `exceptions` export for one-off closures (sign only)
- Documented the old-Safari rules in Sign Display and Gotchas

## October 2026: crawlability, performance, sitemap, structured data

- Confirmed Googlebot can crawl and render the site; requested indexing for all four pages
- Cut mobile PageSpeed from 64 to 92 (carousel and hero converted to WebP, resized, lazy-loaded, dimensions set, Typekit preconnect). Stopped tuning at 92
- Added a hand-written sitemap and `Sitemap:` line in `robots.txt`; submitted in Search Console
- Decided to allow all AI crawlers; documented the policy
- Added LocalBusiness JSON-LD, driven by `src/data/hours.ts` (shared with the Contact page)
- GBP name accepted; business added to Apple Maps

## October 2026: analytics and Google presence (earlier)

- Reviewed Cloudflare analytics; decided against Plausible/self-hosting for now
- Added theme-aware favicons, `robots.txt`, meta/canonical/Open Graph tags, `noindex` on style guides, and a 404 page
- Attempted `@astrojs/sitemap`; failed on the current Astro version; rolled back
- Chose trailing-slash canonicals; verified both domains in Search Console

---

# To-do

**Next**
1. Set up **Bing Webmaster Tools** (import from Search Console)
2. Rename Instagram and Facebook **display names** to Artifact Studio (handles wait for the flyer reprint); archive posts with stale hours; update `Footer.astro` hrefs
3. **Change of Address** in Search Console (old property → Settings → Change of address) if not already filed. First check `www.artifactphotoandframe.co.nz` reaches the new site; if not, add a proxied DNS `www` record and a redirect rule
4. **Cancel Vetta hosting** (keep the domain registration)
5. Search `src/` for remaining "Artifact Photo and Frame" wording (the schema `alternateName` is intentional)

**Site quality**
6. Fix the Accessibility contrast warning (expand the item in PageSpeed to see the element)
7. Give each carousel image specific alt text (currently all "Custom framing example")
8. Default `og:image` (1200×630 photo of finished work in `public/`)
9. **Trailing-slash decision:** preferred is `trailingSlash: 'always'` plus updating the eight Cloudflare redirect destinations to slash form, removing a redirect hop

**Maintenance**
10. **Upgrade Astro** on a branch (`npx @astrojs/upgrade`; currently 4.16.19). Read the upgrade guide, go one major version at a time. Astro 5 reworks `hybrid`, so test the calculator and its auth endpoint carefully; click through every page and the calculator login before merging
11. Reprint flyers with the new domain; keep the old Gmail mailbox active while old flyers circulate
12. Optionally record the trading name on NZBN/directories
13. Revisit the parked supplier-name mentions on About
14. Revisit analytics if the site's role grows
15. Each semester: update `src/data/hours.ts` and GBP hours, then re-run the Rich Results Test (the sign page follows `hours.ts` automatically)

**Sign display**
16. Move `sign.astro` into `src/pages/`, run `npm run build`, check `/sign/` on the iPad, then delete `public/sign.html`
17. Add the optional `exceptions` export to `hours.ts` when the first one-off closure comes up (and set GBP special hours for the same days)
18. "Closed today" wording for all-day closures, plus an optional `note` field in `exceptions`
19. Confirm the Adobe font family names against `tailwind.config.mjs` and check the fonts render on the iPad
20. Check the iPad's model, iOS version and battery condition; set Auto-Lock to Never, turn on Guided Access, and confirm Date & Time is automatic (NZ)
