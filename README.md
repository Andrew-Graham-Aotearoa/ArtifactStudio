# Custom Picture Framing Website

A production-oriented Astro project for a picture framing business, built with static rendering, server-side protected pricing tools, and future accounting integration.
Astro-based rebuild of a legacy WordPress site.

## Stack
- **Astro** (hybrid mode — static pages by default, server-rendered where needed)
- **Tailwind CSS** for styling
- **React** The framing calculator
- **Cloudflare adapter** to start (swap easily — see `astro.config.mjs`)

## Structure
```
src/
  components/
    Nav.astro              ← static nav, edit links/labels
    Footer.astro
    FramingCalculator.jsx  ← React island, stubbed pricing logic on inception.
  layouts/
    Layout.astro           ← shared <head>, Nav, Footer wrapper
  pages/
    index.astro             these stay static (pre-rendered at build time)
    about.astro
    services.astro
    contact.astro
    calculator.astro       ← server-rendered, password-gated
    api/
      login.ts              ← checks password, sets session cookie
```

## Getting started
```bash
npm install
npm run dev
```

1. **Replace placeholder content.** Pull real text/images out of your
   WordPress static export

2. **Set the calculator password.**
   For local dev, create a `.env` file (excluded from version control)
   ```
   ```
   For Cloudflare deployment, set it as a secret instead of an env var
   in the dashboard (or `wrangler secret put CALCULATOR_PASSWORD`) so it's
   encrypted rather than sitting in a config file.

3. **Replace the pricing stub.** `FramingCalculator.jsx` has placeholder
   sheet multipliers and a base rate at the top of the file — swap in
   your real numbers.

4. **Xero, later.** When you're ready to wire in the Xero API:
   - Register an app at https://developer.xero.com
   - Add a server endpoint (e.g. `src/pages/api/pricing.ts`, same
     pattern as `api/login.ts`) that holds the Xero access/refresh
     tokens and does the OAuth handshake
   - Point `FramingCalculator.jsx` at that endpoint instead of (or in
     addition to) the local stub — the component itself shouldn't need
     to change shape much, just where the numbers come from

