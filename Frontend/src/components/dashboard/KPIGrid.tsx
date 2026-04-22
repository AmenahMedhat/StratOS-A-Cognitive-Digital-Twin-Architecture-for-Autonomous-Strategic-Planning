"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KPIMetric } from "@/types";

function KPICard({ metric }: { metric: KPIMetric }) {
  const statusBorder: Record<string, string> = {
    good: "border-l-emerald-500",
    warning: "border-l-amber-500",
    critical: "border-l-rose-500",
    neutral: "border-l-slate-600",
  };

  const statusText: Record<string, string> = {
    good: "text-emerald-400",
    warning: "text-amber-400",
    critical: "text-rose-400",
    neutral: "text-slate-400",
  };

  const border = statusBorder[metric.status ?? "neutral"];
  const trendColor = statusText[metric.status ?? "neutral"];

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border border-white/5 bg-[#0d1117] p-4 border-l-2",
        border
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs text-slate-500">{metric.label}</p>
        {metric.data_source === "mock" && (
          <span className="rounded bg-slate-700/60 px-1 py-0.5 text-[9px] text-slate-500">Mock</span>
        )}
      </div>

      <div className="flex items-end gap-1.5">
        <span className="text-2xl font-bold text-slate-100">
          {metric.value}
          {metric.unit && (
            <span className="ml-0.5 text-sm font-normal text-slate-500">{metric.unit}</span>
          )}
        </span>
      </div>

      {metric.trend && (
        <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
          {metric.trend === "up" ? (
            <TrendingUp className="h-3 w-3" />
          ) : metric.trend === "down" ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
          {metric.trend_value !== undefined && (
            <span>
              {metric.trend === "up" ? "+" : metric.trend === "down" ? "-" : ""}
              {metric.trend_value}
              {metric.unit ? metric.unit : ""}
            </span>
          )}
          <span className="text-slate-600">vs last period</span>
        </div>
      )}
    </div>
  );
}

export function KPIGrid({ metrics }: { metrics: KPIMetric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map((m) => (
        <KPICard key={m.id} metric={m} />
      ))}
    </div>
  );
}
