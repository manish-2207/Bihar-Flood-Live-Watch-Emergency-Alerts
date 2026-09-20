import React, { useState } from 'react';
import { 
  LifeBuoy, 
  MapPin, 
  PhoneCall, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Utensils, 
  Stethoscope, 
  Droplet, 
  Ship,
  Search,
  Filter
} from 'lucide-react';
import { ReliefCamp } from '../types';

interface ReliefCampsSectionProps {
  camps: ReliefCamp[];
  language: 'en' | 'hi';
  initialDistrictFilter?: string;
}

export const ReliefCampsSection: React.FC<ReliefCampsSectionProps> = ({
  camps,
  language,
  initialDistrictFilter,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrictFilter || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isHi = language === 'hi';

  const districts = ['all', ...Array.from(new Set(camps.map(c => c.district)))];

  const filteredCamps = camps.filter(camp => {
    if (selectedDistrict !== 'all' && camp.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (camp.name + camp.nameHi + camp.block + camp.address).toLowerCase().includes(q);
      if (!matchName) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {isHi ? 'सरकारी बाढ़ राहत शिविर व आश्रय स्थल' : 'Official Flood Relief Camps & Evacuation Shelters'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isHi 
              ? 'मुफ्त भोजन, स्वच्छ पेयजल, प्राथमिक चिकित्सा एवं नाव बचाव केंद्र उपलब्ध' 
              : 'Providing free community meals, medical aid, purified water, and boat rescue depots'}
          </p>
        </div>

        {/* Filter by district and search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="search-camps"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isHi ? 'शिविर या प्रखंड खोजें...' : 'Search camp or block...'}
              className="bg-slate-950 text-xs text-white pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 w-44"
            />
          </div>

          {/* District dropdown */}
          <select
            id="district-camp-select"
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="bg-slate-950 text-xs text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 capitalize"
          >
            {districts.map(d => (
              <option key={d} value={d}>
                {d === 'all' ? (isHi ? 'सभी जिले (All Districts)' : 'All Districts') : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Camps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCamps.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
            <LifeBuoy className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-semibold">
              {isHi ? 'इस जिले में कोई राहत शिविर नहीं मिला' : 'No camps found matching this criteria'}
            </p>
          </div>
        ) : (
          filteredCamps.map(camp => {
            const occupancyRate = Math.round((camp.occupied / camp.capacity) * 100);
            const isNearCapacity = camp.status === 'near_capacity';

            return (
              <div
                key={camp.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-lg transition-all"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          {camp.district}
                        </span>
                        <span className="text-xs text-slate-400">
                          Block: {camp.block}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1.5">
                        {isHi ? camp.nameHi : camp.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{camp.address}</span>
                      </p>
                    </div>

                    {/* Status badge */}
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                      camp.status === 'open' 
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' 
                        : isNearCapacity
                        ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                        : 'bg-red-950/80 text-red-300 border-red-700'
                    }`}>
                      {camp.status === 'open' 
                        ? (isHi ? 'स्थान उपलब्ध' : 'Space Available') 
                        : isNearCapacity
                        ? (isHi ? 'लगभग भरा हुआ' : 'Near Capacity')
                        : (isHi ? 'भरा हुआ' : 'Full')}
                    </span>
                  </div>

                  {/* Occupancy bar */}
                  <div className="mt-4 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{camp.occupied}</span> / {camp.capacity} {isHi ? 'शरणार्थी' : 'residents'}
                      </span>
                      <span className="font-bold text-slate-400">
                        {occupancyRate}% {isHi ? 'भरा हुआ' : 'Occupied'}
                      </span>
                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          occupancyRate > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Facilities available */}
                  <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1.5 ${camp.foodAvailable ? 'text-emerald-300' : 'text-slate-500'}`}>
                      <Utensils className="w-3.5 h-3.5" />
                      <span>{isHi ? 'मुफ्त भोजन / लंगर' : 'Community Meals'}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${camp.medicalAid ? 'text-emerald-300' : 'text-slate-500'}`}>
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>{isHi ? 'डॉक्टर व दवाइयां' : 'Doctor & Medicine'}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${camp.cleanWater ? 'text-emerald-300' : 'text-slate-500'}`}>
                      <Droplet className="w-3.5 h-3.5" />
                      <span>{isHi ? 'शुद्ध पेयजल' : 'Purified Water'}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${camp.boatRescueStation ? 'text-blue-300 font-semibold' : 'text-slate-500'}`}>
                      <Ship className="w-3.5 h-3.5 text-blue-400" />
                      <span>{isHi ? 'बचाव मोटर-बोट बेस' : 'Boat Rescue Depot'}</span>
                    </div>
                  </div>
                </div>

                {/* In charge contact & call action */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-slate-400 block">{isHi ? 'प्रभारी अधिकारी:' : 'Camp In-Charge:'}</span>
                    <span className="font-semibold text-slate-200">{camp.contactPerson}</span>
                  </div>

                  <a
                    href={`tel:${camp.contactPhone}`}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-3 py-2 rounded-lg transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{isHi ? 'कॉल करें' : 'Call'} ({camp.contactPhone})</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
