"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BorderBeam({
  children,
  className,
  duration = 6,
  colorFrom = "#7c6cff",
  colorTo = "#5b8cff",
}: {
  children?: React.ReactNode;
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-line bg-panel p-8",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        style={{
          padding: 1,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 aspect-square w-[220%]"
          style={{
            marginLeft: "-110%",
            marginTop: "-110%",
            background: `conic-gradient(from 0deg, transparent 0%, transparent 78%, ${colorFrom} 88%, ${colorTo} 92%, ${colorFrom} 96%, transparent 100%)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <BorderBeam className="max-w-sm" duration={5}>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/15 text-brand-soft">
          ◈
        </div>
        <h3 className="text-lg font-semibold text-white">
          A beam that never stops
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          A soft light traces the border continuously, giving the panel a
          quiet, always-alive presence.
        </p>
      </BorderBeam>
    </div>
  );
}
