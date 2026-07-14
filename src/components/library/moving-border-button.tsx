"use client";

import { cn } from "@/lib/utils";

export function MovingBorderButton({
  children,
  className,
  duration = 3000,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex overflow-hidden rounded-xl p-[1.5px]",
        className
      )}
      style={{ ["--mb-duration" as string]: `${duration}ms` }}
    >
      <span
        className="absolute inset-[-1000%] animate-[spin_var(--mb-duration)_linear_infinite]"
        style={{
          animationDuration: `${duration}ms`,
          background:
            "conic-gradient(from 90deg at 50% 50%, transparent 0%, #5b8cff 15%, #7c6cff 25%, transparent 40%)",
        }}
        aria-hidden
      />
      <span className="relative z-10 inline-flex w-full items-center justify-center rounded-[11px] bg-surface px-6 py-3 text-sm font-medium text-white">
        {children}
      </span>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <button className="cursor-pointer bg-transparent">
        <MovingBorderButton>Join the waitlist</MovingBorderButton>
      </button>
    </div>
  );
}
