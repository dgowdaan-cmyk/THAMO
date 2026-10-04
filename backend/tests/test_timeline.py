import pytest
from app.services.timeline import construct_pressure_timeline
from app.models.schemas import EvidenceItem, UserSituation

def test_timeline_construction():
    evidence = [
        EvidenceItem(
            evidence_id="ev_1",
            evidence_type="text_phrase",
            indicator_category="GUARANTEED_RETURNS",
            exact_phrase="100% guaranteed profit",
            explanation="Guaranteed return indicator",
            confidence_label="high",
            verification_status="verified_in_content"
        ),
        EvidenceItem(
            evidence_id="ev_2",
            evidence_type="text_phrase",
            indicator_category="URGENCY_PRESSURE",
            exact_phrase="pay within 15 minutes",
            explanation="Urgency indicator",
            confidence_label="high",
            verification_status="verified_in_content"
        )
    ]
    stages = construct_pressure_timeline(evidence, UserSituation.BEFORE_PAYMENT)
    assert len(stages) == 6
    # Stage 3 should be detected
    stage_3 = next(s for s in stages if s.stage_order == 3)
    assert stage_3.status == "detected"
    assert "100% guaranteed profit" in stage_3.supporting_evidence

    # Stage 4 should be detected
    stage_4 = next(s for s in stages if s.stage_order == 4)
    assert stage_4.status == "detected"
