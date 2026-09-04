import React from 'react';

const MapLoadingOverlay: React.FC = () => (
  <div className="absolute inset-0 z-[400] bg-background flex items-center justify-center rounded-xl">
    <div className="flex flex-col items-center gap-2 text-text-secondary">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-xs">Loading map…</span>
    </div>
  </div>
);

export default MapLoadingOverlay;
