"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Meeting } from "@/types";

const TYPE_BADGE: Record<string, string> = {
  "Board Meeting": "bg-violet-500/15 text-violet-400",
  Department: "bg-blue-500/15 text-blue-400",
  Committee: "bg-orange-500/15 text-orange-400",
  "1:1": "bg-slate-500/15 text-slate-400",
  "Research Council": "bg-cyan-500/15 text-cyan-400",
};

export function MeetingSummaries({ meetings }: { meetings: Meeting[] }) {
  const newCount = meetings.filter(
    (m) => Date.now() - new Date(m.date).getTime() < 7 * 24 * 3600_000
  ).length;

  return (
    <div className="flex flex-col rounded-xl border border-white/5 bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Meeting Summaries</h3>
          <p className="text-[10px] text-slate-500">AI-extracted insights</p>
        </div>
        {newCount > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {newCount} New
          </span>
        )}
      </div>

      {/* Meeting list */}
      <div className="flex flex-col divide-y divide-white/5">
        {meetings.slice(0, 3).map((meeting) => (
          <Link
            key={meeting.id}
            href={`/meetings/${meeting.id}`}
            className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-xs font-medium text-slate-200 group-hover:text-white">
                  {meeting.title}
                </p>
              </div>
              <p className="text-[10px] text-slate-500">{formatRelativeTime(meeting.date)}</p>
              <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-0.5">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  {meeting.key_decisions.length} key points
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="h-1 w-1 rounded-full bg-amber-400" />
                  {meeting.action_items.length} actions
                </span>
              </div>
            </div>
            <span
              className={cn(
                "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium",
                TYPE_BADGE[meeting.type] ?? "bg-slate-500/15 text-slate-400"
              )}
            >
              {meeting.type}
            </span>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-4 py-2.5">
        <Link
          href="/meetings"
          className="flex items-center gap-1 text-xs text-cyan-400 transition-colors hover:text-cyan-300"
        >
          View all meetings
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
