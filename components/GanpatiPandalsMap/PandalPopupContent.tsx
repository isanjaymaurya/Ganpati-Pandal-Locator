import React, { useCallback } from 'react';
import { MapPinHouse, Navigation, Share2 } from 'lucide-react';
import type { IGanpatiPandal } from '../../types/global';
import { getDistanceKm, formatDistance, isValidCoord } from '@/utils/geo';

const FALLBACK_IMG = 'https://images.prismic.io/mumbai-pandals/aKdKSKTt2nPbalaC_ganpatibappa.jpg?auto=format,compress';

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

  const handleShare = useCallback(() => {
    const params = new URLSearchParams({
      name: pandal.name,
      lat: pandal.latitude,
      lng: pandal.longitude,
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    if (navigator.share) {
      navigator.share({ title: pandal.name, text: `Check out ${pandal.name} pandal!`, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
  }, [pandal.name, pandal.latitude, pandal.longitude]);

  return (
    <>
      <div className="flex items-start gap-2">
        <img
          src={pandal.image_url || FALLBACK_IMG}
          alt={pandal.name}
          className="h-12 w-12 object-cover object-top rounded shrink-0"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
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
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleShare}
          className="flex-center gap-1 border border-primary text-primary text-[9px] font-bold py-1.5 px-2.5 rounded hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
          title="Share this pandal"
        >
          <Share2 size={9} /> Share
        </button>
        {/* Use anchor styled as button — avoids invalid a>button nesting */}
        <a
          href={pandal.gmap_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex-center gap-1 text-primary border border-primary text-[9px] font-bold py-1.5 px-3 rounded hover:opacity-90 transition-opacity shadow-sm"
        >
          <Navigation size={9} /> Google Map
        </a>
      </div>
    </>
  );
};

export default PandalPopupContent;
