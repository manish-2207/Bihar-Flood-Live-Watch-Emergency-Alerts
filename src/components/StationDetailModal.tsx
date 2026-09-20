import React from 'react';
import { X, AlertTriangle, TrendingUp, TrendingDown, MapPin, Waves, LifeBuoy, PhoneCall } from 'lucide-react';
import { RiverStation } from '../types';

interface StationDetailModalProps {
  station: RiverStation | null;
  language: 'en' | 'hi';
  onClose: () => void;
  onViewCamps: (district: string) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  language,
  onClose,
  onViewCamps,
}) => {
  if (!station) return null;
  const isHi = language === 'hi';

  const diffFromDanger = station.currentLevel - station.dangerLevel;
  const isAboveDanger = diffFromDanger >= 0;

  // Calculate SVG dimensions for the 24h Hydrograph
  const history = station.history24h || [];
  const minVal = Math.min(...history.map(h => h.level), station.warningLevel - 0.5);
  const maxVal = Math.max(...history.map(h => h.level), station.dangerLevel + 0.5);
  const range = maxVal - minVal || 1;

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 30;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  // Build points
  const points = history.map((item, index) => {
    const x = paddingX + (index / (history.length - 1 || 1)) * chartW;
    const y = paddingY + chartH - ((item.level - minVal) / range) * chartH;
    return { x, y, ...item };
  });

  const pathD = points.length > 0 
    ? points.reduce((acc, pt, i) => i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`, '')
    : '';

  // Danger Level line Y
  const dangerY = paddingY + chartH - ((station.dangerLevel - minVal) / range) * chartH;
  // Warning Level line Y
  const warningY = paddingY + chartH - ((station.warningLevel - minVal) / range) * chartH;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                {station.river}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                {station.district} District
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
              {station.name} ({station.hindiName})
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Key Gauge Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">{isHi ? 'वर्तमान स्तर' : 'Current Level'}</span>
              <div className="text-2xl font-black text-white mt-1">
                {station.currentLevel.toFixed(2)} <span className="text-sm font-normal text-slate-400">m</span>
              </div>
              <span className={`text-xs font-bold block mt-0.5 ${isAboveDanger ? 'text-red-400' : 'text-emerald-400'}`}>
                {isAboveDanger ? `+${diffFromDanger.toFixed(2)}m DL` : `${diffFromDanger.toFixed(2)}m DL`}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">{isHi ? 'खतरे का स्तर' : 'Danger Level'}</span>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {station.dangerLevel.toFixed(2)} <span className="text-sm font-normal text-slate-400">m</span>
              </div>
              <span className="text-xs text-slate-400 block mt-0.5">Warning: {station.warningLevel.toFixed(2)}m</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">{isHi ? '24h बहाव गति' : 'Trend Rate'}</span>
              <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1">
                {station.trend === 'rising' ? <TrendingUp className="w-5 h-5 text-red-400" /> : <TrendingDown className="w-5 h-5 text-emerald-400" />}
                <span>{station.trendRateCmPerHour}</span>
                <span className="text-xs font-normal text-slate-400">cm/h</span>
              </div>
              <span className="text-xs text-slate-400 capitalize block mt-0.5">{station.trend}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">{isHi ? 'डिस्चार्ज दर' : 'Discharge'}</span>
              <div className="text-xl font-black text-blue-400 mt-1">
                {(station.dischargeCusec / 1000).toFixed(1)}k
              </div>
              <span className="text-xs text-slate-400 block mt-0.5">{isHi ? 'क्यूसेक प्रवाह' : 'cusecs'}</span>
            </div>
          </div>

          {/* 24-Hour Hydrograph (Chart) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Waves className="w-4 h-4 text-blue-400" />
                  <span>{isHi ? '24 घंटे का हाइड्रो-ग्राफ (जलस्तर वक्र)' : '24-Hour Hydrograph Curve (Water Level Trend)'}</span>
                </h4>
                <p className="text-xs text-slate-400">
                  {isHi ? 'पिछले 24 घंटों में जलस्तर की वृद्धि व गिरावट' : 'Progression curve over the last 24 hours (meters MSL)'}
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-red-500 inline-block"></span>
                  <span className="text-red-400">{isHi ? 'खतरा (DL)' : 'Danger Mark'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-amber-400 inline-block"></span>
                  <span className="text-amber-400">{isHi ? 'चेतावनी (WL)' : 'Warning'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-blue-400 inline-block"></span>
                  <span className="text-blue-400">{isHi ? 'जलस्तर' : 'Water Level'}</span>
                </div>
              </div>
            </div>

            {/* SVG Chart Canvas */}
            <div className="w-full overflow-x-auto">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-52 select-none"
              >
                {/* Horizontal Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#334155" strokeDasharray="3 3" />
                <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#334155" />

                {/* Danger Level Line */}
                {dangerY >= paddingY && dangerY <= svgHeight - paddingY && (
                  <g>
                    <line 
                      x1={paddingX} 
                      y1={dangerY} 
                      x2={svgWidth - paddingX} 
                      y2={dangerY} 
                      stroke="#ef4444" 
                      strokeWidth="1.5" 
                      strokeDasharray="4 2" 
                    />
                    <text x={svgWidth - paddingX + 4} y={dangerY + 3} fill="#ef4444" fontSize="10" fontWeight="bold">
                      {station.dangerLevel}m DL
                    </text>
                  </g>
                )}

                {/* Warning Level Line */}
                {warningY >= paddingY && warningY <= svgHeight - paddingY && (
                  <g>
                    <line 
                      x1={paddingX} 
                      y1={warningY} 
                      x2={svgWidth - paddingX} 
                      y2={warningY} 
                      stroke="#f59e0b" 
                      strokeWidth="1" 
                      strokeDasharray="2 2" 
                    />
                    <text x={svgWidth - paddingX + 4} y={warningY + 3} fill="#f59e0b" fontSize="9">
                      {station.warningLevel}m WL
                    </text>
                  </g>
                )}

                {/* Water Level Line Path */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {points.map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={pt.x} y={pt.y - 8} fill="#e2e8f0" fontSize="10" textAnchor="middle" fontWeight="bold">
                      {pt.level.toFixed(2)}m
                    </text>
                    <text x={pt.x} y={svgHeight - paddingY + 16} fill="#94a3b8" fontSize="10" textAnchor="middle">
                      {pt.time}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Basin & Embankment Safety Guidance */}
          <div className="bg-gradient-to-r from-red-950/40 to-slate-950 border border-red-900/50 rounded-xl p-4">
            <h4 className="text-sm font-bold text-red-300 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>{isHi ? 'स्थानीय निवासियों के लिए अनिवार्य सुरक्षा सलाह' : 'Mandatory Resident Safety Instructions'}</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                {isHi 
                  ? 'निचले दियारा और तटबंध के भीतरी गांवों से महिलाएं, बच्चे और बुजुर्ग तुरंत सुरक्षित स्थानों पर जाएं।' 
                  : 'Evacuate women, children, and elderly from riverine diara and inside-embankment areas to higher ground.'}
              </li>
              <li>
                {isHi 
                  ? 'यदि पुल या पुलिया पर 6 इंच से ज्यादा पानी बह रहा हो तो वाहन ले जाने का प्रयास न करें।' 
                  : 'Never attempt to cross flooded causeways or bridges with more than 6 inches of flowing current.'}
              </li>
              <li>
                {isHi 
                  ? 'घर में पानी घुसने पर मेन पावर स्विच बंद करें ताकि करंट न फैले।' 
                  : 'Shut off main breaker before flood waters reach domestic sockets to avert electrocution.'}
              </li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-red-900/40">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewCamps(station.district);
                }}
                className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>{isHi ? `${station.district} में राहत शिविर देखें` : `View Camps in ${station.district}`}</span>
              </button>

              <a
                href="tel:1070"
                className="flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{isHi ? 'आपदा नियंत्रण कक्ष कॉल करें (1070)' : 'Call Disaster Cell (1070)'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
