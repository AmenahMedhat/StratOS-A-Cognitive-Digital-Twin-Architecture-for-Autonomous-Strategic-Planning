"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendChatMessage } from "@/services/mockApi";
import type { ChatMessage } from "@/types";

function AssistantMessage({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
          isUser
            ? "rounded-tr-none bg-cyan-500/20 text-cyan-100"
            : "rounded-tl-none bg-white/5 text-slate-300"
        )}
        dangerouslySetInnerHTML={{
          __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>'),
        }}
      />
    </div>
  );
}

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "sys-1",
      role: "assistant",
      content:
        "Hello, Dr. Chen. I'm your Strategic Assistant. I can analyse your NAQAAE compliance data, run scenario simulations, and surface insights across all pillars. How can I help today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const allMsgs = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const reply = await sendChatMessage(allMsgs);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const PROMPTS = [
    "What are my top SWOT risks?",
    "Summarise my compliance status",
    "Why is faculty retention low?",
  ];

  return (
    <>
      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[520px] w-80 animate-slide-in-right flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-xl">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-white/5 bg-[#111827] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-100">Strategic Assistant</p>
                <p className="text-[9px] text-emerald-400">● Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-white/5 hover:text-slate-300"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg) => (
              <AssistantMessage key={msg.id} msg={msg} />
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <div className="flex items-center gap-1 rounded-xl rounded-tl-none bg-white/5 px-3 py-2">
                  <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                  <span className="text-xs text-slate-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts (only shown when no user messages yet) */}
          {messages.filter((m) => m.role === "user").length === 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-white/5 px-3 pb-2 pt-2">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p)}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-200"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-white/5 px-3 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about strategy, compliance, risks..."
              className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 transition-colors hover:bg-cyan-400 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-glow transition-all",
          open
            ? "bg-slate-700 text-slate-300"
            : "bg-gradient-to-br from-cyan-500 to-blue-600 text-white hover:scale-105"
        )}
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>
    </>
  );
}
