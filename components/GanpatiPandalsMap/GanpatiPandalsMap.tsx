import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';

import type { IGanpatiPandal } from '../../types/global';
import PandalMarker from './PandalMarker';

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
    <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto' }}>
      <div className="leaflet-control leaflet-bar" style={{ border: 'none', marginTop: '10px', marginRight: '10px' }}>
        <button
          onClick={handleClick}
          title={userLocation ? 'Go to my location' : 'Find my location'}
          style={{
            width: 34,
            height: 34,
            background: 'var(--surface)',
            border: '2px solid var(--border)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            padding: 0,
          }}
        >
          {locating ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={userLocation ? 'var(--primary)' : 'var(--text-secondary)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <circle cx="12" cy="12" r="8" strokeDasharray="2 3" />
            </svg>
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

// Use the Next.jst basePath (set in next.config.js for GitHub Pages) so that
// public-folder assets resolve correctly under the /Ganpati-Pandal-Locator subpath.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const userLocationIcon = L.divIcon({
  className: '',
    html: `
    <div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;">
      <img src="${BASE}/user-location-marker.svg" style="width:40px;height:40px;" />
      <div style="display:flex;flex-direction:column;align-items:center;margin-top:3px;pointer-events:none;">
        <div style="
          width:0;height:0;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-bottom:6px solid var(--accent-blue);
        "></div>
        <div class="shadow-xs rounded-full bg-blue-800 border-2 border-blue-400 px-2.5 py-1" style="
          color:var(--text-on-primary);
          font-size:9px;
          font-weight:700;
          letter-spacing:0.05em;
          white-space:nowrap;
          pointer-events:none;
        ">YOU ARE HERE</div>
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
      style={{ height: '500px', width: '100%' }}
      ref={mapRef}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
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
