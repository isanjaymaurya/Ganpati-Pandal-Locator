import React from 'react';

const FAVOURITE_FILTERS = ['all', 'favourited', 'non-favourited'] as const;
export type FavouriteFilterType = typeof FAVOURITE_FILTERS[number];

const FILTER_LABELS: Record<FavouriteFilterType, string> = {
  all: 'All',
  favourited: 'Favourited',
  'non-favourited': 'Not Favourited',
};

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: FavouriteFilterType;
  onFilterChange: (filter: FavouriteFilterType) => void;
}

const PandalListFilters: React.FC<Props> = ({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
}) => (
  <>
    <input
      type="text"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search by name or location..."
      className="mb-2 px-3 py-2 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-surface text-text-primary placeholder:text-text-secondary"
    />
    <div className="flex gap-2 mb-2 mt-1 justify-end">
      {FAVOURITE_FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`px-2 py-1 rounded text-xs border border-primary transition-colors duration-150 ${
            activeFilter === f
              ? 'bg-primary text-text-on-primary font-bold shadow'
              : 'bg-surface text-primary'
          }`}
        >
          {FILTER_LABELS[f]}
        </button>
      ))}
    </div>
  </>
);

export { FAVOURITE_FILTERS };
export default PandalListFilters;
