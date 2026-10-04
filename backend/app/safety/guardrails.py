from typing import List

MANDATORY_DISCLAIMER_EN = (
    "THAMO is an AI-powered financial safety assistant created to highlight potential scam indicators and guide incident response. "
    "THAMO does not offer stock recommendations, speculative investment tips, legal representation, or guarantees of financial recovery. "
    "Absence of detected warning signals does not constitute a certification of safety."
)

MANDATORY_DISCLAIMER_HI = (
    "थामो (THAMO) एक वित्तीय सुरक्षा सहायक है जो संदिग्ध धोखाधड़ी के संकेतों की पहचान और प्राथमिक सहायता के लिए है। "
    "थामो कोई स्टॉक टिप्स, निवेश सलाह या पैसा वापस दिलाने की गारंटी नहीं देता है। "
    "किसी चेतावनी का न मिलना सुरक्षा का प्रमाण नहीं है।"
)

MANDATORY_DISCLAIMER_KN = (
    "ಥಾಮೋ (THAMO) ಹೂಡಿಕೆದಾರರ ಸುರಕ್ಷತೆ ಮತ್ತು ವಂಚನೆ ತಡೆಗಟ್ಟುವ ಮಾರ್ಗದರ್ಶಿ ಸಹಾಯಕವಾಗಿದೆ. "
    "ಥಾಮೋ ಯಾವುದೇ ಷೇರು ಶಿಫಾರಸು, ಹೂಡಿಕೆ ಸಲಹೆ ಅಥವಾ ಹಣ ಮರಳಿ ಕೊಡಿಸುವ ಭರವಸೆ ನೀಡುವುದಿಲ್ಲ. "
    "ಎಚ್ಚರಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ ಎಂದ ಮಾತ್ರಕ್ಕೆ ಅದು ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ ಎಂದು ಅರ್ಥವಲ್ಲ."
)

PROHIBITED_ADVICE_TOKENS = [
    "buy this stock", "sell this stock", "target price", "multibagger stock",
    "guaranteed recovery", "we will get your money back", "invest in this broker"
]

def check_guardrails_compliance(text: str) -> bool:
    """Verifies that generated explanation contains no speculative investment advice or false recovery claims."""
    lowered = text.lower()
    for token in PROHIBITED_ADVICE_TOKENS:
        if token in lowered:
            return False
    return True

def get_mandatory_disclaimer(lang: str) -> str:
    if lang == "hi":
        return MANDATORY_DISCLAIMER_HI
    elif lang == "kn":
        return MANDATORY_DISCLAIMER_KN
    return MANDATORY_DISCLAIMER_EN
