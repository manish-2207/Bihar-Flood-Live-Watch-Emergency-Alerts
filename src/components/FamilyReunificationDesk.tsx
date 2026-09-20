import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  HeartHandshake, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MapPin, 
  Box, 
  ShieldCheck
} from 'lucide-react';
import { MissingPersonEntry, ReliefSupplyInventory } from '../types';

interface FamilyReunificationDeskProps {
  persons: MissingPersonEntry[];
  supplies: ReliefSupplyInventory[];
  language: 'en' | 'hi';
  onRegisterPerson: (entry: Partial<MissingPersonEntry>) => Promise<boolean>;
}

export const FamilyReunificationDesk: React.FC<FamilyReunificationDeskProps> = ({
  persons,
  supplies,
  language,
  onRegisterPerson,
}) => {
  const isHi = language === 'hi';
  const [activeTab, setActiveTab] = useState<'persons' | 'supplies'>('persons');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [personName, setPersonName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('Male');
  const [district, setDistrict] = useState('Khagaria');
  const [hometownVillage, setHometownVillage] = useState('');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [status, setStatus] = useState<'missing' | 'found_safe_in_camp'>('missing');
  const [currentCampLocation, setCurrentCampLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredPersons = persons.filter(p => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.personName.toLowerCase().includes(q) ||
      p.hometownVillage.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      (p.currentCampLocation && p.currentCampLocation.toLowerCase().includes(q))
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim() || !contactNumber.trim()) return;

    setIsSubmitting(true);
    const ok = await onRegisterPerson({
      personName,
      age: Number(age) || 30,
      gender,
      district,
      hometownVillage,
      lastSeenLocation,
      status,
      currentCampLocation,
      contactNumber,
      additionalInfo
    });
    setIsSubmitting(false);

    if (ok) {
      setFeedback(isHi ? 'सूचना सफलतापूर्वक दर्ज हुई।' : 'Reunification record posted successfully.');
      setPersonName('');
      setContactNumber('');
      setHometownVillage('');
      setTimeout(() => {
        setFeedback(null);
        setShowAddModal(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              {isHi ? 'परिवार पुनर्मिलन व लापता व्यक्ति सहायता डेस्क' : 'Family Reunification & Camp Presence Board'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isHi 
              ? 'बाढ़ विस्थापित परिजनों को खोजने एवं राहत शिविरों में सुरक्षित उपस्थितियों की सूची' 
              : 'Find separated family members, check camp presence registers, and verify relief supplies'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('persons')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'persons' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isHi ? 'लापता / सुरक्षित सूची' : 'Family Board'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('supplies')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'supplies' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{isHi ? 'राहत सामग्री भंडार' : 'Relief Supplies'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isHi ? 'नाम दर्ज करें' : 'Post Person Notice'}</span>
          </button>
        </div>
      </div>

      {/* 1. Persons Board */}
      {activeTab === 'persons' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="search-missing-person"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={isHi ? 'नाम, गांव, शिविर या जिले के अनुसार खोजें...' : 'Search by person name, village, camp, or district...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersons.map(person => {
              const isFound = person.status === 'found_safe_in_camp';

              return (
                <div
                  key={person.id}
                  className={`bg-slate-900 border rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-lg ${
                    isFound ? 'border-emerald-600/70 bg-gradient-to-b from-emerald-950/15 to-slate-900' : 'border-amber-600/70'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {person.personName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {person.age} {isHi ? 'वर्ष' : 'yrs'} • {person.gender}
                        </p>
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        isFound 
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700 flex items-center gap-1' 
                          : 'bg-amber-950 text-amber-300 border-amber-700 flex items-center gap-1'
                      }`}>
                        {isFound ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            {isHi ? 'शिविर में सुरक्षित' : 'Safe in Camp'}
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            {isHi ? 'लापता / खोज जारी' : 'Searching'}
                          </>
                        )}
                      </span>
                    </div>

                    {/* Location detail */}
                    <div className="mt-3.5 space-y-1.5 text-xs">
                      <div className="flex items-start gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span><strong>{isHi ? 'मूल गांव:' : 'Hometown:'}</strong> {person.hometownVillage}, {person.district}</span>
                      </div>

                      {person.currentCampLocation && (
                        <div className="p-2 bg-slate-950 rounded-lg border border-emerald-900/60 text-emerald-300 text-xs">
                          <strong>{isHi ? 'वर्तमान शिविर:' : 'Current Camp:'}</strong> {person.currentCampLocation}
                        </div>
                      )}

                      {person.additionalInfo && (
                        <p className="text-slate-400 text-xs italic mt-2">
                          "{person.additionalInfo}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <a
                      href={`tel:${person.contactNumber}`}
                      className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{isHi ? 'संपर्क:' : 'Call:'} {person.contactNumber}</span>
                    </a>
                    <span className="text-[10px] text-slate-500">{person.reportedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Relief Supplies View */}
      {activeTab === 'supplies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supplies.map(inv => (
            <div key={inv.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">
                  {inv.district} {isHi ? 'जिला राहत सामग्री वितरण स्थिति' : 'District Relief Inventory'}
                </h3>
                <span className="text-[10px] text-slate-400">{inv.lastUpdated}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">{isHi ? 'सूखा राशन पैकेट' : 'Dry Ration Kits'}</span>
                  <span className="text-lg font-black text-amber-400">{inv.dryRationKits.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">{isHi ? 'क्लोरीन गोलियां (Water)' : 'Halazone Tablets'}</span>
                  <span className="text-lg font-black text-blue-400">{inv.chlorineHalazoneTablets.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">{isHi ? 'शिशु आहार पैकेट' : 'Baby Food Kits'}</span>
                  <span className="text-lg font-black text-pink-400">{inv.babyFoodPackets.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">{isHi ? 'ओआरएस घोल (ORS)' : 'ORS Packets'}</span>
                  <span className="text-lg font-black text-emerald-400">{inv.orsPackets.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">{isHi ? 'तिरपाल शीट' : 'Tarpaulin Sheets'}</span>
                  <span className="text-lg font-black text-purple-400">{inv.tarpaulinSheets.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-1">
              {isHi ? 'लापता परिजन अथवा शिविर उपस्थिति दर्ज करें' : 'Post Missing Person or Camp Shelter Entry'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isHi ? 'यह सूचना राहत दलों एवं परिवारों को आपस में जोड़ने में मदद करती है।' : 'Shared across emergency camps and district disaster control desks.'}
            </p>

            {feedback && (
              <div className="mb-4 p-3 bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? 'व्यक्ति का पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={personName}
                    onChange={e => setPersonName(e.target.value)}
                    placeholder={isHi ? 'नाम लिखें' : 'Enter name'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? 'उम्र (Age)' : 'Age'}
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="35"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? 'लिंग' : 'Gender'}
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Female">Female (महिला)</option>
                    <option value="Child">Child (बच्चा)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? 'स्थिति *' : 'Status *'}
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="missing">{isHi ? 'लापता / संपर्क नहीं हो रहा' : 'Missing / Unreachable'}</option>
                    <option value="found_safe_in_camp">{isHi ? 'शिविर में सुरक्षित हैं' : 'Safe in Relief Camp'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? 'जिला *' : 'District *'}
                  </label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                    {isHi ? 'गांव / टोला *' : 'Village / Ward *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={hometownVillage}
                    onChange={e => setHometownVillage(e.target.value)}
                    placeholder={isHi ? 'उदा. बलतारा दियारा' : 'e.g. Baltara Ward 4'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isHi ? 'संपर्क फोन नंबर *' : 'Contact Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {status === 'found_safe_in_camp' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHi ? 'शिविर का नाम व बेड संख्या' : 'Relief Camp Name & Bed #'}
                  </label>
                  <input
                    type="text"
                    value={currentCampLocation}
                    onChange={e => setCurrentCampLocation(e.target.value)}
                    placeholder={isHi ? 'उदा. खेल परिसर खगड़िया, कमरा 4' : 'e.g. District Sports Shelter Khagaria'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isHi ? 'पहचान चिन्ह या विशेष विवरण' : 'Clothing / Identification / Notes'}
                </label>
                <textarea
                  rows={2}
                  value={additionalInfo}
                  onChange={e => setAdditionalInfo(e.target.value)}
                  placeholder={isHi ? 'कपड़ों का रंग, साथ में कोई बच्चा है...' : 'Clothing color, traveling companions...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow"
                >
                  {isSubmitting ? (isHi ? 'दर्ज हो रहा है...' : 'Saving...') : (isHi ? 'विवरण दर्ज करें' : 'Submit Entry')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
