import pytest
from app.services.action_engine import resolve_recommended_actions
from app.models.schemas import UserSituation, Language

def test_before_payment_actions_english():
    actions = resolve_recommended_actions(UserSituation.BEFORE_PAYMENT, Language.EN)
    assert len(actions) >= 3
    assert actions[0].priority == 1
    assert "Pause" in actions[0].title
    assert actions[0].action_state == "BEFORE_PAYMENT"

def test_under_pressure_actions_hindi():
    actions = resolve_recommended_actions(UserSituation.UNDER_PRESSURE, Language.HI)
    assert len(actions) >= 3
    assert any("धमकियों" in a.title or "सबूत" in a.title for a in actions)

def test_payment_sent_actions_kannada():
    actions = resolve_recommended_actions(UserSituation.PAYMENT_ALREADY_SENT, Language.KN)
    assert len(actions) >= 3
    assert any("1930" in a.title or "1930" in a.description for a in actions)

def test_recovery_scam_actions():
    actions = resolve_recommended_actions(UserSituation.SUSPECTED_RECOVERY_SCAM, Language.EN)
    assert any("Advance" in a.title or "Zero" in a.title for a in actions)
