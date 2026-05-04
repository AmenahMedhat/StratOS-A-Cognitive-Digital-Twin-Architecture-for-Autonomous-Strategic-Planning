"use client";

/**
 * AgentResultsContext
 * Global store for all agent results — persisted to localStorage so data
 * survives page navigation and browser refreshes.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import type { InsightCard, ResearchIntelligence } from "@/types";

// ── Shape ─────────────────────────────────────────────────────────────────────

interface AgentResults {
  insights: InsightCard[];           // combined from tech + workforce + sentiment
  research: ResearchIntelligence | null;  // from benchmark agent
}

interface ContextValue {
  results: AgentResults;
  addInsights: (newInsights: InsightCard[]) => void;
  setResearch: (data: ResearchIntelligence) => void;
  clearAll: () => void;
}

// ── Reducer ───────────────────────────────────────────────────────────────────

type Action =
  | { type: "ADD_INSIGHTS"; insights: InsightCard[] }
  | { type: "SET_RESEARCH"; data: ResearchIntelligence }
  | { type: "LOAD"; results: AgentResults }
  | { type: "CLEAR" };

const DEFAULT: AgentResults = { insights: [], research: null };
const STORAGE_KEY = "stratos_agent_results_v1";

function reducer(state: AgentResults, action: Action): AgentResults {
  switch (action.type) {
    case "ADD_INSIGHTS": {
      const liveIds = new Set(action.insights.map((i) => i.id));
      const base = state.insights.filter((i) => !liveIds.has(i.id));
      return { ...state, insights: [...base, ...action.insights] };
    }
    case "SET_RESEARCH":
      return { ...state, research: action.data };
    case "LOAD":
      return action.results;
    case "CLEAR":
      return DEFAULT;
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const AgentResultsContext = createContext<ContextValue>({
  results: DEFAULT,
  addInsights: () => {},
  setResearch: () => {},
  clearAll: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function AgentResultsProvider({ children }: { children: React.ReactNode }) {
  const [results, dispatch] = useReducer(reducer, DEFAULT);

  // Hydrate from localStorage on first client render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: AgentResults = JSON.parse(raw);
        if (parsed.insights || parsed.research) {
          dispatch({ type: "LOAD", results: parsed });
        }
      }
    } catch {
      // Corrupted storage — ignore
    }
  }, []);

  // Persist every state change to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    } catch {
      // Storage full or unavailable — ignore
    }
  }, [results]);

  const addInsights = useCallback((newInsights: InsightCard[]) => {
    dispatch({ type: "ADD_INSIGHTS", insights: newInsights });
  }, []);

  const setResearch = useCallback((data: ResearchIntelligence) => {
    dispatch({ type: "SET_RESEARCH", data });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: "CLEAR" });
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return (
    <AgentResultsContext.Provider value={{ results, addInsights, setResearch, clearAll }}>
      {children}
    </AgentResultsContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAgentResults() {
  return useContext(AgentResultsContext);
}
