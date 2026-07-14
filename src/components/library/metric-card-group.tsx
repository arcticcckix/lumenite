"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, animate, useInView } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Percent,
  UserPlus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const r2 = (n: number) => Math.round(n * 100) / 100;

export interface Metric {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Signed, preformatted delta label, e.g. "+14.2%". */
  delta: string;
  trendUp: boolean;
  icon: LucideIcon;
  /** Raw sparkline samples, oldest to newest. */
  series: number[];
}

/** Deterministic sample series (seeded with Math.sin, safe at module scope). */
function makeSeries(seed: number, dir: 1 | -1, n = 20): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const wiggle =
      Math.sin(i * 1.7 + seed) * 5 + Math.sin(i * 0.55 + seed * 2) * 2.8;
    const trend = dir === 1 ? t * 30 : (1 - t) * 30;
    out.push(40 + trend + wiggle);
  }
  return out;
}

/** Catmull-Rom to cubic bezier for a smooth, premium sparkline. */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = r2(p1.x + (p2.x - p0.x) / 6);
    const c1y = r2(p1.y + (p2.y - p0.y) / 6);
    const c2x = r2(p2.x - (p3.x - p1.x) / 6);
    const c2y = r2(p2.y - (p3.y - p1.y) / 6);
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  delay = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.5,
      delay,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, delay]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

function Sparkline({
  series,
  trendUp,
  delay,
}: {
  series: number[];
  trendUp: boolean;
  delay: number;
}) {
  const uid = useId().replace(/:/g, "");
  const W = 120;
  const H = 40;
  const padY = 7;

  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const stepX = W / (series.length - 1);

  const pts = series.map((v, i) => ({
    x: r2(i * stepX),
    y: r2(padY + (H - padY * 2) * (1 - (v - min) / range)),
  }));

  const line = smoothPath(pts);
  const area = `${line} L ${r2(W)} ${H} L 0 ${H} Z`;
  const last = pts[pts.length - 1];

  const lineFrom = trendUp ? "#5b8cff" : "#fb7185";
  const lineTo = trendUp ? "#7c6cff" : "#f43f5e";
  const areaColor = trendUp ? "#7c6cff" : "#f43f5e";
  const dotColor = trendUp ? "#a99dff" : "#fda4af";

  return (
    <div className="relative mt-4 h-[52px] w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`line-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={lineFrom} />
            <stop offset="100%" stopColor={lineTo} />
          </linearGradient>
          <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={areaColor} stopOpacity={0.24} />
            <stop offset="100%" stopColor={areaColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        <motion.path
          d={area}
          fill={`url(#area-${uid})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.5, ease: "easeOut" }}
        />

        <motion.path
          d={line}
          fill="none"
          stroke={`url(#line-${uid})`}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay, ease: EASE }}
        />

        <motion.path
          d={line}
          fill="none"
          stroke={dotColor}
          strokeWidth={2}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.18 1"
          initial={{ strokeDashoffset: 0, opacity: 0 }}
          animate={{ strokeDashoffset: [0, -1], opacity: [0, 0.85, 0] }}
          transition={{
            strokeDashoffset: {
              duration: 2.8,
              delay: delay + 1.3,
              repeat: Infinity,
              repeatDelay: 1.6,
              ease: "linear",
            },
            opacity: {
              duration: 2.8,
              delay: delay + 1.3,
              repeat: Infinity,
              repeatDelay: 1.6,
              times: [0, 0.5, 1],
              ease: "linear",
            },
          }}
        />
      </svg>

      <motion.div
        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: `${r2((last.x / W) * 100)}%`,
          top: `${r2((last.y / H) * 100)}%`,
          backgroundColor: dotColor,
          boxShadow: `0 0 10px ${dotColor}`,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: delay + 1, ease: "backOut" }}
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: dotColor }}
          animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
          transition={{
            duration: 1.8,
            delay: delay + 1.3,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>
    </div>
  );
}

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const Icon = metric.icon;
  const up = metric.trendUp;
  const valueDelay = 0.2 + index * 0.12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.09, ease: EASE }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-panel p-4"
    >
      <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div
        className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: up
            ? "radial-gradient(circle, rgba(124,108,255,0.28), transparent 70%)"
            : "radial-gradient(circle, rgba(244,63,94,0.24), transparent 70%)",
        }}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-inset ring-white/10">
            <Icon className="h-3.5 w-3.5 text-zinc-300" strokeWidth={2} />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            {metric.label}
          </span>
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset tabular-nums",
            up
              ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
              : "bg-rose-500/10 text-rose-300 ring-rose-500/20"
          )}
        >
          {up ? (
            <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
          ) : (
            <ArrowDownRight className="h-3 w-3" strokeWidth={2.5} />
          )}
          {metric.delta}
        </div>
      </div>

      <div className="relative mt-3 text-[26px] font-semibold leading-none tracking-tight text-white">
        <CountUp
          value={metric.value}
          prefix={metric.prefix}
          suffix={metric.suffix}
          decimals={metric.decimals}
          delay={valueDelay}
        />
      </div>
      <div className="relative mt-1.5 text-[11px] text-zinc-500">
        vs. previous 7 days
      </div>

      <Sparkline series={metric.series} trendUp={up} delay={valueDelay} />
    </motion.div>
  );
}

export function MetricCardGroup({
  metrics,
  className,
}: {
  metrics: Metric[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-surface/60 p-4 backdrop-blur-sm",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-semibold text-white">Performance</h3>
          <p className="text-[11px] text-zinc-500">
            Realtime overview, updated continuously
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
              animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-medium text-zinc-300">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} metric={m} index={i} />
        ))}
      </div>
    </div>
  );
}

const demoMetrics: Metric[] = [
  {
    label: "Net revenue",
    value: 48290,
    prefix: "$",
    delta: "+14.2%",
    trendUp: true,
    icon: DollarSign,
    series: makeSeries(1.3, 1),
  },
  {
    label: "Active users",
    value: 12847,
    delta: "+6.1%",
    trendUp: true,
    icon: Users,
    series: makeSeries(2.7, 1),
  },
  {
    label: "Conversion",
    value: 3.42,
    suffix: "%",
    decimals: 2,
    delta: "+0.8%",
    trendUp: true,
    icon: Percent,
    series: makeSeries(4.1, 1),
  },
  {
    label: "Trial signups",
    value: 1208,
    delta: "-3.1%",
    trendUp: false,
    icon: UserPlus,
    series: makeSeries(5.6, -1),
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <MetricCardGroup metrics={demoMetrics} className="max-w-4xl" />
    </div>
  );
}
