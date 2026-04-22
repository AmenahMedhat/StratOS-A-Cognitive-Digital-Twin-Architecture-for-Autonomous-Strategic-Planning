"use client";

import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { Header } from "@/components/layout/Header";
import { ComplianceHeader } from "@/components/dashboard/ComplianceHeader";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { SWOTSummaryCard } from "@/components/dashboard/SWOTSummaryCard";
import { MeetingSummaries } from "@/components/dashboard/MeetingSummaries";
import { ScenarioWidget } from "@/components/dashboard/ScenarioWidget";
import { CompetitiveIntelWidget } from "@/components/dashboard/CompetitiveIntelWidget";

function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className ?? ""}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5 p-6 animate-fade-in">
      <Skeleton className="h-28" />
      <div className="grid grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <Skeleton className="h-72" />
        </div>
        <Skeleton className="h-72" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
      </div>
    </div>
  );
}

export default function CommandCenterPage() {
  const { data, loading, error } = useDashboard();

  return (
    <div className="flex min-h-full flex-col">
      <Header
        title="Command Center"
        subtitle="Welcome back, Dr. Sarah Chen. Here's your strategic overview."
      />

      {loading && <LoadingSkeleton />}

      {error && (
        <div className="m-6 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          Failed to load dashboard: {error}
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-5 p-6 animate-fade-in">
          {/* Compliance score banner */}
          <ComplianceHeader compliance={data.compliance} />

          {/* KPI metrics strip */}
          <KPIGrid metrics={data.kpis} />

          {/* Main content: SWOT + Meetings side by side */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SWOTSummaryCard
                strengths={data.swot_summary.strengths}
                weaknesses={data.swot_summary.weaknesses}
                opportunities={data.swot_summary.opportunities}
                threats={data.swot_summary.threats}
              />
            </div>
            <MeetingSummaries meetings={data.recent_meetings} />
          </div>

          {/* Bottom row: Competitive Intel + Scenario Simulator */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <CompetitiveIntelWidget data={null} />
            <ScenarioWidget simulation={data.last_simulation} />
            {/* Placeholder for a 4th widget */}
            <div className="flex flex-col rounded-xl border border-dashed border-white/10 items-center justify-center p-6 text-center">
              <p className="text-xs text-slate-600">Upcoming widget</p>
              <p className="mt-1 text-[10px] text-slate-700">Workforce Analytics</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
