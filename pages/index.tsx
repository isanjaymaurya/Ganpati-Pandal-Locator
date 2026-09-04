import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import axios from 'axios';
import Papa from 'papaparse';
import { List, Map } from 'lucide-react';

import { CSV_URL } from '@/constants/env';
import { setSearchSelectedPandal } from '@/store/appSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { GanpatiPandal } from '@/types/global';
import MainLayout from '@/components/layout/MainLayout';

const PandalsVirtualList = dynamic(
  () => import('@/components/PandalsVirtualList/PandalsVirtualList'),
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
  const response = await axios.get<string>(CSV_URL, { responseType: 'text' });

  const parsed = Papa.parse<Omit<GanpatiPandal, 'is_famous'> & { is_famous: string }>(response.data, {
    header: true,
    skipEmptyLines: true,
  });

  const ganpatiPandals: GanpatiPandal[] = parsed.data
    .filter((p) => p.name?.trim() && p.latitude?.trim() && p.longitude?.trim())
    .map((p) => ({
      ...p,
      is_famous: p.is_famous?.toLowerCase() === 'true',
    }));

  return {
    props: {
      ganpatiPandals,
    },
  };
};

export default function Home({ ganpatiPandals }: Props) {
  const dispatch = useAppDispatch();
  const searchSelectedPandal = useAppSelector((state) => state.favourites.searchSelectedPandal);
  const [selectedPandal, setSelectedPandal] = useState<GanpatiPandal | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');
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

  const homeJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Ganpati Pandal Locator',
      url: 'https://isanjaymaurya.github.io/Ganpati-Pandal-Locator/',
      applicationCategory: 'TravelApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      description: `Find ${total}+ Ganpati pandals across Mumbai on an interactive map during Ganesh Chaturthi.`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      author: { '@type': 'Person', name: 'Sanjay Maurya' },
    }),
    [total],
  );

  return (
    <MainLayout
      title={`Ganpati Pandal Locator | ${total}+ Pandals`}
      description={`Explore ${total}+ Ganpati pandals across Mumbai this Ganesh Chaturthi. Find pandals near you on an interactive map, get Google Maps directions, search by name or location, and save your favourites.`}
      jsonLd={homeJsonLd}
    >
      <div role="tablist" aria-label="View mode" className="md:hidden flex border-b border-border bg-surface sticky top-14 z-[900]">
        <button
          role="tab"
          onClick={() => setMobileTab('map')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${
            mobileTab === 'map'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary border-b-2'
          }`}
          aria-selected={mobileTab === 'map'}
        >
          <Map size={14} /> Map
        </button>
        <button
          role="tab"
          onClick={() => setMobileTab('list')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${
            mobileTab === 'list'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary border-b-2'
          }`}
          aria-selected={mobileTab === 'list'}
        >
          <List size={14} /> List
        </button>
      </div>

      <section className="md:mx-4 md:mt-4">
        <div className="flex flex-col md:flex-row md:items-start md:gap-4">
          <div className={`w-full md:w-1/2 lg:w-2/3 ${mobileTab === 'list' ? 'hidden md:block' : ''}`}>
            <GanpatiPandalsMap
              ganpatiPandals={ganpatiPandals}
              selectedPandal={selectedPandal}
              onLocate={setUserLocation}
              isSharedUrl={isSharedUrl}
            />
          </div>
          <div className={`w-full md:w-1/2 lg:w-1/3 ${mobileTab === 'map' ? 'hidden md:block' : ''}`}>
            <PandalsVirtualList
              ganpatiPandals={ganpatiPandals}
              onSelectPandal={(pandal) => { handleSelectPandal(pandal); setMobileTab('map'); }}
              userLocation={userLocation}
              total={total}
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
