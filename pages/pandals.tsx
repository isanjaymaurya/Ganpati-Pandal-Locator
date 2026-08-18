import React from 'react';
import { GetStaticProps } from 'next';
import Papa from 'papaparse';
import axios from 'axios';
import https from 'https';
import dynamic from 'next/dynamic';
import MainLayout from '@/components/layout/MainLayout';
import type { IGanpatiPandal } from '@/types/global';

const PandalsVirutalList = dynamic(
  () => import('@/components/PandalsVirutalList/PandalsVirutalList'),
  { ssr: false, loading: () => null }
);

const agent = new https.Agent({ rejectUnauthorized: false });

type Props = {
  ganpatiPandals: IGanpatiPandal[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const csvUrl =
    'https://docs.google.com/spreadsheets/d/1Z7Dsgv8f0eGSysC6JkOATyBDJODeNd2p8IOiLvPJXlY/export?format=csv';

  const response = await axios.get(csvUrl, {
    httpsAgent: agent,
    responseType: 'text',
  });

  const parsed = Papa.parse<IGanpatiPandal>(response.data as string, {
    header: true,
    skipEmptyLines: true,
  });

  return { props: { ganpatiPandals: parsed.data } };
};

export default function PandalListPage({ ganpatiPandals }: Props) {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 py-4">
        <h2 className="text-xl font-bold mb-3 text-text-primary">All Pandals</h2>
        <div style={{ height: 'calc(100vh - 180px)' }}>
          <PandalsVirutalList ganpatiPandals={ganpatiPandals} />
        </div>
      </section>
    </MainLayout>
  );
}


