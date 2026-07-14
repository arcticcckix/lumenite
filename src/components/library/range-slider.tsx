"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  type AnimationPlaybackControls,
} from "framer-motion";
import { Wallet, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type RangeSliderProps = {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange?: (value: number) => void;
  /** Formats the number shown inside the tooltip. */
  format?: (value: number) => string;
  label?: string;
  disabled?: boolean;
  className?: string;
  /** Fires true while the user hovers, focuses or drags the control. */
  onInteractChange?: (interacting: boolean) => void;
};

/**
 * A controlled single-value range slider with a gradient-filled track,
 * a glossy thumb that scales on grab, and a value tooltip that tracks it.
 * Fully keyboard accessible (arrows, Page Up/Down, Home/End).
 */
export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  format = (v) => String(v),
  label = "Value",
  disabled = false,
  className,
  onInteractChange,
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [grabbing, setGrabbing] = useState(false);

  const range = max - min || 1;
  const clamped = Math.min(max, Math.max(min, value));
  const percent = ((clamped - min) / range) * 100;
  const pct = Math.round(percent * 100) / 100;

  const commit = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const stepped = Math.round((min + ratio * range) / step) * step;
      onChange?.(Math.min(max, Math.max(min, stepped)));
    },
    [min, max, range, step, onChange]
  );

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setGrabbing(true);
    onInteractChange?.(true);
    commit(e.clientX);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!grabbing || disabled) return;
    commit(e.clientX);
  }

  function endGrab(e: React.PointerEvent<HTMLDivElement>) {
    if (!grabbing) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setGrabbing(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const big = step * 10;
    let next: number | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = clamped + step;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = clamped - step;
        break;
      case "PageUp":
        next = clamped + big;
        break;
      case "PageDown":
        next = clamped - big;
        break;
      case "Home":
        next = min;
        break;
      case "End":
        next = max;
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange?.(Math.min(max, Math.max(min, next)));
  }

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-valuetext={format(clamped)}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endGrab}
      onPointerCancel={endGrab}
      onPointerEnter={() => !disabled && onInteractChange?.(true)}
      onPointerLeave={(e) => {
        endGrab(e);
        if (!disabled) onInteractChange?.(false);
      }}
      onKeyDown={onKeyDown}
      onFocus={() => !disabled && onInteractChange?.(true)}
      onBlur={() => !disabled && onInteractChange?.(false)}
      className={cn(
        "relative flex h-6 w-full touch-none select-none items-center outline-none",
        "focus-visible:[&_[data-thumb]]:ring-2 focus-visible:[&_[data-thumb]]:ring-brand/70",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className
      )}
    >
      {/* rail */}
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/[0.08] ring-1 ring-inset ring-white/5" />

      {/* filled portion */}
      <div
        className="absolute left-0 h-1.5 rounded-full"
        style={{
          width: `${pct}%`,
          backgroundImage: "linear-gradient(90deg, #7c6cff 0%, #5b8cff 100%)",
          boxShadow: "0 0 12px rgba(124,108,255,0.45)",
        }}
      />

      {/* thumb + tooltip, anchored at the filled edge */}
      <div
        className="absolute top-1/2 z-10"
        style={{ left: `${pct}%`, transform: "translate(-50%, -50%)" }}
      >
        {/* tooltip */}
        <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2">
          <motion.div
            initial={false}
            animate={{ y: grabbing ? -2 : 0, scale: grabbing ? 1.06 : 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="relative whitespace-nowrap rounded-lg border border-white/10 bg-[#16161f] px-2.5 py-1 text-xs font-semibold tabular-nums text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.85)]"
          >
            {format(clamped)}
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-white/10 bg-[#16161f]" />
          </motion.div>
        </div>

        {/* thumb */}
        <motion.div
          data-thumb
          initial={false}
          animate={{ scale: grabbing ? 1.18 : 1 }}
          whileHover={disabled ? undefined : { scale: grabbing ? 1.18 : 1.08 }}
          transition={{ type: "spring", stiffness: 480, damping: 26, mass: 0.6 }}
          className="h-5 w-5 rounded-full border border-white/60 ring-offset-2 ring-offset-panel"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 28%, #ffffff 0%, #e6e6ef 45%, #b7b7cb 100%)",
            boxShadow: grabbing
              ? "0 0 0 6px rgba(124,108,255,0.18), 0 4px 14px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.9)"
              : "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.9)",
          }}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function groupThousands(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function tierFor(v: number): string {
  if (v < 100) return "Starter";
  if (v < 300) return "Growth";
  return "Scale";
}

export default function Demo() {
  const [value, setValueState] = useState(280);
  const valueRef = useRef(280);
  const [interacting, setInteracting] = useState(false);

  const setValue = useCallback((v: number) => {
    valueRef.current = v;
    setValueState(v);
  }, []);

  // Idle: ease the thumb between a few price points on a gentle loop.
  useEffect(() => {
    if (interacting) return;
    const waypoints = [160, 360, 220, 420, 120];
    let idx = 0;
    let stopped = false;
    let controls: AnimationPlaybackControls | undefined;

    const run = () => {
      if (stopped) return;
      const target = waypoints[idx % waypoints.length];
      idx += 1;
      controls = animate(valueRef.current, target, {
        duration: 2.4,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setValue(Math.round(v / 5) * 5),
        onComplete: run,
      });
    };

    const t = setTimeout(run, 600);
    return () => {
      stopped = true;
      clearTimeout(t);
      controls?.stop();
    };
  }, [interacting, setValue]);

  const tier = tierFor(value);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-panel p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
        {/* header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-brand-soft">
              <Wallet className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Monthly budget</h3>
              <p className="mt-0.5 text-xs text-zinc-500">Set your plan spend</p>
            </div>
          </div>
          <motion.span
            key={tier}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-full border border-brand/25 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand-soft"
          >
            {tier}
          </motion.span>
        </div>

        {/* headline value */}
        <div className="mt-6 flex items-end gap-1.5">
          <span className="text-4xl font-semibold tabular-nums tracking-tight text-white">
            ${groupThousands(value)}
          </span>
          <span className="mb-1 text-sm text-zinc-500">/ month</span>
        </div>

        {/* slider */}
        <div className="mt-9">
          <RangeSlider
            min={20}
            max={500}
            step={5}
            value={value}
            onChange={setValue}
            onInteractChange={setInteracting}
            format={(v) => `$${groupThousands(v)}`}
            label="Monthly budget"
          />
          <div className="mt-3 flex items-center justify-between text-[11px] font-medium tabular-nums text-zinc-600">
            <span>$20</span>
            <span>$500</span>
          </div>
        </div>

        {/* derived value */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-brand-soft" strokeWidth={2} />
            Included credits
          </div>
          <span className="text-sm font-semibold tabular-nums text-white">
            {groupThousands(value * 40)}
          </span>
        </div>
      </div>
    </div>
  );
}
