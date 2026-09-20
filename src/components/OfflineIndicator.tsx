import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  language: 'en' | 'hi';
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const isOnline = useOnlineStatus();
  const isHi = language === 'hi';

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 text-slate-950 px-3.5 py-2 text-xs font-black shadow-2xl animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>
        {isHi 
          ? 'ऑफलाइन मोड — इंटरनेट उपलब्ध नहीं है। कैश्ड डेटा व जीवन रक्षक गाइड सक्रिय हैं।' 
          : 'Offline Mode — Cached flood data & offline survival guide active.'}
      </span>
    </div>
  );
};
