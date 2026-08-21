import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';
import { LocateFixed } from 'lucide-react';

import type { IGanpatiPandal } from '../../types/global';
import PandalMarker from './PandalMarker';
import { BASE } from '@/constants/env';

// ── Locate Me control ──────────────────────────────────────────────────────
function LocateControl({
  userLocation,
  onLocate,
}: {
  userLocation: [number, number] | null;
  onLocate: (coords: [number, number]) => void;
}) {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleClick = () => {
    if (userLocation) {
      map.setView(userLocation, 15, { animate: true });
      return;
    }
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        onLocate(coords);
        map.setView(coords, 15, { animate: true });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

    return (
    <div className="leaflet-top leaflet-right pointer-events-auto">
      <div className="leaflet-control leaflet-bar !border-none !mt-2.5 !mr-2.5">
        <button
          onClick={handleClick}
          title={userLocation ? 'Go to my location' : 'Find my location'}
          className="rounded-full border border-black bg-white flex items-center justify-center shadow-sm w-8 h-8"
        >
                    {locating ? (
            <LocateFixed className="w-6 h-4 animate-spin" />
          ) : (
            <LocateFixed className="w-6 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

const isValidCoord = (lat: number, lng: number): boolean =>
  isFinite(lat) && isFinite(lng) && lat !== 0 && lng !== 0;

type Props = {
  ganpatiPandals: IGanpatiPandal[];
  selectedPandal?: IGanpatiPandal | null;
};

const DEFAULT_CENTER: [number, number] = [18.9582, 72.8321];



const userLocationIcon = L.divIcon({
  className: '',
  html: `
    <div class="flex flex-col items-center pointer-events-none">
      <img src="${BASE}/user-location-marker.svg" class="w-10 h-10" />
      <div class="flex flex-col items-center mt-1 pointer-events-none">
        <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid var(--accent-blue);"></div>
        <div class="shadow-xs rounded-full bg-blue-800 border-2 border-blue-400 px-2.5 py-1 text-white text-[9px] font-bold tracking-wide whitespace-nowrap pointer-events-none">YOU ARE HERE</div>
      </div>
    </div>
  `,
  iconSize: [80, 60],
  iconAnchor: [40, 40],
  popupAnchor: [0, -44],
});

export default function GanpatiPandalsMap({ ganpatiPandals, selectedPandal }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const [popupIdx, setPopupIdx] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const hasCenteredOnUser = useRef(false);

  // Request user location on mount
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords: [number, number] = [latitude, longitude];
        setUserLocation(coords);

        // Pan to user location only on first acquisition and only if no pandal is selected
        if (!hasCenteredOnUser.current && mapRef.current && !selectedPandal) {
          mapRef.current.setView(coords, 14, { animate: true });
          hasCenteredOnUser.current = true;
        }
      },
      () => {
        // Permission denied or unavailable — stay on default center
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pan to selected pandal when it changes
  useEffect(() => {
    if (selectedPandal && mapRef.current) {
      const lat = parseFloat(selectedPandal.latitude);
      const lng = parseFloat(selectedPandal.longitude);
      if (!isValidCoord(lat, lng)) return;
      if (window.innerWidth < 768) {
        mapRef.current.setView([lat, lng], 16, { animate: true });
      } else {
        mapRef.current.setView([lat, lng], 15, { animate: true });
      }
      const idx = ganpatiPandals.findIndex(
        p => p.name === selectedPandal.name && p.location === selectedPandal.location
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
      className="h-[500px] w-full"
      ref={mapRef}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      {/* <ZoomLogger /> */}
      <LocateControl
        userLocation={userLocation}
        onLocate={(coords) => setUserLocation(coords)}
      />
      <TileLayer
        url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
      />

      {/* User location marker */}
      {userLocation && (
        <Marker position={userLocation} icon={userLocationIcon}>
          <Popup>
            <p className="text-sm font-semibold mb-0">📍 Your Location</p>
          </Popup>
        </Marker>
      )}

      {/* Selected pandal — rendered outside cluster so it stays visible */}
      {ganpatiPandals.map((pandal, idx) => {
        const lat = parseFloat(pandal.latitude);
        const lng = parseFloat(pandal.longitude);
        if (!isValidCoord(lat, lng)) return null;
        const isSelected =
          selectedPandal &&
          pandal.name === selectedPandal.name &&
          pandal.location === selectedPandal.location;
        if (!isSelected) return null;
        return (
          <PandalMarker
            key={`selected-${idx}`}
            pandal={pandal}
            markerKey={`selected-${idx}`}
            markerRef={(el) => {
              if (el && popupIdx === idx) el.openPopup();
            }}
          />
        );
      })}

      {/* Clustered pandal markers */}
      <MarkerClusterGroup chunkedLoading>
        {ganpatiPandals.map((pandal, idx) => {
          const lat = parseFloat(pandal.latitude);
          const lng = parseFloat(pandal.longitude);
          if (!isValidCoord(lat, lng)) return null;
          const isSelected =
            selectedPandal &&
            pandal.name === selectedPandal.name &&
            pandal.location === selectedPandal.location;
          // Skip selected pandal — it's rendered above, outside the cluster
          if (isSelected) return null;
          return (
            <PandalMarker
              key={idx}
              pandal={pandal}
              markerKey={idx}
            />
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
