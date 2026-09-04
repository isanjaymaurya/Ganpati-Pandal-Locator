import React from 'react';
import { Heart, HeartOff, List } from 'lucide-react';

import { FAVOURITE_FILTERS, type FavouriteFilterType } from './PandalListFilters';

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
  activeFilter: FavouriteFilterType;
  onFilterChange: (filter: FavouriteFilterType) => void;
  resultCount: number;
  total: number;
}

const PandalFilterPills: React.FC<Props> = ({
  activeFilter,
  onFilterChange,
  resultCount,
  total,
}) => (
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
);

export default PandalFilterPills;
