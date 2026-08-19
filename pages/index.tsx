import React from 'react';
import { GetStaticProps } from 'next';
import Papa from 'papaparse';
import axios from 'axios';
import { Agent } from 'node:https';
import dynamic from 'next/dynamic';
import type { IGanpatiPandal } from '../types/global';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';

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
  const csvUrl =
    'https://docs.google.com/spreadsheets/d/1Z7Dsgv8f0eGSysC6JkOATyBDJODeNd2p8IOiLvPJXlY/export?format=csv';

  // Use axios to fetch the CSV as text
  const response = await axios.get(csvUrl, {
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
  const [selectedPandal, setSelectedPandal] = React.useState<IGanpatiPandal | null>(null);
  return (
    <MainLayout>
      <section className="sm:py-12">
        <div className='flex gap-3 sm:gap-4 flex-col md:flex-row'>
          <div className='md:w-1/2 lg:w-2/3 w-full'>
            <GanpatiPandalsMap ganpatiPandals={ganpatiPandals} selectedPandal={selectedPandal} />
          </div>
          <div className='md:w-1/2 lg:w-1/3 w-full'>
            <div className='flex justify-between items-center mb-2'>
              <h2 className="text-text-primary font-bold">NEARBY PANDALS</h2>
              <Link href="/pandals" className='text-sm text-primary-light hover:text-primary'>
                <button>
                  View All
                </button>
              </Link>
            </div>
            <PandalsVirutalList ganpatiPandals={ganpatiPandals} onSelectPandal={setSelectedPandal} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
