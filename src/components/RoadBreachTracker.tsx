import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Car, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  Search,
  Filter,
  Navigation
} from 'lucide-react';
import { RoadBreachReport } from '../types';

interface RoadBreachTrackerProps {
  reports: RoadBreachReport[];
  language: 'en' | 'hi';
  onSubmitReport: (report: Partial<RoadBreachReport>) => Promise<boolean>;
}

export const RoadBreachTracker: React.FC<RoadBreachTrackerProps> = ({
  reports,
  language,
  onSubmitReport,
}) => {
  const isHi = language === 'hi';

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchDistrict, setSearchDistrict] = useState<string>('');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Form state
  const [highwayOrRoad, setHighwayOrRoad] = useState('');
  const [district, setDistrict] = useState('Khagaria');
  const [locationDetails, setLocationDetails] = useState('');
  const [waterDepthCm, setWaterDepthCm] = useState(30);
  const [status, setStatus] = useState<'closed_submerged' | 'diverted' | 'caution_open'>('diverted');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  const filteredReports = reports.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchDistrict.trim()) {
      const q = searchDistrict.toLowerCase();
      const matchDistrict = r.district.toLowerCase().includes(q);
      const matchRoad = r.highwayOrRoad.toLowerCase().includes(q);
      if (!matchDistrict && !matchRoad) return false;
    }
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!highwayOrRoad.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const ok = await onSubmitReport({
      highwayOrRoad,
      district,
      locationDetails,
      waterDepthCm,
      status,
      description,
      reportedBy: reportedBy || 'Local Resident'
    });
    setIsSubmitting(false);

    if (ok) {
      setSubmissionFeedback(isHi ? 'सड़क स्थिति रिपोर्ट सफलतापूर्वक दर्ज की गई।' : 'Road passability alert submitted successfully.');
      setHighwayOrRoad('');
      setLocationDetails('');
      setDescription('');
      setTimeout(() => {
        setSubmissionFeedback(null);
        setShowSubmitModal(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {isHi ? 'बिहार सड़क मार्ग व तटबंध स्थिति ट्रैकर' : 'Road Passability & Embankment Breach Tracker'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isHi 
              ? 'जलमग्न राष्ट्रीय राजमार्ग (NH), राज्यमार्ग (SH) व तटबंधों की स्थिति की लाइव रिपोर्ट' 
              : 'Live passability conditions of flooded highways, breached causeways, and embankment diversions'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="search-road-breach"
              value={searchDistrict}
              onChange={e => setSearchDistrict(e.target.value)}
              placeholder={isHi ? 'मार्ग या जिला खोजें...' : 'Filter highway or district...'}
              className="bg-slate-950 text-xs text-white pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 w-44"
            />
          </div>

          {/* Add Report Button */}
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isHi ? 'सड़क रुकावट दर्ज करें' : 'Report Road Issue'}</span>
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map(report => {
          const isClosed = report.status === 'closed_submerged';
          const isDiverted = report.status === 'diverted';

          return (
            <div
              key={report.id}
              className={`bg-slate-900 border rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-lg ${
                isClosed 
                  ? 'border-red-600/80' 
                  : isDiverted 
                  ? 'border-amber-600/70' 
                  : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        {report.district}
                      </span>
                      {report.verified && (
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          {isHi ? 'प्रशासन सत्यापित' : 'Verified'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {report.highwayOrRoad}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{report.locationDetails}</span>
                    </p>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shrink-0 ${
                    isClosed 
                      ? 'bg-red-950 text-red-300 border-red-700' 
                      : isDiverted 
                      ? 'bg-amber-950 text-amber-300 border-amber-700' 
                      : 'bg-yellow-950 text-yellow-300 border-yellow-700'
                  }`}>
                    {isClosed ? (isHi ? 'पूर्णतः बंद (Submerged)' : 'Closed Submerged') : isDiverted ? (isHi ? 'मार्ग डायवर्ट' : 'Diverted') : (isHi ? 'सावधानी बरतें' : 'Caution')}
                  </span>
                </div>

                {/* Depth bar if water depth > 0 */}
                {report.waterDepthCm > 0 && (
                  <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{isHi ? 'सड़क पर पानी की गहराई:' : 'Water Depth on Road:'}</span>
                    <span className="font-bold text-red-400 text-sm">
                      {report.waterDepthCm} cm ({Math.round(report.waterDepthCm / 30.48 * 10) / 10} ft)
                    </span>
                  </div>
                )}

                <p className="mt-3 text-xs text-slate-200 leading-relaxed">
                  {isHi ? report.descriptionHi : report.description}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>{isHi ? 'रिपोर्टकर्ता:' : 'Reported by:'} {report.reportedBy}</span>
                <span>{report.reportedAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">
              {isHi ? 'जलमग्न मार्ग अथवा तटबंध रिसाव दर्ज करें' : 'Report Submerged Road or Embankment Seepage'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isHi ? 'यह जानकारी अन्य वाहन चालकों व बचाव वाहनों को सुरक्षित रखने में मदद करती है।' : 'Helps rescue ambulances, food transport trucks, and residents avoid flooded traps.'}
            </p>

            {submissionFeedback && (
              <div className="mb-4 p-3 bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{submissionFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isHi ? 'सड़क / पुल / मार्ग का नाम *' : 'Highway / Road / Bridge Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={highwayOrRoad}
                  onChange={e => setHighwayOrRoad(e.target.value)}
                  placeholder={isHi ? 'उदा. NH-31, बेगूसराय-खगड़िया संपर्क' : 'e.g., NH-31 Pasraha link or SH-58 Biraul'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? 'जिला *' : 'District *'}
                  </label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Khagaria">Khagaria</option>
                    <option value="Supaul">Supaul</option>
                    <option value="Muzaffarpur">Muzaffarpur</option>
                    <option value="Darbhanga">Darbhanga</option>
                    <option value="Gopalganj">Gopalganj</option>
                    <option value="Patna">Patna</option>
                    <option value="Bhagalpur">Bhagalpur</option>
                    <option value="Saharsa">Saharsa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? 'वर्तमान मार्ग स्थिति *' : 'Road Status *'}
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="closed_submerged">{isHi ? 'पूर्णतः बंद (Closed Submerged)' : 'Closed Submerged'}</option>
                    <option value="diverted">{isHi ? 'डायवर्ट किया गया (Diverted)' : 'Diverted'}</option>
                    <option value="caution_open">{isHi ? 'धीमी गति / सावधानी (Caution)' : 'Caution Open'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? 'पानी की गहराई (सेमी)' : 'Water Depth (cm)'}
                  </label>
                  <input
                    type="number"
                    value={waterDepthCm}
                    onChange={e => setWaterDepthCm(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? 'आपका नाम / पद' : 'Your Name / Designation'}
                  </label>
                  <input
                    type="text"
                    value={reportedBy}
                    onChange={e => setReportedBy(e.target.value)}
                    placeholder={isHi ? 'स्थानीय नागरिक / मुखिया' : 'Resident / Mukhiya'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isHi ? 'विस्तृत विवरण (लैंडमार्क व वैकल्पिक मार्ग) *' : 'Details & Alternate Route *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={isHi ? 'सड़क पर 1 फीट पानी बह रहा है, छोटी गाड़ियां न ले जाएं...' : 'Water overflowing by 1 foot, small cars should avoid...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow"
                >
                  {isSubmitting ? (isHi ? 'दर्ज हो रहा है...' : 'Saving...') : (isHi ? 'रिपोर्ट सबमिट करें' : 'Submit Report')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
