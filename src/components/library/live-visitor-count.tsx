"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Deterministic geometry + signal (module scope, no random)                 */
/* -------------------------------------------------------------------------- */

const round = (n: number) => Math.round(n * 100) / 100;

const SPARK_N = 44; // points held in the rolling buffer
const STEP = 8; // px between points (integer keeps the scroll seamless)
const SPARK_W = STEP * (SPARK_N - 2); // 336, visible viewBox width
const SPARK_H = 84;
const PAD_T = 14;
const PAD_B = 12;
const SPAN_Y = SPARK_H - PAD_T - PAD_B;
const BASE_Y = SPARK_H - PAD_B;

const TICK_MS = 1300;
const START = 140; // where the initial buffer begins on the signal
const SWAP_EVERY = 4; // ticks between visitor-stack rotations
const VISIBLE = 5;

const COUNT_BAND = 132;
const BASE_PAGES = 212;
const PAGES_BAND = 88;

// A calm, layered wave. Pure function of the sample index, so SSR and the
// first client render agree and the loop stays reproducible.
function signal(i: number): number {
  const a = Math.sin(i * 0.35);
  const b = Math.sin(i * 0.11 + 1.3);
  const j = Math.sin(i * 1.9 + 0.7) * 0.34 + Math.sin(i * 3.3 + 2.1) * 0.16;
  const v = 0.5 + 0.2 * a + 0.12 * b + 0.09 * j;
  return v < 0.08 ? 0.08 : v > 0.94 ? 0.94 : v;
}

function smoothPath(xs: number[], ys: number[]): string {
  const t = 0.85;
  const n = xs.length;
  let d = `M ${round(xs[0])} ${round(ys[0])}`;
  for (let i = 0; i < n - 1; i++) {
    const x0 = xs[i === 0 ? 0 : i - 1];
    const y0 = ys[i === 0 ? 0 : i - 1];
    const x1 = xs[i];
    const y1 = ys[i];
    const x2 = xs[i + 1];
    const y2 = ys[i + 1];
    const li = i + 2 > n - 1 ? n - 1 : i + 2;
    const x3 = xs[li];
    const y3 = ys[li];
    const c1x = x1 + ((x2 - x0) / 6) * t;
    const c1y = y1 + ((y2 - y0) / 6) * t;
    const c2x = x2 - ((x3 - x1) / 6) * t;
    const c2y = y2 - ((y3 - y1) / 6) * t;
    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(
      x2
    )} ${round(y2)}`;
  }
  return d;
}

const SPRING = { type: "spring", stiffness: 380, damping: 30, mass: 0.7 } as const;

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface Visitor {
  id: string;
  initials: string;
  /** [from, to] avatar gradient stops. */
  gradient: [string, string];
  location: string;
}

export interface LiveVisitorCountProps {
  /** Centre of gravity for the "active now" figure. */
  baseCount?: number;
  /** Sample roster shown in the overlapping stack. */
  visitors?: Visitor[];
  /** Trailing "+N" chip for the rest of the crowd. */
  overflowCount?: number;
  className?: string;
}

const DEFAULT_VISITORS: Visitor[] = [
  { id: "amara", initials: "AK", gradient: ["#7c6cff", "#5b8cff"], location: "New York" },
  { id: "ken", initials: "KO", gradient: ["#22d3ee", "#6366f1"], location: "London" },
  { id: "mei", initials: "ML", gradient: ["#f472b6", "#a855f7"], location: "Tokyo" },
  { id: "ravi", initials: "RP", gradient: ["#34d399", "#22d3ee"], location: "Berlin" },
  { id: "sara", initials: "SA", gradient: ["#fbbf24", "#f97316"], location: "Toronto" },
  { id: "diego", initials: "DM", gradient: ["#60a5fa", "#818cf8"], location: "Madrid" },
  { id: "lena", initials: "LR", gradient: ["#a78bfa", "#7c6cff"], location: "Paris" },
  { id: "yuki", initials: "YT", gradient: ["#2dd4bf", "#3b82f6"], location: "Seoul" },
  { id: "noah", initials: "NB", gradient: ["#f59e0b", "#ef4444"], location: "Austin" },
];

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

function AnimatedNumber({
  value,
  className,
}: {
  value: MotionValue<number>;
  className?: string;
}) {
  const [text, setText] = useState(() =>
    Math.round(value.get()).toLocaleString("en-US")
  );
  useMotionValueEvent(value, "change", (v) => {
    const next = Math.round(v).toLocaleString("en-US");
    setText((prev) => (prev === next ? prev : next));
  });
  return <span className={cn("tabular-nums", className)}>{text}</span>;
}

function Avatar({ person, z }: { person: Visitor; z: number }) {
  const [from, to] = person.gradient;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5, x: 6 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.5, x: -6 }}
      transition={SPRING}
      className="relative -ml-2 first:ml-0"
      style={{ zIndex: z }}
    >
      <div
        className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-[11px] font-semibold text-white ring-2 ring-[#0b0b12]"
        style={{ backgroundImage: `linear-gradient(140deg, ${from}, ${to})` }}
      >
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 to-transparent opacity-60" />
        <span className="relative tracking-wide">{person.initials}</span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  LiveVisitorCount                                                          */
/* -------------------------------------------------------------------------- */

export function LiveVisitorCount({
  baseCount = 1240,
  visitors = DEFAULT_VISITORS,
  overflowCount = 128,
  className,
}: LiveVisitorCountProps) {
  const id = useId();

  const [data, setData] = useState<number[]>(() =>
    Array.from({ length: SPARK_N }, (_, i) => signal(START + i))
  );
  const [tick, setTick] = useState(0);
  const [pct, setPct] = useState(2.4);

  const idxRef = useRef(START + SPARK_N);

  const countMV = useMotionValue(0);
  const countSpring = useSpring(countMV, { stiffness: 55, damping: 20, mass: 1 });
  const pagesMV = useMotionValue(0);
  const pagesSpring = useSpring(pagesMV, { stiffness: 90, damping: 22 });

  useEffect(() => {
    // Count up from zero on mount, then let the loop nudge it.
    countMV.set(baseCount);
    pagesMV.set(BASE_PAGES);

    const timer = setInterval(() => {
      const i = idxRef.current++;
      const sv = signal(i);
      setData((prev) => [...prev.slice(1), sv]);
      setTick((t) => t + 1);
      countMV.set(Math.round(baseCount + (sv - 0.5) * COUNT_BAND));
      pagesMV.set(Math.round(BASE_PAGES + (signal(i + 7) - 0.5) * PAGES_BAND));
      // Slow trend so the delta chip holds a direction instead of flickering.
      setPct(Math.round(Math.sin(i * 0.13) * 42) / 10);
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [baseCount, countMV, pagesMV]);

  // Rolling stack window over the roster.
  const startIdx = Math.floor(tick / SWAP_EVERY) % visitors.length;
  const visible = Array.from(
    { length: Math.min(VISIBLE, visitors.length) },
    (_, k) => visitors[(startIdx + k) % visitors.length]
  );
  const others = overflowCount + visible.length - 1;

  // Sparkline geometry from the current buffer.
  const xs = data.map((_, i) => i * STEP);
  const ys = data.map((v) => round(BASE_Y - v * SPAN_Y));
  const lineD = smoothPath(xs, ys);
  const areaD = `${lineD} L ${xs[SPARK_N - 1]} ${SPARK_H} L ${xs[0]} ${SPARK_H} Z`;
  const yEdge = ys[SPARK_N - 2];

  const up = pct >= 0;

  return (
    <div
      className={cn(
        "relative w-[380px] max-w-full overflow-hidden rounded-2xl border border-white/10 bg-panel p-5",
        className
      )}
      style={{
        boxShadow:
          "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 24px 60px -30px rgba(0,0,0,0.9)",
      }}
    >
      {/* ambient sweep, keeps the panel alive at rest */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-y-16 w-1/3 blur-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(91,140,255,0.10), transparent)",
        }}
        initial={{ x: "-140%" }}
        animate={{ x: "320%" }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1.6,
        }}
      />

      <div className="relative">
        {/* header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Realtime traffic</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              All properties, last 60 seconds
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
                animate={{ scale: [1, 2.4], opacity: [0.65, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
              Live
            </span>
          </div>
        </div>

        {/* headline count */}
        <div className="mt-4">
          <div className="flex items-baseline gap-2.5">
            <AnimatedNumber
              value={countSpring}
              className="text-[40px] font-semibold leading-none tracking-tight text-white"
            />
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
                up
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-white/5 text-zinc-400"
              )}
            >
              {up ? (
                <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
              ) : (
                <ArrowDownRight className="h-3 w-3" strokeWidth={2.5} />
              )}
              {Math.abs(pct).toFixed(1)}%
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-zinc-500">
            active visitors right now
          </p>
        </div>

        {/* live visitor stack */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((person, i) => (
                <Avatar key={person.id} person={person} z={VISIBLE - i} />
              ))}
            </AnimatePresence>
            <div
              className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-[10px] font-semibold text-zinc-300 ring-2 ring-[#0b0b12]"
              style={{ zIndex: 0 }}
            >
              +{overflowCount}
            </div>
          </div>
          <div className="min-w-0 text-[13px] leading-tight">
            <div className="truncate">
              <span className="font-medium text-white">{visible[0].location}</span>
              <span className="text-zinc-500">
                {" "}
                and {others.toLocaleString("en-US")} others
              </span>
            </div>
            <div className="text-zinc-500">browsing right now</div>
          </div>
        </div>

        {/* scrolling sparkline */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Sessions per minute
            </span>
            <span className="font-mono text-[11px] tabular-nums text-zinc-400">
              <AnimatedNumber value={pagesSpring} />
              <span className="text-zinc-600"> /min</span>
            </span>
          </div>

          <div
            className="relative h-[84px] w-full"
            style={{
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0, #000 9%, #000 100%)",
              maskImage:
                "linear-gradient(90deg, transparent 0, #000 9%, #000 100%)",
            }}
          >
            <svg
              viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <defs>
                <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c6cff" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#7c6cff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5b8cff" />
                  <stop offset="100%" stopColor="#a99dff" />
                </linearGradient>
              </defs>

              {/* static baseline grid */}
              {[0.32, 0.66].map((f) => {
                const gy = round(PAD_T + f * SPAN_Y);
                return (
                  <line
                    key={f}
                    x1={0}
                    y1={gy}
                    x2={SPARK_W}
                    y2={gy}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={1}
                    strokeDasharray="2 4"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              {/* scrolling series, remounted each tick and translated by one
                  step so the buffer shift stays perfectly continuous */}
              <motion.g
                key={tick}
                initial={{ x: 0 }}
                animate={{ x: -STEP }}
                transition={{ duration: TICK_MS / 1000, ease: "linear" }}
              >
                <path d={areaD} fill={`url(#${id}-area)`} />
                <path
                  d={lineD}
                  fill="none"
                  stroke={`url(#${id}-line)`}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </motion.g>

              {/* faint "now" marker + live head, pinned to the right edge */}
              <line
                x1={SPARK_W - 2}
                y1={PAD_T - 4}
                x2={SPARK_W - 2}
                y2={SPARK_H}
                stroke="rgba(91,140,255,0.18)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
              <motion.g
                style={{ x: SPARK_W - 2 }}
                animate={{ y: yEdge }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              >
                <motion.circle
                  r={4}
                  fill="#5b8cff"
                  animate={{ scale: [1, 2.6, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                />
                <circle r={3} fill="#0a0a12" />
                <circle r={2.1} fill="#5b8cff" />
                <circle r={0.9} fill="#ffffff" />
              </motion.g>
            </svg>
          </div>
        </div>

        {/* footer stats */}
        <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/[0.06]">
          {[
            { label: "Peak today", value: "1,402" },
            { label: "Avg. session", value: "3m 12s" },
            { label: "Countries", value: "47" },
          ].map((s) => (
            <div key={s.label} className="bg-panel px-3 py-2.5">
              <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">
                {s.label}
              </div>
              <div className="mt-0.5 text-[13px] font-semibold tabular-nums text-white">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <LiveVisitorCount />
    </div>
  );
}
