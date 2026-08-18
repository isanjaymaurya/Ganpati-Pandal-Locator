import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { IGanpatiPandal } from '../../types/global';

const isValidCoord = (lat: number, lng: number): boolean =>
  isFinite(lat) && isFinite(lng) && lat !== 0 && lng !== 0;

type Props = {
  ganpatiPandals: IGanpatiPandal[];
  selectedPandal?: IGanpatiPandal | null;
};

const DEFAULT_CENTER: [number, number] = [18.9582, 72.8321];

const ganeshIcon = new L.Icon({
  iconUrl: 'pending-visit-ganpati-pandal-marker.svg',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
});

const selectedIcon = new L.Icon({
  iconUrl: 'visited-ganpati-pandal-marker.svg',
  iconSize: [60, 60],
  iconAnchor: [30, 60],
  popupAnchor: [0, -60],
});

const userLocationIcon = new L.Icon({
  iconUrl: 'user-location-marker.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -22],
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
        p => p.name === selectedPandal.name && p.address === selectedPandal.address
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
    >
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

            {/* Pandal markers */}
      {ganpatiPandals.map((pandal, idx) => {
        const lat = parseFloat(pandal.latitude);
        const lng = parseFloat(pandal.longitude);
        if (!isValidCoord(lat, lng)) return null;
        const isSelected =
          selectedPandal &&
          pandal.name === selectedPandal.name &&
          pandal.address === selectedPandal.address;
        return (
          <Marker
            key={idx}
                        position={[lat, lng]}
            icon={isSelected ? selectedIcon : ganeshIcon}
            ref={(el: L.Marker | null) => {
              if (el && popupIdx === idx) {
                el.openPopup();
              }
            }}
          >
            <Popup position={[lat, lng]}>
              <p className="text-base font-bold mb-0.5">{pandal.name}</p>
              <p><strong>Address:</strong> {pandal.address}</p>
              <p>
                <a href={pandal.gmap_link} target="_blank" rel="noopener noreferrer">
                  Google Map
                </a>
              </p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
