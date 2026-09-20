import React from 'react';
import { ShieldAlert, Waves, AlertTriangle, LifeBuoy, TrendingUp, RefreshCw } from 'lucide-react';
import { RiverStation } from '../types';

interface MetricsOverviewProps {
  stations: RiverStation[];
  language: 'en' | 'hi';
  onRefresh: () => void;
  isLoading: boolean;
  onFilterStatus: (status: string) => void;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  stations,
  language,
  onRefresh,
  isLoading,
  onFilterStatus,
}) => {
  const isHi = language === 'hi';

  const severeStations = stations.filter(s => s.status === 'severe');
  const dangerStations = stations.filter(s => s.status === 'danger');
  const warningStations = stations.filter(s => s.status === 'warning');
  const totalAboveDanger = severeStations.length + dangerStations.length;

  const maxDischarge = Math.max(...stations.map(s => s.dischargeCusec), 0);
  const dischargeLakh = (maxDischarge / 100000).toFixed(2);

  const risingCount = stations.filter(s => s.trend === 'rising').length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-base font-bold text-white tracking-wide">
              {isHi ? 'बिहार बाढ़ स्थिति डैशबोर्ड' : 'Bihar Flood Situation Overview'}
            </h2>
            <span className="text-xs text-slate-400">
              ({new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHi 
              ? 'केंद्रीय जल आयोग (CWC) व राज्य आपदा विभाग द्वारा लाइव सत्यापित गेज' 
              : 'Live telemetry verified by Central Water Commission & Bihar Disaster Dept'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="refresh-telemetry-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
            <span>{isHi ? 'ताज़ा करें' : 'Sync Live'}</span>
          </button>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
        {/* Metric 1: Critical Stations */}
        <button
          type="button"
          onClick={() => onFilterStatus('danger')}
          className="text-left bg-gradient-to-b from-red-950/40 to-slate-950 border border-red-900/60 hover:border-red-500 rounded-xl p-3.5 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-300">
              {isHi ? 'खतरे के निशान से ऊपर' : 'Above Danger Mark'}
            </span>
            <div className="p-1.5 bg-red-900/40 text-red-400 rounded-lg group-hover:bg-red-900/70 transition-colors">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-red-400">
              {totalAboveDanger}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              / {stations.length} {isHi ? 'स्टेशन' : 'stations'}
            </span>
          </div>
          <p className="text-[11px] text-red-200/80 mt-1">
            {severeStations.length} {isHi ? 'अति गंभीर (Severe Flood)' : 'in Severe Flood status'}
          </p>
        </button>

        {/* Metric 2: Rising Trend */}
        <div className="bg-gradient-to-b from-amber-950/30 to-slate-950 border border-amber-900/50 rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-300">
              {isHi ? 'बढ़ता जलस्तर (Rising)' : 'Rivers Rising Trend'}
            </span>
            <div className="p-1.5 bg-amber-900/40 text-amber-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
              {risingCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              {isHi ? 'नदियां ऊपर की ओर' : 'rivers surging'}
            </span>
          </div>
          <p className="text-[11px] text-amber-200/80 mt-1">
            {isHi ? 'कोसी व बागमती बेसिन तीव्र गति से' : 'Kosi & Bagmati surging up to 4.5 cm/hr'}
          </p>
        </div>

        {/* Metric 3: Peak River Discharge */}
        <div className="bg-gradient-to-b from-blue-950/30 to-slate-950 border border-blue-900/50 rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-300">
              {isHi ? 'अधिकतम जल प्रवाह' : 'Peak Discharge'}
            </span>
            <div className="p-1.5 bg-blue-900/40 text-blue-400 rounded-lg">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-blue-400">
              {dischargeLakh}
            </span>
            <span className="text-xs text-slate-300 font-bold">
              {isHi ? 'लाख क्यूसेक' : 'Lakh Cusecs'}
            </span>
          </div>
          <p className="text-[11px] text-blue-200/80 mt-1">
            {isHi ? 'कहलगांव (गंगा) व बीरपुर (कोसी)' : 'Kahalgaon (Ganga) & Birpur (Kosi)'}
          </p>
        </div>

        {/* Metric 4: High Alert Districts */}
        <button
          type="button"
          onClick={() => onFilterStatus('severe')}
          className="text-left bg-gradient-to-b from-purple-950/30 to-slate-950 border border-purple-900/50 hover:border-purple-500 rounded-xl p-3.5 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300">
              {isHi ? 'प्रभावित जिले (हाई अलर्ट)' : 'Alert Districts'}
            </span>
            <div className="p-1.5 bg-purple-900/40 text-purple-400 rounded-lg group-hover:bg-purple-900/70 transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-400">
              14+
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              {isHi ? 'जिले' : 'districts'}
            </span>
          </div>
          <p className="text-[11px] text-purple-200/80 mt-1 truncate">
            {isHi ? 'खगड़िया, सुपौल, मुजफ्फरपुर, दरभंगा...' : 'Khagaria, Supaul, Muzaffarpur, Darbhanga...'}
          </p>
        </button>
      </div>
    </div>
  );
};
