"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* A single sweeping light band, used to shimmer a placeholder block. */
function Sweep({ delay }: { delay: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-[65%]"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.11) 50%, transparent 100%)",
      }}
      initial={{ x: "0%" }}
      animate={{ x: ["0%", "320%"] }}
      transition={{
        duration: 1.7,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 0.55,
        delay,
      }}
    />
  );
}

/* A placeholder block with base fill + shimmer sweep. */
function Bar({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white/[0.045]",
        className
      )}
    >
      <Sweep delay={delay} />
    </div>
  );
}

/* The loaded cover art: a calm gradient scene with a slow drifting highlight. */
function Cover() {
  return (
    <div className="relative h-36 w-full overflow-hidden rounded-xl ring-1 ring-white/10">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 130% at 8% 4%, rgba(124,108,255,0.55), transparent 52%)," +
            "radial-gradient(120% 130% at 96% 22%, rgba(91,140,255,0.5), transparent 55%)," +
            "radial-gradient(140% 140% at 62% 108%, rgba(169,157,255,0.32), transparent 60%)," +
            "linear-gradient(180deg, #0e0e18, #08080f)",
        }}
      />
      {/* faint grid, faded toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(120% 120% at 50% 40%, #000 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(120% 120% at 50% 40%, #000 20%, transparent 80%)",
        }}
      />
      {/* drifting soft orb keeps the loaded state alive at rest */}
      <motion.div
        className="absolute h-24 w-24 rounded-full blur-2xl"
        style={{ background: "rgba(124,108,255,0.5)", top: "18%", left: "24%" }}
        animate={{ x: [-10, 26, -10], y: [-8, 14, -8] }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      />
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2 py-[3px] text-[10px] font-medium uppercase tracking-[0.12em] text-white/70 backdrop-blur-sm">
        Case study
      </div>
      {/* thin bright top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    </div>
  );
}

export function SkeletonLoader({
  className,
  skeletonDuration = 2200,
  contentDuration = 3200,
  loop = true,
}: {
  className?: string;
  /** milliseconds the shimmering skeleton holds before revealing content */
  skeletonDuration?: number;
  /** milliseconds the loaded content holds before looping back */
  contentDuration?: number;
  loop?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loop) return;
    const t = window.setTimeout(
      () => setLoaded((v) => !v),
      loaded ? contentDuration : skeletonDuration
    );
    return () => window.clearTimeout(t);
  }, [loaded, loop, skeletonDuration, contentDuration]);

  return (
    <div
      className={cn(
        "relative w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-panel",
        className
      )}
      style={{
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.02), 0 24px 70px -28px rgba(124,108,255,0.28)",
      }}
    >
      {/* top loading bar, tied to the skeleton phase */}
      <div className="absolute inset-x-0 top-0 z-20 h-px bg-white/5">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-brand via-glow to-brand-soft"
          initial={false}
          animate={{ scaleX: loaded ? 1 : 0.02, opacity: loaded ? 0 : 1 }}
          transition={{
            scaleX: {
              duration: loaded ? 0 : skeletonDuration / 1000,
              ease: "easeInOut",
            },
            opacity: { duration: 0.4, ease: EASE },
          }}
          style={{ scaleX: 0.02 }}
        />
      </div>

      {/* Skeleton layer (in-flow, defines the card height) */}
      <motion.div
        aria-hidden
        className="pointer-events-none flex flex-col gap-4 p-5"
        animate={{ opacity: loaded ? 0 : 1, scale: loaded ? 0.985 : 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* header */}
        <div className="flex h-12 items-center gap-3">
          <Bar className="h-11 w-11 shrink-0 rounded-full" delay={0} />
          <div className="flex flex-col gap-2">
            <Bar className="h-3.5 w-28" delay={0.12} />
            <Bar className="h-3 w-16" delay={0.24} />
          </div>
        </div>
        {/* cover */}
        <Bar className="h-36 w-full rounded-xl" delay={0.18} />
        {/* title */}
        <Bar className="h-4 w-2/3" delay={0.3} />
        {/* body */}
        <div className="flex h-12 flex-col gap-2.5">
          <Bar className="h-3 w-full" delay={0.36} />
          <Bar className="h-3 w-5/6" delay={0.44} />
        </div>
        {/* footer */}
        <div className="flex h-9 items-center justify-between">
          <Bar className="h-9 w-28 rounded-lg" delay={0.5} />
          <Bar className="h-8 w-8 rounded-full" delay={0.58} />
        </div>
      </motion.div>

      {/* Content layer (absolute overlay, identical geometry) */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex flex-col gap-4 p-5"
        initial={false}
        animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.015 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* header */}
        <div className="flex h-12 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-glow text-sm font-semibold text-white ring-1 ring-white/15">
            AF
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-white">
                Aria Fontaine
              </span>
              <BadgeCheck className="h-4 w-4 text-brand-soft" />
            </div>
            <span className="text-xs text-zinc-500">Design systems lead</span>
          </div>
        </div>
        {/* cover */}
        <Cover />
        {/* title */}
        <h3 className="flex h-4 items-center text-[15px] font-semibold leading-none text-white">
          Northwind analytics rebuild
        </h3>
        {/* body */}
        <p className="h-12 overflow-hidden text-[13px] leading-[1.5] text-zinc-400">
          A ground-up refresh of the reporting suite with a faster charting
          engine and a calmer visual language across every dashboard.
        </p>
        {/* footer */}
        <div className="flex h-9 items-center justify-between">
          <div className="flex h-9 items-center gap-1.5 rounded-lg bg-brand/15 px-3 text-[13px] font-medium text-brand-soft ring-1 ring-brand/25">
            Open project
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Users className="h-3.5 w-3.5" />
            12
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <SkeletonLoader />
    </div>
  );
}
