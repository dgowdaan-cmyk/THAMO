import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  ArrowRight, 
  AlertTriangle, 
  Activity, 
  PhoneCall, 
  Volume2, 
  Search, 
  CheckCircle2, 
  Lock, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { analyzeScenario } from '../services/api';
import { AnalysisResponse } from '../types';

export const HomePage: React.FC = () => {
  const { t, language, speak, isSpeaking, stopSpeaking } = useLanguage();
  const navigate = useNavigate();

  const [quickText, setQuickText] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickResult, setQuickResult] = useState<AnalysisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleQuickAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickText.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await analyzeScenario(quickText, 'BEFORE_PAYMENT', language);
      setQuickResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Analysis failed. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sampleType: 'guaranteed' | 'pressure' | 'recovery') => {
    if (sampleType === 'guaranteed') {
      if (language === 'hi') {
        setQuickText('नमस्ते, हमारे सेबी प्रमाणित क्लब से जुड़ें। 50,000 रुपये लगाएं और हर महीने निश्चित मुनाफा व गारंटीड रिटर्न पाएं। तुरंत पैसे भेजें।');
      } else if (language === 'kn') {
        setQuickText('ನಮಸ್ಕಾರ, ನಮ್ಮ ವಿಐಪಿ ಟ್ರೇಡಿಂಗ್ ಗ್ರೂಪ್‌ನಲ್ಲಿ ಹೂಡಿಕೆ ಮಾಡಿ. ದಿನಕ್ಕೆ 10% ಖಚಿತ ಆದಾಯ ಮತ್ತು ಖಾತರಿ ಲಾಭ ಸಿಗುತ್ತದೆ. ತಕ್ಷಣ ಹಣ ಕಳುಹಿಸಿ.');
      } else {
        setQuickText('Hello sir, invest Rs 10,000 in our institutional trading pool and get guaranteed return of 100% within 7 days. Zero risk assured by SEBI certified team. Offer expires today!');
      }
    } else if (sampleType === 'pressure') {
      if (language === 'hi') {
        setQuickText('सुप्रीम कोर्ट और सीबीआई का नोटिस! आपका बैंक खाता फ्रीज कर दिया जाएगा। डिजिटल अरेस्ट से बचने के लिए तुरंत पेनल्टी भरें।');
      } else if (language === 'kn') {
        setQuickText('ಪೊಲೀಸ್ ಇಲಾಖೆಯಿಂದ ತುರ್ತು ವಾರೆಂಟ್! ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್ ಮಾಡಲಾಗುವುದು ಮತ್ತು ಖಾತೆ ಜಪ್ತಿ ಮಾಡಲಾಗುವುದು. ದಂಡವನ್ನು ತಕ್ಷಣ ಪಾವತಿಸಿ.');
      } else {
        setQuickText('CBI and Police have issued an immediate arrest warrant for illegal trading. Your bank account will be frozen within 2 hours. Transfer Rs 25,000 penalty immediately to clear your name.');
      }
    } else {
      if (language === 'hi') {
        setQuickText('क्या आपका पैसा ऑनलाइन ट्रेडिंग में डूब गया है? हमारे साइबर एथिकल हैकर्स डूबा हुआ पैसा 48 घंटे में वापस दिलाएंगे। छोटी रजिस्ट्रेशन फीस जमा करें।');
      } else if (language === 'kn') {
        setQuickText('ಆನ್‌ಲೈನ್ ಸ್ಕ್ಯಾಮ್‌ನಲ್ಲಿ ಕಳೆದುಹೋದ ಹಣ ಮರಳಿ ಪಡೆಯಿರಿ. ನಮ್ಮ ಸೈಬರ್ ತಂಡವು ನಿಮ್ಮ ಹಣವನ್ನು ಹಿಂತಿರುಗಿಸುತ್ತದೆ. ಮುಂಗಡ ನೋಂದಣಿ ಶುಲ್ಕ ನೀಡಿ.');
      } else {
        setQuickText('Did you lose funds in a Telegram crypto scam? Our certified cyber ethical hacker team can recover your lost money within 48 hours for an advance investigation fee.');
      }
    }
  };

  const readHeroSection = () => {
    const speechContent = `${t('appName')}. ${t('tagline')}. ${t('heroQuestion')}. Option 1: ${t('cardBeforePaymentTitle')}. Option 2: ${t('cardUnderPressureTitle')}. Option 3: ${t('cardAfterFraudTitle')}.`;
    speak(speechContent);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Situation Banner */}
      <section className="relative overflow-hidden rounded-3xl gradient-navy text-white px-6 py-12 sm:px-12 sm:py-16 shadow-2xl border border-navy-700">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>{t('privacyBadge')}</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-sans">
              {t('heroQuestion')}
            </h1>
            <button
              onClick={readHeroSection}
              className="p-2 rounded-full bg-navy-800 hover:bg-navy-700 text-teal-300 border border-navy-600 transition-colors"
              title={t('readAloud')}
              aria-label="Read hero instructions aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* 3 Prominent User Journey Choices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
            
            {/* Journey 1: Before Payment */}
            <div 
              onClick={() => navigate('/before-payment')}
              className="group cursor-pointer rounded-2xl p-6 bg-navy-800/90 hover:bg-navy-750 border-2 border-navy-700 hover:border-teal-400/80 transition-all shadow-lg hover:shadow-teal-500/10 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                  {t('cardBeforePaymentTitle')}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('cardBeforePaymentDesc')}
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform">
                <span>{t('viewProtocol')}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Journey 2: Under Pressure */}
            <div 
              onClick={() => navigate('/under-pressure')}
              className="group cursor-pointer rounded-2xl p-6 bg-navy-800/90 hover:bg-navy-750 border-2 border-navy-700 hover:border-amber-400/80 transition-all shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 border border-red-400/30 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {t('cardUnderPressureTitle')}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('cardUnderPressureDesc')}
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>{t('actNow')}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Journey 3: After Suspected Fraud */}
            <div 
              onClick={() => navigate('/after-fraud')}
              className="group cursor-pointer rounded-2xl p-6 bg-navy-800/90 hover:bg-navy-750 border-2 border-navy-700 hover:border-red-400/80 transition-all shadow-lg hover:shadow-red-500/10 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-400/30 flex items-center justify-center">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                  {t('cardAfterFraudTitle')}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('cardAfterFraudDesc')}
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-teal-300 group-hover:translate-x-1 transition-transform">
                <span>{t('actNow')}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Quick Interactive Risk Scanner */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Search className="w-6 h-6 text-teal-600" />
                {t('quickScanTitle')}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Enter any pitch, promise, or demand to extract verifiable warning indicators.
              </p>
            </div>
            
            {/* Demo Sample Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Load Demo:</span>
              <button
                type="button"
                onClick={() => loadSample('guaranteed')}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Guaranteed 100%
              </button>
              <button
                type="button"
                onClick={() => loadSample('pressure')}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Digital Arrest
              </button>
              <button
                type="button"
                onClick={() => loadSample('recovery')}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Fund Recovery
              </button>
            </div>
          </div>

          <form onSubmit={handleQuickAnalyze} className="space-y-4">
            <div className="relative">
              <textarea
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                placeholder={t('quickScanPlaceholder')}
                rows={4}
                className="w-full rounded-2xl border-2 border-slate-200 p-4 text-slate-800 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all font-sans"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-600" />
                <span>Sensitive PII (PAN, Phone, Aadhaar, Bank Details) is automatically redacted before analysis.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/analyze')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
                >
                  Advanced OCR / URL Scan
                </button>
                <button
                  type="submit"
                  disabled={loading || !quickText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-bold shadow-md hover:shadow-teal-500/20 transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <span>{t('analyzing')}</span>
                  ) : (
                    <>
                      <span>{t('checkRiskBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Quick Result Preview */}
          {quickResult && (
            <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    quickResult.risk_level === 'critical' ? 'bg-red-100 text-red-800' :
                    quickResult.risk_level === 'high' ? 'bg-orange-100 text-orange-800' :
                    quickResult.risk_level === 'moderate' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {quickResult.risk_level} Risk Level
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Score: {quickResult.risk_score} / 100
                  </span>
                </div>
                <button
                  onClick={() => isSpeaking ? stopSpeaking() : speak(quickResult.primary_finding)}
                  className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isSpeaking ? 'text-red-600 animate-pulse' : 'text-teal-700 hover:underline'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? t('stopSpeech') : t('readAloud')}</span>
                </button>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {quickResult.primary_finding}
              </p>

              {/* Detected indicators */}
              {quickResult.evidence_items.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Observable Evidence Signals ({quickResult.evidence_items.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickResult.evidence_items.map((ev) => (
                      <div key={ev.evidence_id} className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-red-700">{ev.indicator_category}</span>
                        <p className="text-slate-600 italic">"{ev.exact_phrase}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  No standard scam keywords observed in this snippet. (Note: Always verify advisor credentials on SEBI before sending funds).
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {quickResult.timeline_stages.filter(s => s.status === 'detected').length} pressure stage(s) matched.
                </span>
                <button
                  onClick={() => navigate('/analyze')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <span>Open Full Evidence Report & Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Pressure Timeline</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Deconstructs the manipulative arc from initial contact and fake returns to urgent deadlines and secondary recovery traps.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Deterministic Safety Machine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Safety guidance is un-overridable by LLM prompts. Core actions are deterministic, tested, and aligned with SEBI and RBI regulations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Bharat-First & Privacy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Native English, Hindi, and Kannada support with text-to-speech. PII is automatically redacted before analysis and logs are sanitized.
          </p>
        </div>
      </section>

    </div>
  );
};
