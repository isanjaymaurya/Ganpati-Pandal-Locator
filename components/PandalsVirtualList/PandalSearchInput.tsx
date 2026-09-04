import React, { useCallback } from 'react';
import { Mic, MicOff, Search, X } from 'lucide-react';

import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface Props {
  value: string;
  onChange: (value: string) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
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
    <div className="relative mb-2">
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
        className={`w-full pl-8 py-2 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-surface text-text-primary placeholder:text-text-secondary ${
          value && supported ? 'pr-14' : 'pr-8'
        }`}
        name="search"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        )}
        {supported && (
          <button
            onClick={toggle}
            aria-label={listening ? 'Stop listening' : 'Search by voice'}
            className={`p-1 transition-colors ${
              listening ? 'text-primary' : 'text-text-secondary hover:text-primary'
            }`}
          >
            {listening ? (
              <MicOff size={14} className="animate-pulse" />
            ) : (
              <Mic size={14} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PandalSearchInput;
