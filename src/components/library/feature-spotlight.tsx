"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Gauge, Globe, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Feature = {
  icon: LucideIcon;
  title: string;
  metric: string;
  caption: string;
};

const DEFAULT_FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Instant deploys",
    metric: "< 1s",
    caption:
      "Every push builds, tests, and promotes to production in under a second, with no queue between commit and live.",
  },
  {
    icon: Globe,
    title: "Edge network",
    metric: "300 PoP",
    caption:
      "Three hundred locations answer each request from the nearest node, so latency stays low for every visitor.",
  },
  {
    icon: Gauge,
    title: "Elastic scale",
    metric: "Auto",
    caption:
      "Capacity expands the moment traffic climbs, then settles back down once the spike has fully passed.",
  },
  {
    icon: Activity,
    title: "Live tracing",
    metric: "Realtime",
    caption:
      "Follow a single request across every service, with spans, logs, and metrics stitched into one timeline.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function FeatureSpotlight({
  features = DEFAULT_FEATURES,
  interval = 3200,
  className,
}: {
  features?: Feature[];
  interval?: number;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % features.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [paused, interval, features.length]);

  const current = features[active];

  // Spotlight target for a fixed two-column grid. Integer percentages only.
  const col = active % 2;
  const row = Math.floor(active / 2);
  const spot = { x: col === 0 ? 27 : 73, y: row === 0 ? 28 : 74 };

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-panel/70 p-6",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-soft/80">
            Platform
          </div>
          <h3 className="mt-1 text-base font-semibold text-white">
            Built to run at scale
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glow/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-glow" />
          </span>
          Live
        </div>
      </div>

      {/* Grid + traveling spotlight */}
      <div
        className="relative grid flex-1 grid-cols-2 gap-3"
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-0 -translate-x-1/2 -translate-y-1/2"
          animate={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.8 }}
        >
          <motion.div
            className="h-[300px] w-[300px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(124,108,255,0.32), rgba(91,140,255,0.10) 45%, rgba(5,5,8,0) 70%)",
              filter: "blur(30px)",
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {features.map((f, i) => {
          const Icon = f.icon;
          const isActive = i === active;
          return (
            <motion.button
              key={f.title}
              type="button"
              onMouseEnter={() => {
                setActive(i);
                setPaused(true);
              }}
              onFocus={() => {
                setActive(i);
                setPaused(true);
              }}
              onBlur={() => setPaused(false)}
              className="group relative z-10 flex flex-col items-start overflow-hidden rounded-xl border p-4 text-left outline-none"
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.5,
                borderColor: isActive
                  ? "rgba(124,108,255,0.4)"
                  : "rgba(255,255,255,0.06)",
                backgroundColor: isActive
                  ? "rgba(124,108,255,0.06)"
                  : "rgba(255,255,255,0.02)",
                boxShadow: isActive
                  ? "0 12px 40px -18px rgba(124,108,255,0.65)"
                  : "0 0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* Thin bright top edge on the active card */}
              <motion.span
                aria-hidden
                className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />

              <div className="flex w-full items-center justify-between">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-500",
                    isActive
                      ? "border-brand/30 bg-brand/15 text-brand-soft"
                      : "border-white/5 bg-white/[0.03] text-zinc-500"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums transition-colors duration-500",
                    isActive ? "text-brand-soft" : "text-zinc-600"
                  )}
                >
                  {f.metric}
                </span>
              </div>

              <span
                className={cn(
                  "mt-auto pt-4 text-sm font-medium transition-colors duration-500",
                  isActive ? "text-white" : "text-zinc-400"
                )}
              >
                {f.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Crossfading caption */}
      <div className="mt-4 min-h-[56px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="text-sm leading-relaxed text-zinc-400"
          >
            <span className="font-medium text-white">{current.title}. </span>
            {current.caption}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Segmented progress */}
      <div className="mt-4 flex items-center gap-1.5">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/10"
          >
            {i === active && (
              <motion.span
                key={`${active}-${paused ? "p" : "r"}`}
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand to-glow"
                initial={{ width: paused ? "100%" : "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: paused ? 0 : interval / 1000,
                  ease: "linear",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="h-[400px] w-full max-w-md">
        <FeatureSpotlight />
      </div>
    </div>
  );
}
