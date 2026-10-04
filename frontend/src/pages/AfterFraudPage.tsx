import React from 'react';
import { 
  PhoneCall, 
  Clock, 
  ShieldAlert, 
  ExternalLink, 
  Lock, 
  FileCheck, 
  AlertTriangle,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AfterFraudPage: React.FC = () => {
  const { speak } = useLanguage();

  const readGuide = () => {
    speak(
      "Post-fraud incident response. Rule one: Act within the golden hour. Dial 1930 immediately to freeze beneficiary bank accounts. " +
      "Rule two: Contact your bank fraud desk to report the transaction reference. " +
      "Rule three: Beware of fund recovery scammers who ask for advance fees. Never pay anyone promising guaranteed recovery."
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="rounded-3xl gradient-navy text-white p-8 sm:p-10 border border-navy-700 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
            <Clock className="w-4 h-4" />
            <span>Workflow 3: Incident Response & Golden Hour</span>
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
          Transferred Money or Shared Info? Act in the Golden Hour.
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          Do not panic or blame yourself. Quick, structured action within the first 2 to 4 hours maximizes the probability of banks placing a lien on the recipient account.
        </p>
      </div>

      {/* Zero Blame & Realistic Expectations Banner */}
      <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 text-xs sm:text-sm leading-relaxed space-y-1">
        <span className="font-bold block text-teal-900">Empathetic Public Interest Note:</span>
        <p>
          Financial scams are engineered by organized cyber syndicates exploiting high-pressure psychological tactics. Experiencing fraud is not a personal failure. While fast reporting is critical, full recovery is never legally guaranteed. Beware of anyone who promises 100% guaranteed fund retrieval.
        </p>
      </div>

      {/* Step-by-Step Response Protocol */}
      <div className="space-y-4">
        
        {/* Step 1 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center text-sm shadow">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Dial 1930 Cyber Fraud Helpline (Immediate Priority)
                </h3>
                <span className="text-xs text-red-600 font-semibold">Toll-Free • 24x7 Citizen Cyber Financial Fraud Reporting</span>
              </div>
            </div>
            <a
              href="tel:1930"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow"
            >
              Call 1930
            </a>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-12">
            The 1930 helpline connects you with nodal officers from the Indian Cyber Crime Coordination Centre (I4C). If reported quickly, the system alerts the beneficiary bank to place an immediate hold or lien on the fraudster's account before the funds are withdrawn at an ATM or routed through mule accounts.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Contact Your Bank Fraud Desk & Note the UTR Number
              </h3>
              <span className="text-xs text-slate-500 font-medium">Under RBI 2017 Guidelines, zero-liability window applies within 3 days</span>
            </div>
          </div>
          <div className="pl-12 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Open your netbanking or banking app and copy the exact 12-digit <strong>UTR (Unique Transaction Reference)</strong> or UPI reference ID for each fraudulent transfer.
            </p>
            <p>
              Call your bank's fraud helpline, report unauthorized debits, and demand a written complaint reference number for your records.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Critical Warning: The "Recovery Scam" Secondary Trap
              </h3>
              <span className="text-xs text-amber-700 font-semibold">Do not lose money twice</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-2 ml-12">
            <p>
              Victims of financial fraud are frequently contacted on Instagram, Telegram, or WhatsApp by people claiming to be "ethical hackers", "cyber recovery agents", or "SEBI legal recovery advocates".
            </p>
            <p className="font-bold text-red-700">
              Never pay advance fees, registration charges, or cryptocurrency to any third party promising to retrieve your lost funds.
            </p>
            <p>
              Only law enforcement authorities and banks have the legal jurisdiction to freeze and restore funds under court order.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-sm shadow">
              4
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Lodge Formal FIR on cybercrime.gov.in
              </h3>
              <span className="text-xs text-slate-500 font-medium">Official Government Portal</span>
            </div>
          </div>
          <div className="pl-12 space-y-3">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Upload bank statements showing the debit transaction, screenshots of chats, payment slips, and phone numbers. Keep the complaint acknowledgement number safe.
            </p>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold transition-colors"
            >
              <span>Visit cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
