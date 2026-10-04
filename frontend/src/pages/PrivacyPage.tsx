import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Trash2, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Database,
  RefreshCw,
  Clock
} from 'lucide-react';
import { getIncidents, deleteIncident, clearAllIncidents } from '../services/api';
import { IncidentRecord } from '../types';

export const PrivacyPage: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive Live Redaction Demo
  const [testPiiInput, setTestPiiInput] = useState(
    "My mobile is +91 9876543210, PAN is ABCDE1234F, Aadhaar is 1234 5678 9012, and A/C is 9876543210123."
  );

  const performClientRedaction = (raw: string) => {
    let text = raw;
    text = text.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[REDACTED_AADHAAR]');
    text = text.replace(/\b[A-Za-z]{5}\d{4}[A-Za-z]\b/g, '[REDACTED_PAN]');
    text = text.replace(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/g, '[REDACTED_PHONE]');
    text = text.replace(/\b(?:\d{4}[\s-]?){3}\d{4}\b/g, '[REDACTED_CARD]');
    text = text.replace(/\b(?:a\/c|account\s*(?:no|number)?)\s*[:#-]?\s*(\d{9,18})\b/gi, 'A/C: [REDACTED_ACCOUNT]');
    return text;
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this incident record?')) return;
    try {
      await deleteIncident(id);
      setIncidents(incidents.filter((i) => i.incident_id !== id));
    } catch (err) {
      alert('Failed to delete incident');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('This will permanently delete all stored local incident logs from SQLite. Proceed?')) return;
    try {
      await clearAllIncidents();
      setIncidents([]);
    } catch (err) {
      alert('Failed to clear incidents');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Title */}
      <div className="rounded-3xl gradient-navy text-white p-8 sm:p-10 border border-navy-700 space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
          <Lock className="w-4 h-4" />
          <span>Security & Privacy Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Privacy and Data Controls
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          THAMO is engineered with strict Privacy-by-Design principles. You have 100% control over local incident retention with zero external telemetry.
        </p>
      </div>

      {/* Core Privacy Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">Zero Cloud Logging</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Raw evidence snippets and screenshots are never dispatched to commercial cloud AI vendors or third-party telemetry servers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <Eye className="w-6 h-6 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">Automatic PII Redaction</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Indian mobile numbers, Aadhaar numbers, PAN cards, bank account numbers, and OTPs are systematically stripped from memory and logs.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <Database className="w-6 h-6 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">User-Controlled SQLite</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Incidents are stored exclusively on your local device only when you explicitly click "Save Incident", with one-click purge capabilities.
          </p>
        </div>
      </div>

      {/* Interactive PII Redaction Simulator */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Interactive Sensitive Data Redaction Demo
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Test how THAMO strips personal identifiers in real-time before processing:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sample Text Containing PII:
            </label>
            <textarea
              value={testPiiInput}
              onChange={(e) => setTestPiiInput(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-teal-800 mb-1">
              Sanitized Output (What THAMO Analyzes):
            </label>
            <div className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 min-h-[96px] break-words">
              {performClientRedaction(testPiiInput)}
            </div>
          </div>
        </div>
      </div>

      {/* Local Incident Storage Controls */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Locally Stored Incident Records (SQLite)
            </h3>
            <p className="text-xs text-slate-500">
              Explicit local history only. Stored at <span className="font-mono text-slate-700 font-semibold">thamo_incidents.db</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadHistory}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            {incidents.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6 text-xs text-slate-400">Loading incident records...</div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 space-y-1">
            <p className="font-semibold">No incident records currently saved in local database.</p>
            <p className="text-slate-400">When you complete an analysis, you can explicitly choose to save it.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.incident_id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{inc.situation}</span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] bg-red-100 text-red-800">
                      {inc.risk_level}
                    </span>
                    <span className="text-slate-400 text-[11px] font-mono">
                      {new Date(inc.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-1">{inc.redacted_summary}</p>
                </div>
                <button
                  onClick={() => handleDelete(inc.incident_id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete this record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
