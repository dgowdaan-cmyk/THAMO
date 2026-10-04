import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  PhoneCall, 
  ShieldAlert, 
  Camera, 
  Ban, 
  Volume2, 
  ExternalLink,
  AlertOctagon
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const UnderPressurePage: React.FC = () => {
  const { t, speak } = useLanguage();
  const navigate = useNavigate();

  const readGuide = () => {
    speak(
      "Under pressure emergency response. If someone is threatening you with police arrest, CBI notices, or account freezing, disconnect immediately. " +
      "Law enforcement authorities in India never conduct digital arrests or demand money transfers over video calls. Call 1930 immediately."
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Alert Header */}
      <div className="rounded-3xl bg-gradient-to-br from-red-950 via-navy-900 to-navy-850 text-white p-8 sm:p-10 border border-red-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-400/40">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>Workflow 2: Under Pressure / Coercion</span>
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
          Facing Immediate Threats or Demands? Cut Communication Now.
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          Scammers weaponize fear using fake uniforms, legal notices, and simulated courtrooms. Recognize the manipulation and take safe, decisive countermeasures.
        </p>
      </div>

      {/* Digital Arrest Debunking Box */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>Statutory Truth: There is NO Legal Concept of "Digital Arrest"</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          The Ministry of Home Affairs, Indian Cyber Crime Coordination Centre (I4C), and SEBI have explicitly clarified: <strong>Neither the Police, CBI, ED, nor Courts ever initiate arrests or legal proceedings via WhatsApp/Skype video calls.</strong> They will NEVER ask you to deposit money to "verify innocence" or "safeguard funds".
        </p>
      </div>

      {/* Immediate Countermeasures */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Immediate Protective Actions
        </h2>

        {/* Action 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-100 text-red-600">
            <Ban className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">
              1. Disconnect the Call & Stop Chatting Immediately
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Do not engage or argue with the caller. Scammers are trained psychological manipulators who escalate threats the longer you stay on the line. Hang up right now.
            </p>
          </div>
        </div>

        {/* Action 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-teal-100 text-teal-700">
            <Camera className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">
              2. Preserve Evidence BEFORE Blocking
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Take full-screen screenshots displaying the sender's phone number, profile photo, UPI ID, and bank account numbers shared in the chat. Export the chat history if possible. You will need this for the 1930 cyber complaint.
            </p>
          </div>
        </div>

        {/* Action 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">
              3. Dial 1930 Helpline or Visit Nearest Cyber Police Station
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Report the phone number, WhatsApp account, and threats to the National Cybercrime Reporting Portal. If you feel physically unsafe, contact local police helpline 112 immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Dial Helplines */}
      <div className="p-6 rounded-3xl bg-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-navy-700">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">National Cyber Financial Fraud Helpline</span>
          <h3 className="text-2xl font-extrabold text-white font-mono">Dial 1930 (Toll Free)</h3>
          <p className="text-xs text-slate-400">Available across all States and Union Territories in India</p>
        </div>
        <a
          href="tel:1930"
          className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all animate-pulse"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call 1930 Now</span>
        </a>
      </div>

    </div>
  );
};
