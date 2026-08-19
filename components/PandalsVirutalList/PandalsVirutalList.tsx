import React, { useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import type { FavouritePandal } from '../../store/appSlice';
import { addFavourite, removeFavourite } from '../../store/appSlice';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import type { IGanpatiPandal } from '../../types/global';
import SingleVerticalPandalCard from '../SingleVerticalPandalCard/SingleVerticalPandalCard';

interface Props {
  ganpatiPandals: IGanpatiPandal[];
  onSelectPandal?: (pandal: IGanpatiPandal) => void;
}

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 80,
});

const FAVOURITE_FILTERS = ['all', 'favourited', 'non-favourited'] as const;
type FavouriteFilterType = typeof FAVOURITE_FILTERS[number];

const PandalsVirutalList: React.FC<Props> = ({ ganpatiPandals, onSelectPandal }) => {
  const favourites = useAppSelector(state => state.favourites.favourites);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [favouriteFilter, setFavouriteFilter] = useState<FavouriteFilterType>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Filter by search
  const searchedPandals = useMemo(() => {
    return ganpatiPandals.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase())
    );
  }, [ganpatiPandals, search]);

    // Filter by favourite
  const filteredPandals = useMemo(() => {
    if (favouriteFilter === 'all') return searchedPandals;
    if (favouriteFilter === 'favourited') return searchedPandals.filter(p => favourites.some((fp: FavouritePandal) => fp.name === p.name));
    if (favouriteFilter === 'non-favourited') return searchedPandals.filter(p => !favourites.some((fp: FavouritePandal) => fp.name === p.name));
    return searchedPandals;
  }, [favouriteFilter, searchedPandals, favourites]);

  // Helper to highlight matched text
  const highlightMatch = (text: string, filter: string) => {
    if (!filter) return text;
    const regex = new RegExp(`(${filter})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-gold-light text-text-primary">{part}</span>
      ) : (
        part
      )
    );
  };

  const rowRenderer = ({ index, key, style }: { index: number; key: string; style: React.CSSProperties }) => {
    const pandal = filteredPandals[index];
    const isSelected = selectedIndex === index;
    return (
      <div key={key} style={style} className='p-1'>
        <SingleVerticalPandalCard
          pandal={pandal}
          search={search}
          isSelected={isSelected}
          favourites={favourites}
          highlightMatch={highlightMatch}
          onSelect={() => {
            setSelectedIndex(index);
            if (onSelectPandal) onSelectPandal(pandal);
          }}
                    onToggleFavourite={() => {
            if (favourites.some((fp: FavouritePandal) => fp.name === pandal.name)) {
              dispatch(removeFavourite(pandal.name));
            } else {
              dispatch(addFavourite({ name: pandal.name, lat: Number(pandal.latitude), lng: Number(pandal.longitude) }));
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[500px]">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or address..."
        className="mb-2 px-3 py-2 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-surface text-text-primary placeholder:text-text-secondary"
      />
      {/* Favourite Filter Buttons */}
      <div className="flex gap-2 mb-2 mt-1 justify-end">
        {FAVOURITE_FILTERS.map(f => (
          <button
            key={f}
            className={`px-2 py-1 rounded text-xs border transition-colors duration-150 ${favouriteFilter === f ? 'bg-primary text-text-on-primary font-bold shadow' : 'bg-surface text-primary'} border-primary`}
            onClick={() => { setFavouriteFilter(f); setSelectedIndex(null); }}
          >
            {f === 'all' ? 'All' : f === 'favourited' ? 'Favourited' : 'Not Favourited'}
          </button>
        ))}
      </div>
      <div className="flex-1">
        {filteredPandals.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary text-base">
            No pandals found {search.length > 0 ? `for "${search}"` : ''}
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
