import React, { useCallback } from 'react';
import { Mic, MicOff, Search, X } from 'lucide-react';

import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface Props {
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const PandalSearchInput: React.FC<Props> = ({ value, onChange, inputRef }) => {
  const handleResult = useCallback(
    (transcript: string) => {
      onChange(transcript);
      inputRef.current?.focus();
    },
    [onChange],
  );

  const { listening, supported, toggle } = useSpeechRecognition({
    lang: 'en-IN',
    onResult: handleResult,
  });

  return (
    <div className="mb-2">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none shrink-0"
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name or location…"
          aria-label="Search pandals by name or location"
          inputMode="search"
          className={`w-full pl-8 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-surface text-text-primary placeholder:text-text-secondary transition-colors ${
            listening ? 'border-primary ring-2 ring-primary/20' : 'border-border'
          } ${
            value ? 'pr-20' : 'pr-12'
          }`}
          name="search"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="w-8 h-8 flex-center rounded-full text-text-secondary hover:bg-primary/10 hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (supported) toggle();
            }}
            aria-label={listening ? 'Stop listening' : 'Search by voice'}
            aria-pressed={listening}
            data-tooltip="Search by voice"
            className={`tooltip tooltip-below w-8 h-8 flex-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              listening
                ? 'bg-primary text-text-on-primary shadow-sm'
                : 'text-text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
          >
            {listening ? <MicOff size={17} className="animate-pulse" /> : <Mic size={17} />}
          </button>
        </div>
      </div>
      {listening && (
        <div
          className="mt-2 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs text-primary"
          role="status"
          aria-live="polite"
        >
          <span className="relative mt-1 flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold">Listening…</span>
            <span className="mt-0.5 block text-[11px] text-text-secondary">
              Speak now, or tap the mic to stop.
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default PandalSearchInput;
