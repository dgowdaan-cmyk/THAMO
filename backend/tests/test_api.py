import pytest
from fastapi.testclient import TestClient
from main import app
from app.models.schemas import UserSituation, Language

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["service"] == "THAMO"

def test_resources_endpoint():
    res = client.get("/api/resources")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    ids = [item["id"] for item in data]
    assert "cybercrime_portal_1930" in ids
    assert "sebi_scores" in ids

def test_analyze_endpoint():
    payload = {
        "text": "Join our VIP club for 100% guaranteed profit in 2 days. Send OTP to our manager.",
        "situation": "BEFORE_PAYMENT",
        "language": "en"
    }
    res = client.post("/api/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] > 40
    assert len(data["evidence_items"]) >= 2
    assert len(data["timeline_stages"]) == 6
    assert len(data["recommended_actions"]) >= 3

def test_analyze_url_endpoint():
    payload = {
        "url": "https://sebi-fast-kyc.top/download.apk",
        "language": "en"
    }
    res = client.post("/api/analyze/url", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_level"] == "critical"

def test_incident_lifecycle():
    # Create incident
    create_payload = {
        "situation": "BEFORE_PAYMENT",
        "risk_level": "high",
        "assessment_status": "multiple_concerning_indicators",
        "language": "en",
        "redacted_summary": "Guaranteed profit pitch flagged with 2 indicators",
        "evidence_count": 2,
        "action_count": 4
    }
    res = client.post("/api/incidents", json=create_payload)
    assert res.status_code == 200
    inc_data = res.json()
    inc_id = inc_data["incident_id"]

    # Read incident
    res_get = client.get(f"/api/incidents/{inc_id}")
    assert res_get.status_code == 200
    assert res_get.json()["incident_id"] == inc_id

    # List incidents
    res_list = client.get("/api/incidents")
    assert res_list.status_code == 200
    assert any(i["incident_id"] == inc_id for i in res_list.json())

    # Delete incident
    res_del = client.delete(f"/api/incidents/{inc_id}")
    assert res_del.status_code == 200

def test_evaluation_summary_endpoint():
    res = client.get("/api/evaluation/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_cases"] >= 20
    assert "en" in data["metrics_by_language"]
    assert "hi" in data["metrics_by_language"]
    assert "kn" in data["metrics_by_language"]
    assert data["overall_accuracy"] > 0.8
