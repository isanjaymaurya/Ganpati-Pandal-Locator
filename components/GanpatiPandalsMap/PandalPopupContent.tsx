import React, { useCallback, useMemo, useState } from 'react';
import { MapPinHouse, Navigation, Share2 } from 'lucide-react';

import { FALLBACK_PANDAL_IMAGE } from '@/constants/map';
import type { GanpatiPandal } from '@/types/global';
import { formatDistance, getDistanceKm, isValidCoord } from '@/utils/geo';

interface Props {
  pandal: GanpatiPandal;
  userLocation?: [number, number] | null;
}

const PandalPopupContent: React.FC<Props> = ({ pandal, userLocation }) => {
  const [copied, setCopied] = useState(false);

  const distance = useMemo(() => {
    if (!userLocation) return null;
    const lat = parseFloat(pandal.latitude);
    const lng = parseFloat(pandal.longitude);
    if (!isValidCoord(lat, lng)) return null;
    return formatDistance(getDistanceKm(userLocation[0], userLocation[1], lat, lng));
  }, [pandal.latitude, pandal.longitude, userLocation]);

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
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  }, [pandal.name, pandal.latitude, pandal.longitude]);

  return (
    <section aria-label={`${pandal.name} pandal details`}>
      <div className="flex items-start gap-2">
        <img
          src={pandal.image_url || FALLBACK_PANDAL_IMAGE}
          alt={pandal.name}
          className="h-12 w-12 object-cover object-top rounded shrink-0"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_PANDAL_IMAGE;
            e.currentTarget.onerror = null;
          }}
        />
        <div>
          <h2 className="text-xs font-bold mb-1 text-primary uppercase max-w-[180px] line-clamp-2">{pandal.name}</h2>
          <p className="text-[11px] capitalize flex gap-0.5 max-w-[180px]">
            <MapPinHouse size={11} className="shrink-0" /> {pandal.location.toLowerCase()}
          </p>
          {distance && (
            <p className="text-[11px] font-semibold text-primary flex items-center gap-0.5">
              <Navigation size={11} className="shrink-0" />
              {distance} away
            </p>
          )}
        </div>
      </div>
      <hr className="my-2" />
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleShare}
          className="tooltip flex-center gap-1 border border-primary text-primary text-[11px] font-bold py-1.5 px-2.5 rounded hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
          data-tooltip="Share this pandal"
        >
          <Share2 size={11} />
          {copied ? 'Copied!' : 'Share'}
        </button>
        {pandal.gmap_link ? (
          <a
            href={pandal.gmap_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex-center gap-1 !text-primary border border-primary text-[11px] font-bold py-1.5 px-3 rounded hover:opacity-90 transition-opacity shadow-sm"
          >
            <Navigation size={11} /> Google Map
          </a>
        ) : (
          <span className="flex-1 flex-center gap-1 text-text-secondary border border-border text-[11px] font-bold py-1.5 px-3 rounded opacity-50 cursor-not-allowed">
            <Navigation size={11} /> No Link
          </span>
        )}
      </div>
    </section>
  );
};

export default PandalPopupContent;
