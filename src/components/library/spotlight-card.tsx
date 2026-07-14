"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(124, 108, 255, 0.18)",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hovering, setHovering] = useState(false);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const background = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;

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
    >
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ background, opacity: hovering ? 1 : 0 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <SpotlightCard className="max-w-sm">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/15 text-brand-soft">
          ✦
        </div>
        <h3 className="text-lg font-semibold text-white">
          Spotlight that follows you
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Move your cursor across this card. A soft radial spotlight tracks it,
          giving every panel a premium, tactile feel.
        </p>
      </SpotlightCard>
    </div>
  );
}
