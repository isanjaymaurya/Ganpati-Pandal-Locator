import React from 'react';
import { Github, Info, List, MapPin } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}
const ICON_SIZE = 16; // Size of the icons in pixels

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Locator',
    icon: <MapPin size={ICON_SIZE} strokeWidth={1.8} />,
  },
    {
    href: 'https://docs.google.com/spreadsheets/d/1Z7Dsgv8f0eGSysC6JkOATyBDJODeNd2p8IOiLvPJXlY/edit?gid=0#gid=0',
    label: 'Pandal List',
    icon: <List size={ICON_SIZE} strokeWidth={1.8} />,
    external: true,
  },
  {
    href: 'https://github.com/isanjaymaurya/Ganpati-Pandal-Locator',
    label: 'GitHub Repo',
    icon: <Github size={ICON_SIZE} strokeWidth={1.8} />,
    external: true,
  },
  {
    href: '/about',
    label: 'About',
    icon: <Info size={ICON_SIZE} strokeWidth={1.8} />,
  }
];
