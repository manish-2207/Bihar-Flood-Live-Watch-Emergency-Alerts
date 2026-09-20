import React, { useState } from 'react';
import { 
  BookOpen, 
  Droplet, 
  Zap, 
  AlertTriangle, 
  PhoneCall, 
  ShieldCheck, 
  Search,
  Radio,
  Flame
} from 'lucide-react';

interface EmergencySurvivalGuideProps {
  language: 'en' | 'hi';
}

export const EmergencySurvivalGuide: React.FC<EmergencySurvivalGuideProps> = ({ language }) => {
  const isHi = language === 'hi';
  const [districtSearch, setDistrictSearch] = useState('');

  const districtControlRooms = [
    { district: 'Patna', phone: '0612-2219810', alt: '0612-2219809', officer: 'DDMA Patna Disaster Cell' },
    { district: 'Khagaria', phone: '06244-222144', alt: '9431818301', officer: 'District Emergency Cell' },
    { district: 'Supaul', phone: '06273-222104', alt: '9431818201', officer: 'Disaster In-Charge Supaul' },
    { district: 'Saharsa', phone: '06478-223101', alt: '9431818250', officer: 'DDMA Saharsa' },
    { district: 'Muzaffarpur', phone: '0621-2212377', alt: '0621-2212388', officer: 'District Disaster Section' },
    { district: 'Darbhanga', phone: '06272-245112', alt: '9431818150', officer: 'Disaster Cell Darbhanga' },
    { district: 'Madhubani', phone: '06276-222238', alt: '9431818180', officer: 'DDMA Madhubani' },
    { district: 'Samastipur', phone: '06274-222201', alt: '9431818120', officer: 'Emergency Cell Samastipur' },
    { district: 'Bhagalpur', phone: '0641-2400030', alt: '9431818400', officer: 'Disaster Control Room' },
    { district: 'Gopalganj', phone: '06156-224422', alt: '9431818650', officer: 'DDMA Gopalganj' },
    { district: 'Sitamarhi', phone: '06226-250325', alt: '9431818160', officer: 'Disaster Cell Sitamarhi' },
    { district: 'Purnia', phone: '06454-242311', alt: '9431818500', officer: 'DDMA Purnea Control' },
    { district: 'Katihar', phone: '06452-242400', alt: '9431818550', officer: 'District Disaster Cell' },
    { district: 'West Champaran (Bettiah)', phone: '06254-242500', alt: '9431818700', officer: 'Control Room Bettiah' },
  ];

  const filteredControlRooms = districtControlRooms.filter(c => 
    c.district.toLowerCase().includes(districtSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 bg-emerald-950 border border-emerald-700/80 rounded-xl text-emerald-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isHi ? 'बिहार बाढ़ जीवन रक्षक सर्वाइवल गाइड' : 'Bihar Flood Survival & Health Protocol Guide'}
            </h2>
            <p className="text-xs text-slate-400">
              {isHi 
                ? 'जल शोधन, सर्पदंश प्राथमिक उपचार, बिजली सुरक्षा एवं बचाव दल हेतु निर्देश' 
                : 'Life-saving protocols on safe drinking water, snakebite management, and signal rescue'}
            </p>
          </div>
        </div>

        {/* 4 Pillars of Flood Survival */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* 1. Water Disinfection */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
              <Droplet className="w-4 h-4" />
              <span>{isHi ? '1. सुरक्षित पेयजल व जल शोधन विधि' : '1. Safe Drinking Water & Purification'}</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-white">{isHi ? 'पानी उबालें:' : 'Boil Water:'} </strong>
                {isHi ? 'पानी को कम से कम 10 से 15 मिनट तक खौलाएं।' : 'Boil water for at least 10 minutes before drinking.'}
              </li>
              <li>
                <strong className="text-white">{isHi ? 'क्लोरीन / हैलाजोन टिकिया:' : 'Halazone / Chlorine Tablets:'} </strong>
                {isHi ? '10 लीटर साफ पानी में 1 टिकिया डालकर 30 मिनट ढक कर रखें।' : 'Dissolve 1 tablet in 10 liters of clear water and wait 30 minutes.'}
              </li>
              <li>
                <strong className="text-white">{isHi ? 'चापाकल का दूषित पानी:' : 'Submerged Hand Pumps:'} </strong>
                {isHi ? 'बाढ़ में डूबे चापाकल का पानी कभी सीधा न पिएं। इसमें हैजा और डायरिया के रोगाणु होते हैं।' : 'Never drink raw water from submerged borewells; it harbors cholera pathogens.'}
              </li>
            </ul>
          </div>

          {/* 2. Snakebite Protocol */}
          <div className="bg-slate-950 p-4 rounded-xl border border-red-900/40">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{isHi ? '2. सर्पदंश (Snakebite) आपातकालीन प्राथमिक उपचार' : '2. Snakebite Emergency Protocol'}</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-white">{isHi ? 'रोगी को शांत रखें:' : 'Immobilize & Calm:'} </strong>
                {isHi ? 'पीड़ित को दौड़ाएं या घबराने न दें। कटे हुए अंग को लकड़ी की पट्टी से स्थिर रखें।' : 'Keep patient still; movement spreads venom faster. Immobilize limb with a splint.'}
              </li>
              <li>
                <strong className="text-red-400">{isHi ? 'ब्लेड से चीरा न लगाएं:' : 'DO NOT CUT OR SUCK:'} </strong>
                {isHi ? 'न चीरा लगाएं, न टाइट रस्सी बांधें। इससे ऊतक नष्ट हो जाते हैं।' : 'Never cut, suck, or apply tight tourniquets. This causes severe necrosis.'}
              </li>
              <li>
                <strong className="text-emerald-400">{isHi ? 'एंटी-स्नेक वेनम (ASV):' : 'Rush for ASV:'} </strong>
                {isHi ? 'तुरंत नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) या सदर अस्पताल ले जाएं। झाड़-फूंक में समय न गंवाएं।' : 'Rush immediately to nearest Govt PHC or District Hospital for Anti-Snake Venom.'}
              </li>
            </ul>
          </div>

          {/* 3. Electrical & Household Safety */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
              <Zap className="w-4 h-4" />
              <span>{isHi ? '3. बिजली करंट व शॉर्ट सर्किट से बचाव' : '3. Electrical Hazard Prevention'}</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-white">{isHi ? 'मेन स्विच बंद करें:' : 'Cut Main Breaker:'} </strong>
                {isHi ? 'आंगन या कमरे में पानी भरने से पहले मुख्य स्विच गिराएं।' : 'Switch off main breaker before water enters domestic premises.'}
              </li>
              <li>
                <strong className="text-white">{isHi ? 'टूटे हुए खंभे व तार:' : 'Fallen Power Lines:'} </strong>
                {isHi ? 'पानी में गिरे किसी भी बिजली के तार या खंभे से कम से कम 20 फीट दूर रहें।' : 'Stay at least 20 feet away from fallen lines in water.'}
              </li>
              <li>
                <strong className="text-white">{isHi ? 'भीगे उपकरण:' : 'Wet Appliances:'} </strong>
                {isHi ? 'बाढ़ का पानी उतरने के बाद भी किसी बिजली उपकरण को बिना मैकेनिक जांचे न छुएं।' : 'Do not power wet electronics until completely inspected.'}
              </li>
            </ul>
          </div>

          {/* 4. Signaling for Boat Rescue */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
              <Radio className="w-4 h-4" />
              <span>{isHi ? '4. नाव व हेलीकॉप्टर को बचाव संकेत देना' : '4. Signaling for Boat / Helicopter Rescue'}</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-white">{isHi ? 'चमकीला कपड़ा लहराएं:' : 'Bright Cloth:'} </strong>
                {isHi ? 'छत या ऊंचे पेड़ पर लाल/नारंगी साड़ी अथवा कपड़ा बांधकर लहराएं।' : 'Tie a bright red/orange saree or cloth on high bamboo to catch pilot/boat attention.'}
              </li>
              <li>
                <strong className="text-white">{isHi ? 'सीटी व टॉर्च:' : 'Whistle & Torch:'} </strong>
                {isHi ? 'रात में टॉर्च से 3 बार सिग्नल दें (SOS) और आवाज के लिए सीटी बजाएं।' : 'At night, flash torch in groups of 3 (SOS) and use whistles to guide motorized boats.'}
              </li>
              <li>
                <strong className="text-white">{isHi ? 'बैटरी बचत:' : 'Conserve Battery:'} </strong>
                {isHi ? 'मोबाइल को अल्ट्रा पावर सेवर मोड में रखें और इंटरनेट गैर-जरूरी बंद रखें।' : 'Keep mobile phones in Ultra Battery Saver mode for emergency rescue dispatchers.'}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* District Emergency Operation Centres (DDMA) Directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-red-500" />
              <span>{isHi ? 'बिहार जिला आपदा प्रबंधन नियंत्रण कक्ष दूरभाष सूची' : 'Bihar District Disaster Management (DDMA) Directory'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isHi ? '24 घंटे संचालित जिला हेल्पलाइन नंबर' : '24x7 operational district control desks across flood-affected zones'}
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={districtSearch}
              onChange={e => setDistrictSearch(e.target.value)}
              placeholder={isHi ? 'जिला खोजें...' : 'Search district...'}
              className="bg-slate-950 text-xs text-white pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-red-500 w-44"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {filteredControlRooms.map(item => (
            <div key={item.district} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white">{item.district}</span>
                <span className="text-[11px] text-slate-400 block">{item.officer}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <a
                  href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                  className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{item.phone}</span>
                </a>
                <span className="text-[10px] text-slate-500">{item.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
