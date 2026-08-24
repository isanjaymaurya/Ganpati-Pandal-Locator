import React from 'react';

interface Props {
  size?: number;
  className?: string;
  color?: string;
}

const CrownIcon: React.FC<Props> = ({ size = 16, className = '', color = '#FFB800' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={color}
    width={size}
    height={size}
    className={className}
    aria-label="Famous pandal"
  >
    <path d="M2 19h20v2H2v-2zm2-2l2-9 4 4 2-6 2 6 4-4 2 9H4z" />
  </svg>
);

export default CrownIcon;
