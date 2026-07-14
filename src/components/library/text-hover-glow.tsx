"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextHoverGlow({
  text,
  className,
  letterClassName,
}: {
  text: string;
  className?: string;
  letterClassName?: string;
}) {
  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          whileHover={{
            y: -6,
            color: "#a9b8ff",
            textShadow: "0 0 18px rgba(91,140,255,0.9)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={cn("inline-block", letterClassName)}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <h2 className="max-w-lg text-center text-4xl font-bold text-white">
        <TextHoverGlow text="Feel every letter" />
      </h2>
    </div>
  );
}
