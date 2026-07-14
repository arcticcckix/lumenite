"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/* Deterministic 0..1 hash, no Math.random / Date.now at module or render scope. */
function seed(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* Round any float before it touches a DOM style/attr to avoid hydration drift. */
function r(n: number): number {
  return Math.round(n * 1000) / 1000;
}

const FLASH_COLORS = [
  "rgba(124, 108, 255, 0.55)", // brand
  "rgba(91, 140, 255, 0.50)", // glow
  "rgba(169, 157, 255, 0.42)", // brand-soft
];

type BackgroundBoxesProps = {
  className?: string;
  children?: React.ReactNode;
  /** Number of grid rows rendered (the grid bleeds past the frame; the mask fades edges). */
  rows?: number;
  /** Number of grid columns rendered. */
  cols?: number;
  /** Edge length of each square cell, in px. */
  cellSize?: number;
  /** How many seeded cells softly shimmer on their own so it looks alive at rest. */
  idleSparks?: number;
};

/**
 * A large, cursor-reactive grid backdrop. Cells flash a brand-tinted glow as the
 * pointer sweeps across them and fade back out on a slow trail; a set of seeded
 * cells shimmers continuously so a static preview still feels alive. Radially
 * masked so it dissolves toward the edges. Overlay a headline via `children`.
 */
export function BackgroundBoxes({
  className,
  children,
  rows = 10,
  cols = 16,
  cellSize = 56,
  idleSparks = 13,
}: BackgroundBoxesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const [tracking, setTracking] = useState(false);

  const width = cols * cellSize;
  const height = rows * cellSize;

  const cells = useMemo(
    () =>
      Array.from({ length: rows * cols }, (_, i) => ({
        key: i,
        flash: FLASH_COLORS[Math.floor(seed(i * 1.37 + 4.2) * FLASH_COLORS.length)],
      })),
    [rows, cols]
  );

  const sparks = useMemo(
    () =>
      Array.from({ length: idleSparks }, (_, i) => {
        const col = Math.floor(seed(i * 2.11 + 1.3) * cols);
        const row = Math.floor(seed(i * 3.07 + 5.9) * rows);
        return {
          key: i,
          left: r(col * cellSize),
          top: r(row * cellSize),
          duration: r(3.4 + seed(i * 1.9 + 0.5) * 3.6),
          delay: r(seed(i * 4.4 + 2.7) * 5),
          color: FLASH_COLORS[Math.floor(seed(i * 5.3 + 8.1) * FLASH_COLORS.length)],
        };
      }),
    [idleSparks, rows, cols, cellSize]
  );

  const spotlight = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(124, 108, 255, 0.16), transparent 72%)`;

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setTracking(true)}
      onMouseLeave={() => {
        setTracking(false);
        mouseX.set(-1000);
        mouseY.set(-1000);
      }}
      className={cn(
        "relative isolate h-full w-full overflow-hidden bg-void",
        className
      )}
    >
      {/* Ambient drifting glows, the "alive at rest" base layer. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,108,255,0.22), transparent 70%)" }}
        animate={{ x: [0, 60, 0], y: [-40, 30, -40], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-1/3 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(91,140,255,0.18), transparent 70%)" }}
        animate={{ x: [0, -50, 0], y: [30, -20, 30], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Grid + shimmer, radially masked so the boundary dissolves. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{
          width,
          height,
          transform: "translate(-50%, -50%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 62% 62% at 50% 50%, #000 30%, transparent 78%)",
          maskImage:
            "radial-gradient(ellipse 62% 62% at 50% 50%, #000 30%, transparent 78%)",
        }}
      >
        {/* Interactive cells, flash on hover, slow trail on exit. */}
        <div
          className="pointer-events-auto grid h-full w-full border-l border-t border-white/[0.05]"
          style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}
        >
          {cells.map((cell) => (
            <motion.div
              key={cell.key}
              className="border-b border-r border-white/[0.05]"
              style={{ height: cellSize }}
              initial={false}
              whileHover={{
                backgroundColor: cell.flash,
                transition: { duration: 0 },
              }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>

        {/* Seeded idle shimmer so a static preview still looks premium. */}
        {sparks.map((s) => (
          <motion.div
            key={s.key}
            className="pointer-events-none absolute rounded-[3px]"
            style={{
              left: s.left,
              top: s.top,
              width: cellSize,
              height: cellSize,
              backgroundColor: s.color,
              boxShadow: `0 0 24px ${s.color}`,
            }}
            animate={{ opacity: [0, 0.85, 0], scale: [0.7, 1, 0.7] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Cursor-following soft spotlight over the grid. */}
        <motion.div
          className="absolute inset-0"
          style={{ background: spotlight, opacity: tracking ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Depth vignette so overlaid content stays legible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 40%, rgba(5,5,8,0.75) 100%)",
        }}
      />

      {/* Overlaid content. */}
      {children ? (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default function Demo() {
  return (
    <BackgroundBoxes className="rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none flex max-w-md flex-col items-center px-6 text-center"
      >
        <span className="pointer-events-auto mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-brand-soft backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Interactive backdrop
        </span>

        <h2 className="bg-gradient-to-b from-white to-white/55 bg-clip-text text-3xl font-semibold leading-tight tracking-tight text-transparent sm:text-4xl">
          Interfaces that light
          <br />
          up when you do
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          Sweep your cursor across the grid, every cell it touches flashes and
          fades on a trail. A living backdrop for heroes, docs, and dashboards.
        </p>

        <button
          type="button"
          className="pointer-events-auto group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-void transition-transform duration-300 ease-out hover:scale-[1.03]"
        >
          Get the component
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </motion.div>
    </BackgroundBoxes>
  );
}
