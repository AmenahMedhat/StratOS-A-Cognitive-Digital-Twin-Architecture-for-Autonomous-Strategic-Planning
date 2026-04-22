"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import type { ResearchIntelligence } from "@/types";

export function CompetitiveIntelWidget({ data }: { data: ResearchIntelligence | null }) {
  const nu = data?.nile_university;
  const notRanked = !nu || nu.publications === 0;

  return (
    <div className="flex flex-col rounded-xl border border-white/5 bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Competitive Intel</h3>
          <p className="text-[10px] text-slate-500">Egyptian university rankings by H-Index</p>
        </div>
        <GraduationCap className="h-4 w-4 text-slate-600" />
      </div>

      <div className="p-4">
        {/* Rank display */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Nile University Rank</p>
            <p className="mt-0.5 text-2xl font-bold text-amber-400">
              {notRanked ? "Not Ranked" : `#${nu?.rank}`}
            </p>
          </div>
          <p className="text-xs text-slate-600">
            {data?.competitors.length ?? 0} universities
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Top H-Index", value: notRanked ? 0 : nu?.h_index ?? 0 },
            { label: "Avg Citations", value: notRanked ? 0 : nu?.total_citations ?? 0 },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white/5 px-3 py-2 text-center">
              <p className="text-lg font-bold text-slate-100">{stat.value.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {notRanked && (
          <p className="mt-3 text-center text-[10px] text-slate-600">
            Connect your research data source to populate rankings.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-4 py-2.5">
        <Link
          href="/research"
          className="flex items-center gap-1 text-xs text-cyan-400 transition-colors hover:text-cyan-300"
        >
          View full analysis
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
