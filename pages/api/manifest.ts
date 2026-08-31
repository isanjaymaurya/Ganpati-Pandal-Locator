import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Serves the PWA Web App Manifest dynamically so that icon paths are
 * correctly prefixed in both dev (no basePath) and production (GitHub Pages
 * subpath /Ganpati-Pandal-Locator).
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const manifest = {
    name: 'Ganpati Pandal Locator',
    short_name: 'Pandal Locator',
    description:
      'Find Ganpati pandals near you across Mumbai during Ganesh Chaturthi on an interactive map.',
    start_url: `${base}/`,
    scope: `${base}/`,
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#C45000',
    background_color: '#FFF8EE',
    lang: 'en-IN',
    categories: ['navigation', 'travel', 'lifestyle'],
    icons: [
      {
        src: `${base}/android-chrome-192x192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: `${base}/android-chrome-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };

  res.setHeader('Content-Type', 'application/manifest+json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).json(manifest);
}
