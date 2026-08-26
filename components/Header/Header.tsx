import React from 'react';
import Link from 'next/link';

import DesktopNav from './DesktopNav';
import { BASE } from '@/constants/env';
import DesktopSearchBar from '../SearchBar/DesktopSearchBar';
import MobileNav from './MobileNav';

interface HeaderProps {
  isDesktop: boolean;
}

const Header: React.FC<HeaderProps> = ({ isDesktop }) => {
  return (
    <header
      className="sticky top-0 z-[9999] shadow-md w-full flex items-center justify-between h-14"
      style={{
        background: 'linear-gradient(135deg, #a23217 0%, #b44024 40%, #c54628 70%, #C45000 100%)'
      }}
      >
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="flex items-center hover:text-purple-300 transition-colors ml-3 gap-2">
          <img
            src={`${BASE}/ganpati-idol.png`}
            alt=""
            className="h-12"
          />
          <img
            src={`${BASE}/ganpati-locator-title.png`}
            alt=""
            className="h-10"
          />
        </Link>
        {isDesktop && <DesktopSearchBar />}
        <div className="flex items-center gap-2 md:mr-6">
          {isDesktop ? <DesktopNav /> : <MobileNav />}
          <img
            src={`${BASE}/fancy-design-for-mobile.png`}
            alt=""
            className="h-14 pb-1 md:hidden"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
