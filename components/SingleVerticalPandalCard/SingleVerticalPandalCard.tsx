import React from 'react';
import type { IGanpatiPandal } from '../../types/global';
import type { FavouritePandal } from '../../store/appSlice';
import { MapPin, MapPinCheckInside, MapPinPlusInside } from 'lucide-react';

interface Props {
  pandal: IGanpatiPandal;
  search: string;
  isSelected?: boolean;
  favourites: FavouritePandal[];
  highlightMatch: (text: string, filter: string) => React.ReactNode;
  onSelect?: () => void;
  onToggleFavourite: () => void;
}

const SingleVerticalPandalCard: React.FC<Props> = ({
  pandal,
  search,
  isSelected,
  favourites,
  highlightMatch,
  onSelect,
  onToggleFavourite
}) => {
  const isFavourite = favourites.some((fp: FavouritePandal) => fp.name === pandal.name);

  return (
    <div
      className={`border border-border px-3 py-2 flex gap-2 items-center bg-surface rounded-xl ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
    >
      <img src={pandal?.image_url || '/icon1.png'} alt={pandal.name} className='w-14 h-14 rounded-lg object-cover border shadow-sm border-gold-500' />
      <div>
                <p className="font-semibold text-sm mb-0.5 text-text-primary">{highlightMatch(pandal.name, search)}</p>
                <p className="text-xs text-text-secondary mb-0.5">{highlightMatch(pandal.address, search)}</p>
      </div>
      <div className='justify-end flex-1 flex items-center'>
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
          {isFavourite ? <MapPinCheckInside size={20} className='mx-auto' /> : <MapPinPlusInside size={20} className='mx-auto' />}
          <span className='text-[10px] whitespace-nowrap'>
            {isFavourite ? 'Favourited' : 'Favourite'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SingleVerticalPandalCard;
