import React, { useCallback, useState } from 'react';
import { Check, Share2 } from 'lucide-react';

const NavShareButton: React.FC = () => {
  const [shared, setShared] = useState(false);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Ganpati Pandal Locator',
      text: 'Find Ganpati pandals near you across Mumbai this Ganesh Chaturthi!',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed — do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // Clipboard also unavailable — do nothing
      }
    }
  }, []);

  return (
    <button
      onClick={handleShare}
      aria-label="Share this app"
      className="nav-item nav-item-inactive w-full"
    >
      <span className="opacity-80">
        {shared ? <Check size={16} strokeWidth={1.8} /> : <Share2 size={16} strokeWidth={1.8} />}
      </span>
      <span className="flex-1 text-left">{shared ? 'Link Copied!' : 'Share'}</span>
    </button>
  );
};

export default NavShareButton;
