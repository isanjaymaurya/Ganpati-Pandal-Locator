import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import type { FavouritePandal } from '../../store/appSlice';
import { addFavourite, removeFavourite } from '../../store/appSlice';
import type { IGanpatiPandal } from '../../types/global';
import { MapPinCheckInside, MapPinPlusInside } from 'lucide-react';

interface Props {
  pandal: IGanpatiPandal;
}

const SinglePandalCard: React.FC<Props> = ({ pandal }) => {
  const favourites = useAppSelector(state => state.favourites.favourites);
  const dispatch = useAppDispatch();
  const isFavourite = favourites.some((fp: FavouritePandal) => fp.name === pandal.name);
  return (
    <div className="bg-surface border border-border px-4 py-4 rounded-lg shadow cursor-pointer transition-colors w-full">
      <h1 className="font-semibold text-base text-center text-text-primary capitalize">{pandal.name}</h1>
      <p className="text-xs text-text-secondary text-center">{pandal.location}</p>
      <hr className='my-2'/>
      <button
        className={`flex text-sm justify-center p-2 rounded-xl border text-center w-full text-text-on-primary transition-colors outline-none ${isFavourite ? 'bg-success hover:opacity-90' : 'bg-primary-light hover:bg-primary'}`}
        aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        onClick={() => {
          if (isFavourite) {
            dispatch(removeFavourite(pandal.name));
          } else {
            dispatch(addFavourite({ name: pandal.name, lat: Number(pandal.latitude), lng: Number(pandal.longitude) }));
          }
        }}
      >
        {isFavourite ? (
          <MapPinCheckInside size={20} className='mr-2' />
        ) : (
          <MapPinPlusInside size={20} className='mr-2' />
        )}
        {isFavourite ? 'FAVOURITED' : 'ADD FAVOURITE'}
      </button>
    </div>
  );
};

export default SinglePandalCard;
