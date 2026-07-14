"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BlurFadeHeading({
  lines,
  className,
  lineClassName,
  staggerDelay = 0.15,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  staggerDelay?: number;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {lines.map((line, i) => (
        <motion.span
          key={`${line}-${i}`}
          initial={{ opacity: 0, filter: "blur(14px)", y: 24 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.8,
            delay: i * staggerDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={cn("inline-block", lineClassName)}
        >
          {line}
        </motion.span>
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <BlurFadeHeading
        lines={["Design that", "moves with", "intention."]}
        className="text-center text-4xl font-bold leading-tight text-white"
      />
    </div>
  );
}
