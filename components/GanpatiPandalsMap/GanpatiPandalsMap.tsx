import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';

import type { IGanpatiPandal } from '@/types/global';
import { isValidCoord, MOBILE_BREAKPOINT, MOBILE_MAP_OFFSET_FRACTION } from '@/utils/geo';
import LocateControl from './LocateControl';
import UserLocationMarker from './UserLocationMarker';
import PandalClusterLayer from './PandalClusterLayer';

const DEFAULT_CENTER: [number, number] = [18.9582, 72.8321];

type Props = {
  ganpatiPandals: IGanpatiPandal[];
  selectedPandal?: IGanpatiPandal | null;
  onLocate?: (coords: [number, number]) => void;
};

export default function GanpatiPandalsMap({ ganpatiPandals, selectedPandal, onLocate }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const [popupIdx, setPopupIdx] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleLocate = (coords: [number, number]) => {
    setUserLocation(coords);
    onLocate?.(coords);
  };

    // Fly to selected pandal whenever it changes
  useEffect(() => {
    if (selectedPandal && mapRef.current) {
      const lat = parseFloat(selectedPandal.latitude);
      const lng = parseFloat(selectedPandal.longitude);
      if (!isValidCoord(lat, lng)) return;

            const map = mapRef.current;
      const targetZoom = 18;
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

      if (isMobile) {
        const mapSize = map.getSize();
        const targetPoint = map.project([lat, lng], targetZoom);
        const adjustedPoint = targetPoint.subtract([0, mapSize.y * MOBILE_MAP_OFFSET_FRACTION]);
        map.flyTo(map.unproject(adjustedPoint, targetZoom), targetZoom, { animate: true, duration: 0.8 });
      } else {
        map.flyTo([lat, lng], targetZoom, { animate: true, duration: 0.8 });
      }

      const idx = ganpatiPandals.findIndex(
        (p) => p.name === selectedPandal.name && p.location === selectedPandal.location,
      );
      setPopupIdx(idx !== -1 ? idx : null);
    } else {
      setPopupIdx(null);
    }
  }, [selectedPandal, ganpatiPandals]);

  return (
    <div className="relative">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={12}
        className="map-panel-height w-full"
        ref={mapRef}
        zoomControl={false}
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
