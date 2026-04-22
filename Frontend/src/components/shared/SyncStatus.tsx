"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Status = "syncing" | "up_to_date" | "error";

export function SyncStatus({ status: propStatus }: { status?: Status }) {
  const [status, setStatus] = useState<Status>(propStatus ?? "syncing");

  useEffect(() => {
    if (propStatus) { setStatus(propStatus); return; }
    // Simulate initial sync completing
    const t = setTimeout(() => setStatus("up_to_date"), 2000);
    return () => clearTimeout(t);
  }, [propStatus]);

  const config: Record<Status, { dot: string; text: string; label: string }> = {
    syncing: {
      dot: "bg-amber-400 animate-pulse",
      text: "text-amber-400",
      label: "System: Syncing data...",
    },
    up_to_date: {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      label: "System: Up to date",
    },
    error: {
      dot: "bg-rose-400 animate-pulse",
      text: "text-rose-400",
      label: "System: Sync failed",
    },
  };

  const c = config[status];

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1">
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      <span className={cn("text-xs font-medium", c.text)}>{c.label}</span>
    </div>
  );
}
