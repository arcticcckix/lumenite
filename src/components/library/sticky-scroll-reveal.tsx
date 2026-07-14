"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

interface Section {
  title: string;
  description: string;
  gradient: string;
}

const SECTIONS: Section[] = [
  {
    title: "Design",
    description: "Craft pixel-perfect interfaces with a token-driven system.",
    gradient: "linear-gradient(135deg,#7c6cff,#5b8cff)",
  },
  {
    title: "Build",
    description: "Compose accessible, animated components in minutes.",
    gradient: "linear-gradient(135deg,#5b8cff,#22d3ee)",
  },
  {
    title: "Ship",
    description: "Deploy confidently with a battle-tested component library.",
    gradient: "linear-gradient(135deg,#d946ef,#7c6cff)",
  },
];

export function StickyScrollReveal({
  container,
  className,
}: {
  container?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    container,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      SECTIONS.length - 1,
      Math.floor(v * SECTIONS.length)
    );
    setActive(idx);
  });

  return (
    <div ref={ref} className={cn("flex gap-8 px-6", className)}>
      <div className="sticky top-8 flex h-64 w-56 shrink-0 flex-col justify-center">
        <div
          className="h-40 w-full rounded-xl border border-line transition-all duration-500"
          style={{ background: SECTIONS[active].gradient }}
        />
        <p className="mt-4 text-xs text-zinc-500">
          Step {active + 1} of {SECTIONS.length}
        </p>
      </div>
      <div className="flex flex-col gap-24 py-8">
        {SECTIONS.map((s, i) => (
          <motion.div
            key={s.title}
            animate={{ opacity: active === i ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
            className="max-w-xs"
          >
            <h3 className="text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {s.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Demo() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto bg-void py-4"
    >
      <StickyScrollReveal container={containerRef} />
    </div>
  );
}
