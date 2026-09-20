import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  MapPin, 
  Droplets, 
  LineChart, 
  LifeBuoy,
  ShieldCheck,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  Tooltip,
  YAxis,
  XAxis
} from 'recharts';
import { RiverStation } from '../types';

interface RiverStationCardProps {
  station: RiverStation;
  language: 'en' | 'hi';
  onSelectStation: (station: RiverStation) => void;
  onViewCamps: (district: string) => void;
}

interface SparklineTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  dangerLevel: number;
  isHi: boolean;
}

const SparklineTooltip: React.FC<SparklineTooltipProps> = ({
  active,
  payload,
  label,
  dangerLevel,
}) => {
  if (active && payload && payload.length) {
    const val = Number(payload[0].value);
    const diff = val - dangerLevel;
    const isAbove = diff >= 0;
    return (
      <div className="bg-slate-950/95 border border-slate-700/90 px-2 py-1 rounded shadow-xl text-[11px] backdrop-blur-sm pointer-events-none">
        <div className="text-slate-400 text-[10px] font-mono">{label}</div>
        <div className="flex items-center gap-1 font-bold">
          <span className={isAbove ? 'text-red-400' : 'text-slate-200'}>
            {val.toFixed(2)} m
          </span>
          <span className={`text-[10px] ${isAbove ? 'text-red-400' : 'text-emerald-400'}`}>
            ({isAbove ? `+${diff.toFixed(2)}m` : `${diff.toFixed(2)}m`})
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const RiverStationCard: React.FC<RiverStationCardProps> = ({
  station,
  language,
  onSelectStation,
  onViewCamps,
}) => {
  const isHi = language === 'hi';

  const diffFromDanger = station.currentLevel - station.dangerLevel;
  const isAboveDanger = diffFromDanger >= 0;
  const isSevere = station.status === 'severe';

  // Compute gauge percentage for visual water gauge meter
  // Gauge spans from (warningLevel - 1.5m) to (highestFloodLevel + 0.5m)
  const minGauge = Math.min(station.warningLevel - 1.5, station.currentLevel - 0.5);
  const maxGauge = Math.max(station.highestFloodLevel + 0.5, station.currentLevel + 0.5);
  const range = maxGauge - minGauge;
  const currentPercent = Math.min(Math.max(((station.currentLevel - minGauge) / range) * 100, 5), 100);
  const dangerPercent = Math.min(Math.max(((station.dangerLevel - minGauge) / range) * 100, 5), 100);
  const warningPercent = Math.min(Math.max(((station.warningLevel - minGauge) / range) * 100, 5), 100);

  // Status colors & labels
  const getStatusBadge = () => {
    switch (station.status) {
      case 'severe':
        return {
          bg: 'bg-red-950/90 text-red-300 border-red-600',
          text: isHi ? 'अति गंभीर बाढ़' : 'Severe Flood (Critical)',
          indicator: 'bg-red-500 animate-ping',
        };
      case 'danger':
        return {
          bg: 'bg-rose-950/90 text-rose-300 border-rose-600',
          text: isHi ? 'खतरे के निशान से ऊपर' : 'Above Danger Mark',
          indicator: 'bg-rose-500 animate-pulse',
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/90 text-amber-300 border-amber-600',
          text: isHi ? 'चेतावनी स्तर के ऊपर' : 'Above Warning Level',
          indicator: 'bg-amber-500',
        };
      default:
        return {
          bg: 'bg-emerald-950/90 text-emerald-300 border-emerald-600',
          text: isHi ? 'सामान्य जल प्रवाह' : 'Normal Flow',
          indicator: 'bg-emerald-500',
        };
    }
  };

  const statusBadge = getStatusBadge();

  // Mini Sparkline Data from 24h Telemetry
  const chartData = (station.history24h && station.history24h.length > 0)
    ? station.history24h
    : [
        { time: '00:00', level: Number((station.currentLevel - (station.trend === 'rising' ? 0.35 : -0.35)).toFixed(2)) },
        { time: '04:00', level: Number((station.currentLevel - (station.trend === 'rising' ? 0.25 : -0.25)).toFixed(2)) },
        { time: '08:00', level: Number((station.currentLevel - (station.trend === 'rising' ? 0.18 : -0.18)).toFixed(2)) },
        { time: '12:00', level: Number((station.currentLevel - (station.trend === 'rising' ? 0.10 : -0.10)).toFixed(2)) },
        { time: '16:00', level: Number((station.currentLevel - (station.trend === 'rising' ? 0.04 : -0.04)).toFixed(2)) },
        { time: '20:00', level: Number(station.currentLevel.toFixed(2)) },
      ];

  const levels = chartData.map(d => d.level);
  const minVal = Math.min(...levels, station.dangerLevel);
  const maxVal = Math.max(...levels, station.dangerLevel);
  const yDomain = [
    Number((minVal - 0.15).toFixed(2)),
    Number((maxVal + 0.15).toFixed(2))
  ];

  const chartColor = isSevere
    ? '#ef4444'
    : isAboveDanger
    ? '#f43f5e'
    : station.status === 'warning'
    ? '#f59e0b'
    : '#06b6d4';

  return (
    <div className={`bg-slate-900 border rounded-xl overflow-hidden transition-all hover:shadow-xl ${
      isSevere 
        ? 'border-red-600/80 shadow-red-950/40' 
        : isAboveDanger 
        ? 'border-rose-700/60 shadow-rose-950/30' 
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Top station info bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {station.river}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="w-3 h-3 text-slate-500" />
                {station.district}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1.5 flex items-baseline gap-2">
              {station.name}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {station.hindiName}
            </p>
          </div>

          {/* Status badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge.bg} shrink-0`}>
            <span className={`w-2 h-2 rounded-full ${statusBadge.indicator}`}></span>
            <span>{statusBadge.text}</span>
          </div>
        </div>

        {/* Primary Water Level Gauge Display */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {isHi ? 'वर्तमान जलस्तर' : 'Current Level'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xl font-black ${
                isAboveDanger ? 'text-red-400' : 'text-slate-100'
              }`}>
                {station.currentLevel.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-400">m</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {isHi ? 'खतरे का निशान (DL)' : 'Danger Mark (DL)'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold text-rose-300">
                {station.dangerLevel.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-400">m</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {isHi ? 'चेतावनी स्तर (WL)' : 'Warning (WL)'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold text-amber-300">
                {station.warningLevel.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-400">m</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {isHi ? 'उच्चतम रिकॉर्ड (HFL)' : 'Record HFL'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold text-purple-300">
                {station.highestFloodLevel.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">({station.highestFloodYear})</span>
            </div>
          </div>
        </div>

        {/* Gauge Comparison Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>
              {isAboveDanger ? (
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  +{diffFromDanger.toFixed(2)}m {isHi ? 'खतरे के निशान से ऊपर' : 'Above Danger Level'}
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {Math.abs(diffFromDanger).toFixed(2)}m {isHi ? 'खतरे के निशान से नीचे' : 'Below Danger Mark'}
                </span>
              )}
            </span>
            <span className="text-slate-400 text-[10px]">
              {isHi ? 'अपडेट' : 'Synced'}: {station.lastUpdated}
            </span>
          </div>

          {/* Visual Gauge track */}
          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            {/* Warning line marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
              style={{ left: `${warningPercent}%` }}
              title={`Warning Level: ${station.warningLevel}m`}
            />
            {/* Danger line marker */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-red-500 z-10"
              style={{ left: `${dangerPercent}%` }}
              title={`Danger Level: ${station.dangerLevel}m`}
            />

            {/* Current water level fill */}
            <div 
              className={`h-full transition-all duration-700 ${
                isSevere 
                  ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-600' 
                  : isAboveDanger 
                  ? 'bg-gradient-to-r from-amber-400 to-rose-500' 
                  : 'bg-gradient-to-r from-blue-500 to-teal-400'
              }`}
              style={{ width: `${currentPercent}%` }}
            />
          </div>
          
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>{minGauge.toFixed(1)}m</span>
            <span className="text-amber-300">WL: {station.warningLevel.toFixed(1)}m</span>
            <span className="text-red-400 font-bold">DL: {station.dangerLevel.toFixed(1)}m</span>
            <span>HFL: {station.highestFloodLevel.toFixed(1)}m</span>
          </div>
        </div>
      </div>

      {/* Card Details & Quick Actions */}
      <div className="p-4 bg-slate-900/90 flex flex-col gap-3">
        {/* Trend & Discharge stats */}
        <div className="flex flex-wrap items-center justify-between text-xs gap-2">
          {/* Trend */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">{isHi ? 'प्रवृत्ति' : '24h Trend'}:</span>
            {station.trend === 'rising' ? (
              <span className="flex items-center gap-1 text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-900/50">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{isHi ? 'बढ़ रहा है' : 'Rising'} (+{station.trendRateCmPerHour} cm/h)</span>
              </span>
            ) : station.trend === 'falling' ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/50">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{isHi ? 'घट रहा है' : 'Falling'} ({station.trendRateCmPerHour} cm/h)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded">
                <Minus className="w-3.5 h-3.5" />
                <span>{isHi ? 'स्थिर' : 'Steady'}</span>
              </span>
            )}
          </div>

          {/* Discharge */}
          <div className="flex items-center gap-1 text-blue-300 font-semibold">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>{(station.dischargeCusec).toLocaleString('en-IN')} {isHi ? 'क्यूसेक' : 'cusec'}</span>
          </div>
        </div>

        {/* 24-Hour Water Level Trend Mini Sparkline Chart (Recharts) */}
        <div className="bg-slate-950/75 border border-slate-800/90 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] px-0.5">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>{isHi ? '24 घंटे का जलप्रवाह ग्राफ' : '24h Water Level Sparkline'}</span>
            </span>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 border-t-2 border-dashed border-red-500 inline-block"></span>
                <span className="text-red-400 font-semibold">DL ({station.dangerLevel.toFixed(1)}m)</span>
              </span>
              <span className="font-mono text-slate-400">
                {chartData[0]?.time} → {chartData[chartData.length - 1]?.time}
              </span>
            </div>
          </div>

          <div className="h-16 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 3, left: 3, bottom: 2 }}>
                <defs>
                  <linearGradient id={`sparkline-grad-${station.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={chartColor} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <YAxis domain={yDomain} hide />
                <XAxis dataKey="time" hide />
                <Tooltip
                  content={
                    <SparklineTooltip
                      dangerLevel={station.dangerLevel}
                      isHi={isHi}
                    />
                  }
                />
                <ReferenceLine
                  y={station.dangerLevel}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey="level"
                  stroke={chartColor}
                  strokeWidth={2}
                  fill={`url(#sparkline-grad-${station.id})`}
                  isAnimationActive={true}
                  dot={{ r: 2, fill: chartColor, strokeWidth: 0 }}
                  activeDot={{ r: 4, fill: '#ffffff', stroke: chartColor, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Embankment / Ground Report Note */}
        {station.notes && (
          <div className="text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-slate-300">
            <span className="text-amber-400 font-semibold">{isHi ? 'धरातल रिपोर्ट: ' : 'Field Report: '}</span>
            {isHi ? (station.notesHindi || station.notes) : station.notes}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSelectStation(station)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors"
          >
            <LineChart className="w-3.5 h-3.5 text-blue-400" />
            <span>{isHi ? '24h जल ग्राफ' : '24h Hydrograph'}</span>
          </button>

          <button
            type="button"
            onClick={() => onViewCamps(station.district)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/60 rounded-lg transition-colors"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
            <span>{isHi ? 'निकटतम शिविर' : 'Nearby Shelters'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
