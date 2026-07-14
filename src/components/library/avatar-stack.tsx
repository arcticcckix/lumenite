"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type StackPerson = {
  id: string;
  name: string;
  role: string;
  initials: string;
  /** [from, to] used for the avatar gradient + label accent. */
  gradient: [string, string];
};

const SPREAD_SPRING = { type: "spring", stiffness: 340, damping: 30, mass: 0.7 } as const;
const LABEL_SPRING = { type: "spring", stiffness: 380, damping: 26 } as const;

/** Deterministic 0..1 hash from an index, avoids Math.random hydration drift. */
function seed(i: number): number {
  return Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
}

function Face({
  person,
  index,
  total,
  size,
  spread,
  expanded,
  active,
  onActivate,
  onRelease,
}: {
  person: StackPerson;
  index: number;
  total: number;
  size: number;
  /** Extra horizontal travel, in px, applied when the stack expands. */
  spread: number;
  expanded: boolean;
  active: boolean;
  onActivate: () => void;
  onRelease: () => void;
}) {
  // Symmetric fan: items left of centre slide left, right of centre slide right,
  // so the group stays optically centred while it opens up.
  const mid = (total - 1) / 2;
  const spreadX = expanded ? Math.round((index - mid) * spread) : 0;

  // Staggered idle breathing so a static preview reads as alive/interactive.
  const bobDelay = Math.round(seed(index) * 1400) / 1000;
  const bobDur = 2.7 + Math.round(seed(index + 5) * 900) / 1000;

  const [from, to] = person.gradient;
  const font = Math.round(size * 0.3);

  return (
    <motion.div
      className="relative shrink-0"
      style={{
        marginLeft: index === 0 ? 0 : Math.round(size * -0.36),
        zIndex: active ? 50 : total - index,
      }}
      animate={
        expanded
          ? { x: spreadX, y: active ? -14 : -9, transition: SPREAD_SPRING }
          : {
              x: 0,
              y: [0, -5, 0],
              transition: {
                x: SPREAD_SPRING,
                y: {
                  duration: bobDur,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bobDelay,
                },
              },
            }
      }
    >
      {/* Name label, centred above the avatar. */}
      <div className="pointer-events-none absolute bottom-full left-1/2 flex -translate-x-1/2 justify-center pb-3">
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.92 }}
              transition={LABEL_SPRING}
              className="relative w-max origin-bottom rounded-xl border border-white/10 bg-panel/95 px-3 py-1.5 shadow-xl shadow-black/60 backdrop-blur-md"
            >
              <span
                className="pointer-events-none absolute inset-x-3 -top-px h-px rounded-full opacity-70"
                style={{ backgroundImage: `linear-gradient(90deg, transparent, ${from}, ${to}, transparent)` }}
              />
              <div className="whitespace-nowrap text-[13px] font-semibold leading-tight text-white">
                {person.name}
              </div>
              <div className="whitespace-nowrap text-[11px] leading-tight text-zinc-400">
                {person.role}
              </div>
              <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[2px] border-b border-r border-white/10 bg-panel/95" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        type="button"
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onBlur={onRelease}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        className="relative block cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
        style={{ width: size, height: size }}
        aria-label={`${person.name}, ${person.role}`}
      >
        {/* soft bloom on the active face */}
        <span
          className="pointer-events-none absolute -inset-1 rounded-full blur-md transition-opacity duration-300"
          style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})`, opacity: active ? 0.5 : 0 }}
        />
        <span
          className="relative flex h-full w-full items-center justify-center rounded-full font-semibold text-white ring-2 ring-[#0b0b12]"
          style={{ backgroundImage: `linear-gradient(140deg, ${from}, ${to})`, fontSize: font }}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent opacity-60" />
          <span className="relative tracking-wide">{person.initials}</span>
        </span>
      </motion.button>
    </motion.div>
  );
}

export function AvatarStack({
  people,
  overflowCount = 0,
  size = 56,
  className,
}: {
  people: StackPerson[];
  /** Trailing "+N" chip for the rest of the roster. */
  overflowCount?: number;
  /** Avatar diameter in px. */
  size?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const hasOverflow = overflowCount > 0;
  const total = people.length + (hasOverflow ? 1 : 0);
  const spread = Math.round(size * 0.5);
  const chipMid = (total - 1) / 2;
  const chipX = expanded ? Math.round((people.length - chipMid) * spread) : 0;

  return (
    <div
      className={cn("flex items-end", className)}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        setActiveId(null);
      }}
    >
      {people.map((person, i) => (
        <Face
          key={person.id}
          person={person}
          index={i}
          total={total}
          size={size}
          spread={spread}
          expanded={expanded}
          active={activeId === person.id}
          onActivate={() => setActiveId(person.id)}
          onRelease={() => setActiveId((cur) => (cur === person.id ? null : cur))}
        />
      ))}

      {hasOverflow && (
        <motion.div
          className="relative shrink-0"
          style={{ marginLeft: Math.round(size * -0.36), zIndex: 0 }}
          animate={
            expanded
              ? { x: chipX, y: -9, transition: SPREAD_SPRING }
              : { x: 0, y: 0, transition: SPREAD_SPRING }
          }
        >
          <span
            className="flex items-center justify-center rounded-full bg-surface font-semibold text-zinc-300 ring-2 ring-[#0b0b12]"
            style={{ width: size, height: size, fontSize: Math.round(size * 0.26) }}
          >
            +{overflowCount}
          </span>
        </motion.div>
      )}
    </div>
  );
}

const TEAM: StackPerson[] = [
  { id: "ava", name: "Ava Chen", role: "Design Engineer", initials: "AC", gradient: ["#7c6cff", "#5b8cff"] },
  { id: "marcus", name: "Marcus Ito", role: "Infra Lead", initials: "MI", gradient: ["#22d3ee", "#6366f1"] },
  { id: "priya", name: "Priya Nair", role: "Staff Product", initials: "PN", gradient: ["#f472b6", "#a855f7"] },
  { id: "leo", name: "Leo Fontaine", role: "Founding Engineer", initials: "LF", gradient: ["#34d399", "#22d3ee"] },
  { id: "sofia", name: "Sofia Almeida", role: "Growth", initials: "SA", gradient: ["#fbbf24", "#f97316"] },
];

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-void p-6">
      {/* restrained brand wash, kept low so the accent stays sparing */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,108,255,0.16), transparent 68%)" }}
      />

      <div className="relative flex flex-col items-center gap-9 rounded-3xl border border-line bg-panel/70 px-10 py-11 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-brand-soft">
            Loved by builders
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            The team you would want on speed dial
          </h3>
        </div>

        <AvatarStack people={TEAM} overflowCount={12} />

        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="font-medium text-white">Trusted by 2,000+ teams</span>
          <span className="text-line">/</span>
          <span className="inline-flex items-center gap-1 text-zinc-500">
            See the wall
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
