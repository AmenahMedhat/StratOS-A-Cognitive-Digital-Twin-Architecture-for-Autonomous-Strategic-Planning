"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { fetchTeamMembers, updateTeamMemberRole } from "@/services/mockApi";
import type { TeamMember } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLE_COLORS: Record<string, string> = {
  Admin: "text-cyan-400",
  Editor: "text-slate-300",
  Viewer: "text-slate-500",
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers().then(setMembers).finally(() => setLoading(false));
  }, []);

  async function handleRoleChange(id: string, role: TeamMember["role"]) {
    const updated = await updateTeamMemberRole(id, role);
    setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header title="Team Members" subtitle="Manage who has access to StratOS" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Team Members</h2>
            <p className="text-xs text-slate-500">{members.length} members</p>
          </div>
          <Button size="sm" className="gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            Invite Member
          </Button>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-[#0d1117] divide-y divide-white/5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton mx-4 my-3 h-12 rounded-lg" />
              ))
            : members.map((member) => (
                <div key={member.id} className="flex items-center gap-4 px-4 py-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{member.avatar_initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{member.name}</p>
                    <p className="text-xs text-slate-500 truncate">{member.email}</p>
                  </div>
                  <Select
                    value={member.role}
                    onValueChange={(v) => handleRoleChange(member.id, v as TeamMember["role"])}
                    disabled={member.role === "Admin"}
                  >
                    <SelectTrigger className={`w-28 h-8 text-xs ${ROLE_COLORS[member.role]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-30 disabled:pointer-events-none" disabled={member.role === "Admin"}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
