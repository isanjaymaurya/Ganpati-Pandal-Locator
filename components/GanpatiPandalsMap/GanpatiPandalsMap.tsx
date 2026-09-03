import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'react-leaflet-markercluster/styles';

import {
  DEFAULT_CENTER,
  MAX_ZOOM,
  MOBILE_BREAKPOINT,
  MOBILE_MAP_OFFSET_FRACTION,
} from '@/constants/map';
import type { GanpatiPandal } from '@/types/global';
import { isValidCoord } from '@/utils/geo';

import LocateControl from './LocateControl';
import PandalClusterLayer from './PandalClusterLayer';
import UserLocationMarker from './UserLocationMarker';

type Props = {
  ganpatiPandals: GanpatiPandal[];
  selectedPandal?: GanpatiPandal | null;
  onLocate?: (coords: [number, number]) => void;
  /** Ref set to true when the page was opened via a shared URL (has lat/lng params). */
  isSharedUrl?: RefObject<boolean>;
};

export default function GanpatiPandalsMap({
  ganpatiPandals,
  selectedPandal,
  onLocate,
  isSharedUrl,
}: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const [popupIdx, setPopupIdx] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [tilesLoaded, setTilesLoaded] = useState(false);

  // Derive initial center/zoom from selectedPandal when opening via a shared URL.
  // MapContainer only reads `center` and `zoom` once on mount, so we compute
  // them before the first render to avoid any flash of the default Mumbai view.
  const sharedLat = selectedPandal ? parseFloat(selectedPandal.latitude) : NaN;
  const sharedLng = selectedPandal ? parseFloat(selectedPandal.longitude) : NaN;
  const hasSharedCoords = isSharedUrl?.current && isValidCoord(sharedLat, sharedLng);
  const initialCenter: [number, number] = hasSharedCoords ? [sharedLat, sharedLng] : DEFAULT_CENTER;
  const initialZoom = hasSharedCoords ? MAX_ZOOM : 12;

  const handleLocate = useCallback(
    (coords: [number, number]) => {
      setUserLocation(coords);
      onLocate?.(coords);
    },
    [onLocate],
  );

  // Fly to the selected pandal whenever it changes.
  useEffect(() => {
    if (selectedPandal && mapRef.current) {
      const lat = parseFloat(selectedPandal.latitude);
      const lng = parseFloat(selectedPandal.longitude);
      if (!isValidCoord(lat, lng)) return;

      // Shared URL: map already opened at the correct location — just open the
      // popup without flying (set view instantly instead of animating).
      if (isSharedUrl?.current) {
        mapRef.current.setView([lat, lng], MAX_ZOOM, { animate: false });
      } else {
        const map = mapRef.current;
        const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

        if (isMobile) {
          const mapSize = map.getSize();
          const targetPoint = map.project([lat, lng], MAX_ZOOM);
          const adjustedPoint = targetPoint.subtract([0, mapSize.y * MOBILE_MAP_OFFSET_FRACTION]);
          map.flyTo(map.unproject(adjustedPoint, MAX_ZOOM), MAX_ZOOM, { animate: true, duration: 0.8 });
        } else {
          map.flyTo([lat, lng], MAX_ZOOM, { animate: true, duration: 0.8 });
        }
      }

      const idx = ganpatiPandals.findIndex(
        (p) => p.name === selectedPandal.name && p.location === selectedPandal.location,
      );
      setPopupIdx(idx !== -1 ? idx : null);
    } else {
      setPopupIdx(null);
    }
    // isSharedUrl is a stable ref — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPandal, ganpatiPandals]);

  return (
    <div className="relative">
      {!tilesLoaded && (
        <div className="absolute inset-0 z-[400] bg-background flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-2 text-text-secondary">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading map…</span>
          </div>
        </div>
      )}
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        className="map-panel-height w-full"
        ref={mapRef}
        zoomControl={false}
        aria-label="Ganpati pandal map of Mumbai"
        whenReady={() => setTilesLoaded(true)}
      >
        <ZoomControl position="bottomright" />
        <LocateControl userLocation={userLocation} onLocate={handleLocate} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          subdomains={['a', 'b', 'c']}
          maxZoom={19}
        />
        {userLocation && <UserLocationMarker position={userLocation} />}
        <PandalClusterLayer
          pandals={ganpatiPandals}
          selectedPandal={selectedPandal}
          popupIdx={popupIdx}
          userLocation={userLocation}
        />
      </MapContainer>
    </div>
  );
}
