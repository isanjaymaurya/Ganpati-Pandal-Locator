import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NAV_ITEMS } from '@/components/navigation/navItems';

const NAV_BAR_STYLES: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
    backgroundColor: 'var(--primary-dark)',
  boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  alignItems: 'stretch',
  height: '60px',
};

const NAV_ITEM_BASE_STYLES: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3px',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
  color: 'var(--gold-light)',
  cursor: 'pointer',
};

const NAV_ITEM_ACTIVE_STYLES: React.CSSProperties = {
  ...NAV_ITEM_BASE_STYLES,
    color: 'var(--text-on-primary)',
};

const BottomNavigation: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <nav style={NAV_BAR_STYLES} aria-label="Bottom navigation" className="mx-4 rounded-xl shadow-lg">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={isActive ? NAV_ITEM_ACTIVE_STYLES : NAV_ITEM_BASE_STYLES}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            {icon}
            <span className="text-xs uppercase">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
