import pytest
from app.services.url_analyzer import analyze_submitted_url
from app.models.schemas import RiskLevel

def test_detect_brand_spoofing():
    url = "https://sebi-verification-portal.top/login"
    resp = analyze_submitted_url(url)
    assert resp.is_valid_structure is True
    categories = [i.indicator_category for i in resp.observed_indicators]
    assert "BRAND_SPOOFING_TYPOSQUATTING" in categories
    assert resp.risk_level == RiskLevel.CRITICAL

def test_detect_ip_address_host():
    url = "http://192.168.1.100:8080/trade"
    resp = analyze_submitted_url(url)
    categories = [i.indicator_category for i in resp.observed_indicators]
    assert "RAW_IP_HOSTNAME" in categories
    assert resp.risk_level == RiskLevel.CRITICAL

def test_detect_url_shortener():
    url = "https://bit.ly/sebi-bonus-offer"
    resp = analyze_submitted_url(url)
    categories = [i.indicator_category for i in resp.observed_indicators]
    assert "URL_SHORTENER_MASK" in categories

def test_legitimate_official_sebi_url():
    url = "https://www.sebi.gov.in/intermediaries.html"
    resp = analyze_submitted_url(url)
    categories = [i.indicator_category for i in resp.observed_indicators]
    assert "BRAND_SPOOFING_TYPOSQUATTING" not in categories
    assert resp.risk_level == RiskLevel.LOW
