/**
 * @type {import('next').NextConfig}
 */

// Apply static export only during production build (npm run build).
// In dev mode (npm run dev), omitting 'output: export' prevents the
// prerender-manifest.json ENOENT crash that Next.js 15 throws when
// the static-export manifest hasn't been generated yet.
const isProd = process.env.NODE_ENV === 'production';

// GitHub Pages serves the site from a subdirectory.
// basePath  — prefixes all internal Next.js routes and <Link> hrefs
// assetPrefix — prefixes all JS/CSS chunk URLs emitted by webpack
const REPO_NAME = '/Ganpati-Pandal-Locator';

const nextConfig = {
  ...(isProd && { output: 'export' }),

  // Prefix all routes and assets with the repo subpath on GitHub Pages
  ...(isProd && {
    basePath: REPO_NAME,
    assetPrefix: REPO_NAME,
  }),

  // Expose basePath to client-side code (used for Leaflet icon URLs, favicons, etc.)
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? REPO_NAME : '',
  },

  // Required for next/image with static export (next export)
  images: {
    unoptimized: true,
  },

  trailingSlash: true,
};

module.exports = nextConfig;