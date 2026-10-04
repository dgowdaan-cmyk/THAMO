import React, { useState } from 'react';
import { 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowDown, 
  Search, 
  Volume2,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { analyzeScenario } from '../services/api';
import { TimelineStage } from '../types';

export const TimelinePage: React.FC = () => {
  const { speak, language } = useLanguage();

  const [inputSnippet, setInputSnippet] = useState(
    "Join our VIP Telegram channel! SEBI authorized insider group. Invest 10k, get guaranteed 100% daily profit. Act now, 2 slots left! Send OTP to join. If you try to leave, your trading account will be frozen."
  );
  const [stages, setStages] = useState<TimelineStage[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    if (!inputSnippet.trim()) return;
    setLoading(true);
    try {
      const res = await analyzeScenario(inputSnippet, 'BEFORE_PAYMENT', language);
      setStages(res.timeline_stages);
    } catch (err) {
      alert('Could not generate timeline. Backend error.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleSimulate();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Title */}
      <div className="rounded-3xl gradient-navy text-white p-8 sm:p-10 border border-navy-700 space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
          <Clock className="w-4 h-4" />
          <span>THAMO Signature Feature</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          The Pressure Progression Timeline
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          Deconstruct how financial coercion and fraudulent traps evolve. Every stage is strictly derived from observable evidence — never fabricated or assumed.
        </p>
      </div>

      {/* Simulator input box */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Inspect Snippet on Pressure Arc:
        </label>
        <textarea
          value={inputSnippet}
          onChange={(e) => setInputSnippet(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-slate-300 p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Re-calculating Arc...' : 'Trace Pressure Stages'}</span>
          </button>
        </div>
      </div>

      {/* Timeline Steps Display */}
      {stages && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>Observable Progression Flow:</span>
            <span>{stages.filter(s => s.status === 'detected').length} of {stages.length} stages identified</span>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-teal-500/30 space-y-8">
            {stages.map((stage, idx) => {
              const isDetected = stage.status === 'detected';
              const isUnknown = stage.status === 'unknown';

              return (
                <div key={stage.stage_id} className="relative group">
                  {/* Status Dot */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    isDetected
                      ? 'bg-red-600 border-red-300 text-white shadow-md'
                      : isUnknown
                      ? 'bg-slate-200 border-slate-300 text-slate-600'
                      : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  }`}>
                    {stage.stage_order}
                  </div>

                  {/* Stage Card */}
                  <div className={`p-6 rounded-2xl border transition-all ${
                    isDetected 
                      ? 'bg-white border-red-200 shadow-md ring-1 ring-red-500/10' 
                      : 'bg-slate-50/70 border-slate-200 opacity-80'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-900">
                        {stage.stage_name}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono ${
                        isDetected
                          ? 'bg-red-100 text-red-800'
                          : isUnknown
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {stage.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3 text-xs sm:text-sm">
                      {/* Supporting Evidence Quote */}
                      <div>
                        <span className="font-bold text-slate-700 text-xs block mb-1">Supporting Evidence:</span>
                        <p className={`p-3 rounded-xl border text-xs font-mono italic ${
                          isDetected ? 'bg-red-50/50 border-red-200 text-red-950' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                          {stage.supporting_evidence}
                        </p>
                      </div>

                      {/* Why it matters */}
                      <div>
                        <span className="font-bold text-slate-700 text-xs block mb-0.5">Why This Stage Matters:</span>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          {stage.indicator_meaning}
                        </p>
                      </div>

                      {/* Uncertainty & Limitation */}
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-start gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span><strong>Methodological Limitation:</strong> {stage.uncertainty_note}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
