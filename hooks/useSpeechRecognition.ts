import { useCallback, useEffect, useRef, useState } from 'react';
import { createVoice, JSVoice } from 'jsvoice/src';

declare global {
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onerror: ((this: SpeechRecognition, ev: Event) => void) | null;
    onresult: ((this: SpeechRecognition, ev: Event) => void) | null;
  }

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
  const voiceRef = useRef<JSVoice | null>(null);
  const onResultRef = useRef(onResult);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasNativeRecognition =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (hasNativeRecognition) {
      setSupported(true);
      return;
    }

    const voice = createVoice({
      lang,
      continuous: false,
      interimResults: false,
      onCommandNotRecognized: (transcript) => {
        const trimmedTranscript = transcript.trim();
        if (trimmedTranscript) onResultRef.current(trimmedTranscript);
      },
      onEngineStateChange: (state) => {
        setListening(
          state === 'listening' || state === 'recording' || state === 'processing',
        );
        if (state === 'idle' || state === 'error') voiceRef.current = null;
      },
      onError: () => {
        setListening(false);
        voiceRef.current = null;
      },
    });

    voiceRef.current = voice;
    setSupported(true);

    return () => {
      voice.stop();
      voiceRef.current = null;
    };
  }, [lang]);

  const start = useCallback(() => {
    if (voiceRef.current) {
      void voiceRef.current.start();
      return;
    }

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
    if (voiceRef.current) {
      voiceRef.current.stop();
      setListening(false);
      voiceRef.current = null;
      return;
    }

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
