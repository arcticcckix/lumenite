"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FlipWords({
  words,
  before = "",
  after = "",
  className,
  wordClassName,
  interval = 2200,
}: {
  words: string[];
  before?: string;
  after?: string;
  className?: string;
  wordClassName?: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-2", className)}>
      {before && <span>{before}</span>}
      <span
        className="relative inline-block [perspective:1000px]"
        style={{ minWidth: "1ch" }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={{ rotateX: 90, opacity: 0, y: 10 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            exit={{ rotateX: -90, opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className={cn(
              "inline-block bg-gradient-to-r from-brand-soft to-glow bg-clip-text text-transparent",
              wordClassName
            )}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      {after && <span>{after}</span>}
    </span>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <h3 className="max-w-lg text-center text-3xl font-semibold text-white">
        <FlipWords
          before="Ship your"
          words={["landing page", "dashboard", "portfolio", "startup"]}
          after="faster."
        />
      </h3>
    </div>
  );
}
