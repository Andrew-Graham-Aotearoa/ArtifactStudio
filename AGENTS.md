# AGENTS.md

# Artifact Studio

Artifact Studio is the long-term evolution of **Artifact Photo and Frame**, a custom framing business in Waihi, New Zealand. The framing business stays operational; the long-term direction combines craftsmanship, design, software development and digital services.

The site replaced a WordPress site with a modern Astro application, deliberately avoiding unnecessary complexity. This document gives architectural and business context to future AI assistants and developers: *why* decisions were made as much as *what* exists, plus a running log and to-do list.

---

# Career Context

Andrew is a sole trader moving from **skilled physical production + business operation** toward **systems design + technical implementation + workflow integration** ("middle-stack integration": frontend, backend, APIs, operational workflows). He is studying a Bachelor of Interface Design at the University of Waikato (started 2023, about halfway) alongside running the business.

The website is deliberately **dual-purpose**: a real business asset and a live portfolio. Future tooling (framing calculator, Xero integration, supplier pricing pipelines) should be built and documented with that in mind. Avoid over-promising services that aren't commercially ready, and avoid positioning as a "junior web developer".

---

# Current State (October 2026)

Live at `https://artifactstudio.nz` on Cloudflare Pages. Domain migration from the legacy WordPress site is complete.

```
VS Code → Git → GitHub → Cloudflare Pages → Production
```

GitHub is the source of truth. Never make changes manually in Cloudflare.

**Versions:** Astro 4.16.19, `@astrojs/cloudflare` 11.2.0, `@astrojs/tailwind` 5.1.5, React (islands only). `output: 'hybrid'`.

| Page                                              | Status                                                  |
| ------------------------------------------------- | ------------------------------------------------------- |
| Home, About, Services, Contact                    | Live, finalised copy                                    |
| 404 (`src/pages/404.astro`)                     | Added; confirm it serves on the live site (see Gotchas) |
| Style Guide (`/style-guide`, `/style-guide2`) | Deployed, unlinked from nav, `noindex`                |
| Calculator (`/calculator`)                      | Password-gated, unlinked from nav and footer            |


## October 2026 — Googlebot check and performance pass

- Confirmed Googlebot can crawl and render the site: URL Inspection live test passed for the homepage, and Cloudflare Security → Bots, Security Level and custom rules showed nothing blocking crawlers
- The stored snapshot in Search Console had listed 26/31 page resources as "Other error" (mostly images); the live test rendered correctly. Likely cause: heavy gallery images exceeding Google's fetch budget
- PageSpeed Insights (mobile) baseline: Performance 64, LCP 43.5 s, page weight about 14 MB, almost all from the 17 carousel images in `public/images/work/`
- Resized the carousel images to 640 px wide, then converted them and the hero (`shop-front`) to WebP (`cwebp`/`sharp-cli`, quality about 75, hero resized to 1200 px). Originals are kept outside the repo (`~/Desktop/work-originals`, `~/Desktop/shop-front-original.jpg`)
- `Carousel.astro`: added `width`/`height`, `loading="lazy"` and `decoding="async"` to the images. Hero `<img>` in `index.astro`: added `fetchpriority="high"`, `decoding="async"` and dimensions, with no lazy loading. Logo given explicit `width`/`height`
- `Layout.astro`: added `preconnect` hints for `use.typekit.net` and `p.typekit.net` ahead of the Adobe Fonts stylesheet
- Removed unused `shop-front.png` and the old `.jpg` files
- Result: PageSpeed mobile Performance 89, SEO 100, Best Practices 100, Accessibility 95. The test throttles to a slow phone on slow 4G, and there is no real-user (CrUX) data yet at this traffic level
- Decided to stop tuning at 89: remaining items (render-blocking Adobe Fonts CSS, contrast warning) have small gains

**Image conventions going forward**

- Carousel images: WebP, about 480-640 px wide, 15-80 KB each. They display at 160 px (240 px when centred), so larger files are wasted bytes
- Hero: WebP, about 1200 px wide, not lazy-loaded, `fetchpriority="high"`
- Always give `<img>` explicit `width` and `height`; lazy-load everything below the fold
- Compress from the originals, never from an already-compressed copy
- Consider Astro's `<Image>` (moving images into `src/assets/`) during the Astro upgrade, which would automate resizing and format conversion

---

# Business Context

Positioned as a premium creative practice, not just a framing shop. Should communicate thoughtful design, craftsmanship, technical capability, attention to detail and calm professionalism. Should resemble a gallery or studio more than a software dashboard or a traditional retail site.

Signage has changed to **Artifact Studio**; the legal trading name has not changed.

---

# Project Philosophy

Technology is introduced only when it provides genuine benefit.

- Prefer static pages; minimise client-side JavaScript
- Favour maintainability over cleverness; compose from reusable components
- Isolate complexity; keep hosting portable
- Optimise for long-term ownership; the site should be understandable after years away

---

# Stack

| Layer         | Choice                                             | Reason                                                            |
| ------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| Framework     | Astro (hybrid)                                     | Static by default, islands for interactivity, platform-agnostic   |
| Styling       | Tailwind CSS                                       | Predictable, minimal CSS maintenance                              |
| Interactivity | React (islands only)                               | Framing calculator; no SPA                                        |
| Hosting       | Cloudflare Pages                                   | Auto deploy, CDN, HTTPS, free tier                                |
| DNS           | Cloudflare (both domains)                          | See Domain Migration                                              |
| Email         | Zoho (DNS on Cloudflare), routed to existing Gmail | Keeps contact history                                             |
| Fonts         | Adobe Fonts (kit `sak1ctd`)                      | Source Serif Pro (headings) + Akzidenz Grotesk Next Pro (body/UI) |

Astro is used for static-first architecture and selective hydration. React is only for genuinely interactive islands.

## Design & typography

- `bg-brand-bg` (#f1f8fd), `bg-brand-accent` (#2c3082 deep navy), body text `stone-900`
- Source Serif Pro → `font-body` (H1–H3, lead paragraphs); Akzidenz Grotesk Next Pro → `font-header` (body, nav, buttons). An intentional inversion of the usual serif/sans pairing.
- Custom Tailwind values go inside `theme.extend`
- Config changes (`astro.config.mjs`, `tailwind.config.mjs`) need a dev server restart; `src/` changes hot-reload

---

# Page Content Decisions

**About:** two-column layout (`grid-cols-1 md:grid-cols-2`). Arc: owner-operated Waihi studio with precision-manufacturing background; 2017 Waihi Beach Gallery, 2022 Artifact Photo and Frame; closing paragraph frames university study as continued curiosity (does not name the degree). LinkedIn link belongs in that study paragraph, not the footer. *Parked:* naming suppliers (Larson-Juhl, Avon, Glasslines); revisit as plain-text "standard we hold ourselves to", never logos.

**Services:** two columns, **Custom Picture Framing** (real, sellable) and **Design & Digital** (ambitious, with italic caveat "Bespoke digital projects — get in touch to discuss scope and pricing."). "Install" service is discontinued.

**Contact:** merged with former Opening Hours. Address 51 Seddon Street, Waihi 3610; phone/WhatsApp 027 223 3561; email andrew@artifactstudio.nz; hours (seasonal, reconfirm periodically); Google Maps iframe (no API key). **No contact form** (avoids a server dependency); if wanted later, Web3Forms is the simplest option.

**Calculator:** business infrastructure, not marketing. Gated by `CALCULATOR_PASSWORD`, session cookie `frame_auth=ok` (8 h). React island renders only after the server-side auth check. Not linked anywhere public.

---

# Domain Migration (complete)

`artifactphotoandframe.co.nz` is a second Cloudflare zone; nameservers moved from Vetta. Eight 301 Redirect Rules (static, query string not preserved) map every legacy `?page_id=` URL: Home → `/`; Contact (75) and Opening Hours (89) → `/contact`; About (73) → `/about`; Design (230), Print (286), Frame (64) → `/services`; Install (301, discontinued) → `/`. All tested. Old MX/cPanel mail was never used. Zoho email on `artifactstudio.nz` is unaffected.

Keep the old domain **registered indefinitely** (redirects run at Cloudflare's edge, no origin needed). Old flyers in circulation still print the old address, which is another reason.

---

# Discoverability (SEO)

## Done

- `public/robots.txt` live (no `Sitemap:` line yet — see To-do)
- `Layout.astro` props: `title`, `description`, `image?`, `noindex?`. Emits meta description, canonical, Open Graph tags (`og:image` only if a page passes `image`) and optional `noindex`
- Canonical **keeps the trailing slash** (`/about/`, homepage `/`), matching how Cloudflare Pages actually serves pages
- Specific titles and descriptions on Home, About, Services, Contact; style guides set `noindex`
- Favicons: `favicon.svg` (mark only, transparent, navy in light mode and pale in dark mode via `prefers-color-scheme`), `favicon.ico` (16/32/48, navy tile), `apple-touch-icon.png` (180, full-bleed), `favicon-192.png` (192, square). The `.ico` link uses `sizes="any"` because Google prefers multiples of 48px.
- Search Console: **Domain properties verified for both** `artifactstudio.nz` and `artifactphotoandframe.co.nz` (TXT records in Cloudflare; the old zone needed a manual TXT)
- Google Business Profile: website link now `https://artifactstudio.nz`; description rewritten as prose

## Google Business Profile notes

- Name change to **Artifact Studio** is pending; signage already matches. Use the sign's exact wording, no keywords in the name. Upload a signage photo first.
- Primary category stays **Picture frame shop**. Add only categories for things customers physically buy locally (e.g. printing, photo restoration if available); avoid a digital design/web category, which attracts out-of-area enquiries. Category lists vary by region and change over time.
- Per-service descriptions aren't available for this listing, so detail lives in the prose description. Services are listed by name, and photos carry the rest.
- **Social handles are deliberately unchanged** until flyers are reprinted and the GBP name is accepted. Changing the Instagram handle breaks old links; changing only the display name is the lower-risk first step.

---

# Analytics (decision: no Plausible for now)

Reviewed Cloudflare zone analytics (30 days): 14.18k requests / "8.82k visits", but mostly bots (US, NL, FR, PL etc.; `wp-login.php` probes; `python-requests`, `Go-http-client`). Filtered to **Country = New Zealand** and excluding AI crawlers, then removing unknown-browser/OS rows: roughly **85 real pageviews, about 50–60 visits, per month**, mostly on **mobile** (about 50 mobile vs 36 desktop), a few via in-app browsers (Instagram/Facebook links).

**Decision:** Plausible (about US$9+/month) and self-hosting (about $5–20/month plus maintenance of Postgres and ClickHouse) don't offer realistic value at this volume. Use Cloudflare Web Analytics (free), Search Console and Business Profile insights, and ask new customers how they found the business. Revisit if the site's role grows (calculator, Design & Digital work, portfolio demonstration). If revisited, start with the Plausible Cloud trial and goals for phone, email and map taps.

Useful filter recipe (Cloudflare → Analytics → Add filter): Country equals New Zealand; Verified Bot Category does not equal AI Crawler; then read Top user agents and exclude scripts.

---

# Rendering Strategy

Static by default. Server-rendered: Calculator and its auth endpoint. Keep the public site extremely fast.

# Hosting Philosophy

Cloudflare Pages, but avoid Cloudflare-specific features where possible so a host change mostly means swapping the adapter.

# Development Workflow

```
edit → test locally (npm run dev) → git add → commit → push → Cloudflare builds → Production
```

- Andrew prefers file-by-file walkthroughs with specific line changes, not full rewrites, and uses VS Code Source Control over terminal Git. Pairs local AI (Qwen via Continue → Ollama) with Claude.
- Run `npm run build` before pushing when changing config, packages, integrations, adapters or routes (it mirrors Cloudflare and catches errors the dev server won't). For small content or markup edits, the dev server plus a glance at the Deployments page is enough.
- A failed Cloudflare build keeps serving the last good deployment.
- Stop the dev server with Ctrl+C or use a second terminal. Use branches for risky work (e.g. major upgrades).

---

# Gotchas (hard-won)

- **Cloudflare Pages SPA fallback:** with no `404` page, Pages serves the homepage (status 200) for any unknown path, which also made bot probes look like homepage traffic. `404.astro` fixes this; verify `artifactstudio.nz/nothing-here` shows the 404.
- **Trailing slashes:** Pages serves `/contact/` and 308-redirects `/contact`. Keep canonicals, sitemap and internal links on one form (currently trailing slash).
- **Cached responses:** `/robots.txt` was cached as the homepage before the file existed; fixed with Cloudflare → Caching → Purge Cache → Custom Purge (URL).
- **`@astrojs/sitemap` failed** on Astro 4.16.19 + `@astrojs/cloudflare` 11.2.0 with `Cannot read properties of undefined (reading 'reduce')` at `astro:build:done` (no error shown above the stack trace). It silently produces no sitemap locally, and the build exits with an error on Cloudflare. Rolled back (restored `astro.config.mjs`, `package.json`, `package-lock.json` from the commit before). Suspected version mismatch; unconfirmed.
- `astro add sitemap` installs the latest integration, which may expect a newer Astro. Match versions via `npx @astrojs/upgrade`.
- **Favicon caching:** browsers and Google cache favicons heavily; Google can take days to weeks. Test in a private window.
- The old WordPress site (still on Vetta hosting) has been calling the new site (`WordPress/x.x; https://artifactphotoandframe.co.nz` user agent).

---

# Component, Folder, Animation and Data Philosophy

- Components are reusable interface elements; pages compose them. Avoid duplication.
- `layouts/` shared shell; `components/` reusable UI; `pages/` routing; `assets/` processed images; `public/` static files; `styles/` global only.
- Animation reinforces usability: CSS transitions → Tailwind utilities → Astro View Transitions → React animation libraries only when justified.
- Supplier pricing arrives as CSV/Excel/PDF, not APIs; the calculator consumes processed lookup tables.

# Future Integrations

Xero, supplier import pipeline, quotation workflow, CRM. Xero pattern decided: server endpoint (`src/pages/api/pricing.ts`), never browser-to-Xero; tokens server-side only. Client code never talks directly to external business APIs.

# Git Philosophy

Commits are logical milestones, not arbitrary saves. GitHub is backup and deploy trigger; Cloudflare is never canonical.

---

# Socials

| Platform                                             | Status                                                                 |
| ---------------------------------------------------- | ---------------------------------------------------------------------- |
| Instagram `artifactphotoandframe`                  | Live; rebrand deferred (see GBP notes). Local, visual, customer-facing |
| Facebook (profile ID `100085633746216`)            | Live; rebrand deferred                                                 |
| LinkedIn `linkedin.com/in/andrew-graham-bb25b6251` | Personal; linked from the About study paragraph, not the footer        |

"Create once, reuse across channels": same raw content, different framing per audience (Instagram = local/visual; LinkedIn = process/craft/systems angle). Remove or archive old Instagram posts that cite outdated hours, and pin a post pointing to `artifactstudio.nz/contact`. Update footer `href` values when new URLs are live.

---

# Long-Term Direction

`business website` → `business platform`: framing calculator, supplier pricing engine, quotation system, client tools, automation, software demonstrations, development portfolio. The public site stays simple while functionality grows behind it.

# Core Principles

- Build systems, not pages; prefer composition over duplication
- Prefer static over dynamic; JavaScript only when necessary
- Keep business logic separate from presentation
- Optimise for clarity, maintainability and long-term ownership; keep hosting portable
- Don't over-promise services ahead of pricing/delivery readiness
- Don't borrow credibility before independent reputation is established

If a decision conflicts with these, revisit it consciously.

---

# Session Log

## October 2026 — analytics, discoverability and Google presence

- Reviewed Cloudflare analytics; concluded most traffic is bots and real NZ traffic is small; decided against Plausible/self-hosting for now
- Replaced favicon with a transparent, theme-aware mark; added `.ico`, Apple touch and 192px PNG icons
- Added `robots.txt`, meta/canonical/Open Graph tags, specific page titles and descriptions, `noindex` on style guides, and a 404 page
- Attempted `@astrojs/sitemap`; failed on the current Astro version; rolled back cleanly
- Chose trailing-slash canonicals to match Cloudflare Pages behaviour
- Verified both domains in Search Console; updated Google Business Profile website link and description

---

# To-do

**Next**

1. **Upgrade Astro** on a branch (`npx @astrojs/upgrade`; currently 4.16.19). Read the upgrade guide first and go one major version at a time. Likely changes: Astro 5 reworks `hybrid` into default-static with per-page opt-out, so test the calculator and its auth endpoint carefully. Merge only after clicking through every page and the calculator login.
2. **Re-add the sitemap** after the upgrade: `npx astro add sitemap`, then set `site: 'https://artifactstudio.nz'`, the filter (exclude `/calculator` and `/style-guide`), and the trailing-slash choice. Fallback if it keeps failing: hand-written `public/sitemap.xml` with the four public URLs. Then add the `Sitemap:` line to `robots.txt` (the integration produces `sitemap-index.xml`) and submit it in Search Console.
3. **Trailing-slash decision:** preferred is `trailingSlash: 'always'` plus updating the eight Cloudflare redirect destinations to slash form (`/contact/` etc.), removing a redirect hop. The alternative (`'never'` with `build.format: 'file'`) is a bigger change to test.

**Google / migration**
4. File the **Change of Address** in Search Console (old property → Settings → Change of address) if not already done. First check `www.artifactphotoandframe.co.nz` reaches the new site; if not, add a proxied DNS `www` record and a redirect rule.
5. **Cancel Vetta hosting** (keep the domain registration). The old WordPress site is still making requests to the new one.
6. Confirm `favicon-192.png` and the `sizes="any"` change are deployed; request indexing of the homepage in Search Console URL Inspection.
7. Verify the live 404 (`artifactstudio.nz/nothing-here`).

**Business / branding**
8. After flyers are reprinted and the GBP name is accepted: update Instagram and Facebook (display name first, handle later), update `Footer.astro` hrefs, and archive posts with stale hours.
9. Keep the old Gmail mailbox active while old flyers circulate; reprint flyers with the new domain.
10. Search `src/` for remaining "Artifact Photo and Frame" wording.
11. Optionally record the trading name on NZBN/directories for consistency.

**Later**
12. Default `og:image` (1200×630 photo of finished work in `public/`).
13. LocalBusiness/Organization schema (lightweight replacement for what Yoast provided).
14. Review Cloudflare's "Block AI training bots" setting on both zones deliberately, rather than leaving the default.
15. Reconfirm seasonal opening hours on Contact and in GBP.
16. Revisit parked supplier-name mentions on About (see Page Content Decisions).
17. Revisit analytics if the site's role grows (see Analytics decision).

18. Fix the Accessibility contrast warning (Accessibility 95): expand the "Background and foreground colors do not have a sufficient contrast ratio" item in PageSpeed to see which element, likely light text or a button on navy
19. Give each carousel image specific alt text (currently all "Custom framing example")

18. Fix the Accessibility contrast warning (Accessibility 95): expand the "Background and foreground colors do not have a sufficient contrast ratio" item in PageSpeed to see which element, likely light text or a button on navy
19. Give each carousel image specific alt text (currently all "Custom framing example")
