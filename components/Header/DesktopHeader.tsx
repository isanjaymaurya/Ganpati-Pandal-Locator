import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NAV_ITEMS } from '@/components/navigation/navItems';

const HEADER_STYLES: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 1000,
    backgroundColor: 'var(--primary-dark)',
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

const NAV_STYLES: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const NAV_LINK_BASE_STYLES: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3px',
  textDecoration: 'none',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.02em',
  color: 'var(--gold-light)',
  padding: '6px 14px',
  borderRadius: '8px',
  transition: 'color 0.15s ease, background-color 0.15s ease',
  cursor: 'pointer',
};

const NAV_LINK_ACTIVE_STYLES: React.CSSProperties = {
  ...NAV_LINK_BASE_STYLES,
    color: 'var(--text-on-primary)',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
};

const DesktopHeader: React.FC = () => {
  const { pathname } = useRouter();

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
      <nav style={NAV_STYLES} aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={isActive ? NAV_LINK_ACTIVE_STYLES : NAV_LINK_BASE_STYLES}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {icon}
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default DesktopHeader;
