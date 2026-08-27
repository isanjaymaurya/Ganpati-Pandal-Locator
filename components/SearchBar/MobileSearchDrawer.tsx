import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchSelectedPandal, addFavourite, removeFavourite } from '@/store/appSlice';
import type { FavouritePandal } from '@/store/appSlice';
import type { IGanpatiPandal } from '@/types/global';
import { isFamous } from '@/utils/pandal';
import { highlightMatch } from '@/utils/highlight';
import { getDistanceKm, formatDistance, isValidCoord } from '@/utils/geo';
import { usePandals } from '@/hooks/usePandals';
import SingleVerticalPandalCard from '@/components/SingleVerticalPandalCard/SingleVerticalPandalCard';

interface Props {
  userLocation?: [number, number] | null;
}

const MobileSearchDrawer: React.FC<Props> = ({ userLocation }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((state) => state.favourites.favourites);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { pandals } = usePandals();

    const closeDrawer = useCallback(() => { setOpen(false); setQuery(''); setSelectedIndex(null); }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeDrawer]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) {
      // If user location is known → show nearest pandals sorted by distance
      if (userLocation) {
        const [uLat, uLng] = userLocation;
        return pandals
          .map((p) => {
            const lat = parseFloat(p.latitude);
            const lng = parseFloat(p.longitude);
            const km = isValidCoord(lat, lng) ? getDistanceKm(uLat, uLng, lat, lng) : Infinity;
            return { pandal: p, km, distance: isFinite(km) ? formatDistance(km) : null };
          })
          .sort((a, b) => a.km - b.km)
          .slice(0, 20)
          .map(({ pandal, distance }) => ({ pandal, distance }));
      }
      // Fallback → famous pandals
      return pandals
        .filter(isFamous)
        .slice(0, 12)
        .map((pandal) => ({ pandal, distance: null as string | null }));
    }
    // Search query active
    const q = query.toLowerCase();
    return pandals
      .filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      )
      .slice(0, 25)
      .map((pandal) => ({ pandal, distance: null as string | null }));
  }, [query, pandals, userLocation]);

  const handleSelect = (pandal: IGanpatiPandal, index: number) => {
    setSelectedIndex(index);
    dispatch(setSearchSelectedPandal(pandal));
    closeDrawer();
    if (router.pathname !== '/') router.push('/');
  };

  const handleToggleFavourite = (pandal: IGanpatiPandal) => {
    if (favourites.some((fp: FavouritePandal) => fp.name === pandal.name)) {
      dispatch(removeFavourite(pandal.name));
    } else {
      dispatch(addFavourite({ name: pandal.name, lat: Number(pandal.latitude), lng: Number(pandal.longitude) }));
    }
  };

  return (
    <>
      {/* ── Search bar pill (above the list) ── */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 w-full px-4 py-3 rounded-full bg-surface border border-border shadow-sm text-text-secondary"
        aria-label="Search pandals"
      >
        <Search size={15} className="shrink-0 text-primary" />
        <span className="flex-1 text-left text-text-secondary/70 text-sm">
          Search pandals by name or area…
        </span>
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[10002] backdrop-blur-[2px]"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* ── Drawer ── */}
      <div
        className={`drawer-height fixed bottom-0 left-0 right-0 z-[10003] bg-surface rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle */}
        <div className="flex-center pt-3.5 pb-2">
          <div className="w-12 h-1 rounded-full bg-border" />
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between px-4 pb-3">
          <p className="text-sm font-bold text-text-primary">
            {query.trim()
              ? `${results.length} result${results.length !== 1 ? 's' : ''}`
              : 'Famous Pandals'}
          </p>
          <button
            onClick={closeDrawer}
            className="flex-center w-7 h-7 rounded-full bg-border/60 text-text-secondary"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Search input */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-background border border-border shadow-sm">
            <Search size={15} className="text-primary shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              name="mobile-pandal-search"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, area or station…"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/60 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="flex-center w-5 h-5 rounded-full bg-border text-text-secondary"
                aria-label="Clear"
              >
                <X size={11} />
              </button>
            )}
          </div>
        </div>

                {/* Results — reuses the same SingleVerticalPandalCard as the index page list */}
        <div className="overflow-y-auto flex-1 pb-8 px-2">
          {results.length === 0 ? (
            <div className="flex-center flex-col gap-2 py-12 text-text-secondary">
              <Search size={32} className="opacity-30" />
              <p className="text-sm">No pandals found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {results.map(({ pandal, distance }, idx) => (
                <li key={`${pandal.name}-${idx}`}>
                  <SingleVerticalPandalCard
                    pandal={pandal}
                    search={query}
                    isSelected={selectedIndex === idx}
                    favourites={favourites}
                    highlightMatch={highlightMatch}
                    distance={distance}
                    onSelect={() => handleSelect(pandal, idx)}
                    onToggleFavourite={() => handleToggleFavourite(pandal)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileSearchDrawer;
