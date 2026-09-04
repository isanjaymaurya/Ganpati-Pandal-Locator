import React, { useCallback, useMemo } from 'react';
import L from 'leaflet';
import { Marker, Popup, useMap } from 'react-leaflet';

import { MAX_ZOOM, MOBILE_BREAKPOINT, MOBILE_MAP_OFFSET_FRACTION } from '@/constants/map';
import type { GanpatiPandal } from '@/types/global';
import { buildPandalIcon } from '@/utils/pandalMarkerIcon';
import PandalPopupContent from './PandalPopupContent';

interface Props {
  pandal: GanpatiPandal;
  markerKey: string | number;
  markerRef?: (el: L.Marker | null) => void;
  userLocation?: [number, number] | null;
}

const PandalMarker: React.FC<Props> = ({ pandal, markerKey, markerRef, userLocation }) => {
  // Parse once, memoised with the pandal reference
  const { lat, lng } = useMemo(() => ({
    lat: parseFloat(pandal.latitude),
    lng: parseFloat(pandal.longitude),
  }), [pandal.latitude, pandal.longitude]);

  const icon = useMemo(() => buildPandalIcon(pandal.name), [pandal.name]);
  const map = useMap();

  const handleClick = useCallback(() => {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    if (isMobile) {
      const mapSize = map.getSize();
      const targetPoint = map.project([lat, lng], MAX_ZOOM);
      const adjustedPoint = targetPoint.subtract([0, mapSize.y * MOBILE_MAP_OFFSET_FRACTION]);
      map.flyTo(map.unproject(adjustedPoint, MAX_ZOOM), MAX_ZOOM, { animate: true, duration: 0.8 });
    } else {
      map.flyTo([lat, lng], MAX_ZOOM, { animate: true, duration: 0.8 });
    }
  }, [map, lat, lng]);

  return (
    <Marker
      key={markerKey}
      position={[lat, lng]}
      icon={icon}
      ref={markerRef}
      alt={pandal.name}
      eventHandlers={{ click: handleClick }}
    >
      <Popup>
        <PandalPopupContent pandal={pandal} userLocation={userLocation} />
      </Popup>
    </Marker>
  );
};

export default PandalMarker;
