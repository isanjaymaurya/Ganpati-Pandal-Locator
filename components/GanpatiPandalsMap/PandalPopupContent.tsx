import React from 'react';
import { MapPin, MapPinHouse, Navigation } from 'lucide-react';
import type { IGanpatiPandal } from '../../types/global';
import { getDistanceKm, formatDistance, isValidCoord } from '@/utils/geo';

interface Props {
  pandal: IGanpatiPandal;
  userLocation?: [number, number] | null;
}

const PandalPopupContent: React.FC<Props> = ({ pandal, userLocation }) => {
  const distance = (() => {
    if (!userLocation) return null;
    const lat = parseFloat(pandal.latitude);
    const lng = parseFloat(pandal.longitude);
    if (!isValidCoord(lat, lng)) return null;
    return formatDistance(getDistanceKm(userLocation[0], userLocation[1], lat, lng));
  })();

  return (
  <>
    <div className="flex items-start gap-2">
      <img
        src={pandal.image_url || 'https://images.prismic.io/mumbai-pandals/aKdKSKTt2nPbalaC_ganpatibappa.jpg?auto=format,compress'}
        alt={pandal.name}
        className="h-12 w-12 object-cover object-top rounded shrink-0"
        onError={(e) => {
          e.currentTarget.src = 'https://images.prismic.io/mumbai-pandals/aKdKSKTt2nPbalaC_ganpatibappa.jpg?auto=format,compress';
          e.currentTarget.onerror = null;
        }}
      />
      <div>
        <h1 className="text-[10px] font-bold mb-1 text-primary uppercase">{pandal.name}</h1>
        <p className="text-[9px] capitalize flex gap-0.5">
          <MapPinHouse size={10} className="shrink-0" /> {pandal.location.toLowerCase()}
        </p>
        {distance && (
          <p className="text-[9px] font-semibold text-primary flex items-center gap-0.5">
            <Navigation size={10} className="shrink-0" />
            {distance} away
          </p>
        )}
      </div>
    </div>
    <hr className="my-2" />
    <div className="flex items-center justify-between gap-2">
      <a href={pandal.gmap_link} target="_blank" rel="noopener noreferrer" className={distance ? '' : 'w-full'}>
        <button className={`text-primary border border-primary text-[9px] font-bold py-1.5 px-3 rounded hover:opacity-90 transition-opacity shadow-sm ${distance ? '' : 'w-full'}`}>
          Google Map
        </button>
      </a>
    </div>
  </>
  );
};

export default PandalPopupContent;
