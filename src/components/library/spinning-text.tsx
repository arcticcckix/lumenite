"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const round = (n: number) => Math.round(n * 1000) / 1000;

export function SpinningText({
  children,
  radius = 118,
  duration = 26,
  reverse = false,
  className,
  letterClassName,
}: {
  /** The text laid out around the circle. Passed as a plain string. */
  children: string;
  /** Distance from the center to each glyph, in pixels. */
  radius?: number;
  /** Seconds for one full revolution. */
  duration?: number;
  /** Spin counter-clockwise instead of clockwise. */
  reverse?: boolean;
  /** Class on the rotating wrapper. */
  className?: string;
  /** Class applied to every glyph. */
  letterClassName?: string;
}) {
  const letters = useMemo(() => Array.from(children), [children]);
  const total = letters.length;

  return (
    <motion.div
      aria-label={children}
      className={cn("relative", className)}
      style={{ width: radius * 2, height: radius * 2, willChange: "transform" }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      {letters.map((letter, i) => {
        const angle = round((360 / total) * i);
        return (
          <span
            key={i}
            aria-hidden
            className={cn(
              "absolute left-1/2 top-1/2 inline-block select-none",
              letterClassName
            )}
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(${round(
                -radius
              )}px)`,
            }}
          >
            {letter === " " ? " " : letter}
          </span>
        );
      })}
    </motion.div>
  );
}

function DotRing({
  radius,
  count,
  duration = 44,
}: {
  radius: number;
  count: number;
  duration?: number;
}) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: round((360 / count) * i),
        major: i % 6 === 0,
      })),
    [count]
  );

  return (
    <motion.div
      aria-hidden
      className="relative"
      style={{ width: radius * 2, height: radius * 2, willChange: "transform" }}
      animate={{ rotate: -360 }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      {dots.map((d, i) => (
        <span
          key={i}
          className={cn(
            "absolute left-1/2 top-1/2 rounded-full",
            d.major ? "bg-glow" : "bg-white/20"
          )}
          style={{
            width: d.major ? 3 : 2,
            height: d.major ? 3 : 2,
            transform: `translate(-50%, -50%) rotate(${d.angle}deg) translateY(${round(
              -radius
            )}px)`,
            boxShadow: d.major ? "0 0 6px rgba(91, 140, 255, 0.7)" : undefined,
          }}
        />
      ))}
    </motion.div>
  );
}

function SealCenter() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 108, height: 108 }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124, 108, 255, 0.34), transparent 68%)",
        }}
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.94, 1.06, 0.94] }}
        transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
      />
      <div
        className="relative flex h-[74px] w-[74px] items-center justify-center rounded-full border border-white/10"
        style={{
          background: "linear-gradient(160deg, #15151f 0%, #0a0a10 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 10px 34px rgba(0, 0, 0, 0.55)",
        }}
      >
        <ArrowUpRight className="h-6 w-6 text-brand-soft" strokeWidth={1.75} />
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-void">
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(124, 108, 255, 0.13), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
        style={{ width: 320, height: 320 }}
      >
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-[14px] rounded-full border border-white/[0.06]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <DotRing radius={132} count={48} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <SpinningText
            radius={118}
            duration={28}
            letterClassName="text-[13px] font-medium uppercase tracking-[0.02em] text-white/55"
          >
            {"EXPLORE THE COLLECTION  •  LUMENITE UI  •  "}
          </SpinningText>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <SealCenter />
        </div>
      </motion.div>
    </div>
  );
}
