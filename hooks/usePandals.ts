import { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import type { IGanpatiPandal } from '@/types/global';
import { CSV_URL } from '@/constants/env';

/**
 * Fetches and parses the pandal CSV on mount.
 * Returns the parsed list and a loading flag.
 */
export function usePandals(): { pandals: IGanpatiPandal[]; loading: boolean } {
  const [pandals, setPandals] = useState<IGanpatiPandal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(CSV_URL, { responseType: 'text' }).then((res) => {
      const { data } = Papa.parse<IGanpatiPandal>(res.data as string, {
        header: true,
        skipEmptyLines: true,
      });
      setPandals(data);
      setLoading(false);
    });
  }, []);

  return { pandals, loading };
}
