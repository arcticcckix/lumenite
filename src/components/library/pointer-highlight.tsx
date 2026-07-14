"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, type Transition } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PointerHighlight, wraps a word (or short phrase) and draws a
 * hand-drawn-style rectangle around it on a gentle, endless loop, while a
 * little cursor glides in to the corner and taps. A soft brand wash sits
 * behind the word so the highlight reads as intentional even between draws.
 *
 * The reusable component measures its own children, so it adapts to any word.
 * All animation loops share one `duration`, keeping the box, wash and pointer
 * in perfect sync. Nothing depends on hover, it is alive at rest.
 */
export type PointerHighlightProps = {
  children: React.ReactNode;
  /** Stroke color of the drawn rectangle. */
  color?: string;
  /** Soft halo behind the stroke. */
  glowColor?: string;
  /** Full loop length in seconds. */
  duration?: number;
  /** Padding (px) between the word and the drawn box. */
  pad?: number;
  className?: string;
  pointerClassName?: string;
};

// Round any float that lands in a DOM attribute → no hydration drift.
const r2 = (n: number) => Math.round(n * 100) / 100;

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function PointerHighlight({
  children,
  color = "#7c6cff",
  glowColor = "rgba(91,140,255,0.55)",
  duration = 3.4,
  pad = 6,
  className,
  pointerClassName,
}: PointerHighlightProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setDims({ w: Math.round(rect.width), h: Math.round(rect.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ready = dims.w > 0;
  const stroke = 3; // inset so the stroke + glow stay inside the svg box
  const boxW = dims.w + pad * 2;
  const boxH = dims.h + pad * 2;
  const radius = 10;

  // Hand-drawn rounded rectangle: traced clockwise from the top-left corner,
  // overshooting past the start along the top edge for a marker-pen crossover.
  const path = useMemo(() => {
    const iw = boxW - stroke * 2;
    const ih = boxH - stroke * 2;
    if (iw <= 0 || ih <= 0) return "";
    const rr = Math.max(4, Math.min(radius, ih / 2 - 1, iw / 2 - 1));
    const over = Math.min(18, iw * 0.28);
    return [
      `M ${r2(rr)} 0`,
      `H ${r2(iw - rr)}`,
      `Q ${r2(iw)} 0 ${r2(iw)} ${r2(rr)}`,
      `V ${r2(ih - rr)}`,
      `Q ${r2(iw)} ${r2(ih)} ${r2(iw - rr)} ${r2(ih)}`,
      `H ${r2(rr)}`,
      `Q 0 ${r2(ih)} 0 ${r2(ih - rr)}`,
      `V ${r2(rr)}`,
      `Q 0 0 ${r2(rr)} 0`,
      `H ${r2(Math.min(iw - rr, rr + over))}`,
    ].join(" ");
  }, [boxW, boxH]);

  // Bottom-right corner of the drawn box, in the wrapper's coordinate space.
  const cornerX = dims.w + pad - stroke;
  const cornerY = dims.h + pad - stroke;

  const boxTransition: Transition = {
    duration,
    ease: EASE_OUT,
    times: [0, 0.3, 0.88, 1],
    repeat: Infinity,
  };

  return (
    <span
      ref={ref}
      className={cn(
        "relative inline-block align-baseline [transform:translateZ(0)]",
        className
      )}
    >
      {/* soft highlighter wash behind the word, keeps the accent present */}
      {ready && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute z-0"
          style={{
            inset: -pad,
            borderRadius: radius,
            transformOrigin: "50% 60%",
            background:
              "linear-gradient(120deg, rgba(124,108,255,0.18), rgba(91,140,255,0.10) 70%)",
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.96, 1, 1, 1] }}
          transition={{
            duration,
            ease: EASE_OUT,
            times: [0, 0.32, 0.86, 1],
            repeat: Infinity,
          }}
        />
      )}

      <span className="relative z-10">{children}</span>

      {/* drawn rectangle */}
      {ready && path && (
        <svg
          aria-hidden
          className="pointer-events-none absolute z-20"
          style={{ left: -pad, top: -pad, overflow: "visible" }}
          width={boxW}
          height={boxH}
          viewBox={`0 0 ${boxW} ${boxH}`}
          fill="none"
        >
          <g transform={`translate(${stroke} ${stroke})`}>
            <motion.path
              d={path}
              stroke={color}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1, 1], opacity: [0, 1, 1, 0] }}
              transition={boxTransition}
            />
          </g>
        </svg>
      )}

      {/* cursor that glides to the corner and taps */}
      {ready && (
        <motion.span
          aria-hidden
          className={cn("pointer-events-none absolute z-30", pointerClassName)}
          style={{ left: cornerX, top: cornerY }}
          initial={{ opacity: 0, x: 16, y: 18, scale: 0.75 }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            x: [16, 0, 0, 0, 8],
            y: [18, 2, 2, 2, 10],
            scale: [0.75, 1.05, 0.97, 1, 0.9],
          }}
          transition={{
            duration,
            ease: EASE_OUT,
            times: [0, 0.32, 0.4, 0.86, 1],
            repeat: Infinity,
          }}
        >
          <MousePointer2
            className="h-[18px] w-[18px] -translate-x-[2px] -translate-y-[2px]"
            style={{
              color,
              fill: color,
              filter: `drop-shadow(0 2px 5px ${glowColor})`,
            }}
          />
        </motion.span>
      )}
    </span>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#050508] px-8">
      {/* ambient brand glow so the panel reads premium at rest */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 38%, rgba(124,108,255,0.10), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="relative flex flex-col items-center gap-6 text-center"
      >
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">
          The Lumenite way
        </span>

        <h3 className="text-4xl font-semibold leading-[1.18] tracking-tight text-white sm:text-[2.7rem]">
          Design that feels
          <br />
          <span className="inline-block pb-1">
            <PointerHighlight>
              <span className="bg-gradient-to-r from-[#b7abff] via-[#8f7dff] to-[#5b8cff] bg-clip-text text-transparent">
                effortless
              </span>
            </PointerHighlight>
            <span className="text-white">.</span>
          </span>
        </h3>

        <p className="mt-1 max-w-sm text-sm leading-relaxed text-zinc-400">
          Motion, spacing, and type, tuned until nothing on the page feels
          accidental.
        </p>
      </motion.div>
    </div>
  );
}
