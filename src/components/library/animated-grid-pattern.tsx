"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const seededRand = (i: number) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;

export function AnimatedGridPattern({
  className,
  cols = 14,
  rows = 8,
  litCount = 10,
}: {
  className?: string;
  cols?: number;
  rows?: number;
  litCount?: number;
}) {
  const cells = useMemo(() => {
    const total = cols * rows;
    return Array.from({ length: total }, (_, i) => ({
      id: i,
      x: i % cols,
      y: Math.floor(i / cols),
    }));
  }, [cols, rows]);

  const litCells = useMemo(() => {
    const total = cols * rows;
    const picks: { id: number; delay: number; duration: number }[] = [];
    for (let i = 0; i < litCount; i++) {
      const id = Math.floor(seededRand(i * 7 + 3) * total);
      picks.push({
        id,
        delay: seededRand(i * 13 + 1) * 4,
        duration: 2 + seededRand(i * 17 + 5) * 2.5,
      });
    }
    return picks;
  }, [cols, rows, litCount]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-void",
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 90%)",
        }}
      >
        <svg className="h-full w-full" preserveAspectRatio="none">
          {cells.map((c) => (
            <rect
              key={c.id}
              x={`${(c.x / cols) * 100}%`}
              y={`${(c.y / rows) * 100}%`}
              width={`${100 / cols}%`}
              height={`${100 / rows}%`}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}
          {litCells.map((lc, i) => {
            const c = cells[lc.id];
            if (!c) return null;
            return (
              <motion.rect
                key={`lit-${i}`}
                x={`${(c.x / cols) * 100}%`}
                y={`${(c.y / rows) * 100}%`}
                width={`${100 / cols}%`}
                height={`${100 / rows}%`}
                fill="rgba(124,108,255,0.5)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{
                  duration: lc.duration,
                  delay: lc.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </svg>
      </div>
      <div className="relative z-10 px-6 text-center">
        <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold text-transparent">
          Animated Grid Pattern
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
          A quiet lattice with cells that breathe light at random, like a
          server room at 3am.
        </p>
      </div>
    </div>
  );
}

export default function Demo() {
  return <AnimatedGridPattern />;
}
