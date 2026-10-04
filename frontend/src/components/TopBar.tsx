import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Menu, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { language, setLanguage, isSpeaking, stopSpeaking, t } = useLanguage();
  const location = useLocation();

  const getPageTitle = (path: string): string => {
    switch (path) {
      case '/': return 'Home Dashboard';
      case '/analyze': return 'Multi-Signal Evidence Scanner';
      case '/before-payment': return 'Before Payment Safety Protocol';
      case '/under-pressure': return 'Under Pressure / Coercion Defense';
      case '/after-fraud': return 'After Incident & Golden Hour Action';
      case '/timeline': return 'Signature Pressure Arc Timeline';
      case '/actions': return 'Context-Aware Action Policies';
      case '/resources': return 'Curated Official Helplines & Registries';
      case '/evaluation': return 'SANGYAN Benchmark & Accuracy Metrics';
      case '/privacy': return 'Privacy Architecture & Data Controls';
      default: return 'Investor Protection';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
      
      {/* Left: Mobile Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">THAMO</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">
            {getPageTitle(location.pathname)}
          </span>
        </div>
      </div>

      {/* Right Controls: Audio, Language Selector, 1930 */}
      <div className="flex items-center gap-2.5">
        
        {/* Audio Speech Player Status */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-700 text-xs font-bold animate-pulse"
            title="Stop audio playback"
          >
            <VolumeX className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">Stop Audio</span>
          </button>
        )}

        {/* Bharat-First Language Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-white text-teal-900 shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              language === 'hi'
                ? 'bg-white text-teal-900 shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLanguage('kn')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              language === 'kn'
                ? 'bg-white text-teal-900 shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ಕನ್ನಡ
          </button>
        </div>

        {/* Verified Regulator Badge */}
        <div className="hidden xl:flex items-center gap-1 text-[11px] text-slate-500 font-medium px-2 py-1 rounded-lg bg-slate-50 border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>SEBI & NSDL Collaborative</span>
        </div>

        {/* Direct Helpline Badge */}
        <a
          href="tel:1930"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
          title="Direct Toll-Free Dial 1930"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="font-mono">1930</span>
        </a>

      </div>
    </header>
  );
};
