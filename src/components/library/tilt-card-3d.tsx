"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function TiltCard3D({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 18, mass: 0.5 };
  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [12, -12]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-12, 12]),
    springConfig
  );

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn(
        "group relative rounded-2xl border border-line bg-panel p-8",
        className
      )}
    >
      <div style={{ transform: "translateZ(40px)" }} className="relative">
        {children}
      </div>
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <TiltCard3D className="max-w-sm">
        <div
          style={{ transform: "translateZ(60px)" }}
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-glow text-lg text-white shadow-lg"
        >
          ▲
        </div>
        <h3
          style={{ transform: "translateZ(50px)" }}
          className="text-lg font-semibold text-white"
        >
          Depth on demand
        </h3>
        <p
          style={{ transform: "translateZ(30px)" }}
          className="mt-2 text-sm leading-relaxed text-zinc-400"
        >
          Every element inside this card sits at its own depth, so the whole
          thing tilts like it has real dimension.
        </p>
      </TiltCard3D>
    </div>
  );
}
