import React from 'react';

import { FALLBACK_PANDAL_IMAGE } from '@/constants/map';
import CrownIcon from '@/components/icons/CrownIcon';

interface Props {
  name: string;
  imageUrl: string;
  famous: boolean;
}

const PandalCardImage: React.FC<Props> = ({ name, imageUrl, famous }) => (
  <div className="relative shrink-0">
    {famous && (
      <CrownIcon
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 drop-shadow-sm"
        size={11}
        aria-hidden="true"
      />
    )}
    <img
      src={imageUrl || FALLBACK_PANDAL_IMAGE}
      alt={name}
      className={`w-12 h-12 rounded-lg object-cover object-top border shadow-sm ${
        famous ? 'border-2 border-accent-gold' : 'border-border'
      }`}
      onError={(e) => {
        e.currentTarget.src = FALLBACK_PANDAL_IMAGE;
        e.currentTarget.onerror = null;
      }}
    />
  </div>
);

export default PandalCardImage;
