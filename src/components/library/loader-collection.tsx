"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT = "#7c6cff";
const GLOW = "#5b8cff";

/* A smooth conic-gradient ring with a bright head dot. */
export function RingSpinner({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const stroke = Math.max(2, Math.round(size * 0.09));
  const inner = `calc(100% - ${stroke}px)`;
  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `${stroke}px solid rgba(255,255,255,0.06)` }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, transparent 8%, ${ACCENT} 78%, ${GLOW} 100%)`,
          WebkitMask: `radial-gradient(farthest-side, transparent ${inner}, #000 ${inner})`,
          mask: `radial-gradient(farthest-side, transparent ${inner}, #000 ${inner})`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
      >
        <span
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: stroke,
            height: stroke,
            background: GLOW,
            boxShadow: `0 0 ${stroke * 2}px ${GLOW}`,
          }}
        />
      </motion.div>
    </div>
  );
}

/* Three dots that bounce in a staggered wave. */
export function BouncingDots({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex h-10 items-center gap-1.5", className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full"
          style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}66` }}
          animate={{ y: [0, -7, 0], opacity: [0.45, 1, 0.45] }}
          transition={{
            duration: 0.7,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.13,
          }}
        />
      ))}
    </div>
  );
}

/* An equalizer of bars pulsing to fixed, deterministic peaks. */
export function SignalBars({ className }: { className?: string }) {
  const peaks = [0.5, 0.85, 0.6, 1, 0.7];
  return (
    <div
      className={cn("flex h-9 items-end gap-1", className)}
      role="status"
      aria-label="Loading"
    >
      {peaks.map((peak, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full"
          style={{
            height: "100%",
            transformOrigin: "bottom",
            background: `linear-gradient(to top, ${ACCENT}, ${GLOW})`,
          }}
          animate={{ scaleY: [0.28, peak, 0.28] }}
          transition={{
            duration: 0.95,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

/* A single dot orbiting a faint track around a center pip. */
export function OrbitingDot({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const dot = Math.max(6, Math.round(size * 0.18));
  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
      >
        <span
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: dot,
            height: dot,
            background: GLOW,
            boxShadow: `0 0 10px ${GLOW}, 0 0 4px ${GLOW}`,
          }}
        />
      </motion.div>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 3, height: 3, background: "rgba(255,255,255,0.28)" }}
      />
    </div>
  );
}

type LoaderCell = {
  label: string;
  node: React.ReactNode;
};

export function Loaders({ className }: { className?: string }) {
  const cells: LoaderCell[] = [
    { label: "Ring spinner", node: <RingSpinner size={40} /> },
    { label: "Bouncing dots", node: <BouncingDots /> },
    { label: "Signal bars", node: <SignalBars /> },
    { label: "Orbiting dot", node: <OrbitingDot size={40} /> },
  ];
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-panel/60 px-4 py-7"
        >
          <div className="flex h-11 items-center justify-center">{cell.node}</div>
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            {cell.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-3xl border border-line bg-panel/40 p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Loading states</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              Four restrained, brand-tinted loaders
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-line bg-white/[0.02] px-2.5 py-1">
            <Activity className="h-3 w-3" style={{ color: ACCENT }} />
            <span className="text-[11px] font-medium text-zinc-400">Live</span>
          </div>
        </div>
        <Loaders />
      </div>
    </div>
  );
}
