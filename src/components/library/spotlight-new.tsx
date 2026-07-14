"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MoveUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type BeamConfig = {
  side: "left" | "right";
  color: string;
  core: string;
  rotate: number;
  delay: number;
};

const BEAMS: BeamConfig[] = [
  {
    side: "left",
    color: "rgba(124, 108, 255, 0.34)",
    core: "rgba(169, 157, 255, 0.55)",
    rotate: 24,
    delay: 0,
  },
  {
    side: "right",
    color: "rgba(91, 140, 255, 0.30)",
    core: "rgba(147, 190, 255, 0.5)",
    rotate: -24,
    delay: 1.6,
  },
];

function Beam({ side, color, core, rotate, delay }: BeamConfig) {
  const isLeft = side === "left";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 h-[170%] w-[48%]"
      style={{
        [isLeft ? "left" : "right"]: "-14%",
        transformOrigin: "top center",
        transform: `rotate(${isLeft ? rotate : -Math.abs(rotate)}deg)`,
      }}
    >
      {/* soft ambient halo of the beam */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${color} 0%, ${color.replace(
            /[\d.]+\)$/,
            "0.08)"
          )} 42%, transparent 74%)`,
          filter: "blur(58px)",
        }}
        animate={{ opacity: [0.45, 0.9, 0.45], scaleX: [1, 1.16, 1] }}
        transition={{
          duration: 9,
          delay,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      {/* bright inner core */}
      <motion.div
        className="absolute inset-x-[34%] top-0 bottom-[18%]"
        style={{
          background: `linear-gradient(to bottom, ${core} 0%, transparent 68%)`,
          filter: "blur(26px)",
        }}
        animate={{ opacity: [0.55, 1, 0.55], scaleX: [0.9, 1.05, 0.9] }}
        transition={{
          duration: 9,
          delay,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
}

export function SpotlightNew({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  // Deterministic, seeded dust motes so a static preview still feels alive.
  const motes = useMemo(() => {
    const seeded = (i: number, n: number) => Math.abs(Math.sin((i + 1) * n));
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: Math.round(seeded(i, 12.9898) * 96) + 2,
      top: Math.round(seeded(i, 78.233) * 62) + 4,
      size: Math.round((1 + seeded(i, 3.17) * 2) * 10) / 10,
      drift: Math.round(6 + seeded(i, 5.41) * 14),
      delay: Math.round(seeded(i, 9.7) * 60) / 10,
      duration: Math.round(7 + seeded(i, 2.13) * 6),
      opacity: Math.round((0.18 + seeded(i, 4.02) * 0.42) * 100) / 100,
    }));
  }, []);

  return (
    <div
      className={cn(
        "relative isolate h-full w-full overflow-hidden bg-void",
        className
      )}
    >
      {/* fine grid, faded toward the center top like a real hero backdrop */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage:
            "radial-gradient(ellipse 78% 62% at 50% 0%, black 32%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 78% 62% at 50% 0%, black 32%, transparent 82%)",
        }}
      />

      {/* the two sweeping beams */}
      {BEAMS.map((b) => (
        <Beam key={b.side} {...b} />
      ))}

      {/* warm bloom where the beams cross near the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[70%] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,108,255,0.22), transparent 68%)",
          filter: "blur(24px)",
        }}
      />

      {/* drifting dust motes */}
      {motes.map((m) => (
        <motion.span
          key={m.id}
          aria-hidden
          className="absolute rounded-full bg-white"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
          }}
          animate={{
            y: [0, m.drift, 0],
            opacity: [0, m.opacity, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}

      {/* bottom fade so the scene melts into the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to top, var(--color-void), transparent)",
        }}
      />

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

export default function Demo() {
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: EASE },
    },
  };

  return (
    <SpotlightNew>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-8 text-center"
      >
        <motion.div
          variants={item}
          className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400"
        >
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-brand-soft/70" />
          Hero spotlight
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-brand-soft/70" />
        </motion.div>

        <motion.h1
          variants={item}
          className="bg-gradient-to-b from-white via-white to-white/35 bg-clip-text text-4xl font-semibold leading-[1.05] tracking-tight text-transparent sm:text-5xl"
        >
          Light that moves the way
          <br />
          <span className="bg-gradient-to-r from-brand-soft via-glow to-brand-soft bg-clip-text text-transparent">
            attention
          </span>{" "}
          does
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-400"
        >
          Two wide beams drift across a fine grid, breathing on a slow loop. A
          clean, oversized backdrop for launches and landing heroes.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            type="button"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-void transition-transform duration-300 hover:-translate-y-0.5"
          >
            Start building
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-200 backdrop-blur-sm transition-colors duration-300 hover:border-white/25 hover:text-white"
          >
            View components
            <MoveUpRight className="h-3.5 w-3.5 text-zinc-400" />
          </button>
        </motion.div>
      </motion.div>
    </SpotlightNew>
  );
}
