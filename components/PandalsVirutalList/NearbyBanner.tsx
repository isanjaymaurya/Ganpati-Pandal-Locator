import { MapPin } from 'lucide-react';
import React from 'react';

const NearbyBanner: React.FC = () => (
  <p className="text-[10px] text-primary font-semibold mb-1 mx-1 flex items-center gap-1">
    <MapPin size={10} className="shrink-0" /> Showing pandals nearest to you
  </p>
);

export default NearbyBanner;
