import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ExternalLink, Menu, X } from 'lucide-react';

import { NAV_ITEMS } from '@/components/navigation/navItems';
import { useSidebarControls } from '@/hooks/useSidebarControls';
import NavShareButton from './NavShareButton';

const MobileNav: React.FC = () => {
  const { pathname } = useRouter();
  const { open, sidebarRef, closeButtonRef, openSidebar, closeSidebar } = useSidebarControls();

  return (
    <>
      {/* Hamburger button */}
            <button
        onClick={openSidebar}
        aria-label="Open menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex-center w-9 h-9 rounded-full text-accent-gold transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10010]"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        inert={!open}
        className={`fixed top-0 right-0 h-full w-72 z-[10011] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out bg-background ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex-between px-5 py-4 border-b border-primary">
          <span className="font-bold text-sm tracking-wide uppercase">Menu</span>
          <button
            ref={closeButtonRef}
            onClick={closeSidebar}
            aria-label="Close menu"
            className="flex-center w-8 h-8 rounded-full border border-border hover:bg-black/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
          {NAV_ITEMS.map(({ href, label, icon, external }) => {
            const isActive = !external && pathname === href;
            const itemClass = `nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`;

            return external ? (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={itemClass}
                onClick={closeSidebar}
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
                onClick={closeSidebar}
              >
                <span className="opacity-80">{icon}</span>
                <span className="flex-1">{label}</span>
              </Link>
            );
          })}

          <NavShareButton />
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-primary text-center text-[10px] text-primary uppercase tracking-widest">
          Ganpati Pandal Locator
        </div>
      </div>
    </>
  );
};

export default MobileNav;
