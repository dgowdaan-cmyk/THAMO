import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  ExternalLink, 
  ShieldCheck, 
  Search, 
  Check, 
  Copy, 
  Building2,
  Calendar
} from 'lucide-react';
import { getOfficialResources } from '../services/api';
import { OfficialResource } from '../types';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<OfficialResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    getOfficialResources()
      .then((data) => setResources(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...Array.from(new Set(resources.map((r) => r.category)))];

  const filtered = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const copyHelpline = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Title */}
      <div className="rounded-3xl gradient-navy text-white p-8 sm:p-10 border border-navy-700 space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Curated Regulatory Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Verified Official Helplines & Portals
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          Authentic regulatory grievance registers and emergency cyber financial fraud reporting channels. Zero sponsored links or third-party intermediaries.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search SEBI, RBI, Cybercrime, 1930..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Channels' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading verified resources...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    Verified {item.last_verified_date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.jurisdiction}</span>
                </p>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {item.purpose}
                </p>

                {item.guidance_notes && (
                  <p className="text-[11px] text-amber-900 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                    <strong>Guidance:</strong> {item.guidance_notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                {item.helpline ? (
                  <button
                    onClick={() => copyHelpline(item.id, item.helpline!)}
                    className="flex items-center gap-1.5 text-slate-700 hover:text-teal-700 font-mono text-xs font-semibold"
                    title="Click to copy helpline"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                    <span>{item.helpline}</span>
                    {copiedId === item.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                ) : (
                  <span className="text-slate-400 text-xs">Portal Only</span>
                )}

                <a
                  href={item.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs transition-colors self-start sm:self-auto"
                >
                  <span>Open Official Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
