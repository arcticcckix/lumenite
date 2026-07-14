"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function HoverBorderGradient({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-[1.5px]",
        containerClassName
      )}
    >
      {/* faint static ring so the border reads even before the arc arrives */}
      <div className="absolute inset-0 rounded-2xl border border-white/10" />

      {/* oversized rotating conic gradient, clipped to the rounded rect by
          overflow-hidden, so the border light never pokes at the corners.
          Always visible, brighter on hover. */}
      <motion.div
        className="absolute -inset-1/3 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(124,108,255,0.15) 30deg, #7c6cff 70deg, #5b8cff 110deg, rgba(91,140,255,0.15) 150deg, transparent 200deg, transparent 360deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />

      <div
        className={cn(
          "relative rounded-[calc(1rem-1.5px)] bg-panel p-8 transition-shadow duration-500 group-hover:shadow-[0_0_40px_-8px_rgba(124,108,255,0.5)]",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <HoverBorderGradient containerClassName="max-w-sm">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand-soft">
          ⟡
        </div>
        <h3 className="text-lg font-semibold text-white">
          A living gradient border
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          A soft arc of light traces the card&apos;s edge on a loop, then
          brightens and glows when you hover.
        </p>
      </HoverBorderGradient>
    </div>
  );
}
