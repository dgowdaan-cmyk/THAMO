import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appName: 'THAMO',
    tagline: 'Pause. Understand. Protect your next step.',
    emergencyHelpline: 'Emergency: Dial 1930',
    navHome: 'Home',
    navAnalyze: 'Evidence Scanner',
    navBeforePayment: 'Before Payment',
    navUnderPressure: 'Under Pressure',
    navAfterFraud: 'After Incident',
    navTimeline: 'Pressure Timeline',
    navActions: 'Action Guide',
    navResources: 'Official Helplines',
    navPrivacy: 'Privacy & Data',
    navEvaluation: 'Judge Evaluation',
    heroQuestion: 'What is happening right now?',
    heroSubtitle: 'Choose your immediate situation for tailored safety instructions and risk assessment.',
    cardBeforePaymentTitle: 'I am about to send money',
    cardBeforePaymentDesc: 'Considering an investment pitch, trading group, or stock advisory offer.',
    cardUnderPressureTitle: 'Someone is pressuring me',
    cardUnderPressureDesc: 'Facing urgent deadlines, legal threats, digital arrest, or account freeze intimidation.',
    cardAfterFraudTitle: 'I have already paid or shared info',
    cardAfterFraudDesc: 'Transferred funds, shared OTP/passwords, or contacted by a fund recovery agent.',
    startScan: 'Start Safety Scan',
    viewProtocol: 'View Safety Protocol',
    actNow: 'Immediate Steps',
    quickScanTitle: 'Quick Message Risk Check',
    quickScanPlaceholder: 'Paste suspicious message, WhatsApp message, Telegram pitch, or investment claim here...',
    checkRiskBtn: 'Analyze Suspicious Content',
    analyzing: 'Analyzing Evidence...',
    readAloud: 'Read Aloud',
    stopSpeech: 'Stop Audio',
    sebiCharterNote: 'Created for SANGYAN Hackathon (SNTC, IIT BHU) in collaboration with SEBI & NSDL',
    privacyBadge: 'Zero Cloud Logging • Redacts Personal Data Locally • Deterministic Safety Machine'
  },
  hi: {
    appName: 'थामो (THAMO)',
    tagline: 'रुकें। समझें। अगला कदम सुरक्षित उठाएं।',
    emergencyHelpline: 'आपातकालीन: 1930 डायल करें',
    navHome: 'होम',
    navAnalyze: 'साक्ष्य स्कैनर',
    navBeforePayment: 'भुगतान से पहले',
    navUnderPressure: 'दबाव की स्थिति',
    navAfterFraud: 'धोखाधड़ी के बाद',
    navTimeline: 'प्रेशर टाइमलाइन',
    navActions: 'सुरक्षा मार्गदर्शिका',
    navResources: 'आधिकारिक हेल्पलाइन',
    navPrivacy: 'गोपनीयता नियंत्रण',
    navEvaluation: 'मूल्यांकन डैशबोर्ड',
    heroQuestion: 'इस समय आपके साथ क्या हो रहा है?',
    heroSubtitle: 'सही और त्वरित सुरक्षा मार्गदर्शन के लिए अपनी वर्तमान स्थिति चुनें।',
    cardBeforePaymentTitle: 'मैं पैसे भेजने की सोच रहा हूँ',
    cardBeforePaymentDesc: 'किसी नए निवेश ऑफर, व्हाट्सएप/टेलीग्राम ग्रुप या शेयर टिप्स पर विचार कर रहे हैं।',
    cardUnderPressureTitle: 'मुझ पर दबाव बनाया जा रहा है',
    cardUnderPressureDesc: 'तुरंत पैसे भेजने की धमकी, कानूनी कार्रवाई, डिजिटल अरेस्ट या खाता सीज करने का डर।',
    cardAfterFraudTitle: 'मैं पैसे भेज चुका हूँ या जानकारी साझा कर दी है',
    cardAfterFraudDesc: 'बैंक से पैसे कट चुके हैं, ओटीपी शेयर कर दिया है या कोई पैसा वापस दिलाने का दावा कर रहा है।',
    startScan: 'सुरक्षा जांच शुरू करें',
    viewProtocol: 'सुरक्षा निर्देश देखें',
    actNow: 'तत्काल कदम उठाएं',
    quickScanTitle: 'संदिग्ध संदेश की त्वरित जांच',
    quickScanPlaceholder: 'यहाँ संदिग्ध मैसेज, व्हाट्सएप संदेश या टेलीग्राम ऑफर पेस्ट करें...',
    checkRiskBtn: 'संदिग्ध सामग्री की जांच करें',
    analyzing: 'विश्लेषण हो रहा है...',
    readAloud: 'सुनें (बोलकर बताएं)',
    stopSpeech: 'आवाज रोकें',
    sebiCharterNote: 'आईआईटी (बीएचयू) के संज्ञान हैकथॉन (SEBI और NSDL सहयोग) हेतु निर्मित',
    privacyBadge: 'शून्य क्लाउड लॉगिंग • व्यक्तिगत डेटा का स्वतः विलोपन • सुरक्षित इंजन'
  },
  kn: {
    appName: 'ಥಾಮೋ (THAMO)',
    tagline: 'ನಿಲ್ಲಿಸಿ. ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಮುಂದಿನ ಹೆಜ್ಜೆಯನ್ನು ರಕ್ಷಿಸಿ.',
    emergencyHelpline: 'ತುರ್ತು ಸಹಾಯವಾಣಿ: 1930',
    navHome: 'ಮುಖಪುಟ',
    navAnalyze: 'ಪುರಾವೆ ಸ್ಕ್ಯಾನರ್',
    navBeforePayment: 'ಪಾವತಿಗೆ ಮುನ್ನ',
    navUnderPressure: 'ಒತ್ತಡದ ಸ್ಥಿತಿಯಲ್ಲಿ',
    navAfterFraud: 'ವಂಚನೆಯ ನಂತರ',
    navTimeline: 'ಒತ್ತಡದ ಟೈಮ್‌ಲೈನ್',
    navActions: 'ಕ್ರಮಗಳ ಮಾರ್ಗದರ್ಶಿ',
    navResources: 'ಅಧಿಕೃತ ಸಹಾಯವಾಣಿಗಳು',
    navPrivacy: 'ಗೌಪ್ಯತೆ ನಿಯಂತ್ರಣ',
    navEvaluation: 'ಮೌಲ್ಯಮಾಪನ ವರದಿ',
    heroQuestion: 'ಈಗ ನಿಮ್ಮೊಂದಿಗೆ ಏನಾಗುತ್ತಿದೆ?',
    heroSubtitle: 'ನಿಖರವಾದ ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    cardBeforePaymentTitle: 'ನಾನು ಹಣ ಕಳುಹಿಸಲು ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ',
    cardBeforePaymentDesc: 'ಹೊಸ ಹೂಡಿಕೆ ಆಫರ್, ವಾಟ್ಸಾಪ್ ಗ್ರೂಪ್ ಅಥವಾ ಟ್ರೇಡಿಂಗ್ ಸಲಹೆಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದೀರಾ.',
    cardUnderPressureTitle: 'ಯಾರೋ ನನ್ನ ಮೇಲೆ ಒತ್ತಡ ಹೇರುತ್ತಿದ್ದಾರೆ',
    cardUnderPressureDesc: 'ತಕ್ಷಣ ಹಣ ಕಳುಹಿಸಲು ಬೆದರಿಕೆ, ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್, ಅಥವಾ ಖಾತೆ ರದ್ದತಿಯ ಭಯ ಎದುರಿಸುತ್ತಿದ್ದೀರಾ.',
    cardAfterFraudTitle: 'ನಾನು ಈಗಾಗಲೇ ಹಣ ಕಳುಹಿಸಿದ್ದೇನೆ ಅಥವಾ ಮಾಹಿತಿ ಹಂಚಿಕೊಂಡಿದ್ದೇನೆ',
    cardAfterFraudDesc: 'ಹಣ ಕಡಿತವಾಗಿದೆ, ಒಟಿಪಿ ನೀಡಿದ್ದೀರಿ, ಅಥವಾ ಹಣ ವಾಪಸ್ ಕೊಡಿಸುತ್ತೇವೆ ಎಂಬ ನಕಲಿ ಕರೆ ಬಂದಿದೆ.',
    startScan: 'ಸುರಕ್ಷತಾ ತಪಾಸಣೆ',
    viewProtocol: 'ಸುರಕ್ಷತಾ ನಿಯಮಗಳು',
    actNow: 'ತಕ್ಷಣದ ಕ್ರಮಗಳು',
    quickScanTitle: 'ಅನುಮಾನಾಸ್ಪದ ಸಂದೇಶದ ತ್ವರಿತ ಪರಿಶೀಲನೆ',
    quickScanPlaceholder: 'ಅನುಮಾನಾಸ್ಪದ ವಾಟ್ಸಾಪ್ ಅಥವಾ ಟೆಲಿಗ್ರಾಂ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ...',
    checkRiskBtn: 'ಸಂದೇಶ ಪರಿಶೀಲಿಸಿ',
    analyzing: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    readAloud: 'ಓದಿ ಕೇಳಿ',
    stopSpeech: 'ನಿಲ್ಲಿಸಿ',
    sebiCharterNote: 'ಐಐಟಿ ಬಿಎಚ್‌ಯು ಸಂಜ್ಞಾನ್ ಹ್ಯಾಕಥಾನ್ (ಸೆಬಿ ಮತ್ತು ಎನ್‌ಎಸ್‌ಡಿಎಲ್ ಸಹಯೋಗದಲ್ಲಿ) ರೂಪಿಸಲಾಗಿದೆ',
    privacyBadge: 'ಕ್ಲೌಡ್ ಶೇಖರಣೆ ರಹಿತ • ವೈಯಕ್ತಿಕ ವಿವರಗಳ ಸ್ವಯಂಚಾಲಿತ ಮರೆಮಾಚುವಿಕೆ • ಸುರಕ್ಷಿತ ಎಂಜಿನ್'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('thamo_lang');
    return (saved as Language) || 'en';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const activeAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const activeUtteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = React.useRef<SpeechSynthesisVoice[]>([]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('thamo_lang', lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const stopSpeaking = () => {
    // Stop any active HTML5 audio element
    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      } catch (e) {
        // ignore
      }
      activeAudioRef.current = null;
    }

    // Stop browser speechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
      activeUtteranceRef.current = null;
      (window as any).__thamo_active_utterance = null;
    }

    setIsSpeaking(false);
  };

  const getBestVoice = (lang: Language, voiceList?: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    let available = voiceList && voiceList.length > 0 ? voiceList : voicesRef.current;
    if ((!available || available.length === 0) && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      available = window.speechSynthesis.getVoices();
    }
    if (!available || available.length === 0) return null;

    if (lang === 'hi') {
      const hi = available.find(v => 
        v.lang.toLowerCase().includes('hi') || 
        v.name.toLowerCase().includes('hindi') || 
        v.name.toLowerCase().includes('kalpana') || 
        v.name.toLowerCase().includes('hemant')
      );
      if (hi) return hi;
    } else if (lang === 'kn') {
      const kn = available.find(v => 
        v.lang.toLowerCase().includes('kn') || 
        v.name.toLowerCase().includes('kannada') || 
        v.name.toLowerCase().includes('sapna')
      );
      if (kn) return kn;
    }

    // Default to Indian English if available
    const enIn = available.find(v => 
      v.lang.toLowerCase() === 'en-in' || 
      v.name.toLowerCase().includes('india') || 
      v.name.toLowerCase().includes('heera') || 
      v.name.toLowerCase().includes('ravi')
    );
    if (enIn) return enIn;

    // Fall back to any installed English voice (e.g. Microsoft David, Microsoft Zira)
    const en = available.find(v => v.lang.toLowerCase().startsWith('en'));
    if (en) return en;

    return available[0] || null;
  };

  const speakWithBrowserSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text.trim());
      activeUtteranceRef.current = utterance;
      (window as any).__thamo_active_utterance = utterance;

      const currentVoices = window.speechSynthesis.getVoices();
      const bestVoice = getBestVoice(language, currentVoices);

      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }

      utterance.rate = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        activeUtteranceRef.current = null;
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        activeUtteranceRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Browser speech synthesis error:', err);
      setIsSpeaking(false);
    }
  };

  const speak = (text: string) => {
    if (!text || !text.trim()) return;

    // Stop whatever is currently playing
    stopSpeaking();

    const cleanText = text.trim();

    // Primary Engine: Native high-fidelity audio stream from THAMO backend (100% reliable HTML5 Audio)
    const backendAudioUrl = `http://127.0.0.1:8000/api/tts?text=${encodeURIComponent(cleanText)}&lang=${language}`;
    const audio = new Audio(backendAudioUrl);
    activeAudioRef.current = audio;

    audio.onplay = () => {
      setIsSpeaking(true);
    };

    audio.onended = () => {
      setIsSpeaking(false);
      activeAudioRef.current = null;
    };

    audio.onerror = (e) => {
      console.warn('Backend audio stream unavailable, switching to browser speech fallback:', e);
      speakWithBrowserSpeech(cleanText);
    };

    audio.play().catch((err) => {
      console.warn('HTML5 audio play blocked or failed, attempting browser speech fallback:', err);
      speakWithBrowserSpeech(cleanText);
    });
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, speak, stopSpeaking, isSpeaking }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
