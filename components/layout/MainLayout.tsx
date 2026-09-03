import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

const SITE_URL = 'https://isanjaymaurya.github.io/Ganpati-Pandal-Locator';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ganpati Pandal Locator',
  url: SITE_URL + '/',
  description:
    'Discover and navigate to Ganpati pandals near you during Ganesh Chaturthi. Browse an interactive map, search the full pandal directory, save favourites, and get Google Maps directions — all in one place.',
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

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[99999] focus:bg-primary focus:text-text-on-primary focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
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
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Ganpati Pandal Locator — Find Ganesh Chaturthi pandals in Mumbai" />
        <meta property="og:locale" content="en_IN" />

                {/* Twitter / X Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@isanjaymaurya" />
        <meta name="twitter:creator" content="@isanjaymaurya" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Ganpati Pandal Locator — Find Ganesh Chaturthi pandals in Mumbai" />

        <meta property="og:locale:alternate" content="mr_IN" />
        <meta property="og:locale:alternate" content="hi_IN" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </Head>
      <Header />
      <main id="main-content" className="container mx-auto">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;