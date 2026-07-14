"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";
import { Move3d } from "lucide-react";
import { cn } from "@/lib/utils";

const round = (n: number) => Math.round(n * 100) / 100;
const springConfig = { stiffness: 150, damping: 18, mass: 0.6 };

export function WobbleCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Raw cursor position, normalized to [-0.5, 0.5].
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, springConfig);
  const my = useSpring(py, springConfig);

  // Continuous idle drift, updated per frame from a deterministic lissajous.
  const idleX = useMotionValue(0);
  const idleY = useMotionValue(0);

  // Blend between idle (0) and cursor-driven (1) motion.
  const hover = useMotionValue(0);
  const hoverS = useSpring(hover, { stiffness: 120, damping: 22 });

  useAnimationFrame((t) => {
    const s = t / 1000;
    idleX.set(Math.sin(s * 0.62));
    idleY.set(Math.sin(s * 0.44 + 1.7));
  });

  // Every transform is a weighted mix: idle amplitude at rest, cursor amplitude on hover.
  const rotateY = useTransform(() => {
    const h = hoverS.get();
    return round(idleX.get() * 4.5 * (1 - h) + mx.get() * 28 * h);
  });
  const rotateX = useTransform(() => {
    const h = hoverS.get();
    return round(-(idleY.get() * 3.8 * (1 - h) + my.get() * 24 * h));
  });
  const tx = useTransform(() => {
    const h = hoverS.get();
    return round(idleX.get() * 4 * (1 - h) + mx.get() * 16 * h);
  });
  const ty = useTransform(() => {
    const h = hoverS.get();
    return round(idleY.get() * 3 * (1 - h) + my.get() * 12 * h);
  });
  const skewX = useTransform(() => {
    const h = hoverS.get();
    return round(idleX.get() * 1.4 * (1 - h) + mx.get() * 5 * h);
  });
  const scale = useTransform(hoverS, (h) => round(1 + h * 0.03));

  // Glare + glow track the same blended field, so they drift at rest too.
  const glareX = useTransform(() => {
    const h = hoverS.get();
    return round(50 + (idleX.get() * (1 - h) + mx.get() * 2 * h) * 26);
  });
  const glareY = useTransform(() => {
    const h = hoverS.get();
    return round(50 + (idleY.get() * (1 - h) + my.get() * 2 * h) * 26);
  });
  const glare = useMotionTemplate`radial-gradient(180px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.14), transparent 58%)`;
  const glowOpacity = useTransform(hoverS, (h) => round(0.32 + h * 0.5));

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => hover.set(1)}
      onMouseLeave={() => {
        hover.set(0);
        px.set(0);
        py.set(0);
      }}
      className={cn("relative [perspective:1100px]", className)}
    >
      {/* Breathing glow behind the card. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] blur-2xl"
        style={{
          opacity: glowOpacity,
          background:
            "radial-gradient(60% 60% at 50% 45%, rgba(124,108,255,0.35), transparent 70%)",
        }}
        animate={{ scale: [0.97, 1.03, 0.97] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{
          rotateX,
          rotateY,
          x: tx,
          y: ty,
          skewX,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="relative overflow-hidden rounded-2xl border border-line bg-panel p-8"
      >
        {/* Tilt-linked specular glare. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: glare }}
        />
        {/* Thin bright top edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
        <div className="relative z-10">{children}</div>
      </motion.div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <WobbleCard className="w-full max-w-sm">
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-brand/15 text-brand-soft">
          <Move3d className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h3 className="text-lg font-semibold text-white">
          Depth on every surface
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          The panel leans toward your cursor, then keeps a slow living drift
          when you step away. One spring, no textures, no images.
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            Live at rest
          </span>
          <span className="font-mono tracking-tight">spring physics</span>
        </div>
      </WobbleCard>
    </div>
  );
}
