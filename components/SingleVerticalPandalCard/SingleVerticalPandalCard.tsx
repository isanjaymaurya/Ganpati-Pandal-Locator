import React from 'react';
import { Heart, MapPin, TrainFront } from 'lucide-react';

import { FALLBACK_PANDAL_IMAGE } from '@/constants/map';
import type { FavouritePandal } from '@/types/global';
import type { GanpatiPandal } from '@/types/global';
import { isFamous } from '@/utils/pandal';
import { highlightMatch } from '@/utils/highlight';
import CrownIcon from '@/components/icons/CrownIcon';

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
      className={`border border-border px-3 py-2 flex gap-2 items-center bg-surface rounded-xl ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <button
        className="flex gap-2 items-center flex-1 min-w-0 text-left cursor-pointer"
        onClick={onSelect}
        aria-label={`View ${pandal.name} on map`}
      >
        <div className="relative shrink-0">
          {famous && (
            <CrownIcon className="absolute -top-2.5 left-1/2 -translate-x-1/2 drop-shadow-sm" size={11} />
          )}
          <img
            src={pandal.image_url || FALLBACK_PANDAL_IMAGE}
            alt={pandal.name}
            className={`w-12 h-12 rounded-lg object-cover object-top border shadow-sm ${
              famous ? 'border-2 border-accent-gold' : 'border-border'
            }`}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_PANDAL_IMAGE;
              e.currentTarget.onerror = null;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-xs mb-0.5 text-text-primary uppercase line-clamp-1">
            {highlightMatch(pandal.name, search)}
          </p>
          <p className="text-[10px] text-text-secondary mb-0.5 flex items-center gap-1 line-clamp-1 capitalize">
            {highlightMatch(pandal.location, search)}
            {distance && (
              <span className="text-primary font-semibold whitespace-nowrap">· {distance}</span>
            )}
          </p>
          {pandal.nearby_station && (
            <p className="text-[10px] text-text-secondary flex items-center gap-1">
              <TrainFront size={9} className="shrink-0" />
              <span className="line-clamp-1">{pandal.nearby_station}</span>
            </p>
          )}
        </div>
      </button>
            <div className="flex items-center justify-end shrink-0">
        <span
          className={`px-2 ${isSelected ? 'text-primary' : 'text-text-secondary'}`}
          aria-hidden="true"
        >
          <MapPin size={20} />
        </span>
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
