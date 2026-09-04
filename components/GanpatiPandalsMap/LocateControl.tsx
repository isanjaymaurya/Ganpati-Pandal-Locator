import React, { useCallback, useState } from 'react';
import { LocateFixed } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMap } from 'react-leaflet';

interface Props {
  userLocation: [number, number] | null;
  onLocate: (coords: [number, number]) => void;
}

const LocateControl: React.FC<Props> = ({ userLocation, onLocate }) => {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleClick = useCallback(() => {
    if (userLocation) {
      map.setView(userLocation, 15, { animate: true });
      return;
    }
    if (!navigator.geolocation) {
      toast.dismiss();
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    toast.dismiss();
    const toastId = toast.loading('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        onLocate(coords);
        map.setView(coords, 15, { animate: true });
        setLocating(false);
        toast.dismiss();
        toast.success('Location found!', { id: toastId });
      },
      (err) => {
        setLocating(false);
        const message =
          err.code === err.PERMISSION_DENIED
            ? 'Location access denied. Please allow location permission and try again.'
            : err.code === err.POSITION_UNAVAILABLE
            ? 'Your location is currently unavailable. Please try again.'
            : 'Location request timed out. Please try again.';
        toast.dismiss();
        toast.error(message, { id: toastId, duration: 4000 });
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, [userLocation, onLocate, map]);

  return (
    <div className="leaflet-top leaflet-right pointer-events-auto">
      <div className="leaflet-control leaflet-bar !border-none !mt-2.5 !mr-2.5">
        <button
          onClick={handleClick}
          data-tooltip={userLocation ? 'Go to my location' : 'Find my location'}
          aria-label={userLocation ? 'Go to my location' : 'Find my location'}
          className="tooltip tooltip-below flex-center rounded-full border border-black bg-white shadow-sm w-8 h-8"
          disabled={locating}
        >
          <LocateFixed className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default LocateControl;
