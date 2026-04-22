"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Upload, Play, FileText } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { fetchMeetings } from "@/services/mockApi";
import type { Meeting } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeTime } from "@/lib/utils";

const TYPE_BADGE_MAP: Record<string, "board" | "department" | "committee" | "default"> = {
  "Board Meeting": "board",
  Department: "department",
  Committee: "committee",
};

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "past" | "upcoming">("all");

  useEffect(() => {
    fetchMeetings().then(setMeetings).finally(() => setLoading(false));
  }, []);

  const now = Date.now();
  const filtered = meetings.filter((m) => {
    const isPast = new Date(m.date).getTime() < now;
    if (filter === "past") return isPast;
    if (filter === "upcoming") return !isPast;
    return true;
  });

  return (
    <div className="flex min-h-full flex-col">
      <Header title="Meetings" subtitle="AI-summarised strategic sessions" />

      <div className="flex flex-col gap-5 p-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-lg border border-white/5 bg-[#0d1117] p-1">
            {(["all", "past", "upcoming"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                  filter === f ? "bg-white/10 text-slate-200" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {f} {f === "all" ? `(${meetings.length})` : f === "past" ? `(${meetings.filter(m => new Date(m.date).getTime() < now).length})` : `(${meetings.filter(m => new Date(m.date).getTime() >= now).length})`}
              </button>
            ))}
          </div>
          <Button size="sm" className="gap-1.5 text-xs">
            <Upload className="h-3.5 w-3.5" />
            Upload Transcript
          </Button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)
            : filtered.map((meeting) => (
                <Link
                  key={meeting.id}
                  href={`/meetings/${meeting.id}`}
                  className="group flex flex-col gap-3 rounded-xl border border-white/5 bg-[#0d1117] p-4 transition-all hover:bg-white/5 hover:border-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={TYPE_BADGE_MAP[meeting.type] ?? "default"}>{meeting.type}</Badge>
                        <span className="text-[10px] text-slate-600">{formatRelativeTime(meeting.date)}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white">{meeting.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">{meeting.ai_summary}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1 text-[10px] text-slate-600">
                      <span>{meeting.duration_minutes}m</span>
                      <span>{meeting.participants.length} participants</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-white/5 pt-2">
                    <span className="text-[10px] text-slate-600">
                      {meeting.action_items.filter(a => a.is_completed).length}/{meeting.action_items.length} action items complete
                    </span>
                    <div className="ml-auto flex gap-2">
                      {meeting.has_recording && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Play className="h-3 w-3" /> Recording
                        </span>
                      )}
                      {meeting.has_transcript && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <FileText className="h-3 w-3" /> Transcript
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
