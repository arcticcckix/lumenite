"use client";

import { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  gap: number;
  rotate: number;
}

// White is weighted heaviest so the brand tints read as rare accents.
const DEFAULT_COLORS = ["#ffffff", "#ffffff", "#ffffff", "#a99dff", "#5b8cff"];

// Deterministic pseudo-random in [0, 1), no Math.random / Date.now at any scope.
function seeded(i: number): number {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

function StarShape({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="block"
    >
      <path
        d="M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z"
        fill={color}
      />
    </svg>
  );
}

export function SparklesText({
  children,
  className,
  count = 18,
  colors = DEFAULT_COLORS,
}: {
  children: React.ReactNode;
  className?: string;
  count?: number;
  colors?: string[];
}) {
  const uid = useId();

  const sparkles = useMemo<Sparkle[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      // Positions spill a little past the text box so stars sit around the letters.
      const x = Number((seeded(i * 4 + 1) * 116 - 8).toFixed(2)); // -8% .. 108%
      const y = Number((seeded(i * 4 + 2) * 132 - 16).toFixed(2)); // -16% .. 116%
      const size = Math.round(7 + seeded(i * 4 + 3) * 12); // 7px .. 19px
      const color =
        colors[Math.floor(seeded(i * 4 + 4) * colors.length) % colors.length];
      const delay = Number((seeded(i + 101) * 3.4).toFixed(2));
      const duration = Number((1.5 + seeded(i + 211) * 1.3).toFixed(2));
      const gap = Number((0.4 + seeded(i + 331) * 1.4).toFixed(2));
      const rotate = Math.round(seeded(i + 447) * 80 - 40);
      return { id: `${uid}-${i}`, x, y, size, color, delay, duration, gap, rotate };
    });
  }, [count, colors, uid]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-0 bg-gradient-to-b from-white via-white to-brand-soft bg-clip-text text-transparent">
        {children}
      </span>

      <span className="pointer-events-none absolute inset-0 z-10">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <motion.span
              className="block"
              style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.35))" }}
              initial={{ scale: 0, opacity: 0, rotate: s.rotate }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [s.rotate, s.rotate + 22],
              }}
              transition={{
                duration: s.duration,
                delay: s.delay,
                repeat: Infinity,
                repeatDelay: s.gap,
                ease: "easeInOut",
              }}
            >
              <StarShape size={s.size} color={s.color} />
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-line bg-void px-6 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-[34rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,108,255,0.16),transparent_70%)] blur-2xl" />

      <p className="relative z-10 mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
        Lumenite UI
      </p>

      <SparklesText className="relative z-10 text-5xl font-semibold tracking-tight sm:text-6xl">
        Make it sparkle
      </SparklesText>

      <p className="relative z-10 mt-6 max-w-sm text-sm leading-relaxed text-zinc-400">
        Motion primitives and micro-interactions for interfaces that feel
        considered, not generated.
      </p>
    </div>
  );
}
