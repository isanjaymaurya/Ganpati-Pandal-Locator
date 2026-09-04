import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import type { GanpatiPandal } from '@/types/global';

interface Options {
  pandals: GanpatiPandal[];
  onSelect: (pandal: GanpatiPandal) => void;
}

interface UseSelectedPandalReturn {
  isSharedUrl: React.RefObject<boolean>;
}

export function useSelectedPandal({ pandals, onSelect }: Options): UseSelectedPandalReturn {
  const router = useRouter();
  const routerRef = useRef(router);
  const isSharedUrl = useRef(false);

  useEffect(() => {
    routerRef.current = router;
  });

  // Restore selected pandal from URL params on initial load
  useEffect(() => {
    const { name, lat, lng } = router.query as Record<string, string>;
    if (name && lat && lng) {
      const match = pandals.find(
        (p) => p.name === name && p.latitude === lat && p.longitude === lng,
      );
      if (match) {
        isSharedUrl.current = true;
        onSelect(match);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return { isSharedUrl };
}

export function usePandalUrlSync(): (pandal: GanpatiPandal) => void {
  const router = useRouter();
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  });

  return useCallback((pandal: GanpatiPandal) => {
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
  }, []);
}
