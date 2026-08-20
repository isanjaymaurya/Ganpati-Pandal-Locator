import React from 'react';
import Link from 'next/link';
import { MapPin, Home } from 'lucide-react';

import MainLayout from '@/components/layout/MainLayout';

export default function NotFoundPage() {
  return (
    <MainLayout
      title="Page Not Found | Ganpati Pandal Locator"
      description="The page you are looking for does not exist. Head back to the Ganpati Pandal Locator to explore pandals near you."
    >
      <div className="max-w-md mx-auto px-4 py-12 pb-24 md:pb-12 flex flex-col items-center gap-6 text-center">

        {/* Icon + 404 */}
        <div className="rounded-2xl px-8 py-10 flex flex-col items-center shadow-lg w-full">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-6 shadow-md">
            <MapPin size={40} className="text-text-on-primary" strokeWidth={2} />
          </div>
          <p className="text-4xl font-extrabold tracking-tight mb-3">404</p>
          <h1 className="text-lg font-bold mb-8">Page Not Found</h1>
           <Link
              href="/"
              className="flex items-center gap-3 rounded-xl bg-primary text-text-on-primary font-semibold text-sm py-3 px-4 hover:opacity-90 transition-opacity shadow-sm"
            >
              <Home size={18} />
              Back to Locator
            </Link>
        </div>
      </div>
    </MainLayout>
  );
}
