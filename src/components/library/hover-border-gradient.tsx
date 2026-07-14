"use client";

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
        "group relative rounded-2xl p-[1.5px]",
        containerClassName
      )}
      style={{
        background:
          "conic-gradient(from 0deg, transparent, transparent)",
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-spin-slow"
        style={{
          background:
            "conic-gradient(from 0deg, #7c6cff, #5b8cff, transparent 40%, transparent 60%, #7c6cff)",
        }}
      />
      <div
        className={cn(
          "relative rounded-2xl border border-line bg-panel p-8",
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
      <style>{`
        @keyframes spin-slow-kf { to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow-kf 3s linear infinite; }
      `}</style>
      <HoverBorderGradient containerClassName="max-w-sm">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/15 text-brand-soft">
          ⟡
        </div>
        <h3 className="text-lg font-semibold text-white">
          A border that spins to life
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Hover to reveal an animated conic gradient tracing the card&apos;s
          edge, then fade it back to rest.
        </p>
      </HoverBorderGradient>
    </div>
  );
}
