import json
import os
import tempfile
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Response
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging_redactor import redact_sensitive_data, logger
from app.models.schemas import (
    AnalysisRequest,
    AnalysisResponse,
    UrlAnalysisRequest,
    UrlAnalysisResponse,
    ImageAnalysisResponse,
    OfficialResource,
    IncidentCreate,
    IncidentResponse,
    EvaluationSummary,
    UserSituation,
    Language,
    AssessmentStatus,
    RiskLevel
)
from app.models.database import (
    get_db,
    save_incident,
    list_incidents,
    get_incident_by_id,
    delete_incident_by_id,
    clear_all_incident_records
)
from app.services.detector import analyze_text_evidence
from app.services.timeline import construct_pressure_timeline
from app.services.action_engine import resolve_recommended_actions
from app.services.url_analyzer import analyze_submitted_url
from app.services.ocr_service import extract_text_from_image_bytes, find_tesseract_binary
from app.services.evaluator import run_evaluation_suite
from app.safety.guardrails import get_mandatory_disclaimer

router = APIRouter()

# In-memory cached official resources
_OFFICIAL_RESOURCES_CACHE: Optional[List[OfficialResource]] = None

def get_official_resources_data() -> List[OfficialResource]:
    global _OFFICIAL_RESOURCES_CACHE
    if _OFFICIAL_RESOURCES_CACHE is None:
        try:
            with open(settings.RESOURCES_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                _OFFICIAL_RESOURCES_CACHE = [OfficialResource(**item) for item in data]
        except Exception as e:
            logger.error(f"Failed to load official resources: {e}")
            _OFFICIAL_RESOURCES_CACHE = []
    return _OFFICIAL_RESOURCES_CACHE

@router.get("/health", tags=["System"])
def health_check():
    """Returns application health, version, and local runtime capabilities."""
    tesseract_cmd = find_tesseract_binary()
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "tagline": settings.PROJECT_TAGLINE,
        "tesseract_available": tesseract_cmd is not None,
        "tesseract_path": tesseract_cmd,
        "supported_languages": settings.SUPPORTED_LANGUAGES,
        "local_storage": "SQLite (explicit opt-in, zero cloud telemetry)",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@router.get("/resources", response_model=List[OfficialResource], tags=["Resources"])
def list_resources(category: Optional[str] = None):
    """Returns curated, verified regulatory and grievance redressal channels."""
    resources = get_official_resources_data()
    if category:
        return [r for r in resources if r.category.lower() == category.lower()]
    return resources

@router.post("/analyze", response_model=AnalysisResponse, tags=["Analysis"])
def analyze_scenario(request: AnalysisRequest):
    """
    Core analysis endpoint.
    Redacts sensitive personal identifiers, identifies multi-signal scam patterns,
    constructs the 6-stage pressure progression timeline, and returns deterministic safety actions.
    """
    # Step 1: Redact incoming sensitive data
    sanitized_text, applied_redactions = redact_sensitive_data(request.text)

    # Step 2: Evidence extraction & risk scoring
    evidence_items, risk_score, assessment_status, risk_level = analyze_text_evidence(
        sanitized_text,
        request.situation
    )

    # Step 3: If URL is attached, analyze locally and append evidence
    if request.source_url and request.source_url.strip():
        url_resp = analyze_submitted_url(request.source_url.strip(), request.language)
        if url_resp.observed_indicators:
            evidence_items.extend(url_resp.observed_indicators)
            # Adjust score if critical URL indicators exist
            if url_resp.risk_level == RiskLevel.CRITICAL:
                risk_score = min(100.0, risk_score + 35.0)
                risk_level = RiskLevel.CRITICAL
                assessment_status = AssessmentStatus.MULTIPLE_CONCERNING_INDICATORS

    # Step 4: Construct Signature Pressure Timeline
    timeline_stages = construct_pressure_timeline(evidence_items, request.situation)

    # Step 5: Resolve deterministic, un-overridable recommended actions
    recommended_actions = resolve_recommended_actions(request.situation, request.language)

    # Step 6: Select relevant official resources based on situation
    all_resources = get_official_resources_data()
    relevant_resources = []
    if request.situation in [UserSituation.PAYMENT_ALREADY_SENT, UserSituation.UNDER_PRESSURE, UserSituation.SUSPECTED_RECOVERY_SCAM]:
        relevant_resources = [r for r in all_resources if r.id in ["cybercrime_portal_1930", "rbi_cms", "sebi_scores"]]
    else:
        relevant_resources = [r for r in all_resources if r.id in ["sebi_intermediary_verification", "rbi_sachet", "cybercrime_portal_1930", "nsdl_investor_portal"]]

    # Construct primary finding explanation
    if assessment_status == AssessmentStatus.MULTIPLE_CONCERNING_INDICATORS:
        primary_finding = f"High Risk: Detected {len(evidence_items)} observable indicator(s) consistent with investment coercion or deceptive schemes."
    elif assessment_status == AssessmentStatus.SOME_INDICATORS_REQUIRE_VERIFICATION:
        primary_finding = f"Moderate Caution: Detected {len(evidence_items)} warning signal(s) requiring independent verification."
    elif assessment_status == AssessmentStatus.INSUFFICIENT_EVIDENCE:
        primary_finding = "Inconclusive: Provided content has insufficient detail to determine safety indicators."
    else:
        primary_finding = "No Obvious Scam Signals: No typical coercion or deceptive keywords identified in provided snippet."

    heuristic_formula_explanation = (
        "Heuristic score = Min(100, Sum of indicator severity weights). "
        "Weights: Guaranteed Returns (25), Advance Profit Fees (30), Coercion/Threats (30), Credential Theft (35), Recovery Scam (35), Urgency (20). "
        "Scores > 65 denote Critical Risk; 40-64 denote High Risk; 20-39 Moderate Risk; 0-19 Low/Uncertain."
    )

    limitations = [
        "Analysis is bounded strictly by observable lexical indicators and user-reported context.",
        "Scammers continuously evolve vocabulary; absence of warning signals is never a guarantee of legitimacy.",
        "THAMO does not contact external bank APIs or file complaints automatically; please use the official numbers provided."
    ]

    logger.info(
        f"Analyzed request | Situation: {request.situation} | Risk: {risk_level} | Indicators: {len(evidence_items)} | Redactions: {len(applied_redactions)}"
    )

    return AnalysisResponse(
        situation=request.situation,
        language=request.language,
        assessment_status=assessment_status,
        risk_score=risk_score,
        risk_level=risk_level,
        heuristic_formula_explanation=heuristic_formula_explanation,
        primary_finding=primary_finding,
        detailed_explanation=f"Based on the analysis, {len(evidence_items)} suspicious feature(s) were flagged. Review each timeline stage and prioritize the immediate safety actions before interacting further.",
        evidence_items=evidence_items,
        timeline_stages=timeline_stages,
        recommended_actions=recommended_actions,
        official_resources=relevant_resources,
        limitations=limitations,
        privacy_notice=get_mandatory_disclaimer(request.language.value),
        redactions_applied=applied_redactions
    )

@router.post("/analyze/url", response_model=UrlAnalysisResponse, tags=["Analysis"])
def analyze_url_endpoint(request: UrlAnalysisRequest):
    """
    Safely inspects a URL string purely locally for spoofing, deceptive subdomains,
    or high-risk TLDs without initiating outbound network connections.
    """
    return analyze_submitted_url(request.url, request.language)

@router.post("/analyze/image", response_model=ImageAnalysisResponse, tags=["Analysis"])
async def analyze_image_endpoint(
    file: UploadFile = File(...),
    situation: UserSituation = Form(UserSituation.BEFORE_PAYMENT),
    language: Language = Form(Language.EN)
):
    """
    Processes an uploaded screenshot, applies preprocessing, extracts text via OCR,
    redacts sensitive information, and conducts automated threat analysis.
    """
    if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file.content_type}'. Allowed formats: PNG, JPEG, JPG, WEBP."
        )

    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Uploaded file exceeds 5MB limit. Size: {len(contents)} bytes."
        )

    # Run OCR
    extracted_text, engine, confidence, quality_notes = extract_text_from_image_bytes(contents)
    sanitized_text, redactions = redact_sensitive_data(extracted_text)

    # Analyze extracted text if present
    analysis_res = None
    if sanitized_text and len(sanitized_text.strip()) >= 10:
        req = AnalysisRequest(
            text=sanitized_text,
            situation=situation,
            language=language
        )
        analysis_res = analyze_scenario(req)

    return ImageAnalysisResponse(
        extracted_text=sanitized_text,
        ocr_engine=engine,
        ocr_confidence=confidence,
        ocr_quality_notes=quality_notes,
        redactions_applied=redactions,
        analysis=analysis_res
    )

@router.post("/incidents", response_model=IncidentResponse, tags=["Incidents"])
def create_incident_record(incident_in: IncidentCreate, db: Session = Depends(get_db)):
    """
    Explicitly saves an incident summary into local SQLite database.
    Zero raw sensitive credentials are saved.
    """
    record = save_incident(
        db=db,
        situation=incident_in.situation.value,
        risk_level=incident_in.risk_level.value,
        assessment_status=incident_in.assessment_status.value,
        language=incident_in.language.value,
        redacted_summary=incident_in.redacted_summary,
        evidence_count=incident_in.evidence_count,
        action_count=incident_in.action_count
    )
    return IncidentResponse(
        incident_id=record.id,
        situation=UserSituation(record.situation),
        risk_level=RiskLevel(record.risk_level),
        assessment_status=AssessmentStatus(record.assessment_status),
        language=Language(record.language),
        redacted_summary=record.redacted_summary,
        evidence_count=record.evidence_count,
        action_count=record.action_count,
        created_at=record.created_at.isoformat() + "Z"
    )

@router.get("/incidents", response_model=List[IncidentResponse], tags=["Incidents"])
def list_incident_records(db: Session = Depends(get_db)):
    """Retrieves locally stored incident history."""
    records = list_incidents(db)
    return [
        IncidentResponse(
            incident_id=r.id,
            situation=UserSituation(r.situation),
            risk_level=RiskLevel(r.risk_level),
            assessment_status=AssessmentStatus(r.assessment_status),
            language=Language(r.language),
            redacted_summary=r.redacted_summary,
            evidence_count=r.evidence_count,
            action_count=r.action_count,
            created_at=r.created_at.isoformat() + "Z"
        )
        for r in records
    ]

@router.get("/incidents/{incident_id}", response_model=IncidentResponse, tags=["Incidents"])
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    """Fetches a specific incident by ID."""
    record = get_incident_by_id(db, incident_id)
    if not record:
        raise HTTPException(status_code=404, detail="Incident record not found.")
    return IncidentResponse(
        incident_id=record.id,
        situation=UserSituation(record.situation),
        risk_level=RiskLevel(record.risk_level),
        assessment_status=AssessmentStatus(record.assessment_status),
        language=Language(record.language),
        redacted_summary=record.redacted_summary,
        evidence_count=record.evidence_count,
        action_count=record.action_count,
        created_at=record.created_at.isoformat() + "Z"
    )

@router.delete("/incidents/{incident_id}", tags=["Incidents"])
def delete_incident(incident_id: str, db: Session = Depends(get_db)):
    """Deletes a specific incident record."""
    success = delete_incident_by_id(db, incident_id)
    if not success:
        raise HTTPException(status_code=404, detail="Incident record not found.")
    return {"message": "Incident successfully deleted.", "incident_id": incident_id}

@router.delete("/incidents", tags=["Incidents"])
def clear_all_incidents(db: Session = Depends(get_db)):
    """Clears all stored local incident history."""
    count = clear_all_incident_records(db)
    return {"message": f"Successfully deleted {count} incident records."}

@router.get("/evaluation/summary", response_model=EvaluationSummary, tags=["Evaluation"])
def get_evaluation_summary():
    """
    Executes automated evaluation on the benchmark dataset.
    Calculates actual mathematical precision, recall, false positive/negative rates,
    and latency per language.
    """
    return run_evaluation_suite()

@router.get("/tts", tags=["Speech"])
def synthesize_speech_wav(text: str, lang: str = "en"):
    """
    Synthesizes text into high-fidelity WAV audio stream using native Windows SAPI.
    Provides 100% reliable audio playback directly into any browser audio element.
    """
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    clean_text = text.strip()[:600]
    
    try:
        import pythoncom
        import win32com.client

        pythoncom.CoInitialize()
        try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                tmp_path = tmp.name

            speaker = win32com.client.Dispatch("SAPI.SpVoice")
            stream = win32com.client.Dispatch("SAPI.SpFileStream")
            # 3 = SSFMCreateForWrite
            stream.Open(tmp_path, 3)
            speaker.AudioOutputStream = stream
            speaker.Speak(clean_text)
            stream.Close()

            with open(tmp_path, "rb") as f:
                wav_data = f.read()

            try:
                os.remove(tmp_path)
            except Exception:
                pass

            return Response(
                content=wav_data,
                media_type="audio/wav",
                headers={
                    "Cache-Control": "public, max-age=3600",
                    "Accept-Ranges": "bytes"
                }
            )
        finally:
            pythoncom.CoUninitialize()
    except Exception as e:
        logger.error(f"SAPI TTS synthesis error: {e}")
        raise HTTPException(status_code=500, detail=f"Speech synthesis error: {str(e)}")

