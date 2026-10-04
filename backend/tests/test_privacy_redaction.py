import pytest
from app.core.logging_redactor import redact_sensitive_data

def test_redact_phone_and_pan():
    raw = "My phone is 9876543210 and my PAN card is ABCDE1234F. Send money to account 1234567890123."
    sanitized, redactions = redact_sensitive_data(raw)
    assert "9876543210" not in sanitized
    assert "ABCDE1234F" not in sanitized
    assert "[REDACTED_PHONE]" in sanitized
    assert "[REDACTED_PAN]" in sanitized
    assert len(redactions) >= 2

def test_redact_aadhaar_and_otp():
    raw = "Your Aadhaar is 2345 6789 0123 and OTP is 654321. Do not share."
    sanitized, redactions = redact_sensitive_data(raw)
    assert "2345 6789 0123" not in sanitized
    assert "654321" not in sanitized
    assert "[REDACTED_AADHAAR]" in sanitized
    assert "[REDACTED_OTP]" in sanitized

def test_redact_upi_and_url_token():
    raw = "Send to scammer@okhdfcbank or click https://evil.com/login?token=secret123456"
    sanitized, redactions = redact_sensitive_data(raw)
    assert "scammer@okhdfcbank" not in sanitized
    assert "secret123456" not in sanitized
    assert "[REDACTED_UPI_ID]" in sanitized
    assert "[REDACTED_TOKEN]" in sanitized
