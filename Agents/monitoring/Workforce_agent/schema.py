"""
schema.py – Pydantic output models for the Workforce Agent.
===========================================================
These models define the *structured* output contract that the LLM
must satisfy.  Using `.with_structured_output(WorkforceInsights)` in
LangChain guarantees the response always conforms to this schema.

Models
------
HR_Insight          – A single, atomic HR finding classified as a
                      Strength or Weakness, with an impact level.
WorkforceInsights   – The top-level container returned by the agent.
"""

from typing import List, Literal

from pydantic import BaseModel, Field


class HR_Insight(BaseModel):
    """
    Represents a single, self-contained HR observation derived from
    mathematically calculated workforce metrics.  Every finding is
    classified as either a Strength or a Weakness relative to healthy
    internal HR benchmarks.
    """

    metric_category: str = Field(
        description=(
            "The broad HR category this insight belongs to.  "
            "Examples: 'Part-Time Dependency', 'Turnover', "
            "'Academic Pyramid', 'Training'."
        )
    )

    insight_type: Literal["Strength", "Weakness"] = Field(
        description=(
            "Whether the metric represents a healthy HR state ('Strength') "
            "or a risk, deficit, or compliance violation ('Weakness').  "
            "This classification is based solely on internal HR benchmarks — "
            "no external accreditation framing."
        )
    )

    finding: str = Field(
        description=(
            "A detailed, professional observation grounded in the "
            "calculated metric facts.  Must be specific (include "
            "numbers / percentages where available) and free of "
            "accreditation or SWOT framing."
        )
    )

    impact_level: Literal["High", "Medium", "Low"] = Field(
        description=(
            "The magnitude of this finding's impact on faculty operations.  "
            "High   – critical Weakness or exceptionally strong Strength "
            "         that demands immediate attention or recognition.  "
            "Medium – notable issue or positive indicator worth monitoring.  "
            "Low    – minor deviation or informational observation."
        )
    )


class WorkforceInsights(BaseModel):
    """
    Top-level structured output returned by the Workforce Agent after
    the LLM has interpreted the pre-calculated HR metrics.  Each insight
    is independently classified as a Strength or Weakness.
    """

    insights: List[HR_Insight] = Field(
        description=(
            "An ordered list of HR insights derived from this reporting "
            "cycle.  Each insight maps to exactly one metric category and "
            "carries an insight_type (Strength / Weakness) and impact_level."
        )
    )