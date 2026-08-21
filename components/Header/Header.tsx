import React from 'react';
import Link from 'next/link';
import DesktopNav from './DesktopNav';
import { BASE } from '@/constants/env';

interface HeaderProps {
  isDesktop: boolean;
}

const Header: React.FC<HeaderProps> = ({ isDesktop }) => {
  return (
    <header
      className="sticky top-0 z-[9999] shadow-md w-full flex items-center justify-between h-14"
      style={{ 
        backgroundColor: "#22065C",
        background: "linear-gradient(90deg, rgba(34, 6, 92, 1) 0%, rgba(18, 3, 66, 1) 50%, rgba(19, 3, 70, 1) 100%)"
       }}
      >
      <div className="flex items-center w-full ml-3 gap-2 md:gap-3">
        <Link href="/" className="hover:text-purple-300 transition-colors">
          <img
            src={`${BASE}/ganpati-idol.png`}
            alt=""
            className="h-12"
          />
        </Link>
        <img
          src={`${BASE}/ganpati-locator-title.png`}
          alt=""
          className="h-10"
        />
        {isDesktop && <DesktopNav className="ml-auto mr-6" />}
        <img
          src={`${BASE}/fancy-design-for-mobile.png`}
          alt=""
          className="h-14 md:hidden ml-auto"
        />
      </div>
    </header>
  );
};

export default Header;
