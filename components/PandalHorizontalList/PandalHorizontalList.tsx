import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import type { FavouritePandal } from '../../store/appSlice';
import { useSwipeable } from 'react-swipeable';
import type { IGanpatiPandal } from '../../types/global';
import SinglePandalCard from '../SingleHorizontalPandalCard/SingleHorizontalPandalCard';

interface Props {
  ganpatiPandals: IGanpatiPandal[];
  selectedPandal: IGanpatiPandal | null;
  onSelectPandal: (pandal: IGanpatiPandal) => void;
}

const FAVOURITE_FILTERS = ['all', 'favourited', 'non-favourited'] as const;
type FavouriteFilterType = typeof FAVOURITE_FILTERS[number];

const PandalHorizontalList: React.FC<Props> = ({ ganpatiPandals, selectedPandal, onSelectPandal }) => {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentIndex(i => Math.min(i + 1, filteredPandals.length - 1));
    },
    onSwipedRight: () => {
      setCurrentIndex(i => Math.max(i - 1, 0));
    },
    trackMouse: true,
  });
    const favourites = useAppSelector((state: RootState) => state.favourites.favourites);
  const [favouriteFilter, setFavouriteFilter] = useState<FavouriteFilterType>('all');

  // Filtered list based on filter
  const filteredPandals = useMemo(() => {
    if (favouriteFilter === 'all') return ganpatiPandals;
    if (favouriteFilter === 'favourited') return ganpatiPandals.filter(p => favourites.some((fp: FavouritePandal) => fp.name === p.name));
    if (favouriteFilter === 'non-favourited') return ganpatiPandals.filter(p => !favourites.some((fp: FavouritePandal) => fp.name === p.name));
    return ganpatiPandals;
  }, [favouriteFilter, ganpatiPandals, favourites]);

  const initialIndex = selectedPandal
    ? filteredPandals.findIndex(
        p => p.name === selectedPandal.name && p.location === selectedPandal.location
      )
    : 0;
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex >= 0 ? initialIndex : 0);

  const pandal = filteredPandals[currentIndex];

  return (
    <div className="flex flex-col h-[300px] w-full items-center" {...swipeHandlers}>
      {/* Filter Buttons */}
            <div className="w-full flex gap-2 mb-2 justify-end">
        {FAVOURITE_FILTERS.map(f => (
          <button
            key={f}
            className={`px-2 py-1 rounded text-xs border transition-colors duration-150 ${favouriteFilter === f ? 'bg-primary text-text-on-primary font-bold shadow' : 'bg-surface text-primary'} border-primary`}
            onClick={() => {
              if (favouriteFilter !== f) {
                setFavouriteFilter(f);
              }
            }}
          >
            {f === 'all' ? 'All' : f === 'favourited' ? 'Favourited' : 'Not Favourited'}
          </button>
        ))}
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        {filteredPandals.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary text-base">No pandals found</div>
        ) : (
          <>
            {pandal ? <SinglePandalCard pandal={pandal} /> : null}
            {/* Visited toggle button */}
            <div className="flex justify-between items-center w-full mt-2">
              <button
                              className="px-3 py-1 rounded bg-primary text-text-on-primary disabled:opacity-40"
                onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))}
                disabled={currentIndex === 0}
              >Prev</button>
              <span className="text-xs">{currentIndex + 1} / {filteredPandals.length}</span>
              <button
                              className="px-3 py-1 rounded bg-primary text-text-on-primary disabled:opacity-40"
                onClick={() => setCurrentIndex(i => Math.min(i + 1, filteredPandals.length - 1))}
                disabled={currentIndex === filteredPandals.length - 1}
              >Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PandalHorizontalList;
