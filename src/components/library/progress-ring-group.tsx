"use client";

import { useEffect, useId, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Geometry. A full 120 unit viewBox ring. Circles are rotated -90deg so the
 * stroke starts at 12 o'clock and grows clockwise. The leading dot is placed
 * in absolute coords with a top-clockwise formula so it always tracks the tip.
 * -------------------------------------------------------------------------- */
const VIEW = 120;
const CENTER = 60;
const R = 50;
const TAU = Math.PI * 2;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const round2 = (n: number) => Math.round(n * 100) / 100;
const round4 = (n: number) => Math.round(n * 10000) / 10000;

export type ProgressRingProps = {
  /** One or more target percentages (0 to 100). The ring sweeps through them on a loop. */
  values: number[];
  label: string;
  sub?: string;
  from?: string;
  to?: string;
  size?: number;
  strokeWidth?: number;
  /** Seconds of delay before the intro sweep begins, used to stagger a row. */
  delay?: number;
  className?: string;
};

export function ProgressRing({
  values,
  label,
  sub,
  from = "#7c6cff",
  to = "#5b8cff",
  size = 104,
  strokeWidth = 9,
  delay = 0,
  className,
}: ProgressRingProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");
  const gradId = `ring-grad-${uid}`;
  const glowId = `ring-glow-${uid}`;

  const progress = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  // Build a seamless loop: fill to each value, dwell there, then drain and repeat.
  useEffect(() => {
    const fractions =
      values.length > 0 ? values.map((v) => clamp01(v / 100)) : [0];

    const keyframes: number[] = [0];
    for (const f of fractions) keyframes.push(f, f);
    keyframes.push(0);

    const steps = keyframes.length - 1;
    const times = keyframes.map((_, i) => round4(i / steps));

    const controls = animate(progress, keyframes, {
      duration: keyframes.length * 1.15,
      times,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
      delay,
    });
    return () => controls.stop();
  }, [values, progress, delay]);

  // Mirror the eased fraction into a rounded readout without re-rendering the arc.
  useEffect(() => {
    const unsub = progress.on("change", (v) => setDisplay(Math.round(v * 100)));
    return unsub;
  }, [progress]);

  const dashOffset = useTransform(progress, (f) => round4(1 - f));
  const dotX = useTransform(progress, (f) =>
    round2(CENTER + R * Math.sin(f * TAU))
  );
  const dotY = useTransform(progress, (f) =>
    round2(CENTER - R * Math.cos(f * TAU))
  );
  const dotOpacity = useTransform(progress, [0, 0.03, 1], [0, 1, 1]);

  const numberSize = round2(size * 0.235);

  return (
    <div
      className={cn("flex flex-col items-center", className)}
      style={{ width: size }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          width={size}
          height={size}
          fill="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* Hairline outer edge for definition */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={round2(R + strokeWidth / 2 + 1.5)}
            stroke="rgba(255,255,255,0.045)"
            strokeWidth={1}
          />

          {/* Track */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={R}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          />

          {/* Progress glow */}
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={R}
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            filter={`url(#${glowId})`}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            style={{ strokeDashoffset: dashOffset }}
            animate={{ opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Progress arc */}
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={R}
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            style={{ strokeDashoffset: dashOffset }}
          />

          {/* Leading dot */}
          <motion.circle
            cx={dotX}
            cy={dotY}
            r={round2(strokeWidth / 2 + 1)}
            fill="#ffffff"
            filter={`url(#${glowId})`}
            style={{ opacity: dotOpacity }}
          />
          <motion.circle
            cx={dotX}
            cy={dotY}
            r={round2(strokeWidth / 2 - 1.5)}
            fill="#ffffff"
            style={{ opacity: dotOpacity }}
          />
        </svg>

        {/* Center readout */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex items-baseline">
            <span
              className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
              style={{
                fontSize: numberSize,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {display}
            </span>
            <span
              className="text-white/40"
              style={{
                fontSize: round2(numberSize * 0.42),
                fontWeight: 600,
                marginLeft: 1,
              }}
            >
              %
            </span>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <div className="text-[13px] font-medium text-white/90">{label}</div>
        {sub ? <div className="mt-0.5 text-[11px] text-white/40">{sub}</div> : null}
      </div>
    </div>
  );
}

export type RingMetric = Omit<
  ProgressRingProps,
  "size" | "strokeWidth" | "delay" | "className"
>;

export function ProgressRingGroup({
  metrics,
  size = 104,
  strokeWidth = 9,
  className,
}: {
  metrics: RingMetric[];
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-center gap-x-8 gap-y-7",
        className
      )}
    >
      {metrics.map((m, i) => (
        <ProgressRing
          key={m.label}
          {...m}
          size={size}
          strokeWidth={strokeWidth}
          delay={round2(i * 0.12)}
        />
      ))}
    </div>
  );
}

const METRICS: RingMetric[] = [
  {
    label: "Storage",
    sub: "184 GB of 256",
    values: [72, 58, 81],
    from: "#7c6cff",
    to: "#5b8cff",
  },
  {
    label: "Bandwidth",
    sub: "5.4 TB of 12",
    values: [46, 61, 53],
    from: "#6b7dff",
    to: "#58a0ff",
  },
  {
    label: "Seats",
    sub: "22 of 25 active",
    values: [88, 76, 92],
    from: "#8a6cff",
    to: "#6a7dff",
  },
  {
    label: "Compute",
    sub: "Cluster load",
    values: [63, 74, 58],
    from: "#7466ff",
    to: "#4f93ff",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-panel/80 px-7 pb-7 pt-6 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_30px_80px_-30px_rgba(0,0,0,0.85)]">
        {/* Ambient glow */}
        <motion.div
          className="pointer-events-none absolute -top-16 left-1/2 h-64 w-[420px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(124,108,255,0.22), transparent 70%)",
          }}
          animate={{ opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Header */}
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-void">
              <Gauge className="h-4 w-4 text-brand-soft" />
            </span>
            <div>
              <div className="text-sm font-semibold text-white">
                Resource usage
              </div>
              <div className="text-[11px] text-white/40">
                Current billing period
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-line bg-void/60 px-2.5 py-1 text-[11px] font-medium text-white/55">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-glow"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            Live
          </div>
        </div>

        {/* Rings */}
        <div className="relative mt-7">
          <ProgressRingGroup metrics={METRICS} />
        </div>

        {/* Footer */}
        <div className="relative mt-7 flex items-center justify-between border-t border-line pt-4 text-[11px]">
          <span className="text-white/40">Updated moments ago</span>
          <span className="font-medium text-brand-soft">
            4 of 4 within limits
          </span>
        </div>
      </div>
    </div>
  );
}
