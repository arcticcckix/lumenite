"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function SplitHero({
  eyebrow = "Research-grade",
  headline = "Precision peptides, built for the lab.",
  subhead = "Third-party tested, cold-chain shipped, and formulated for consistency batch after batch.",
  primaryCta = "Shop the line",
  secondaryCta = "View lab results",
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
  const rx = useSpring(useTransform(my, [-40, 40], [8, -8]), { stiffness: 150, damping: 20 });
  const ry = useSpring(useTransform(mx, [-40, 40], [-8, 8]), { stiffness: 150, damping: 20 });

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
        "grid h-full w-full grid-cols-2 items-center gap-6 rounded-2xl border border-line bg-panel px-8 py-6",
        className
      )}
    >
      <div>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-void px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-brand-soft"
        >
          <ShieldCheck className="h-3 w-3" />
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mt-3 text-3xl font-semibold leading-[1.1] text-white"
        >
          {headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400"
        >
          {subhead}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-5 flex items-center gap-3"
        >
          <button className="group flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand/90">
            {primaryCta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button className="rounded-full border border-line px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white">
            {secondaryCta}
          </button>
        </motion.div>
      </div>

      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 600 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative flex h-52 items-center justify-center"
      >
        <div className="absolute h-40 w-40 rounded-full bg-brand/30 blur-3xl" />
        <div className="relative flex h-36 w-20 flex-col items-center">
          <div className="h-5 w-8 rounded-t-sm bg-gradient-to-b from-zinc-200 to-zinc-400" />
          <div className="h-1.5 w-10 rounded-full bg-zinc-500" />
          <div className="relative h-28 w-20 flex-1 rounded-b-xl rounded-t-sm border border-white/20 bg-gradient-to-b from-brand/80 via-brand/50 to-brand-soft/70 shadow-[0_0_40px_rgba(91,140,255,0.4)]">
            <div className="absolute inset-x-1.5 top-3 h-10 rounded-sm bg-white/15 backdrop-blur-sm" />
            <div className="absolute inset-x-1.5 bottom-3 h-1 rounded-full bg-white/30" />
          </div>
        </div>
      </motion.div>
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
