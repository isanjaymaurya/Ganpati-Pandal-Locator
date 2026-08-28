import { useEffect, useState } from 'react';

import axios from 'axios';
import Papa from 'papaparse';

import { CSV_URL } from '@/constants/env';
import type { GanpatiPandal } from '@/types/global';

/**
 * Fetches and parses the pandal CSV on mount.
 * Returns the parsed list, a loading flag, and any fetch error.
 */
export function usePandals(): {
  pandals: GanpatiPandal[];
  loading: boolean;
  error: Error | null;
} {
  const [pandals, setPandals] = useState<GanpatiPandal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    axios
      .get<string>(CSV_URL, { responseType: 'text' })
      .then((res) => {
        if (cancelled) return;
        const { data } = Papa.parse<GanpatiPandal>(res.data, {
          header: true,
          skipEmptyLines: true,
        });
        setPandals(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { pandals, loading, error };
}
