import json
import time
from datetime import datetime
from typing import Dict, Any, List
from app.core.config import settings
from app.services.detector import analyze_text_evidence
from app.models.schemas import EvaluationSummary, UserSituation

def run_evaluation_suite() -> EvaluationSummary:
    """
    Runs automated evaluation against the curated benchmark dataset.
    Calculates actual mathematical metrics (Precision, Recall, F1, Latency) by language.
    Does NOT fabricate numbers or claims.
    """
    dataset_path = settings.EVALUATION_DATASET_PATH
    if not dataset_path.exists():
        raise FileNotFoundError(f"Evaluation dataset not found at {dataset_path}")

    with open(dataset_path, "r", encoding="utf-8") as f:
        dataset: List[Dict[str, Any]] = json.load(f)

    total_cases = len(dataset)
    results_by_lang: Dict[str, Dict[str, Any]] = {
        "en": {"tp": 0, "fp": 0, "tn": 0, "fn": 0, "latencies_ms": []},
        "hi": {"tp": 0, "fp": 0, "tn": 0, "fn": 0, "latencies_ms": []},
        "kn": {"tp": 0, "fp": 0, "tn": 0, "fn": 0, "latencies_ms": []}
    }

    start_suite_time = time.perf_counter()

    for item in dataset:
        lang = item.get("language", "en")
        if lang not in results_by_lang:
            results_by_lang[lang] = {"tp": 0, "fp": 0, "tn": 0, "fn": 0, "latencies_ms": []}

        ground_truth_suspicious = item["is_suspicious"]
        text = item["text"]

        t0 = time.perf_counter()
        evidence, score, status, risk = analyze_text_evidence(text, UserSituation.BEFORE_PAYMENT)
        t1 = time.perf_counter()
        lat_ms = (t1 - t0) * 1000.0
        results_by_lang[lang]["latencies_ms"].append(lat_ms)

        predicted_suspicious = len(evidence) > 0

        if ground_truth_suspicious and predicted_suspicious:
            results_by_lang[lang]["tp"] += 1
        elif (not ground_truth_suspicious) and predicted_suspicious:
            results_by_lang[lang]["fp"] += 1
        elif (not ground_truth_suspicious) and (not predicted_suspicious):
            results_by_lang[lang]["tn"] += 1
        elif ground_truth_suspicious and (not predicted_suspicious):
            results_by_lang[lang]["fn"] += 1

    total_suite_ms = (time.perf_counter() - start_suite_time) * 1000.0
    avg_latency_ms = round(total_suite_ms / max(1, total_cases), 2)

    # Compute overall confusion matrix
    total_tp = sum(d["tp"] for d in results_by_lang.values())
    total_fp = sum(d["fp"] for d in results_by_lang.values())
    total_tn = sum(d["tn"] for d in results_by_lang.values())
    total_fn = sum(d["fn"] for d in results_by_lang.values())

    overall_acc = (total_tp + total_tn) / max(1, total_cases)
    overall_prec = total_tp / max(1, (total_tp + total_fp)) if (total_tp + total_fp) > 0 else 0.0
    overall_rec = total_tp / max(1, (total_tp + total_fn)) if (total_tp + total_fn) > 0 else 0.0
    overall_f1 = (2 * overall_prec * overall_rec / (overall_prec + overall_rec)) if (overall_prec + overall_rec) > 0 else 0.0
    overall_fpr = total_fp / max(1, (total_fp + total_tn)) if (total_fp + total_tn) > 0 else 0.0
    overall_fnr = total_fn / max(1, (total_fn + total_tp)) if (total_fn + total_tp) > 0 else 0.0

    metrics_by_language: Dict[str, Dict[str, Any]] = {}
    for lang, counts in results_by_lang.items():
        tp = counts["tp"]
        fp = counts["fp"]
        tn = counts["tn"]
        fn = counts["fn"]
        sub_total = tp + fp + tn + fn
        acc = (tp + tn) / max(1, sub_total)
        prec = tp / max(1, (tp + fp)) if (tp + fp) > 0 else 0.0
        rec = tp / max(1, (tp + fn)) if (tp + fn) > 0 else 0.0
        f1 = (2 * prec * rec / (prec + rec)) if (prec + rec) > 0 else 0.0
        avg_lat = round(sum(counts["latencies_ms"]) / max(1, len(counts["latencies_ms"])), 2)

        metrics_by_language[lang] = {
            "cases_evaluated": sub_total,
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "true_positives": tp,
            "false_positives": fp,
            "true_negatives": tn,
            "false_negatives": fn,
            "avg_latency_ms": avg_lat
        }

    known_limitations = [
        "Detection rules rely on recognizable semantic patterns; completely novel dialectal phrasing may yield false negatives.",
        "Short snippets under 10 characters are intentionally classified as INSUFFICIENT_EVIDENCE to avoid unfounded speculation.",
        "Image OCR quality depends on client screenshot resolution and system character recognition binaries.",
        "Zero-day phishing websites with fresh, non-brand domains require external threat-intelligence verification not performed locally."
    ]

    return EvaluationSummary(
        total_cases=total_cases,
        metrics_by_language=metrics_by_language,
        overall_accuracy=round(overall_acc, 4),
        overall_precision=round(overall_prec, 4),
        overall_recall=round(overall_rec, 4),
        overall_f1=round(overall_f1, 4),
        false_positive_rate=round(overall_fpr, 4),
        false_negative_rate=round(overall_fnr, 4),
        confusion_matrix={
            "true_positives": total_tp,
            "false_positives": total_fp,
            "true_negatives": total_tn,
            "false_negatives": total_fn
        },
        avg_latency_ms=avg_latency_ms,
        known_limitations=known_limitations,
        timestamp=datetime.utcnow().isoformat() + "Z"
    )
