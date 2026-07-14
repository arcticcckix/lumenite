"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function CompareSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(50);
  const clipPath = useTransform(x, (v) => `inset(0 0 0 ${v}%)`);

  // Idle auto-sweep so the comparison is visible without dragging.
  useEffect(() => {
    if (dragging) return;
    let t = 0;
    const id = setInterval(() => {
      t += 1;
      x.set(Math.round((50 + 24 * Math.sin(t * 0.045)) * 100) / 100);
    }, 40);
    return () => clearInterval(id);
  }, [dragging, x]);

  function updateFromClientX(clientX: number) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    x.set(Math.min(100, Math.max(0, pct)));
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl border border-line",
        className
      )}
      onMouseMove={(e) => dragging && updateFromClientX(e.clientX)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={(e) => {
        if (dragging && e.touches[0]) updateFromClientX(e.touches[0].clientX);
      }}
      onTouchEnd={() => setDragging(false)}
    >
      {/* After (base layer, shows on the left of the divider) */}
      <div className="absolute inset-0">{after}</div>
      <span className="absolute left-3 top-3 z-10 rounded-md bg-black/50 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
        {afterLabel}
      </span>

      {/* Before (clipped layer, shows on the right of the divider) */}
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        {before}
        <span className="absolute right-3 top-3 z-10 rounded-md bg-black/50 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
          {beforeLabel}
        </span>
      </motion.div>

      {/* Handle */}
      <motion.div
        className="absolute inset-y-0 z-20 flex w-0 -translate-x-1/2 cursor-ew-resize items-center justify-center"
        style={{ left: useTransform(x, (v) => `${v}%`) }}
      >
        <div className="h-full w-[2px] bg-white/80" />
        <div
          onMouseDown={() => setDragging(true)}
          onTouchStart={() => setDragging(true)}
          className="absolute flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white text-void shadow-lg"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </motion.div>
    </div>
  );
}

/** A tiny mock UI that reads as flat/plain (before) or vivid/polished (after). */
function MockUi({ enhanced }: { enhanced: boolean }) {
  return (
    <div
      className="relative flex h-full w-full flex-col justify-center gap-3 overflow-hidden p-7"
      style={{
        background: enhanced
          ? "linear-gradient(135deg, #241f47, #143152)"
          : "#141419",
      }}
    >
      {enhanced && (
        <>
          <div className="absolute -left-8 -top-6 h-36 w-36 rounded-full bg-brand/40 blur-3xl" />
          <div className="absolute -bottom-8 right-0 h-32 w-32 rounded-full bg-glow/30 blur-3xl" />
        </>
      )}
      <div
        className={cn(
          "relative h-3.5 w-3/4 rounded-full",
          enhanced ? "bg-gradient-to-r from-brand-soft to-glow" : "bg-white/20"
        )}
      />
      <div
        className={cn(
          "relative h-2 w-1/2 rounded-full",
          enhanced ? "bg-white/45" : "bg-white/12"
        )}
      />
      <div className="relative mt-3 flex gap-2.5">
        <div
          className={cn(
            "h-9 w-24 rounded-lg",
            enhanced
              ? "bg-brand shadow-[0_0_22px_rgba(124,108,255,0.6)]"
              : "bg-white/10"
          )}
        />
        <div
          className={cn(
            "h-9 w-16 rounded-lg border",
            enhanced
              ? "border-white/20 bg-white/10"
              : "border-white/10 bg-transparent"
          )}
        />
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <CompareSlider
        className="max-w-md"
        beforeLabel="Original"
        afterLabel="Enhanced"
        before={<MockUi enhanced={false} />}
        after={<MockUi enhanced />}
      />
    </div>
  );
}
