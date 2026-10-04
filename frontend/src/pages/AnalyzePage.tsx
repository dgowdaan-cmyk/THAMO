import React, { useState } from 'react';
import { 
  Search, 
  Upload, 
  Globe, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Copy, 
  Check, 
  Save, 
  Volume2, 
  RefreshCw,
  Info,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { analyzeScenario, analyzeUrl, analyzeImage, createIncident } from '../services/api';
import { 
  AnalysisResponse, 
  UrlAnalysisResponse, 
  ImageAnalysisResponse, 
  UserSituation 
} from '../types';

export const AnalyzePage: React.FC = () => {
  const { language, setLanguage, t, speak, isSpeaking, stopSpeaking } = useLanguage();

  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'url'>('text');
  const [situation, setSituation] = useState<UserSituation>('BEFORE_PAYMENT');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [urlResult, setUrlResult] = useState<UrlAnalysisResponse | null>(null);
  const [ocrResult, setOcrResult] = useState<ImageAnalysisResponse | null>(null);
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTextAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setErrorMessage('');
    setUrlResult(null);
    try {
      const res = await analyzeScenario(inputText, situation, language, inputUrl || undefined);
      setAnalysisResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please verify the backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await analyzeUrl(inputUrl, language);
      setUrlResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'URL analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        setErrorMessage('Unsupported file type. Only PNG, JPEG, JPG, and WEBP images are supported.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size exceeds the 5MB limit.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage('');
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await analyzeImage(selectedFile, situation, language);
      setOcrResult(res);
      setInputText(res.extracted_text);
      if (res.analysis) {
        setAnalysisResult(res.analysis);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Image OCR processing failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIncident = async () => {
    if (!analysisResult) return;
    try {
      await createIncident({
        situation: analysisResult.situation,
        risk_level: analysisResult.risk_level,
        assessment_status: analysisResult.assessment_status,
        language: analysisResult.language,
        redacted_summary: analysisResult.primary_finding,
        evidence_count: analysisResult.evidence_items.length,
        action_count: analysisResult.recommended_actions.length
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to store incident record in local database.');
    }
  };

  const copyAnalysisReport = () => {
    if (!analysisResult) return;
    const reportText = `THAMO INVESTOR SAFETY REPORT\nDate: ${new Date().toISOString()}\nRisk Level: ${analysisResult.risk_level.toUpperCase()} (${analysisResult.risk_score}/100)\nFinding: ${analysisResult.primary_finding}\nEvidence Flags: ${analysisResult.evidence_items.map(e => `[${e.indicator_category}] "${e.exact_phrase}" - ${e.explanation}`).join('\n')}\nRecommended Actions:\n${analysisResult.recommended_actions.map(a => `${a.priority}. ${a.title}: ${a.description}`).join('\n')}\n\nDisclaimer: ${analysisResult.privacy_notice}`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadScenarioPreset = (preset: 'guaranteed' | 'digital_arrest' | 'advance_fee' | 'legitimate') => {
    if (preset === 'guaranteed') {
      setInputText("Guaranteed 100% returns in 7 days! Invest Rs 25,000 in our SEBI certified algorithmic pool. Transfer immediately via UPI. Zero risk assured!");
      setSituation('BEFORE_PAYMENT');
      setInputUrl('https://sebi-wealth-pool.xyz/register');
    } else if (preset === 'digital_arrest') {
      setInputText("CBI & Police arrest warrant issued against you for illegal money laundering. Your bank account will be seized. Do not tell your family. Transfer penalty to verify innocence.");
      setSituation('UNDER_PRESSURE');
      setInputUrl('');
    } else if (preset === 'advance_fee') {
      setInputText("Congratulations! Your account accumulated profit of $12,000. Pay 18% GST tax clearance fee of Rs 32,000 to unlock your wallet and withdraw money.");
      setSituation('BEFORE_PAYMENT');
      setInputUrl('https://vip-trader-wallet.top/withdraw');
    } else {
      setInputText("Dear Customer, your quarterly Demat Consolidated Account Statement (CAS) for September 2026 is available for secure viewing on NSDL portal.");
      setSituation('BEFORE_PAYMENT');
      setInputUrl('https://nsdl.co.in');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Title Banner */}
      <div className="rounded-3xl gradient-navy text-white p-8 border border-navy-700 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30 mb-2">
              <Search className="w-3.5 h-3.5" />
              <span>Multi-Signal Evidence Scanner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Investigate Suspicious Messages, Images & Links
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Extract verifiable warning indicators, observe structural URL spoofing, and preview the 6-stage pressure progression timeline.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-col gap-1.5 self-start sm:self-auto">
            <span className="text-xs text-slate-400 font-medium">Load Evaluation Scenario:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => loadScenarioPreset('guaranteed')}
                className="text-xs px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-teal-300 border border-navy-600 font-medium"
              >
                Guaranteed 100%
              </button>
              <button
                type="button"
                onClick={() => loadScenarioPreset('digital_arrest')}
                className="text-xs px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-red-300 border border-navy-600 font-medium"
              >
                Digital Arrest
              </button>
              <button
                type="button"
                onClick={() => loadScenarioPreset('advance_fee')}
                className="text-xs px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-amber-300 border border-navy-600 font-medium"
              >
                Tax to Withdraw
              </button>
              <button
                type="button"
                onClick={() => loadScenarioPreset('legitimate')}
                className="text-xs px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-600 font-medium"
              >
                Legitimate CAS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Input Mode Selector & Scanner Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'text'
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Text / Message Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'image'
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Screenshot OCR Upload</span>
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'url'
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Safe URL Dissection</span>
          </button>
        </div>

        {/* Situation and Language Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Investor Situation State:
            </label>
            <select
              value={situation}
              onChange={(e) => setSituation(e.target.value as UserSituation)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="BEFORE_PAYMENT">BEFORE_PAYMENT (Considering sending funds)</option>
              <option value="UNDER_PRESSURE">UNDER_PRESSURE (Facing urgent threats or coercion)</option>
              <option value="PAYMENT_ALREADY_SENT">PAYMENT_ALREADY_SENT (Money already transferred)</option>
              <option value="CREDENTIALS_DISCLOSED">CREDENTIALS_DISCLOSED (Shared OTP / AnyDesk access)</option>
              <option value="SUSPECTED_RECOVERY_SCAM">SUSPECTED_RECOVERY_SCAM (Contacted by recovery agent)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Preferred Language:
            </label>
            <div className="flex rounded-xl border border-slate-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2 text-xs font-bold ${
                  language === 'en' ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`flex-1 py-2 text-xs font-bold ${
                  language === 'hi' ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('kn')}
                className={`flex-1 py-2 text-xs font-bold ${
                  language === 'kn' ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                ಕನ್ನಡ (Kannada)
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Text Analysis */}
        {activeTab === 'text' && (
          <form onSubmit={handleTextAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Paste Suspicious Message Text:
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the full chat message, WhatsApp communication, or email text here..."
                rows={5}
                className="w-full rounded-2xl border-2 border-slate-200 p-4 text-sm text-slate-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Accompanying URL / Website (Optional):
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="e.g. https://sebi-secure-portal.top or bit.ly/wealth-pool"
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-bold shadow-md transition-all flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{loading ? 'Evaluating Evidence...' : 'Run Full Threat Assessment'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Screenshot OCR */}
        {activeTab === 'image' && (
          <div className="space-y-6">
            <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-3 bg-slate-50/50">
              <Upload className="w-10 h-10 text-teal-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">
                  Upload screenshot of WhatsApp, Telegram, or email
                </p>
                <p className="text-xs text-slate-500">
                  Supported formats: PNG, JPG, JPEG, WEBP (Max 5MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                Select Image File
              </label>
              {selectedFile && (
                <p className="text-xs font-mono text-teal-700 mt-2">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {filePreview && (
              <div className="space-y-4">
                <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-slate-300 shadow-sm">
                  <img src={filePreview} alt="Screenshot preview" className="w-full object-contain max-h-64" />
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleImageUploadAndAnalyze}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow transition-all flex items-center gap-2"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Extract Text & Run Evidence Engine</span>
                  </button>
                </div>
              </div>
            )}

            {ocrResult && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">OCR Extraction Quality:</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    ocrResult.ocr_confidence === 'good' ? 'bg-emerald-100 text-emerald-800' :
                    ocrResult.ocr_confidence === 'fair' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {ocrResult.ocr_confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-500 italic">{ocrResult.ocr_quality_notes}</p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Editable Extracted Text (Review & Correct before submitting):
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 font-mono"
                  />
                </div>
                <button
                  onClick={handleTextAnalyze}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-white text-xs font-bold hover:bg-navy-900 transition-colors"
                >
                  Analyze Extracted Text
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Safe URL Dissection */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Enter Web Address for Static Dissection:
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://sebi-verification-portal.top or bit.ly/xxx"
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Zero Outbound Connection Guarantee</span>
              </span>
              <p>
                THAMO does not fetch, connect, execute JavaScript, or download files from the submitted link. The URL is structurally parsed locally to identify typosquatting, raw IP hosts, and URL-shortener cloaks.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !inputUrl.trim()}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow transition-all flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                <span>Dissect URL Safely</span>
              </button>
            </div>

            {urlResult && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-mono text-xs text-slate-700 font-bold">Domain: {urlResult.parsed_domain}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    urlResult.risk_level === 'critical' ? 'bg-red-100 text-red-800' :
                    urlResult.risk_level === 'moderate' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {urlResult.risk_level} Risk
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800">{urlResult.safety_summary}</p>
                {urlResult.observed_indicators.map((ind) => (
                  <div key={ind.evidence_id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-red-700">{ind.indicator_category}</span>
                    <p className="text-slate-600">{ind.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </form>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

      </div>

      {/* Main Analysis Report Section */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Card with Risk Gauge */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    analysisResult.risk_level === 'critical' ? 'bg-red-600 text-white' :
                    analysisResult.risk_level === 'high' ? 'bg-orange-500 text-white' :
                    analysisResult.risk_level === 'moderate' ? 'bg-amber-500 text-white' :
                    'bg-emerald-600 text-white'
                  }`}>
                    {analysisResult.risk_level} Risk
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                    Score: {analysisResult.risk_score} / 100
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {analysisResult.primary_finding}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Context: <span className="font-bold">{analysisResult.situation}</span> • Assessment: {analysisResult.assessment_status.replace(/_/g, ' ')}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speak(analysisResult.primary_finding);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isSpeaking 
                      ? 'bg-red-50 border-red-300 text-red-700 shadow-sm animate-pulse' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                  title={isSpeaking ? "Stop audio" : "Read aloud"}
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-red-600 animate-bounce' : 'text-teal-600'}`} />
                  <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                </button>
                <button
                  onClick={copyAnalysisReport}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Copy full report"
                >
                  {copied ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleSaveIncident}
                  className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Save to local incident database"
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">{savedSuccess ? 'Saved Locally!' : 'Save Incident'}</span>
                </button>
              </div>
            </div>

            {/* Transparent Heuristic Formula Explanation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700 block">Scoring Transparency & Formula:</span>
              <p className="text-slate-600 leading-relaxed font-mono">
                {analysisResult.heuristic_formula_explanation}
              </p>
            </div>

            {/* Redacted Data Notice */}
            {analysisResult.redactions_applied.length > 0 && (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  <strong>Privacy Redaction Applied:</strong> Filtered {analysisResult.redactions_applied.join(', ')} before evaluation.
                </span>
              </div>
            )}

            {/* Extracted Evidence Attribution Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Verifiable Observable Evidence Signals ({analysisResult.evidence_items.length})
              </h3>
              {analysisResult.evidence_items.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-50">
                  No standard deceptive or high-urgency keywords detected in the submitted content snippet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.evidence_items.map((item) => (
                    <div 
                      key={item.evidence_id} 
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold uppercase font-mono">
                          {item.indicator_category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {item.confidence_label.toUpperCase()} CONFIDENCE
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 italic">
                        "{item.exact_phrase}"
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.explanation}
                      </p>
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                        <span>Status: {item.verification_status}</span>
                        <span>ID: {item.evidence_id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pressure Progression Timeline Preview */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Pressure Progression Timeline</span>
                </h3>
                <span className="text-xs text-slate-500">6 Stages Derived from Evidence</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analysisResult.timeline_stages.map((stage) => {
                  const isDetected = stage.status === 'detected';
                  return (
                    <div 
                      key={stage.stage_id} 
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                        isDetected 
                          ? 'bg-red-50/70 border-red-300 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{stage.stage_name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isDetected ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {stage.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {stage.supporting_evidence}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Safety Actions (Deterministic State Machine) */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Un-overridable Deterministic Safety Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.recommended_actions.map((act) => (
                  <div 
                    key={act.priority} 
                    className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center">
                        {act.priority}
                      </span>
                      <h4 className="text-xs font-bold text-teal-950">{act.title}</h4>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed pl-8">
                      {act.description}
                    </p>
                    {act.official_links && act.official_links.length > 0 && (
                      <div className="pl-8 pt-1 flex flex-wrap gap-2">
                        {act.official_links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-teal-700 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>{link.name}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Public Interest Disclaimer & Privacy */}
            <div className="p-4 rounded-2xl bg-slate-100 text-slate-600 text-xs space-y-1">
              <span className="font-bold block text-slate-800">Public Interest Notice:</span>
              <p>{analysisResult.privacy_notice}</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
