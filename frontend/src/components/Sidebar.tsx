import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  AlertTriangle, 
  Activity, 
  PhoneCall, 
  Clock, 
  Award, 
  Lock, 
  HelpCircle,
  Home,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  const primaryWorkflows = [
    {
      to: '/analyze',
      label: t('navAnalyze') || 'Evidence Scanner',
      icon: Search,
      badge: 'Interactive',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    },
    {
      to: '/before-payment',
      label: t('navBeforePayment') || 'Before Payment',
      icon: AlertTriangle,
      badge: 'Checklist',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      to: '/under-pressure',
      label: t('navUnderPressure') || 'Under Pressure',
      icon: Activity,
      badge: 'Urgent',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30'
    },
    {
      to: '/after-fraud',
      label: t('navAfterFraud') || 'After Incident',
      icon: PhoneCall,
      badge: 'Golden Hour',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      to: '/timeline',
      label: t('navTimeline') || 'Pressure Timeline',
      icon: Clock,
      badge: 'Signature',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    }
  ];

  const secondaryNavigation = [
    {
      to: '/',
      label: t('navHome') || 'Home Dashboard',
      icon: Home
    },
    {
      to: '/actions',
      label: t('navActions') || 'Action Guide',
      icon: Award
    },
    {
      to: '/resources',
      label: t('navResources') || 'Official Helplines',
      icon: ExternalLink
    },
    {
      to: '/evaluation',
      label: t('navEvaluation') || 'Judge Evaluation',
      icon: Sparkles
    },
    {
      to: '/privacy',
      label: t('navPrivacy') || 'Privacy & Controls',
      icon: Lock
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 z-50 h-screen w-72 bg-navy-900 border-r border-navy-800 text-slate-200 
        flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Brand & Mission Header */}
        <div className="p-5 border-b border-navy-800/80">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-3 group focus:outline-none">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-navy-900 rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-teal-400 group-hover:text-teal-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-sans">
                  THAMO
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  IIT BHU
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Investor Safety & Triage
              </p>
            </div>
          </NavLink>
        </div>

        {/* Scrollable Nav Item Groups */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-navy-700">
          
          {/* Main User Workflows Section */}
          <div className="space-y-1.5">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Core Workflows</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-navy-800 text-slate-400">5 Protocols</span>
            </div>

            {primaryWorkflows.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => `
                    group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-teal-600/30 to-teal-500/10 text-white border-l-4 border-teal-400 shadow-md shadow-teal-900/40 translate-x-1' 
                      : 'text-slate-300 hover:text-white hover:bg-navy-800/80 hover:translate-x-0.5'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-teal-400 group-hover:text-teal-300 group-hover:bg-navy-700 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Platform & Governance Section */}
          <div className="space-y-1.5 pt-2 border-t border-navy-800/60">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Platform & Resources
            </div>

            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150
                    ${isActive 
                      ? 'bg-navy-800 text-teal-300 font-bold border-l-2 border-teal-400' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800/50'}
                  `}
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-teal-300" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

        </div>

        {/* Emergency Quick Action Footer Card */}
        <div className="p-4 border-t border-navy-800 bg-navy-950/60 m-2 rounded-2xl border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              National Cyber Helpline
            </span>
            <span className="text-[10px] text-slate-400 font-mono">24x7</span>
          </div>

          <a
            href="tel:1930"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 transition-all transform active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Dial 1930</span>
          </a>

          <div className="mt-2 text-[10px] text-center text-slate-500">
            Ministry of Home Affairs (I4C)
          </div>
        </div>

      </aside>
    </>
  );
};
