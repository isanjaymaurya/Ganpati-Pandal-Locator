import { useCallback, useState } from 'react';

interface Options {
  name: string;
  latitude: string;
  longitude: string;
}

interface UsePandalShareReturn {
  copied: boolean;
  share: () => void;
}

export function usePandalShare({ name, latitude, longitude }: Options): UsePandalShareReturn {
  const [copied, setCopied] = useState(false);

  const share = useCallback(() => {
    const params = new URLSearchParams({ name, lat: latitude, lng: longitude });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    if (navigator.share) {
      navigator
        .share({ title: name, text: `Check out ${name} pandal!`, url: shareUrl })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  }, [name, latitude, longitude]);

  return { copied, share };
}
