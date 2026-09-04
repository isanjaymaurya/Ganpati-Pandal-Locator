import React from 'react';
import { Search } from 'lucide-react';

import type { FavouriteFilterType } from './PandalListFilters';

interface Props {
  search: string;
  favouriteFilter: FavouriteFilterType;
}

const PandalEmptyState: React.FC<Props> = ({ search, favouriteFilter }) => (
  <div className="flex-center flex-col gap-3 h-full text-text-secondary">
    <Search size={36} className="opacity-25" />
    <p className="text-sm">
      {search.length > 0
        ? `No pandals found for "${search}"`
        : favouriteFilter === 'favourited'
          ? 'No favourited pandals yet'
          : 'No pandals found'}
    </p>
  </div>
);

export default PandalEmptyState;
