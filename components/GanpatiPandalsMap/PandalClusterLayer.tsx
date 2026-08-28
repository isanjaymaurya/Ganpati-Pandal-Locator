import React, { useMemo } from 'react';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import type { GanpatiPandal } from '@/types/global';
import { isValidCoord } from '@/utils/geo';
import PandalMarker from './PandalMarker';

interface Props {
  pandals: GanpatiPandal[];
  selectedPandal?: GanpatiPandal | null;
  popupIdx: number | null;
  userLocation?: [number, number] | null;
}

/** Returns true when a pandal matches the currently selected one. */
const isMatch = (pandal: GanpatiPandal, selected: GanpatiPandal | null | undefined): boolean =>
  !!selected && pandal.name === selected.name && pandal.location === selected.location;

const PandalClusterLayer: React.FC<Props> = ({ pandals, selectedPandal, popupIdx, userLocation }) => {
  // Pre-filter to only pandals with valid coordinates — memoised to avoid
  // re-filtering on every render when only selectedPandal changes.
  const validPandals = useMemo(
    () => pandals.filter((p) => isValidCoord(parseFloat(p.latitude), parseFloat(p.longitude))),
    [pandals],
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
