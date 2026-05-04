"use client";

import { useState, useCallback } from "react";
import { runAgentAndWait, type AgentName } from "@/services/agentApi";
import { useAgentResults } from "@/contexts/AgentResultsContext";
import type { InsightCard, SwotCategory, NaqaaePillar } from "@/types";

export type SwotAgentName = Extract<AgentName, "tech" | "workforce" | "sentiment">;

export function useSWOT() {
  const [categoryFilter, setCategoryFilter] = useState<SwotCategory | "all">("all");
  const [pillarFilter, setPillarFilter] = useState<NaqaaePillar | "all">("all");
  const [agentRunning, setAgentRunning] = useState<SwotAgentName | null>(null);
  const [agentError, setAgentError] = useState<string | null>(null);

  // Only live agent results — no mock fallback
  const { results, addInsights } = useAgentResults();

  const runAgent = useCallback(async (agentName: SwotAgentName) => {
    setAgentRunning(agentName);
    setAgentError(null);
    try {
      const result = await runAgentAndWait(agentName, { intervalMs: 3_000 }) as {
        insights?: InsightCard[];
      };
      if (result?.insights && result.insights.length > 0) {
        addInsights(result.insights);
      }
    } catch (err) {
      setAgentError(
        err instanceof Error ? err.message : `${agentName} agent failed`
      );
    } finally {
      setAgentRunning(null);
    }
  }, [addInsights]);

  const filtered = results.insights.filter((i) => {
    const matchCat = categoryFilter === "all" || i.category === categoryFilter;
    const matchPillar = pillarFilter === "all" || i.pillar_tag === pillarFilter;
    return matchCat && matchPillar;
  });

  const byCategory = {
    strength:    filtered.filter((i) => i.category === "strength"),
    weakness:    filtered.filter((i) => i.category === "weakness"),
    opportunity: filtered.filter((i) => i.category === "opportunity"),
    threat:      filtered.filter((i) => i.category === "threat"),
  };

  return {
    insights: filtered,
    byCategory,
    loading: false,
    error: null,
    categoryFilter,
    setCategoryFilter,
    pillarFilter,
    setPillarFilter,
    runAgent,
    agentRunning,
    agentError,
  };
}
