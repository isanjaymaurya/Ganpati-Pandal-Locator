import { Html, Head, Main, NextScript } from 'next/document';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="A map of Ganpati Pandals in Mumbai" />
        {/* Favicons */}
        <link rel="icon" href={`${BASE}/favicon.ico`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${BASE}/apple-icon.png`} />
        {/* Manifest */}
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        {/* Theme color */}
        <meta name="theme-color" content="#5B21B6" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}