"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { GripVertical, Radio, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function DraggableCard({
  children,
  className,
  constraintsRef,
  hint = "Drag me around",
}: {
  children: React.ReactNode;
  className?: string;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  hint?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [dragging, setDragging] = useState(false);
  const [thrown, setThrown] = useState(false);

  // Rotate toward the throw: a base tilt from horizontal offset plus a
  // sharper kick from horizontal velocity while flinging.
  const velX = useVelocity(x);
  const tiltFromX = useTransform(x, [-180, 180], [-14, 14], { clamp: true });
  const tiltFromVel = useTransform(velX, [-1600, 1600], [-16, 16], {
    clamp: true,
  });
  const rotate = useTransform<number, number>(
    [tiltFromX, tiltFromVel] as MotionValue<number>[],
    ([a, b]) => Math.round((a + b) * 100) / 100
  );

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.28}
      dragMomentum
      dragTransition={{
        power: 0.32,
        timeConstant: 220,
        bounceStiffness: 260,
        bounceDamping: 26,
      }}
      onDragStart={() => {
        setDragging(true);
        setThrown(true);
      }}
      onDragEnd={() => setDragging(false)}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.04 }}
      style={{ x, y, rotate }}
      className={cn(
        "relative z-10 cursor-grab touch-none active:cursor-grabbing",
        className
      )}
    >
      {/* Inner layer floats gently at rest so a static preview feels alive. */}
      <motion.div
        animate={
          dragging
            ? { y: 0, rotate: 0 }
            : { y: [0, -9, 0], rotate: [-1.1, 1.1, -1.1] }
        }
        transition={
          dragging
            ? { duration: 0.4, ease: EASE }
            : { duration: 6.5, ease: "easeInOut", repeat: Infinity }
        }
        className="relative"
      >
        <motion.div
          animate={{
            boxShadow: dragging
              ? "0 40px 90px -30px rgba(91,140,255,0.45), 0 0 0 1px rgba(255,255,255,0.08)"
              : "0 24px 60px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
          transition={{ duration: 0.35, ease: EASE }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-panel"
        >
          {/* Thin bright top edge */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          {/* Soft brand wash */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
            style={{ background: "rgba(124,108,255,0.18)" }}
          />
          {children}
        </motion.div>

        {/* Drag hint, fades once the card has been thrown */}
        <motion.div
          initial={false}
          animate={{ opacity: thrown ? 0 : 1, y: thrown ? 4 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="pointer-events-none absolute -bottom-9 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-surface/80 px-3 py-1 text-[11px] font-medium text-zinc-400 backdrop-blur"
        >
          <GripVertical className="h-3 w-3 text-zinc-500" />
          {hint}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Sparkline() {
  // Deterministic seeded points, rounded for hydration safety.
  const { line, area, dotX, dotY } = useMemo(() => {
    const w = 232;
    const h = 46;
    const n = 24;
    const seed = (i: number) => Math.abs(Math.sin(i * 12.9898 + 4.1)) % 1;
    const pts = Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1);
      const base = t * 0.7 + 0.15;
      const noise = (seed(i) - 0.5) * 0.28;
      const val = Math.min(0.95, Math.max(0.06, base + noise));
      return {
        x: Math.round(t * w * 100) / 100,
        y: Math.round((h - val * h) * 100) / 100,
      };
    });
    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const last = pts[pts.length - 1];
    return {
      line: d,
      area: `${d} L${w},${h} L0,${h} Z`,
      dotX: last.x,
      dotY: last.y,
    };
  }, []);

  return (
    <svg
      viewBox="0 0 232 46"
      className="h-[46px] w-full overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="dc-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c6cff" />
          <stop offset="100%" stopColor="#5b8cff" />
        </linearGradient>
        <linearGradient id="dc-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c6cff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#7c6cff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#dc-area)" />
      <path
        d={line}
        fill="none"
        stroke="url(#dc-stroke)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.circle
        cx={dotX}
        cy={dotY}
        r="3"
        fill="#a99dff"
        animate={{ opacity: [1, 0.35, 1], r: [3, 4.2, 3] }}
        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
      />
    </svg>
  );
}

export default function Demo() {
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={constraintsRef}
      className="relative h-full w-full overflow-hidden rounded-xl bg-void"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Ambient depth so the drag space reads as intentional at rest */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "rgba(124,108,255,0.10)" }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <DraggableCard constraintsRef={constraintsRef} className="w-[300px]">
          <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-medium tracking-wide text-zinc-300">
                Live signal
              </span>
            </div>
            <Radio className="h-4 w-4 text-zinc-500" />
          </div>

          <div className="mt-5 flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-tight text-white">
              +24.8%
            </span>
            <span className="mb-1 flex items-center gap-0.5 text-xs font-medium text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              7d
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Momentum across 1,204 sessions this week.
          </p>

          <div className="mt-4">
            <Sparkline />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span className="text-xs text-zinc-500">Weekly report</span>
            <span className="flex items-center gap-1 text-xs font-medium text-brand-soft">
              Open
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
          </div>
        </DraggableCard>
      </div>
    </div>
  );
}
