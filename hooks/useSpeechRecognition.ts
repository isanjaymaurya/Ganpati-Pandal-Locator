import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onerror: ((this: SpeechRecognition, ev: Event) => void) | null;
    onresult: ((this: SpeechRecognition, ev: Event) => void) | null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognition: { new (): SpeechRecognition } | undefined;

  interface Window {
    SpeechRecognition: { new (): SpeechRecognition } | undefined;
    webkitSpeechRecognition: { new (): SpeechRecognition } | undefined;
  }
}

interface UseSpeechRecognitionOptions {
  lang?: string;
  onResult: (transcript: string) => void;
}

interface UseSpeechRecognitionReturn {
  listening: boolean;
  supported: boolean;
  toggle: () => void;
}

export function useSpeechRecognition({
  lang = 'en-IN',
  onResult,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(
      typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
    );
  }, []);

  const start = useCallback(() => {
    const API = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (typeof API === 'undefined') return;

    const recognition = new API();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (e: Event) => {
      const se = e as unknown as { results: { [i: number]: { [j: number]: { transcript: string } } } };
      const transcript = se.results[0][0].transcript.trim();
      if (transcript) onResult(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang, onResult]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
    recognitionRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { listening, supported, toggle };
}
