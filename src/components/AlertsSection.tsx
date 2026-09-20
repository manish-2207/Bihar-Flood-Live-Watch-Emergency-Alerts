import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Share2, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Search,
  Filter,
  PhoneCall
} from 'lucide-react';
import { UrgentAlert } from '../types';

interface AlertsSectionProps {
  alerts: UrgentAlert[];
  language: 'en' | 'hi';
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts, language }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchDistrict, setSearchDistrict] = useState<string>('');

  const isHi = language === 'hi';

  const filteredAlerts = alerts.filter(alert => {
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) {
      return false;
    }
    if (searchDistrict.trim()) {
      const q = searchDistrict.toLowerCase();
      const matchDistrict = alert.districtsAffected.some(d => d.toLowerCase().includes(q));
      const matchRiver = alert.river.toLowerCase().includes(q);
      const matchTitle = (alert.title + alert.titleHi).toLowerCase().includes(q);
      if (!matchDistrict && !matchRiver && !matchTitle) return false;
    }
    return true;
  });

  const handleCopyAlert = (alert: UrgentAlert) => {
    const textToCopy = `🚨 ${isHi ? alert.titleHi : alert.title}
📍 River Basin: ${alert.river} | Districts: ${alert.districtsAffected.join(', ')}
⚠️ Action Required: ${isHi ? alert.actionRequiredHi : alert.actionRequired}
📞 Bihar Disaster Helpline: 1070 | NDRF Bihta: 06115-253939`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(alert.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWhatsAppShare = (alert: UrgentAlert) => {
    const textToShare = `🚨 *${isHi ? alert.titleHi : alert.title}*
📍 River: ${alert.river}
🏘️ Districts: ${alert.districtsAffected.join(', ')}
⚠️ *MANDATORY ACTION:* ${isHi ? alert.actionRequiredHi : alert.actionRequired}
📞 Emergency Disaster Control: 1070 | Police: 112
Verified on Bihar Flood Live Watch`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="text-lg font-bold text-white">
              {isHi ? 'तात्कालिक सुरक्षा व बाढ़ चेतावनी बुलेटिन' : 'Urgent Safety Bulletins & Flood Directives'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isHi 
              ? 'आपदा प्रबंधन विभाग, बिहार सरकार द्वारा जारी आधिकारिक सुरक्षा निर्देश' 
              : 'Official evacuations, breach alerts & warnings issued for riverine communities'}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="search-alert-district"
              value={searchDistrict}
              onChange={e => setSearchDistrict(e.target.value)}
              placeholder={isHi ? 'जिला या नदी खोजें...' : 'Filter district or river...'}
              className="bg-slate-950 text-xs text-white pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-red-500 w-48"
            />
          </div>

          {/* Severity selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setSelectedSeverity('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedSeverity === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isHi ? 'सभी' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedSeverity('critical')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedSeverity === 'critical' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-red-400'
              }`}
            >
              {isHi ? 'गंभीर (Critical)' : 'Critical'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedSeverity('high')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedSeverity === 'high' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              {isHi ? 'उच्च (High)' : 'High'}
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-semibold">
              {isHi ? 'कोई मेल खाती चेतावनी नहीं मिली' : 'No matching safety bulletins found'}
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'critical';
            return (
              <div
                key={alert.id}
                className={`bg-slate-900 border rounded-xl overflow-hidden shadow-lg transition-all ${
                  isCritical 
                    ? 'border-red-600/80 shadow-red-950/30' 
                    : 'border-amber-700/60 shadow-amber-950/20'
                }`}
              >
                {/* Alert title bar */}
                <div className={`p-4 ${
                  isCritical ? 'bg-gradient-to-r from-red-950/80 to-slate-900' : 'bg-gradient-to-r from-amber-950/70 to-slate-900'
                } border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isCritical ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-600 text-white'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                          isCritical ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950 font-bold'
                        }`}>
                          {isCritical 
                            ? (isHi ? 'रेड अलर्ट (RED ALERT)' : 'CRITICAL RED ALERT') 
                            : (isHi ? 'हाई वार्निंग' : 'HIGH WARNING')}
                        </span>
                        <span className="text-xs font-semibold text-slate-300">
                          {alert.river} Basin
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          {alert.issuedAt}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                        {isHi ? alert.titleHi : alert.title}
                      </h3>
                    </div>
                  </div>

                  {/* Share & Call options */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppShare(alert)}
                      className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                      title="Share warning to WhatsApp"
                    >
                      <Share2 className="w-3 h-3" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyAlert(alert)}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
                      title="Copy alert text"
                    >
                      {copiedId === alert.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">{isHi ? 'कॉपी हुआ' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="hidden sm:inline">{isHi ? 'कॉपी' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                    <a
                      href="tel:1070"
                      className="flex items-center gap-1 bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                      title="Call Disaster Helpline"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span className="hidden sm:inline">1070</span>
                    </a>
                  </div>
                </div>

                {/* Alert content */}
                <div className="p-4 sm:p-5 space-y-3">
                  {/* Detailed message */}
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {isHi ? alert.messageHi : alert.message}
                  </p>

                  {/* Mandatory action box */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-red-900/60 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-black uppercase text-amber-400 tracking-wide block">
                        {isHi ? 'अनिवार्य नागरिक कार्रवाई (MANDATORY DIRECTIVE):' : 'IMMEDIATE RESIDENT ACTION REQUIRED:'}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                        {isHi ? alert.actionRequiredHi : alert.actionRequired}
                      </p>
                    </div>
                  </div>

                  {/* Affected districts tag row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {isHi ? 'प्रभावित जिले:' : 'Affected Districts:'}
                    </span>
                    {alert.districtsAffected.map(district => (
                      <span
                        key={district}
                        className="bg-slate-800 text-slate-200 border border-slate-700 text-xs px-2 py-0.5 rounded-md font-medium"
                      >
                        {district}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
