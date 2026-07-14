"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

const ENTRIES: TimelineEntry[] = [
  {
    year: "2023",
    title: "Foundations",
    description: "Started building the design token system from scratch.",
  },
  {
    year: "2024",
    title: "Public beta",
    description: "Opened the component library to early adopters.",
  },
  {
    year: "2025",
    title: "v2 launch",
    description: "Rebuilt animations on Framer Motion 12 with springs.",
  },
  {
    year: "2026",
    title: "Ecosystem",
    description: "Grew into a full premium UI ecosystem for teams.",
  },
];

export function Timeline({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.5"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  const height = useTransform(scaleY, (v) => `${v * 100}%`);

  return (
    <div ref={ref} className={cn("relative px-6 py-4", className)}>
      <div className="absolute left-[34px] top-4 bottom-4 w-px bg-line" />
      <motion.div
        style={{ height }}
        className="absolute left-[34px] top-4 w-px bg-gradient-to-b from-brand to-glow"
      />
      <div className="flex flex-col gap-10">
        {ENTRIES.map((entry, i) => (
          <motion.div
            key={entry.year}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="relative flex gap-6 pl-2"
          >
            <div className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-brand-soft bg-void" />
            <div className="-mt-1">
              <span className="text-xs font-medium text-brand-soft">
                {entry.year}
              </span>
              <h4 className="mt-1 text-sm font-semibold text-white">
                {entry.title}
              </h4>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-zinc-400">
                {entry.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="h-full w-full overflow-y-auto bg-void">
      <Timeline />
    </div>
  );
}
