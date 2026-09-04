import React, { useEffect, useRef } from 'react';

import PandalFilterPills from './PandalFilterPills';
import PandalSearchInput from './PandalSearchInput';

export const FAVOURITE_FILTERS = ['all', 'favourited', 'non-favourited'] as const;
export type FavouriteFilterType = typeof FAVOURITE_FILTERS[number];

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: FavouriteFilterType;
  onFilterChange: (filter: FavouriteFilterType) => void;
  resultCount: number;
  total: number;
}

const PandalListFilters: React.FC<Props> = ({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  resultCount,
  total,
}) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const tag = (active as HTMLElement)?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && active === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <PandalSearchInput
        value={search}
        onChange={onSearchChange}
        inputRef={searchInputRef}
      />
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {resultCount} pandal{resultCount !== 1 ? 's' : ''} found
      </div>
      <PandalFilterPills
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        resultCount={resultCount}
        total={total}
      />
    </>
  );
};

export default PandalListFilters;
