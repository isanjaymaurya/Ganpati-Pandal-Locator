import React from 'react';
import { Heart } from 'lucide-react';

export default function DesktopFooter() {
  return (
    <footer className="text-text-on-primary py-3 md:py-4 border-t border-gray-200 mx-4 md:mx-0">
        {/* ── Footer note ── */}
        <p className="text-center text-xs text-text-secondary">
          Made with{' '}
          <Heart size={11} className="inline text-accent-pink fill-accent-pink" />{' '}
          for the Ganesh Utsav community &bull; Data updated by volunteers
        </p>
    </footer>
  );
}