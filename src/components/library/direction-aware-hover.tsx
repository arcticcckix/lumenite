"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Direction = "top" | "bottom" | "left" | "right";

const EASE = [0.16, 1, 0.3, 1] as const;

function getDirection(
  e: React.MouseEvent<HTMLDivElement>,
  rect: DOMRect
): Direction {
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const angle = (Math.atan2(y, x) * 180) / Math.PI;
  if (angle >= -45 && angle < 45) return "right";
  if (angle >= 45 && angle < 135) return "bottom";
  if (angle >= -135 && angle < -45) return "top";
  return "left";
}

const offscreen: Record<Direction, { x: string; y: string }> = {
  top: { x: "0%", y: "-101%" },
  bottom: { x: "0%", y: "101%" },
  left: { x: "-101%", y: "0%" },
  right: { x: "101%", y: "0%" },
};

export function DirectionAwareHover({
  title,
  subtitle,
  eyebrow = "Collection",
  cta = "Open collection",
  className,
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
  cta?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<Direction>("bottom");
  const [hovering, setHovering] = useState(false);

  function handleEnter(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setDirection(getDirection(e, rect));
    setHovering(true);
  }

  function handleLeave(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setDirection(getDirection(e, rect));
    setHovering(false);
  }

  const from = offscreen[direction];

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "group relative aspect-video w-full max-w-sm overflow-hidden rounded-[20px] border border-white/10 bg-panel",
        className
      )}
    >
      {/* Living background: slow-drifting light, alive even at rest */}
      <div className="absolute inset-0 bg-gradient-to-br from-panel via-void to-black" />
      <motion.div
        aria-hidden
        className="absolute -left-16 -top-16 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,108,255,0.42), transparent 68%)" }}
        animate={{ x: [0, 26, 0], y: [0, -18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-20 -right-14 h-60 w-60 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(91,140,255,0.32), transparent 66%)" }}
        animate={{ x: [0, -22, 0], y: [0, 16, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 19, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Thin diagonal sheen sweeping across on a slow loop */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
        }}
        animate={{ x: ["0%", "320%"] }}
        transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.5 }}
      />

      {/* Fine grid + bright top edge for that premium-panel feel */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, #000 30%, transparent 78%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Persistent label: the card reads as a real object, not an empty box */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-brand"
              animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
              transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-soft" />
          </span>
          <span className="text-[11px] font-medium tracking-wide text-zinc-300">
            {eyebrow}
          </span>
        </div>

        <motion.div
          animate={{ opacity: hovering ? 0 : 1, y: hovering ? 6 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <h3 className="text-[15px] font-semibold text-white">{title}</h3>
          <p className="mt-0.5 text-xs text-zinc-400">Hover from any edge</p>
        </motion.div>
      </div>

      {/* Direction-aware overlay: slides in from the edge the cursor crossed */}
      <motion.div
        initial={false}
        animate={hovering ? { x: "0%", y: "0%" } : { x: from.x, y: from.y }}
        transition={{ type: "tween", ease: EASE, duration: 0.42 }}
        className="absolute inset-0 flex flex-col justify-end bg-black/55 p-5 backdrop-blur-[3px]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(124,108,255,0.28),transparent_62%)]" />
        <motion.div
          className="relative"
          animate={hovering ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: EASE, delay: hovering ? 0.08 : 0 }}
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-soft">
            {eyebrow}
          </span>
          <h3 className="mt-1.5 text-lg font-semibold leading-tight text-white">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
            {subtitle}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white">
            <span>{cta}</span>
            <ArrowUpRight className="h-4 w-4 text-brand-soft transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <DirectionAwareHover
        eyebrow="Aurora"
        title="Northern Lights preset"
        subtitle="Twelve layered gradients tuned for dark dashboards. The overlay enters from whichever edge your cursor crosses."
        cta="Open collection"
      />
    </div>
  );
}
