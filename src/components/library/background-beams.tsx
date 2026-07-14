"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const seededRand = (i: number) => Math.abs(Math.sin(i * 999.123));

function usePaths(count: number) {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const yStart = 40 + seededRand(i) * 400;
      const yEnd = 40 + seededRand(i + 50) * 400;
      return {
        d: `M-100 ${yStart} C 150 ${yStart - 80}, 250 ${yEnd + 80}, 700 ${yEnd}`,
        duration: 6 + seededRand(i + 100) * 6,
        delay: seededRand(i + 200) * 4,
      };
    });
  }, [count]);
}

export function BackgroundBeams({ className }: { className?: string }) {
  const paths = usePaths(12);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-line bg-void",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 600 480"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c6cff" stopOpacity="0" />
            <stop offset="50%" stopColor="#5b8cff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c6cff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            stroke="url(#beam-gradient)"
            strokeWidth={1}
            fill="none"
            opacity={0.4}
          />
        ))}
        {paths.slice(0, 6).map((p, i) => (
          <motion.path
            key={`glow-${i}`}
            d={p.d}
            stroke="#5b8cff"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative h-full w-full">
      <BackgroundBeams />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
        <h3 className="text-2xl font-semibold text-white">Background Beams</h3>
        <p className="max-w-xs text-sm text-zinc-400">
          Curved light beams tracing paths through the dark.
        </p>
      </div>
    </div>
  );
}
