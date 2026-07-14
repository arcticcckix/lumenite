"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { ShieldCheck, FlaskConical, Truck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
}

const DEFAULT_STATS: Stat[] = [
  { icon: FlaskConical, value: 99.4, suffix: "%", decimals: 1, label: "Purity, verified" },
  { icon: ShieldCheck, value: 100, suffix: "%", label: "Third-party tested" },
  { icon: Truck, value: 24, suffix: "hr", label: "Average dispatch" },
  { icon: Users, value: 12000, suffix: "+", label: "Researchers served" },
];

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, stat.value, {
      duration: 1.2,
      delay: index * 0.1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, stat.value, index]);

  const Icon = stat.icon;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand-soft shadow-[0_0_18px_rgba(91,140,255,0.35)]"
      >
        <Icon className="h-4 w-4" />
      </motion.div>
      <span className="text-xl font-semibold text-white">
        {display.toFixed(stat.decimals ?? 0)}
        {stat.suffix}
      </span>
      <span className="text-[11px] text-zinc-400">{stat.label}</span>
    </div>
  );
}

export function TrustStatsBar({ stats = DEFAULT_STATS, className }: { stats?: Stat[]; className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full max-w-2xl flex-wrap items-center justify-center gap-6 rounded-2xl border border-line bg-panel py-6",
        className
      )}
    >
      {stats.map((s, i) => (
        <StatItem key={s.label} stat={s} index={i} />
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <TrustStatsBar />
    </div>
  );
}
