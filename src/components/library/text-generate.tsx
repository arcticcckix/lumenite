"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextGenerate({
  text,
  className,
  wordClassName,
  duration = 0.5,
  delayStep = 0.08,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  duration?: number;
  delayStep?: number;
}) {
  const [started, setStarted] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={
            started
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0, filter: "blur(8px)" }
          }
          transition={{ duration, delay: i * delayStep, ease: "easeOut" }}
          className={cn("mr-[0.35em] inline-block", wordClassName)}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <TextGenerate
        text="Words that fade and sharpen into existence as if a mind were composing them live."
        className="max-w-lg text-2xl font-semibold leading-relaxed text-white"
      />
    </div>
  );
}
