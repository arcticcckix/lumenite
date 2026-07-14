"use client";

import { useId, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Liquid Glass, an Apple-style translucent glass surface.
 * Layers that create the effect:
 *  1. backdrop blur + saturation (the frost)
 *  2. an SVG displacement filter on the backdrop (the refraction / lensing),
 *     progressive enhancement; browsers without it just show the frost
 *  3. inset specular edges (bright top rim, faint full ring)
 *  4. a cursor-tracked highlight that slides across the surface
 */
export function LiquidGlass({
  children,
  className,
  refraction = true,
}: {
  children: React.ReactNode;
  className?: string;
  refraction?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const mx = useSpring(useMotionValue(50), { stiffness: 120, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  }

  const highlight = useMotionTemplate`radial-gradient(180px circle at ${mx}% ${my}%, rgba(255,255,255,0.35), transparent 60%)`;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "group relative overflow-hidden rounded-[28px]",
        "bg-white/[0.08] backdrop-blur-xl backdrop-saturate-150",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.55), inset 0 0 0 1px rgba(255,255,255,0.10), 0 20px 50px -20px rgba(0,0,0,0.7)",
      }}
    >
      {/* refraction layer (Chromium supports url() backdrop-filter; others no-op) */}
      {refraction && (
        <>
          <svg className="absolute h-0 w-0" aria-hidden>
            <filter id={`glass-${id}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.012"
                numOctaves={2}
                seed={7}
                result="noise"
              />
              <feGaussianBlur in="noise" stdDeviation="1.4" result="soft" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="soft"
                scale={22}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </svg>
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backdropFilter: `url(#glass-${id})` }}
          />
        </>
      )}

      {/* top specular sheen */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-70"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)",
        }}
      />

      {/* cursor-tracked highlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ background: highlight, opacity: hovering ? 1 : 0 }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ---------------- Demo ---------------- */

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-8">
      {/* colorful "wallpaper" so the glass translucency + refraction read */}
      <div className="absolute inset-0">
        <div className="absolute -left-10 top-6 h-56 w-56 rounded-full bg-[#ff5f8f] blur-[70px]" />
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#7c6cff] blur-[70px]" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-[#22d3ee] blur-[80px]" />
        <div className="absolute bottom-4 right-8 h-40 w-40 rounded-full bg-[#f5c451] blur-[70px]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <LiquidGlass className="w-[300px] p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-lg shadow-inner">
              ✦
            </div>
            <div>
              <div className="text-[15px] font-semibold text-white">
                Liquid Glass
              </div>
              <div className="text-xs text-white/70">Apple-style material</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Real backdrop refraction, a specular edge, and a highlight that
            tracks your cursor. Move over the card to see it bend the light
            behind it.
          </p>
          <div className="mt-5 flex gap-2">
            <button className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white">
              Get started
            </button>
            <button className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/20">
              Learn more
            </button>
          </div>
        </LiquidGlass>
      </motion.div>
    </div>
  );
}
