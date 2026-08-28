import React, { useMemo } from 'react';
import L from 'leaflet';
import { Marker, Popup, useMap } from 'react-leaflet';

import { BASE } from '@/constants/env';
import { MAX_ZOOM, MOBILE_BREAKPOINT, MOBILE_MAP_OFFSET_FRACTION } from '@/constants/map';
import type { GanpatiPandal } from '@/types/global';
import PandalPopupContent from './PandalPopupContent';

interface Props {
  pandal: GanpatiPandal;
  markerKey: string | number;
  markerRef?: (el: L.Marker | null) => void;
  userLocation?: [number, number] | null;
}

// Build a DivIcon that stacks the marker image + name label in one element.
// Because it's part of the icon, it never intercepts clicks on the marker.
function buildIcon(name: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `
      <div class="flex flex-col items-center">
        <img src="${BASE}/pandal-marker.png" class="w-14 h-14 object-contain" />
        <div class="flex flex-col items-center mt-1">
          <div class="marker-triangle"></div>
          <div class="bg-orange-100 text-center text-[8px] text-black uppercase rounded-xl border-2 border-accent-gold w-22 shadow px-2 py-1.5 pointer-events-none">
            ${name}
          </div>
        </div>
      </div>
    `,
    iconSize: [50, 72],
    iconAnchor: [25, 50],
    popupAnchor: [0, -52],
  });
}

const PandalMarker: React.FC<Props> = ({ pandal, markerKey, markerRef, userLocation }) => {
  // Parse once, memoised with the pandal reference
  const { lat, lng } = useMemo(() => ({
    lat: parseFloat(pandal.latitude),
    lng: parseFloat(pandal.longitude),
  }), [pandal.latitude, pandal.longitude]);

  const icon = useMemo(() => buildIcon(pandal.name), [pandal.name]);
  const map = useMap();

  const handleClick = () => {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    if (isMobile) {
      const mapSize = map.getSize();
      const targetPoint = map.project([lat, lng], MAX_ZOOM);
      const adjustedPoint = targetPoint.subtract([0, mapSize.y * MOBILE_MAP_OFFSET_FRACTION]);
      map.flyTo(map.unproject(adjustedPoint, MAX_ZOOM), MAX_ZOOM, { animate: true, duration: 0.8 });
    } else {
      map.flyTo([lat, lng], MAX_ZOOM, { animate: true, duration: 0.8 });
    }
  };

  return (
    <Marker
      key={markerKey}
      position={[lat, lng]}
      icon={icon}
      ref={markerRef}
      eventHandlers={{ click: handleClick }}
    >
      <Popup>
        <PandalPopupContent pandal={pandal} userLocation={userLocation} />
      </Popup>
    </Marker>
  );
};

export default PandalMarker;
