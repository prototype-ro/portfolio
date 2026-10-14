/**
 * Canonical public URL of the site, used for metadata, Open Graph, canonical
 * links, robots and the sitemap. Configure `NEXT_PUBLIC_SITE_URL` in production
 * (Vercel sets `VERCEL_URL` automatically as a fallback).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
