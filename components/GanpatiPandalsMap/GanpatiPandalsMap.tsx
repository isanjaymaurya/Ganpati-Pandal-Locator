import React, { RefObject, useCallback, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'react-leaflet-markercluster/styles';

import { DEFAULT_CENTER, MAX_ZOOM } from '@/constants/map';
import type { GanpatiPandal } from '@/types/global';
import { isValidCoord } from '@/utils/geo';
import { useMapFlyTo } from '@/hooks/useMapFlyTo';

import LocateControl from './LocateControl';
import MapLoadingOverlay from './MapLoadingOverlay';
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

  useMapFlyTo({
    mapRef,
    selectedPandal,
    ganpatiPandals,
    isSharedUrl,
    onPopupIdx: setPopupIdx,
  });

  return (
    <div className="relative">
      {!tilesLoaded && <MapLoadingOverlay />}
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
