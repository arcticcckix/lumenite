import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Lumenite mark — a curved 4-point pinwheel star (matches the brand logo art).
 * `variant` controls the fill: gradient (default), white, or black.
 */
export function LumeniteMark({
  size = 32,
  variant = "gradient",
  spin = false,
  className,
}: {
  size?: number;
  variant?: "gradient" | "white" | "black";
  /** slowly rotate the mark like a spinning star */
  spin?: boolean;
  className?: string;
}) {
  const id = useId();
  const fill =
    variant === "white"
      ? "#ffffff"
      : variant === "black"
        ? "#050508"
        : `url(#lm-${id})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={cn(
        spin && "motion-safe:animate-spin-slow [transform-origin:50%_50%]",
        className
      )}
      aria-hidden
    >
      {variant === "gradient" && (
        <defs>
          <linearGradient id={`lm-${id}`} x1="14" y1="10" x2="86" y2="90">
            <stop offset="0%" stopColor="#c8bcff" />
            <stop offset="50%" stopColor="#7c6cff" />
            <stop offset="100%" stopColor="#4f83ff" />
          </linearGradient>
        </defs>
      )}
      {/* One curved blade, rotated 4× around the centre, a pinwheel shuriken. */}
      {[0, 90, 180, 270].map((deg) => (
        <path
          key={deg}
          fill={fill}
          transform={`rotate(${deg} 50 50)`}
          d="M50 50 C 51 33 57 15 68 5 C 63 22 59 39 55 49 C 53 50 51 50 50 50 Z"
        />
      ))}
    </svg>
  );
}

export function LumeniteLogo({
  size = 30,
  showWordmark = true,
  className,
}: {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LumeniteMark size={size} />
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight">
          Lumenite<span className="text-brand-soft"> UI</span>
        </span>
      )}
    </span>
  );
}
