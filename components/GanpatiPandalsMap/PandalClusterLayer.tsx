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

/** Returns true when pandal matches the selected one. */
const isMatch = (pandal: IGanpatiPandal, selected: IGanpatiPandal | null | undefined) =>
  !!selected && pandal.name === selected.name && pandal.location === selected.location;

const PandalClusterLayer: React.FC<Props> = ({ pandals, selectedPandal, popupIdx, userLocation }) => {
  // Pre-filter valid coords once
  const validPandals = pandals.filter((p) =>
    isValidCoord(parseFloat(p.latitude), parseFloat(p.longitude))
  );

  return (
    <>
      {/* Selected pandal — rendered outside the cluster so it stays visible at any zoom */}
      {validPandals.map((pandal, idx) => {
        if (!isMatch(pandal, selectedPandal)) return null;
        return (
          <PandalMarker
            key={`selected-${idx}`}
            pandal={pandal}
            markerKey={`selected-${idx}`}
            userLocation={userLocation}
            markerRef={(el) => { if (el && popupIdx === idx) el.openPopup(); }}
          />
        );
      })}

      {/* All other pandals — clustered */}
      <MarkerClusterGroup chunkedLoading>
        {validPandals.map((pandal, idx) => {
          if (isMatch(pandal, selectedPandal)) return null;
          return <PandalMarker key={idx} pandal={pandal} markerKey={idx} userLocation={userLocation} />;
        })}
      </MarkerClusterGroup>
    </>
  );
};

export default PandalClusterLayer;
