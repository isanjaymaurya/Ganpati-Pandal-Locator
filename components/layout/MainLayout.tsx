import React from 'react';
import { useRouter } from 'next/router';

import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import PageHead from './PageHead';

const SITE_URL = 'https://isanjaymaurya.github.io/Ganpati-Pandal-Locator';

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
      <PageHead
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
        noIndex={noIndex}
        jsonLd={jsonLd}
      />
      <Header />
      <main id="main-content" className="container mx-auto">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;