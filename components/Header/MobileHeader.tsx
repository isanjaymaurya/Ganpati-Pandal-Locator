import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HEADER_STYLES: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 1000,
    backgroundColor: 'var(--primary)',
  color: 'var(--text-on-primary)',
  height: '60px',
  paddingLeft: '10px',
  paddingRight: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const LOGO_LINK_STYLES: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
};

const TITLE_STYLES: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
    color: 'var(--text-on-primary)',
  display: 'flex',
  alignItems: 'center',
  margin: 0,
};

const MobileHeader: React.FC = () => {
  return (
    <header style={HEADER_STYLES}>
      <Link href="/" style={LOGO_LINK_STYLES} aria-label="Go to home page">
        <Image
          src="/icon1.png"
          alt="Ganpati Pandal Locator Logo"
          height={40}
          width={40}
          style={{ objectFit: 'contain' }}
          priority
        />
      </Link>
      <h1 style={TITLE_STYLES}>Ganpati Pandal Locator</h1>
    </header>
  );
};

export default MobileHeader;
