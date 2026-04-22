"use client";

import React, { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Header } from "@/components/layout/Header";
import { fetchGapAnalysis } from "@/services/mockApi";
import type { GapAnalysis } from "@/types";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-white/10 bg-[#111827] px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-slate-200">{d?.pillar_short}</p>
      <p className="text-cyan-400">Current: {d?.current_score}%</p>
      <p className="text-slate-500">Benchmark: 100%</p>
      <p className="text-rose-400">Gap: {d?.gap}%</p>
    </div>
  );
}

function GapBar({ label, score, gap, critical }: { label: string; score: number; gap: number; critical: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-28 shrink-0 text-right text-xs truncate", critical ? "text-rose-400 font-medium" : "text-slate-400")}>
        {label}
      </div>
      <div className="flex-1">
        <Progress
          value={score}
          className="h-2"
          indicatorClassName={
            score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500"
          }
        />
      </div>
      <div className="flex w-16 shrink-0 items-center justify-end gap-1 text-xs">
        <span className="font-semibold text-slate-200">{score}%</span>
        {critical && <AlertTriangle className="h-3 w-3 text-rose-400" />}
      </div>
    </div>
  );
}

export default function GapAnalysisPage() {
  const [data, setData] = useState<GapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGapAnalysis().then(setData).finally(() => setLoading(false));
  }, []);

  const radarData = data?.pillars.map((p) => ({
    pillar_short: p.pillar_short,
    current_score: p.current_score,
    benchmark: p.benchmark_score,
    gap: p.gap,
  })) ?? [];

  return (
    <div className="flex min-h-full flex-col">
      <Header title="Gap Analysis" subtitle="Current performance vs. 100% NAQAAE benchmark across all 12 pillars" />

      <div className="flex flex-col gap-6 p-6">
        {loading && (
          <div className="grid grid-cols-2 gap-5">
            <div className="skeleton h-80 rounded-xl" />
            <div className="skeleton h-80 rounded-xl" />
          </div>
        )}

        {data && (
          <>
            {/* Summary banner */}
            <div className="flex flex-wrap gap-4 rounded-xl border border-white/5 bg-[#0d1117] p-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-slate-500">Overall Gap</p>
                <p className="text-2xl font-bold text-rose-400">{data.overall_gap}%</p>
                <p className="text-[10px] text-slate-600">below NAQAAE benchmark</p>
              </div>
              <div className="h-12 w-px bg-white/5 self-center" />
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-slate-500">Critical Pillars</p>
                <p className="text-2xl font-bold text-amber-400">{data.critical_pillars.length}</p>
                <p className="text-[10px] text-slate-600">requiring immediate action</p>
              </div>
              <div className="h-12 w-px bg-white/5 self-center" />
              <div className="flex-1 flex flex-wrap gap-1.5 self-center">
                {data.critical_pillars.map((p) => (
                  <span key={p} className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-medium text-rose-400">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Radar chart */}
              <div className="flex flex-col rounded-xl border border-white/5 bg-[#0d1117] p-5">
                <h3 className="mb-1 text-sm font-semibold text-slate-100">Radar View</h3>
                <p className="mb-4 text-xs text-slate-500">12-Pillar spider chart vs benchmark</p>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis
                      dataKey="pillar_short"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                    />
                    <Radar
                      name="NAQAAE Benchmark"
                      dataKey="benchmark"
                      stroke="#22d3ee22"
                      fill="#22d3ee0a"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    <Radar
                      name="Current Score"
                      dataKey="current_score"
                      stroke="#22d3ee"
                      fill="#22d3ee20"
                      strokeWidth={2}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", color: "#64748b" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Horizontal bar chart */}
              <div className="flex flex-col rounded-xl border border-white/5 bg-[#0d1117] p-5">
                <h3 className="mb-1 text-sm font-semibold text-slate-100">Pillar Breakdown</h3>
                <p className="mb-4 text-xs text-slate-500">Score vs. 100% benchmark — red flags are critical</p>
                <div className="flex flex-col gap-2.5">
                  {data.pillars.map((p) => (
                    <GapBar
                      key={p.pillar}
                      label={p.pillar_short}
                      score={p.current_score}
                      gap={p.gap}
                      critical={data.critical_pillars.includes(p.pillar_short)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
