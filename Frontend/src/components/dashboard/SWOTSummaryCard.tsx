"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Target, AlertTriangle, ArrowRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InsightCard } from "@/types";

const CATEGORY_CONFIG = {
  strength: {
    label: "Strengths",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    headerBorder: "border-b-emerald-500/30",
  },
  weakness: {
    label: "Weaknesses",
    icon: TrendingDown,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    headerBorder: "border-b-amber-500/30",
  },
  opportunity: {
    label: "Opportunities",
    icon: Target,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    headerBorder: "border-b-cyan-500/30",
  },
  threat: {
    label: "Threats",
    icon: AlertTriangle,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    headerBorder: "border-b-rose-500/30",
  },
};

function QuadrantPanel({
  category,
  items,
}: {
  category: keyof typeof CATEGORY_CONFIG;
  items: InsightCard[];
}) {
  const cfg = CATEGORY_CONFIG[category];
  const Icon = cfg.icon;
  const hasMock = items.some((i) => i.data_source === "mock");

  return (
    <div className={cn("flex flex-col rounded-lg border", cfg.border)}>
      {/* Quadrant header */}
      <div
        className={cn(
          "flex items-center justify-between border-b px-3 py-2",
          cfg.headerBorder,
          cfg.bg
        )}
      >
        <div className="flex items-center gap-1.5">
          <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
          <span className={cn("text-xs font-semibold", cfg.color)}>{cfg.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasMock && (
            <span className="rounded bg-slate-700/60 px-1.5 py-0.5 text-[9px] text-slate-400">Mock</span>
          )}
          <span className="text-xs font-bold text-slate-400">{items.length}</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col divide-y divide-white/5">
        {items.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-slate-600">No data available</p>
        ) : (
          items.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between px-3 py-2">
              <span className="flex-1 truncate text-xs font-medium text-slate-300">
                {item.title}
              </span>
              <div className="ml-2 flex shrink-0 items-center gap-1 text-slate-500">
                <FileText className="h-3 w-3" />
                <span className="text-[10px]">{item.reference_count} refs</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function SWOTSummaryCard({
  strengths,
  weaknesses,
  opportunities,
  threats,
}: {
  strengths: InsightCard[];
  weaknesses: InsightCard[];
  opportunities: InsightCard[];
  threats: InsightCard[];
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-100">SWOT Analysis</h2>
          <p className="mt-0.5 text-xs text-slate-500">Top validated insights</p>
        </div>
        <div className="flex h-2 w-2 items-center">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span className="ml-1.5 text-xs text-emerald-400">Live</span>
        </div>
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <QuadrantPanel category="strength" items={strengths} />
        <QuadrantPanel category="weakness" items={weaknesses} />
        <QuadrantPanel category="opportunity" items={opportunities} />
        <QuadrantPanel category="threat" items={threats} />
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-5 py-3">
        <Link
          href="/swot"
          className="flex items-center gap-1 text-xs text-cyan-400 transition-colors hover:text-cyan-300"
        >
          View full analysis
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
