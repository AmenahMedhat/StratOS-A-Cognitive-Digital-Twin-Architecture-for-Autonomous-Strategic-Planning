"use client";

import React, { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, AlertCircle, Upload, Pencil } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { fetchOrganizationProfile } from "@/services/mockApi";
import type { OrganizationProfile, UploadedDocument } from "@/types";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

const STATUS_CONFIG: Record<UploadedDocument["status"], { icon: React.ReactNode; label: string; color: string }> = {
  saved: {
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: "Saved",
    color: "text-emerald-400",
  },
  processing: {
    icon: <Clock className="h-3.5 w-3.5 animate-spin" />,
    label: "Processing",
    color: "text-amber-400",
  },
  failed: {
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    label: "Failed",
    color: "text-rose-400",
  },
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizationProfile().then(setProfile).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-full flex-col">
      <Header title="Organization Profile" subtitle="Manage your institution details and uploaded documents" />

      <div className="flex flex-col gap-5 p-6 max-w-2xl">
        {loading ? (
          <div className="skeleton h-40 rounded-xl" />
        ) : profile ? (
          <>
            {/* Org info card */}
            <div className="rounded-xl border border-white/5 bg-[#0d1117] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-100">Institution Details</h3>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <Pencil className="h-3 w-3" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Institution Name", value: profile.name },
                  { label: "Institution Type", value: profile.type },
                  { label: "Accreditation Body", value: profile.accreditation_body },
                  { label: "Admin Email", value: profile.admin_email },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{field.label}</p>
                    <p className="mt-0.5 text-sm text-slate-200">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="rounded-xl border border-white/5 bg-[#0d1117]">
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Uploaded Documents</h3>
                  <p className="text-xs text-slate-500">{profile.uploaded_documents.length} documents</p>
                </div>
                <Button size="sm" className="gap-1.5 text-xs">
                  <Upload className="h-3.5 w-3.5" />
                  Upload New
                </Button>
              </div>

              <div className="divide-y divide-white/5">
                {profile.uploaded_documents.map((doc) => {
                  const statusCfg = STATUS_CONFIG[doc.status];
                  return (
                    <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                        <FileText className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-slate-200">{doc.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {doc.type} · {(doc.size_kb / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className={cn("flex items-center gap-1 text-[10px] font-medium", statusCfg.color)}>
                          {statusCfg.icon}
                          <span>{statusCfg.label}</span>
                          {doc.status === "saved" && (
                            <span className="text-slate-600">(Uploaded: {formatDate(doc.uploaded_at)})</span>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
