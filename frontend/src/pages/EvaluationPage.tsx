import React, { useState, useEffect } from 'react';
import { 
  Award, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  HelpCircle, 
  BarChart3,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { getEvaluationSummary } from '../services/api';
import { EvaluationSummary } from '../types';

export const EvaluationPage: React.FC = () => {
  const [metrics, setMetrics] = useState<EvaluationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningSuite, setRunningSuite] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await getEvaluationSummary();
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRerun = async () => {
    setRunningSuite(true);
    try {
      const data = await getEvaluationSummary();
      setMetrics(data);
    } catch (err) {
      alert('Failed to rerun benchmark suite.');
    } finally {
      setRunningSuite(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Title */}
      <div className="rounded-3xl gradient-navy text-white p-8 sm:p-10 border border-navy-700 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30 mb-2">
              <Award className="w-4 h-4" />
              <span>SANGYAN Hackathon Evaluation Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Live Benchmark & Accuracy Metrics
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Real mathematical outcomes calculated live from our curated benchmark dataset. Zero fabricated benchmarks or simulated statistics.
            </p>
          </div>

          <button
            onClick={handleRerun}
            disabled={runningSuite}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${runningSuite ? 'animate-spin' : ''}`} />
            <span>{runningSuite ? 'Executing Suite...' : 'Re-run Benchmark Suite'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Computing benchmark evaluation...</div>
      ) : metrics ? (
        <div className="space-y-6">
          
          {/* Top Level Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Overall Accuracy</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {(metrics.overall_accuracy * 100).toFixed(1)}%
              </div>
              <span className="text-[11px] text-teal-600 font-semibold block">
                Across {metrics.total_cases} curated test cases
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Precision</span>
              <div className="text-2xl font-extrabold text-teal-700 font-mono">
                {(metrics.overall_precision * 100).toFixed(1)}%
              </div>
              <span className="text-[11px] text-slate-500 block">
                TP / (TP + FP)
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Recall (Sensitivity)</span>
              <div className="text-2xl font-extrabold text-teal-700 font-mono">
                {(metrics.overall_recall * 100).toFixed(1)}%
              </div>
              <span className="text-[11px] text-slate-500 block">
                TP / (TP + FN)
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Avg Detection Latency</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {metrics.avg_latency_ms} ms
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Pure local execution
              </span>
            </div>
          </div>

          {/* Confusion Matrix Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Empirical Confusion Matrix (Dataset Ground Truth vs. Engine Flags)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-800 font-bold block">True Positives (TP)</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-900 mt-1 block">
                  {metrics.confusion_matrix.true_positives}
                </span>
                <span className="text-[10px] text-emerald-700">Correctly Flagged Scams</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-700 font-bold block">True Negatives (TN)</span>
                <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1 block">
                  {metrics.confusion_matrix.true_negatives}
                </span>
                <span className="text-[10px] text-slate-500">Legitimate Messages Cleared</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-800 font-bold block">False Positives (FP)</span>
                <span className="text-2xl font-mono font-extrabold text-amber-900 mt-1 block">
                  {metrics.confusion_matrix.false_positives}
                </span>
                <span className="text-[10px] text-amber-700">Benign Incorrectly Flagged</span>
              </div>

              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <span className="text-xs text-red-800 font-bold block">False Negatives (FN)</span>
                <span className="text-2xl font-mono font-extrabold text-red-900 mt-1 block">
                  {metrics.confusion_matrix.false_negatives}
                </span>
                <span className="text-[10px] text-red-700">Scams Missed</span>
              </div>
            </div>
          </div>

          {/* Results by Language */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Multilingual Performance Breakdown (English, Hindi, Kannada)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-mono border-b border-slate-200">
                  <tr>
                    <th className="p-3">Language</th>
                    <th className="p-3">Test Cases</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Precision</th>
                    <th className="p-3">Recall</th>
                    <th className="p-3">F1 Score</th>
                    <th className="p-3">Avg Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {Object.entries(metrics.metrics_by_language).map(([lang, m]) => {
                    const langLabel = lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi (हिंदी)' : 'Kannada (ಕನ್ನಡ)';
                    return (
                      <tr key={lang} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900 font-sans">{langLabel}</td>
                        <td className="p-3">{m.cases_evaluated}</td>
                        <td className="p-3 text-teal-700 font-bold">{(m.accuracy * 100).toFixed(1)}%</td>
                        <td className="p-3">{(m.precision * 100).toFixed(1)}%</td>
                        <td className="p-3">{(m.recall * 100).toFixed(1)}%</td>
                        <td className="p-3 font-bold text-slate-900">{m.f1_score.toFixed(3)}</td>
                        <td className="p-3">{m.avg_latency_ms} ms</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Documented Known Limitations */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Documented Engineering Limitations</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc leading-relaxed">
              {metrics.known_limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>

        </div>
      ) : null}

    </div>
  );
};
