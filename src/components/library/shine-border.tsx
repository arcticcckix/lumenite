"use client";

import { motion } from "framer-motion";
import { Gem, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ShineBorderProps = {
  children?: React.ReactNode;
  className?: string;
  /** Seconds for one full trip around the border. */
  duration?: number;
  /** Thickness of the crisp highlight ring, in pixels. */
  borderWidth?: number;
  /** Corner radius, in pixels. Shared by the card and every ring so nothing pokes. */
  radius?: number;
  /** Three colors: soft leading, core, trailing. */
  shineColor?: string[];
};

export function ShineBorder({
  children,
  className,
  duration = 7,
  borderWidth = 1,
  radius = 22,
  shineColor = ["#a99dff", "#7c6cff", "#5b8cff"],
}: ShineBorderProps) {
  const c0 = shineColor[0] ?? "#a99dff";
  const c1 = shineColor[1] ?? "#7c6cff";
  const c2 = shineColor[2] ?? "#5b8cff";

  // Mask that keeps only the ring (subtracts the inner content box), following
  // the rounded rect exactly so the traveling shine can never escape a corner.
  const ringMask: React.CSSProperties = {
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
  };

  // A soft, wide, blurred pass. Reads as bloom hugging the edge.
  const bloom = `conic-gradient(from 0deg, transparent 0 16%, ${c2}00 18%, ${c2} 25%, transparent 34% 64%, ${c0} 70%, ${c1} 75%, ${c0} 80%, transparent 88% 100%)`;

  // The crisp pass: a secondary soft glint plus a bright specular white core.
  const shine = `conic-gradient(from 0deg, transparent 0 19%, ${c2}00 21%, ${c2} 24%, transparent 29% 67%, ${c1}00 69%, ${c0} 72.5%, #ffffff 75%, ${c1} 77.5%, ${c2}00 81%, transparent 84% 100%)`;

  const spin = {
    animate: { rotate: 360 },
    transition: { duration, repeat: Infinity, ease: "linear" as const },
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden border border-line bg-panel",
        className
      )}
      style={{ borderRadius: radius }}
    >
      {/* Bloom ring, blurred and synced under the crisp shine. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          ...ringMask,
          borderRadius: radius,
          padding: borderWidth + 3,
          filter: "blur(5px)",
          opacity: 0.6,
        }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 aspect-square w-[300%]"
          style={{ marginLeft: "-150%", marginTop: "-150%", background: bloom }}
          {...spin}
        />
      </div>

      {/* Crisp specular highlight ring. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ ...ringMask, borderRadius: radius, padding: borderWidth }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 aspect-square w-[300%]"
          style={{ marginLeft: "-150%", marginTop: "-150%", background: shine }}
          {...spin}
        />
      </div>

      {/* Thin glass highlight along the top inner edge. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      {/* Faint stage glow so the card sits in a pool of light at rest. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(420px circle at 50% 42%, rgba(124,108,255,0.10), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        <ShineBorder>
          <div className="p-8">
            <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-brand-soft">
              <Gem className="h-5 w-5" strokeWidth={1.75} />
            </div>

            <h3 className="text-lg font-semibold tracking-tight text-white">
              Light that traces the edge
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              A single specular highlight travels the border, thin and bright.
              It stays clipped to the radius, so the corners never catch or poke.
            </p>

            <div className="mt-7 flex items-center gap-2 border-t border-white/[0.06] pt-4">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-brand-soft"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.82, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Zap className="h-3 w-3 text-zinc-500" strokeWidth={1.75} />
                Continuous loop, runs on GPU transform
              </span>
            </div>
          </div>
        </ShineBorder>
      </motion.div>
    </div>
  );
}
