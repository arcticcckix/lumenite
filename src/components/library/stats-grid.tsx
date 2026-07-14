"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

function CountUp({
  value,
  prefix,
  suffix,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsGrid({
  stats,
  className,
}: {
  stats: StatItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4",
        className
      )}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
          className="flex flex-col items-center justify-center gap-2 bg-panel px-4 py-8 text-center"
        >
          <div className="text-3xl font-bold text-white">
            <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          </div>
          <div className="text-xs uppercase tracking-wide text-zinc-500">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const demoStats: StatItem[] = [
  { label: "Components", value: 128, suffix: "+" },
  { label: "Teams shipping", value: 2400, suffix: "+" },
  { label: "Avg. build time saved", value: 46, suffix: "%" },
  { label: "GitHub stars", value: 9800, suffix: "+" },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <StatsGrid stats={demoStats} className="max-w-3xl" />
    </div>
  );
}
