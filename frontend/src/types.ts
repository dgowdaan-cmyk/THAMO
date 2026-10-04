export type UserSituation = 
  | 'BEFORE_PAYMENT'
  | 'UNDER_PRESSURE'
  | 'PAYMENT_ALREADY_SENT'
  | 'CREDENTIALS_DISCLOSED'
  | 'SUSPECTED_RECOVERY_SCAM'
  | 'INSUFFICIENT_INFORMATION'
  | 'UNKNOWN';

export type Language = 'en' | 'hi' | 'kn';

export type AssessmentStatus =
  | 'multiple_concerning_indicators'
  | 'some_indicators_require_verification'
  | 'insufficient_evidence'
  | 'no_obvious_indicators';

export type RiskLevel = 'critical' | 'high' | 'moderate' | 'low' | 'uncertain';

export interface EvidenceItem {
  evidence_id: string;
  evidence_type: string;
  indicator_category: string;
  exact_phrase: string;
  explanation: string;
  confidence_label: 'high' | 'medium' | 'low';
  verification_status: string;
}

export interface TimelineStage {
  stage_id: string;
  stage_name: string;
  stage_order: number;
  status: 'detected' | 'not_detected' | 'unknown';
  supporting_evidence: string;
  indicator_meaning: string;
  uncertainty_note: string;
}

export interface RecommendedAction {
  priority: number;
  title: string;
  description: string;
  category: 'immediate_safety' | 'verification' | 'reporting' | 'evidence_preservation' | 'support';
  action_state: string;
  official_links?: { name: string; url: string }[];
}

export interface OfficialResource {
  id: string;
  title: string;
  jurisdiction: string;
  category: string;
  purpose: string;
  official_url: string;
  helpline?: string;
  verification_status: string;
  last_verified_date: string;
  guidance_notes?: string;
}

export interface AnalysisResponse {
  situation: UserSituation;
  language: Language;
  assessment_status: AssessmentStatus;
  risk_score: number;
  risk_level: RiskLevel;
  heuristic_formula_explanation: string;
  primary_finding: string;
  detailed_explanation: string;
  evidence_items: EvidenceItem[];
  timeline_stages: TimelineStage[];
  recommended_actions: RecommendedAction[];
  official_resources: OfficialResource[];
  limitations: string[];
  privacy_notice: string;
  redactions_applied: string[];
}

export interface UrlAnalysisResponse {
  url: string;
  parsed_domain: string;
  is_valid_structure: boolean;
  observed_indicators: EvidenceItem[];
  risk_level: RiskLevel;
  safety_summary: string;
  limitations: string[];
}

export interface ImageAnalysisResponse {
  extracted_text: string;
  ocr_engine: string;
  ocr_confidence: 'good' | 'fair' | 'low' | 'unavailable';
  ocr_quality_notes: string;
  redactions_applied: string[];
  analysis?: AnalysisResponse;
}

export interface IncidentRecord {
  incident_id: string;
  situation: UserSituation;
  risk_level: RiskLevel;
  assessment_status: AssessmentStatus;
  language: Language;
  redacted_summary: string;
  evidence_count: number;
  action_count: number;
  created_at: string;
}

export interface EvaluationLanguageMetric {
  cases_evaluated: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
  avg_latency_ms: number;
}

export interface EvaluationSummary {
  total_cases: number;
  metrics_by_language: Record<string, EvaluationLanguageMetric>;
  overall_accuracy: number;
  overall_precision: number;
  overall_recall: number;
  overall_f1: number;
  false_positive_rate: number;
  false_negative_rate: number;
  confusion_matrix: {
    true_positives: number;
    false_positives: number;
    true_negatives: number;
    false_negatives: number;
  };
  avg_latency_ms: number;
  known_limitations: string[];
  timestamp: string;
}
