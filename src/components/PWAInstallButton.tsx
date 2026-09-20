import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  language: 'en' | 'hi';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const isHi = language === 'hi';

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition-all active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isHi ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{isHi ? 'iPhone में जोड़ें' : 'Add to iPhone'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white">
                  {isHi ? 'iPhone/iPad पर इंस्टॉल करें' : 'Install on iPhone / iPad'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                {isHi ? (
                  <>
                    1. सफारी ब्राउज़र के निचले बार में <strong>Share (साझा करें)</strong> बटन दबाएं।<br />
                    2. नीचे स्क्रॉल कर <strong>'Add to Home Screen' (होम स्क्रीन पर जोड़ें)</strong> चुनें।
                  </>
                ) : (
                  <>
                    1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
                    2. Scroll down and tap <strong>Add to Home Screen</strong>.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-500"
              >
                {isHi ? 'समझ गया' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback indicator button that informs users about offline-readiness
  return (
    <div 
      className="hidden sm:flex items-center gap-1.5 bg-slate-900 text-emerald-400 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-emerald-900/60"
      title="This emergency application works offline with local cached telemetry"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span>{isHi ? 'ऑफलाइन सुरक्षित' : 'PWA Offline Ready'}</span>
    </div>
  );
};
