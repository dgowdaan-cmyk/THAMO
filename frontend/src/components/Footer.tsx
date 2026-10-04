import React from 'react';
import { ShieldCheck, ExternalLink, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-900 border-t border-navy-800 text-slate-400 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-wide">THAMO</span>
              <span className="text-xs px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-500/30">
                SANGYAN 2026
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
              AI-Powered Investor Harm Prevention & Incident-Response Platform. Built for the SANGYAN Hackathon organized by SNTC, IIT (BHU), in collaboration with SEBI and NSDL.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <Lock className="w-4 h-4" />
              <span>Privacy-by-Design: Raw evidence processed locally; zero persistent credentials.</span>
            </div>
          </div>

          {/* Quick Helplines */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Emergency Numbers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300 font-medium">Cyber Fraud Helpline:</span>{' '}
                <a href="tel:1930" className="text-teal-400 hover:underline font-mono">1930 (Toll Free)</a>
              </li>
              <li>
                <span className="text-slate-300 font-medium">SEBI Toll-Free:</span>{' '}
                <span className="font-mono">1800 266 7575</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">RBI Sachet Assist:</span>{' '}
                <span className="font-mono">14440</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">CDSL Toll-Free:</span>{' '}
                <span className="font-mono">1800-22-5533</span>
              </li>
            </ul>
          </div>

          {/* Official Portals */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Official Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="https://cybercrime.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 flex items-center gap-1"
                >
                  cybercrime.gov.in <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://scores.sebi.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 flex items-center gap-1"
                >
                  SEBI SCORES 2.0 <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://sachet.rbi.org.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 flex items-center gap-1"
                >
                  RBI Sachet Platform <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://nsdl.co.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 flex items-center gap-1"
                >
                  NSDL Investor Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-navy-800 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © 2026 THAMO. Open public-interest investor protection assistant. Does not provide investment advice or stock recommendations.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Verified Regulatory Redressal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
