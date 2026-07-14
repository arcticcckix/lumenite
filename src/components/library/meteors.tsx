"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const seeded = (i: number, s = 1) => Math.abs(Math.sin(i * 78.233 * s + s * 1.7));

export function Meteors({
  number = 22,
  className,
}: {
  number?: number;
  className?: string;
}) {
  // All meteors fall along the same diagonal (down-right). The streak is
  // rotated to that angle so the glowing head leads and the tail trails behind.
  const angleDeg = 55;
  const rad = (angleDeg * Math.PI) / 180;

  const meteors = useMemo(
    () =>
      Array.from({ length: number }, (_, i) => {
        const dist = 480 + seeded(i, 0.7) * 380;
        // round anything rendered into DOM style so SSR and client match
        const r = (n: number) => Math.round(n * 1000) / 1000;
        return {
          left: r(-10 + seeded(i, 1.7) * 115),
          top: r(-20 + seeded(i, 2.3) * 55),
          delay: seeded(i, 3.1) * 6,
          duration: 2.2 + seeded(i, 1.3) * 2.4,
          repeatGap: 1.5 + seeded(i, 4.4) * 3.5,
          tail: 55 + Math.round(seeded(i, 2.9) * 70),
          dx: r(Math.cos(rad) * dist),
          dy: r(Math.sin(rad) * dist),
        };
      }),
    [number, rad]
  );

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {meteors.map((m, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.tail,
            rotate: `${angleDeg}deg`,
            background:
              "linear-gradient(to left, #ffffff, rgba(169,157,255,0.5) 35%, transparent)",
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [0, m.dx],
            y: [0, m.dy],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            repeatDelay: m.repeatGap,
            ease: "linear",
          }}
        >
          {/* glowing head at the leading (right) end */}
          <span className="absolute right-0 top-1/2 h-[3px] w-[3px] -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_2px_rgba(169,157,255,0.9)]" />
        </motion.div>
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-void">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(124,108,255,0.14),transparent_60%)]" />
      <Meteors number={24} />
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold text-transparent">
          Meteor shower
        </h3>
        <p className="max-w-xs text-sm text-zinc-400">
          Streaks of light fall across the night, each with a glowing head and a
          tapering tail.
        </p>
      </div>
    </div>
  );
}
