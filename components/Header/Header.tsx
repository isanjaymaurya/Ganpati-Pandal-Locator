import React from 'react';
import Link from 'next/link';

import { BASE } from '@/constants/env';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Header: React.FC = () => (
  <header className="header-gradient sticky top-0 z-[9999] shadow-md w-full flex items-center h-14">
        {/* Use relative so the absolutely-centred nav doesn't escape the header */}
    <div className="relative flex items-center justify-between w-full">
      {/* Logo — left */}
      <Link href="/" className="flex items-center ml-3 gap-2 hover:opacity-90 transition-opacity shrink-0">
        <img src={`${BASE}/ganpati-idol.png`} alt="Ganpati Idol" className="h-12" />
        <img src={`${BASE}/ganpati-locator-title.png`} alt="Ganpati Pandal Locator" className="h-10" />
      </Link>

      {/* Desktop nav — absolutely centred, hidden on mobile */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
        <DesktopNav />
      </div>

      {/* Right side */}
      <div className="flex items-center shrink-0">
        {/* Fancy design + nothing else on desktop */}
        <img src={`${BASE}/fancy-design-for-mobile.png`} alt="" className="hidden md:block h-14 pb-1 opacity-90 mr-2" />
        {/* Mobile nav + fancy design */}
        <div className="md:hidden flex items-center gap-1 mr-2">
          <MobileNav />
          <img src={`${BASE}/fancy-design-for-mobile.png`} alt="" className="h-14 pb-1" />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
