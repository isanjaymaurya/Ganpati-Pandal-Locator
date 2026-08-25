import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { BASE } from '@/constants/env';

const userLocationIcon = L.divIcon({
  className: '',
  html: `
    <div class="flex flex-col items-center pointer-events-none">
      <img src="${BASE}/user-location-marker.svg" class="w-10 h-10" />
      <div class="flex flex-col items-center mt-1 pointer-events-none">
        <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid var(--accent-gold);"></div>
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
      <p className="text-sm font-semibold mb-0">📍 Your Location</p>
    </Popup>
  </Marker>
);

export default UserLocationMarker;
