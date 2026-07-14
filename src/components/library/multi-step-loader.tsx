"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const ROW_HEIGHT = 46;

export type MultiStepLoaderProps = {
  /** Ordered status messages. The last one is treated as the finished state. */
  steps?: string[];
  /** Milliseconds each step stays active before completing. */
  durationPerStep?: number;
  /** Restart from the top after the final step. */
  loop?: boolean;
  /** Label shown in the header. */
  title?: string;
  className?: string;
};

const DEFAULT_STEPS = [
  "Provisioning workspace",
  "Installing dependencies",
  "Warming edge cache",
  "Running migrations",
  "Ready",
];

function StepIcon({ state }: { state: "pending" | "active" | "done" }) {
  if (state === "done") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/30">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <motion.path
            d="M5 12.5l4 4 10-10.5"
            stroke="#34d399"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </svg>
      </span>
    );
  }

  if (state === "active") {
    return (
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-brand/15" />
        <motion.span
          className="block h-[18px] w-[18px] rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 12%, var(--color-brand) 92%)",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 2.2px), #000 calc(100% - 2px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2.2px), #000 calc(100% - 2px))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.85, ease: "linear", repeat: Infinity }}
        />
      </span>
    );
  }

  return (
    <span className="flex h-6 w-6 items-center justify-center">
      <span className="h-2 w-2 rounded-full bg-white/15 ring-1 ring-white/10" />
    </span>
  );
}

export function MultiStepLoader({
  steps = DEFAULT_STEPS,
  durationPerStep = 1050,
  loop = true,
  title = "Deploying to production",
  className,
}: MultiStepLoaderProps) {
  const total = steps.length;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (total === 0) return;
    const finished = current >= total;
    if (finished && !loop) return;
    const delay = finished ? 1500 : durationPerStep;
    const timer = setTimeout(() => {
      setCurrent((c) => (c >= total ? 0 : c + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [current, total, durationPerStep, loop]);

  const complete = current >= total;
  const percent = total === 0 ? 0 : Math.round((Math.min(current, total) / total) * 100);
  const shownCount = Math.min(current, total);

  return (
    <div
      className={cn(
        "relative w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-panel p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      {/* ambient top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,108,255,0.18), transparent 70%)",
        }}
      />

      {/* header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: complete ? "#34d399" : "var(--color-glow)" }}
              animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: complete ? "#34d399" : "var(--color-glow)" }}
            />
          </span>
          <span className="text-sm font-medium text-white">
            {complete ? "Deployment complete" : title}
          </span>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-zinc-500">
          {shownCount}/{total}
        </span>
      </div>

      {/* steps */}
      <div
        className="relative mt-4"
        style={{ height: total * ROW_HEIGHT }}
      >
        {/* sliding active highlight */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 rounded-xl"
          style={{
            height: ROW_HEIGHT,
            background:
              "linear-gradient(90deg, rgba(124,108,255,0.10), rgba(124,108,255,0.02))",
            border: "1px solid rgba(124,108,255,0.14)",
          }}
          animate={{
            y: Math.min(current, total - 1) * ROW_HEIGHT,
            opacity: complete ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
        />

        {steps.map((label, i) => {
          const state: "pending" | "active" | "done" =
            i < current ? "done" : i === current ? "active" : "pending";
          return (
            <motion.div
              key={label}
              className="relative flex items-center gap-3 px-3"
              style={{ height: ROW_HEIGHT }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, ease: EASE, duration: 0.5 }}
            >
              <StepIcon state={state} />
              <motion.span
                className="text-sm"
                animate={{
                  color:
                    state === "done"
                      ? "#d4d4d8"
                      : state === "active"
                        ? "#ffffff"
                        : "#565663",
                }}
                transition={{ duration: 0.3 }}
              >
                {label}
              </motion.span>
              {state === "active" && (
                <motion.span
                  className="ml-auto font-mono text-[10px] uppercase tracking-widest text-brand-soft"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  working
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* progress bar */}
      <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-brand), var(--color-glow))",
          }}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
        />
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <MultiStepLoader />
    </div>
  );
}
