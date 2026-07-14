"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GridBeamBackground({
  children,
  className,
  cell = 40,
}: {
  children?: React.ReactNode;
  className?: string;
  cell?: number;
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-line bg-void",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: `${cell}px ${cell}px`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 40%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 50% 40%, black 40%, transparent 90%)",
        }}
      >
        <motion.div
          className="absolute h-24 w-24 rounded-full bg-brand/40 blur-2xl"
          animate={{
            x: ["-10%", "110%", "110%", "-10%"],
            y: ["10%", "10%", "80%", "80%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.25, 0.5, 0.75],
          }}
        />
        <motion.div
          className="absolute h-16 w-16 rounded-full bg-glow/50 blur-2xl"
          animate={{
            x: ["110%", "110%", "-10%", "-10%"],
            y: ["80%", "10%", "10%", "80%"],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

export default function Demo() {
  return (
    <GridBeamBackground>
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <h3 className="text-2xl font-semibold text-white">Grid Beam Background</h3>
        <p className="max-w-xs text-sm text-zinc-400">
          A faint grid with glowing beams traveling along its lines.
        </p>
      </div>
    </GridBeamBackground>
  );
}
