import { Html, Head, Main, NextScript } from 'next/document';
import { BASE } from '@/constants/env';

export default function Document() {
  return (
    <Html lang="en-IN">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* Favicons */}
        <link rel="icon" href={`${BASE}/favicon.ico`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${BASE}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${BASE}/favicon-16x16.png`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${BASE}/apple-touch-icon.png`} />

        {/* PWA */}
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        <meta name="theme-color" content="#C45000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ganpati Pandal Locator" />

        {/* Global SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Sanjay Maurya" />
        <meta name="keywords" content="Ganpati pandal, Ganesh Chaturthi, Mumbai pandals, Ganeshotsav, pandal locator, Ganesh pandal map, Mumbai Ganesh festival, Ganpati near me, Ganesh utsav pandal" />
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content="Mumbai, Maharashtra, India" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}