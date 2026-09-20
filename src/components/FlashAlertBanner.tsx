import React, { useState } from 'react';
import { AlertCircle, ChevronRight, X, PhoneCall, ShieldAlert } from 'lucide-react';
import { UrgentAlert } from '../types';

interface FlashAlertBannerProps {
  alerts: UrgentAlert[];
  language: 'en' | 'hi';
  onViewAllAlerts: () => void;
}

export const FlashAlertBanner: React.FC<FlashAlertBannerProps> = ({
  alerts,
  language,
  onViewAllAlerts,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const isHi = language === 'hi';

  const flashAlert = alerts.find(a => a.severity === 'critical') || alerts[0];

  if (!flashAlert || isDismissed) {
    return null;
  }

  return (
    <aside aria-label="Urgent Flash Alert" className="bg-gradient-to-r from-red-950 via-red-900/90 to-rose-950 border-b-2 border-red-500 shadow-xl relative overflow-hidden">
      {/* Background pulsing glow */}
      <div className="absolute inset-0 bg-red-600/10 pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 bg-red-600 text-white rounded-lg shadow-md shrink-0 animate-pulse">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-red-500 text-white font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded">
                {isHi ? 'तत्काल चेतावनी' : 'URGENT FLASH'}
              </span>
              <span className="text-red-200 font-semibold text-xs">
                {flashAlert.river} River Basin
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <div className="flex flex-wrap gap-1">
                {flashAlert.districtsAffected.map(district => (
                  <span 
                    key={district} 
                    className="bg-red-950/80 border border-red-700/60 text-red-200 text-[11px] px-1.5 py-0.2 rounded"
                  >
                    {district}
                  </span>
                ))}
              </div>
            </div>

            <h2 className="text-sm sm:text-base font-bold text-white mt-1">
              {isHi ? flashAlert.titleHi : flashAlert.title}
            </h2>
            <p className="text-xs text-red-100 font-medium mt-0.5 max-w-4xl line-clamp-2 sm:line-clamp-none">
              <span className="text-amber-300 font-bold">{isHi ? 'अनिवार्य निर्देश: ' : 'MANDATORY ACTION: '}</span>
              {isHi ? flashAlert.actionRequiredHi : flashAlert.actionRequired}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            id="view-all-alerts-flash-btn"
            onClick={onViewAllAlerts}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-red-950 font-bold text-xs px-3.5 py-2 rounded-lg shadow transition-colors"
          >
            <span>{isHi ? 'सभी चेतावनी देखें' : 'View Safety Alerts'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <a
            href="tel:1070"
            id="emergency-call-flash-btn"
            className="flex items-center gap-1 bg-red-700 hover:bg-red-600 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors"
            title="Call Disaster Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1070</span>
          </a>
          <button
            type="button"
            id="dismiss-flash-btn"
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-red-300 hover:text-white hover:bg-red-900/60 rounded transition-colors"
            title={isHi ? 'बंद करें' : 'Dismiss banner'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
