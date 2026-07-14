"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export function NumberTicker({
  value,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 90 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent =
          prefix +
          latest.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) +
          suffix;
      }
    });
    return unsubscribe;
  }, [springValue, prefix, suffix, decimals]);

  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}0{suffix}
    </motion.span>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-10 p-8">
      <div className="text-center">
        <NumberTicker
          value={128430}
          prefix="$"
          className="text-4xl font-bold text-white"
        />
        <p className="mt-2 text-sm text-zinc-500">Revenue</p>
      </div>
      <div className="text-center">
        <NumberTicker
          value={2847}
          suffix="+"
          className="text-4xl font-bold text-brand-soft"
        />
        <p className="mt-2 text-sm text-zinc-500">Users</p>
      </div>
    </div>
  );
}
