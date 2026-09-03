import React, { useEffect, useRef } from 'react';
import { Heart, HeartOff, List, Search, X } from 'lucide-react';

const FAVOURITE_FILTERS = ['all', 'favourited', 'non-favourited'] as const;
export type FavouriteFilterType = typeof FAVOURITE_FILTERS[number];

const FILTER_LABELS: Record<FavouriteFilterType, string> = {
  all: 'All',
  favourited: 'Favourited',
  'non-favourited': 'Others',
};

const FILTER_ICONS: Record<FavouriteFilterType, React.ReactNode> = {
  all: <List size={11} />,
  favourited: <Heart size={11} />,
  'non-favourited': <HeartOff size={11} />,
};

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
  const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const tag = (active as HTMLElement)?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && active === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

    return (
    <>
      <div className="relative mb-2">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by name or location…"
          aria-label="Search pandals by name or location"
          inputMode="search"
          className="w-full pl-8 pr-8 py-2 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-surface text-text-primary placeholder:text-text-secondary"
          name="search"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {resultCount} pandal{resultCount !== 1 ? 's' : ''} found
      </div>
      <div className="flex items-center mb-2 mt-1">
        <span className="text-[11px] text-text-secondary mr-auto">
          {resultCount === total ? `${total} pandals` : `${resultCount} of ${total}`}
        </span>
        <div className="flex gap-1.5">
          {FAVOURITE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              aria-pressed={activeFilter === f}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs border border-primary transition-colors duration-150 ${
                activeFilter === f
                  ? 'bg-primary text-text-on-primary font-bold shadow'
                  : 'bg-surface text-primary'
              }`}
            >
              {FILTER_ICONS[f]}
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export { FAVOURITE_FILTERS };
export default PandalListFilters;
