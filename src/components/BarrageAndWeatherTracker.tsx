import React, { useState } from 'react';
import { 
  CloudRain, 
  Waves, 
  Wind, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  TrendingUp, 
  Layers, 
  Gauge
} from 'lucide-react';
import { BarrageInflow, WeatherForecastDistrict } from '../types';

interface BarrageAndWeatherTrackerProps {
  barrages: BarrageInflow[];
  forecasts: WeatherForecastDistrict[];
  language: 'en' | 'hi';
}

export const BarrageAndWeatherTracker: React.FC<BarrageAndWeatherTrackerProps> = ({
  barrages,
  forecasts,
  language,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'barrages' | 'weather'>('barrages');
  const isHi = language === 'hi';

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              {isHi ? 'नेपाल जलग्रहण बराज डिस्चार्ज एवं 48 घंटे वर्षा चेतावनी' : 'Upstream Nepal Barrage Discharge & 48h Weather Radar'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isHi 
              ? 'बीरपुर व वाल्मीकि नगर बराज से पानी का बहाव एवं मौसम विभाग (IMD) का वर्षा अलर्ट' 
              : 'Upstream inflows from Nepal border barrages and downstream flood wave arrival estimates'}
          </p>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSubTab('barrages')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'barrages' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>{isHi ? 'बराज डिस्चार्ज (Inflows)' : 'Barrages Discharge'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('weather')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'weather' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>{isHi ? 'वर्षा चेतावनी (IMD Radar)' : 'Rainfall Warnings'}</span>
          </button>
        </div>
      </div>

      {/* 1. Barrages View */}
      {activeSubTab === 'barrages' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {barrages.map(barrage => {
              const isCritical = barrage.status === 'critical';
              const isAlert = barrage.status === 'alert';

              return (
                <div
                  key={barrage.id}
                  className={`bg-slate-900 border rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xl transition-all ${
                    isCritical 
                      ? 'border-red-600/80 shadow-red-950/20' 
                      : isAlert 
                      ? 'border-amber-600/70 shadow-amber-950/20' 
                      : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          {barrage.river} Basin
                        </span>
                        <h3 className="text-base font-bold text-white mt-1.5">
                          {isHi ? barrage.nameHi : barrage.name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Compass className="w-3.5 h-3.5 text-slate-500" />
                          <span>{barrage.location}</span>
                        </p>
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                        isCritical 
                          ? 'bg-red-950 text-red-300 border-red-700 animate-pulse' 
                          : isAlert
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      }`}>
                        {barrage.status}
                      </span>
                    </div>

                    {/* Discharge metric */}
                    <div className="mt-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {isHi ? 'वर्तमान डिस्चार्ज प्रवाह' : 'Current Water Discharge'}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-white">
                          {(barrage.currentDischargeCusec / 100000).toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-red-400">
                          {isHi ? 'लाख क्यूसेक' : 'Lakh Cusecs'}
                        </span>
                      </div>

                      {/* Gate count & wave arrival */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] block">{isHi ? 'फाटक (Gates Open):' : 'Gates Open:'}</span>
                          <span className="font-bold text-amber-300">
                            {barrage.gatesOpen} / {barrage.totalGates}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">{isHi ? 'बाढ़ तरंग आगमन:' : 'Wave Arrival:'}</span>
                          <span className="font-bold text-blue-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ~{barrage.downstreamImpactHours} {isHi ? 'घंटे' : 'hrs'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Advisory block */}
                    <div className="mt-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300">
                      <p className="leading-relaxed">
                        {isHi ? barrage.advisoryHi : barrage.advisory}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{isHi ? 'डेटा स्रोत: नेपाल जल संसाधन विभाग' : 'Source: Nepal WRD & CWC'}</span>
                    <span className="text-emerald-400 font-semibold">{isHi ? 'लाइव सिंक' : 'Live Synced'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Downstream flood propagation notice */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">
                {isHi ? 'बाढ़ तरंग यात्रा समय (Flood Wave Propagation Timeline):' : 'Flood Wave Propagation Timeline:'}
              </strong>
              <span>
                {isHi
                  ? 'बीरपुर बराज से छोड़ा गया 3.4 लाख क्यूसेक पानी 6 घंटे में सुपौल (निर्मली), 10 घंटे में सहरसा (नौहट्टा), और 16-18 घंटे में खगड़िया (बलतारा) पहुंचेगा। निचले दियारा निवासी रात होने से पहले ऊंचे स्थानों पर चले जाएं।'
                  : 'Water released from Birpur Barrage takes ~6 hours to reach Supaul, ~10 hours to reach Saharsa, and ~16-18 hours to converge in Khagaria. Residents along the embankment corridor must relocate before dusk.'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Weather View */}
      {activeSubTab === 'weather' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecasts.map(fc => {
              const isRed = fc.alertLevel === 'red';
              const isOrange = fc.alertLevel === 'orange';

              return (
                <div
                  key={fc.id}
                  className={`bg-slate-900 border rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-lg ${
                    isRed ? 'border-red-600/80 bg-gradient-to-b from-red-950/20 to-slate-900' : isOrange ? 'border-amber-600/70' : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {isHi ? fc.districtHi : fc.district} {isHi ? 'जिला' : 'District'}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isHi ? 'मौसम विभाग 48 घंटे पूर्वानुमान' : 'IMD Patna 48-Hour Alert'}
                        </p>
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        isRed 
                          ? 'bg-red-600 text-white animate-pulse' 
                          : isOrange 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-yellow-500 text-slate-950 font-bold'
                      }`}>
                        {fc.alertLevel} ALERT
                      </span>
                    </div>

                    {/* Precipitation numbers */}
                    <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">{isHi ? '24h संभावित वर्षा:' : '24h Expected Rain:'}</span>
                        <span className="text-xl font-black text-blue-400 mt-0.5 block">
                          {fc.rainfallMm24h} <span className="text-xs font-normal text-slate-400">mm</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">{isHi ? 'हवा की गति:' : 'Wind Speed:'}</span>
                        <span className="text-xl font-black text-slate-200 mt-0.5 block flex items-center gap-1">
                          <Wind className="w-4 h-4 text-slate-400" />
                          {fc.windSpeedKmph} <span className="text-xs font-normal text-slate-400">km/h</span>
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                      {isHi ? fc.predictionHi : fc.prediction}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>IMD Patna Radar Synced</span>
                    <span className="text-blue-400 font-semibold">Active Warning</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
