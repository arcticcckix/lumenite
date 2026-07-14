"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function RippleGrid({
  className,
  children,
  rings = 4,
}: {
  className?: string;
  children?: React.ReactNode;
  rings?: number;
}) {
  const ringArr = useMemo(() => Array.from({ length: rings }, (_, i) => i), [rings]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-void",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(circle at 50% 50%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, black 20%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {ringArr.map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{ borderColor: "rgba(124,108,255,0.55)" }}
            initial={{ width: 0, height: 0, opacity: 0.9 }}
            animate={{ width: 520, height: 520, opacity: 0 }}
            transition={{
              duration: 4,
              delay: (i * 4) / rings,
              repeat: Infinity,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
        <div className="absolute h-2 w-2 rounded-full bg-brand shadow-[0_0_20px_6px_rgba(124,108,255,0.6)]" />
      </div>
      <div className="relative z-10 px-6 text-center">{children}</div>
    </div>
  );
}

export default function Demo() {
  return (
    <RippleGrid>
      <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold text-transparent">
        Ripple Grid
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
        Rings pulse outward from a single point of light, endlessly.
      </p>
    </RippleGrid>
  );
}
