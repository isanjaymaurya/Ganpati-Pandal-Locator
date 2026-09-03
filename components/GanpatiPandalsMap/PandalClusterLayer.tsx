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

  // popupIdx is an index into the original `pandals` array; we compare by
  // identity (name + location) rather than index to avoid mismatches when
  // invalid-coord entries precede the selected pandal.
  const { selected, clustered } = useMemo(() => {
    const selectedPandals: typeof validPandals = [];
    const clusteredPandals: typeof validPandals = [];
    for (const pandal of validPandals) {
      if (isMatch(pandal, selectedPandal)) selectedPandals.push(pandal);
      else clusteredPandals.push(pandal);
    }
    return { selected: selectedPandals, clustered: clusteredPandals };
  }, [validPandals, selectedPandal]);

  return (
    <>
      {/* Selected pandal — rendered outside the cluster so it stays visible at any zoom */}
      {selected.map((pandal) => (
        <PandalMarker
          key={`selected-${pandal.name}-${pandal.location}`}
          pandal={pandal}
          markerKey={`selected-${pandal.name}`}
          userLocation={userLocation}
          markerRef={(el) => { if (el && popupIdx !== null && isMatch(pandal, selectedPandal)) el.openPopup(); }}
        />
      ))}

      {/* All other pandals — clustered */}
      <MarkerClusterGroup
        key={selectedPandal ? `cluster-${selectedPandal.name}-${selectedPandal.location}` : 'cluster-none'}
        chunkedLoading
      >
        {clustered.map((pandal, idx) => (
          <PandalMarker
            key={`${pandal.name}-${idx}`}
            pandal={pandal}
            markerKey={idx}
            userLocation={userLocation}
          />
        ))}
      </MarkerClusterGroup>
    </>
  );
};

export default PandalClusterLayer;
