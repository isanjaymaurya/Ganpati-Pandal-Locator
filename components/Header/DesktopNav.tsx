import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ExternalLink } from 'lucide-react';
import { NAV_ITEMS } from '@/components/navigation/navItems';

const DesktopNav: React.FC<{ className?: string }> = ({ className }) => {
  const { pathname } = useRouter();

  return (
    <nav className={className}>
      <ul className="flex gap-6 text-white font-semibold">
        {NAV_ITEMS.map(({ href, label, external }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase transition-colors hover:text-accent-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold rounded inline-flex items-center gap-1"
                >
                  {label}
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              ) : (
                <Link
                  href={href}
                  className={`text-xs uppercase transition-colors hover:text-accent-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold rounded ${isActive ? 'text-accent-gold underline underline-offset-4' : ''}`}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default DesktopNav;
