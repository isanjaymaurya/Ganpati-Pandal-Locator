import { RefObject, useEffect } from 'react';
import L from 'leaflet';

import { MAX_ZOOM, MOBILE_BREAKPOINT, MOBILE_MAP_OFFSET_FRACTION } from '@/constants/map';
import type { GanpatiPandal } from '@/types/global';
import { isValidCoord } from '@/utils/geo';

interface Options {
  mapRef: RefObject<L.Map | null>;
  selectedPandal: GanpatiPandal | null | undefined;
  ganpatiPandals: GanpatiPandal[];
  isSharedUrl: RefObject<boolean> | undefined;
  onPopupIdx: (idx: number | null) => void;
}

export function useMapFlyTo({
  mapRef,
  selectedPandal,
  ganpatiPandals,
  isSharedUrl,
  onPopupIdx,
}: Options): void {
  useEffect(() => {
    if (!selectedPandal || !mapRef.current) {
      onPopupIdx(null);
      return;
    }

    const lat = parseFloat(selectedPandal.latitude);
    const lng = parseFloat(selectedPandal.longitude);
    if (!isValidCoord(lat, lng)) return;

    if (isSharedUrl?.current) {
      mapRef.current.setView([lat, lng], MAX_ZOOM, { animate: false });
    } else {
      const map = mapRef.current;
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (isMobile) {
        const mapSize = map.getSize();
        const targetPoint = map.project([lat, lng], MAX_ZOOM);
        const adjustedPoint = targetPoint.subtract([0, mapSize.y * MOBILE_MAP_OFFSET_FRACTION]);
        map.flyTo(map.unproject(adjustedPoint, MAX_ZOOM), MAX_ZOOM, { animate: true, duration: 0.8 });
      } else {
        map.flyTo([lat, lng], MAX_ZOOM, { animate: true, duration: 0.8 });
      }
    }

    const idx = ganpatiPandals.findIndex(
      (p) => p.name === selectedPandal.name && p.location === selectedPandal.location,
    );
    onPopupIdx(idx !== -1 ? idx : null);
    // isSharedUrl is a stable ref — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPandal, ganpatiPandals]);
}
