import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import Papa from 'papaparse';
import axios from 'axios';
import { Agent } from 'node:https';
import dynamic from 'next/dynamic';
import type { IGanpatiPandal } from '@/types/global';
import MainLayout from '@/components/layout/MainLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchSelectedPandal } from '@/store/appSlice';
import { CSV_URL } from '@/constants/env';

const MobileSearchDrawer = dynamic(
  () => import('@/components/SearchBar/MobileSearchDrawer'),
  { ssr: false }
);

const PandalsVirutalList = dynamic(() => import('@/components/PandalsVirutalList/PandalsVirutalList'), {
  ssr: false,
  loading: () => null,
});

const GanpatiPandalsMap = dynamic(
  () => import('../components/GanpatiPandalsMap/GanpatiPandalsMap'),
  { ssr: false }
);

type Props = {
  ganpatiPandals: IGanpatiPandal[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const agent = new Agent({ rejectUnauthorized: false });
  const response = await axios.get(CSV_URL, {
    httpsAgent: agent,
    responseType: 'text',
  });

  const csvText = response.data as string;

  const parsed = Papa.parse<IGanpatiPandal>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return {
    props: {
      ganpatiPandals: parsed.data,
    }
  };
};

export default function Home({ ganpatiPandals }: Props) {
  const dispatch = useAppDispatch();
  const searchSelectedPandal = useAppSelector((state) => state.favourites.searchSelectedPandal);
  const [selectedPandal, setSelectedPandal] = useState<IGanpatiPandal | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const total = ganpatiPandals.length;

    const router = useRouter();
  // Keep a stable ref so handleSelectPandal doesn't re-create on every router change
  const routerRef = useRef(router);
  useEffect(() => { routerRef.current = router; });

  const handleSelectPandal = useCallback((pandal: IGanpatiPandal) => {
    setSelectedPandal(pandal);
    const params = new URLSearchParams({
      name: pandal.name,
      lat: pandal.latitude,
      lng: pandal.longitude,
    });
    routerRef.current.replace(
      `${routerRef.current.pathname}?${params.toString()}`,
      undefined,
      { shallow: true },
    );
  }, []); // stable — no deps needed thanks to routerRef

  // Restore selected pandal from URL params on initial load
  useEffect(() => {
    const { name, lat, lng } = router.query as Record<string, string>;
    if (name && lat && lng) {
      const match = ganpatiPandals.find(
        (p) => p.name === name && p.latitude === lat && p.longitude === lng
      );
      if (match) setSelectedPandal(match);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // When a pandal is selected via the search bar, centre the map and clear redux state
  useEffect(() => {
    if (searchSelectedPandal) {
      handleSelectPandal(searchSelectedPandal);
      dispatch(setSearchSelectedPandal(null));
    }
  }, [searchSelectedPandal, dispatch, handleSelectPandal]);

    const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://isanjaymaurya.github.io/Ganpati-Pandal-Locator/#website',
        name: 'Ganpati Pandal Locator',
        url: 'https://isanjaymaurya.github.io/Ganpati-Pandal-Locator/',
        description: `Explore ${total}+ Ganpati pandals across Mumbai this Ganesh Chaturthi.`,
        inLanguage: 'en-IN',
        author: {
          '@type': 'Person',
          name: 'Sanjay Maurya',
          url: 'https://github.com/isanjaymaurya',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://isanjaymaurya.github.io/Ganpati-Pandal-Locator/?name={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebApplication',
        name: 'Ganpati Pandal Locator',
        url: 'https://isanjaymaurya.github.io/Ganpati-Pandal-Locator/',
        applicationCategory: 'TravelApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        description: `Find ${total}+ Ganpati pandals across Mumbai on an interactive map during Ganesh Chaturthi.`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        author: { '@type': 'Person', name: 'Sanjay Maurya' },
      },
    ],
  };

  return (
    <MainLayout
      title={`Ganpati Pandal Locator | ${total}+ Pandals`}
      description={`Explore ${total}+ Ganpati pandals across Mumbai this Ganesh Chaturthi. Find pandals near you on an interactive map, get Google Maps directions, search by name or location, and save your favourites.`}
      jsonLd={homeJsonLd}
    >
      <section className="md:mx-4 md:mt-4">
                <div className='flex md:gap-4 flex-col md:flex-row md:items-start'>
          <div className='md:w-1/2 lg:w-2/3 w-full'>
            <GanpatiPandalsMap ganpatiPandals={ganpatiPandals} selectedPandal={selectedPandal} onLocate={setUserLocation} />
          </div>
          <div className='md:w-1/2 lg:w-1/3 w-full'>
            {/* Search pill — mobile only, above the list, opens the drawer */}
            <div className="md:hidden px-2 pt-2 pb-1">
              <MobileSearchDrawer userLocation={userLocation} />
            </div>
            <PandalsVirutalList ganpatiPandals={ganpatiPandals} onSelectPandal={handleSelectPandal} userLocation={userLocation} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
