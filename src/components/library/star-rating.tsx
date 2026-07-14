"use client";

import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring", stiffness: 520, damping: 20, mass: 0.7 } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const AMBER = "#f7bb42";
const AMBER_DEEP = "#f59e2e";
const AMBER_GLOW = "drop-shadow(0 1px 6px rgba(247,187,66,0.45))";
const EMPTY_STROKE = "rgba(255,255,255,0.20)";
const EMPTY_FILL = "rgba(255,255,255,0.03)";

const round = (n: number, d = 0) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

export interface StarRatingProps {
  /** Controlled locked rating. Omit for uncontrolled. */
  value?: number;
  /** Initial rating when uncontrolled. */
  defaultValue?: number;
  max?: number;
  /** Star size in pixels. */
  size?: number;
  readOnly?: boolean;
  /** Enable the idle shimmer sweep across filled stars. */
  shimmer?: boolean;
  onChange?: (value: number) => void;
  onHoverChange?: (value: number | null) => void;
  className?: string;
  ariaLabel?: string;
}

export function StarRating({
  value,
  defaultValue = 0,
  max = 5,
  size = 34,
  readOnly = false,
  shimmer = false,
  onChange,
  onHoverChange,
  className,
  ariaLabel,
}: StarRatingProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);

  const current = isControlled ? value : internal;
  const isHovering = !readOnly && hover !== null;
  const display = hover ?? current;
  const activeIndex = isHovering ? (hover as number) - 1 : -1;
  const gap = round(size * 0.26);

  function commit(v: number) {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }

  function setHoverValue(v: number | null) {
    setHover(v);
    onHoverChange?.(v);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (readOnly) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      commit(Math.min(max, Math.floor(current) + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      commit(Math.max(0, Math.ceil(current) - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      commit(1);
    } else if (e.key === "End") {
      e.preventDefault();
      commit(max);
    }
  }

  const filledPct = round((Math.min(display, max) / max) * 100);

  return (
    <div
      role={readOnly ? "img" : "slider"}
      aria-label={ariaLabel ?? `Rated ${round(display, 1)} out of ${max}`}
      aria-valuenow={readOnly ? undefined : current}
      aria-valuemin={readOnly ? undefined : 0}
      aria-valuemax={readOnly ? undefined : max}
      tabIndex={readOnly ? undefined : 0}
      onKeyDown={onKeyDown}
      onPointerLeave={readOnly ? undefined : () => setHoverValue(null)}
      className={cn(
        "relative inline-flex select-none outline-none",
        !readOnly &&
          "cursor-pointer rounded-lg focus-visible:ring-2 focus-visible:ring-brand/60",
        className
      )}
      style={{ gap }}
    >
      {Array.from({ length: max }).map((_, i) => {
        const fillPortion = Math.max(0, Math.min(1, display - i));
        const dist = Math.abs(i - activeIndex);
        const bump = activeIndex >= 0 ? Math.max(0, 0.24 - 0.12 * dist) : 0;
        const scale = round(1 + bump, 2);
        const y = -Math.round(bump * 42);

        const iconStyle: CSSProperties = {
          width: size,
          height: size,
          display: "block",
        };

        return (
          <motion.span
            key={i}
            onPointerEnter={readOnly ? undefined : () => setHoverValue(i + 1)}
            onPointerDown={readOnly ? undefined : () => commit(i + 1)}
            className="relative inline-flex"
            style={{ width: size, height: size, transformOrigin: "center bottom" }}
            animate={{ scale, y }}
            transition={SPRING}
          >
            <Star
              strokeWidth={1.5}
              style={{ ...iconStyle, color: EMPTY_STROKE, fill: EMPTY_FILL }}
            />
            <span
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{ width: `${round(fillPortion * 100)}%` }}
            >
              <Star
                strokeWidth={1.5}
                style={{
                  ...iconStyle,
                  color: AMBER_DEEP,
                  fill: AMBER,
                  filter: AMBER_GLOW,
                }}
              />
            </span>
          </motion.span>
        );
      })}

      {shimmer && filledPct > 0 && !isHovering && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${filledPct}%` }}
        >
          <motion.div
            className="absolute inset-y-0 w-1/3"
            style={{
              left: "-40%",
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
              mixBlendMode: "screen",
              filter: "blur(1px)",
            }}
            initial={{ x: "0%" }}
            animate={{ x: ["0%", "460%"] }}
            transition={{
              duration: 2.4,
              ease: EASE,
              repeat: Infinity,
              repeatDelay: 1.8,
            }}
          />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const RATING_LABELS = ["Poor", "Fair", "Good", "Great", "Excellent"];

const BREAKDOWN = [
  { stars: 5, count: 1830 },
  { stars: 4, count: 190 },
  { stars: 3, count: 55 },
  { stars: 2, count: 25 },
  { stars: 1, count: 20 },
];

const TOTAL = BREAKDOWN.reduce((s, b) => s + b.count, 0);
const AVERAGE = BREAKDOWN.reduce((s, b) => s + b.stars * b.count, 0) / TOTAL;

const formatCount = (n: number) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function Demo() {
  const [rating, setRating] = useState(4);
  const [hover, setHover] = useState<number | null>(null);

  const preview = hover ?? rating;
  const label = preview > 0 ? RATING_LABELS[Math.ceil(preview) - 1] : "Tap to rate";

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-[20px] border border-white/10 bg-panel p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]">
        {/* faint brand wash, kept subtle */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(124,108,255,0.28), transparent 70%)",
          }}
        />

        <div className="relative flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            Customer reviews
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand-soft">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </span>
        </div>

        <div className="relative mt-4 flex items-end gap-4">
          <div className="text-[52px] font-semibold leading-none tracking-tight text-white tabular-nums">
            {AVERAGE.toFixed(1)}
          </div>
          <div className="pb-1">
            <StarRating value={AVERAGE} readOnly max={5} size={17} />
            <div className="mt-1 text-sm text-zinc-400">
              from {formatCount(TOTAL)} reviews
            </div>
          </div>
        </div>

        <div className="relative mt-5 space-y-1.5">
          {BREAKDOWN.map((b, idx) => {
            const pct = round((b.count / TOTAL) * 100);
            return (
              <div
                key={b.stars}
                className="flex items-center gap-2.5 text-[11px] text-zinc-500"
              >
                <span className="w-2 text-right tabular-nums">{b.stars}</span>
                <Star
                  className="shrink-0"
                  style={{
                    width: 9,
                    height: 9,
                    color: AMBER_DEEP,
                    fill: AMBER,
                  }}
                />
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #f7bb42, #f59e2e)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.15 + idx * 0.08 }}
                  />
                </div>
                <span className="w-8 text-right tabular-nums">{pct}%</span>
              </div>
            );
          })}
        </div>

        <div className="relative my-5 h-px bg-white/[0.07]" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-white">
              How would you rate it?
            </div>
            <div className="mt-0.5 h-4 text-xs text-zinc-500">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={hover !== null ? `h-${hover}` : `r-${rating}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16, ease: EASE }}
                  className="inline-flex items-center gap-1.5"
                >
                  <span className="font-medium text-brand-soft">{label}</span>
                  <span aria-hidden>·</span>
                  <span>
                    {hover !== null
                      ? "click to confirm"
                      : `your rating is saved`}
                  </span>
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <StarRating
            value={rating}
            onChange={setRating}
            onHoverChange={setHover}
            shimmer
            max={5}
            size={30}
          />
        </div>
      </div>
    </div>
  );
}
