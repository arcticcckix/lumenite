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
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const RING_RADIUS = 20;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/**
 * A reading-progress overlay: a slim gradient bar pinned to the top edge plus a
 * circular percentage dial in the corner. Drop it inside any `position: relative`
 * container and drive it with a 0..1 `MotionValue` (e.g. framer-motion's
 * `useScroll().scrollYProgress`, or an animated value as in the demo below).
 */
export function ScrollProgress({
  progress,
  showDial = true,
  className,
}: {
  progress: MotionValue<number>;
  showDial?: boolean;
  className?: string;
}) {
  const gradientId = useId();
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.round(clamp01(value) * 100);
    setPercent((prev) => (prev === next ? prev : next));
  });

  const dashOffset = useTransform(progress, (value) => {
    const filled = RING_CIRCUMFERENCE * (1 - clamp01(value));
    return Math.round(filled * 100) / 100;
  });

  const dotLeft = useTransform(
    progress,
    (value) => `${Math.round(clamp01(value) * 1000) / 10}%`
  );

  const dotOpacity = useTransform(progress, [0, 0.015, 1], [0, 1, 1]);

  return (
    <div className={cn("pointer-events-none", className)}>
      {/* Slim gradient progress bar */}
      <div className="absolute inset-x-0 top-0 z-30 h-[3px] bg-white/[0.06]">
        <motion.div
          className="h-full origin-left rounded-r-full bg-gradient-to-r from-brand via-glow to-brand-soft shadow-[0_0_10px_rgba(124,108,255,0.55)]"
          style={{ scaleX: progress }}
        />
        <motion.div
          className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgba(91,140,255,0.7)]"
          style={{ left: dotLeft, opacity: dotOpacity }}
        />
      </div>

      {/* Circular percentage dial */}
      {showDial && (
        <div className="absolute bottom-4 right-4 z-30">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-panel/70 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md">
            <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c6cff" />
                  <stop offset="100%" stopColor="#5b8cff" />
                </linearGradient>
              </defs>
              <circle
                cx="24"
                cy="24"
                r={RING_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="3"
              />
              <motion.circle
                cx="24"
                cy="24"
                r={RING_RADIUS}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                style={{ strokeDashoffset: dashOffset }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xs font-medium tabular-nums text-white">
                {percent}
                <span className="ml-[1px] text-[9px] text-zinc-500">%</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Demo() {
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, [0, 1, 1, 0], {
      duration: 8.5,
      times: [0, 0.42, 0.58, 1],
      ease: [0.16, 1, 0.3, 1],
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [progress]);

  const contentY = useTransform(progress, [0, 1], [0, -172]);

  return (
    <div className="flex h-full w-full items-center justify-center p-5">
      <div className="relative h-full w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10]">
        {/* Ambient depth glow */}
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(124,108,255,0.22), transparent 70%)",
          }}
        />

        {/* Mock article that drifts upward as progress fills */}
        <motion.article
          style={{ y: contentY }}
          className="relative z-10 px-8 pt-10"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-soft">
            Field notes
          </p>
          <h3 className="mt-3 text-[22px] font-semibold leading-tight tracking-tight text-white">
            The quiet mechanics of a good scroll
          </h3>

          <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500">
            <span className="text-zinc-300">Ilya Renner</span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />6 min read
            </span>
          </div>

          <div className="mt-6 space-y-4 text-[13px] leading-relaxed text-zinc-400">
            <p>
              Progress should be felt before it is read. A thin line travelling
              across the top of the page does most of the work, because the eye
              follows its motion without any effort at all.
            </p>
            <p>
              The dial in the corner is for the pause, the moment a reader
              glances up and wonders how far along they are. It answers in a
              single number, then steps back out of the way.
            </p>
            <p>
              Neither element asks for attention. They report, quietly and
              continuously, and let the writing stay the thing you actually came
              here to read.
            </p>
            <p>
              Get the pacing right and no one will notice the instrument. They
              will only notice that the page felt easy to finish.
            </p>
          </div>
        </motion.article>

        {/* Edge fades so text resolves cleanly under the bar and above the dial */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-12 bg-gradient-to-b from-[#0b0b10] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-[#0b0b10] to-transparent" />

        <ScrollProgress progress={progress} />
      </div>
    </div>
  );
}
