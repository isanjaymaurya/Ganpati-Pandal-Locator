import React from 'react';
import Head from 'next/head';

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

interface Props {
  title: string;
  description: string;
  canonicalUrl: string;
  noIndex?: boolean;
  jsonLd?: object;
}

const PageHead: React.FC<Props> = ({ title, description, canonicalUrl, noIndex, jsonLd }) => (
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />
    {noIndex && <meta name="robots" content="noindex, nofollow" />}

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Ganpati Pandal Locator" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:image" content={OG_IMAGE} />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Ganpati Pandal Locator — Find Ganesh Chaturthi pandals in Mumbai" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:locale:alternate" content="mr_IN" />
    <meta property="og:locale:alternate" content="hi_IN" />

    {/* Twitter / X Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@isanjaymaurya" />
    <meta name="twitter:creator" content="@isanjaymaurya" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={OG_IMAGE} />
    <meta name="twitter:image:alt" content="Ganpati Pandal Locator — Find Ganesh Chaturthi pandals in Mumbai" />

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
);

export default PageHead;
