import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2 sticky top-0 z-[9999] bg-primary text-text-on-primary h-16 shadow-md">
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

export default Header;
