/**
 * Generates public/og-image.png — a branded 1200×630 Open Graph image.
 * Run: node scripts/generate-og-image.js
 */
const sharp = require('sharp');
const path = require('path');

const svgOverlay = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#a23217"/>
      <stop offset="70%"  stop-color="#C45000"/>
      <stop offset="100%" stop-color="#e06010"/>
    </linearGradient>
  </defs>

  <!-- background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- decorative gold bottom bar -->
  <rect x="0" y="590" width="1200" height="40" fill="#FFB800" opacity="0.35"/>

  <!-- main title -->
  <text
    x="600" y="230"
    font-family="Arial Black, Arial, sans-serif"
    font-size="72"
    font-weight="900"
    fill="#FFFFFF"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="-1"
  >Ganpati Pandal Locator</text>

  <!-- subtitle -->
  <text
    x="600" y="330"
    font-family="Arial, sans-serif"
    font-size="34"
    font-weight="400"
    fill="#FFE8A0"
    text-anchor="middle"
    dominant-baseline="middle"
  >Find Ganesh Chaturthi pandals in Mumbai</text>

  <!-- gold pill badge -->
  <rect x="370" y="400" width="460" height="54" rx="27" fill="#FFB800"/>
  <text
    x="600" y="427"
    font-family="Arial, sans-serif"
    font-size="22"
    font-weight="700"
    fill="#3D0C00"
    text-anchor="middle"
    dominant-baseline="middle"
  >Interactive Map &amp; Pandal Directory</text>
</svg>
`);

sharp(svgOverlay)
  .png()
  .toFile(path.join(__dirname, '..', 'public', 'og-image.png'))
  .then(() => console.log('✅  public/og-image.png created (1200×630 with branding)'))
  .catch((e) => { console.error('❌  Failed:', e); process.exit(1); });
