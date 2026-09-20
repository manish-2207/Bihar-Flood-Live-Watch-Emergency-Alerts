import React from 'react';
import { 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Waves, 
  ShieldAlert, 
  LifeBuoy, 
  MapPin, 
  Bot, 
  BookOpen, 
  Radio,
  CloudRain,
  Car,
  Users,
  Compass
} from 'lucide-react';
import { playUrgentAlertSound } from '../utils/soundAlert';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
  audioAlertEnabled: boolean;
  onToggleAudio: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  severeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  audioAlertEnabled,
  onToggleAudio,
  activeTab,
  onTabChange,
  severeCount,
}) => {
  const isHi = language === 'hi';

  const handleTestSiren = () => {
    playUrgentAlertSound();
  };

  const navItems = [
    { id: 'telemetry', labelEn: 'Water Levels', labelHi: 'जल स्तर व गेज', icon: Waves },
    { id: 'alerts', labelEn: 'Urgent Alerts', labelHi: 'आपात चेतावनी', icon: AlertTriangle, badge: severeCount > 0 ? severeCount : null },
    { id: 'nearby', labelEn: 'Safe Places & Maps', labelHi: 'नजदीकी आश्रय व मैप्स', icon: Compass, badge: 'Maps' },
    { id: 'barrages', labelEn: 'Inflows & Rain', labelHi: 'बराज व वर्षा', icon: CloudRain },
    { id: 'roads', labelEn: 'Roads & Bundhs', labelHi: 'सड़क व तटबंध', icon: Car },
    { id: 'family', labelEn: 'Family & Supplies', labelHi: 'लापता व राहत', icon: Users },
    { id: 'shelters', labelEn: 'Relief Camps', labelHi: 'राहत शिविर', icon: LifeBuoy },
    { id: 'map', labelEn: 'River Map', labelHi: 'नदी मानचित्र', icon: MapPin },
    { id: 'sos', labelEn: 'SOS Rescue', labelHi: 'एसओएस मदद', icon: ShieldAlert, highlight: true },
    { id: 'advisor', labelEn: 'AI Advisor', labelHi: 'एआई सलाह', icon: Bot },
    { id: 'guide', labelEn: 'Survival Guide', labelHi: 'सुरक्षा निर्देश', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top emergency quick bar */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 px-4 py-1.5 text-xs text-white border-b border-red-800/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="font-semibold tracking-wide uppercase text-red-200">
            {isHi ? 'बिहार राज्य आपदा प्रबंधन एवं सीडब्ल्यूसी लाइव निगरानी' : 'Bihar State Disaster Monitoring & CWC Live Telemetry'}
          </span>
          <span className="hidden sm:inline-block text-slate-300">|</span>
          <span className="hidden sm:inline-block text-amber-200">
            {isHi ? 'कोसी, बागमती, गंडक व गंगा जलस्तर हाई अलर्ट पर' : 'Kosi, Bagmati, Gandak & Ganga on High Flood Watch'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="tel:1070" 
            id="call-bsdma-header"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-2.5 py-0.5 rounded font-bold shadow transition-colors"
            title="State Emergency Operation Centre Patna"
          >
            <PhoneCall className="w-3 h-3 animate-bounce" />
            <span>{isHi ? 'आपदा 1070' : 'Disaster 1070'}</span>
          </a>
          <a 
            href="tel:112" 
            id="call-112-header"
            className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-2 py-0.5 rounded font-bold transition-colors"
          >
            <PhoneCall className="w-3 h-3" />
            <span>112</span>
          </a>
          <a 
            href="tel:06115253939" 
            id="call-ndrf-header"
            className="hidden md:flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-[11px] transition-colors"
          >
            <span>NDRF: 06115-253939</span>
          </a>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-950 border border-red-700/80 rounded-xl shadow-inner text-red-400">
                <Waves className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                    {isHi ? 'बिहार बाढ़ लाइव वॉच' : 'Bihar Flood Live Watch'}
                  </h1>
                  <span className="bg-red-900/60 text-red-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-red-700/60 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isHi 
                    ? 'सीडब्ल्यूसी गेज स्टेशन, खतरे के निशान व तत्काल नागरिक सुरक्षा चेतावनी' 
                    : 'Real-time river levels, danger mark telemetry & urgent resident safety alerts'}
                </p>
              </div>
            </div>

            {/* Mobile utilities toggle */}
            <div className="flex md:hidden items-center gap-1.5">
              <PWAInstallButton language={language} />
              <button
                type="button"
                id="toggle-lang-mobile"
                onClick={() => onLanguageChange(isHi ? 'en' : 'hi')}
                className="px-2 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
              >
                {isHi ? 'En' : 'हिं'}
              </button>
              <button
                type="button"
                id="toggle-audio-mobile"
                onClick={onToggleAudio}
                className={`p-1.5 rounded border ${
                  audioAlertEnabled 
                    ? 'bg-amber-900/50 border-amber-600 text-amber-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Toggle Emergency Audio Alert"
              >
                {audioAlertEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Controls: Audio Siren, Language switcher, PWA Install */}
          <div className="hidden md:flex items-center gap-3 self-end md:self-center">
            {/* PWA Install Button */}
            <PWAInstallButton language={language} />

            {/* Siren audio control */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                id="toggle-audio-desktop"
                onClick={onToggleAudio}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded transition-all ${
                  audioAlertEnabled 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={audioAlertEnabled ? 'Audio alerts active' : 'Audio alerts muted'}
              >
                {audioAlertEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>{isHi ? 'सायरन अलर्ट चालू' : 'Alert Siren ON'}</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isHi ? 'साउंड म्यूट' : 'Sound Muted'}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                id="test-siren-btn"
                onClick={handleTestSiren}
                className="text-[11px] text-slate-400 hover:text-amber-300 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                title="Test emergency siren beep"
              >
                {isHi ? 'परीक्षण' : 'Test'}
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                id="lang-en-btn"
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1.5 rounded font-medium transition-all ${
                  !isHi 
                    ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                id="lang-hi-btn"
                onClick={() => onLanguageChange('hi')}
                className={`px-3 py-1.5 rounded font-medium transition-all ${
                  isHi 
                    ? 'bg-red-600 text-white font-semibold shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>

        {/* Tab navigation bar */}
        <nav className="flex items-center gap-1 overflow-x-auto pt-3 pb-1 mt-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? item.highlight
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 border border-red-500'
                      : 'bg-slate-800 text-white border border-slate-700 shadow-md'
                    : item.highlight
                    ? 'bg-red-950/70 text-red-300 hover:bg-red-900/80 border border-red-800/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-red-400' : 'text-slate-400'}`} />
                <span>{isHi ? item.labelHi : item.labelEn}</span>
                {item.badge && (
                  <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
