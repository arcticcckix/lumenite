"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  tag?: "new" | "improved" | "fixed";
}

const TAG_STYLES: Record<NonNullable<ChangelogEntry["tag"]>, string> = {
  new: "bg-brand/15 text-brand-soft border-brand/30",
  improved: "bg-glow/15 text-glow border-glow/30",
  fixed: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
};

function Entry({ entry, index }: { entry: ChangelogEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className="relative pb-8 pl-8 last:pb-0"
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
    >
      <span className="absolute left-0 top-0 h-full w-px bg-line" />
      <motion.span
        className="absolute left-0 top-0 w-px bg-gradient-to-b from-brand to-glow"
        initial={{ height: "0%" }}
        animate={inView ? { height: "100%" } : { height: "0%" }}
        transition={{ duration: 0.6, delay: index * 0.05 + 0.1, ease: "easeOut" }}
      />
      <span className="absolute -left-[5px] top-1 h-[11px] w-[11px] rounded-full border-2 border-void bg-brand" />

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-mono text-zinc-400">
          {entry.version}
        </span>
        {entry.tag && (
          <span
            className={cn(
              "rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              TAG_STYLES[entry.tag]
            )}
          >
            {entry.tag}
          </span>
        )}
        <span className="text-xs text-zinc-500">{entry.date}</span>
      </div>
      <h4 className="mt-2 text-sm font-semibold text-white">{entry.title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">
        {entry.description}
      </p>
    </motion.div>
  );
}

export function ChangelogFeed({
  entries,
  className,
}: {
  entries: ChangelogEntry[];
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {entries.map((entry, i) => (
        <Entry key={entry.version} entry={entry} index={i} />
      ))}
    </div>
  );
}

const DEMO: ChangelogEntry[] = [
  {
    version: "v2.4.0",
    date: "Jul 12, 2026",
    title: "Magnetic buttons & grain textures",
    description: "New CTA primitives with physics-based magnetic hover.",
    tag: "new",
  },
  {
    version: "v2.3.1",
    date: "Jul 3, 2026",
    title: "Faster spotlight rendering",
    description: "Reduced repaint cost on hover-tracked gradients by 40%.",
    tag: "improved",
  },
  {
    version: "v2.3.0",
    date: "Jun 22, 2026",
    title: "Fixed marquee jitter on Safari",
    description: "Resolved a sub-pixel rounding issue in looped marquees.",
    tag: "fixed",
  },
];

export default function Demo() {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#050508] p-8">
      <ChangelogFeed className="max-w-md" entries={DEMO} />
    </div>
  );
}
