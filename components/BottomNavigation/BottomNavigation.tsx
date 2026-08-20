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


const BottomNavigation: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <nav style={NAV_BAR_STYLES} aria-label="Bottom navigation" className="mx-2 mb-0.5 rounded-xl shadow-lg border">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-primary' : 'text-gray-400'}`}
          >
            {icon}
            <span className="text-[8px] uppercase mt-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
