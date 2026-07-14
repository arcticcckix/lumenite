"use client";

import { useRef, useState } from "react";
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
      {/* After (base layer) */}
      <div className="absolute inset-0">{after}</div>
      <span className="absolute right-3 top-3 z-10 rounded-md bg-black/50 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
        {afterLabel}
      </span>

      {/* Before (clipped layer) */}
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        {before}
        <span className="absolute left-3 top-3 z-10 rounded-md bg-black/50 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
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

function Panel({
  gradient,
  label,
}: {
  gradient: string;
  label: string;
}) {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: gradient }}
    >
      <span className="text-sm font-semibold tracking-wide text-white/80">
        {label}
      </span>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <CompareSlider
        className="max-w-md"
        before={<Panel gradient="linear-gradient(135deg, #1a1a24, #3a3a4a)" label="Original" />}
        after={
          <Panel
            gradient="linear-gradient(135deg, #7c6cff, #5b8cff)"
            label="Enhanced"
          />
        }
      />
    </div>
  );
}
