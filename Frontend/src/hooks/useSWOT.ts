"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchInsights } from "@/services/mockApi";
import type { InsightCard, SwotCategory, NaqaaePillar } from "@/types";

export function useSWOT() {
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<SwotCategory | "all">("all");
  const [pillarFilter, setPillarFilter] = useState<NaqaaePillar | "all">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchInsights();
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = insights.filter((i) => {
    const matchCat = categoryFilter === "all" || i.category === categoryFilter;
    const matchPillar = pillarFilter === "all" || i.pillar_tag === pillarFilter;
    return matchCat && matchPillar;
  });

  const byCategory = {
    strength: filtered.filter((i) => i.category === "strength"),
    weakness: filtered.filter((i) => i.category === "weakness"),
    opportunity: filtered.filter((i) => i.category === "opportunity"),
    threat: filtered.filter((i) => i.category === "threat"),
  };

  return {
    insights: filtered,
    byCategory,
    loading,
    error,
    refetch: load,
    categoryFilter,
    setCategoryFilter,
    pillarFilter,
    setPillarFilter,
  };
}
