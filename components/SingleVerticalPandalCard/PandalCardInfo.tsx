import React from 'react';
import { TrainFront } from 'lucide-react';

import { highlightMatch } from '@/utils/highlight';

interface Props {
  name: string;
  location: string;
  nearbyStation?: string;
  distance?: string | null;
  search: string;
}

const PandalCardInfo: React.FC<Props> = ({
  name,
  location,
  nearbyStation,
  distance,
  search,
}) => (
  <div className="flex-1 min-w-0">
    <p className="font-semibold text-xs mb-0.5 text-text-primary uppercase line-clamp-1">
      {highlightMatch(name, search)}
    </p>
    <p className="text-[10px] text-text-secondary mb-0.5 flex items-center gap-1 line-clamp-1 capitalize">
      {highlightMatch(location, search)}
      {distance && (
        <span className="text-primary font-semibold whitespace-nowrap">· {distance}</span>
      )}
    </p>
    {nearbyStation && (
      <p className="text-[10px] text-text-secondary flex items-center gap-1">
        <TrainFront size={9} className="shrink-0" />
        <span className="line-clamp-1">{nearbyStation}</span>
      </p>
    )}
  </div>
);

export default PandalCardInfo;
