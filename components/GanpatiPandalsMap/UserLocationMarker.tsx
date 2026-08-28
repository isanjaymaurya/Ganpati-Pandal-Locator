import React from 'react';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { Marker, Popup } from 'react-leaflet';

import { BASE } from '@/constants/env';

const userLocationIcon = L.divIcon({
  className: '',
  html: `
    <div class="flex flex-col items-center pointer-events-none">
      <img src="${BASE}/user-location-marker.png" class="w-14 h-14" />
      <div class="flex flex-col items-center mt-1 pointer-events-none">
        <div class="marker-triangle"></div>
        <div class="bg-orange-100 text-black shadow-md rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wide whitespace-nowrap border-2 border-accent-gold pointer-events-none">YOU ARE HERE</div>
      </div>
    </div>
  `,
  iconSize: [80, 60],
  iconAnchor: [40, 40],
  popupAnchor: [0, -44],
});

interface Props {
  position: [number, number];
}

const UserLocationMarker: React.FC<Props> = ({ position }) => (
  <Marker position={position} icon={userLocationIcon}>
    <Popup>
      <p className="text-sm font-semibold mb-0 flex items-center gap-1">
        <MapPin size={14} className="shrink-0" /> Your Location
      </p>
    </Popup>
  </Marker>
);

export default UserLocationMarker;
