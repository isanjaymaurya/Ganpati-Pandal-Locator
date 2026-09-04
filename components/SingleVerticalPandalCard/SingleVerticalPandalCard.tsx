import React from 'react';
import { Heart, MapPin } from 'lucide-react';

import type { FavouritePandal } from '@/types/global';
import type { GanpatiPandal } from '@/types/global';
import { isFamous } from '@/utils/pandal';
import PandalCardImage from './PandalCardImage';
import PandalCardInfo from './PandalCardInfo';

interface Props {
  pandal: GanpatiPandal;
  search: string;
  isSelected?: boolean;
  favourites: FavouritePandal[];
  distance?: string | null;
  onSelect?: () => void;
  onToggleFavourite: () => void;
}

const SingleVerticalPandalCard: React.FC<Props> = ({
  pandal,
  search,
  isSelected,
  favourites,
  distance,
  onSelect,
  onToggleFavourite,
}) => {
  const isFavourite = favourites.some((fp: FavouritePandal) => fp.name === pandal.name);
  const famous = isFamous(pandal);
  const favouriteTooltipId = `fav-tip-${pandal.name.replace(/\s+/g, '-')}`;

  return (
    <div
      className={`border border-border px-3 py-2 flex gap-2 items-center bg-surface rounded-xl transition-all duration-200 hover:border-primary hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <button
        className="flex gap-2 items-center flex-1 min-w-0 text-left cursor-pointer"
        onClick={onSelect}
        aria-label={`View ${pandal.name}${famous ? ' (Famous)' : ''} on map`}
      >
        <PandalCardImage
          name={pandal.name}
          imageUrl={pandal.image_url}
          famous={famous}
        />
        <PandalCardInfo
          name={pandal.name}
          location={pandal.location}
          nearbyStation={pandal.nearby_station}
          distance={distance}
          search={search}
        />
      </button>
      <div className="flex items-center justify-end shrink-0">
        <button
          className={`px-2 ${isSelected ? 'text-primary' : 'text-text-secondary'}`}
          onClick={onSelect}
          aria-label={`View ${pandal.name} on map`}
        >
          <MapPin size={20} />
        </button>
        <button
          className={`px-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded ${
            isFavourite ? 'text-red-500' : 'text-text-secondary'
          } hover:text-red-500`}
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          aria-describedby={favouriteTooltipId}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite();
          }}
        >
          <span id={favouriteTooltipId} className="sr-only">
            {isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          </span>
          <Heart
            size={20}
            className="transition-colors duration-150"
            fill={isFavourite ? 'currentColor' : 'none'}
          />
        </button>
      </div>
    </div>
  );
};

export default SingleVerticalPandalCard;
