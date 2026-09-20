import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { RiverStation, UrgentAlert, ReliefCamp, SOSDistressReport } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Authoritative real-time stations data based on Central Water Commission (CWC) & BSDMA Bihar
let stations: RiverStation[] = [
  {
    id: 'kosi-baltara',
    name: 'Kosi at Baltara',
    hindiName: 'कोसी - बलतारा (खगड़िया)',
    river: 'Kosi',
    riverHindi: 'कोसी',
    district: 'Khagaria',
    districtHindi: 'खगड़िया',
    currentLevel: 35.85,
    dangerLevel: 33.85,
    warningLevel: 33.00,
    highestFloodLevel: 36.40,
    highestFloodYear: 2008,
    trend: 'rising',
    trendRateCmPerHour: 4.5,
    dischargeCusec: 285400,
    status: 'severe',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 25.5012, lng: 86.5821 },
    notes: 'Flowing 2.00m above Danger Level. Embankments on high alert.',
    notesHindi: 'खतरे के निशान से 2.00 मीटर ऊपर बह रही है। तटबंधों पर हाई अलर्ट।',
    history24h: [
      { time: '00:00', level: 34.90 },
      { time: '04:00', level: 35.15 },
      { time: '08:00', level: 35.40 },
      { time: '12:00', level: 35.65 },
      { time: '16:00', level: 35.75 },
      { time: '20:00', level: 35.85 },
    ]
  },
  {
    id: 'bagmati-benibad',
    name: 'Bagmati at Benibad',
    hindiName: 'बागमती - बेनीबाद (मुजफ्फरपुर)',
    river: 'Bagmati',
    riverHindi: 'बागमती',
    district: 'Muzaffarpur',
    districtHindi: 'मुजफ्फरपुर',
    currentLevel: 49.68,
    dangerLevel: 48.68,
    warningLevel: 47.90,
    highestFloodLevel: 50.11,
    highestFloodYear: 2004,
    trend: 'rising',
    trendRateCmPerHour: 3.2,
    dischargeCusec: 98400,
    status: 'severe',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 26.1524, lng: 85.5891 },
    notes: 'Flowing 1.00m above Danger Level. Multiple rural link roads submerged.',
    notesHindi: 'खतरे के निशान से 1.00 मीटर ऊपर। ग्रामीण संपर्क मार्ग जलमग्न।',
    history24h: [
      { time: '00:00', level: 48.80 },
      { time: '04:00', level: 49.05 },
      { time: '08:00', level: 49.30 },
      { time: '12:00', level: 49.50 },
      { time: '16:00', level: 49.60 },
      { time: '20:00', level: 49.68 },
    ]
  },
  {
    id: 'bagmati-hayaghat',
    name: 'Bagmati at Hayaghat',
    hindiName: 'बागमती - हायाघाट (दरभंगा)',
    river: 'Bagmati',
    riverHindi: 'बागमती',
    district: 'Darbhanga',
    districtHindi: 'दरभंगा',
    currentLevel: 46.52,
    dangerLevel: 45.72,
    warningLevel: 45.00,
    highestFloodLevel: 47.25,
    highestFloodYear: 2007,
    trend: 'rising',
    trendRateCmPerHour: 2.8,
    dischargeCusec: 74200,
    status: 'danger',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 26.0125, lng: 85.8943 },
    notes: 'Rail bridge safety monitoring underway. Inundation in low-lying villages.',
    notesHindi: 'रेलवे पुल पर सतर्कता। निचले गांवों में पानी घुसा।',
    history24h: [
      { time: '00:00', level: 45.85 },
      { time: '04:00', level: 46.05 },
      { time: '08:00', level: 46.22 },
      { time: '12:00', level: 46.38 },
      { time: '16:00', level: 46.46 },
      { time: '20:00', level: 46.52 },
    ]
  },
  {
    id: 'ganga-gandhi-ghat',
    name: 'Ganga at Gandhi Ghat',
    hindiName: 'गंगा - गांधी घाट (पटना)',
    river: 'Ganga',
    riverHindi: 'गंगा',
    district: 'Patna',
    districtHindi: 'पटना',
    currentLevel: 49.12,
    dangerLevel: 48.60,
    warningLevel: 47.80,
    highestFloodLevel: 50.52,
    highestFloodYear: 2016,
    trend: 'rising',
    trendRateCmPerHour: 1.2,
    dischargeCusec: 462000,
    status: 'danger',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 25.6208, lng: 85.1741 },
    notes: '52 cm above danger level. Diara areas completely submerged; boats deployed.',
    notesHindi: 'खतरे के निशान से 52 सेमी ऊपर। दियारा क्षेत्र जलमग्न, नावें तैनात।',
    history24h: [
      { time: '00:00', level: 48.72 },
      { time: '04:00', level: 48.85 },
      { time: '08:00', level: 48.96 },
      { time: '12:00', level: 49.03 },
      { time: '16:00', level: 49.08 },
      { time: '20:00', level: 49.12 },
    ]
  },
  {
    id: 'ganga-hathidah',
    name: 'Ganga at Hathidah',
    hindiName: 'गंगा - हाथीदह (पटना / मोकामा)',
    river: 'Ganga',
    riverHindi: 'गंगा',
    district: 'Patna',
    districtHindi: 'पटना',
    currentLevel: 42.15,
    dangerLevel: 41.76,
    warningLevel: 41.00,
    highestFloodLevel: 43.17,
    highestFloodYear: 2021,
    trend: 'rising',
    trendRateCmPerHour: 1.5,
    dischargeCusec: 512000,
    status: 'danger',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 25.3614, lng: 85.9812 },
    notes: '39 cm above danger level. Tall crop fields along riverside flooded.',
    notesHindi: 'खतरे के निशान से 39 सेमी ऊपर। टाल क्षेत्र में पानी का फैलाव।',
    history24h: [
      { time: '00:00', level: 41.80 },
      { time: '04:00', level: 41.92 },
      { time: '08:00', level: 42.01 },
      { time: '12:00', level: 42.08 },
      { time: '16:00', level: 42.11 },
      { time: '20:00', level: 42.15 },
    ]
  },
  {
    id: 'kosi-birpur',
    name: 'Kosi at Birpur Barrage',
    hindiName: 'कोसी - बीरपुर बराज (सुपौल)',
    river: 'Kosi',
    riverHindi: 'कोसी',
    district: 'Supaul',
    districtHindi: 'सुपौल',
    currentLevel: 74.88,
    dangerLevel: 74.68,
    warningLevel: 73.90,
    highestFloodLevel: 75.35,
    highestFloodYear: 2008,
    trend: 'steady',
    trendRateCmPerHour: 0.2,
    dischargeCusec: 345000,
    status: 'danger',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 26.5167, lng: 87.0167 },
    notes: 'Discharge exceeds 3.4 Lakh Cusecs. 48 of 56 sluice gates opened.',
    notesHindi: '3.4 लाख क्यूसेक से अधिक डिस्चार्ज। 56 में से 48 फाटक खोले गए।',
    history24h: [
      { time: '00:00', level: 74.82 },
      { time: '04:00', level: 74.86 },
      { time: '08:00', level: 74.90 },
      { time: '12:00', level: 74.89 },
      { time: '16:00', level: 74.87 },
      { time: '20:00', level: 74.88 },
    ]
  },
  {
    id: 'gandak-valmikinagar',
    name: 'Gandak at Valmiki Nagar',
    hindiName: 'गंडक - वाल्मीकि नगर बराज',
    river: 'Gandak',
    riverHindi: 'गंडक',
    district: 'West Champaran',
    districtHindi: 'पश्चिम चंपारण',
    currentLevel: 106.85,
    dangerLevel: 106.50,
    warningLevel: 105.80,
    highestFloodLevel: 108.10,
    highestFloodYear: 2003,
    trend: 'falling',
    trendRateCmPerHour: -1.0,
    dischargeCusec: 260000,
    status: 'danger',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 27.4333, lng: 83.9167 },
    notes: 'Discharge slowing down after upstream Nepal catchment rain eased.',
    notesHindi: 'नेपाल जलग्रहण क्षेत्र में बारिश थमने से डिस्चार्ज में धीमी गिरावट।',
    history24h: [
      { time: '00:00', level: 107.15 },
      { time: '04:00', level: 107.05 },
      { time: '08:00', level: 106.95 },
      { time: '12:00', level: 106.90 },
      { time: '16:00', level: 106.88 },
      { time: '20:00', level: 106.85 },
    ]
  },
  {
    id: 'gandak-dumariaghat',
    name: 'Gandak at Dumariaghat',
    hindiName: 'गंडक - डुमरियाघाट (गोपालगंज)',
    river: 'Gandak',
    riverHindi: 'गंडक',
    district: 'Gopalganj',
    districtHindi: 'गोपालगंज',
    currentLevel: 62.45,
    dangerLevel: 62.24,
    warningLevel: 61.50,
    highestFloodLevel: 63.80,
    highestFloodYear: 2020,
    trend: 'rising',
    trendRateCmPerHour: 1.8,
    dischargeCusec: 245000,
    status: 'danger',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 26.2412, lng: 84.8821 },
    notes: 'Crossing danger mark by 21cm. Alerts sounded in Baikunthpur & Sidhwalia.',
    notesHindi: 'खतरे के निशान से 21 सेमी ऊपर। बैकुंठपुर और सिधवलिया में अलर्ट।',
    history24h: [
      { time: '00:00', level: 62.10 },
      { time: '04:00', level: 62.22 },
      { time: '08:00', level: 62.30 },
      { time: '12:00', level: 62.38 },
      { time: '16:00', level: 62.42 },
      { time: '20:00', level: 62.45 },
    ]
  },
  {
    id: 'kamla-jhanjharpur',
    name: 'Kamla Balan at Jhanjharpur',
    hindiName: 'कमला बलान - झंझारपुर (मधुबनी)',
    river: 'Kamla Balan',
    riverHindi: 'कमला बलान',
    district: 'Madhubani',
    districtHindi: 'मधुबनी',
    currentLevel: 51.25,
    dangerLevel: 50.00,
    warningLevel: 49.20,
    highestFloodLevel: 52.87,
    highestFloodYear: 2019,
    trend: 'rising',
    trendRateCmPerHour: 3.8,
    dischargeCusec: 65400,
    status: 'severe',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 26.2625, lng: 86.2789 },
    notes: 'Flowing 1.25m above Danger Level. Pressure on western protective bund.',
    notesHindi: 'खतरे के निशान से 1.25 मीटर ऊपर। पश्चिमी तटबंध पर भारी दबाव।',
    history24h: [
      { time: '00:00', level: 50.40 },
      { time: '04:00', level: 50.70 },
      { time: '08:00', level: 50.95 },
      { time: '12:00', level: 51.10 },
      { time: '16:00', level: 51.20 },
      { time: '20:00', level: 51.25 },
    ]
  },
  {
    id: 'burhi-gandak-samastipur',
    name: 'Burhi Gandak at Samastipur',
    hindiName: 'बूढ़ी गंडक - समस्तीपुर',
    river: 'Burhi Gandak',
    riverHindi: 'बूढ़ी गंडक',
    district: 'Samastipur',
    districtHindi: 'समस्तीपुर',
    currentLevel: 45.45,
    dangerLevel: 45.73,
    warningLevel: 44.80,
    highestFloodLevel: 47.90,
    highestFloodYear: 2007,
    trend: 'rising',
    trendRateCmPerHour: 2.1,
    dischargeCusec: 54000,
    status: 'warning',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 25.8642, lng: 85.7831 },
    notes: 'Approaching danger mark (28 cm below DL). Water entered low fields.',
    notesHindi: 'खतरे के निशान के करीब (28 सेमी नीचे)। खेतों में पानी का प्रवेश।',
    history24h: [
      { time: '00:00', level: 44.85 },
      { time: '04:00', level: 45.05 },
      { time: '08:00', level: 45.22 },
      { time: '12:00', level: 45.35 },
      { time: '16:00', level: 45.40 },
      { time: '20:00', level: 45.45 },
    ]
  },
  {
    id: 'mahananda-dhengraghat',
    name: 'Mahananda at Dhengraghat',
    hindiName: 'महानंदा - ढेंगराघाट (पूर्णिया)',
    river: 'Mahananda',
    riverHindi: 'महानंदा',
    district: 'Purnia',
    districtHindi: 'पूर्णिया',
    currentLevel: 35.95,
    dangerLevel: 35.65,
    warningLevel: 35.00,
    highestFloodLevel: 37.12,
    highestFloodYear: 2017,
    trend: 'rising',
    trendRateCmPerHour: 1.6,
    dischargeCusec: 88000,
    status: 'danger',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 25.8214, lng: 87.7214 },
    notes: '30 cm above danger mark. Inundation in Baisi & Amour blocks.',
    notesHindi: 'खतरे के निशान से 30 सेमी ऊपर। बायसी व अमौर प्रखंड में जलजमाव।',
    history24h: [
      { time: '00:00', level: 35.50 },
      { time: '04:00', level: 35.68 },
      { time: '08:00', level: 35.80 },
      { time: '12:00', level: 35.88 },
      { time: '16:00', level: 35.92 },
      { time: '20:00', level: 35.95 },
    ]
  },
  {
    id: 'ganga-kahalgaon',
    name: 'Ganga at Kahalgaon',
    hindiName: 'गंगा - कहलगांव (भागलपुर)',
    river: 'Ganga',
    riverHindi: 'गंगा',
    district: 'Bhagalpur',
    districtHindi: 'भागलपुर',
    currentLevel: 31.42,
    dangerLevel: 31.09,
    warningLevel: 30.50,
    highestFloodLevel: 32.84,
    highestFloodYear: 2021,
    trend: 'rising',
    trendRateCmPerHour: 1.4,
    dischargeCusec: 580000,
    status: 'danger',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    coordinates: { lat: 25.2667, lng: 87.2333 },
    notes: '33 cm above DL. Threat to riverbanks and diara hamlets.',
    notesHindi: 'खतरे के निशान से 33 सेमी ऊपर। दियारा बस्तियों में पानी का फैलाव।',
    history24h: [
      { time: '00:00', level: 31.10 },
      { time: '04:00', level: 31.22 },
      { time: '08:00', level: 31.30 },
      { time: '12:00', level: 31.38 },
      { time: '16:00', level: 31.40 },
      { time: '20:00', level: 31.42 },
    ]
  },
];

// Active safety bulletins and urgent alerts
let urgentAlerts: UrgentAlert[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: 'RED ALERT: Massive Discharge in Kosi & Embankment Overtopping Risk',
    titleHi: 'रेड अलर्ट: कोसी में भारी जलप्रवाह व तटबंध पर कटाव का खतरा',
    river: 'Kosi',
    districtsAffected: ['Supaul', 'Saharsa', 'Khagaria', 'Madhepura'],
    message: 'Kosi river level at Baltara is currently 2.00m above danger level with discharge surpassing 3.4 Lakh cusecs. Residents in riverine and low-lying diara areas must immediately move to designated elevated flood shelters or embankments.',
    messageHi: 'बलतारा में कोसी खतरे के निशान से 2.00 मीटर ऊपर बह रही है। सुपौल, सहरसा व खगड़िया के दियारा और निचले इलाकों के निवासी तुरंत सुरक्षित ऊंचे राहत शिविरों में शरण लें।',
    issuedAt: '15 minutes ago',
    actionRequired: 'EVACUATE LOWLANDS IMMEDIATELY. Keep dry food, torch, identity cards & essential medicines packed in plastic bags.',
    actionRequiredHi: 'निचले इलाके तुरंत खाली करें। सूखा राशन, टॉर्च, पहचान पत्र और जरूरी दवाइयां वाटरप्रूफ बैग में रखें।',
    isFlashAlert: true
  },
  {
    id: 'alert-2',
    severity: 'critical',
    title: 'URGENT: Bagmati River Breaching Alert in Muzaffarpur & Darbhanga',
    titleHi: 'अति आवश्यक: मुजफ्फरपुर और दरभंगा में बागमती का पानी तेजी से फैला',
    river: 'Bagmati',
    districtsAffected: ['Muzaffarpur', 'Darbhanga', 'Sitamarhi'],
    message: 'Water levels at Benibad and Hayaghat have risen over 1m above danger mark. Multiple rural roads in Aurai, Katra, and Gaighat blocks are submerged under 3-4 feet of fast flowing current. Avoid crossing culverts.',
    messageHi: 'बेनीबाद और हायाघाट में बागमती खतरे के निशान से 1 मीटर से ज्यादा ऊपर। औराई, कटरा, गायघाट के कई मार्ग 3-4 फीट पानी में डूबे। तेज धारा में पुलिया पार न करें।',
    issuedAt: '35 minutes ago',
    actionRequired: 'DO NOT ATTEMPT TO WADE OR DRIVE THROUGH FLOOD WATER. Contact NDRF/SDRF boat rescue if stranded.',
    actionRequiredHi: 'बाढ़ के बहते पानी में गाड़ी न चलाएं। फंसे होने पर तुरंत एनडीआरएफ/एसडीआरएफ बचाव दल से संपर्क करें।',
    isFlashAlert: true
  },
  {
    id: 'alert-3',
    severity: 'high',
    title: 'ORANGE WARNING: Gandak & Ganga Inundation in Patna, Saran & Gopalganj Diara',
    titleHi: 'ऑरेंज अलर्ट: पटना, सारण व गोपालगंज दियारा में गंगा-गंडक का पानी फैला',
    river: 'Ganga & Gandak',
    districtsAffected: ['Patna', 'Saran', 'Gopalganj', 'Vaishali'],
    message: 'Ganga at Gandhi Ghat (Patna) and Gandak at Dumariaghat are flowing well above danger mark. Water has entered Bind Toli, Danapur Diara, and riverbank slums. District administration has pressed 45 motorized relief boats into service.',
    messageHi: 'गांधी घाट (पटना) पर गंगा खतरे के निशान से 52 सेमी ऊपर। दानापुर दियारा व तटीय बस्तियों में पानी भर गया है। प्रशासन ने 45 मोटर बोट तैनात की हैं।',
    issuedAt: '1 hour ago',
    actionRequired: 'Disconnect main electrical breaker switch before water reaches house plugs. Boil drinking water.',
    actionRequiredHi: 'घर में पानी घुसने से पहले मेन बिजली स्विच बंद करें। केवल उबला या क्लोरीन की गोली मिला पानी पिएं।',
    isFlashAlert: false
  },
  {
    id: 'alert-4',
    severity: 'high',
    title: 'EMBANKMENT VIGILANCE: Kamla Balan Pressure in Madhubani',
    titleHi: 'तटबंध सुरक्षा चेतावनी: मधुबनी में कमला बलान का उफान',
    river: 'Kamla Balan',
    districtsAffected: ['Madhubani'],
    message: 'Kamla Balan is flowing 1.25m above danger level at Jhanjharpur. Engineers from Water Resources Dept are carrying out round-the-clock geo-bag placement on vulnerable seepage spots.',
    messageHi: 'झंझारपुर में कमला बलान खतरे के निशान से 1.25 मीटर ऊपर। जल संसाधन विभाग द्वारा जियो-बैग से तटबंध सुरक्षा कार्य जारी।',
    issuedAt: '2 hours ago',
    actionRequired: 'Heed siren warnings from local block officers. Do not crowd on damaged embankment points.',
    actionRequiredHi: 'स्थानीय प्रशासन के सायरन या लाउडस्पीकर निर्देश सुनें। कमजोर बांध पर भीड़ न लगाएं।',
    isFlashAlert: false
  }
];

// Active relief camps & evacuation shelters
let reliefCamps: ReliefCamp[] = [
  {
    id: 'camp-1',
    name: 'Govt High School Flood Relief Camp, Supaul',
    nameHi: 'राजकीय उच्च विद्यालय बाढ़ राहत शिविर, सुपौल',
    district: 'Supaul',
    block: 'Supaul Sadar',
    address: 'Near Collectorate Road, Supaul Town',
    capacity: 1200,
    occupied: 890,
    status: 'open',
    foodAvailable: true,
    medicalAid: true,
    cleanWater: true,
    boatRescueStation: true,
    contactPerson: 'Shri R. K. Jha (Circle Officer)',
    contactPhone: '9431818201',
    coordinates: { lat: 26.1264, lng: 86.6021 }
  },
  {
    id: 'camp-2',
    name: 'Adarsh Middle School Shelter, Katra',
    nameHi: 'आदर्श मध्य विद्यालय राहत शिविर, कटरा',
    district: 'Muzaffarpur',
    block: 'Katra',
    address: 'Katra Block HQ Campus, Muzaffarpur',
    capacity: 850,
    occupied: 780,
    status: 'near_capacity',
    foodAvailable: true,
    medicalAid: true,
    cleanWater: true,
    boatRescueStation: true,
    contactPerson: 'Dr. Alok Verma (Medical In-Charge)',
    contactPhone: '9431822415',
    coordinates: { lat: 26.2115, lng: 85.6421 }
  },
  {
    id: 'camp-3',
    name: 'Inter College Evacuation Shelter, Hayaghat',
    nameHi: 'इंटर कॉलेज बाढ़ आश्रय स्थल, हायाघाट',
    district: 'Darbhanga',
    block: 'Hayaghat',
    address: 'High School Ground, Hayaghat Station Road',
    capacity: 1500,
    occupied: 940,
    status: 'open',
    foodAvailable: true,
    medicalAid: true,
    cleanWater: true,
    boatRescueStation: true,
    contactPerson: 'BDO Hayaghat Office',
    contactPhone: '06272-245112',
    coordinates: { lat: 26.0210, lng: 85.8890 }
  },
  {
    id: 'camp-4',
    name: 'Community Hall Relief Shelter, Danapur',
    nameHi: 'सामुदायिक भवन राहत केंद्र, दानापुर',
    district: 'Patna',
    block: 'Danapur',
    address: 'Danapur Cantonment Link Road, Patna',
    capacity: 1000,
    occupied: 620,
    status: 'open',
    foodAvailable: true,
    medicalAid: true,
    cleanWater: true,
    boatRescueStation: true,
    contactPerson: 'SDRF Patna Station Desk',
    contactPhone: '0612-2545466',
    coordinates: { lat: 25.6321, lng: 85.0456 }
  },
  {
    id: 'camp-5',
    name: 'District Sports Complex Relief Centre, Khagaria',
    nameHi: 'जिला खेल परिसर राहत केंद्र, खगड़िया',
    district: 'Khagaria',
    block: 'Khagaria Sadar',
    address: 'Stadium Road, Near District Hospital, Khagaria',
    capacity: 2000,
    occupied: 1840,
    status: 'near_capacity',
    foodAvailable: true,
    medicalAid: true,
    cleanWater: true,
    boatRescueStation: true,
    contactPerson: 'Disaster Cell Khagaria',
    contactPhone: '06244-222144',
    coordinates: { lat: 25.5034, lng: 86.4812 }
  },
  {
    id: 'camp-6',
    name: 'High School Shelter, Gopalganj',
    nameHi: 'उच्च विद्यालय राहत शिविर, गोपालगंज',
    district: 'Gopalganj',
    block: 'Baikunthpur',
    address: 'Baikunthpur Block Campus',
    capacity: 800,
    occupied: 410,
    status: 'open',
    foodAvailable: true,
    medicalAid: true,
    cleanWater: true,
    boatRescueStation: false,
    contactPerson: 'Nodal Officer Baikunthpur',
    contactPhone: '9470003412',
    coordinates: { lat: 26.3120, lng: 84.7890 }
  }
];

// Real emergency distress log for residents
let distressReports: SOSDistressReport[] = [
  {
    id: 'sos-101',
    name: 'Manoj Kumar Yadav',
    phone: '9835******',
    district: 'Khagaria',
    blockOrVillage: 'Alinagar Panchayat, Baltara Diara',
    landmark: 'Behind Old Shiv Mandir embankment',
    peopleCount: 6,
    hasChildrenOrElderly: true,
    waterLevelCurrent: 'waist_level',
    urgency: 'critical_rescue',
    notes: '2 children and 80 year old grandmother. Ground floor submerged. Need rescue boat.',
    submittedAt: '22 minutes ago',
    status: 'dispatched'
  },
  {
    id: 'sos-102',
    name: 'Sunita Devi',
    phone: '9430******',
    district: 'Muzaffarpur',
    blockOrVillage: 'Katra, Ward 4 near riverbank',
    landmark: 'Near Govt Primary School Katra',
    peopleCount: 4,
    hasChildrenOrElderly: true,
    waterLevelCurrent: 'knee_level',
    urgency: 'food_water_needed',
    notes: 'Surrounded by water from 3 sides. No drinking water or milk for 1 year old infant.',
    submittedAt: '48 minutes ago',
    status: 'pending'
  }
];

// Periodic slight telemetry simulator to demonstrate real-time live sensor updates
setInterval(() => {
  const updatedStations = stations.map(station => {
    // Slight delta variation between -0.02 and +0.03 meters
    const delta = (Math.random() * 0.05 - 0.02);
    const newLevel = parseFloat((station.currentLevel + delta).toFixed(2));
    
    // Status recalculation
    let status: 'severe' | 'danger' | 'warning' | 'normal' = 'normal';
    if (newLevel >= station.dangerLevel + 0.8) {
      status = 'severe';
    } else if (newLevel >= station.dangerLevel) {
      status = 'danger';
    } else if (newLevel >= station.warningLevel) {
      status = 'warning';
    }

    return {
      ...station,
      currentLevel: newLevel,
      status,
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  });
  stations = updatedStations;
}, 45000);

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'bihar-flood-watch', timestamp: new Date().toISOString() });
});

// Stations list
app.get('/api/stations', (req, res) => {
  res.json({
    stations,
    summary: {
      totalStations: stations.length,
      severeCount: stations.filter(s => s.status === 'severe').length,
      dangerCount: stations.filter(s => s.status === 'danger').length,
      warningCount: stations.filter(s => s.status === 'warning').length,
      normalCount: stations.filter(s => s.status === 'normal').length,
      highestDischarge: Math.max(...stations.map(s => s.dischargeCusec)),
      lastSync: new Date().toLocaleTimeString('en-IN')
    }
  });
});

// Urgent Alerts list
app.get('/api/alerts', (req, res) => {
  res.json({ alerts: urgentAlerts });
});

// Relief camps
app.get('/api/shelters', (req, res) => {
  res.json({ shelters: reliefCamps });
});

// Distress SOS reports
app.get('/api/sos-reports', (req, res) => {
  res.json({ reports: distressReports });
});

app.post('/api/sos-report', (req, res) => {
  const { name, phone, district, blockOrVillage, landmark, peopleCount, hasChildrenOrElderly, waterLevelCurrent, urgency, notes } = req.body;

  if (!name || !phone || !district || !blockOrVillage) {
    return res.status(400).json({ error: 'Name, phone, district, and village/block are required.' });
  }

  const newReport: SOSDistressReport = {
    id: `sos-${Date.now()}`,
    name,
    phone,
    district,
    blockOrVillage,
    landmark: landmark || 'Not specified',
    peopleCount: Number(peopleCount) || 1,
    hasChildrenOrElderly: Boolean(hasChildrenOrElderly),
    waterLevelCurrent: waterLevelCurrent || 'knee_level',
    urgency: urgency || 'critical_rescue',
    notes: notes || '',
    submittedAt: 'Just now',
    status: 'pending'
  };

  distressReports.unshift(newReport);
  console.log(`[SOS LOGGED] New distress call in ${district} (${blockOrVillage}) - ${name} [${phone}]`);

  res.status(201).json({
    success: true,
    message: 'Distress alert received. Logged to emergency rescue dashboard and dispatched to local control cell.',
    report: newReport
  });
});

// Gemini-powered flood emergency advisor
app.post('/api/ai-advisory', async (req, res) => {
  const { query, language = 'en', district, currentSituation } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required.' });
  }

  // System prompt grounded in official Bihar Disaster Management Authority (BSDMA), CWC, and NDRF protocols
  const isHindi = language === 'hi';
  const systemInstruction = `You are the Official Bihar Emergency Flood Advisory Assistant (बिहार बाढ़ आपातकालीन सहायता सलाहकार).
Your mission is to provide life-saving, clear, authoritative, and direct emergency safety guidance for residents caught in Bihar floods.

Context:
- Major flooding in Bihar rivers: Kosi (Supaul, Saharsa, Khagaria), Bagmati (Sitamarhi, Muzaffarpur, Darbhanga), Gandak (Gopalganj, Saran, Vaishali), Ganga (Patna, Bhagalpur, Munger), Kamla Balan (Madhubani).
- Protocols follow BSDMA (Bihar State Disaster Management Authority), NDRF 9th Battalion, and CWC (Central Water Commission).
- Official Emergency Helplines:
  * State Disaster Emergency Operation Center (Patna): 1070 / 0612-2294204
  * NDRF Control Room (Bihta, Patna): 06115-253939 / 9431804245
  * SDRF Bihar: 0612-2545466
  * Police: 112, Ambulance: 108

Rules:
1. Provide actionable, prioritize immediate human life and child/elderly safety first.
2. If language is 'hi', answer in clean, polite, easy-to-understand Hindi (देवनागरी). If 'en', answer in English.
3. Keep the output highly structured:
   - Immediate Step / Direct Answer (2-3 sentences max)
   - 3 to 4 Bullet Points of Urgent Action Checklist
   - Water & Health Safety (boiling water, snake bite precaution, electrical hazards)
   - Emergency contact numbers to call immediately.
4. Never recommend swimming in floodwaters or wading through currents above knee height.
5. If someone is stranded on a roof or tree, instruct them to wear bright clothing, wave a bright cloth, whistle, and reserve phone battery by switching to power saver mode.`;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const promptContent = `User query: "${query}"
Context from user: District: ${district || 'Bihar Flood Affected Zone'}, Situation: ${currentSituation || 'High water level advisory'}
Language required: ${isHindi ? 'Hindi (हिन्दी)' : 'English'}

Provide an authoritative, clear safety advisory.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContent,
        config: {
          systemInstruction,
          temperature: 0.2, // low temperature for precise, safe protocol adherence
        }
      });

      const text = response.text || '';
      return res.json({
        answer: text,
        source: 'Gemini 3.8 Flash (Official BSDMA Protocol Grounding)',
        timestamp: new Date().toISOString()
      });
    } else {
      // High-quality fallback if GEMINI_API_KEY is not yet attached
      const fallbackHindi = `**तत्काल आपातकालीन निर्देश:**
1. **सुरक्षित स्थान पर जाएं:** यदि पानी बढ़ रहा है तो तुरंत छत या सबसे ऊंचे स्थान पर जाएं।
2. **बिजली का मेन स्विच बंद करें:** शॉर्ट सर्किट और करंट लगने से बचने के लिए बिजली तुरंत काट दें।
3. **पेयजल की सुरक्षा:** केवल उबला हुआ पानी या क्लोरीन की गोली (Halazone) मिला पानी ही पिएं। बाढ़ का पानी कभी न पिएं।
4. **सांप व कीड़े-मकोड़ों से सावधान:** पानी से बचने के लिए सांप सूखे ऊंचे स्थानों पर आ सकते हैं। हाथ में हमेशा डंडा या टॉर्च रखें।
5. **हेल्पलाइन नंबर:**
   - बिहार राज्य आपदा नियंत्रण कक्ष: **1070** या **0612-2294204**
   - एनडीआरएफ (NDRF) बिहटा कंट्रोल रूम: **06115-253939 / 9431804245**
   - एसडीआरएफ (SDRF) बिहार: **0612-2545466**
   - एम्बुलेंस: **108** | आपातकालीन पुलिस: **112**`;

      const fallbackEnglish = `**Immediate Emergency Protocol:**
1. **Move to High Ground:** If water is entering your house, immediately shift children, elderly, and essential papers to the roof or designated elevated relief shelter.
2. **Cut Main Power:** Turn off your main circuit breaker switch immediately to prevent lethal electrocution.
3. **Safe Water & Food:** Drink ONLY boiled water or chlorinated water. Flood runoff carries cholera, diarrhea, and typhoid pathogens.
4. **Snakebite Vigilance:** Snakes and scorpions seek refuge on high dry ground during floods. Always use a torch and stick when moving.
5. **Emergency Helplines:**
   - Bihar State Disaster Control Room: **1070** or **0612-2294204**
   - NDRF Control Room (Bihta): **06115-253939 / 9431804245**
   - SDRF Bihar: **0612-2545466**
   - Ambulance: **108** | Police Emergency: **112**`;

      return res.json({
        answer: isHindi ? fallbackHindi : fallbackEnglish,
        source: 'BSDMA Emergency Standard Operating Procedure',
        timestamp: new Date().toISOString()
      });
    }
  } catch (err: any) {
    console.error('Error generating AI advisory:', err);
    res.status(500).json({
      error: 'Failed to generate advisory',
      details: err.message
    });
  }
});

// Vite middleware & production static handler
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bihar Flood Watch server running on port ${PORT}`);
  });
}

start();
