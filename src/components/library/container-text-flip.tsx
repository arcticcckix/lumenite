"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// useLayoutEffect on the server logs a warning; fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Premium out-and-back easing used across the flip.
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const wordVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.028, delayChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(8px)",
    transition: { duration: 0.26, ease: EASE },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: EASE },
  },
};

export interface ContainerTextFlipProps {
  /** The rotating words. The pill resizes to fit whichever one is showing. */
  words: string[];
  /** Milliseconds each word stays before flipping. */
  interval?: number;
  /** Classes merged onto the pill container. */
  className?: string;
  /** Classes merged onto the animated word (e.g. to override the gradient). */
  textClassName?: string;
}

/**
 * A gradient pill whose width springs to fit each rotating word, while the
 * letters blur-in on a stagger. Blinking-free and layout-jank-free.
 */
export function ContainerTextFlip({
  words,
  interval = 2600,
  className,
  textClassName,
}: ContainerTextFlipProps) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);

  const word = words[index] ?? "";

  // Only ever hold the most-recently-mounted word node (ignore unmount nulls
  // from the outgoing AnimatePresence child so measurement stays stable).
  const setMeasureRef = useCallback((node: HTMLSpanElement | null) => {
    if (node) measureRef.current = node;
  }, []);

  // Measure the new word before paint so the spring targets the right width.
  useIsomorphicLayoutEffect(() => {
    if (measureRef.current) {
      setWidth(Math.round(measureRef.current.scrollWidth));
    }
  }, [word]);

  // Re-measure once web fonts have settled, the fallback font can be a few px
  // wider/narrower, and this lets the pill spring to the corrected size.
  useEffect(() => {
    if (typeof document === "undefined" || !("fonts" in document)) return;
    let active = true;
    document.fonts.ready.then(() => {
      if (active && measureRef.current) {
        setWidth(Math.round(measureRef.current.scrollWidth));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Auto-advance through the words.
  useEffect(() => {
    if (words.length <= 1) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval
    );
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  const pillStyle: CSSProperties = {
    background:
      "linear-gradient(180deg, rgba(124,108,255,0.24), rgba(91,140,255,0.10) 55%, rgba(10,10,18,0.55))",
    boxShadow:
      "0 12px 44px -12px rgba(124,108,255,0.55), inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(0,0,0,0.35)",
  };

  return (
    <span
      className={cn(
        "relative inline-flex items-center overflow-hidden rounded-2xl border border-white/15 px-4 py-2 align-middle backdrop-blur-sm",
        className
      )}
      style={pillStyle}
    >
      {/* Continuous sheen, keeps the pill alive at rest, no hover required. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(105deg, transparent 32%, rgba(255,255,255,0.20) 48%, transparent 64%)",
        }}
        initial={{ x: "-130%" }}
        animate={{ x: "130%" }}
        transition={{
          duration: 3.4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 2.2,
        }}
      />

      {/* Width-controlled inner wrapper, the pill inherits this animated size. */}
      <motion.span
        className="relative z-10 inline-flex"
        animate={width !== null ? { width } : undefined}
        transition={{ type: "spring", stiffness: 200, damping: 24, mass: 1 }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={word}
            ref={setMeasureRef}
            variants={wordVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn("inline-flex whitespace-nowrap font-semibold", textClassName)}
          >
            {word.split("").map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                variants={letterVariants}
                className="inline-block bg-gradient-to-b from-white via-brand-soft to-glow bg-clip-text text-transparent"
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-void px-6">
      {/* Ambient brand glow so the card reads premium at rest. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[420px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(124,108,255,0.22), transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Lumenite UI
        </span>

        <h2 className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-4xl font-semibold leading-tight tracking-tight text-white">
          Build
          <ContainerTextFlip
            words={[
              "dashboards",
              "AI agents",
              "landing pages",
              "design systems",
              "internal tools",
            ]}
          />
          faster.
        </h2>

        <p className="mt-7 max-w-md text-sm leading-relaxed text-zinc-400">
          One component, endless variations. The container springs to fit every
          word, no layout jank, no blinking.
        </p>
      </div>
    </div>
  );
}
