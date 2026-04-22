"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Upload, Building2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Organization", icon: Building2 },
  { id: 2, label: "Documents", icon: Upload },
  { id: 3, label: "Done", icon: CheckCircle },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const done = current > step.id;
        const active = current === step.id;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                  done
                    ? "border-cyan-500 bg-cyan-500 text-slate-950"
                    : active
                    ? "border-cyan-400 bg-transparent text-cyan-400"
                    : "border-slate-700 bg-transparent text-slate-600"
                )}
              >
                {done ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-cyan-400" : done ? "text-slate-400" : "text-slate-600"
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "mb-4 h-0.5 w-16 flex-shrink-0 transition-colors",
                  current > step.id ? "bg-cyan-500" : "bg-slate-800"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function DropZone({ onFile }: { onFile: (name: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const newFiles = Array.from(e.dataTransfer.files).map((f) => f.name);
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach(onFile);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-all cursor-pointer",
          dragging ? "border-cyan-400 bg-cyan-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"
        )}
      >
        <Upload className="h-8 w-8 text-slate-500" />
        <div className="text-center">
          <p className="text-sm text-slate-300">Drop your NAQAAE documents here</p>
          <p className="text-xs text-slate-600">PDF, DOCX · Up to 50 MB each</p>
        </div>
        <label className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 hover:bg-white/10">
          Browse files
          <input type="file" multiple accept=".pdf,.docx" className="hidden" onChange={(e) => {
            const names = Array.from(e.target.files ?? []).map((f) => f.name);
            setFiles((prev) => [...prev, ...names]);
            names.forEach(onFile);
          }} />
        </label>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {files.map((name, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="flex-1 truncate text-xs text-slate-300">{name}</span>
              <span className="text-[10px] text-emerald-400">Queued</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "Nile University", type: "Private Technical University" });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  async function handleFinish() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080a14] p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" className="h-12 w-12">
              <circle cx="20" cy="20" r="19" stroke="#c0392b" strokeWidth="2" />
              <circle cx="20" cy="20" r="13" stroke="#c0392b" strokeWidth="2" />
              <circle cx="20" cy="20" r="7" stroke="#c0392b" strokeWidth="2" />
              <circle cx="20" cy="20" r="3" fill="#c0392b" />
              <line x1="28" y1="12" x2="22" y2="18" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="32,8 28,12 32,16" fill="#c0392b" />
            </svg>
          </div>
          <p className="text-xl font-bold text-slate-100">
            Strat<span className="text-red-500">OS</span>
          </p>
          <p className="text-xs text-slate-500">Set up your organisation to get started</p>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex justify-center">
          <StepIndicator current={step} />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/5 bg-[#0d1117] p-6">
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-base font-semibold text-slate-100">Organisation Profiling</h2>
                <p className="mt-0.5 text-xs text-slate-500">Tell us about your institution</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-400">Institution Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Nile University"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-400">Institution Type</label>
                  <Input
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    placeholder="e.g. Private Technical University"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-400">Accreditation Body</label>
                  <Input defaultValue="NAQAAE" disabled className="opacity-60" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-base font-semibold text-slate-100">Upload Documents</h2>
                <p className="mt-0.5 text-xs text-slate-500">Upload your NAQAAE manuals and self-study reports</p>
              </div>
              <DropZone onFile={(name) => setUploadedFiles((prev) => [...prev, name])} />
              <p className="text-center text-xs text-slate-600">
                {uploadedFiles.length === 0 ? "You can also skip and upload later from Settings." : `${uploadedFiles.length} file(s) queued for processing`}
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-100">You&apos;re all set!</h2>
                <p className="mt-1 text-xs text-slate-500">
                  StratOS is configuring your strategic dashboard for <strong className="text-slate-300">{form.name}</strong>.
                  {uploadedFiles.length > 0 && ` ${uploadedFiles.length} document(s) are being processed.`}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              className="gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>

            {step < 3 ? (
              <Button onClick={() => setStep((s) => s + 1)} className="gap-1.5">
                {step === 2 && uploadedFiles.length === 0 ? "Skip for now" : "Continue"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={saving} className="gap-1.5">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {saving ? "Setting up..." : "Go to Dashboard"}
                {!saving && <ArrowRight className="h-3.5 w-3.5" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
