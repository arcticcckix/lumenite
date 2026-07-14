"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const orbs = [
  { color: "#7c6cff", size: 220, x: "10%", y: "20%", duration: 16 },
  { color: "#5b8cff", size: 260, x: "70%", y: "50%", duration: 20 },
  { color: "#a78bfa", size: 180, x: "40%", y: "75%", duration: 18 },
];

export function GlowOrbs({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-line bg-void",
        className
      )}
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            backgroundColor: orb.color,
            opacity: 0.35,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 25, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <GlowOrbs>
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <h3 className="text-2xl font-semibold text-white">Glow Orbs</h3>
        <p className="max-w-xs text-sm text-zinc-400">
          Slow, blurred gradient orbs drifting behind your hero content.
        </p>
      </div>
    </GlowOrbs>
  );
}
