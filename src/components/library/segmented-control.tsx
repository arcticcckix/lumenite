"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SegmentOption {
  id: string;
  label: string;
  icon?: LucideIcon;
}

const THUMB_SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 } as const;

/**
 * Apple-style segmented control with a sliding frosted thumb.
 * Controlled (pass `value` + `onChange`) or uncontrolled (pass `defaultValue`).
 */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onChange,
  layoutId,
  fluid = false,
  ariaLabel = "Select an option",
  className,
}: {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  layoutId?: string;
  fluid?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  const reactId = useId();
  const thumbId = layoutId ?? `segmented-thumb-${reactId}`;
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.id);
  const active = value ?? internal;

  function select(id: string) {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 rounded-[14px] border border-white/10 bg-black/40 p-1",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_1px_2px_rgba(0,0,0,0.5)]",
        fluid && "flex w-full",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = opt.id === active;
        const Icon = opt.icon;
        return (
          <motion.button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => select(opt.id)}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 600, damping: 30 }}
            className={cn(
              "relative flex items-center justify-center gap-1.5 rounded-[10px] px-3 py-2 text-[13px] font-medium",
              "outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand/50",
              fluid && "flex-1",
              isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            {isActive && (
              <motion.span
                layoutId={thumbId}
                transition={THUMB_SPRING}
                className={cn(
                  "absolute inset-0 rounded-[10px] border border-white/10",
                  "bg-gradient-to-b from-white/[0.13] to-white/[0.05] backdrop-blur-md",
                  "shadow-[0_1px_1px_rgba(0,0,0,0.6),0_6px_16px_-8px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.16)]"
                )}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {Icon && (
                <Icon
                  size={15}
                  strokeWidth={2.25}
                  className={cn(
                    "shrink-0 transition-colors duration-200",
                    isActive ? "text-brand-soft" : "text-current"
                  )}
                />
              )}
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo                                                               */
/* ------------------------------------------------------------------ */

interface Range extends SegmentOption {
  value: string;
  caption: string;
  delta: string;
  up: boolean;
  seed: number;
}

const RANGES: Range[] = [
  { id: "today", label: "Today", icon: Clock, value: "$4,280", caption: "vs yesterday", delta: "8.2%", up: true, seed: 1.2 },
  { id: "week", label: "Week", icon: Activity, value: "$28,940", caption: "vs last week", delta: "14.6%", up: true, seed: 3.7 },
  { id: "month", label: "Month", icon: CalendarDays, value: "$126.5K", caption: "vs last month", delta: "3.1%", up: false, seed: 6.1 },
  { id: "year", label: "Year", icon: TrendingUp, value: "$1.48M", caption: "vs last year", delta: "22.9%", up: true, seed: 9.4 },
];

const CHART_W = 320;
const CHART_H = 110;
const CHART_PAD = 16;
const POINTS = 24;

function buildChart(seed: number) {
  const raw = Array.from({ length: POINTS }, (_, i) =>
    Math.sin(seed + i * 0.55) * 0.55 +
    Math.sin(seed * 1.7 + i * 0.2) * 0.3 +
    Math.sin(seed * 0.5 + i * 0.9) * 0.15
  );
  const min = Math.min(...raw);
  const max = Math.max(...raw);
  const span = max - min || 1;
  const pts = raw.map((v, i) => {
    const t = (v - min) / span;
    const x = (i / (POINTS - 1)) * CHART_W;
    const y = CHART_H - (CHART_PAD + t * (CHART_H - CHART_PAD * 2));
    return [Math.round(x * 100) / 100, Math.round(y * 100) / 100] as const;
  });
  const line = "M " + pts.map((p) => `${p[0]} ${p[1]}`).join(" L ");
  const area = `${line} L ${CHART_W} ${CHART_H} L 0 ${CHART_H} Z`;
  const lastY = pts[pts.length - 1][1];
  const dotTop = Math.round((lastY / CHART_H) * 10000) / 100; // percent
  return { line, area, dotTop };
}

function RangePanel({ range }: { range: Range }) {
  const gid = useId().replace(/:/g, "");
  const { line, area, dotTop } = useMemo(() => buildChart(range.seed), [range.seed]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-semibold tracking-tight text-white tabular-nums">
            {range.value}
          </div>
          <div className="mt-1 text-xs text-zinc-500">{range.caption}</div>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium tabular-nums",
            range.up
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-rose-400/20 bg-rose-400/10 text-rose-300"
          )}
        >
          {range.up ? <ArrowUpRight size={13} strokeWidth={2.5} /> : <ArrowDownRight size={13} strokeWidth={2.5} />}
          {range.delta}
        </div>
      </div>

      <div className="relative mt-4 h-[120px] w-full">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id={`${gid}-stroke`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c6cff" />
              <stop offset="100%" stopColor="#5b8cff" />
            </linearGradient>
            <linearGradient id={`${gid}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c6cff" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#7c6cff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <motion.path
            d={area}
            fill={`url(#${gid}-fill)`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke={`url(#${gid}-stroke)`}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div
          className="absolute right-0 -translate-y-1/2"
          style={{ top: `${dotTop}%` }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-soft shadow-[0_0_10px_2px_rgba(124,108,255,0.7)]" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  const [active, setActive] = useState("week");
  const [locked, setLocked] = useState(false);
  const range = RANGES.find((r) => r.id === active) ?? RANGES[0];

  // Idle cinema: gently cycle ranges until the user takes over.
  useEffect(() => {
    if (locked) return;
    const t = setInterval(() => {
      setActive((prev) => {
        const idx = RANGES.findIndex((r) => r.id === prev);
        return RANGES[(idx + 1) % RANGES.length].id;
      });
    }, 2600);
    return () => clearInterval(t);
  }, [locked]);

  function handleChange(id: string) {
    setLocked(true);
    setActive(id);
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <div className="relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]">
        {/* soft top glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -20%, rgba(124,108,255,0.16), transparent 70%)",
          }}
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-300">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
            <span className="text-[11px] font-medium text-zinc-400">Live</span>
          </div>
        </div>

        <div className="relative mt-4">
          <SegmentedControl
            options={RANGES}
            value={active}
            onChange={handleChange}
            fluid
            ariaLabel="Revenue time range"
          />
        </div>

        <div className="relative mt-6 h-[188px]">
          <AnimatePresence>
            <motion.div
              key={range.id}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <RangePanel range={range} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
