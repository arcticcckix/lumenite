"use client";

import { useMemo } from "react";
import {
  motion,
  useSpring,
  useTime,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

const round = (n: number, p = 0) => {
  const f = 10 ** p;
  return Math.round(n * f) / f;
};

// A single character. Its glow is driven by a shared clock so a slow wave of
// light drifts across the whole line at rest. Hovering a character pulls it to
// full intensity on its own spring, so the idle motion and the real interaction
// never fight each other.
function GlowLetter({
  char,
  index,
  time,
  sweepMs,
  phaseStep,
  idleAmount,
}: {
  char: string;
  index: number;
  time: MotionValue<number>;
  sweepMs: number;
  phaseStep: number;
  idleAmount: number;
}) {
  const hover = useSpring(0, { stiffness: 320, damping: 26 });

  // 0..1 combined intensity: the resting sweep plus any hover boost.
  const intensity = useTransform(() => {
    const phase = (time.get() / sweepMs) * Math.PI * 2 - index * phaseStep;
    const wave = (Math.sin(phase) + 1) / 2; // 0..1
    return Math.min(1, wave * idleAmount + hover.get());
  });

  const y = useTransform(intensity, (v) => round(v * -7, 2));
  const scale = useTransform(intensity, (v) => round(1 + v * 0.06, 3));
  const color = useTransform(intensity, (v) => {
    const rr = round(158 + v * 66);
    const gg = round(161 + v * 70);
    const bb = round(182 + v * 73);
    return `rgb(${rr}, ${gg}, ${bb})`;
  });
  const textShadow = useTransform(intensity, (v) => {
    const blur = round(4 + v * 20);
    const alpha = round(0.12 + v * 0.78, 2);
    return `0 0 ${blur}px rgba(91, 140, 255, ${alpha})`;
  });

  return (
    <motion.span
      onHoverStart={() => hover.set(1)}
      onHoverEnd={() => hover.set(0)}
      style={{ y, scale, color, textShadow }}
      className="inline-block will-change-transform"
    >
      {char}
    </motion.span>
  );
}

export function TextHoverGlow({
  text,
  className,
  sweepMs = 2600,
  phaseStep = 0.55,
  idleAmount = 0.55,
}: {
  text: string;
  className?: string;
  /** Milliseconds for one full oscillation of the drifting glow. */
  sweepMs?: number;
  /** Phase offset per character; smaller values make a wider bright band. */
  phaseStep?: number;
  /** Peak resting intensity, 0..1. Hover always reaches full. */
  idleAmount?: number;
}) {
  const time = useTime();

  // Split into words so the line wraps naturally, but keep a continuous letter
  // index so the wave flows across word boundaries.
  const words = useMemo(() => {
    let i = 0;
    return text.split(" ").map((word) => ({
      chars: word.split("").map((char) => ({ char, index: i++ })),
    }));
  }, [text]);

  return (
    <span className={cn("inline-flex flex-wrap items-baseline", className)}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex whitespace-nowrap">
          {word.chars.map(({ char, index }) => (
            <GlowLetter
              key={index}
              char={char}
              index={index}
              time={time}
              sweepMs={sweepMs}
              phaseStep={phaseStep}
              idleAmount={idleAmount}
            />
          ))}
          {wi < words.length - 1 && (
            <span aria-hidden className="inline-block w-[0.3em]" />
          )}
        </span>
      ))}
    </span>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-void px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, rgba(124,108,255,0.16), transparent 70%)",
        }}
      />
      <div className="relative z-10 max-w-xl text-center">
        <div className="mb-6 inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
          <span className="h-px w-6 bg-line" />
          Interactive typography
        </div>
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          <TextHoverGlow text="Light that follows the words" />
        </h2>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-zinc-500">
          Hover any character to pull it toward the light. At rest, a slow glow
          drifts across the line.
        </p>
      </div>
    </div>
  );
}
