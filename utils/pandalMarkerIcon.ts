import L from 'leaflet';

import { BASE } from '@/constants/env';

function sanitiseHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildPandalIcon(name: string): L.DivIcon {
  const safe = sanitiseHtml(name);
  return L.divIcon({
    className: '',
    html: `
      <div class="flex flex-col items-center" role="img" aria-label="${safe}">
        <img src="${BASE}/pandal-marker.png" alt="${safe} pandal marker" class="w-14 h-14 object-contain" />
        <div class="flex flex-col items-center mt-1">
          <div class="marker-triangle"></div>
          <div class="bg-orange-100 text-center text-[10px] leading-tight text-black uppercase rounded-xl border-2 border-accent-gold w-24 shadow px-2 py-1.5 pointer-events-none">
            ${safe}
          </div>
        </div>
      </div>
    `,
    iconSize: [50, 72],
    iconAnchor: [25, 50],
    popupAnchor: [0, -52],
  });
}
