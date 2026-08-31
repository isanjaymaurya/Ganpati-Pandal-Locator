import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/router';

import { addFavourite, removeFavourite, setSearchSelectedPandal } from '@/store/appSlice';
import type { FavouritePandal } from '@/store/appSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { GanpatiPandal } from '@/types/global';
import { formatDistance, getDistanceKm, isValidCoord } from '@/utils/geo';
import { isFamous } from '@/utils/pandal';
import { usePandals } from '@/hooks/usePandals';

import SingleVerticalPandalCard from '@/components/SingleVerticalPandalCard/SingleVerticalPandalCard';

/** Drag distance (px) beyond which the drawer is dismissed. */
const DRAG_CLOSE_THRESHOLD = 120;
/** Drag velocity (px/ms) beyond which the drawer is dismissed on flick. */
const DRAG_VELOCITY_THRESHOLD = 0.4;

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

  // ── Drag-to-dismiss state ──
  const drawerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const dragCurrentY = useRef<number>(0);
  const isDragging = useRef(false);
  const dragStartTime = useRef<number>(0);
  const [dragOffset, setDragOffset] = useState(0); // px the drawer has been pulled down
  const [isAnimating, setIsAnimating] = useState(false); // suppress CSS transition during drag

  const closeDrawer = useCallback(() => {
    // Blur the input first so the mobile keyboard is dismissed before the
    // drawer animates away. Without this, the keyboard stays visible even
    // after the drawer slides off-screen.
    inputRef.current?.blur();
    setDragOffset(0);
    setOpen(false);
    setQuery('');
    setSelectedIndex(null);
  }, []);

  const getClientY = (e: TouchEvent | MouseEvent) =>
    'touches' in e ? e.touches[0].clientY : e.clientY;

  const onDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!open) return;
    dragStartY.current = 'touches' in e.nativeEvent
      ? e.nativeEvent.touches[0].clientY
      : (e as React.MouseEvent).clientY;
    dragCurrentY.current = dragStartY.current;
    dragStartTime.current = Date.now();
    isDragging.current = true;
    setIsAnimating(false);

    const onMove = (ev: TouchEvent | MouseEvent) => {
      if (!isDragging.current) return;
      const y = getClientY(ev);
      dragCurrentY.current = y;
      const delta = Math.max(0, y - dragStartY.current); // only downward
      setDragOffset(delta);
    };

    const onEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const delta = Math.max(0, dragCurrentY.current - dragStartY.current);
      const elapsed = Date.now() - dragStartTime.current;
      const velocity = elapsed > 0 ? delta / elapsed : 0;

      setIsAnimating(true);
      if (delta > DRAG_CLOSE_THRESHOLD || velocity > DRAG_VELOCITY_THRESHOLD) {
        closeDrawer();
      } else {
        setDragOffset(0); // snap back
      }

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
  }, [open, closeDrawer]);

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

    const handleSelect = (pandal: GanpatiPandal, index: number) => {
    setSelectedIndex(index);
    dispatch(setSearchSelectedPandal(pandal));
    closeDrawer();
    if (router.pathname !== '/') router.push('/');
  };

  const handleToggleFavourite = (pandal: GanpatiPandal) => {
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

            {/* ── Backdrop ── fades as the drawer is dragged down ── */}
      {open && (
        <div
          className="fixed inset-0 z-[10002] backdrop-blur-[2px]"
          style={{
            backgroundColor: `rgba(0,0,0,${Math.max(0, 0.5 - (dragOffset / 300) * 0.5)})`,
            transition: isAnimating ? 'background-color 300ms ease-out' : 'none',
          }}
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

            {/* ── Drawer ── */}
      <div
        ref={drawerRef}
        className="drawer-height fixed bottom-0 left-0 right-0 z-[10003] bg-surface rounded-t-3xl shadow-2xl flex flex-col"
        style={{
          transform: open
            ? `translateY(${dragOffset}px)`
            : 'translateY(100%)',
          transition: isAnimating || !open
            ? 'transform 300ms ease-out'
            : isDragging.current ? 'none' : 'transform 300ms ease-out',
        } as CSSProperties}
      >
        {/* Drag handle — touch/mouse target for drag-to-dismiss */}
        <div
          className="flex-center pt-3.5 pb-2 cursor-grab active:cursor-grabbing touch-none select-none"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          role="button"
          aria-label="Drag down to close"
        >
          <div className="w-12 h-1 rounded-full bg-border" />
        </div>

        {/* Header row — also draggable */}
        <div
          className="flex items-center justify-between px-4 pb-3 cursor-grab active:cursor-grabbing touch-none select-none"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
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
