import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';

import type { IGanpatiPandal } from '@/types/global';
import { isValidCoord } from '@/utils/geo';
import LocateControl from './LocateControl';
import UserLocationMarker from './UserLocationMarker';
import PandalClusterLayer from './PandalClusterLayer';

const DEFAULT_CENTER: [number, number] = [18.9582, 72.8321];

type Props = {
  ganpatiPandals: IGanpatiPandal[];
  selectedPandal?: IGanpatiPandal | null;
  zoomToMax?: boolean;
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
      mapRef.current.flyTo([lat, lng], 18, { animate: true, duration: 0.8 });
      const idx = ganpatiPandals.findIndex(
        (p) => p.name === selectedPandal.name && p.location === selectedPandal.location,
      );
      setPopupIdx(idx !== -1 ? idx : null);
    } else {
      setPopupIdx(null);
    }
  }, [selectedPandal, ganpatiPandals]);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={12}
      className="h-[300px] md:h-[500px] w-full"
      ref={mapRef}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <LocateControl userLocation={userLocation} onLocate={handleLocate} />

      {/* Voyager tiles — warm, colourful streets matching the festive palette */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {userLocation && <UserLocationMarker position={userLocation} />}

      <PandalClusterLayer
        pandals={ganpatiPandals}
        selectedPandal={selectedPandal}
        popupIdx={popupIdx}
      />
    </MapContainer>
  );
}
