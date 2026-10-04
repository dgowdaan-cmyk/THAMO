import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, 
  Menu, 
  X, 
  PhoneCall, 
  Languages, 
  Volume2, 
  VolumeX, 
  Search, 
  Activity, 
  Clock, 
  Lock, 
  Award,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, isSpeaking, stopSpeaking } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('navHome'), icon: ShieldAlert },
    { to: '/analyze', label: t('navAnalyze'), icon: Search },
    { to: '/before-payment', label: t('navBeforePayment'), icon: AlertTriangle },
    { to: '/under-pressure', label: t('navUnderPressure'), icon: Activity },
    { to: '/after-fraud', label: t('navAfterFraud'), icon: PhoneCall },
    { to: '/timeline', label: t('navTimeline'), icon: Clock },
    { to: '/actions', label: t('navActions'), icon: Award },
    { to: '/resources', label: t('navResources'), icon: PhoneCall },
    { to: '/evaluation', label: t('navEvaluation'), icon: Award },
    { to: '/privacy', label: t('navPrivacy'), icon: Lock },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-navy-700 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-accent group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                  THAMO
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-900/60 border border-teal-500/30 text-teal-300 font-medium">
                  SANGYAN 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block tracking-wide">
                Pause. Understand. Protect your next step.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.slice(0, 7).map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-colors ${
                    active
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Toolbar: Language, Audio, 1930 Helpline */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Audio Toggle if playing */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold animate-pulse"
                title="Stop read-aloud playback"
              >
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Stop Audio</span>
              </button>
            )}

            {/* Language Selector */}
            <div className="flex items-center bg-navy-800 border border-navy-600 rounded-lg p-0.5">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  language === 'hi'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('kn')}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  language === 'kn'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Helpline 1930 Emergency Badge */}
            <a
              href="tel:1930"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold shadow-md transition-all border border-red-400/40 group"
              title="Call National Cyber Crime Financial Fraud Helpline 1930 (Toll-Free)"
            >
              <PhoneCall className="w-3.5 h-3.5 group-hover:animate-bounce" />
              <span className="font-mono">1930</span>
              <span className="hidden md:inline font-normal text-[11px] opacity-90">Helpline</span>
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-navy-800 text-slate-300 hover:text-white border border-navy-600"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-navy-700 bg-navy-900 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => {
            const active = isActive(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'text-slate-300 hover:bg-navy-800'
                }`}
              >
                <Icon className="w-4 h-4 text-teal-400" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-navy-800 text-xs text-slate-400 text-center">
            {t('sebiCharterNote')}
          </div>
        </div>
      )}
    </header>
  );
};
