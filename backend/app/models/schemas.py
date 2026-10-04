from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class UserSituation(str, Enum):
    BEFORE_PAYMENT = "BEFORE_PAYMENT"
    UNDER_PRESSURE = "UNDER_PRESSURE"
    PAYMENT_ALREADY_SENT = "PAYMENT_ALREADY_SENT"
    CREDENTIALS_DISCLOSED = "CREDENTIALS_DISCLOSED"
    SUSPECTED_RECOVERY_SCAM = "SUSPECTED_RECOVERY_SCAM"
    INSUFFICIENT_INFORMATION = "INSUFFICIENT_INFORMATION"
    UNKNOWN = "UNKNOWN"

class Language(str, Enum):
    EN = "en"
    HI = "hi"
    KN = "kn"

class AssessmentStatus(str, Enum):
    MULTIPLE_CONCERNING_INDICATORS = "multiple_concerning_indicators"
    SOME_INDICATORS_REQUIRE_VERIFICATION = "some_indicators_require_verification"
    INSUFFICIENT_EVIDENCE = "insufficient_evidence"
    NO_OBVIOUS_INDICATORS = "no_obvious_indicators"

class RiskLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MODERATE = "moderate"
    LOW = "low"
    UNCERTAIN = "uncertain"

class EvidenceItem(BaseModel):
    evidence_id: str
    evidence_type: str = Field(..., description="text_phrase, url_indicator, ocr_text, prompt_injection_attempt")
    indicator_category: str
    exact_phrase: str
    explanation: str
    confidence_label: str = Field(..., description="high, medium, low")
    verification_status: str = Field(..., description="verified_in_content, inferred_pattern, reported_by_user")

class TimelineStage(BaseModel):
    stage_id: str
    stage_name: str
    stage_order: int
    status: str = Field(..., description="detected, not_detected, unknown")
    supporting_evidence: str
    indicator_meaning: str
    uncertainty_note: str

class RecommendedAction(BaseModel):
    priority: int
    title: str
    description: str
    category: str = Field(..., description="immediate_safety, verification, reporting, evidence_preservation, support")
    action_state: str
    official_links: Optional[List[Dict[str, str]]] = None

class OfficialResource(BaseModel):
    id: str
    title: str
    jurisdiction: str
    category: str
    purpose: str
    official_url: str
    helpline: Optional[str] = None
    verification_status: str
    last_verified_date: str
    guidance_notes: Optional[str] = None

class AnalysisRequest(BaseModel):
    text: str = Field("", description="Raw or extracted message content")
    situation: UserSituation = UserSituation.BEFORE_PAYMENT
    language: Language = Language.EN
    source_url: Optional[str] = Field(None, description="Optional submitted URL")

class AnalysisResponse(BaseModel):
    situation: UserSituation
    language: Language
    assessment_status: AssessmentStatus
    risk_score: float = Field(..., description="0-100 Heuristic score calibrated from detected independent risk signals")
    risk_level: RiskLevel
    heuristic_formula_explanation: str
    primary_finding: str
    detailed_explanation: str
    evidence_items: List[EvidenceItem]
    timeline_stages: List[TimelineStage]
    recommended_actions: List[RecommendedAction]
    official_resources: List[OfficialResource]
    limitations: List[str]
    privacy_notice: str
    redactions_applied: List[str]

class UrlAnalysisRequest(BaseModel):
    url: str
    language: Language = Language.EN

class UrlAnalysisResponse(BaseModel):
    url: str
    parsed_domain: str
    is_valid_structure: bool
    observed_indicators: List[EvidenceItem]
    risk_level: RiskLevel
    safety_summary: str
    limitations: List[str]

class ImageAnalysisResponse(BaseModel):
    extracted_text: str
    ocr_engine: str
    ocr_confidence: str = Field(..., description="good, fair, low, unavailable")
    ocr_quality_notes: str
    redactions_applied: List[str]
    analysis: Optional[AnalysisResponse] = None

class IncidentCreate(BaseModel):
    situation: UserSituation
    risk_level: RiskLevel
    assessment_status: AssessmentStatus
    language: Language
    redacted_summary: str
    evidence_count: int
    action_count: int

class IncidentResponse(BaseModel):
    incident_id: str
    situation: UserSituation
    risk_level: RiskLevel
    assessment_status: AssessmentStatus
    language: Language
    redacted_summary: str
    evidence_count: int
    action_count: int
    created_at: str

class EvaluationSummary(BaseModel):
    total_cases: int
    metrics_by_language: Dict[str, Dict[str, Any]]
    overall_accuracy: float
    overall_precision: float
    overall_recall: float
    overall_f1: float
    false_positive_rate: float
    false_negative_rate: float
    confusion_matrix: Dict[str, int]
    avg_latency_ms: float
    known_limitations: List[str]
    timestamp: str
