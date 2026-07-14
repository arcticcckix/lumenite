"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function WobbleCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 14 };
  const translateX = useSpring(
    useTransform(x, [-0.5, 0.5], [-14, 14]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(y, [-0.5, 0.5], [-10, 10]),
    springConfig
  );
  const skewX = useSpring(
    useTransform(x, [-0.5, 0.5], [-4, 4]),
    springConfig
  );
  const scale = useSpring(1, springConfig);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => scale.set(1.03)}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
        scale.set(1);
      }}
      style={{ x: translateX, y: translateY, skewX, scale }}
      className={cn(
        "relative rounded-2xl border border-line bg-panel p-8",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <WobbleCard className="max-w-sm">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/15 text-brand-soft">
          ◈
        </div>
        <h3 className="text-lg font-semibold text-white">Jelly, but tasteful</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          The card leans, skews, and settles as your cursor drifts across it —
          a soft, springy sense of physicality.
        </p>
      </WobbleCard>
    </div>
  );
}
