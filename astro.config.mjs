import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// Platform-agnostic note:
// Everything here is plain Astro + React + Tailwind. The only
// host-specific piece is the adapter below. To move to Vercel or
// Netlify later, swap this import/line for @astrojs/vercel or
// @astrojs/netlify — nothing else in the project needs to change.
export default defineConfig({
  output: 'hybrid', // static by default, per-page opt-in to server rendering
  adapter: cloudflare(),
  integrations: [react(), tailwind()],
});
