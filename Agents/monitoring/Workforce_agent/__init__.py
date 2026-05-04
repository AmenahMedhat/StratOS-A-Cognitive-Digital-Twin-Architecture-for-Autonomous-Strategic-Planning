"""
Zone 2 – Monitoring Squad: Workforce Agent
==========================================
Entry-point package for the Workforce (HR) Data Gatherer agent.

Exposes the compiled LangGraph application so that downstream
orchestrators can import it with a single line:

    from zone2_monitoring.workforce_agent import app
"""

from .agent import app  # noqa: F401

__all__ = ["app"]
