"use client";

import { cn } from "@/lib/utils";

export function AuroraBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-void",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-[10%] animate-aurora opacity-40 blur-3xl"
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg, rgba(124,108,255,0.4) 0%, rgba(91,140,255,0.3) 12%, transparent 22%, rgba(124,108,255,0.35) 32%, transparent 44%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(91,140,255,0.15), transparent 70%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function Demo() {
  return (
    <AuroraBackground>
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold text-transparent">
          Aurora Background
        </h3>
        <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
          A soft, animated gradient glow drifting behind your content.
        </p>
      </div>
    </AuroraBackground>
  );
}
