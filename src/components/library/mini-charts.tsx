"use client";

import { useEffect, useId, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Deterministic geometry (module scope, no random)                          */
/* -------------------------------------------------------------------------- */

const round2 = (n: number) => Math.round(n * 100) / 100;

const AREA_W = 320;
const AREA_H = 132;
const AREA_PX = 6;
const AREA_TOP = 20;
const AREA_BOT = 18;

// Revenue-by-day series, generally rising. Normalized 0..1.
const SERIES = [0.3, 0.44, 0.37, 0.56, 0.49, 0.72, 0.9];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const N = SERIES.length;

const INNER_W = AREA_W - AREA_PX * 2;
const BASE_Y = AREA_H - AREA_BOT;
const TOP_Y = AREA_TOP;

const XS = SERIES.map((_, i) => AREA_PX + (i * INNER_W) / (N - 1));
const YS = SERIES.map((v) => BASE_Y - v * (BASE_Y - TOP_Y));

function smoothPath(xs: number[], ys: number[]): string {
  const t = 0.85;
  let d = `M ${round2(xs[0])} ${round2(ys[0])}`;
  for (let i = 0; i < xs.length - 1; i++) {
    const x0 = xs[i === 0 ? 0 : i - 1];
    const y0 = ys[i === 0 ? 0 : i - 1];
    const x1 = xs[i];
    const y1 = ys[i];
    const x2 = xs[i + 1];
    const y2 = ys[i + 1];
    const li = i + 2 > xs.length - 1 ? xs.length - 1 : i + 2;
    const x3 = xs[li];
    const y3 = ys[li];
    const c1x = x1 + ((x2 - x0) / 6) * t;
    const c1y = y1 + ((y2 - y0) / 6) * t;
    const c2x = x2 - ((x3 - x1) / 6) * t;
    const c2y = y2 - ((y3 - y1) / 6) * t;
    d += ` C ${round2(c1x)} ${round2(c1y)}, ${round2(c2x)} ${round2(
      c2y
    )}, ${round2(x2)} ${round2(y2)}`;
  }
  return d;
}

const LINE_D = smoothPath(XS, YS);
const AREA_D = `${LINE_D} L ${round2(XS[N - 1])} ${round2(BASE_Y)} L ${round2(
  XS[0]
)} ${round2(BASE_Y)} Z`;

function interpY(x: number): number {
  if (x <= XS[0]) return YS[0];
  if (x >= XS[N - 1]) return YS[N - 1];
  let i = 0;
  while (i < N - 1 && XS[i + 1] < x) i++;
  const t = (x - XS[i]) / (XS[i + 1] - XS[i]);
  return YS[i] + (YS[i + 1] - YS[i]) * t;
}

// Sessions-by-day bar series (normalized 0..1) + the peak column.
const BARS = [0.48, 0.64, 0.53, 0.79, 0.68, 0.95, 0.85];
const BAR_MAX = BARS.reduce((m, v, i) => (v > BARS[m] ? i : m), 0);

const DONUT = 0.68; // conversion rate fraction
const DONUT_R = 44;

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

function AnimatedMetric({
  progress,
  format,
}: {
  progress: MotionValue<number>;
  format: (v: number) => string;
}) {
  const [text, setText] = useState(() => format(0));
  useMotionValueEvent(progress, "change", (v) => {
    const next = format(v);
    setText((prev) => (prev === next ? prev : next));
  });
  return <>{text}</>;
}

function Bar({
  progress,
  value,
  highlight,
}: {
  progress: MotionValue<number>;
  value: number;
  highlight: boolean;
}) {
  const scaleY = useTransform(progress, (v) => v * value);
  return (
    <div className="relative flex h-full flex-1 items-end">
      <motion.div
        className="w-full rounded-t-[3px]"
        style={{
          scaleY,
          transformOrigin: "bottom",
          height: "100%",
          background: highlight
            ? "linear-gradient(180deg, #a99dff 0%, #7c6cff 100%)"
            : "linear-gradient(180deg, rgba(91,140,255,0.85) 0%, rgba(91,140,255,0.14) 100%)",
          boxShadow: highlight
            ? "0 0 18px rgba(124,108,255,0.45)"
            : "none",
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  MiniCharts                                                                */
/* -------------------------------------------------------------------------- */

export interface MiniChartsProps {
  className?: string;
}

const RANGES = ["24h", "7d", "30d"];

export function MiniCharts({ className }: MiniChartsProps) {
  const id = useId();
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, [0, 1], {
      duration: 2.6,
      ease: [0.16, 1, 0.3, 1],
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 3.4,
    });
    return () => controls.stop();
  }, [progress]);

  const areaOpacity = useTransform(progress, [0, 0.25, 1], [0, 0.16, 0.22]);

  const dotX = useTransform(progress, (v) =>
    round2(XS[0] + v * (XS[N - 1] - XS[0]))
  );
  const dotY = useTransform(progress, (v) =>
    round2(interpY(XS[0] + v * (XS[N - 1] - XS[0])))
  );

  const donutLen = useTransform(progress, (v) => v * DONUT);
  const donutTipX = useTransform(progress, (v) =>
    round2(60 + DONUT_R * Math.cos(v * DONUT * 2 * Math.PI))
  );
  const donutTipY = useTransform(progress, (v) =>
    round2(60 + DONUT_R * Math.sin(v * DONUT * 2 * Math.PI))
  );

  return (
    <div
      className={cn(
        "relative w-[384px] max-w-full overflow-hidden rounded-2xl border border-white/10 bg-panel p-5",
        className
      )}
      style={{
        boxShadow:
          "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 24px 60px -30px rgba(0,0,0,0.9)",
      }}
    >
      {/* ambient sweep, keeps the card alive at rest */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-y-12 w-1/3 blur-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(91,140,255,0.10), transparent)",
        }}
        initial={{ x: "-140%" }}
        animate={{ x: "300%" }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1.4,
        }}
      />

      <div className="relative">
        {/* header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Performance</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              Store metrics, updated live
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
            {RANGES.map((r, i) => (
              <span
                key={r}
                className={cn(
                  "rounded-md px-2 py-1 font-mono text-[11px] leading-none",
                  i === 1
                    ? "bg-brand/15 text-brand-soft"
                    : "text-zinc-500"
                )}
                style={
                  i === 1
                    ? { boxShadow: "0 0 12px rgba(124,108,255,0.25)" }
                    : undefined
                }
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* area / line chart */}
        <div className="relative mt-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Revenue
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-semibold tabular-nums text-white">
                  <AnimatedMetric
                    progress={progress}
                    format={(v) => `$${(v * 48.2).toFixed(1)}k`}
                  />
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-400">
                  <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
                  12.4%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
                  animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
                  transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Live
              </span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${AREA_W} ${AREA_H}`}
            preserveAspectRatio="none"
            className="mt-2 h-[124px] w-full"
            style={{ filter: "drop-shadow(0 6px 16px rgba(124,108,255,0.18))" }}
          >
            <defs>
              <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c6cff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#7c6cff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5b8cff" />
                <stop offset="100%" stopColor="#a99dff" />
              </linearGradient>
            </defs>

            {/* baseline grid */}
            {[0.28, 0.55, 0.82].map((f) => {
              const gy = round2(TOP_Y + f * (BASE_Y - TOP_Y));
              return (
                <line
                  key={f}
                  x1={AREA_PX}
                  y1={gy}
                  x2={AREA_W - AREA_PX}
                  y2={gy}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1}
                  strokeDasharray="2 4"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {/* area fill */}
            <motion.path
              d={AREA_D}
              fill={`url(#${id}-area)`}
              style={{ opacity: areaOpacity }}
            />

            {/* line draw-in */}
            <motion.path
              d={LINE_D}
              fill="none"
              stroke={`url(#${id}-line)`}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: progress }}
            />

            {/* leading dot */}
            <motion.g style={{ x: dotX, y: dotY }}>
              <motion.circle
                r={7}
                fill="#5b8cff"
                animate={{ scale: [1, 1.7, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <circle r={3.4} fill="#ffffff" />
              <circle r={2} fill="#5b8cff" />
            </motion.g>
          </svg>

          <div className="mt-1.5 flex justify-between px-1">
            {DAYS.map((d) => (
              <span
                key={d}
                className="font-mono text-[9px] uppercase tracking-wider text-zinc-600"
              >
                {d.charAt(0)}
              </span>
            ))}
          </div>
        </div>

        {/* bottom row: bars + donut */}
        <div className="mt-4 flex gap-3">
          {/* bars */}
          <div className="flex-[1.35] rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                Sessions
              </span>
              <span className="text-[11px] font-medium text-emerald-400">
                +8.2%
              </span>
            </div>
            <div className="mt-0.5 text-lg font-semibold tabular-nums text-white">
              <AnimatedMetric
                progress={progress}
                format={(v) => Math.round(v * 2481).toLocaleString("en-US")}
              />
            </div>
            <div className="mt-2.5 flex h-16 items-end gap-1.5">
              {BARS.map((v, i) => (
                <Bar
                  key={i}
                  progress={progress}
                  value={v}
                  highlight={i === BAR_MAX}
                />
              ))}
            </div>
          </div>

          {/* donut */}
          <div className="flex flex-1 flex-col rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              Conversion
            </span>
            <div className="relative mt-1 flex flex-1 items-center justify-center">
              <svg viewBox="0 0 120 120" className="h-[92px] w-[92px]">
                <g transform="rotate(-90 60 60)">
                  <circle
                    cx={60}
                    cy={60}
                    r={DONUT_R}
                    fill="none"
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth={11}
                  />
                  <motion.circle
                    cx={60}
                    cy={60}
                    r={DONUT_R}
                    fill="none"
                    stroke={`url(#${id}-line)`}
                    strokeWidth={11}
                    strokeLinecap="round"
                    style={{ pathLength: donutLen }}
                  />
                  <motion.circle
                    r={4}
                    fill="#ffffff"
                    style={{ cx: donutTipX, cy: donutTipY }}
                  />
                </g>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-semibold tabular-nums text-white">
                  <AnimatedMetric
                    progress={progress}
                    format={(v) => `${Math.round(v * 68)}%`}
                  />
                </span>
                <span className="mt-0.5 text-[9px] text-zinc-500">
                  of 3.6k visits
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <MiniCharts />
    </div>
  );
}
