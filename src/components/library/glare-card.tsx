"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlareCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const [hovering, setHovering] = useState(false);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  const glare = useMotionTemplate`linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.35) ${mouseX}%, rgba(124,108,255,0.25) calc(${mouseX}% + 15%), transparent 60%)`;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-line bg-panel p-8",
        className
      )}
      style={{ perspective: 800 }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 mix-blend-screen"
        style={{ backgroundImage: glare, opacity: hovering ? 1 : 0 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <GlareCard className="max-w-sm">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-soft to-glow text-white">
          ✧
        </div>
        <h3 className="text-lg font-semibold text-white">
          Holographic sheen
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          A light sweep glides across the surface as your cursor moves,
          mimicking a foil trading card.
        </p>
      </GlareCard>
    </div>
  );
}
