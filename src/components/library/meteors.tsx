"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const seeded = (i: number) => Math.abs(Math.sin(i * 78.233));

export function Meteors({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) {
  const meteors = useMemo(
    () =>
      Array.from({ length: number }, (_, i) => ({
        left: seeded(i) * 100,
        delay: seeded(i + 50) * 6,
        duration: 2 + seeded(i + 100) * 2.5,
      })),
    [number]
  );

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {meteors.map((m, i) => (
        <motion.span
          key={i}
          className="absolute top-0 h-0.5 w-0.5 rounded-full bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
          style={{
            left: `${m.left}%`,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
          }}
          initial={{ x: 0, y: -20, opacity: 0 }}
          animate={{ x: 200, y: 300, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "linear",
          }}
        >
          <span className="absolute right-0 top-1/2 h-px w-16 -translate-y-1/2 bg-gradient-to-r from-white/80 to-transparent" />
        </motion.span>
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-void">
      <Meteors number={24} />
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold text-transparent">
          Meteors
        </h3>
        <p className="max-w-xs text-sm text-zinc-400">
          A quiet shower of diagonal streaks falling across the card.
        </p>
      </div>
    </div>
  );
}
