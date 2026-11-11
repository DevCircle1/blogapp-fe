/** @type {import('next').NextConfig} */

// The app used to be a Vite project whose public env vars were VITE_*. Next only
// exposes NEXT_PUBLIC_* to the browser, so the old names are accepted as a
// fallback: an existing .env or Netlify environment keeps working untouched.
const publicEnv = (name) => process.env[`NEXT_PUBLIC_${name}`] ?? process.env[`VITE_${name}`] ?? '';

const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // The site has two root layouts (English, and /<lang>), so a 404 cannot be composed from one layout:
  // see src/app/global-not-found.jsx.
  experimental: { globalNotFound: true },

  env: {
    NEXT_PUBLIC_SUPABASE_URL: publicEnv('SUPABASE_URL'),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publicEnv('SUPABASE_PUBLISHABLE_KEY'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: publicEnv('SUPABASE_ANON_KEY'),
    NEXT_PUBLIC_SUPABASE_BLOG_IMAGES_BUCKET: publicEnv('SUPABASE_BLOG_IMAGES_BUCKET'),
    NEXT_PUBLIC_ADSENSE_SLOT_TOOL_INLINE: publicEnv('ADSENSE_SLOT_TOOL_INLINE'),
    NEXT_PUBLIC_ADSENSE_SLOT_TOOL_FOOTER: publicEnv('ADSENSE_SLOT_TOOL_FOOTER'),
    NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_INLINE: publicEnv('ADSENSE_SLOT_ARTICLE_INLINE'),
    NEXT_PUBLIC_ADSENSE_SLOT_LISTING: publicEnv('ADSENSE_SLOT_LISTING'),
  },

  async redirects() {
    return [
      // Canonical host. Without this, www and the apex are two crawlable copies
      // of every page.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.talkandtool.com' }],
        destination: 'https://talkandtool.com/:path*',
        statusCode: 301,
      },
      // The standalone profit margin page was replaced by the fuller margin and
      // markup tool; a 301 passes its ranking signals to the new URL.
      { source: '/profit-margin-calculator', destination: '/tools/margin-markup-calculator', statusCode: 301 },
      // The current tax year has no page of its own: the canonical calculator IS
      // the current year. When a new tax year is added, move this redirect to the
      // year that stops being current (and give that year its own page).
      {
        source: '/tools/salary-tax-calculator-pakistan/2026-27',
        destination: '/tools/salary-tax-calculator-pakistan',
        statusCode: 301,
      },
    ];
  },

  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600' },
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
        ],
      },
      {
        source: '/ads.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
        ],
      },
      { source: '/:file(.+)\\.png', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }] },
    ];
  },
};

export default nextConfig;
