"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * A product/link card that tilts back in 3D on hover while a glowing map pin
 * and its floating label rise above the surface. At rest it keeps a slow idle
 * float so the perspective stays legible in a static preview.
 */
export function ThreeDPin({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const px = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), {
    stiffness: 150,
    damping: 18,
    mass: 0.4,
  });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
  }

  function onLeave() {
    setHovered(false);
    px.set(0);
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* padded block reserves vertical room so the rising pin is never clipped */}
      <div className="relative pt-[128px]">
        <div
          ref={ref}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative"
        >
          {/* ambient floor glow */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[36px]"
            animate={{ opacity: hovered ? 0.95 : 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              background:
                "radial-gradient(60% 60% at 50% 42%, rgba(124,108,255,0.28), transparent 72%)",
            }}
          />

          <PinOverlay hovered={hovered} label={label} />

          {/* tilt + idle float layer */}
          <motion.div
            className="rounded-2xl"
            style={{ transformStyle: "preserve-3d" }}
            animate={
              hovered
                ? {
                    rotateX: 22,
                    y: -10,
                    scale: 1.02,
                    boxShadow:
                      "0 45px 90px -25px rgba(124,108,255,0.35), 0 30px 60px -30px rgba(0,0,0,0.9)",
                  }
                : {
                    rotateX: [10, 13, 10],
                    y: [0, -8, 0],
                    scale: 1,
                    boxShadow: "0 30px 60px -30px rgba(0,0,0,0.85)",
                  }
            }
            transition={
              hovered
                ? { duration: 0.6, ease: EASE }
                : { duration: 7, repeat: Infinity, ease: "easeInOut" }
            }
          >
            {/* mouse yaw layer */}
            <motion.div
              style={{ rotateY, transformStyle: "preserve-3d" }}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#14141f] to-[#0b0b12] p-5",
                className
              )}
            >
              {/* thin bright top edge */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)",
                }}
              />
              {children}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function PinOverlay({ hovered, label }: { hovered: boolean; label: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 z-30 flex h-[128px] w-full -translate-x-1/2 -translate-y-full flex-col items-center justify-between"
    >
      {/* floating label + pin head */}
      <motion.div
        className="flex flex-col items-center gap-2"
        animate={hovered ? { y: 0, opacity: 1 } : { y: 16, opacity: 0.72 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div
          className="flex items-center gap-2 rounded-full border border-white/10 bg-panel/80 px-3.5 py-1.5 backdrop-blur-md"
          style={{ boxShadow: "0 14px 40px -14px rgba(124,108,255,0.6)" }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glow/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-glow" />
          </span>
          <span className="text-[12px] font-medium tracking-tight text-zinc-100">
            {label}
          </span>
        </div>

        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-full border border-brand/40 bg-brand/15 text-glow backdrop-blur"
          animate={{
            boxShadow: hovered
              ? "0 0 26px rgba(124,108,255,0.8)"
              : "0 0 12px rgba(124,108,255,0.35)",
          }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <MapPin className="h-4 w-4" strokeWidth={2.2} />
        </motion.div>
      </motion.div>

      {/* connecting beam */}
      <motion.div
        className="w-px flex-1"
        style={{
          transformOrigin: "bottom",
          background:
            "linear-gradient(to top, transparent, rgba(124,108,255,0.15), #7c6cff 55%, #5b8cff)",
        }}
        animate={hovered ? { scaleY: 1, opacity: 1 } : { scaleY: 0.55, opacity: 0.4 }}
        transition={{ duration: 0.5, ease: EASE }}
      />

      {/* dropped-pin ground marker with radar ripple */}
      <div className="relative flex h-4 w-24 items-center justify-center">
        <span
          className="absolute h-1.5 w-1.5 rounded-full bg-glow"
          style={{ boxShadow: "0 0 12px rgba(91,140,255,0.9)" }}
        />
        <motion.span
          className="absolute rounded-full border border-brand/50"
          style={{ width: 56, height: 16 }}
          animate={{ scale: [0.4, 1.3], opacity: [0.6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          className="absolute rounded-full border border-brand/40"
          style={{ width: 56, height: 16 }}
          animate={{ scale: [0.4, 1.3], opacity: [0.6, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1.3,
          }}
        />
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <ThreeDPin label="lumenite.dev">
      <div className="w-72 max-w-full">
        {/* mini product preview, gently floating */}
        <div className="relative mb-5 h-28 overflow-hidden rounded-xl border border-white/10 bg-[#08080e]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(130px circle at 50% 118%, rgba(124,108,255,0.35), transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex w-40 flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3 backdrop-blur">
              <div className="h-2 w-1/2 rounded-full bg-gradient-to-r from-brand to-glow" />
              <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
              <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
            </div>
          </motion.div>
        </div>

        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-soft">
          React components
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
          Motion that feels engineered
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Drop-in cards, heroes, and effects tuned to sixty frames a second.
          Ship the interface and skip the design review.
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
          <span className="text-xs text-zinc-500">Free and Pro tiers</span>
          <span className="flex items-center gap-1 text-xs font-medium text-white">
            Explore
            <ArrowUpRight className="h-3.5 w-3.5 text-brand-soft" strokeWidth={2.4} />
          </span>
        </div>
      </div>
    </ThreeDPin>
  );
}
