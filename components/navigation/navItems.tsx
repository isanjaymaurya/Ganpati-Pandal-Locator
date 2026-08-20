import React from 'react';
import { MapPin, List, Heart, Info } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}
const ICON_SIZE = 16; // Size of the icons in pixels

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Locator',
    icon: <MapPin size={ICON_SIZE} strokeWidth={1.8} />,
  },
  {
    href: '/pandals',
    label: 'Pandal List',
    icon: <List size={ICON_SIZE} strokeWidth={1.8} />,
  },
  {
    href: '/favorites',
    label: 'Favourites',
    icon: <Heart size={ICON_SIZE} strokeWidth={1.8} />,
  },
  {
    href: '/info',
    label: 'Info',
    icon: <Info size={ICON_SIZE} strokeWidth={1.8} />,
  },
];
