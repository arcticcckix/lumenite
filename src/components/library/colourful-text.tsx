"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A curated cool-toned palette: violet → periwinkle → sky → aqua and back.
 * Reads as a premium multi-hue sweep rather than a full RGB rainbow.
 */
const DEFAULT_COLORS = [
  "#a78bfa",
  "#7c6cff",
  "#6b8cff",
  "#5b8cff",
  "#38bdf8",
  "#818cf8",
];

const round = (n: number) => Math.round(n * 1000) / 1000;

export function ColourfulText({
  text,
  className,
  colors = DEFAULT_COLORS,
  duration = 5,
}: {
  text: string;
  className?: string;
  colors?: string[];
  duration?: number;
}) {
  // Split once; whitespace is rendered as a fixed, non-animated gap so word
  // shapes stay intact while every glyph carries its own phase of the sweep.
  const chars = useMemo(() => Array.from(text), [text]);

  return (
    <span
      className={cn("inline-flex flex-wrap", className)}
      style={{
        textShadow: "0 0 24px rgba(124, 108, 255, 0.28)",
      }}
      aria-label={text}
    >
      {chars.map((ch, i) => {
        if (ch === " ") {
          // eslint-disable-next-line react/no-array-index-key
          return (
            <span key={`sp-${i}`} aria-hidden style={{ width: "0.32em" }} />
          );
        }

        // Rotate the palette per glyph so, even at rest (t=0), the word already
        // shows a full gradient, then the whole thing flows together.
        const k = i % colors.length;
        const rotated = [...colors.slice(k), ...colors.slice(0, k)];
        const colorKeyframes = [...rotated, rotated[0]];

        const waveDelay = round((i % 12) * 0.11);

        return (
          <motion.span
            // eslint-disable-next-line react/no-array-index-key
            key={`${ch}-${i}`}
            aria-hidden
            className="inline-block will-change-transform"
            style={{ color: colorKeyframes[0] }}
            initial={false}
            animate={{
              color: colorKeyframes,
              y: [0, -3.5, 0, 1.5, 0],
              scale: [1, 1.09, 1, 0.985, 1],
              filter: [
                "blur(0px)",
                "blur(0.7px)",
                "blur(0px)",
                "blur(0.3px)",
                "blur(0px)",
              ],
            }}
            transition={{
              color: {
                duration,
                ease: "linear",
                repeat: Infinity,
              },
              y: {
                duration: round(duration * 0.62),
                ease: [0.16, 1, 0.3, 1],
                repeat: Infinity,
                delay: waveDelay,
              },
              scale: {
                duration: round(duration * 0.62),
                ease: [0.16, 1, 0.3, 1],
                repeat: Infinity,
                delay: waveDelay,
              },
              filter: {
                duration: round(duration * 0.62),
                ease: "easeInOut",
                repeat: Infinity,
                delay: waveDelay,
              },
            }}
          >
            {ch}
          </motion.span>
        );
      })}
    </span>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-void px-6">
      {/* Ambient glow so the panel is alive even before the text sweeps */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 50% 30%, rgba(124,108,255,0.18), transparent 60%), radial-gradient(500px circle at 70% 90%, rgba(91,140,255,0.14), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(124,108,255,0.5), transparent)",
        }}
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-soft" />
          Lumenite UI
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl"
        >
          Design something{" "}
          <ColourfulText text="unmistakably" /> yours.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          className="mt-5 max-w-md text-sm leading-relaxed text-zinc-400"
        >
          A headline that never sits still, each letter drifts through a cool,
          tasteful spectrum with a soft blur-and-scale wave.
        </motion.p>
      </div>
    </div>
  );
}
