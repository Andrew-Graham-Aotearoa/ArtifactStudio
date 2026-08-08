# AGENTS.md

# Artifact Studio

## Purpose

Artifact Studio is the long-term evolution of **Artifact Photo and Frame**, a custom framing business based in Waihi, New Zealand.

The existing business remains operational, but the long-term direction is broader than framing. The website is intended to become the public face of a business that combines craftsmanship, design, software development and digital services.

This project replaced a WordPress site with a modern Astro application, deliberately avoiding unnecessary complexity.

This document provides architectural and business context for future AI assistants and developers. It explains *why* decisions have been made as much as *what* has been implemented, and includes a running log of major work completed.

---

# Career Context (Why This Project Matters Beyond the Business)

Andrew is a sole trader running Artifact Studio, transitioning from **skilled physical production + business operation** toward **systems design + technical implementation + workflow integration** — described as "middle-stack integration": bridging frontend, backend, APIs, and operational workflows.

He is studying a Bachelor of Interface Design at the University of Waikato (started 2023, roughly halfway complete), alongside running the business. The degree gives technical language to decades of operational, manufacturing, and business experience (10 years boatbuilding/precision fabrication, gallery ownership, ~10 years custom framing).

**This means the Artifact Studio website is deliberately dual-purpose**: it is both a real business asset and a live portfolio/learning project demonstrating the "middle-stack integration" direction. Future tooling (framing calculator, Xero integration, supplier pricing pipelines) should be built and documented with this dual purpose in mind — real infrastructure that also demonstrates capability.

Career strategy explicitly avoids over-promising services not yet commercially ready (see Services page decisions below) and avoids positioning as "junior web developer" — the differentiator is operational + systems understanding, not coding alone.

---

# Current State (as of this update)

The project is **live and the domain migration from the legacy WordPress site is complete.**

Current production environment:

- Domain: `https://artifactstudio.nz`
- Hosting: Cloudflare Pages
- Source control: GitHub
- Local development: VS Code + Node
- Continuous deployment configured (GitHub → Cloudflare Pages)

```
VS Code → Git → GitHub → Cloudflare Pages → Production
```

GitHub is the source of truth. Cloudflare should never become the place where changes are made manually.

## Pages — status

| Page | Status |
|---|---|
| Home | Live, finalised copy |
| About | Live, finalised — see "About Page Content" below |
| Services | Live, finalised — see "Services Page Content" below |
| Contact | Live, finalised — merged with former Opening Hours page, includes live Google Map embed |
| Style Guide | Deployed but intentionally unlinked from nav (internal reference only) |
| Calculator (`/calculator`) | Not yet built. When built, will follow the same pattern as Style Guide — deployed and password-gated, but **deliberately not linked in nav or footer** (see "Calculator" section below) |

---

# Business Context

Artifact Studio is intentionally positioned as a premium creative practice rather than simply a framing business.

The website should communicate: thoughtful design, craftsmanship, technical capability, attention to detail, calm professionalism.

Avoid appearing overly "tech startup" while also moving beyond the appearance of a traditional retail business — should resemble a gallery or studio more than a software dashboard.

The transition from **Artifact Photo and Frame** to **Artifact Studio** occurred gradually. As of this update, the legacy domain (`artifactphotoandframe.co.nz`) has completed its migration (see "Domain Migration" below) and the WordPress hosting is being cancelled.

---

# Project Philosophy

This project deliberately favours simplicity. Technology is introduced only when it provides genuine benefit.

General principles:
- prefer static pages
- minimise client-side JavaScript
- favour maintainability over cleverness
- compose interfaces from reusable components
- isolate complexity
- keep hosting portable
- optimise for long-term ownership rather than short-term convenience

The website should remain understandable after years away from the project.

---

# Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Astro (hybrid mode) | Static by default, islands for interactivity, platform-agnostic |
| Styling | Tailwind CSS | Predictable, minimal CSS maintenance, component-friendly |
| Interactivity | React (islands only) | Framing calculator; no full SPA needed |
| Hosting | Cloudflare Pages | Automatic deployment, CDN, HTTPS, generous free tier |
| DNS | Cloudflare (both domains) | See Domain Migration |
| Email | Zoho, DNS on Cloudflare, routed to existing Gmail | Keeps contact history intact, avoids losing existing contacts |
| Fonts | Adobe Fonts (kit `sak1ctd`) | Source Serif Pro (headings) + Akzidenz Grotesk Next Pro (body/UI) — "V2" inverted pairing chosen for brand authenticity |

Astro was chosen for static-first architecture, minimal JS, selective hydration, and hosting independence. React is used only for genuinely interactive islands (the calculator) — never as the default page renderer.

---

# Design & Typography

- `bg-brand-bg` (#f1f8fd), `bg-brand-accent` (#2c3082 deep navy), body text `stone-900`
- Source Serif Pro → `font-body`, used for headings (H1–H3, lead paragraphs)
- Akzidenz Grotesk Next Pro → `font-header`, used for body/UI, nav, buttons
- This is an intentional inversion of the conventional serif/sans pairing, chosen for brand authenticity ("V2")
- Custom Tailwind values must be nested inside `theme.extend`, not top-level `theme`
- Config changes (`astro.config.mjs`, `tailwind.config.mjs`) require a dev server restart; `src/` changes hot-reload

---

# Page Content Decisions

## About Page Content

Final narrative arc (two-column responsive layout, `grid-cols-1 md:grid-cols-2`, border/padding between columns suppressed on mobile via `border-s-0 md:border-s` and `px-0 md:px-12`):

1. Owner-operated studio in Waihi, precision manufacturing background (carbon fibre racing yachts/super-yachts) connected to framing discipline.
2. 2017: co-founded Waihi Beach Gallery, found framing through serendipity/local demand. 2022: moved on to start Artifact Photo and Frame independently.
3. **Closing paragraph** ties in ongoing study at University of Waikato as evidence of continued curiosity/up-skilling — deliberately framed as disposition ("a deliberate choice to keep learning") rather than resume-style credential listing (avoided naming "Bachelor of Interface Design" directly to prevent raising unrelated questions on a framing business page). Ends by naming Artifact Studio as the result of that ongoing curiosity.

**Parked (not implemented):** naming specific material suppliers (Larson-Juhl, Avon Framing Supplies, Glasslines/Gro-Glass) in About. Originally judged to read as borrowing credibility before the business had established independent reputation. **Note:** the business has an actual trading history from 2023–2026, so the "no independent reputation yet" concern is less of a real issue than first framed — the remaining hesitation is more about tone/optics (not wanting it to read as name-dropping or currying favour) than a substantive credibility gap. Worth revisiting this decision with that in mind; if reintroduced, use plain text mentions only (no logos — trademark risk) and frame as "the standard we hold ourselves to," not a supplier directory.

## Services Page Content

Two-column layout: **Custom Picture Framing** / **Design & Digital**.

- Custom Picture Framing: real, sellable services (Custom Frame Design, Glass Replacement, Frame Cleaning, Canvas Stretching, Cross Stitch and Tapestry, Float and Tray Frames, Sports Jerseys).
- Design & Digital: intentionally kept ambitious (includes Logo/Branding, Website Design and Development, User Experience & Interface Design) reflecting genuine coursework/assignment capability — **but paired with an italic caveat line**: "Bespoke digital projects — get in touch to discuss scope and pricing." This honestly signals that digital work is priced/scoped case-by-case (a real pricing-process gap, not a skills gap), without underselling capability or hiding it.
- "Install" (art installation/hanging service) has been **discontinued** due to liability and demand constraints — not listed as a service. Any surviving media mentioning "install" is now understood to mean installation-readiness of the finished framed piece, not an installation service.

## Contact Page Content

Merges the former standalone "Opening Hours" page into Contact (single page, per the project's static-simplicity philosophy).

Includes:
- Address: 51 Seddon Street, Waihi 3610, New Zealand
- Phone/WhatsApp: 027 223 3561 (`tel:` link)
- Email: **andrew@artifactstudio.nz** (`mailto:` link) — replaces legacy `artifactphotoandframe@gmail.com`
- Opening hours (ported from legacy site — flagged as seasonally variable; worth reconfirming periodically, since old Instagram posts referenced seasonal hour changes)
- Live Google Maps embed via simple query-string iframe (no API key required): `https://www.google.com/maps?q=51+Seddon+Street,+Waihi,+New+Zealand&output=embed`

**Decision: no contact form for now.** Direct contact details were chosen over a working form to avoid adding a server-side dependency (API route or third-party service) before it's needed. If a form is wanted later, **Web3Forms** is the identified simplest bolt-on (static HTML form + access key, no backend code required).

---

# Calculator — Private Access

The framing calculator is business infrastructure, not marketing content, and is intentionally private.

- Route: `/calculator`
- Gated by password (`CALCULATOR_PASSWORD` env var), session cookie `frame_auth=ok`, 8-hour expiry
- React island (`FramingCalculator.jsx`) only renders after server-side auth check passes

**Decision: not linked in nav or footer.** Same treatment as the Style Guide page — deployed and reachable directly by URL, but deliberately omitted from public navigation, since listing a password-gated internal tool in the public menu contradicts its purpose and adds unnecessary discoverability for bots/competitors. Access via bookmark or direct URL entry only.

---

# Domain Migration (Completed This Session)

Full migration from the legacy WordPress site to the new Astro site, including domain-level redirects, has been completed and tested.

## Summary of what was done

1. Added `artifactphotoandframe.co.nz` as a second zone in the same Cloudflare account as `artifactstudio.nz`.
2. Confirmed no dependency between Zoho email routing (on `artifactstudio.nz`) and the old domain/Vetta host — clean separation, no risk to email during migration.
3. Changed nameservers at Vetta from `ns1–ns4.domainhosting.co.nz` to Cloudflare's assigned pair: `garrett.ns.cloudflare.com` / `stella.ns.cloudflare.com`. Zone went active same day.
4. Built and deployed **8 Cloudflare Redirect Rules** (all 301 Permanent, Static type, query string not preserved) mapping every legacy WordPress URL (plain permalinks, `?page_id=` query strings, no clean slugs) to its new equivalent:

| Old page | Match | New destination |
|---|---|---|
| Home (`/`) | path=`/` and query empty | `https://artifactstudio.nz/` |
| Contact (`page_id=75`) | query = `page_id=75` | `/contact` |
| About (`page_id=73`) | query = `page_id=73` | `/about` |
| Opening Hours (`page_id=89`) | query = `page_id=89` | `/contact` (merged) |
| Design (`page_id=230`) | query = `page_id=230` | `/services` |
| Print (`page_id=286`) | query = `page_id=286` | `/services` |
| Frame (`page_id=64`) | query = `page_id=64` | `/services` |
| Install (`page_id=301`, discontinued service) | query = `page_id=301` | `/` (not Services — service no longer offered, avoid implying continuity) |

5. **All 8 redirects tested and confirmed working** (incognito browser spot-check against each legacy URL).
6. Old MX record / cPanel mail service on the legacy domain confirmed genuinely unused (never linked to any real mailbox or given out) — safe to let go dead.
7. **Remaining step:** cancel Vetta hosting (safe now that redirects are live and tested) while **keeping the domain registration active indefinitely** — registration and hosting are separate; only registration needs to persist for the redirect to keep working, since Cloudflare's edge handles the redirect with no origin server required.
8. **Also recommended, not yet done:** submit a Change of Address in Google Search Console (verify both properties first) to explicitly tell Google the site has moved, and update the Google Business Profile to point at the new domain directly.

---

# SEO Plan (Next Priority)

Per project philosophy, SEO work was intentionally postponed until placeholder content was cleared — **that condition is now met** (About/Services/Contact all have real, finalised copy), so SEO work can begin.

## Planned steps, in order

1. **Sitemap** — add `@astrojs/sitemap` integration to auto-generate `sitemap.xml` on build.
2. **robots.txt** — allow crawling, reference the sitemap.
3. **Per-page metadata** — title tags and meta descriptions for Home, About, Services, Contact (avoid generic/leftover titles — note: the old "Services | Your Frame Co." leftover title was already caught and fixed this session; worth double-checking no other pages carry stale template titles).
4. **Open Graph tags** — og:title, og:description, og:image, og:url per page, wired through `Layout.astro`.
5. **Canonical URLs** per page.
6. **Google Search Console** — verify `artifactstudio.nz`, submit sitemap, and use the **Change of Address** tool (requires verifying both old and new properties) to transfer accumulated SEO trust from the legacy domain now that the redirect map is live and tested.
7. **Google Business Profile** — update to point at the new domain.
8. Optional/later: structured data (LocalBusiness/Organization schema) — the old Yoast SEO plugin was providing basic schema; worth considering a lightweight equivalent once the above is done, not before.

---

# Analytics Plan (After SEO)

Planned platform: **Plausible** (lightweight, privacy-friendly, minimal performance impact) — sequenced last, after content and SEO structure are stable, so measurement reflects the real, finished site rather than a moving target.

## Planned steps

1. Create/confirm Plausible account.
2. Add the Plausible script tag to `Layout.astro` (or a dedicated analytics partial), scoped to production only if a staging/dev environment is ever introduced.
3. Confirm no interference with Cloudflare's own bot-management settings (the `artifactphotoandframe.co.nz` zone currently has "Block AI training bots" set to a default of "Block only on pages with ads" — worth reviewing this setting on both zones once analytics are in place, decide deliberately rather than leaving default).
4. Once live, consider simple goal/event tracking later (e.g., Contact page clicks on phone/email links, or Calculator login attempts) — not needed at initial setup.

Note: Cloudflare Web Analytics was considered as an alternative (zero-cost, already available since Cloudflare is in use for hosting/DNS) but Plausible remains the committed choice per existing project direction — worth revisiting only if there's a concrete reason to switch.

---

# Rendering Strategy

Default assumption: static generation. Only opt into server rendering when required.

Static: Home, About, Services, Contact, Style Guide.
Server rendered: Calculator, authentication endpoint.

Goal: keep the public website extremely fast.

---

# Hosting Philosophy

Current host: Cloudflare Pages — automatic deployment, CDN, HTTPS, custom domain support, generous free tier.

The project intentionally avoids Cloudflare-specific features where possible. Changing hosts should primarily require changing the Astro adapter rather than rewriting application code.

---

# Development Workflow

```
edit → test locally (npm run dev) → git add → git commit → git push → Cloudflare builds automatically → Production updates
```

Running `npm run build` before committing is encouraged — mirrors the Cloudflare build process and catches errors early.

Andrew prefers to be walked through edits file-by-file with specific line changes rather than full file rewrites, and uses VS Code's Source Control panel over terminal Git commands. Pairs local AI (Qwen via Continue extension → Ollama endpoint) with Claude for development work.

---

# Component Philosophy

Components represent reusable interface elements rather than isolated pages (navigation, footer, layout, buttons, cards, future testimonials/pricing displays). Pages primarily compose components. Avoid duplication.

---

# Folder Responsibilities

```
layouts/      → Shared page shell
components/   → Reusable interface
pages/        → Routing
assets/       → Processed images
public/       → Static assets
styles/       → Global styling only
```

---

# Animation Philosophy

Animation should reinforce usability rather than attract attention. Preferred order: CSS transitions → Tailwind utilities → Astro View Transitions → React animation libraries (only when justified). Motion should remain subtle.

---

# Data Philosophy

Supplier pricing is expected to arrive primarily as CSV/Excel/PDF, not via API. The calculator should consume processed lookup tables rather than raw supplier documents.

---

# Future Integrations

Possible future additions: Xero, supplier import pipeline, customer quotation workflow, CRM integration, analytics (see Analytics Plan above).

Architecture already decided for Xero: server endpoint pattern (`src/pages/api/pricing.ts`), never direct browser-to-Xero calls. Tokens stored server-side only (Cloudflare secret or equivalent).

Client-side code should never communicate directly with external business APIs.

---

# Git Philosophy

Git history is valuable. Commits should represent logical milestones rather than arbitrary saves. GitHub is backup, collaboration point, and deployment trigger. Cloudflare should never become the canonical version of the project.

---

# Socials

| Platform | URL | Status |
|---|---|---|
| Instagram | `artifactphotoandframe` | Live — rebrand to Artifact Studio pending. Business-facing channel: local/visual/customer-facing content |
| Facebook | profile ID `100085633746216` | Live — rebrand pending |
| LinkedIn | `linkedin.com/in/andrew-graham-bb25b6251` | Personal profile, not a framing-business funnel. **Decision: link from the About page's career/study narrative (near the "studying design" paragraph), not from the footer's business social icon row** — keeps it discoverable to someone curious about Andrew personally/professionally without competing for attention as a customer channel |

Update footer `href` values (Instagram/Facebook) when rebrand URLs are live.

## Social Content Strategy

Andrew's preferred approach is **"create once, reuse across channels"** — the same raw content (photos, process shots, finished work) gets repurposed with different framing/captions per platform's audience, rather than producing separate content for each:

- **Instagram** — local, visual, customer-facing. "Come visit," finished pieces, shop presence.
- **LinkedIn** (if ever used for the business, not just personal) — process/craft/systems angle, tied to the career transition narrative (e.g., the manufacturing-tolerances-to-framing throughline, "software-informed operational systems design" positioning). Different reason for someone to follow, not "Instagram but professional."

**Also flagged for cleanup:** old Instagram posts referencing outdated/seasonal opening hours should be removed or archived — stale hours in old posts undermine trust if someone scrolls back and finds conflicting information. Consider pinning something evergreen instead (e.g., "current hours always at artifactstudio.nz/contact") so hours never need to live in a time-bound post again.

---

# Long-Term Direction

Expected evolution: `business website` → `business platform`.

Likely additions: framing calculator, supplier pricing engine, quotation system, client tools, automation, software demonstrations, development portfolio.

The public-facing website should remain relatively simple even as business functionality grows behind it.

---

# Core Principles

When making architectural decisions, prefer solutions that satisfy the following:

- Build systems, not pages.
- Prefer composition over duplication.
- Prefer static over dynamic.
- Introduce JavaScript only when necessary.
- Keep business logic separate from presentation.
- Optimise for clarity and maintainability.
- Keep hosting portable.
- Favour long-term ownership over short-term convenience.
- Don't over-promise services ahead of genuine pricing/delivery readiness (see Services page).
- Don't borrow credibility before independent reputation is established (see supplier mentions, parked).

If a future decision conflicts with these principles, they should be revisited consciously rather than accidentally.
