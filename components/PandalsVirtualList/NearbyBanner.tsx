import React from 'react';
import { MapPin } from 'lucide-react';

const NearbyBanner: React.FC = () => (
  <p className="text-[10px] text-primary font-semibold mb-1.5 mx-1 flex items-center gap-1.5">
    <MapPin size={12} className="shrink-0 animate-pulse" />
    Showing pandals nearest to you
  </p>
);

export default NearbyBanner;
