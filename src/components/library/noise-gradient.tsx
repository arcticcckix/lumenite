"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function NoiseGradient({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const filterId = useId();

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-line bg-void",
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 30% 20%, rgba(124,108,255,0.5), transparent 60%), radial-gradient(ellipse 80% 60% at 80% 80%, rgba(91,140,255,0.4), transparent 60%), #08080C",
        }}
      />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-25 mix-blend-overlay">
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <NoiseGradient>
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold text-transparent">
          Noise Gradient
        </h3>
        <p className="max-w-xs text-sm text-zinc-400">
          A grainy gradient backdrop using an SVG turbulence filter.
        </p>
      </div>
    </NoiseGradient>
  );
}
