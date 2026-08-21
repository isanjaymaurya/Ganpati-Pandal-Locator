import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NAV_ITEMS } from '@/components/navigation/navItems';

const BottomNavigation: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <nav
      aria-label="Bottom navigation"
      className="flex items-stretch fixed bottom-0 left-0 right-0 mx-2 mb-0.5 rounded-xl shadow-lg h-14 shadow-gray-300 border border-indigo-800 overflow-hidden z-[1000]"
      style={{ 
        backgroundColor: "#22065C",
        background: "linear-gradient(180deg, rgba(34, 6, 92, 1) 0%, rgba(18, 3, 66, 1) 50%, rgba(19, 3, 70, 1) 100%)"
       }}
    >
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col font-bold items-center justify-center w-full border-r border-gray-700 h-full text-gray-200 ${isActive ? 'bg-accent-pink pointer-events-none' :''} hover:bg-accent-pink overflow-hidden`}
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
