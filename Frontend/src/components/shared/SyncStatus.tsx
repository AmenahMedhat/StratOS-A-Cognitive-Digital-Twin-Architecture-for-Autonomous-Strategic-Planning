"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { checkApiHealth } from "@/services/agentApi";

type Status = "checking" | "connected" | "offline";

export function SyncStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;

    async function ping() {
      const ok = await checkApiHealth();
      if (!cancelled) setStatus(ok ? "connected" : "offline");
    }

    ping();
    const interval = setInterval(ping, 30_000); // re-check every 30s
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const config: Record<Status, { dot: string; text: string; label: string }> = {
    checking: {
      dot: "bg-amber-400 animate-pulse",
      text: "text-amber-400",
      label: "API: Connecting…",
    },
    connected: {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      label: "API: Connected",
    },
    offline: {
      dot: "bg-rose-400 animate-pulse",
      text: "text-rose-400",
      label: "API: Offline — run uvicorn",
    },
  };

  const c = config[status];

  return (
    <div
      className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1"
      title={
        status === "offline"
          ? "Start the backend: uvicorn api.main:app --reload --port 8000"
          : "FastAPI backend at localhost:8000"
      }
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      <span className={cn("text-xs font-medium", c.text)}>{c.label}</span>
    </div>
  );
}
