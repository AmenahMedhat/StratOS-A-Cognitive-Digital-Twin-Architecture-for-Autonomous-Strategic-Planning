"""
tools.py – Pure Python HR metric calculators (zero LLM involvement).
=====================================================================
Every function in this module works exclusively on the raw JSON
dictionary that was loaded from `mock_workforce_data.json`.

Design principle
----------------
The LLM must NEVER be asked to do arithmetic.  All numerical facts
are produced here and handed to the LLM as pre-computed context.

Public API
----------
calculate_part_time_dependency(data)  -> dict
calculate_academic_pyramid(data)      -> dict
calculate_turnover(data)              -> dict
calculate_training_deficit(data)      -> dict
calculate_all_hr_metrics(data)        -> dict   ← main entry point
"""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime, date
from typing import Any


# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------

def _parse_date(date_str: str | None) -> date | None:
    """Return a ``date`` object or ``None`` if the string is absent/null."""
    if not date_str:
        return None
    return datetime.strptime(date_str, "%Y-%m-%d").date()


def _is_phd(record: dict[str, Any]) -> bool:
    return record.get("highest_degree", "").upper() == "PHD"


def _is_full_time(record: dict[str, Any]) -> bool:
    return record.get("employment_type", "").lower() == "full-time"


def _is_part_time(record: dict[str, Any]) -> bool:
    return record.get("employment_type", "").lower() == "part-time"


def _is_active(record: dict[str, Any]) -> bool:
    """An employee is active if they have no resignation date."""
    return record.get("resignation_date") is None


# ---------------------------------------------------------------------------
# 1. Part-Time Dependency
# ---------------------------------------------------------------------------

def calculate_part_time_dependency(data: dict[str, Any]) -> dict[str, Any]:
    """
    For each department, calculate:
      - total_phds          : all PhD holders (active + resigned)
      - full_time_phds      : active PhD full-timers
      - part_time_phds      : active PhD part-timers
      - part_time_pct       : part_time_phds / (full_time + part_time) * 100

    Returns
    -------
    dict keyed by department name.
    """
    dept_stats: dict[str, dict[str, int]] = defaultdict(
        lambda: {"full_time_phds": 0, "part_time_phds": 0}
    )

    for record in data.get("employee_records", []):
        if not _is_phd(record) or not _is_active(record):
            continue

        dept = record.get("department", "Unknown")

        if _is_full_time(record):
            dept_stats[dept]["full_time_phds"] += 1
        elif _is_part_time(record):
            dept_stats[dept]["part_time_phds"] += 1

    result: dict[str, Any] = {}
    for dept, counts in dept_stats.items():
        total = counts["full_time_phds"] + counts["part_time_phds"]
        part_time_pct = (
            round(counts["part_time_phds"] / total * 100, 1) if total > 0 else 0.0
        )
        result[dept] = {
            "full_time_phds": counts["full_time_phds"],
            "part_time_phds": counts["part_time_phds"],
            "total_active_phds": total,
            "part_time_dependency_pct": part_time_pct,
        }

    return result


# ---------------------------------------------------------------------------
# 2. Academic Pyramid (Student-to-PhD ratio)
# ---------------------------------------------------------------------------

def calculate_academic_pyramid(data: dict[str, Any]) -> dict[str, Any]:
    """
    For each department present in ``department_summaries``, calculate:
      - active_students     : from department_summaries
      - full_time_phds      : active full-time PhD holders in that dept
      - student_to_phd_ratio: active_students / full_time_phds
                              (None if no full-time PhDs exist)

    A high ratio signals capacity strain; the LLM will interpret severity.

    Returns
    -------
    dict keyed by department name.
    """
    # Count active full-time PhDs per department
    phd_counts: dict[str, int] = defaultdict(int)
    for record in data.get("employee_records", []):
        if _is_phd(record) and _is_full_time(record) and _is_active(record):
            dept = record.get("department", "Unknown")
            phd_counts[dept] += 1

    result: dict[str, Any] = {}
    for dept, summary in data.get("department_summaries", {}).items():
        active_students: int = summary.get("active_students", 0)
        full_time_phds: int = phd_counts.get(dept, 0)

        if full_time_phds > 0:
            ratio = round(active_students / full_time_phds, 1)
        else:
            ratio = None  # Division undefined – a critical gap signal

        result[dept] = {
            "active_students": active_students,
            "full_time_phds": full_time_phds,
            "student_to_phd_ratio": ratio,
        }

    return result


# ---------------------------------------------------------------------------
# 3. Turnover (last 12 months)
# ---------------------------------------------------------------------------

def calculate_turnover(data: dict[str, Any]) -> dict[str, Any]:
    """
    Count all employees whose ``resignation_date`` falls within the 12-month
    window ending on ``report_date``.

    Breakdown includes:
      - total_resignations_12m   : all departures
      - phd_resignations_12m     : PhD holders who resigned (higher risk)
      - senior_faculty_resignations : Professors / Associate Professors
      - resigned_employees        : list of dicts with id, dept, rank

    Returns
    -------
    A flat dict with aggregate counters and the detail list.
    """
    report_date: date = _parse_date(data.get("report_date")) or date.today()

    total = 0
    phd_total = 0
    senior_total = 0
    resigned_detail: list[dict[str, str]] = []

    senior_ranks = {"Professor", "Associate Professor"}

    for record in data.get("employee_records", []):
        resignation_date = _parse_date(record.get("resignation_date"))
        if resignation_date is None:
            continue  # Still active

        # Check if within last 12 months
        days_since_resignation = (report_date - resignation_date).days
        if 0 <= days_since_resignation <= 365:
            total += 1

            if _is_phd(record):
                phd_total += 1

            if record.get("academic_rank") in senior_ranks:
                senior_total += 1

            resigned_detail.append(
                {
                    "employee_id": record.get("employee_id", "N/A"),
                    "department": record.get("department", "Unknown"),
                    "academic_rank": record.get("academic_rank", "Unknown"),
                    "highest_degree": record.get("highest_degree", "Unknown"),
                    "resignation_date": str(resignation_date),
                }
            )

    return {
        "report_date": str(report_date),
        "window_months": 12,
        "total_resignations_12m": total,
        "phd_resignations_12m": phd_total,
        "senior_faculty_resignations_12m": senior_total,
        "resigned_employees": resigned_detail,
    }


# ---------------------------------------------------------------------------
# 4. Training Deficit (Teaching Assistants)
# ---------------------------------------------------------------------------

def calculate_training_deficit(data: dict[str, Any]) -> dict[str, Any]:
    """
    Focus exclusively on Teaching Assistants (TAs) because they are the
    pipeline for future faculty and often the most under-trained cohort.

    Calculates:
      - ta_count                     : number of active TAs
      - total_training_hours_ytd     : aggregate YTD hours across all TAs
      - avg_training_hours_per_ta    : mean hours per TA
      - tas_below_threshold          : TAs with < 20 hours (industry benchmark)
      - below_threshold_pct          : percentage below 20 h threshold

    Returns
    -------
    A flat dict of TA training statistics.
    """
    TA_THRESHOLD_HOURS: int = 20  # Minimum recommended training hours / year

    active_tas: list[dict[str, Any]] = [
        r
        for r in data.get("employee_records", [])
        if r.get("academic_rank", "").lower() == "teaching assistant"
        and _is_active(r)
    ]

    ta_count = len(active_tas)

    if ta_count == 0:
        return {
            "ta_count": 0,
            "total_training_hours_ytd": 0,
            "avg_training_hours_per_ta": None,
            "threshold_hours": TA_THRESHOLD_HOURS,
            "tas_below_threshold": 0,
            "below_threshold_pct": None,
            "note": "No active Teaching Assistants found in records.",
        }

    total_hours: int = sum(r.get("training_hours_ytd", 0) for r in active_tas)
    avg_hours: float = round(total_hours / ta_count, 1)
    below_threshold: list[dict[str, Any]] = [
        r for r in active_tas if r.get("training_hours_ytd", 0) < TA_THRESHOLD_HOURS
    ]
    below_count = len(below_threshold)
    below_pct = round(below_count / ta_count * 100, 1)

    return {
        "ta_count": ta_count,
        "total_training_hours_ytd": total_hours,
        "avg_training_hours_per_ta": avg_hours,
        "threshold_hours": TA_THRESHOLD_HOURS,
        "tas_below_threshold": below_count,
        "below_threshold_pct": below_pct,
    }


# ---------------------------------------------------------------------------
# 5. Master aggregator
# ---------------------------------------------------------------------------

def calculate_all_hr_metrics(data: dict[str, Any]) -> dict[str, Any]:
    """
    Run all four metric calculators and return a single consolidated
    dictionary that can be serialised and injected into the LLM prompt.

    Parameters
    ----------
    data : dict
        The raw workforce JSON loaded from ``mock_workforce_data.json``.

    Returns
    -------
    dict with keys:
        - ``part_time_dependency``
        - ``academic_pyramid``
        - ``turnover``
        - ``training_deficit``
        - ``report_date``
    """
    return {
        "report_date": data.get("report_date", "unknown"),
        "part_time_dependency": calculate_part_time_dependency(data),
        "academic_pyramid": calculate_academic_pyramid(data),
        "turnover": calculate_turnover(data),
        "training_deficit": calculate_training_deficit(data),
    }
