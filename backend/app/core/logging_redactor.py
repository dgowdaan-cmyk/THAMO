import logging
import re
from typing import Tuple, List

# Regex patterns for Indian financial & PII data
REDACTION_PATTERNS = [
    # Aadhaar Number (12 digits, optional spaces/hyphens)
    (re.compile(r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b"), "[REDACTED_AADHAAR]"),
    # PAN Card (5 uppercase letters, 4 digits, 1 uppercase letter)
    (re.compile(r"\b[A-Za-z]{5}\d{4}[A-Za-z]\b"), "[REDACTED_PAN]"),
    # Credit/Debit Card (16 digits in blocks of 4)
    (re.compile(r"\b(?:\d{4}[\s-]?){3}\d{4}\b"), "[REDACTED_CARD]"),
    # Indian Mobile Numbers (10 digits starting with 6-9, optional +91/0 prefix)
    (re.compile(r"(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b"), "[REDACTED_PHONE]"),
    # Bank Account numbers (explicitly labelled: A/c, Account No, etc. followed by 9-18 digits)
    (re.compile(r"(?i)\b(?:a/c|account\s*(?:no|num|number)?)\s*[:#-]?\s*(\d{9,18})\b"), "A/C: [REDACTED_ACCOUNT]"),
    # UPI IDs (e.g. user@okhdfcbank, someone@upi)
    (re.compile(r"\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b"), "[REDACTED_UPI_ID]"),
    # OTP / PIN captures
    (re.compile(r"(?i)\b(?:otp|one[- ]time[- ]password|pin|passcode)\s*(?:is|:|=)?\s*(\d{4,8})\b"), "OTP [REDACTED_OTP]"),
    # Password / credentials in query strings or messages
    (re.compile(r"(?i)\b(?:password|passwd|pwd|secret)\s*[:=]\s*([^\s,;]+)"), "PASSWORD: [REDACTED_SECRET]"),
    # URLs with embedded tokens or keys
    (re.compile(r"(https?://\S+?(?:token|access_token|key|secret|api_key)=)[^\s&]+"), r"\1[REDACTED_TOKEN]")
]

def redact_sensitive_data(text: str) -> Tuple[str, List[str]]:
    """
    Redacts sensitive personal and financial identifiers from text.
    Returns the sanitized text and a list of redaction categories applied.
    """
    if not text:
        return text, []

    redacted_text = text
    applied_redactions: List[str] = []

    for pattern, replacement in REDACTION_PATTERNS:
        matches = pattern.findall(redacted_text)
        if matches:
            redacted_text = pattern.sub(replacement, redacted_text)
            applied_redactions.append(replacement.strip("[]"))

    return redacted_text, list(set(applied_redactions))

class RedactingFormatter(logging.Formatter):
    """Logging formatter that automatically redacts sensitive data from log records."""
    def format(self, record: logging.LogRecord) -> str:
        original = super().format(record)
        redacted, _ = redact_sensitive_data(original)
        return redacted

def setup_secure_logger(name: str = "thamo") -> logging.Logger:
    """Configures a logger with automatic sensitive data redaction."""
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = RedactingFormatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.propagate = False
    return logger

logger = setup_secure_logger("thamo.core")
