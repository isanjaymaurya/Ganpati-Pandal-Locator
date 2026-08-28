import React from 'react';

import { Heart, MapPin } from 'lucide-react';

import { FALLBACK_PANDAL_IMAGE } from '@/constants/map';
import type { FavouritePandal } from '@/store/appSlice';
import type { GanpatiPandal } from '@/types/global';
import { isFamous } from '@/utils/pandal';
import { highlightMatch } from '@/utils/highlight';

import CrownIcon from '@/components/icons/CrownIcon';
import HeartIcon from '@/components/icons/HeartIcon';

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
  return (
    <div
      className={`border border-border px-3 py-2 flex gap-2 items-center bg-surface rounded-xl cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
    >
      <div className="relative shrink-0">
        {isFamous(pandal) && (
          <CrownIcon className="absolute -top-2.5 left-1/2 -translate-x-1/2 drop-shadow-sm" size={11} />
        )}
                <img
          src={pandal.image_url || FALLBACK_PANDAL_IMAGE}
          alt={pandal.name}
          className={`w-12 h-12 rounded-lg object-cover object-top border shadow-sm ${isFamous(pandal) ? 'border-2 border-accent-gold' : 'border-border'}`}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_PANDAL_IMAGE;
            e.currentTarget.onerror = null;
          }}
        />
      </div>
      <div>
        <p className="font-semibold text-xs mb-0.5 text-text-primary uppercase flex-wrap line-clamp-1">{highlightMatch(pandal.name, search)}</p>
        <p className="text-[10px] text-text-secondary mb-0.5 flex items-center gap-1 flex-wrap line-clamp-2 capitalize">
          <span title={pandal.location}>{highlightMatch(pandal.location, search)}</span>
          {distance && (
            <span className="text-primary font-semibold whitespace-nowrap">
              · {distance}
            </span>
          )}
        </p>
      </div>
      <div className='flex items-center justify-end flex-1'>
        <button
          className={`px-2 transition-colors outline-none ${isSelected ? 'text-primary' : 'text-text-secondary'} hover:text-primary-light`}
          tabIndex={0}
          aria-label="Show on map"
          title='Show on map'
        >
          <MapPin size={20} className='mx-auto' />
        </button>
        <button
          className={`px-2 transition-colors outline-none ${isFavourite ? 'text-accent-gold' : 'text-text-secondary'} hover:text-accent-gold`}
          tabIndex={0}
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          onClick={e => {
            e.stopPropagation();
            onToggleFavourite();
          }}
        > 
        {isFavourite ? (
          <HeartIcon size={20} className="text-red-500 transition-colors duration-150" />
        ) : (
          <Heart size={20} />
        )}
        </button>
      </div>
    </div>
  );
};

export default SingleVerticalPandalCard;
