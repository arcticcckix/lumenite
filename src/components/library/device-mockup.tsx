"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

const BARS = [38, 62, 45, 80, 54, 90, 68];

export function BrowserMockup({
  url = "app.lumenite.dev/analytics",
  className,
}: {
  url?: string;
  className?: string;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(interval);
  }, []);

  const bars = BARS.map((b, i) => {
    const wobble = Math.abs(Math.sin((tick + i) * 1.3)) * 18;
    return Math.min(96, b + wobble - 9);
  });

  return (
    <div
      className={cn(
        "w-full max-w-lg overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/40",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-line bg-white/[0.03] px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-1 text-zinc-600">
          <ChevronLeft className="h-3.5 w-3.5" />
          <ChevronRight className="h-3.5 w-3.5" />
          <RotateCw className="h-3 w-3" />
        </div>
        <div className="flex flex-1 items-center gap-1.5 rounded-md border border-line bg-void px-2.5 py-1">
          <Lock className="h-3 w-3 text-zinc-500" />
          <span className="truncate text-[11px] text-zinc-400">{url}</span>
        </div>
      </div>

      <div className="space-y-4 bg-gradient-to-b from-panel to-void p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">Weekly revenue</p>
            <p className="mt-1 text-xl font-semibold text-white">$48,210</p>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
            +12.4%
          </span>
        </div>

        <div className="flex h-24 items-end gap-1.5">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-brand to-glow"
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>

        <div className="space-y-2">
          {["Praetorian order #4821", "New subscriber — Halo tier", "Payout processed"].map(
            (row, i) => (
              <div
                key={row}
                className="flex items-center justify-between rounded-lg border border-line bg-white/[0.02] px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: i === 0 ? "#7c6cff" : i === 1 ? "#5b8cff" : "#34d399",
                    }}
                  />
                  <span className="text-[11px] text-zinc-300">{row}</span>
                </div>
                <span className="text-[10px] text-zinc-600">now</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <BrowserMockup />
    </div>
  );
}
