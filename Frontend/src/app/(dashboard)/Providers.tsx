"use client";

import { AgentResultsProvider } from "@/contexts/AgentResultsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AgentResultsProvider>{children}</AgentResultsProvider>;
}
