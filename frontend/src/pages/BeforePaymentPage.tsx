import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  StopCircle, 
  FileText,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const BeforePaymentPage: React.FC = () => {
  const { t, speak } = useLanguage();
  const navigate = useNavigate();

  const readGuide = () => {
    speak(
      "Before payment safety protocol. Rule number one: Stop and pause. No legitimate investment requires an immediate transfer within hours. " +
      "Rule number two: Always verify advisor registration on the official SEBI register. Registered advisors never demand money in personal bank accounts."
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="rounded-3xl gradient-navy text-white p-8 sm:p-10 border border-navy-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <AlertTriangle className="w-4 h-4" />
            <span>Workflow 1: Before Payment</span>
          </div>
          <button
            onClick={readGuide}
            className="p-2 rounded-full bg-navy-800 text-teal-300 hover:bg-navy-700 transition-colors"
            title="Read protocol aloud"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Considering Sending Money? Stop & Verify First.
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          High-pressure investment offers rely on artificial scarcity and emotional excitement. Follow this 4-step verification protocol to safeguard your capital.
        </p>
      </div>

      {/* Protocol Steps */}
      <div className="space-y-6">
        
        {/* Step 1 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              The 24-Hour Cooling Rule: Pause Immediately
            </h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed pl-12">
            No legitimate financial investment window closes in 15 minutes. Scammers construct artificial deadlines ("only 2 slots left", "offer expires tonight") to disable your rational checks. Take a mandatory 24-hour pause before transferring any funds.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Check the Official SEBI Intermediary Register
            </h3>
          </div>
          <div className="pl-12 space-y-3">
            <p className="text-sm text-slate-600 leading-relaxed">
              Anyone claiming to provide investment advice, manage funds, or offer research reports in India MUST hold a valid SEBI registration number (e.g., INA... or INH...).
            </p>
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs space-y-2">
              <span className="font-bold block">Critical Rule on Personal Accounts:</span>
              <p>
                Even if someone provides a legitimate-looking SEBI certificate, check the bank beneficiary name. SEBI registered entities <strong>NEVER</strong> accept client investments into personal savings accounts or individual UPI IDs.
              </p>
            </div>
            <a
              href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
            >
              <span>Search SEBI Official Registry</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Do Not Trust Screenshots or PDF Certificates
            </h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed pl-12">
            Fraudulent Telegram and WhatsApp syndicates routinely photoshop SEBI registration logos, RBI approvals, and forged bank balance screenshots. A screenshot is zero proof of authenticity. Verify only directly on official government domains (.gov.in or .org.in).
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-sm">
              4
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Never Install AnyDesk / TeamViewer or Share OTPs
            </h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed pl-12">
            No advisor, bank, or stock exchange representative requires remote access to your device. Installing screen-sharing apps grants attackers real-time viewing of your banking credentials and incoming SMS OTPs.
          </p>
        </div>

      </div>

      {/* Action Footer Callout */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">Have a specific message or screenshot?</h4>
          <p className="text-xs text-slate-400 mt-1">Run it through the THAMO Evidence Scanner for multi-signal verification.</p>
        </div>
        <button
          onClick={() => navigate('/analyze')}
          className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-navy-900 font-bold text-sm flex items-center gap-2 transition-all shadow-md"
        >
          <Search className="w-4 h-4" />
          <span>Open Evidence Scanner</span>
        </button>
      </div>

    </div>
  );
};
