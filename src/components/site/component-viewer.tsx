"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Lock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLicense } from "@/lib/license";
import type { RegistryEntry } from "@/lib/registry/types";

export function ComponentViewer({
  entry,
  code,
}: {
  entry: RegistryEntry;
  code: string;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const { isPro, loaded } = useLicense();

  const locked = entry.tier === "pro" && !isPro;
  const Preview = entry.component;

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex gap-1">
          {(["preview", "code"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm capitalize text-zinc-400 transition hover:text-white",
                tab === t && "text-white"
              )}
            >
              {tab === t && (
                <motion.span
                  layoutId={`tab-${entry.slug}`}
                  className="absolute inset-0 rounded-full bg-panel"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {tab === "preview" && (
            <button
              onClick={() => setReplayKey((k) => k + 1)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-zinc-400 transition hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Replay
            </button>
          )}
          {tab === "code" && !locked && (
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-full bg-panel px-3 py-1.5 text-xs text-zinc-300 transition hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "preview" ? (
          <motion.div
            key={`p-${replayKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "relative overflow-hidden bg-void",
              entry.previewClassName ?? "min-h-[420px]"
            )}
          >
            <Preview />
          </motion.div>
        ) : (
          <motion.div
            key="c"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <pre
              className={cn(
                "no-scrollbar max-h-[560px] overflow-auto p-5 font-mono text-[13px] leading-relaxed text-zinc-300",
                locked && "max-h-[320px] select-none overflow-hidden blur-[6px]"
              )}
            >
              <code>{locked ? code.slice(0, 900) : code}</code>
            </pre>
            {locked && loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-void/60 backdrop-blur-[2px]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-panel">
                  <Lock className="h-5 w-5 text-brand-soft" />
                </span>
                <p className="max-w-xs text-center text-sm text-zinc-400">
                  This is a <span className="text-white">Pro</span> component.
                  Unlock the full source with a one-time license.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/pricing"
                    className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                  >
                    Get Pro
                  </Link>
                  <Link
                    href="/dashboard"
                    className="rounded-full border border-line px-5 py-2 text-sm text-zinc-300 transition hover:text-white"
                  >
                    I have a key
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
