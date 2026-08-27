import React, { useCallback, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { FavouritePandal } from '@/store/appSlice';
import { addFavourite, removeFavourite } from '@/store/appSlice';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import type { IGanpatiPandal } from '@/types/global';
import { isFamous } from '@/utils/pandal';
import { getDistanceKm, formatDistance, isValidCoord } from '@/utils/geo';
import { highlightMatch } from '@/utils/highlight';
import SingleVerticalPandalCard from '@/components/SingleVerticalPandalCard/SingleVerticalPandalCard';
import PandalListFilters, { type FavouriteFilterType } from './PandalListFilters';
import NearbyBanner from './NearbyBanner';

interface Props {
  ganpatiPandals: IGanpatiPandal[];
  onSelectPandal?: (pandal: IGanpatiPandal) => void;
  userLocation?: [number, number] | null;
}

const cache = new CellMeasurerCache({ fixedWidth: true, defaultHeight: 80 });

const PandalsVirutalList: React.FC<Props> = ({ ganpatiPandals, onSelectPandal, userLocation }) => {
  const favourites = useAppSelector((state) => state.favourites.favourites);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [favouriteFilter, setFavouriteFilter] = useState<FavouriteFilterType>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 1. Search filter
  const searchedPandals = useMemo(
    () =>
      ganpatiPandals.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase()),
      ),
    [ganpatiPandals, search],
  );

    // 2. Attach distance + sort (by distance when located, by famous otherwise)
  const pandalsWithDistance = useMemo((): Array<{ pandal: IGanpatiPandal; distance: string | null }>  => {
    if (!userLocation) {
      return [...searchedPandals]
        .sort((a, b) => Number(isFamous(b)) - Number(isFamous(a)))
        .map((p) => ({ pandal: p, distance: null }));
    }
    const [uLat, uLng] = userLocation;
    return searchedPandals
      .map((p) => {
        const lat = parseFloat(p.latitude);
        const lng = parseFloat(p.longitude);
        const km = isValidCoord(lat, lng) ? getDistanceKm(uLat, uLng, lat, lng) : Infinity;
        return { pandal: p, distance: isFinite(km) ? formatDistance(km) : null, km };
      })
      .sort((a, b) => a.km - b.km)
      .map(({ pandal, distance }) => ({ pandal, distance })); // drop km from output type
  }, [searchedPandals, userLocation]);

  // 3. Favourite filter
  const filteredPandals = useMemo(() => {
    if (favouriteFilter === 'favourited')
      return pandalsWithDistance.filter(({ pandal: p }) =>
        favourites.some((fp: FavouritePandal) => fp.name === p.name),
      );
    if (favouriteFilter === 'non-favourited')
      return pandalsWithDistance.filter(
        ({ pandal: p }) => !favourites.some((fp: FavouritePandal) => fp.name === p.name),
      );
    return pandalsWithDistance;
  }, [favouriteFilter, pandalsWithDistance, favourites]);

    const toggleFavourite = useCallback((pandal: IGanpatiPandal) => {
    if (favourites.some((fp: FavouritePandal) => fp.name === pandal.name)) {
      dispatch(removeFavourite(pandal.name));
    } else {
      dispatch(addFavourite({ name: pandal.name, lat: Number(pandal.latitude), lng: Number(pandal.longitude) }));
    }
  }, [favourites, dispatch]);

  const rowRenderer = useCallback(
    ({ index, key, style }: { index: number; key: string; style: React.CSSProperties }) => {
      const { pandal, distance } = filteredPandals[index];
      const isSelected = selectedIndex === index;
      return (
        <div key={key} style={style} className="p-1">
          <SingleVerticalPandalCard
            pandal={pandal}
            search={search}
            isSelected={isSelected}
            favourites={favourites}
            highlightMatch={highlightMatch}
            distance={distance}
            onSelect={() => { setSelectedIndex(index); onSelectPandal?.(pandal); }}
            onToggleFavourite={() => toggleFavourite(pandal)}
          />
        </div>
      );
    },
    [filteredPandals, selectedIndex, search, favourites, toggleFavourite, onSelectPandal],
  );

  return (
    <div className="flex flex-col list-panel-height mx-2 md:mx-0 my-2 md:my-0">
      <PandalListFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setSelectedIndex(null); }}
        activeFilter={favouriteFilter}
        onFilterChange={(f) => { setFavouriteFilter(f); setSelectedIndex(null); }}
      />
      <div className="flex-1">
        {userLocation && <NearbyBanner />}
        {filteredPandals.length === 0 ? (
          <div className="flex-center h-full text-text-secondary text-base">
            No pandals found{search.length > 0 ? ` for "${search}"` : ''}
          </div>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                rowCount={filteredPandals.length}
                rowHeight={cache.rowHeight}
                deferredMeasurementCache={cache}
                rowRenderer={({ index, key, style, parent }) => (
                  <CellMeasurer
                    key={key}
                    cache={cache}
                    columnIndex={0}
                    rowIndex={index}
                    parent={parent}
                  >
                    {rowRenderer({ index, key, style })}
                  </CellMeasurer>
                )}
                overscanRowCount={5}
              />
            )}
          </AutoSizer>
        )}
      </div>
    </div>
  );
};

export default PandalsVirutalList;
