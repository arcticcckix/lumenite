"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function seededChar(seed: number) {
  const n = Math.abs(Math.sin(seed * 999.17)) * CHARS.length;
  return CHARS[Math.floor(n) % CHARS.length];
}

export function EvervaultCard({
  text = "Hover",
  className,
}: {
  text?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hovering, setHovering] = useState(false);

  const rows = 14;
  const cols = 10;

  const grid = useMemo(() => {
    return Array.from({ length: rows * cols }, (_, i) => seededChar(i + 1));
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const mask = useMotionTemplate`radial-gradient(180px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "group relative flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-panel",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          WebkitMaskImage: mask,
          maskImage: mask,
          background: "linear-gradient(120deg, #7c6cff, #5b8cff)",
        }}
      >
        <div className="grid h-full w-full grid-cols-10 gap-0.5 p-2 font-mono text-[9px] text-white/90">
          {grid.map((c, i) => (
            <span key={i} className="flex items-center justify-center">
              {c}
            </span>
          ))}
        </div>
      </motion.div>
      <div className="pointer-events-none relative z-10 rounded-lg border border-line bg-void/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
        {text}
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <EvervaultCard text="lumenite.dev" />
    </div>
  );
}
