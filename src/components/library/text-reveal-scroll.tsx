"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

function RevealWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.15, 1]);

  return (
    <motion.span style={{ opacity }} className="mr-[0.3em] inline-block text-white">
      {word}
    </motion.span>
  );
}

export function TextRevealScroll({
  text,
  className,
  containerRef,
}: {
  text: string;
  className?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const localRef = useRef<HTMLDivElement>(null);
  const target = containerRef ?? localRef;
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 0.85", "start 0.25"],
  });
  const words = text.split(" ");

  return (
    <div ref={containerRef ? undefined : localRef} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <RevealWord
          key={`${word}-${i}`}
          word={word}
          index={i}
          total={words.length}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}

export default function Demo() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={scrollRef} className="h-full w-full overflow-y-auto p-8">
      <div className="flex h-[60px] items-center justify-center text-xs text-zinc-500">
        scroll down ↓
      </div>
      <TextRevealScroll
        containerRef={scrollRef}
        text="As you scroll through this passage each word slowly brightens from a dim whisper into a fully lit statement, guiding the reader's eye down the page."
        className="max-w-lg text-2xl font-medium leading-relaxed"
      />
      <div className="h-[120px]" />
    </div>
  );
}
