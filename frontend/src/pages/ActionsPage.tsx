import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  Lock, 
  ExternalLink,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { analyzeScenario } from '../services/api';
import { RecommendedAction, UserSituation } from '../types';

export const ActionsPage: React.FC = () => {
  const { language, setLanguage, speak } = useLanguage();
  const [selectedState, setSelectedState] = useState<UserSituation>('BEFORE_PAYMENT');
  const [actions, setActions] = useState<RecommendedAction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActions = async (st: UserSituation) => {
    setLoading(true);
    try {
      // Analyze with blank or situation to trigger deterministic actions
      const res = await analyzeScenario("investigate situation", st, language);
      setActions(res.recommended_actions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions(selectedState);
  }, [selectedState, language]);

  const stateTabs = [
    { key: 'BEFORE_PAYMENT' as UserSituation, label: 'Before Payment', desc: 'Considering sending money' },
    { key: 'UNDER_PRESSURE' as UserSituation, label: 'Under Pressure', desc: 'Threats & urgent demands' },
    { key: 'PAYMENT_ALREADY_SENT' as UserSituation, label: 'Payment Sent', desc: 'Golden Hour fund freezing' },
    { key: 'CREDENTIALS_DISCLOSED' as UserSituation, label: 'Credentials Shared', desc: 'OTP / AnyDesk disclosed' },
    { key: 'SUSPECTED_RECOVERY_SCAM' as UserSituation, label: 'Recovery Scam', desc: 'Fake recovery agents' },
    { key: 'INSUFFICIENT_INFORMATION' as UserSituation, label: 'Uncertain Context', desc: 'Inconclusive signals' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="rounded-3xl gradient-navy text-white p-8 sm:p-10 border border-navy-700 space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Deterministic State Machine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Context-Aware Safety Action Policies
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          Predefined, legally vetted safety guidance. Designed so that untrusted user input or malicious prompt injections can never override safety recommendations.
        </p>
      </div>

      {/* State Switcher Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stateTabs.map((tab) => {
          const isSelected = selectedState === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedState(tab.key)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-700 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold">{tab.label}</div>
              <div className={`text-[11px] mt-1 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                {tab.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Recommended Action Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Prioritized Action Steps for: <span className="text-teal-700 font-mono">{selectedState}</span>
          </h2>
          <button
            onClick={() => speak(actions.map(a => `${a.priority}. ${a.title}`).join('. '))}
            className="text-xs text-teal-700 hover:underline flex items-center gap-1 font-semibold"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Read All Aloud</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading safety actions...</div>
        ) : (
          <div className="space-y-3">
            {actions.map((act) => (
              <div 
                key={act.priority}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {act.priority}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{act.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-semibold">
                      {act.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {act.description}
                  </p>
                  {act.official_links && act.official_links.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {act.official_links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-teal-700 hover:text-teal-800 hover:underline inline-flex items-center gap-1 font-bold"
                        >
                          <span>{link.name}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
