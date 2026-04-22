"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Header } from "@/components/layout/Header";
import { fetchResearchIntelligence } from "@/services/mockApi";
import type { ResearchIntelligence } from "@/types";
import { Button } from "@/components/ui/button";

const COLORS = ["#22d3ee", "#f59e0b", "#10b981", "#f43f5e"];

export default function ResearchPage() {
  const [data, setData] = useState<ResearchIntelligence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResearchIntelligence().then(setData).finally(() => setLoading(false));
  }, []);

  const nu = data?.nile_university;
  const notRanked = !nu || nu.publications === 0;

  // Combine h-index history for chart
  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  const chartData = years.map((year) => {
    const entry: Record<string, number | string> = { year };
    data?.competitors.forEach((c) => {
      const point = c.h_index_history.find((h) => h.year === year);
      entry[c.university_name] = point?.value ?? 0;
    });
    entry["Nile University"] = 0;
    return entry;
  });

  return (
    <div className="flex min-h-full flex-col">
      <Header title="Research Intelligence" subtitle="Performance comparison with top Egyptian universities" />

      <div className="flex flex-col gap-5 p-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Nile University Rank", value: notRanked ? "#—" : `#${nu?.rank}`, sub: `of ${data?.competitors.length ?? 0}` },
            { label: "Publications", value: nu?.publications ?? 0, sub: "papers" },
            { label: "H-Index", value: nu?.h_index ?? 0 },
            { label: "Total Citations", value: (nu?.total_citations ?? 0).toLocaleString() },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-white/5 bg-[#0d1117] p-4">
              <p className="text-xs text-slate-500">{kpi.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-100">{kpi.value}</p>
              {kpi.sub && <p className="text-[10px] text-slate-600">{kpi.sub}</p>}
            </div>
          ))}
        </div>

        {/* Comparing bar */}
        <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2.5 text-xs text-slate-400">
          <span>Comparing:</span>
          <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-2 py-0.5 text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Nile University
          </span>
          {data?.competitors.map((c, i) => (
            <span key={c.university_name} className="flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: COLORS[i + 1] }} />
              {c.university_name}
            </span>
          ))}
        </div>

        {/* Chart */}
        {loading ? (
          <div className="skeleton h-72 rounded-xl" />
        ) : (
          <div className="rounded-xl border border-white/5 bg-[#0d1117] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">H-Index Growth Over Time</h3>
                <p className="text-xs text-slate-500">Comparing Nile University&apos;s H-Index improvement against top Egyptian universities</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" />
                Export Report
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "11px" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
                {["Nile University", ...(data?.competitors.map(c => c.university_name) ?? [])].map((name, i) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={COLORS[i]}
                    strokeWidth={name === "Nile University" ? 2.5 : 1.5}
                    dot={{ fill: COLORS[i], r: 3 }}
                    strokeDasharray={name === "Nile University" ? "4 4" : undefined}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            {notRanked && (
              <p className="mt-2 text-center text-xs text-slate-600">
                Connect a research data source (e.g., Scopus API) to populate Nile University data.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
