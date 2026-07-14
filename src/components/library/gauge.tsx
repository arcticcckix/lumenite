"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Geometry. A 270 degree speedometer sweep with a 90 degree gap at the bottom.
 * Angles use a convention where 0 points up and increases clockwise.
 * -------------------------------------------------------------------------- */
const CX = 100;
const CY = 100;
const R_ARC = 82;
const START = 225; // bottom-left
const SWEEP = 270; // clockwise, over the top, to bottom-right
const NEEDLE_LEN = 60;
const NEEDLE_TAIL = 15;
const VIEW_H = 176;

const round2 = (n: number) => Math.round(n * 100) / 100;
const round4 = (n: number) => Math.round(n * 10000) / 10000;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

type Rating = { text: string; color: string };

function ratingFor(value: number): Rating {
  if (value >= 85) return { text: "Excellent", color: "#7c6cff" };
  if (value >= 70) return { text: "Strong", color: "#5b8cff" };
  if (value >= 50) return { text: "Steady", color: "#a99dff" };
  return { text: "Needs work", color: "#8a8aa0" };
}

export type GaugeProps = {
  value: number;
  max?: number;
  label?: string;
  size?: number;
  className?: string;
};

export function Gauge({
  value,
  max = 100,
  label = "Performance score",
  size = 300,
  className,
}: GaugeProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");
  const gradId = `gauge-grad-${uid}`;
  const glowId = `gauge-glow-${uid}`;

  const fraction = Math.max(0, Math.min(1, value / max));

  const progress = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  // Ease the progress motion value toward the target on every value change.
  useEffect(() => {
    const controls = animate(progress, fraction, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [fraction, progress]);

  // Mirror the eased fraction into a rounded readout without re-rendering the arc.
  useEffect(() => {
    const unsubscribe = progress.on("change", (v) =>
      setDisplay(Math.round(v * max))
    );
    return unsubscribe;
  }, [progress, max]);

  // Smoothly animated attributes derived from the single progress value.
  const dashOffset = useTransform(progress, (f) => round4(1 - f));
  const needleTipX = useTransform(progress, (f) =>
    round2(polar(CX, CY, NEEDLE_LEN, START + f * SWEEP).x)
  );
  const needleTipY = useTransform(progress, (f) =>
    round2(polar(CX, CY, NEEDLE_LEN, START + f * SWEEP).y)
  );
  const tailX = useTransform(progress, (f) =>
    round2(polar(CX, CY, NEEDLE_TAIL, START + f * SWEEP + 180).x)
  );
  const tailY = useTransform(progress, (f) =>
    round2(polar(CX, CY, NEEDLE_TAIL, START + f * SWEEP + 180).y)
  );
  const dotX = useTransform(progress, (f) =>
    round2(polar(CX, CY, R_ARC, START + f * SWEEP).x)
  );
  const dotY = useTransform(progress, (f) =>
    round2(polar(CX, CY, R_ARC, START + f * SWEEP).y)
  );

  const arcPath = useMemo(() => {
    const s = polar(CX, CY, R_ARC, START);
    const e = polar(CX, CY, R_ARC, START + SWEEP);
    const largeArc = SWEEP > 180 ? 1 : 0;
    return `M ${round2(s.x)} ${round2(s.y)} A ${R_ARC} ${R_ARC} 0 ${largeArc} 1 ${round2(
      e.x
    )} ${round2(e.y)}`;
  }, []);

  const ticks = useMemo(() => {
    const count = 20;
    const out: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] =
      [];
    for (let i = 0; i <= count; i++) {
      const f = i / count;
      const major = i % 5 === 0;
      const a = START + f * SWEEP;
      const inner = polar(CX, CY, major ? 62 : 67, a);
      const outer = polar(CX, CY, 73, a);
      out.push({
        x1: round2(inner.x),
        y1: round2(inner.y),
        x2: round2(outer.x),
        y2: round2(outer.y),
        major,
      });
    }
    return out;
  }, []);

  const tickLabels = useMemo(() => {
    return [0, 0.25, 0.5, 0.75, 1].map((f) => {
      const p = polar(CX, CY, 50, START + f * SWEEP);
      return { x: round2(p.x), y: round2(p.y), value: Math.round(f * max) };
    });
  }, [max]);

  const rating = ratingFor(display);
  const height = round2((size * VIEW_H) / 200);
  const numberSize = round2(size * 0.185);

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height }}
    >
      <svg
        viewBox={`0 0 200 ${VIEW_H}`}
        width={size}
        height={height}
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c6cff" />
            <stop offset="55%" stopColor="#5b8cff" />
            <stop offset="100%" stopColor="#8fb4ff" />
          </linearGradient>
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>

        {/* Track */}
        <path
          d={arcPath}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={12}
          strokeLinecap="round"
        />

        {/* Ticks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={
              t.major ? "rgba(255,255,255,0.34)" : "rgba(255,255,255,0.12)"
            }
            strokeWidth={t.major ? 1.6 : 1}
            strokeLinecap="round"
          />
        ))}

        {/* Scale labels */}
        {tickLabels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y}
            fill="rgba(255,255,255,0.3)"
            fontSize={7}
            fontWeight={500}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {l.value}
          </text>
        ))}

        {/* Progress glow */}
        <motion.path
          d={arcPath}
          stroke={`url(#${gradId})`}
          strokeWidth={12}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          filter={`url(#${glowId})`}
          style={{ strokeDashoffset: dashOffset }}
          animate={{ opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Progress arc */}
        <motion.path
          d={arcPath}
          stroke={`url(#${gradId})`}
          strokeWidth={12}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: dashOffset }}
        />

        {/* Leading dot */}
        <motion.circle
          cx={dotX}
          cy={dotY}
          r={6}
          fill="#9fc0ff"
          filter={`url(#${glowId})`}
          opacity={0.7}
        />
        <motion.circle
          cx={dotX}
          cy={dotY}
          r={3.2}
          fill="#ffffff"
          stroke="rgba(143,180,255,0.9)"
          strokeWidth={1}
        />

        {/* Needle */}
        <motion.line
          x1={CX}
          y1={CY}
          x2={needleTipX}
          y2={needleTipY}
          stroke="#7c6cff"
          strokeWidth={5}
          strokeLinecap="round"
          filter={`url(#${glowId})`}
          opacity={0.5}
        />
        <motion.line
          x1={CX}
          y1={CY}
          x2={needleTipX}
          y2={needleTipY}
          stroke="#eef1ff"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <motion.line
          x1={CX}
          y1={CY}
          x2={tailX}
          y2={tailY}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={2.4}
          strokeLinecap="round"
        />

        {/* Hub */}
        <circle
          cx={CX}
          cy={CY}
          r={8}
          fill="#0b0b12"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={1}
        />
        <circle cx={CX} cy={CY} r={3.4} fill={`url(#${gradId})`} />
      </svg>

      {/* Readout overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute text-center"
          style={{ left: "50%", top: "70%", transform: "translate(-50%, -50%)" }}
        >
          <div
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
            style={{
              color: rating.color,
              borderColor: `${rating.color}55`,
              backgroundColor: `${rating.color}14`,
            }}
          >
            <motion.span
              className="h-1 w-1 rounded-full"
              style={{ background: rating.color }}
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            {rating.text}
          </div>
          <div
            className="mt-1.5 bg-gradient-to-b from-white to-white/55 bg-clip-text text-transparent"
            style={{
              fontSize: numberSize,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {display}
          </div>
          <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

const SEQUENCE = [92, 64, 78, 41, 88, 73];

export default function Demo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % SEQUENCE.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-panel/80 px-6 pb-5 pt-4 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_60px_-20px_rgba(0,0,0,0.8)]">
        {/* Ambient glow behind the gauge */}
        <div
          className="pointer-events-none absolute left-1/2 top-24 h-56 w-56 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(124,108,255,0.35), transparent 70%)",
          }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-line bg-void">
              <Activity className="h-3.5 w-3.5 text-brand-soft" />
            </span>
            <span className="text-sm font-medium text-white">
              System performance
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/45">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-glow"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.82, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            Live
          </div>
        </div>

        {/* Gauge */}
        <div className="relative mt-1 flex justify-center">
          <Gauge value={SEQUENCE[index]} label="Performance score" size={272} />
        </div>

        {/* Footer stats */}
        <div className="relative mt-1 grid grid-cols-2 gap-3 border-t border-line pt-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/35">
              Baseline
            </div>
            <div className="mt-0.5 text-sm font-semibold text-white/85">68</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-white/35">
              Target
            </div>
            <div className="mt-0.5 text-sm font-semibold text-white/85">90</div>
          </div>
        </div>
      </div>
    </div>
  );
}
