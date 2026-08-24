import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { IGanpatiPandal } from '../../types/global';
import PandalPopupContent from './PandalPopupContent';
import { BASE } from '@/constants/env';

interface Props {
  pandal: IGanpatiPandal;
  markerKey: string | number;
  markerRef?: (el: L.Marker | null) => void;
}

// Build a DivIcon that stacks the marker image + name label in one element.
// Because it's part of the icon, it never intercepts clicks on the marker.
function buildIcon(name: string): L.DivIcon {
  return L.divIcon({
    className: '',
        html: `
      <div class="flex flex-col items-center pointer-events-none">
        <img src="${BASE}/pandal-marker.png" class="w-14 h-14 object-contain" />
        <div class="flex flex-col items-center mt-1 pointer-events-none">
          <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid var(--accent-gold);"></div>
          <div
            class="bg-orange-100 text-center text-[8px] text-black uppercase font-bols rounded-xl border-2 border-accent-gold w-22 shadow px-2 py-1.5 pointer-events-none"
          >
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

const PandalMarker: React.FC<Props> = ({ pandal, markerKey, markerRef }) => {
  const lat = parseFloat(pandal.latitude);
  const lng = parseFloat(pandal.longitude);
  const icon = useMemo(() => buildIcon(pandal.name), [pandal.name]);

  return (
    <Marker
      key={markerKey}
      position={[lat, lng]}
      icon={icon}
      ref={markerRef}
    >
      <Popup>
        <PandalPopupContent pandal={pandal} />
      </Popup>
    </Marker>
  );
};

export default PandalMarker;
