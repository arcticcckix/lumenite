"use client";

import { useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export function DotPatternGlow({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const glowX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const dots = useMemo(() => {
    const gap = 24;
    const arr: { x: number; y: number }[] = [];
    for (let x = gap / 2; x < 900; x += gap) {
      for (let y = gap / 2; y < 500; y += gap) {
        arr.push({ x, y });
      }
    }
    return arr;
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function onMouseLeave() {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-void",
        className
      )}
    >
      <div className="absolute inset-0">
        {dots.map((d, i) => (
          <div
            key={i}
            className="absolute h-[3px] w-[3px] rounded-full bg-white/20"
            style={{ left: d.x, top: d.y }}
          />
        ))}
      </div>
      <motion.div
        className="pointer-events-none absolute h-40 w-40 rounded-full"
        style={{
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, rgba(124,108,255,0.55), transparent 70%)",
          filter: "blur(4px)",
        }}
      />
      <div className="relative z-10 px-6 text-center">{children}</div>
    </div>
  );
}

export default function Demo() {
  return (
    <DotPatternGlow>
      <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold text-transparent">
        Dot Pattern Glow
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
        Move your cursor across the field, a soft light warms the dots
        beneath it.
      </p>
    </DotPatternGlow>
  );
}
