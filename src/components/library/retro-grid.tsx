"use client";

import { cn } from "@/lib/utils";

export function RetroGrid({
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
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 42%, rgba(124,108,255,0.28), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 30%, #050508 92%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-[42%] h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(91,140,255,0.8), transparent)",
          boxShadow: "0 0 30px 4px rgba(91,140,255,0.6)",
        }}
      />
      <div
        className="absolute inset-x-0 top-[42%] bottom-0 overflow-hidden"
        style={{ perspective: "220px" }}
      >
        <div
          className="absolute inset-x-[-50%] top-0 h-[200%] animate-[retro-scroll_3.5s_linear_infinite]"
          style={{
            transform: "rotateX(75deg)",
            transformOrigin: "top center",
            backgroundImage:
              "linear-gradient(rgba(124,108,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(124,108,255,0.55) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>
      <div className="relative z-10 px-6 text-center">{children}</div>
      <style>{`
        @keyframes retro-scroll {
          from { background-position: 0 0; }
          to { background-position: 0 48px; }
        }
      `}</style>
    </div>
  );
}

export default function Demo() {
  return (
    <RetroGrid>
      <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
        Retro Grid
      </h3>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
        A synthwave horizon, receding forever, scrolling toward you.
      </p>
    </RetroGrid>
  );
}
