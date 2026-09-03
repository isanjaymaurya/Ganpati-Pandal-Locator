import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-4 border-t border-border mx-4 md:mx-0">
      <p className="text-center text-xs text-text-secondary">
        Made with{' '}
        <Heart size={11} className="inline text-accent-pink fill-accent-pink" />{' '}
        for the Ganesh Utsav community &bull; &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}