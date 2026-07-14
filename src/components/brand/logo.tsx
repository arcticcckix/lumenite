import { cn } from "@/lib/utils";

const MARK_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/mark.png`;

/**
 * Lumenite mark — the brand shuriken star. Renders the real logo art
 * (public/mark.png) as a CSS mask so it can be recolored for the dark theme
 * and spun, while staying pixel-true to the supplied logo.
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
  const fill =
    variant === "white"
      ? "#ffffff"
      : variant === "black"
        ? "#050508"
        : "linear-gradient(135deg, #b9a5ff 0%, #8b5cf6 55%, #7c3aed 100%)";

  return (
    <span
      aria-hidden
      className={cn(
        "inline-block shrink-0",
        spin && "mark-spin-in [transform-origin:50%_50%]",
        className
      )}
      style={{
        width: size,
        height: size,
        background: fill,
        WebkitMaskImage: `url("${MARK_SRC}")`,
        maskImage: `url("${MARK_SRC}")`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
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
