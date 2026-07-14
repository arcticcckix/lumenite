"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type TooltipPerson = {
  id: string;
  name: string;
  role: string;
  initials: string;
  /** [from, to] used for the avatar gradient + tooltip accent dot. */
  gradient: [string, string];
};

const SPRING = { stiffness: 280, damping: 20, mass: 0.6 } as const;

/** Deterministic 0..1 hash from an index, avoids Math.random hydration drift. */
function seed(i: number): number {
  return Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
}

function Avatar({ person, index }: { person: TooltipPerson; index: number }) {
  const [hovered, setHovered] = useState(false);

  // Cursor position across the avatar (-0.5 … 0.5), drives the tilt.
  const px = useMotionValue(0);
  const rotate = useSpring(useTransform(px, [-0.5, 0.5], [-16, 16]), SPRING);
  const nudgeX = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), SPRING);

  function onMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
  }

  // Idle bob so the row reads as alive/interactive even in a static preview.
  const bobDelay = Math.round(seed(index) * 1600) / 1000;
  const bobDur = 2.8 + Math.round(seed(index + 7) * 900) / 1000;

  const [from, to] = person.gradient;

  return (
    <div
      className="relative"
      style={{ zIndex: hovered ? 40 : 10 - index }}
    >
      {/* Tooltip, centered above the avatar; wrapper is centered without a
          transform so the inner motion element owns rotate/x cleanly. */}
      <div className="pointer-events-none absolute bottom-full left-1/2 flex -translate-x-1/2 justify-center pb-3.5">
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              style={{ rotate, x: nudgeX, transformOrigin: "bottom center" }}
              className="relative w-max origin-bottom rounded-2xl border border-white/10 bg-panel/95 px-4 py-2.5 shadow-2xl shadow-black/60 backdrop-blur-md"
            >
              {/* accent hairline */}
              <span
                className="pointer-events-none absolute inset-x-4 -top-px h-px rounded-full opacity-70"
                style={{
                  backgroundImage: `linear-gradient(90deg, transparent, ${from}, ${to}, transparent)`,
                }}
              />
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 flex-none rounded-full"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
                    boxShadow: `0 0 10px ${to}`,
                  }}
                />
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-white">
                    {person.name}
                  </div>
                  <div className="text-xs text-zinc-400">{person.role}</div>
                </div>
              </div>
              {/* notch */}
              <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[3px] border-b border-r border-white/10 bg-panel/95" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        type="button"
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          px.set(0);
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: bobDur,
          repeat: Infinity,
          ease: "easeInOut",
          delay: bobDelay,
        }}
        whileHover={{ scale: 1.14 }}
        whileTap={{ scale: 1.05 }}
        className="relative block cursor-pointer rounded-full outline-none"
        aria-label={`${person.name}, ${person.role}`}
      >
        {/* soft glow that blooms on hover */}
        <span
          className="pointer-events-none absolute -inset-1 rounded-full blur-md transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
            opacity: hovered ? 0.55 : 0,
          }}
        />
        <span
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold text-white ring-2 ring-void"
          style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
        >
          {/* inner sheen */}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent opacity-60" />
          <span className="relative tracking-wide">{person.initials}</span>
        </span>
      </motion.button>
    </div>
  );
}

export function AnimatedTooltip({
  people,
  className,
  extraCount,
}: {
  people: TooltipPerson[];
  className?: string;
  /** Optional trailing "+N" chip, e.g. for a larger roster. */
  extraCount?: number;
}) {
  return (
    <div className={cn("flex items-end -space-x-3.5", className)}>
      {people.map((person, i) => (
        <Avatar key={person.id} person={person} index={i} />
      ))}
      {typeof extraCount === "number" && extraCount > 0 && (
        <div className="relative" style={{ zIndex: 1 }}>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-xs font-semibold text-zinc-300 ring-2 ring-void">
            +{extraCount}
          </span>
        </div>
      )}
    </div>
  );
}

const TEAM: TooltipPerson[] = [
  {
    id: "ava",
    name: "Ava Chen",
    role: "Staff Design Engineer",
    initials: "AC",
    gradient: ["#7c6cff", "#5b8cff"],
  },
  {
    id: "marcus",
    name: "Marcus Reyes",
    role: "Head of Growth",
    initials: "MR",
    gradient: ["#ff6b9d", "#ff9f6b"],
  },
  {
    id: "priya",
    name: "Priya Nair",
    role: "Principal ML Researcher",
    initials: "PN",
    gradient: ["#4fd1c5", "#5b8cff"],
  },
  {
    id: "leo",
    name: "Leo Fontaine",
    role: "Founding Engineer",
    initials: "LF",
    gradient: ["#a78bfa", "#7c6cff"],
  },
  {
    id: "sofia",
    name: "Sofia Almeida",
    role: "Product Lead",
    initials: "SA",
    gradient: ["#f6c453", "#ff8a5b"],
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-soft">
          The people behind it
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">
          Built by a small, obsessive team
        </h3>
      </div>

      <AnimatedTooltip people={TEAM} extraCount={12} />

      <p className="text-sm text-zinc-500">
        Hover a face to meet them.
      </p>
    </div>
  );
}
