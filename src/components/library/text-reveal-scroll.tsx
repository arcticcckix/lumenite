"use client";

import { useRef } from "react";
import { motion, useScroll, useTime, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/** Round floats before they touch the DOM (keeps style strings clean + stable). */
const round = (n: number, p = 3) => {
  const f = 10 ** p;
  return Math.round(n * f) / f;
};

const DIM = 0.15; // resting brightness of an un-revealed word
const SIGMA = 1.5; // width of the moving highlight, in words
const SPREAD = 4; // padding so the light fully enters and exits
const PERIOD = 6200; // ms for one full left-to-right sweep

function RevealWord({
  word,
  index,
  total,
  progress,
  time,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  time: ReturnType<typeof useTime>;
}) {
  const start = index / total;
  const end = start + 1 / total;

  // Continuous idle highlight: a soft gaussian bump that travels through the
  // words on a loop, so the passage reads itself even when nothing scrolls.
  const idle = (t: number) => {
    const cycle = (((t / PERIOD) % 1) + 1) % 1;
    const head = cycle * (total + SPREAD * 2) - SPREAD;
    const d = index - head;
    return Math.exp(-(d * d) / (2 * SIGMA * SIGMA));
  };

  const opacity = useTransform(() => {
    const p = progress.get();
    const reveal = Math.min(Math.max((p - start) / (end - start), 0), 1);
    const scrollLit = DIM + reveal * (1 - DIM);
    const idleLit = DIM + idle(time.get()) * (0.85 - DIM);
    return round(Math.max(scrollLit, idleLit));
  });

  const textShadow = useTransform(() => {
    const g = idle(time.get());
    return (
      `0 0 ${round(g * 10, 1)}px rgba(255,255,255,${round(g * 0.22, 2)}), ` +
      `0 0 ${round(g * 26, 1)}px rgba(124,108,255,${round(g * 0.5, 2)})`
    );
  });

  return (
    <motion.span
      style={{ opacity, textShadow }}
      className="mr-[0.3em] inline-block text-white"
    >
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
  const time = useTime();
  const words = text.split(" ");

  return (
    <div
      ref={containerRef ? undefined : localRef}
      className={cn("flex flex-wrap", className)}
    >
      {words.map((word, i) => (
        <RevealWord
          key={`${word}-${i}`}
          word={word}
          index={i}
          total={words.length}
          progress={scrollYProgress}
          time={time}
        />
      ))}
    </div>
  );
}

export default function Demo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="relative h-full w-full overflow-y-auto"
    >
      {/* Soft depth behind the type. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 30%, rgba(124,108,255,0.10), transparent 60%)",
        }}
      />

      <div className="relative flex min-h-full flex-col justify-center px-8 py-20 sm:px-12">
        <div className="mb-7 flex items-center gap-3">
          <span className="h-px w-8 bg-white/20" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            Design principles
          </span>
        </div>

        <TextRevealScroll
          containerRef={scrollRef}
          text="We believe software should feel calm. Every interaction earns its motion, every surface holds its light, and nothing moves without a reason. That is the bar we build toward."
          className="max-w-xl text-[1.7rem] font-medium leading-[1.45] tracking-tight sm:text-[1.9rem]"
        />

        <div className="mt-9 flex items-center gap-3">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
          <span className="text-xs text-zinc-500">
            Scroll to lock each line in place.
          </span>
        </div>
      </div>

      {/* Real scroll room so the reveal interaction stays demonstrable. */}
      <div className="h-[160px]" />
    </div>
  );
}
