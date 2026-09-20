import React, { useState, useEffect, useCallback } from 'react';
import { 
  Waves, 
  AlertTriangle, 
  Search, 
  Filter, 
  LifeBuoy, 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Info,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Header } from './components/Header';
import { FlashAlertBanner } from './components/FlashAlertBanner';
import { MetricsOverview } from './components/MetricsOverview';
import { RiverStationCard } from './components/RiverStationCard';
import { StationDetailModal } from './components/StationDetailModal';
import { AlertsSection } from './components/AlertsSection';
import { ReliefCampsSection } from './components/ReliefCampsSection';
import { InteractiveMap } from './components/InteractiveMap';
import { SOSDistressForm } from './components/SOSDistressForm';
import { AIAdvisoryChat } from './components/AIAdvisoryChat';
import { EmergencySurvivalGuide } from './components/EmergencySurvivalGuide';
import { RiverStation, UrgentAlert, ReliefCamp, SOSDistressReport } from './types';
import { playGentlePing } from './utils/soundAlert';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'hi'>('hi'); // Default to Hindi for Bihar residents
  const [audioAlertEnabled, setAudioAlertEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('telemetry');

  const [stations, setStations] = useState<RiverStation[]>([]);
  const [alerts, setAlerts] = useState<UrgentAlert[]>([]);
  const [shelters, setShelters] = useState<ReliefCamp[]>([]);
  const [distressReports, setDistressReports] = useState<SOSDistressReport[]>([]);

  const [selectedStationModal, setSelectedStationModal] = useState<RiverStation | null>(null);
  const [selectedDistrictForCamps, setSelectedDistrictForCamps] = useState<string | undefined>(undefined);

  // Filters for Water Levels tab
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riverFilter, setRiverFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  const isHi = language === 'hi';

  // Fetch initial telemetry data from server
  const fetchAllData = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      const [stRes, alRes, shRes, repRes] = await Promise.all([
        fetch('/api/stations'),
        fetch('/api/alerts'),
        fetch('/api/shelters'),
        fetch('/api/sos-reports'),
      ]);

      const [stData, alData, shData, repData] = await Promise.all([
        stRes.json(),
        alRes.json(),
        shRes.json(),
        repRes.json(),
      ]);

      if (stData.stations) setStations(stData.stations);
      if (alData.alerts) setAlerts(alData.alerts);
      if (shData.shelters) setShelters(shData.shelters);
      if (repData.reports) setDistressReports(repData.reports);

      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.error('Error fetching flood data:', e);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();

    // Periodic live background poll every 45s to reflect telemetry flux
    const interval = setInterval(() => {
      fetchAllData(true);
    }, 45000);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Handle SOS submission
  const handleSubmitSOS = async (formData: Partial<SOSDistressReport>): Promise<boolean> => {
    try {
      const res = await fetch('/api/sos-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.report) {
        setDistressReports(prev => [data.report, ...prev]);
        if (audioAlertEnabled) {
          playGentlePing();
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to submit SOS report:', e);
      return false;
    }
  };

  // Switch to relief camps tab with specific district
  const handleViewCampsForDistrict = (district: string) => {
    setSelectedDistrictForCamps(district);
    setActiveTab('shelters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered station list
  const filteredStations = stations.filter(station => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'danger' && station.status !== 'danger' && station.status !== 'severe') {
        return false;
      } else if (statusFilter !== 'danger' && station.status !== statusFilter) {
        return false;
      }
    }
    if (riverFilter !== 'all' && station.river !== riverFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (station.name + station.hindiName + station.district + station.districtHindi + station.river).toLowerCase().includes(q);
      if (!matchName) return false;
    }
    return true;
  });

  const severeStationsCount = stations.filter(s => s.status === 'severe').length;
  const rivers = ['all', 'Kosi', 'Bagmati', 'Ganga', 'Gandak', 'Kamla Balan', 'Burhi Gandak', 'Mahananda'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        audioAlertEnabled={audioAlertEnabled}
        onToggleAudio={() => setAudioAlertEnabled(!audioAlertEnabled)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        severeCount={severeStationsCount}
      />

      {/* Urgent Flash Alert Banner */}
      <FlashAlertBanner
        alerts={alerts}
        language={language}
        onViewAllAlerts={() => {
          setActiveTab('alerts');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Overview Metrics Bar on all views */}
        <MetricsOverview
          stations={stations}
          language={language}
          onRefresh={() => fetchAllData(false)}
          isLoading={isLoading}
          onFilterStatus={(status) => {
            setActiveTab('telemetry');
            setStatusFilter(status);
          }}
        />

        {/* Dynamic Tab Panels */}
        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Left search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  id="search-stations-input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isHi ? 'स्टेशन, नदी या जिला खोजें (उदा. कोसी, पटना, खगड़िया)...' : 'Search station, river, or district (e.g., Kosi, Patna)...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* River and Status Selectors */}
              <div className="flex flex-wrap items-center gap-2">
                {/* River selector */}
                <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
                  <Waves className="w-3.5 h-3.5 text-blue-400" />
                  <select
                    id="river-filter-select"
                    value={riverFilter}
                    onChange={e => setRiverFilter(e.target.value)}
                    className="bg-transparent text-white focus:outline-none font-medium cursor-pointer"
                  >
                    {rivers.map(r => (
                      <option key={r} value={r} className="bg-slate-900">
                        {r === 'all' ? (isHi ? 'सभी नदियां (All Rivers)' : 'All Rivers') : r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status chips */}
                <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-2.5 py-1 rounded font-semibold transition-all ${
                      statusFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isHi ? 'सभी' : 'All'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('severe')}
                    className={`px-2.5 py-1 rounded font-semibold transition-all ${
                      statusFilter === 'severe' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-red-400'
                    }`}
                  >
                    {isHi ? 'अति गंभीर (Severe)' : 'Severe'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('danger')}
                    className={`px-2.5 py-1 rounded font-semibold transition-all ${
                      statusFilter === 'danger' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    {isHi ? 'खतरे के ऊपर' : 'Danger Mark'}
                  </button>
                </div>
              </div>
            </div>

            {/* Stations Count Banner */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                {isHi 
                  ? `दिखाए जा रहे हैं: ${filteredStations.length} में से ${stations.length} सीडब्ल्यूसी गेज स्टेशन`
                  : `Showing ${filteredStations.length} of ${stations.length} Central Water Commission Gauges`}
              </span>
              {lastSyncTime && (
                <span>
                  {isHi ? 'अंतिम डेटा सिंक:' : 'Telemetry Sync:'} {lastSyncTime}
                </span>
              )}
            </div>

            {/* Grid of Station Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStations.map(station => (
                <RiverStationCard
                  key={station.id}
                  station={station}
                  language={language}
                  onSelectStation={setSelectedStationModal}
                  onViewCamps={handleViewCampsForDistrict}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Urgent Alerts */}
        {activeTab === 'alerts' && (
          <AlertsSection alerts={alerts} language={language} />
        )}

        {/* Tab 3: Relief Camps */}
        {activeTab === 'shelters' && (
          <ReliefCampsSection
            camps={shelters}
            language={language}
            initialDistrictFilter={selectedDistrictForCamps}
          />
        )}

        {/* Tab 4: Interactive River Map */}
        {activeTab === 'map' && (
          <InteractiveMap
            stations={stations}
            language={language}
            onSelectStation={setSelectedStationModal}
          />
        )}

        {/* Tab 5: SOS Rescue Form & Community Log */}
        {activeTab === 'sos' && (
          <SOSDistressForm
            reports={distressReports}
            language={language}
            onSubmitSOS={handleSubmitSOS}
          />
        )}

        {/* Tab 6: AI Safety Advisor */}
        {activeTab === 'advisor' && (
          <AIAdvisoryChat language={language} />
        )}

        {/* Tab 7: Survival Guide & Directory */}
        {activeTab === 'guide' && (
          <EmergencySurvivalGuide language={language} />
        )}
      </main>

      {/* Hydrograph Modal for Station */}
      <StationDetailModal
        station={selectedStationModal}
        language={language}
        onClose={() => setSelectedStationModal(null)}
        onViewCamps={handleViewCampsForDistrict}
      />

      {/* Disaster Portal Footer */}
      <footer className="mt-12 bg-slate-950 border-t border-slate-800/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-950 border border-red-800/80 rounded-lg text-red-400">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200">
                {isHi ? 'बिहार बाढ़ निगरानी एवं नागरिक सुरक्षा प्रणाली' : 'Bihar Flood Watch & Resident Emergency Response System'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isHi 
                  ? 'डेटा स्रोत: केंद्रीय जल आयोग (CWC), जल संसाधन विभाग एवं बिहार राज्य आपदा प्रबंधन प्राधिकरण (BSDMA)' 
                  : 'Telemetry Grounding: Central Water Commission (CWC), Water Resources Dept & BSDMA'}
              </p>
            </div>
          </div>

          {/* Quick Helplines row in footer */}
          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="tel:1070" 
              className="bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-200 font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              {isHi ? 'आपदा नियंत्रण: 1070' : 'State Disaster Cell: 1070'}
            </a>
            <a 
              href="tel:06115253939" 
              className="bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              NDRF Bihta: 06115-253939
            </a>
            <a 
              href="tel:112" 
              className="bg-amber-950/80 hover:bg-amber-900 border border-amber-700/80 text-amber-200 font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Emergency: 112
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
