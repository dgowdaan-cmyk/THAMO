from typing import List
from app.models.schemas import TimelineStage, EvidenceItem, UserSituation

def construct_pressure_timeline(
    evidence_items: List[EvidenceItem],
    situation: UserSituation
) -> List[TimelineStage]:
    """
    Constructs an evidence-attributed 6-stage Pressure Progression Timeline.
    Derives stages strictly from observable evidence without fabricating progression.
    """
    category_map = {item.indicator_category: item for item in evidence_items}

    stages = [
        # Stage 1: Initial Contact / Channel
        TimelineStage(
            stage_id="stage_1_initial_contact",
            stage_name="1. Initial Contact & Channel Funneling",
            stage_order=1,
            status="detected" if "UNSOLICITED_GROUP_TIPS" in category_map else "unknown",
            supporting_evidence=(
                f"Observed funneling phrase: '{category_map['UNSOLICITED_GROUP_TIPS'].exact_phrase}'"
                if "UNSOLICITED_GROUP_TIPS" in category_map
                else "No explicit invitation link or channel introduction observed in provided snippet."
            ),
            indicator_meaning="Unsolicited invites to private Telegram or WhatsApp groups isolate the target from public peer review.",
            uncertainty_note="Evidence snippet may only be a mid-conversation excerpt; prior contact channel cannot be conclusively assumed."
        ),
        # Stage 2: Trust-Building & Authority Impersonation
        TimelineStage(
            stage_id="stage_2_trust_building",
            stage_name="2. Credibility Fabrication & Impersonation",
            stage_order=2,
            status="detected" if "INSTITUTIONAL_IMPERSONATION" in category_map else "unknown",
            supporting_evidence=(
                f"Impersonation phrase: '{category_map['INSTITUTIONAL_IMPERSONATION'].exact_phrase}'"
                if "INSTITUTIONAL_IMPERSONATION" in category_map
                else "No explicit regulatory or institutional credential claim found in the submitted text."
            ),
            indicator_meaning="Spoofing SEBI, NSE, or institutional registries creates an unearned facade of legal compliance.",
            uncertainty_note="Requires verification against SEBI's official public register of intermediaries."
        ),
        # Stage 3: Displayed or Promised High Returns
        TimelineStage(
            stage_id="stage_3_promised_profits",
            stage_name="3. Lucrative Bait & Guaranteed Returns",
            stage_order=3,
            status="detected" if "GUARANTEED_RETURNS" in category_map else "not_detected",
            supporting_evidence=(
                f"Bait phrase: '{category_map['GUARANTEED_RETURNS'].exact_phrase}'"
                if "GUARANTEED_RETURNS" in category_map
                else "No guaranteed profit promise detected in the given text."
            ),
            indicator_meaning="Promising abnormal, guaranteed returns triggers emotional excitement and overrides rational skepticism.",
            uncertainty_note="Scammers sometimes camouflage promised gains under technical jargon like 'arbitrage margin'."
        ),
        # Stage 4: Artificial Urgency & Coercive Pressure
        TimelineStage(
            stage_id="stage_4_urgency_pressure",
            stage_name="4. Artificial Urgency & Cognitive Overload",
            stage_order=4,
            status="detected" if ("URGENCY_PRESSURE" in category_map or situation == UserSituation.UNDER_PRESSURE) else "not_detected",
            supporting_evidence=(
                f"Urgency cue: '{category_map['URGENCY_PRESSURE'].exact_phrase}'"
                if "URGENCY_PRESSURE" in category_map
                else ("Investor reported high pressure state" if situation == UserSituation.UNDER_PRESSURE else "No acute countdown or expiration urgency detected.")
            ),
            indicator_meaning="Imposing rapid deadlines forces impulsive decisions before the investor can check with banks or trusted peers.",
            uncertainty_note="Legitimate promotional marketing occasionally uses expiration dates, but never for authorized investment returns."
        ),
        # Stage 5: Transfer Demand or Credential Extraction
        TimelineStage(
            stage_id="stage_5_payment_or_credential_demand",
            stage_name="5. Financial Transfer or Credential Harvesting",
            stage_order=5,
            status="detected" if ("CREDENTIAL_HARVESTING" in category_map or "SECRECY_DEMAND" in category_map or situation in [UserSituation.PAYMENT_ALREADY_SENT, UserSituation.CREDENTIALS_DISCLOSED]) else "unknown",
            supporting_evidence=(
                f"Harvesting demand: '{category_map.get('CREDENTIAL_HARVESTING', category_map.get('SECRECY_DEMAND')).exact_phrase}'"
                if ("CREDENTIAL_HARVESTING" in category_map or "SECRECY_DEMAND" in category_map)
                else ("Transaction already executed per user report" if situation in [UserSituation.PAYMENT_ALREADY_SENT, UserSituation.CREDENTIALS_DISCLOSED] else "No direct OTP or private credential request parsed in snippet.")
            ),
            indicator_meaning="Harvesting OTPs, screen share access, or transfers to personal UPIs enables irreversible fund siphoning.",
            uncertainty_note="Specific banking account destination is not verifiable without formal transaction slip or UPI handle verification."
        ),
        # Stage 6: Withdrawal Barriers, Extortion, or Recovery Scam
        TimelineStage(
            stage_id="stage_6_barriers_or_recovery",
            stage_name="6. Withdrawal Block, Extortion, or Secondary Recovery Trap",
            stage_order=6,
            status="detected" if ("FEES_TO_RELEASE_PROFIT" in category_map or "THREATS_AND_COERCION" in category_map or "RECOVERY_SCAM" in category_map or situation == UserSituation.SUSPECTED_RECOVERY_SCAM) else "not_detected",
            supporting_evidence=(
                f"Extortion / barrier cue: '{category_map.get('FEES_TO_RELEASE_PROFIT', category_map.get('THREATS_AND_COERCION', category_map.get('RECOVERY_SCAM'))).exact_phrase}'"
                if ("FEES_TO_RELEASE_PROFIT" in category_map or "THREATS_AND_COERCION" in category_map or "RECOVERY_SCAM" in category_map)
                else ("Secondary recovery scheme suspected per situation report" if situation == UserSituation.SUSPECTED_RECOVERY_SCAM else "No extortion fees or recovery scam signals identified.")
            ),
            indicator_meaning="Demanding taxes or fees to unlock profits is a secondary entrapment mechanism; victims lose additional money.",
            uncertainty_note="If extortion involves government agencies (ED/CBI), it represents high-severity cyber deception."
        )
    ]

    return stages
