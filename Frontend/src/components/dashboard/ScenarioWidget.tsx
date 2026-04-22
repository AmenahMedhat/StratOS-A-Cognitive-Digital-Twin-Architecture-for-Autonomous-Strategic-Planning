"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SimulationResult } from "@/types";

function OutcomeBar({
  label,
  change,
  probability,
}: {
  label: string;
  change: number;
  probability: number;
}) {
  const isPositive = change >= 0;
  const isNeutral = Math.abs(change) < 2;

  const barColor = isNeutral
    ? "bg-slate-500"
    : isPositive
    ? "bg-emerald-500"
    : "bg-rose-500";

  const textColor = isNeutral
    ? "text-slate-400"
    : isPositive
    ? "text-emerald-400"
    : "text-rose-400";

  const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;

  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("h-3 w-3 shrink-0", textColor)} />
      <span className="w-20 shrink-0 text-[10px] text-slate-400">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-slate-800 h-1.5">
        <div
          className={cn("h-1.5 rounded-full transition-all", barColor)}
          style={{ width: `${Math.min(100, Math.abs(change) * 2)}%` }}
        />
      </div>
      <span className={cn("w-12 shrink-0 text-right text-[10px] font-medium", textColor)}>
        {change >= 0 ? "+" : ""}
        {change}%
      </span>
      <span className="w-10 shrink-0 text-right text-[10px] text-slate-600">
        ({Math.round(probability * 100)}%)
      </span>
    </div>
  );
}

export function ScenarioWidget({ simulation }: { simulation: SimulationResult | null }) {
  if (!simulation) {
    return (
      <div className="flex flex-col rounded-xl border border-white/5 bg-[#0d1117]">
        <div className="border-b border-white/5 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-100">Scenario Simulator</h3>
          <p className="text-[10px] text-slate-500">Monte Carlo projections</p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
          <MessageSquare className="h-8 w-8 text-slate-700" />
          <p className="text-xs text-slate-500">No simulation run yet.</p>
          <Link href="/simulator" className="text-xs text-cyan-400 hover:text-cyan-300">
            Run your first simulation →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-white/5 bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Scenario Simulator</h3>
          <p className="text-[10px] text-slate-500">Monte Carlo projections</p>
        </div>
        <MessageSquare className="h-4 w-4 text-slate-600" />
      </div>

      <div className="flex flex-col gap-3 p-4">
        {/* Last query */}
        <div className="rounded-lg bg-white/5 px-3 py-2">
          <p className="text-[10px] text-slate-500">Last simulation query:</p>
          <p className="mt-0.5 text-xs italic text-slate-300">&quot;{simulation.query}&quot;</p>
        </div>

        {/* Outcomes */}
        <div className="flex flex-col gap-2">
          {simulation.outcomes.map((o) => (
            <OutcomeBar
              key={o.label}
              label={o.label}
              change={o.percentage_change}
              probability={o.probability}
            />
          ))}
        </div>

        <p className="text-[10px] text-slate-600">
          {simulation.iterations.toLocaleString()} iterations · Confidence: {simulation.confidence}%
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-4 py-2.5">
        <Link
          href="/simulator"
          className="flex items-center gap-1 text-xs text-cyan-400 transition-colors hover:text-cyan-300"
        >
          Run new simulation
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
