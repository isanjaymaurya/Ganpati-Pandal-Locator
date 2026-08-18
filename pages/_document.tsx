import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="A map of Ganpati Pandals in Mumbai" />
        {/* Favicons */}
        <link rel="icon" href="favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
        {/* Manifest */}
        {/* <link rel="manifest" href="manifest.json" /> */}
        {/* Browserconfig */}
        {/* <meta name="msapplication-config" content="browserconfig.xml" /> */}
        {/* Theme color */}
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}