import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Hospital, 
  Home, 
  Ship, 
  Pill, 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  Sparkles, 
  PhoneCall, 
  RefreshCw, 
  AlertCircle,
  Compass,
  CheckCircle2
} from 'lucide-react';
import Markdown from 'react-markdown';
import { MapsPlaceResult } from '../types';

interface NearbySafePlacesLocatorProps {
  language: 'en' | 'hi';
}

export const NearbySafePlacesLocator: React.FC<NearbySafePlacesLocatorProps> = ({ language }) => {
  const isHi = language === 'hi';

  const [selectedDistrict, setSelectedDistrict] = useState('Khagaria');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hospitals' | 'shelters' | 'ndrf_boats' | 'pharmacies'>('all');
  const [customSearch, setCustomSearch] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [places, setPlaces] = useState<MapsPlaceResult[]>([]);
  const [groundingSource, setGroundingSource] = useState<string>('Google Maps Grounding (Gemini 3.8 Flash)');
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  const biharDistricts = [
    { en: 'Khagaria', hi: 'खगड़िया' },
    { en: 'Supaul', hi: 'सुपौल' },
    { en: 'Saharsa', hi: 'सहरसा' },
    { en: 'Patna', hi: 'पटना' },
    { en: 'Muzaffarpur', hi: 'मुजफ्फरपुर' },
    { en: 'Darbhanga', hi: 'दरभंगा' },
    { en: 'Madhubani', hi: 'मधुबनी' },
    { en: 'Bhagalpur', hi: 'भागलपुर' },
    { en: 'Gopalganj', hi: 'गोपालगंज' },
    { en: 'Saran', hi: 'सारण (छपरा)' },
    { en: 'Samastipur', hi: 'समस्तीपुर' },
    { en: 'Katihar', hi: 'कटिहार' },
    { en: 'Purnia', hi: 'पूर्णिया' },
    { en: 'West Champaran', hi: 'पश्चिम चंपारण (बेतिया)' },
    { en: 'East Champaran', hi: 'पूर्वी चंपारण (मोतिहारी)' },
    { en: 'Sitamarhi', hi: 'सीतामढ़ी' },
    { en: 'Begusarai', hi: 'बेगूसराय' },
    { en: 'Vaishali', hi: 'वैशाली (हाजीपुर)' },
    { en: 'Munger', hi: 'मुंगेर' },
    { en: 'Bhojpur', hi: 'भोजपुर (आरा)' },
  ];

  // Request GPS location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(isHi ? 'आपके ब्राउज़र में जीपीएस समर्थित नहीं है' : 'Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationStatus(isHi ? 'जीपीएस स्थान प्राप्त किया जा रहा है...' : 'Acquiring GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
        setLocationStatus(
          isHi 
            ? `स्थान प्राप्त: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E` 
            : `GPS Locked: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`
        );
        fetchNearbyFacilities(latitude, longitude, selectedCategory, customSearch);
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        setLocationStatus(
          isHi 
            ? 'जीपीएस अनुमति नहीं मिली। जिले के आधार पर खोज की जा रही है।' 
            : 'GPS permission denied or unavailable. Falling back to selected district.'
        );
        fetchNearbyFacilities(undefined, undefined, selectedCategory, customSearch);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const fetchNearbyFacilities = async (
    lat?: number, 
    lng?: number, 
    cat: 'all' | 'hospitals' | 'shelters' | 'ndrf_boats' | 'pharmacies' = selectedCategory,
    queryOverride?: string
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/maps-nearby-shelters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryOverride || undefined,
          category: cat,
          latitude: lat ?? userLocation?.lat,
          longitude: lng ?? userLocation?.lng,
          district: selectedDistrict,
          language: isHi ? 'hi' : 'en'
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data.answer || '');
        setPlaces(data.mapsPlaces || []);
        setGroundingSource(data.source || 'Google Maps Grounding');
        setLastUpdatedTime(data.timestamp || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Error fetching nearby safe places:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyFacilities();
  }, [selectedDistrict, selectedCategory]);

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearch.trim()) return;
    fetchNearbyFacilities(userLocation?.lat, userLocation?.lng, selectedCategory, customSearch);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'hospitals':
        return <Hospital className="w-5 h-5 text-red-400" />;
      case 'shelters':
        return <Home className="w-5 h-5 text-amber-400" />;
      case 'ndrf_boats':
        return <Ship className="w-5 h-5 text-blue-400" />;
      case 'pharmacies':
        return <Pill className="w-5 h-5 text-emerald-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/70 to-slate-900 border border-blue-900/50 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Google Maps Grounding
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Gemini 3.8 Flash Verified
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isHi ? 'नजदीकी सुरक्षित आश्रय, अस्पताल व बोट घाट लोकेटर' : 'Nearby Safe Shelters, Hospitals & Rescue Boat Ghats'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isHi
                ? 'गूगल मैप्स डेटा द्वारा संचालित: बाढ़ के दौरान खुले सरकारी अस्पताल, एंटी-स्नेक वेनम केंद्र, ऊंचे राहत शिविर व एनडीआरएफ बोट पॉइंट खोजें।'
                : 'Powered by real Google Maps Grounding: Locate active hospitals with anti-snake venom, elevated community flood shelters, and NDRF motorized rescue boat posts.'}
            </p>
          </div>

          {/* Quick Stats / Action Call */}
          <div className="flex flex-row sm:flex-col items-end gap-2 shrink-0">
            <a
              href="tel:1070"
              id="emergency-dial-1070-btn"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>{isHi ? 'आपदा हेल्पलाइन 1070' : 'Emergency Desk 1070'}</span>
            </a>
            {lastUpdatedTime && (
              <span className="text-[11px] text-slate-400">
                {isHi ? `अपडेट: ${lastUpdatedTime}` : `Updated: ${lastUpdatedTime}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar: Location & District Filter */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* District Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <label htmlFor="district-select" className="text-xs font-bold text-slate-300 shrink-0">
              {isHi ? 'जिला चुनें:' : 'District:'}
            </label>
            <select
              id="district-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-950 text-white text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
            >
              {biharDistricts.map((d) => (
                <option key={d.en} value={d.en}>
                  {d.en} ({d.hi})
                </option>
              ))}
            </select>
          </div>

          {/* GPS Auto-Detect Button */}
          <div className="md:col-span-4">
            <button
              type="button"
              id="detect-gps-location-btn"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="w-full px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 text-blue-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span>
                {isLocating
                  ? isHi ? 'स्थान खोजा जा रहा है...' : 'Detecting GPS...'
                  : isHi ? 'मेरा जीपीएस स्थान उपयोग करें' : 'Use My GPS Location'}
              </span>
            </button>
          </div>

          {/* Status readout */}
          <div className="md:col-span-4 text-right">
            {locationStatus ? (
              <span className="text-xs text-blue-400 font-mono flex items-center md:justify-end gap-1">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                {locationStatus}
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                {isHi ? `डिफ़ॉल्ट निर्देशांक: ${selectedDistrict}` : `Default Center: ${selectedDistrict}`}
              </span>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-400 shrink-0">
            {isHi ? 'श्रेणी:' : 'Category:'}
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {isHi ? 'सभी सुरक्षित स्थान' : 'All Safe Places'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('hospitals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'hospitals'
                ? 'bg-red-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Hospital className="w-3.5 h-3.5" />
            {isHi ? 'अस्पताल व एंटी-वेनम' : 'Hospitals & Anti-Venom'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('shelters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'shelters'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            {isHi ? 'ऊंचे राहत शिविर' : 'High-Ground Shelters'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('ndrf_boats')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'ndrf_boats'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            {isHi ? 'बचाव नाव व एनडीआरएफ' : 'NDRF & Boat Ghats'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('pharmacies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'pharmacies'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            {isHi ? 'दवा दुकानें (24x7)' : '24x7 Pharmacies'}
          </button>
        </div>

        {/* Custom Grounded Search Box */}
        <form onSubmit={handleCustomSearchSubmit} className="flex gap-2 pt-2 border-t border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="maps-search-custom-input"
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              placeholder={
                isHi
                  ? `उदा. ${selectedDistrict} में सांप काटने के इलाज हेतु अस्पताल, या ऊंचे पक्के स्कूल खोजें...`
                  : `e.g. Find hospital with snake venom or high-ground relief shelter in ${selectedDistrict}...`
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            id="maps-search-submit-btn"
            disabled={isLoading}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0 shadow-md"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isHi ? 'मैप्स खोज' : 'Search Maps'}</span>
          </button>
        </form>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-3">
          <div className="inline-flex p-3 bg-blue-600/20 text-blue-400 rounded-full animate-pulse">
            <Compass className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {isHi
              ? 'गूगल मैप्स डेटाबेस से सुरक्षित स्थानों की लाइव जांच की जा रही है...'
              : 'Grounded query in progress: Querying Google Maps Platform for verified facilities...'}
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Model: Gemini 3.8 Flash • Retrieval: Google Maps
          </p>
        </div>
      )}

      {/* AI Grounded Advice Summary */}
      {!isLoading && aiAnalysis && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">
                {isHi ? 'आपदा प्रबंधन एवं मार्ग सुरक्षा विश्लेषण' : 'Disaster Route & Facility Access Analysis'}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {groundingSource}
            </span>
          </div>

          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 prose prose-invert max-w-none">
            <Markdown>{aiAnalysis}</Markdown>
          </div>
        </div>
      )}

      {/* Grounded Places Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              {isHi ? `सत्यापित स्थान व गूगल मैप्स नेविगेशन (${places.length})` : `Verified Facilities & Google Maps Links (${places.length})`}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {isHi ? 'सीधे नेविगेशन हेतु कार्ड पर क्लिक करें' : 'Click card to open in Google Maps'}
          </span>
        </div>

        {places.length === 0 && !isLoading ? (
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-sm text-slate-300 font-medium">
              {isHi ? 'इस श्रेणी में कोई स्थान नहीं मिला।' : 'No places found for this filter.'}
            </p>
            <p className="text-xs text-slate-500">
              {isHi ? 'कृपया "सभी सुरक्षित स्थान" चुनें अथवा अन्य जिला खोजें।' : 'Try selecting "All Safe Places" or a neighboring district.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {places.map((place, idx) => (
              <div
                key={idx}
                id={`maps-place-card-${idx}`}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-700/60 rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 group-hover:border-blue-700/40 shrink-0 mt-0.5">
                        {getCategoryIcon(place.category)}
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                          {place.title}
                        </h4>
                        {place.address && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                            <span className="line-clamp-2">{place.address}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Highlights / Review Snippets */}
                  {place.snippets && place.snippets.length > 0 && (
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 space-y-1">
                      {place.snippets.map((snippet, sIdx) => (
                        <p key={sIdx} className="text-xs text-slate-300 italic flex items-start gap-1.5">
                          <span className="text-blue-400 font-bold shrink-0">•</span>
                          <span>{snippet}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grounding URL Actions (Mandatory as per Google Maps Grounding instructions) */}
                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={place.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>{isHi ? 'गूगल मैप्स पर देखें' : 'View on Google Maps'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      place.title + ' ' + (place.address || selectedDistrict + ' Bihar')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>{isHi ? 'रास्ता देखें' : 'Get Directions'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Essential Evacuation & Safety Advisory Box */}
      <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-bold text-amber-300">
            {isHi ? 'बाढ़ के दौरान अस्पताल या राहत केंद्र जाते समय आवश्यक सावधानियां:' : 'Crucial Caution When Navigating to Relief Centers:'}
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-400">
            <li>{isHi ? 'घुटने से ऊपर बहते पानी में पैदल या दोपहिया वाहन से न जाएं; सड़क कटी हो सकती है।' : 'Do not walk or drive through floodwater deeper than knee height; roads may be eroded underneath.'}</li>
            <li>{isHi ? 'ऊंचे तटबंध या पक्की मुख्य सड़कों का ही उपयोग करें। कच्ची पगडंडियां धंस सकती हैं।' : 'Stick to established elevated embankments and paved national/state highways.'}</li>
            <li>{isHi ? 'यदि रास्ता अवरुद्ध है, तो अपनी छत पर रहें और 1070 पर कॉल कर एनडीआरएफ नाव का इंतजार करें।' : 'If trapped by submerged roads, move to your rooftop and dial 1070 for motorboat evacuation.'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
