// Web Speech API Voice Announcement Manager for Bihar Regional Dialects

export type Dialect = 'hi' | 'bhojpuri' | 'maithili' | 'en';

export interface DialectVoiceSnippet {
  title: string;
  dialectName: string;
  announcementText: string;
}

export const DIALECT_ANNOUNCEMENTS: Record<Dialect, DialectVoiceSnippet> = {
  hi: {
    title: 'हिन्दी आपात उद्घोषणा',
    dialectName: 'हिन्दी (Hindi)',
    announcementText: 'सावधान! बिहार में कोसी, बागमती, गंडक एवं गंगा नदी का जलस्तर खतरे के निशान से ऊपर बह रहा है। निचले दियारा और तटबंध के भीतर रहने वाले सभी नागरिक तुरंत ऊंचे स्थानों और सरकारी राहत शिविरों में शरण लें। पीने का पानी उबालकर पिएं एवं बिजली का मेन स्विच बंद रखें। आपात सहायता के लिए तुरंत 1070 पर फोन करें।'
  },
  bhojpuri: {
    title: 'भोजपुरी बाढ़ चेतावनी',
    dialectName: 'भोजपुरी (Bhojpuri)',
    announcementText: 'होशियार रहब! बिहार में कोसी, गंडक आ गंगा माई के पानी खतरा के निसान से ऊपर बह रहल बा। जे भी लोग दियारा आ बान्ह के भीतर बाड़े, उ लोग तुरंत बाल-बच्चा के लेके ऊंचा जगह चाहे राहत शिविर में चल जाईं। पानी बिना खउलवले मत पीईं आ घर के मेन स्विच काट दीं। मदद खातिर 1070 पर तुरंते फोन लगाईं।'
  },
  maithili: {
    title: 'मैथिली बाढ़ि चेतावनी',
    dialectName: 'मैथिली (Maithili)',
    announcementText: 'सतर्क रहू! मिथिलांचल में कोसी, कमला बलान आ बागमती नदीक जलस्तर खतराक निशान सँ बेसी ऊपर बहिरहल अछि। दियाराक सब गोटे अपन परिवार सहित तुरंत ऊंच स्थान अथवा सरकारी राहत शिविर दिस प्रस्थान करू। चापाकलक पानिक बदला उबायल पानि पीबू। कोनो विपतिक समय 1070 पर तुरंत संपर्क करू।'
  },
  en: {
    title: 'English Emergency Broadcast',
    dialectName: 'English',
    announcementText: 'Urgent Flood Alert! Major rivers including Kosi, Bagmati, Gandak, and Ganga are flowing above the danger level across Bihar. Residents in low-lying diaras and riverine belts must immediately evacuate to designated government shelters. Disconnect main electrical breakers and boil drinking water. For rescue boats, call 1070 or NDRF Bihta immediately.'
  }
};

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakFloodAlert(
  dialect: Dialect,
  customText?: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const textToSpeak = customText || DIALECT_ANNOUNCEMENTS[dialect].announcementText;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  // Set appropriate language code
  if (dialect === 'en') {
    utterance.lang = 'en-IN';
  } else {
    utterance.lang = 'hi-IN'; // Standard Hindi voice handles Bhojpuri and Maithili phonetics well
  }

  utterance.rate = 0.95; // Slightly slower for clear rural loudspeaker tone
  utterance.pitch = 1.05;

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopFloodVoice(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeakingVoice(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
