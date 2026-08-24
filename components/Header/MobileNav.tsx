import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, ExternalLink } from 'lucide-react';
import { NAV_ITEMS } from '@/components/navigation/navItems';

const MobileNav: React.FC = () => {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        title={open ? 'Close menu' : 'Open menu'}
        className="flex items-center justify-center w-9 h-9 rounded-full text-accent-gold transition-colors"
      >
        <Menu size={18} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000]"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-72 z-[10001] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out bg-orange-50 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-accent-gold">
          <span className="font-bold text-sm tracking-wide uppercase">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
          {NAV_ITEMS.map(({ href, label, icon, external }) => {
            const isActive = !external && pathname === href;
            const itemClass = `flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold text-xs transition-all ${
              isActive
                ? 'bg-white/20 text-accent-gold border border-accent-gold'
                : 'hover:bg-black/10 border border-transparent'
            }`;

            return external ? (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                <span className="opacity-80">{icon}</span>
                <span className="flex-1">{label}</span>
                <ExternalLink size={13} className="opacity-50" />
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                <span className="opacity-80">{icon}</span>
                <span className="flex-1">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-accent-gold text-center text-[10px] text-accent-gold uppercase tracking-widest">
          Ganpati Pandal Locator
        </div>
      </div>
    </>
  );
};

export default MobileNav;
