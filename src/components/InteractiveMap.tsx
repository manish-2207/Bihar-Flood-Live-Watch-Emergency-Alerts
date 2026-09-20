import React, { useState } from 'react';
import { MapPin, Waves, AlertTriangle, ShieldCheck, Eye, Layers, Compass } from 'lucide-react';
import { RiverStation } from '../types';

interface InteractiveMapProps {
  stations: RiverStation[];
  language: 'en' | 'hi';
  onSelectStation: (station: RiverStation) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stations,
  language,
  onSelectStation,
}) => {
  const [activeStation, setActiveStation] = useState<RiverStation | null>(null);
  const [filterRiver, setFilterRiver] = useState<string>('all');

  const isHi = language === 'hi';

  // Coordinate projection for Bihar bounds:
  // Lat: ~24.5 to 27.5 N (height ~ 3 deg)
  // Lng: ~83.3 to 88.3 E (width ~ 5 deg)
  const mapW = 900;
  const mapH = 540;
  const minLng = 83.3;
  const maxLng = 88.5;
  const minLat = 24.5;
  const maxLat = 27.6;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * (mapW - 100) + 50;
    // Invert Y because latitude goes North up
    const y = mapH - (((lat - minLat) / (maxLat - minLat)) * (mapH - 80) + 40);
    return { x, y };
  };

  const rivers = ['all', 'Ganga', 'Kosi', 'Gandak', 'Bagmati', 'Kamla Balan', 'Burhi Gandak', 'Mahananda'];

  const filteredStations = stations.filter(s => {
    if (filterRiver !== 'all' && s.river !== filterRiver) return false;
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Map Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              {isHi ? 'बिहार नदी तंत्र एवं स्टेशन स्थानिक मानचित्र' : 'Bihar River Basin & Gauge Telemetry Map'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHi 
              ? 'प्रमुख बाढ़ प्रभावित नदियों (कोसी, बागमती, गंडक, गंगा) के लाइव गेज का दृश्य' 
              : 'Spatial monitoring pins across Bihar river systems. Click any station pin to view details.'}
          </p>
        </div>

        {/* River Filter */}
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <select
            id="map-river-filter"
            value={filterRiver}
            onChange={e => setFilterRiver(e.target.value)}
            className="bg-slate-950 text-xs text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 capitalize"
          >
            {rivers.map(r => (
              <option key={r} value={r}>
                {r === 'all' ? (isHi ? 'सभी नदियां (All Rivers)' : 'All Rivers') : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 overflow-hidden">
        {/* Spatial background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>

        <svg 
          viewBox={`0 0 ${mapW} ${mapH}`} 
          className="w-full h-auto max-h-[560px] select-none"
        >
          {/* Bihar State Outline Schematic */}
          <path
            d="M 60,110 L 220,70 L 390,60 L 580,75 L 750,90 L 860,190 L 840,340 L 780,440 L 620,490 L 420,470 L 230,490 L 110,430 L 70,300 Z"
            fill="#0f172a"
            fillOpacity="0.4"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* District Labels subtle */}
          <text x="180" y="115" fill="#475569" fontSize="11" fontWeight="bold">West Champaran</text>
          <text x="210" y="240" fill="#475569" fontSize="11" fontWeight="bold">Gopalganj</text>
          <text x="370" y="225" fill="#475569" fontSize="11" fontWeight="bold">Muzaffarpur</text>
          <text x="460" y="210" fill="#475569" fontSize="11" fontWeight="bold">Darbhanga</text>
          <text x="560" y="180" fill="#475569" fontSize="11" fontWeight="bold">Supaul</text>
          <text x="600" y="250" fill="#475569" fontSize="11" fontWeight="bold">Saharsa</text>
          <text x="330" y="325" fill="#475569" fontSize="11" fontWeight="bold">Patna (Ganga)</text>
          <text x="600" y="340" fill="#475569" fontSize="11" fontWeight="bold">Khagaria</text>
          <text x="730" y="360" fill="#475569" fontSize="11" fontWeight="bold">Bhagalpur</text>
          <text x="780" y="260" fill="#475569" fontSize="11" fontWeight="bold">Purnia / Seemanchal</text>

          {/* River Paths (Vector simulation of Bihar hydrography) */}

          {/* 1. Ganga River (West to East) */}
          <path
            d="M 60,330 Q 200,310 320,320 T 480,335 T 620,345 T 750,370 T 880,380"
            fill="none"
            stroke="#0284c7"
            strokeWidth="5"
            strokeLinecap="round"
            className="opacity-70"
          />
          <text x="120" y="345" fill="#38bdf8" fontSize="11" fontWeight="bold">GANGA RIVER</text>

          {/* 2. Kosi River (North to South-East) */}
          <path
            d="M 590,70 Q 580,140 600,210 T 630,290 T 650,340 T 730,370"
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-80"
          />
          <text x="615" y="110" fill="#f87171" fontSize="11" fontWeight="bold">KOSI RIVER</text>

          {/* 3. Gandak River (North-West to Ganga) */}
          <path
            d="M 170,80 Q 210,170 240,240 T 310,310 T 340,325"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="opacity-70"
          />
          <text x="180" y="150" fill="#fbbf24" fontSize="10" fontWeight="bold">GANDAK</text>

          {/* 4. Bagmati River */}
          <path
            d="M 360,75 Q 380,150 400,210 T 470,270 T 540,320"
            fill="none"
            stroke="#dc2626"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="opacity-85"
          />
          <text x="395" y="140" fill="#fca5a5" fontSize="10" fontWeight="bold">BAGMATI</text>

          {/* 5. Kamla Balan */}
          <path
            d="M 480,75 Q 500,140 515,200 T 535,270"
            fill="none"
            stroke="#ec4899"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-80"
          />

          {/* 6. Burhi Gandak */}
          <path
            d="M 280,100 Q 320,180 370,230 T 480,300 T 600,340"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-70"
          />

          {/* Station Pins */}
          {filteredStations.map(station => {
            const { x, y } = project(station.coordinates.lat, station.coordinates.lng);
            const isSevere = station.status === 'severe';
            const isDanger = station.status === 'danger';
            const isWarning = station.status === 'warning';

            const pinColor = isSevere ? '#ef4444' : isDanger ? '#f43f5e' : isWarning ? '#f59e0b' : '#10b981';

            return (
              <g 
                key={station.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => {
                  setActiveStation(station);
                  onSelectStation(station);
                }}
                onMouseEnter={() => setActiveStation(station)}
              >
                {/* Radar ripple for severe alerts */}
                {isSevere && (
                  <circle
                    cx={x}
                    cy={y}
                    r="16"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    className="animate-ping origin-center"
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                )}

                {/* Pin outer aura */}
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={pinColor}
                  fillOpacity="0.25"
                />

                {/* Pin center point */}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={pinColor}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Station label */}
                <text
                  x={x}
                  y={y - 10}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow-md"
                >
                  {station.name.split(' at ')[1] || station.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Station Floating Card */}
        {activeStation && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3.5 shadow-2xl z-20">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  {activeStation.river}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  {activeStation.name}
                </h4>
                <p className="text-xs text-slate-400">{activeStation.district} District</p>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                activeStation.status === 'severe' 
                  ? 'bg-red-950 text-red-300 border-red-600' 
                  : activeStation.status === 'danger'
                  ? 'bg-rose-950 text-rose-300 border-rose-600'
                  : 'bg-amber-950 text-amber-300 border-amber-600'
              }`}>
                {activeStation.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">{isHi ? 'वर्तमान' : 'Current'}</span>
                <span className="font-bold text-white text-base">{activeStation.currentLevel.toFixed(2)}m</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">{isHi ? 'खतरा (DL)' : 'Danger Mark'}</span>
                <span className="font-bold text-rose-300 text-base">{activeStation.dangerLevel.toFixed(2)}m</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectStation(activeStation)}
              className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isHi ? 'पूर्ण 24h जल ग्राफ देखें' : 'View Full 24h Hydrograph'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-slate-300">{isHi ? 'संकेत (Legend):' : 'Status Guide:'}</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-red-400 font-medium">{isHi ? 'अति गंभीर (Severe +1m DL)' : 'Severe Flood (+1m DL)'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-rose-400 font-medium">{isHi ? 'खतरे के ऊपर (Above Danger)' : 'Above Danger Mark'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-amber-400 font-medium">{isHi ? 'चेतावनी स्तर (Warning)' : 'Above Warning'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-400 font-medium">{isHi ? 'सामान्य (Normal)' : 'Normal Flow'}</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-500">
          Source: CWC Flood Forecast Division, Patna
        </span>
      </div>
    </div>
  );
};
