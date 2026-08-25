import React, { useCallback, useEffect, useState } from 'react';
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

const PandalsVirutalList = dynamic(() => import('@/components/PandalsVirutalList/PandalsVirutalList'), {
  ssr: false,
  loading: () => null,
});

const GanpatiPandalsMap = dynamic(
  () => import('../components/GanpatiPandalsMap/GanpatiPandalsMap'),{
    ssr: false
  }
);

const agent = new Agent({
  rejectUnauthorized: false,
});

type Props = {
  ganpatiPandals: IGanpatiPandal[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
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

  const handleSelectPandal = useCallback((pandal: IGanpatiPandal) => {
    setSelectedPandal(pandal);
  }, []);

  // When a pandal is selected via the search bar, centre the map and clear redux state
  useEffect(() => {
    if (searchSelectedPandal) {
      handleSelectPandal(searchSelectedPandal);
      dispatch(setSearchSelectedPandal(null));
    }
  }, [searchSelectedPandal, dispatch, handleSelectPandal]);

  return (
    <MainLayout
      title={`Ganpati Pandal Locator | ${total}+ Pandals`}
      description={`Explore ${total}+ Ganpati pandals across Mumbai this Ganesh Chaturthi. Find pandals near you on an interactive map, get Google Maps directions, search by name or location, and save your favourites.`}
    >
      <section className="md:m-4">
        <div className='flex md:gap-4 flex-col md:flex-row'>
          <div className='md:w-1/2 lg:w-2/3 w-full'>
            <GanpatiPandalsMap ganpatiPandals={ganpatiPandals} selectedPandal={selectedPandal} onLocate={setUserLocation} />
          </div>
          <div className='md:w-1/2 lg:w-1/3 w-full'>
            <PandalsVirutalList ganpatiPandals={ganpatiPandals} onSelectPandal={handleSelectPandal} userLocation={userLocation} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
