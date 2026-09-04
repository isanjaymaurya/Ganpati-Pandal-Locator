import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import { ArrowUp } from 'lucide-react';

import { addFavourite, removeFavourite } from '@/store/appSlice';
import type { FavouritePandal } from '@/types/global';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { GanpatiPandal } from '@/types/global';
import { usePandalList } from '@/hooks/usePandalList';
import SingleVerticalPandalCard from '@/components/SingleVerticalPandalCard/SingleVerticalPandalCard';
import NearbyBanner from './NearbyBanner';
import PandalEmptyState from './PandalEmptyState';
import PandalListFilters, { type FavouriteFilterType } from './PandalListFilters';

interface Props {
  ganpatiPandals: GanpatiPandal[];
  onSelectPandal?: (pandal: GanpatiPandal) => void;
  userLocation?: [number, number] | null;
  total: number;
}

const PandalsVirtualList: React.FC<Props> = ({ ganpatiPandals, onSelectPandal, userLocation, total }) => {
  const favourites = useAppSelector((state) => state.favourites.favourites);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [favouriteFilter, setFavouriteFilter] = useState<FavouriteFilterType>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const listRef = useRef<import('react-virtualized').List | null>(null);

  // filters/search change, preventing stale row heights after re-filtering.
  const cache = useRef(new CellMeasurerCache({ fixedWidth: true, defaultHeight: 80 }));

  // Clear the CellMeasurer cache whenever the list contents change so
  // react-virtualized re-measures all rows from scratch.
  useEffect(() => {
    cache.current.clearAll();
    listRef.current?.recomputeRowHeights();
  }, [search, favouriteFilter, ganpatiPandals]);

  // re-sorts by distance so the old index points to the wrong pandal.
  useEffect(() => {
    setSelectedIndex(null);
  }, [userLocation]);

  const filteredPandals = usePandalList({
    pandals: ganpatiPandals,
    search,
    favouriteFilter,
    favourites,
    userLocation,
  });

  const toggleFavourite = useCallback((pandal: GanpatiPandal) => {
    if (favourites.some((fp: FavouritePandal) => fp.name === pandal.name)) {
      dispatch(removeFavourite(pandal.name));
    } else {
      dispatch(addFavourite({ name: pandal.name, lat: Number(pandal.latitude), lng: Number(pandal.longitude) }));
    }
  }, [favourites, dispatch]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleRowSelect = useCallback((pandal: GanpatiPandal, index: number) => {
    setSelectedIndex(index);
    onSelectPandal?.(pandal);
  }, [onSelectPandal]);

  const rowRenderer = useCallback(
    ({ index, key, style }: { index: number; key: string; style: React.CSSProperties }) => {
      const { pandal, distance } = filteredPandals[index];
      const isSelected = selectedIndex === index;
      return (
        <div
          key={key}
          style={style}
          className="p-1"
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              const next = Math.min(index + 1, filteredPandals.length - 1);
              setSelectedIndex(next);
              listRef.current?.scrollToRow(next);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              const prev = Math.max(index - 1, 0);
              setSelectedIndex(prev);
              listRef.current?.scrollToRow(prev);
            } else if (e.key === 'Enter') {
              handleRowSelect(pandal, index);
            }
          }}
        >
          <SingleVerticalPandalCard
            pandal={pandal}
            search={search}
            isSelected={isSelected}
            favourites={favourites}
            distance={distance}
            onSelect={() => handleRowSelect(pandal, index)}
            onToggleFavourite={() => toggleFavourite(pandal)}
          />
        </div>
      );
    },
    [filteredPandals, selectedIndex, search, favourites, toggleFavourite, handleRowSelect],
  );

  return (
    <div className="flex flex-col list-panel-height mx-2 md:mx-0 my-2 md:my-0">
      <PandalListFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setSelectedIndex(null); }}
        activeFilter={favouriteFilter}
        onFilterChange={(f) => { setFavouriteFilter(f); setSelectedIndex(null); }}
        resultCount={filteredPandals.length}
        total={total}
      />
      <div className="relative flex-1">
        {userLocation && filteredPandals.length > 0 && <NearbyBanner />}
        {filteredPandals.length === 0 ? (
          <PandalEmptyState search={search} favouriteFilter={favouriteFilter} />
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={listRef}
                width={width}
                height={height}
                rowCount={filteredPandals.length}
                rowHeight={cache.current.rowHeight}
                deferredMeasurementCache={cache.current}
                onScroll={({ scrollTop }) => setShowScrollTop(scrollTop > 300)}
                rowRenderer={({ index, key, style, parent }) => (
                  <CellMeasurer
                    key={key}
                    cache={cache.current}
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
        {showScrollTop && (
          <button
            onClick={() => listRef.current?.scrollToRow(0)}
            aria-label="Scroll to top"
            className="absolute bottom-4 right-3 z-10 flex-center w-8 h-8 rounded-full bg-primary text-text-on-primary shadow-md hover:opacity-90 transition-opacity"
          >
            <ArrowUp size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PandalsVirtualList;
