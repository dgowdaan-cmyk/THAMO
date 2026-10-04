import re
import uuid
from urllib.parse import urlparse
from app.models.schemas import (
    UrlAnalysisResponse,
    EvidenceItem,
    RiskLevel,
    Language
)

SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "ow.ly", "cutt.ly",
    "rb.gy", "shorturl.at", "bl.ink", "tiny.cc", "v.gd"
}

SUSPICIOUS_FINANCIAL_BRANDS = [
    "sebi", "nsdl", "cdsl", "rbi", "nse", "bse", "zerodha", "groww",
    "angelone", "upstox", "hdfc", "icici", "sbi", "kotak"
]

HIGH_RISK_TLDS = {
    ".top", ".xyz", ".click", ".loan", ".club", ".vip", ".buzz",
    ".work", ".icu", ".biz", ".site", ".online", ".link"
}

IP_PATTERN = re.compile(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?$")

def analyze_submitted_url(raw_url: str, language: Language = Language.EN) -> UrlAnalysisResponse:
    """
    Safely analyzes a submitted URL purely locally.
    Does NOT connect, download, or execute JavaScript.
    Extracts structural observable warning signals.
    """
    trimmed = raw_url.strip()
    if not (trimmed.startswith("http://") or trimmed.startswith("https://")):
        trimmed = "http://" + trimmed

    indicators: list[EvidenceItem] = []
    limitations: list[str] = [
        "This evaluation is purely static and structural; no HTTP connection was made to the target host.",
        "A website without structural flags is not guaranteed safe; threat actors can host fraudulent forms on legitimate hosting platforms."
    ]

    try:
        parsed = urlparse(trimmed)
        hostname = (parsed.hostname or "").lower()
        path = parsed.path.lower()
        query = parsed.query.lower()
    except Exception as e:
        return UrlAnalysisResponse(
            url=raw_url,
            parsed_domain="invalid",
            is_valid_structure=False,
            observed_indicators=[
                EvidenceItem(
                    evidence_id=f"ev_url_{uuid.uuid4().hex[:6]}",
                    evidence_type="url_indicator",
                    indicator_category="INVALID_URL_SYNTAX",
                    exact_phrase=raw_url[:50],
                    explanation="The submitted text could not be parsed as a valid uniform resource locator (URL).",
                    confidence_label="high",
                    verification_status="verified_in_content"
                )
            ],
            risk_level=RiskLevel.UNCERTAIN,
            safety_summary="URL format is structurally invalid.",
            limitations=limitations
        )

    # Signal 1: Raw IP address as hostname
    if IP_PATTERN.match(hostname):
        indicators.append(
            EvidenceItem(
                evidence_id=f"ev_url_{uuid.uuid4().hex[:6]}",
                evidence_type="url_indicator",
                indicator_category="RAW_IP_HOSTNAME",
                exact_phrase=hostname,
                explanation="Legitimate financial institutions and brokerages host platforms on registered domain names, not bare numeric IP addresses.",
                confidence_label="high",
                verification_status="verified_in_content"
            )
        )

    # Signal 2: URL shortener hiding true destination
    if hostname in SHORTENER_DOMAINS:
        indicators.append(
            EvidenceItem(
                evidence_id=f"ev_url_{uuid.uuid4().hex[:6]}",
                evidence_type="url_indicator",
                indicator_category="URL_SHORTENER_MASK",
                exact_phrase=hostname,
                explanation="Shortened links obscure the final landing domain, frequently used in scam campaigns to bypass domain reputation filters.",
                confidence_label="high",
                verification_status="verified_in_content"
            )
        )

    # Signal 3: Embedded credentials (user:pass@host)
    if parsed.username or parsed.password:
        indicators.append(
            EvidenceItem(
                evidence_id=f"ev_url_{uuid.uuid4().hex[:6]}",
                evidence_type="url_indicator",
                indicator_category="EMBEDDED_CREDENTIALS",
                exact_phrase=f"{parsed.username}@",
                explanation="URL contains embedded authentication tokens or credentials, typical in phishing redirection exploits.",
                confidence_label="high",
                verification_status="verified_in_content"
            )
        )

    # Signal 4: Impersonation / brand keywords in non-official domain
    for brand in SUSPICIOUS_FINANCIAL_BRANDS:
        if brand in hostname:
            # Check if it is the genuine official domain
            genuine = (
                (brand == "sebi" and hostname.endswith("sebi.gov.in")) or
                (brand == "nsdl" and hostname.endswith("nsdl.co.in")) or
                (brand == "cdsl" and hostname.endswith("cdslindia.com")) or
                (brand == "rbi" and (hostname.endswith("rbi.org.in") or hostname.endswith("rbikehtahai.rbi.org.in"))) or
                (brand == "nse" and hostname.endswith("nseindia.com")) or
                (brand == "bse" and hostname.endswith("bseindia.com")) or
                (brand == "zerodha" and hostname.endswith("zerodha.com")) or
                (brand == "groww" and hostname.endswith("groww.in"))
            )
            if not genuine:
                indicators.append(
                    EvidenceItem(
                        evidence_id=f"ev_url_{uuid.uuid4().hex[:6]}",
                        evidence_type="url_indicator",
                        indicator_category="BRAND_SPOOFING_TYPOSQUATTING",
                        exact_phrase=hostname,
                        explanation=f"Domain contains brand token '{brand}' but is NOT hosted on the verified official domain of {brand.upper()}.",
                        confidence_label="high",
                        verification_status="verified_in_content"
                    )
                )
                break

    # Signal 5: Suspicious TLD
    for tld in HIGH_RISK_TLDS:
        if hostname.endswith(tld):
            indicators.append(
                EvidenceItem(
                    evidence_id=f"ev_url_{uuid.uuid4().hex[:6]}",
                    evidence_type="url_indicator",
                    indicator_category="HIGH_RISK_TLD",
                    exact_phrase=f"*{tld}",
                    explanation=f"Top-Level Domain '{tld}' is frequently associated with disposable infrastructure and rarely utilized by regulated Indian financial entities.",
                    confidence_label="medium",
                    verification_status="verified_in_content"
                )
            )
            break

    # Signal 6: APK download or executable in path
    if path.endswith(".apk") or "download" in path and ".apk" in path:
        indicators.append(
            EvidenceItem(
                evidence_id=f"ev_url_{uuid.uuid4().hex[:6]}",
                evidence_type="url_indicator",
                indicator_category="DIRECT_MALICIOUS_APP_DOWNLOAD",
                exact_phrase=path,
                explanation="Link prompts direct installation of an Android APK outside the Google Play Store, commonly used to deploy spyware or screen-recording trojans.",
                confidence_label="high",
                verification_status="verified_in_content"
            )
        )

    # Determine risk level
    if any(item.indicator_category in ["BRAND_SPOOFING_TYPOSQUATTING", "RAW_IP_HOSTNAME", "DIRECT_MALICIOUS_APP_DOWNLOAD"] for item in indicators):
        risk_level = RiskLevel.CRITICAL
        safety_summary = "High-risk indicators observed: Potential deceptive spoofing or malicious application payload."
    elif len(indicators) > 0:
        risk_level = RiskLevel.MODERATE
        safety_summary = f"{len(indicators)} structural indicator(s) require verification before accessing."
    else:
        risk_level = RiskLevel.LOW
        safety_summary = "No obvious deceptive structural patterns observed in the URL string."

    return UrlAnalysisResponse(
        url=raw_url,
        parsed_domain=hostname,
        is_valid_structure=True,
        observed_indicators=indicators,
        risk_level=risk_level,
        safety_summary=safety_summary,
        limitations=limitations
    )
