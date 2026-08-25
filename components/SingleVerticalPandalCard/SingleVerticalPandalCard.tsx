import React from 'react';
import type { IGanpatiPandal } from '../../types/global';
import type { FavouritePandal } from '../../store/appSlice';
import { Heart, MapPin } from 'lucide-react';
import HeartIcon from '../icons/HeartIcon';
import CrownIcon from '../icons/CrownIcon';
import { isFamous } from '@/utils/pandal';

interface Props {
  pandal: IGanpatiPandal;
  search: string;
  isSelected?: boolean;
  favourites: FavouritePandal[];
  highlightMatch: (text: string, filter: string) => React.ReactNode;
  distance?: string | null;
  onSelect?: () => void;
  onToggleFavourite: () => void;
}

const SingleVerticalPandalCard: React.FC<Props> = ({
  pandal,
  search,
  isSelected,
  favourites,
  highlightMatch,
  distance,
  onSelect,
  onToggleFavourite
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
          src={pandal.image_url || 'https://images.prismic.io/mumbai-pandals/aKdKSKTt2nPbalaC_ganpatibappa.jpg?auto=format,compress'}
          alt={pandal.name}
          className={`w-12 h-12 rounded-lg object-cover object-top border shadow-sm ${isFamous(pandal) ? 'border-2 border-accent-gold' : 'border-border'}`}
        />
      </div>
      <div>
        <p className="font-semibold text-xs mb-0.5 text-text-primary uppercase">{highlightMatch(pandal.name, search)}</p>
          <p className="text-[9px] text-text-secondary mb-0.5 flex items-center gap-1 flex-wrap">
          <span className="capitalize">{highlightMatch(pandal.location, search)}</span>
          {pandal.station_name && pandal.station_name.toLowerCase() !== pandal.location?.toLowerCase() && (
            <span className="capitalize">· {highlightMatch(pandal.station_name, search)}</span>
          )}
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
