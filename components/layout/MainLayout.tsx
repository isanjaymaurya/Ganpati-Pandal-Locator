import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header/Header';
import DesktopFooter from '@/components/Footer/DesktopFooter';

const SITE_URL = 'https://isanjaymaurya.github.io/Ganpati-Pandal-Locator';
const OG_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  noIndex?: boolean;
  jsonLd?: object;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  description,
  noIndex = false,
  jsonLd,
}) => {
  const router = useRouter();
  const pageTitle = title ?? 'Ganpati Pandal Locator';
  const pageDescription =
    description ??
    'Discover and navigate to Ganpati pandals near you during Ganesh Chaturthi. Browse an interactive map, search the full pandal directory, save favourites, and get Google Maps directions — all in one place.';
  const canonicalUrl = `${SITE_URL}${router.asPath.split('?')[0]}`;

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ganpati Pandal Locator',
    url: SITE_URL + '/',
    description: pageDescription,
    author: {
      '@type': 'Person',
      name: 'Sanjay Maurya',
      url: 'https://github.com/isanjaymaurya',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?name={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {noIndex && <meta name="robots" content="noindex, nofollow" />}

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ganpati Pandal Locator" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="Ganpati Pandal Locator — Find Ganesh Chaturthi pandals in Mumbai" />
        <meta property="og:locale" content="en_IN" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd ?? websiteJsonLd) }}
        />
      </Head>
      <Header />
      <main className="container mx-auto">{children}</main>
      <DesktopFooter />
    </>
  );
};

export default MainLayout;