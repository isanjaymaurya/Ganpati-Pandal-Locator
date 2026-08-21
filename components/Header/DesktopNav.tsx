import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NAV_ITEMS } from '@/components/navigation/navItems';

const DesktopNav: React.FC<{ className?: string }> = ({ className }) => {
  const { pathname } = useRouter();

  return (
    <nav className={className}>
      <ul className="flex gap-4 text-white font-semibold text-lg">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`text-xs uppercase transition-colors hover:text-accent-gold ${isActive ? 'text-accent-gold underline underline-offset-4' : ''}`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default DesktopNav;
