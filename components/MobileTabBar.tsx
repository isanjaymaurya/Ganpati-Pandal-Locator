import React from 'react';
import { List, Map } from 'lucide-react';

type Tab = 'map' | 'list';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const MobileTabBar: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <div
    role="tablist"
    aria-label="View mode"
    className="md:hidden flex border-b border-border bg-surface sticky top-14 z-[900]"
  >
    <button
      role="tab"
      onClick={() => onTabChange('map')}
      aria-selected={activeTab === 'map'}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${
        activeTab === 'map'
          ? 'text-primary border-b-2 border-primary'
          : 'text-text-secondary'
      }`}
    >
      <Map size={14} /> Map
    </button>
    <button
      role="tab"
      onClick={() => onTabChange('list')}
      aria-selected={activeTab === 'list'}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${
        activeTab === 'list'
          ? 'text-primary border-b-2 border-primary'
          : 'text-text-secondary'
      }`}
    >
      <List size={14} /> List
    </button>
  </div>
);

export default MobileTabBar;
