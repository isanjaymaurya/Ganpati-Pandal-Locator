/**
 * @type {import('next').NextConfig}
 */

// Apply static export only during production build (npm run build).
// In dev mode (npm run dev), omitting 'output: export' prevents the
// prerender-manifest.json ENOENT crash that Next.js 15 throws when
// the static-export manifest hasn't been generated yet.
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  ...(isProd && { output: 'export' }),

  // Required for next/image with static export (next export)
  images: {
    unoptimized: true,
  },

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
};

module.exports = nextConfig;