import re
import uuid
from typing import List, Dict, Any, Tuple
from app.models.schemas import (
    EvidenceItem,
    AssessmentStatus,
    RiskLevel,
    Language,
    UserSituation
)

# Indicator specifications with multi-lingual patterns and severity weights
INDICATOR_RULES = [
    {
        "category": "GUARANTEED_RETURNS",
        "weight": 25,
        "confidence": "high",
        "explanation": "Guaranteed or risk-free returns violate fundamental financial market dynamics. Registered investment entities are legally prohibited by SEBI from assuring guaranteed returns.",
        "patterns": [
            # English
            r"(?i)\b(?:100%|guaranteed|assured|risk[- ]free|zero[- ]risk|fixed)\s+(?:profit|return|income|gain|doubling)\b",
            r"(?i)\b(?:double|triple)\s+(?:your\s+)?(?:money|investment|capital)\s+(?:in|within)\s+\d+\s+(?:days?|hours?|weeks?)\b",
            r"(?i)\b(?:daily|weekly)\s+(?:return|profit)\s+(?:of\s+)?(?:\d+%|[1-9]\d+%)\b",
            r"(?i)\bno[- ]loss\s+(?:strategy|guarantee|formula)\b",
            # Hindi (Devanagari + Hinglish)
            r"गारंटीड\s*(?:रिटर्न|मुनाफा|लाभ)",
            r"निश्चित\s*(?:रिटर्न|मुनाफा|लाभ|कमाई)",
            r"(?i)\b(?:guaranteed|pakka)\s*(?:munafa|return|kamai)\b",
            r"(?i)\bpaise\s*double\b",
            r"पैसा\s*(?:डबल|दोगुना)",
            r"बिना\s*किसी\s*जोखिम",
            # Kannada (Script + Romanized)
            r"ಖಚಿತ\s*(?:ಆದಾಯ|ಲಾಭ)",
            r"ಖಾತರಿ\s*(?:ಲಾಭ|ಆದಾಯ)",
            r"ಯಾವುದೇ\s*ಅಪಾಯವಿಲ್ಲದೆ",
            r"ಹಣ\s*ಡಬಲ್",
            r"(?i)\bkhachitha\s*(?:aadaya|labha)\b",
            r"(?i)\bhana\s*double\b"
        ]
    },
    {
        "category": "URGENCY_PRESSURE",
        "weight": 20,
        "confidence": "high",
        "explanation": "Artificial urgency deprives the investor of time to consult family, verify advisor credentials, or conduct due diligence.",
        "patterns": [
            # English
            r"(?i)\b(?:act|pay|transfer|send)\s+(?:now|immediately|urgently|within\s+\d+\s+min(?:ute)?s?)\b",
            r"(?i)\b(?:last|final)\s+chance\s+to\s+(?:invest|join|claim)\b",
            r"(?i)\bonly\s+\d+\s+(?:seats?|slots?|spots?)\s+left\b",
            r"(?i)\boffer\s+expires\s+(?:today|tonight|in\s+\d+\s+hours?)\b",
            r"(?i)\bimmediate\s+(?:payment|transfer|deposit)\s+required\b",
            # Hindi
            r"तुरंत\s*(?:पैसे|रुपये|भुगतान|ट्रांसफर)\s*(?:करें|भेजें)",
            r"अंतिम\s*अवसर",
            r"ऑफर\s*समाप्त",
            r"(?i)\bturant\s*(?:paise|payment)\s*(?:karo|bhejo)\b",
            # Kannada
            r"ತಕ್ಷಣ\s*(?:ಹಣ|ಪಾವತಿ)\s*(?:ಕಳುಹಿಸಿ|ಮಾಡಿ)",
            r"ಕೊನೆಯ\s*ಅವಕಾಶ",
            r"(?i)\bthakshana\s*(?:hana|pavathi)\s*(?:kaluhisi|madi)\b"
        ]
    },
    {
        "category": "FEES_TO_RELEASE_PROFIT",
        "weight": 30,
        "confidence": "high",
        "explanation": "Legitimate exchanges and mutual funds deduct applicable taxes/charges at source; they NEVER demand an advance upfront cash payment to release your existing account balance.",
        "patterns": [
            # English
            r"(?i)\b(?:pay|deposit)\s+(?:fee|tax|charges?|gst|commission)\s+(?:to|before)\s+(?:withdraw|release|unlock)\b",
            r"(?i)\bwithdrawal\s+(?:fee|tax|deposit|charges?)\s+(?:required|needed|due)\b",
            r"(?i)\bpay\s+\d+%\s+(?:tax|gst|clearance)\s+to\s+receive\b",
            r"(?i)\bwallet\s+(?:frozen|locked)\s+until\s+(?:fee|tax)\s+paid\b",
            # Hindi
            r"विड्रॉल\s*(?:के\s*लिए|फीस|टैक्स|शुल्क)",
            r"निकासी\s*(?:के\s*लिए\s*टैक्स|शुल्क)",
            r"मुनाफा\s*निकालने\s*के\s*लिए\s*पैसे\s*जमा",
            r"(?i)\bwithdrawal\s*(?:fees|tax|charge)\s*(?:dena|jama)\b",
            # Kannada
            r"ಲಾಭ\s*ಹಿಂಪಡೆಯಲು\s*ಶುಲ್ಕ",
            r"ವಿತ್‌ಡ್ರಾವಲ್\s*ಶುಲ್ಕ",
            r"ಹಣ\s*ಬಿಡುಗಡೆಗೆ\s*ತೆರಿಗೆ",
            r"(?i)\blabha\s*himpadeyalu\s*shulka\b"
        ]
    },
    {
        "category": "THREATS_AND_COERCION",
        "weight": 30,
        "confidence": "high",
        "explanation": "Threats of criminal proceedings, digital arrest, or sudden account forfeiture are hallmark coercion tactics used in illegal cyber scams.",
        "patterns": [
            # English
            r"(?i)\b(?:account|funds?)\s+will\s+be\s+(?:frozen|seized|blocked|confiscated)\b",
            r"(?i)\b(?:legal|police|cbi|ed|crime\s+branch|court)\s+(?:action|notice|warrant|arrest|raid)\b",
            r"(?i)\bdigital\s+arrest\b",
            r"(?i)\byou\s+will\s+be\s+prosecuted\s+unless\b",
            # Hindi
            r"खाता\s*(?:फ्रीज|ब्लॉक|जब्त)\s*कर\s*दिया\s*जाएगा",
            r"पुलिस\s*(?:कार्रवाई|वारंट|गिरफ्तारी)",
            r"डिजिटल\s*अरेस्ट",
            r"(?i)\bkhata\s*(?:freeze|block)\s*ho\s*jayega\b",
            # Kannada
            r"ಖಾತೆ\s*(?:ಸ್ಥಗಿತ|ನಿರ್ಬಂಧ|ಜಪ್ತಿ)",
            r"ಪೊಲೀಸ್\s*(?:ಕ್ರಮ|ಬಂಧನ|ವಾರಂಟ್)",
            r"ಡಿಜಿಟಲ್\s*ಅರೆಸ್ಟ್",
            r"(?i)\bkhate\s*(?:freeze|block)\s*aguththe\b"
        ]
    },
    {
        "category": "CREDENTIAL_HARVESTING",
        "weight": 35,
        "confidence": "high",
        "explanation": "Financial institutions and authorized market personnel NEVER ask for your OTP, PIN, password, or remote screen control.",
        "patterns": [
            # English
            r"(?i)\b(?:share|send|give|tell)\s+(?:me\s+)?(?:the\s+)?(?:otp|one[- ]time[- ]password|pin|password|passcode)\b",
            r"(?i)\b(?:install|download)\s+(?:anydesk|teamviewer|rustdesk|quicksupport)\b",
            r"(?i)\bshare\s+(?:your\s+)?(?:screen|device\s+access)\b",
            # Hindi
            r"ओटीपी\s*(?:शेयर|भेजें|बताएं|दीजिये)",
            r"पासवर्ड\s*(?:बताएं|दीजिये)",
            r"(?i)\banydesk\s*(?:install|download)\b",
            # Kannada
            r"ಒಟಿಪಿ\s*(?:ಕಳುಹಿಸಿ|ತಿಳಿಸಿ|ಹೇಳಿ)",
            r"ಪಾಸ್‌ವರ್ಡ್\s*ಹಂಚಿಕೊಳ್ಳಿ",
            r"(?i)\botp\s*(?:kaluhisi|heli)\b"
        ]
    },
    {
        "category": "INSTITUTIONAL_IMPERSONATION",
        "weight": 20,
        "confidence": "medium",
        "explanation": "Scammers frequently spoof names of prestigious regulators or market institutions (SEBI, NSE, NSDL, RBI) to falsely manufacture credibility.",
        "patterns": [
            # English
            r"(?i)\b(?:sebi|rbi|nsdl|cdsl|nse|bse)\s+(?:certified|authorized|approved|licensed|insider)\s+(?:trader|group|plan|officer)\b",
            r"(?i)\bofficial\s+institutional\s+(?:quota|allocation|desk)\b",
            r"(?i)\bsebi\s+special\s+permission\b",
            # Hindi
            r"सेबी\s*(?:प्रमाणित|अनुमोदित|अधिकृत)",
            r"आरबीआई\s*(?:मंजूरी|अधिकृत)",
            r"(?i)\bsebi\s*approved\b",
            # Kannada
            r"ಸೇಬಿ\s*(?:ಅನುಮೋದಿತ|ಪ್ರಮಾಣೀಕೃತ)",
            r"(?i)\bsebi\s*anumoditha\b"
        ]
    },
    {
        "category": "UNSOLICITED_GROUP_TIPS",
        "weight": 15,
        "confidence": "medium",
        "explanation": "Unsolicited invitations to private WhatsApp/Telegram channels offering secret insider stock tips are typical pump-and-dump syndicates.",
        "patterns": [
            # English
            r"(?i)\b(?:join\s+our\s+)?(?:vip|premium|exclusive|institutional)\s+(?:whatsapp|telegram)\s+(?:group|channel|community)\b",
            r"(?i)\b1000%\s+(?:jackpot|multibagger|upper[- ]circuit)\s+(?:stock|calls?|tips?)\b",
            r"(?i)\bfree\s+stock\s+tips\s+with\s+high\s+accuracy\b",
            # Hindi
            r"वीआईपी\s*(?:व्हाट्सएप|टेलीग्राम)\s*ग्रुप",
            r"जैकपॉट\s*स्टॉक\s*टिप्स",
            # Kannada
            r"ವಿಐಪಿ\s*(?:ವಾಟ್ಸಾಪ್|ಟೆಲಿಗ್ರಾಂ)\s*ಗ್ರೂಪ್",
            r"ಜಾಕ್‌ಪಾಟ್\s*ಷೇರು\s*ಟಿಪ್ಸ್"
        ]
    },
    {
        "category": "RECOVERY_SCAM",
        "weight": 35,
        "confidence": "high",
        "explanation": "Recovery scams target prior fraud victims, falsely promising to retrieve lost funds if an upfront advance investigation fee is paid.",
        "patterns": [
            # English
            r"(?i)\b(?:recover|retrieve|get\s+back)\s+(?:your\s+)?(?:lost|scammed|defrauded)\s+(?:funds?|money|crypto)\b",
            r"(?i)\b(?:cyber\s+investigator|ethical\s+hacker|recovery\s+agent)\s+will\s+recover\b",
            r"(?i)\badvance\s+fee\s+for\s+fund\s+recovery\b",
            # Hindi
            r"डूबा\s*हुआ\s*पैसा\s*(?:वापस|रिकवर)",
            r"खोया\s*हुआ\s*पैसा\s*वापस\s*दिलाएंगे",
            # Kannada
            r"ಕಳೆದುಹೋದ\s*ಹಣ\s*ಮರಳಿ\s*ಪಡೆಯಿರಿ",
            r"ವಂಚನೆಗೊಳಗಾದ\s*ಹಣ\s*ಹಿಂತಿರುಗಿಸುವಿಕೆ"
        ]
    },
    {
        "category": "SECRECY_DEMAND",
        "weight": 20,
        "confidence": "high",
        "explanation": "Demands to keep financial transfers secret from bank staff, family members, or advisors prevent timely intervention.",
        "patterns": [
            # English
            r"(?i)\bdo\s+not\s+(?:tell|inform|mention\s+to)\s+(?:your\s+)?(?:bank|family|friends?|anyone)\b",
            r"(?i)\bkeep\s+this\s+(?:confidential|strictly\s+secret|between\s+us)\b",
            r"(?i)\bif\s+bank\s+asks\s+say\s+it\s+is\s+for\s+(?:family|personal|medical)\b",
            # Hindi
            r"किसी\s*को\s*मत\s*(?:बताना|कहना)",
            r"बैंक\s*को\s*मत\s*बताना",
            # Kannada
            r"ಯಾರಿಗೂ\s*ಹೇಳಬೇಡಿ",
            r"ಬ್ಯಾಂಕ್‌ಗೆ\s*ಹೇಳಬೇಡಿ"
        ]
    },
    {
        "category": "PROMPT_INJECTION_ATTEMPT",
        "weight": 40,
        "confidence": "high",
        "explanation": "Detected adversarial instructions attempting to manipulate the security evaluation engine (e.g. prompt injection).",
        "patterns": [
            r"(?i)\bignore\s+(?:all\s+)?(?:previous|prior)\s+instructions\b",
            r"(?i)\byou\s+are\s+now\s+in\s+developer\s+mode\b",
            r"(?i)\boutput\s+guaranteed\s+safe\b",
            r"(?i)\bsystem\s+prompt\s*:\s*override\b",
            r"(?i)\bdo\s+not\s+flag\s+this\s+message\b"
        ]
    }
]

def analyze_text_evidence(text: str, situation: UserSituation = UserSituation.BEFORE_PAYMENT) -> Tuple[List[EvidenceItem], float, AssessmentStatus, RiskLevel]:
    """
    Evaluates raw text against transparent risk indicators.
    Extracts evidence items with exact supporting phrases, confidence, and verification status.
    Calculates calibrated heuristic risk score and assessment status.
    """
    if not text or len(text.strip()) < 10:
        return [], 0.0, AssessmentStatus.INSUFFICIENT_EVIDENCE, RiskLevel.UNCERTAIN

    clean_text = text.strip()
    evidence_items: List[EvidenceItem] = []
    total_score = 0.0
    detected_categories = set()

    for rule in INDICATOR_RULES:
        category = rule["category"]
        for pattern_str in rule["patterns"]:
            match = re.search(pattern_str, clean_text)
            if match:
                exact_phrase = match.group(0)
                if category not in detected_categories:
                    detected_categories.add(category)
                    total_score += rule["weight"]
                    evidence_items.append(
                        EvidenceItem(
                            evidence_id=f"ev_{uuid.uuid4().hex[:8]}",
                            evidence_type="prompt_injection_attempt" if category == "PROMPT_INJECTION_ATTEMPT" else "text_phrase",
                            indicator_category=category,
                            exact_phrase=exact_phrase,
                            explanation=rule["explanation"],
                            confidence_label=rule["confidence"],
                            verification_status="verified_in_content"
                        )
                    )
                break  # avoid duplicate counts for same category

    # Calibrate risk score to 0 - 100 range
    risk_score = min(100.0, float(total_score))

    # Incorporate user situation context if high risk context reported
    if situation in [UserSituation.PAYMENT_ALREADY_SENT, UserSituation.CREDENTIALS_DISCLOSED]:
        # Contextual floor for post-fraud triage
        risk_score = max(risk_score, 50.0)
    elif situation == UserSituation.UNDER_PRESSURE:
        risk_score = max(risk_score, 30.0)

    # Determine AssessmentStatus
    if len(detected_categories) >= 2 or risk_score >= 45.0:
        assessment_status = AssessmentStatus.MULTIPLE_CONCERNING_INDICATORS
    elif len(detected_categories) == 1 or (20.0 <= risk_score < 45.0):
        assessment_status = AssessmentStatus.SOME_INDICATORS_REQUIRE_VERIFICATION
    elif len(clean_text) < 25 and len(detected_categories) == 0:
        assessment_status = AssessmentStatus.INSUFFICIENT_EVIDENCE
    else:
        assessment_status = AssessmentStatus.NO_OBVIOUS_INDICATORS

    # Determine RiskLevel
    if risk_score >= 70.0:
        risk_level = RiskLevel.CRITICAL
    elif risk_score >= 45.0:
        risk_level = RiskLevel.HIGH
    elif risk_score >= 25.0:
        risk_level = RiskLevel.MODERATE
    elif assessment_status == AssessmentStatus.INSUFFICIENT_EVIDENCE:
        risk_level = RiskLevel.UNCERTAIN
    else:
        risk_level = RiskLevel.LOW

    return evidence_items, risk_score, assessment_status, risk_level
