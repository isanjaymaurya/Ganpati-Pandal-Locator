import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Search, X } from 'lucide-react';
import type { IGanpatiPandal } from '@/types/global';
import { useAppDispatch } from '@/store/hooks';
import { setSearchSelectedPandal } from '@/store/appSlice';
import CrownIcon from '@/components/icons/CrownIcon';
import { isFamous } from '@/utils/pandal';
import { highlight } from '@/utils/highlight';
import { usePandals } from '@/hooks/usePandals';

const DesktopSearchBar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { pandals } = usePandals();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return pandals
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, pandals]);

  const handleSelect = (pandal: IGanpatiPandal) => {
    dispatch(setSearchSelectedPandal(pandal));
    setQuery('');
    setOpen(false);
    setActiveIdx(-1);
    if (router.pathname !== '/') {
      router.push('/');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      handleSelect(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-72 xl:w-96">
      {/* Input */}
      <div className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/15 border border-white/30 backdrop-blur-sm">
        <Search size={14} className="text-white/70 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Search pandals…"
          className="flex-1 bg-transparent text-white placeholder:text-white/50 text-xs outline-none"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIdx(-1);
          }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <ul className="absolute top-full mt-2 left-0 right-0 bg-surface border border-border rounded-xl shadow-xl z-[99999] overflow-hidden">
          {results.map((pandal, idx) => (
            <li key={`${pandal.name}-${idx}`}>
              <button
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 transition-colors ${
                  activeIdx === idx ? 'bg-primary/10' : 'hover:bg-primary/5'
                }`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => handleSelect(pandal)}
              >
                {/* Image */}
                <div className="relative shrink-0">
                  {isFamous(pandal) && (
                    <CrownIcon size={12} className="absolute -top-1.5 left-1/2 -translate-x-1/2" />
                  )}
                  <img
                    src={pandal.image_url || '/icon1.png'}
                    alt={pandal.name}
                    className={`w-9 h-9 rounded-lg object-cover object-top border ${
                      isFamous(pandal) ? 'border-accent-gold border-2' : 'border-border'
                    }`}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.prismic.io/mumbai-pandals/aKdKSKTt2nPbalaC_ganpatibappa.jpg?auto=format,compress';
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">{highlight(pandal.name, query)}</p>
                  <p className="text-[10px] text-text-secondary truncate">{highlight(pandal.location, query)}</p>
                </div>
                {isFamous(pandal) && (
                  <span className="text-[9px] font-bold text-accent-gold border border-accent-gold rounded-full px-1.5 py-0.5 shrink-0">
                    FAMOUS
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-surface border border-border rounded-xl shadow-xl z-[99999] px-4 py-3 text-xs text-text-secondary text-center">
          No pandals found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
};

export default DesktopSearchBar;