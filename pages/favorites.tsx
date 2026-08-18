import React from 'react';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';

import MainLayout from '@/components/layout/MainLayout';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFavourite } from '@/store/appSlice';
import type { FavouritePandal } from '@/store/appSlice';

export default function FavoritesPage() {
  const favourites = useAppSelector(state => state.favourites.favourites);
  const dispatch = useAppDispatch();

  return (
    <MainLayout>
      <section className="container mx-auto min-h-dvh">
        <h2 className="text-lg font-bold mb-4 text-text-primary">Pandals Favourites</h2>

        {favourites.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 mt-12 text-text-secondary">
            <Heart size={48} strokeWidth={1.2} />
            <p className="text-lg font-medium">No favourites yet</p>
            <p className="text-sm text-center mb-2">
              Add pandals to favourites to see them here.
            </p>
            <Link href="/pandals">
              <button className="px-4 text-sm py-2 bg-primary text-text-on-primary rounded-lg hover:bg-primary-dark transition-colors">
                Browse Pandals
              </button>
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {favourites.map((fp: FavouritePandal) => (
              <li
                key={fp.name}
                className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-text-primary">{fp.name}</span>
                </div>
                <button>
                  <Heart size={18} className="text-accent-gold" strokeWidth={1.8} />
                </button>
                <button
                  onClick={() => dispatch(removeFavourite(fp.name))}
                  className="text-danger hover:opacity-75 transition-colors outline-none p-1"
                  aria-label={`Remove ${fp.name} from favourites`}
                  title="Remove from favourites"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </MainLayout>
  );
}
