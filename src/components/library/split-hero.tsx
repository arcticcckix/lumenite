"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function SplitHero({
  eyebrow = "New",
  headline = "Ship interfaces people remember.",
  subhead = "A component system that turns a plain page into something considered. Copy, paste, and launch in an afternoon.",
  primaryCta = "Get started",
  secondaryCta = "See components",
  className,
}: {
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  primaryCta?: string;
  secondaryCta?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-60, 60], [10, -10]), {
    stiffness: 150,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-60, 60], [-12, 12]), {
    stiffness: 150,
    damping: 18,
  });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className={cn(
        "relative grid h-full w-full grid-cols-1 items-center gap-6 overflow-hidden rounded-2xl border border-line bg-panel px-8 py-6 sm:grid-cols-[1.1fr_1fr]",
        className
      )}
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute -right-10 top-0 h-64 w-64 rounded-full bg-brand/20 blur-[90px]" />

      {/* left: copy */}
      <div className="relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-void px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-brand-soft"
        >
          <Sparkles className="h-3 w-3" />
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 text-3xl font-semibold leading-[1.08] tracking-tight text-white"
        >
          {headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400"
        >
          {subhead}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex items-center gap-3"
        >
          <button className="group flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200">
            {primaryCta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button className="rounded-full border border-line px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white">
            {secondaryCta}
          </button>
        </motion.div>
      </div>

      {/* right: floating product card with mouse-tilt */}
      <div className="relative z-10 hidden h-full items-center justify-center [perspective:1000px] sm:flex">
        <motion.div
          style={{ rotateX: rx, rotateY: ry }}
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[240px] rounded-2xl border border-white/10 bg-gradient-to-b from-surface to-void p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
        >
          {/* header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-brand to-glow" />
              <div className="h-2 w-16 rounded-full bg-white/15" />
            </div>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
            </div>
          </div>

          {/* stat */}
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-lg font-semibold tracking-tight text-white">
                $128,420
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-emerald-400">
                <TrendingUp className="h-3 w-3" /> +18.2%
              </div>
            </div>
          </div>

          {/* mini bar chart */}
          <div className="mt-4 flex h-16 items-end gap-1.5">
            {[38, 55, 42, 70, 60, 88, 74].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex-1 rounded-t bg-gradient-to-t from-brand/40 to-brand-soft"
              />
            ))}
          </div>

          {/* rows */}
          <div className="mt-4 space-y-2">
            {[70, 45].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-white/10" />
                <span
                  className="h-1.5 rounded-full bg-white/12"
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="h-full w-full bg-[#050508] p-4">
      <SplitHero className="h-full" />
    </div>
  );
}
