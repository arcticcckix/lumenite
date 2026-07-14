"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function WarpBackground({
  className,
  children,
  panelCount = 10,
}: {
  className?: string;
  children?: React.ReactNode;
  panelCount?: number;
}) {
  const panels = useMemo(
    () => Array.from({ length: panelCount }, (_, i) => i),
    [panelCount]
  );

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-void",
        className
      )}
      style={{ perspective: "600px" }}
    >
      <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
        {panels.map((i) => {
          const angle = (360 / panelCount) * i;
          const delay = (i / panelCount) * 3;
          return (
            <motion.div
              key={i}
              className="absolute h-full w-px origin-center"
              style={{
                transform: `rotateY(${angle}deg)`,
                background:
                  "linear-gradient(to top, transparent, rgba(124,108,255,0.5), rgba(91,140,255,0.35), transparent)",
              }}
              initial={{ scaleY: 0.3, opacity: 0 }}
              animate={{ scaleY: [0.3, 1.4, 0.3], opacity: [0, 0.9, 0] }}
              transition={{
                duration: 3,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, #050508 78%)",
        }}
      />
      <div className="relative z-10 px-6 text-center">{children}</div>
    </div>
  );
}

export default function Demo() {
  return (
    <WarpBackground>
      <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold text-transparent">
        Warp Background
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
        Thin panels flow outward from the center, like slipping past
        lightspeed.
      </p>
    </WarpBackground>
  );
}
