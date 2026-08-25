import React from 'react';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import type { IGanpatiPandal } from '@/types/global';
import PandalMarker from './PandalMarker';
import { isValidCoord } from '@/utils/geo';

interface Props {
  pandals: IGanpatiPandal[];
  selectedPandal?: IGanpatiPandal | null;
  popupIdx: number | null;
  userLocation?: [number, number] | null;
}

const PandalClusterLayer: React.FC<Props> = ({ pandals, selectedPandal, popupIdx, userLocation }) => (
  <>
    {/* Selected pandal — rendered outside the cluster so it stays visible at any zoom */}
    {pandals.map((pandal, idx) => {
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
          userLocation={userLocation}
          markerRef={(el) => {
            if (el && popupIdx === idx) el.openPopup();
          }}
        />
      );
    })}

    {/* All other pandals — clustered */}
    <MarkerClusterGroup chunkedLoading>
      {pandals.map((pandal, idx) => {
        const lat = parseFloat(pandal.latitude);
        const lng = parseFloat(pandal.longitude);
        if (!isValidCoord(lat, lng)) return null;
        const isSelected =
          selectedPandal &&
          pandal.name === selectedPandal.name &&
          pandal.location === selectedPandal.location;
        if (isSelected) return null;
        return <PandalMarker key={idx} pandal={pandal} markerKey={idx} userLocation={userLocation} />;
      })}
    </MarkerClusterGroup>
  </>
);

export default PandalClusterLayer;
