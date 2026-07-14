"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Milestone {
  date: string;
  title: string;
  description: string;
}

const DEFAULT_MILESTONES: Milestone[] = [
  {
    date: "Q1 2025",
    title: "Design tokens API",
    description: "Typed variables sync from Figma to code.",
  },
  {
    date: "Q2 2025",
    title: "Realtime canvas",
    description: "Live cursors and comments on every board.",
  },
  {
    date: "Q3 2025",
    title: "Usage analytics",
    description: "Adoption, drift, and coverage per team.",
  },
  {
    date: "Q4 2025",
    title: "Self-hosted runtime",
    description: "Run the engine inside your own network.",
  },
  {
    date: "Q1 2026",
    title: "Review agent",
    description: "Automated a11y checks on every pull request.",
  },
];

// Layout constants (percent along the track).
const PAD_START = 14;
const PAD_END = 86;
const HEAD_START = 6;
const HEAD_END = 94;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const r2 = (n: number) => Math.round(n * 100) / 100;
const smoothstep = (x: number) => x * x * (3 - 2 * x);

export function TimelineHorizontal({
  milestones = DEFAULT_MILESTONES,
  className,
}: {
  milestones?: Milestone[];
  className?: string;
}) {
  const count = milestones.length;

  const positions = useMemo(() => {
    if (count <= 1) return milestones.map(() => (PAD_START + PAD_END) / 2);
    return milestones.map((_, i) =>
      r2(PAD_START + (PAD_END - PAD_START) * (i / (count - 1)))
    );
  }, [milestones, count]);

  // head: 0..1 progress along the travel range. lit: 0..1 opacity of the sweep.
  const head = useMotionValue(0);
  const lit = useMotionValue(0);
  const headPct = useTransform(head, (v) =>
    r2(HEAD_START + (HEAD_END - HEAD_START) * v)
  );
  const headStr = useTransform(headPct, (p) => `${p}%`);

  const [activeCount, setActiveCount] = useState(0);
  const lastActive = useRef(-1);

  useEffect(() => {
    let raf = 0;
    let start = 0;
    const SWEEP = 6000;
    const HOLD = 1500;
    const FADE = 850;
    const GAP = 550;
    const TOTAL = SWEEP + HOLD + FADE + GAP;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) % TOTAL;

      let p: number;
      let l: number;
      if (t < SWEEP) {
        p = smoothstep(t / SWEEP);
        l = Math.min(1, t / 450);
      } else if (t < SWEEP + HOLD) {
        p = 1;
        l = 1;
      } else if (t < SWEEP + HOLD + FADE) {
        p = 1;
        l = 1 - (t - SWEEP - HOLD) / FADE;
      } else {
        p = 0;
        l = 0;
      }

      head.set(p);
      lit.set(l);

      const reach = HEAD_START + (HEAD_END - HEAD_START) * p;
      let c = 0;
      for (const pos of positions) if (pos <= reach) c++;
      if (c !== lastActive.current) {
        lastActive.current = c;
        setActiveCount(c);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [positions, head, lit]);

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand-soft/70">
            Platform roadmap
          </p>
          <h3 className="mt-1.5 text-base font-semibold text-white">
            Shipping through 2026
          </h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-void/60 px-3 py-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <motion.span
              className="absolute inset-0 rounded-full bg-glow"
              animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative h-1.5 w-1.5 rounded-full bg-glow" />
          </span>
          <span className="text-[11px] font-medium tabular-nums text-zinc-300">
            {activeCount} / {count} shipped
          </span>
        </div>
      </div>

      {/* Timeline stage */}
      <div className="no-scrollbar relative flex-1 overflow-x-auto">
        <div className="relative h-full min-w-[520px]">
          {/* Track + progress fill (masked at the ends) */}
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            }}
          >
            <div className="absolute inset-0 bg-white/10" />
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: headStr,
                opacity: lit,
                background:
                  "linear-gradient(to right, rgba(124,108,255,0.15), #7c6cff 60%, #5b8cff)",
                boxShadow: "0 0 12px rgba(91,140,252,0.55)",
              }}
            />
          </div>

          {/* Comet head */}
          <motion.div
            className="pointer-events-none absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: headStr, opacity: lit }}
          >
            <motion.span
              className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(91,140,252,0.55), transparent 70%)",
              }}
              animate={{ scale: [1, 2.1], opacity: [0.7, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <span
              className="block h-2.5 w-2.5 rounded-full bg-white"
              style={{ boxShadow: "0 0 10px 2px rgba(124,108,255,0.9)" }}
            />
          </motion.div>

          {/* Milestones */}
          {milestones.map((m, i) => {
            const side: "top" | "bottom" = i % 2 === 0 ? "top" : "bottom";
            const active = i < activeCount;
            return (
              <Node
                key={m.date + m.title}
                milestone={m}
                left={positions[i]}
                side={side}
                active={active}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Node({
  milestone,
  left,
  side,
  active,
}: {
  milestone: Milestone;
  left: number;
  side: "top" | "bottom";
  active: boolean;
}) {
  const isTop = side === "top";
  return (
    <>
      {/* Card */}
      <div
        className="absolute z-10 w-[132px] -translate-x-1/2"
        style={
          isTop
            ? { left: `${left}%`, bottom: "calc(50% + 28px)" }
            : { left: `${left}%`, top: "calc(50% + 28px)" }
        }
      >
        <motion.div
          className="relative overflow-hidden rounded-xl border p-3 backdrop-blur-sm"
          initial={false}
          animate={{
            y: active ? (isTop ? -4 : 4) : 0,
            borderColor: active
              ? "rgba(124,108,255,0.45)"
              : "rgba(255,255,255,0.08)",
            backgroundColor: active
              ? "rgba(19,19,30,0.92)"
              : "rgba(13,13,20,0.65)",
            boxShadow: active
              ? "0 14px 34px -14px rgba(124,108,255,0.55)"
              : "0 0px 0px 0px rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
        >
          <motion.span
            className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent"
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          />
          <span
            className={cn(
              "block text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500",
              active ? "text-brand-soft" : "text-zinc-500"
            )}
          >
            {milestone.date}
          </span>
          <span
            className={cn(
              "mt-1 block text-[13px] font-semibold leading-tight transition-colors duration-500",
              active ? "text-white" : "text-zinc-300"
            )}
          >
            {milestone.title}
          </span>
          <span
            className={cn(
              "mt-1 block text-[11px] leading-snug transition-colors duration-500",
              active ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            {milestone.description}
          </span>
        </motion.div>
      </div>

      {/* Connector */}
      <motion.div
        className="absolute z-0 w-px -translate-x-1/2"
        style={
          isTop
            ? { left: `${left}%`, bottom: "50%", height: "28px" }
            : { left: `${left}%`, top: "50%", height: "28px" }
        }
        initial={false}
        animate={{
          backgroundColor: active
            ? "rgba(124,108,255,0.5)"
            : "rgba(255,255,255,0.09)",
        }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      />

      {/* Dot */}
      <div
        className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${left}%` }}
      >
        {active && (
          <motion.span
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "rgba(124,108,255,0.35)" }}
            animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <motion.div
          className="relative flex h-3 w-3 items-center justify-center rounded-full border"
          initial={false}
          animate={{
            borderColor: active
              ? "rgba(169,157,255,0.9)"
              : "rgba(255,255,255,0.2)",
            backgroundColor: active ? "#7c6cff" : "#0b0b10",
            boxShadow: active
              ? "0 0 10px 1px rgba(124,108,255,0.7)"
              : "0 0 0 0 rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
        >
          <motion.span
            className="h-1 w-1 rounded-full bg-white"
            initial={false}
            animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.4 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          />
        </motion.div>
      </div>
    </>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-4">
      <TimelineHorizontal />
    </div>
  );
}
