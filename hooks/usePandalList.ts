import { useMemo } from 'react';

import type { FavouritePandal, GanpatiPandal } from '@/types/global';
import { formatDistance, getDistanceKm, isValidCoord } from '@/utils/geo';
import { isFamous } from '@/utils/pandal';
import type { FavouriteFilterType } from '@/components/PandalsVirtualList/PandalListFilters';

export type PandalWithDistance = { pandal: GanpatiPandal; distance: string | null };
type PandalWithDistanceAndKm = PandalWithDistance & { km: number };

interface Options {
  pandals: GanpatiPandal[];
  search: string;
  favouriteFilter: FavouriteFilterType;
  favourites: FavouritePandal[];
  userLocation: [number, number] | null | undefined;
}

export function usePandalList({
  pandals,
  search,
  favouriteFilter,
  favourites,
  userLocation,
}: Options): PandalWithDistance[] {
  const searched = useMemo(
    () =>
      pandals.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase()),
      ),
    [pandals, search],
  );

  const withDistance = useMemo((): PandalWithDistance[] => {
    if (!userLocation) {
      return [...searched]
        .sort((a, b) => Number(isFamous(b)) - Number(isFamous(a)))
        .map((p) => ({ pandal: p, distance: null }));
    }
    const [uLat, uLng] = userLocation;
    const withKm: PandalWithDistanceAndKm[] = searched.map((p) => {
      const lat = parseFloat(p.latitude);
      const lng = parseFloat(p.longitude);
      const km = isValidCoord(lat, lng) ? getDistanceKm(uLat, uLng, lat, lng) : Infinity;
      return { pandal: p, distance: isFinite(km) ? formatDistance(km) : null, km };
    });
    withKm.sort((a, b) => a.km - b.km);
    return withKm.map(({ pandal, distance }) => ({ pandal, distance }));
  }, [searched, userLocation]);

  const filtered = useMemo(() => {
    if (favouriteFilter === 'favourited')
      return withDistance.filter(({ pandal: p }) =>
        favourites.some((fp) => fp.name === p.name),
      );
    if (favouriteFilter === 'non-favourited')
      return withDistance.filter(
        ({ pandal: p }) => !favourites.some((fp) => fp.name === p.name),
      );
    return withDistance;
  }, [favouriteFilter, withDistance, favourites]);

  return filtered;
}
