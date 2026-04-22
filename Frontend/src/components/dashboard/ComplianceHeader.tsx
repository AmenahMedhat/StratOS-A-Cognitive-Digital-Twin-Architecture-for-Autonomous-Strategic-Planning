"use client";

import React from "react";
import { ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComplianceSummary } from "@/types";

function ScoreRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#f43f5e";

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="-rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={radius} stroke="#1e2132" strokeWidth="8" fill="none" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-slate-100">{score}%</span>
        <span className="text-[9px] text-slate-500 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

export function ComplianceHeader({ compliance }: { compliance: ComplianceSummary }) {
  const scoreColor =
    compliance.overall_score >= 80
      ? "text-emerald-400"
      : compliance.overall_score >= 60
      ? "text-amber-400"
      : "text-rose-400";

  const urgency =
    compliance.days_remaining < 30
      ? "critical"
      : compliance.days_remaining < 90
      ? "warning"
      : "safe";

  return (
    <div className="flex items-center gap-6 rounded-2xl border border-white/5 bg-gradient-to-r from-[#0d1117] to-[#0a0d1a] p-5">
      <ScoreRing score={compliance.overall_score} />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium text-slate-300">NAQAAE Compliance Score</span>
          {compliance.data_source === "mock" && (
            <span className="rounded-md bg-slate-700/60 px-1.5 py-0.5 text-[10px] text-slate-400">Mock</span>
          )}
        </div>
        <p className={cn("mt-1 text-3xl font-bold", scoreColor)}>
          {compliance.overall_score}
          <span className="text-base font-normal text-slate-500">/100</span>
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          Last updated: {new Date(compliance.last_updated).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5",
            urgency === "critical"
              ? "bg-rose-500/10 border border-rose-500/20"
              : urgency === "warning"
              ? "bg-amber-500/10 border border-amber-500/20"
              : "bg-emerald-500/10 border border-emerald-500/20"
          )}
        >
          {urgency !== "safe" ? (
            <AlertTriangle className={cn("h-3.5 w-3.5", urgency === "critical" ? "text-rose-400" : "text-amber-400")} />
          ) : (
            <Clock className="h-3.5 w-3.5 text-emerald-400" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              urgency === "critical" ? "text-rose-400" : urgency === "warning" ? "text-amber-400" : "text-emerald-400"
            )}
          >
            {compliance.days_remaining} days remaining
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Next Submission</p>
          <p className="text-sm font-medium text-slate-300">
            {new Date(compliance.next_submission_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
}
