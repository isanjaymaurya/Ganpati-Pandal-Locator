import { Html, Head, Main, NextScript } from 'next/document';
import { BASE } from '@/constants/env';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="A map of Ganpati Pandals in Mumbai" />
        {/* Favicons */}
        <link rel="icon" href={`${BASE}/favicon.ico`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${BASE}/apple-touch-icon.png`} />
        {/* Manifest */}
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        {/* Theme color */}
        <meta name="theme-color" content="#5B21B6" />
        {/* Noto Sans — same font family CARTO Voyager map tiles use */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        {/* Inline script to apply saved theme before first paint — prevents flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('theme');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (t === 'dark' || (!t && prefersDark)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `}} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}