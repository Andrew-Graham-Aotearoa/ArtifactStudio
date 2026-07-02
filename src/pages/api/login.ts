import type { APIRoute } from 'astro';

// Set CALCULATOR_PASSWORD as an environment variable / Cloudflare secret —
// never hardcode it here. wrangler secret put CALCULATOR_PASSWORD (Cloudflare)
// or the equivalent for whichever host you end up on.
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect, locals }) => {
  const form = await request.formData();
  const password = form.get('password');

  // @ts-expect-error - runtime env shape depends on adapter (Cloudflare/Vercel/Netlify)
  const expected = locals.runtime?.env?.CALCULATOR_PASSWORD ?? import.meta.env.CALCULATOR_PASSWORD;

  if (password && password === expected) {
    cookies.set('frame_auth', 'ok', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return redirect('/calculator');
  }

  return redirect('/calculator?error=1');
};
