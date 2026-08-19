import React from 'react';
import { MapPin, List, Heart, Info } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Locator',
    icon: <MapPin size={22} strokeWidth={1.8} />,
  },
  {
    href: '/pandals',
    label: 'Pandal List',
    icon: <List size={22} strokeWidth={1.8} />,
  },
  {
    href: '/favorites',
    label: 'Favourites',
    icon: <Heart size={22} strokeWidth={1.8} />,
  },
  {
    href: '/info',
    label: 'Info',
    icon: <Info size={22} strokeWidth={1.8} />,
  },
];
