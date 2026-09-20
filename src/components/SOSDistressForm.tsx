import React, { useState } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Droplet, 
  Clock,
  Radio,
  HelpCircle
} from 'lucide-react';
import { SOSDistressReport } from '../types';

interface SOSDistressFormProps {
  reports: SOSDistressReport[];
  language: 'en' | 'hi';
  onSubmitSOS: (data: Partial<SOSDistressReport>) => Promise<boolean>;
}

export const SOSDistressForm: React.FC<SOSDistressFormProps> = ({
  reports,
  language,
  onSubmitSOS,
}) => {
  const isHi = language === 'hi';

  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    district: string;
    blockOrVillage: string;
    landmark: string;
    peopleCount: number;
    hasChildrenOrElderly: boolean;
    waterLevelCurrent: 'knee_level' | 'waist_level' | 'chest_level' | 'roof_top';
    urgency: 'critical_rescue' | 'food_water_needed' | 'medical_emergency' | 'safe_marked';
    notes: string;
  }>({
    name: '',
    phone: '',
    district: 'Khagaria',
    blockOrVillage: '',
    landmark: '',
    peopleCount: 4,
    hasChildrenOrElderly: true,
    waterLevelCurrent: 'waist_level',
    urgency: 'critical_rescue',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const biharDistricts = [
    'Khagaria',
    'Supaul',
    'Saharsa',
    'Muzaffarpur',
    'Darbhanga',
    'Madhubani',
    'Samastipur',
    'Patna',
    'Bhagalpur',
    'Gopalganj',
    'Saran (Chhapra)',
    'Sitamarhi',
    'West Champaran',
    'East Champaran',
    'Purnia',
    'Katihar',
    'Kishanganj',
    'Vaishali'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.blockOrVillage.trim()) {
      setErrorMessage(isHi ? 'कृपया नाम, फोन नंबर और गांव/वार्ड अवश्य भरें।' : 'Please provide Name, Phone Number, and Village/Ward.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const ok = await onSubmitSOS(formData);
    setIsSubmitting(false);

    if (ok) {
      setSuccessMessage(
        isHi 
          ? 'आपका एसओएस आपात संदेश दर्ज कर लिया गया है। नजदीकी बचाव दल (NDRF/SDRF) को सूचित किया जा रहा है।' 
          : 'Your SOS Distress Call has been logged and forwarded to the local Disaster Management cell.'
      );
      setFormData({
        name: '',
        phone: '',
        district: formData.district,
        blockOrVillage: '',
        landmark: '',
        peopleCount: 2,
        hasChildrenOrElderly: false,
        waterLevelCurrent: 'knee_level',
        urgency: 'critical_rescue',
        notes: '',
      });
      setTimeout(() => setSuccessMessage(null), 7000);
    } else {
      setErrorMessage(isHi ? 'संदेश भेजने में त्रुटि। कृपया तुरंत 1070 पर कॉल करें।' : 'Failed to log request. Please call 1070 directly.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Form column */}
      <div className="lg:col-span-7 bg-slate-900 border border-red-900/60 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 bg-red-600 text-white rounded-xl shadow animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {isHi ? 'आपातकालीन एसओएस / नाव बचाव अनुरोध' : 'Emergency SOS & Boat Rescue Request'}
            </h2>
            <p className="text-xs text-slate-400">
              {isHi 
                ? 'यदि आप या आपका परिवार बाढ़ के पानी में फंसे हैं, तो तुरंत विवरण दर्ज करें।' 
                : 'For stranded families requiring urgent evacuation, motorized boat rescue, or critical supplies.'}
            </p>
          </div>
        </div>

        {/* Immediate Call Notice */}
        <div className="mt-4 p-3 bg-red-950/70 border border-red-700/80 rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-red-400 animate-bounce shrink-0" />
            <span className="text-xs text-red-200 font-semibold">
              {isHi ? 'जीवन संकट की स्थिति में सीधे कॉल करें:' : 'For critical life hazard, dial directly:'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <a href="tel:1070" className="bg-red-600 hover:bg-red-500 text-white font-black text-xs px-2.5 py-1 rounded">
              1070 (BSDMA)
            </a>
            <a href="tel:112" className="bg-amber-600 hover:bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded">
              112
            </a>
          </div>
        </div>

        {/* Status alerts */}
        {successMessage && (
          <div className="mt-4 p-3.5 bg-emerald-950 border border-emerald-600 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-3.5 bg-red-950 border border-red-600 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sos-name" className="block text-xs font-semibold text-slate-300 mb-1">
                {isHi ? 'आपका पूरा नाम *' : 'Contact Person Name *'}
              </label>
              <input
                id="sos-name"
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={isHi ? 'उदा. राम प्रवेश सिंह' : 'e.g., Ram Pravesh Singh'}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="sos-phone" className="block text-xs font-semibold text-slate-300 mb-1">
                {isHi ? 'मोबाइल नंबर (कॉल/SMS हेतु) *' : 'Active Mobile Number *'}
              </label>
              <input
                id="sos-phone"
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder={isHi ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sos-district" className="block text-xs font-semibold text-slate-300 mb-1">
                {isHi ? 'जिला चुनें *' : 'District *'}
              </label>
              <select
                id="sos-district"
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              >
                {biharDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sos-village" className="block text-xs font-semibold text-slate-300 mb-1">
                {isHi ? 'प्रखंड / पंचायत / गांव / वार्ड *' : 'Block / Village / Ward *'}
              </label>
              <input
                id="sos-village"
                type="text"
                required
                value={formData.blockOrVillage}
                onChange={e => setFormData({ ...formData, blockOrVillage: e.target.value })}
                placeholder={isHi ? 'उदा. बलतारा दियारा, वार्ड 3' : 'e.g., Baltara Diara, Ward 3'}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="sos-landmark" className="block text-xs font-semibold text-slate-300 mb-1">
              {isHi ? 'निकटतम पहचान चिन्ह / लैंडमार्क (नाव चालक हेतु)' : 'Prominent Landmark (for rescue boat navigation)'}
            </label>
            <input
              id="sos-landmark"
              type="text"
              value={formData.landmark}
              onChange={e => setFormData({ ...formData, landmark: e.target.value })}
              placeholder={isHi ? 'उदा. प्राथमिक विद्यालय के पास या पीपल का बड़ा पेड़' : 'e.g., Near Old Shiva Temple embankment or High School roof'}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="sos-people" className="block text-xs font-semibold text-slate-300 mb-1">
                {isHi ? 'फंसे हुए लोगों की संख्या' : 'People Stranded'}
              </label>
              <input
                id="sos-people"
                type="number"
                min="1"
                max="100"
                value={formData.peopleCount}
                onChange={e => setFormData({ ...formData, peopleCount: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="sos-water" className="block text-xs font-semibold text-slate-300 mb-1">
                {isHi ? 'वर्तमान जलस्तर की ऊंचाई' : 'Water Level Around'}
              </label>
              <select
                id="sos-water"
                value={formData.waterLevelCurrent}
                onChange={e => setFormData({ ...formData, waterLevelCurrent: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="knee_level">{isHi ? 'घुटने तक (Knee Level)' : 'Knee Level'}</option>
                <option value="waist_level">{isHi ? 'कमर तक (Waist Level)' : 'Waist Level'}</option>
                <option value="chest_level">{isHi ? 'छाती तक (Chest Level)' : 'Chest Level'}</option>
                <option value="roof_top">{isHi ? 'छत / पेड़ पर शरण (Rooftop / Tree)' : 'Rooftop / Tree'}</option>
              </select>
            </div>

            <div>
              <label htmlFor="sos-urgency" className="block text-xs font-semibold text-slate-300 mb-1">
                {isHi ? 'प्राथमिक आवश्यकता' : 'Primary Need'}
              </label>
              <select
                id="sos-urgency"
                value={formData.urgency}
                onChange={e => setFormData({ ...formData, urgency: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="critical_rescue">{isHi ? 'तत्काल नाव बचाव (Urgent Boat)' : 'Urgent Boat Evacuation'}</option>
                <option value="medical_emergency">{isHi ? 'चिकित्सीय आपातकाल (Medical/Injured)' : 'Medical Emergency'}</option>
                <option value="food_water_needed">{isHi ? 'भोजन व पेयजल की कमी' : 'Food & Water Needed'}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sos-vulnerable"
              checked={formData.hasChildrenOrElderly}
              onChange={e => setFormData({ ...formData, hasChildrenOrElderly: e.target.checked })}
              className="w-4 h-4 rounded text-red-600 bg-slate-950 border-slate-700 focus:ring-red-500"
            />
            <label htmlFor="sos-vulnerable" className="text-xs text-slate-300 cursor-pointer">
              {isHi ? 'शिशु, छोटे बच्चे, गर्भवती महिला अथवा वृद्धजन मौजूद हैं (Priority Rescue)' : 'Infants, pregnant women, or elderly persons present (High Priority)'}
            </label>
          </div>

          <div>
            <label htmlFor="sos-notes" className="block text-xs font-semibold text-slate-300 mb-1">
              {isHi ? 'अतिरिक्त टिप्पणी / स्थिति' : 'Additional Notes / Health Condition'}
            </label>
            <textarea
              id="sos-notes"
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder={isHi ? 'उदा. पीने का पानी समाप्त हो चुका है, मोबाइल में 10% बैटरी बची है' : 'e.g., No dry food left, low battery on phone, infant needs milk'}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
            ></textarea>
          </div>

          <button
            type="submit"
            id="submit-sos-button"
            disabled={isSubmitting}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-950 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? (isHi ? 'भेजा जा रहा है...' : 'Submitting SOS...') : (isHi ? 'एसओएस आपात सहायता अनुरोध भेजें' : 'Send Emergency Rescue Alert')}</span>
          </button>
        </form>
      </div>

      {/* Live rescue requests sidebar */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">
                {isHi ? 'लाइव बचाव व संकट सहायता कतार' : 'Live Resident Distress Log'}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {reports.length} {isHi ? 'अनुरोध दर्ज' : 'reports'}
            </span>
          </div>

          <div className="mt-3 space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {reports.map(report => {
              const isDispatched = report.status === 'dispatched';
              return (
                <div 
                  key={report.id} 
                  className={`p-3.5 rounded-xl border ${
                    isDispatched ? 'bg-blue-950/30 border-blue-800/60' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{report.name}</span>
                        <span className="text-[11px] text-slate-400">({report.district})</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{report.blockOrVillage}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      isDispatched 
                        ? 'bg-blue-900/60 text-blue-300 border-blue-700' 
                        : 'bg-amber-950/80 text-amber-300 border-amber-700'
                    }`}>
                      {isDispatched ? (isHi ? 'बचाव दल रवाना' : 'Dispatched') : (isHi ? 'प्रतीक्षारत' : 'Pending')}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-300">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{report.peopleCount} {isHi ? 'लोग' : 'people'}</span>
                      <span>•</span>
                      <span>{isHi ? 'पानी:' : 'Water:'} {report.waterLevelCurrent.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{report.submittedAt}</span>
                    </div>

                    {report.notes && (
                      <p className="mt-1.5 text-xs text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800 italic">
                        "{report.notes}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency NDRF / SDRF Desk Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5">
          <h4 className="font-bold text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>{isHi ? 'बचाव अभियान संपर्क डेस्क' : 'Rescue Operations Hotlines'}</span>
          </h4>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span>NDRF 9th Bn Bihta (Patna):</span>
              <a href="tel:06115253939" className="text-blue-400 font-bold hover:underline">06115-253939</a>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span>SDRF Bihar Control:</span>
              <a href="tel:06122545466" className="text-blue-400 font-bold hover:underline">0612-2545466</a>
            </div>
            <div className="flex justify-between py-1">
              <span>State Emergency Operations (SEOC):</span>
              <a href="tel:1070" className="text-red-400 font-bold hover:underline">1070 (Toll-Free)</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
