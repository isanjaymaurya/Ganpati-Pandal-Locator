import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Agent } from 'node:https';

import axios from 'axios';
import Papa from 'papaparse';

import { CSV_URL } from '@/constants/env';
import { setSearchSelectedPandal } from '@/store/appSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { GanpatiPandal } from '@/types/global';

import MainLayout from '@/components/layout/MainLayout';

const MobileSearchDrawer = dynamic(
  () => import('@/components/SearchBar/MobileSearchDrawer'),
  { ssr: false },
);

const PandalsVirutalList = dynamic(
  () => import('@/components/PandalsVirutalList/PandalsVirutalList'),
  { ssr: false, loading: () => null },
);

const GanpatiPandalsMap = dynamic(
  () => import('@/components/GanpatiPandalsMap/GanpatiPandalsMap'),
  { ssr: false },
);

type Props = {
  ganpatiPandals: GanpatiPandal[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const agent = new Agent({ rejectUnauthorized: false });
  const response = await axios.get<string>(CSV_URL, {
    httpsAgent: agent,
    responseType: 'text',
  });

  const parsed = Papa.parse<GanpatiPandal>(response.data, {
    header: true,
    skipEmptyLines: true,
  });

  return {
    props: {
      ganpatiPandals: parsed.data,
    },
  };
};

export default function Home({ ganpatiPandals }: Props) {
  const dispatch = useAppDispatch();
  const searchSelectedPandal = useAppSelector((state) => state.favourites.searchSelectedPandal);
  const [selectedPandal, setSelectedPandal] = useState<GanpatiPandal | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  // True only for the very first render when the URL already carries a pandal
  const isSharedUrl = useRef(false);
  const total = ganpatiPandals.length;

  const router = useRouter();
  // Keep a stable ref so handleSelectPandal doesn’t re-create on every router change
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  });

  const handleSelectPandal = useCallback((pandal: GanpatiPandal) => {
    setSelectedPandal(pandal);
    isSharedUrl.current = false; // subsequent selections are normal (animated)
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
        (p) => p.name === name && p.latitude === lat && p.longitude === lng,
      );
      if (match) {
        isSharedUrl.current = true; // coming from a shared URL — skip fly animation
        setSelectedPandal(match);
      }
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

  // Memoised so the JSON-LD object is stable across re-renders
  const homeJsonLd = useMemo(
    () => ({
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
              urlTemplate:
                'https://isanjaymaurya.github.io/Ganpati-Pandal-Locator/?name={search_term_string}',
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
    }),
    [total],
  );

  return (
    <MainLayout
      title={`Ganpati Pandal Locator | ${total}+ Pandals`}
      description={`Explore ${total}+ Ganpati pandals across Mumbai this Ganesh Chaturthi. Find pandals near you on an interactive map, get Google Maps directions, search by name or location, and save your favourites.`}
      jsonLd={homeJsonLd}
    >
      <section className="md:mx-4 md:mt-4">
        <div className="flex flex-col md:flex-row md:items-start md:gap-4">
          <div className="w-full md:w-1/2 lg:w-2/3">
            <GanpatiPandalsMap
              ganpatiPandals={ganpatiPandals}
              selectedPandal={selectedPandal}
              onLocate={setUserLocation}
              isSharedUrl={isSharedUrl}
            />
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            {/* Search pill — mobile only, above the list, opens the drawer */}
            <div className="px-2 pb-1 pt-2 md:hidden">
              <MobileSearchDrawer userLocation={userLocation} />
            </div>
            <PandalsVirutalList
              ganpatiPandals={ganpatiPandals}
              onSelectPandal={handleSelectPandal}
              userLocation={userLocation}
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
