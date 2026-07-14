"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * CometCard, a 3D tilt card with cursor parallax and a comet/aurora sheen
 * that sweeps across the surface on a continuous loop. It looks alive at rest
 * (the sweep + aurora drift never stop) and gains depth + a cursor-tracked
 * glow on hover.
 */
export function CometCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spring = { stiffness: 160, damping: 20, mass: 0.4 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [9, -9]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), spring);
  const glowX = useSpring(useTransform(x, [-0.5, 0.5], [18, 82]), spring);
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], [8, 74]), spring);

  const pointerGlow = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(124,108,255,0.20), transparent 68%)`;

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div style={{ perspective: 1200 }} className={cn("relative", className)}>
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-panel shadow-[0_30px_80px_-40px_rgba(80,90,220,0.55)]"
      >
        {/* base wash */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_-15%,rgba(124,108,255,0.14),transparent_58%)]" />

        {/* slow aurora drift, keeps the card alive at rest */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-1/3 opacity-40 blur-2xl"
          style={{
            background:
              "conic-gradient(from 130deg at 42% 32%, rgba(124,108,255,0.42), transparent 28%, rgba(91,140,255,0.4) 52%, transparent 74%, rgba(169,157,255,0.34))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />

        {/* cursor-tracked glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: pointerGlow }}
        />

        {/* content */}
        <div
          style={{ transformStyle: "preserve-3d" }}
          className="relative z-10"
        >
          {children}
        </div>

        {/* comet aurora sheen, sweeps across the whole surface on a loop */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-[-45%] left-0 z-20 w-[42%] mix-blend-screen"
          style={{
            rotate: 20,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 38%, rgba(178,198,255,0.55) 50%, rgba(255,255,255,0.05) 62%, transparent)",
          }}
          animate={{ x: ["-160%", "320%"] }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            repeatDelay: 1.6,
            ease: EASE,
          }}
        />

        {/* comet head + tail streak */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-20 h-[3px] w-16 mix-blend-screen"
          style={{
            rotate: 50,
            transformOrigin: "left center",
            borderRadius: 999,
            background:
              "linear-gradient(90deg, transparent, rgba(120,150,255,0.65), rgba(255,255,255,0.95))",
            boxShadow: "0 0 16px 2px rgba(140,170,255,0.7)",
          }}
          animate={{
            left: ["-16%", "12%", "88%", "116%"],
            top: ["-14%", "8%", "94%", "120%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            repeatDelay: 3.2,
            ease: "linear",
            times: [0, 0.12, 0.88, 1],
          }}
        />

        {/* glossy rim highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 rounded-[24px]"
          style={{
            padding: 1,
            background:
              "linear-gradient(140deg, rgba(255,255,255,0.55), rgba(255,255,255,0.05) 30%, transparent 56%, rgba(124,108,255,0.28))",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        <div className="pointer-events-none absolute inset-x-6 top-0 z-30 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
      </motion.div>
    </div>
  );
}

/* ------------------------------ Demo ------------------------------ */

type Twinkle = {
  left: number;
  top: number;
  size: number;
  delay: number;
  dur: number;
};

export default function Demo() {
  const stars = useMemo<Twinkle[]>(() => {
    const seed = (i: number, k: number) =>
      Math.abs(Math.sin((i + 1) * 12.9898 + k * 78.233)) % 1;
    const round = (n: number) => Math.round(n * 1000) / 1000;
    return Array.from({ length: 11 }, (_, i) => ({
      left: round(seed(i, 1) * 100),
      top: round(seed(i, 2) * 66),
      size: round(0.8 + seed(i, 3) * 1.6),
      delay: round(seed(i, 4) * 3.5),
      dur: round(2.6 + seed(i, 5) * 2.8),
    }));
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <CometCard className="w-[340px]">
        {/* hero visual */}
        <div className="relative h-44 overflow-hidden">
          {/* twinkling starfield */}
          {stars.map((s, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
              }}
              animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.8, 1.15, 0.8] }}
              transition={{
                duration: s.dur,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* pedestal glow under the orb */}
          <div className="pointer-events-none absolute bottom-2 left-1/2 h-16 w-40 -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(124,108,255,0.55),transparent)] blur-md" />

          {/* the product, an aurora glass orb, rendered in pure CSS */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2"
            style={{ z: 55 }}
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 34% 30%, #eef1ff 0%, #a99dff 26%, #5b8cff 58%, #2b2f6b 82%, #12132b 100%)",
                boxShadow:
                  "0 0 50px 6px rgba(124,108,255,0.55), inset -8px -10px 22px rgba(9,10,30,0.75), inset 6px 8px 16px rgba(255,255,255,0.35)",
              }}
            />
            {/* specular highlight */}
            <div className="absolute left-[22%] top-[16%] h-5 w-8 -rotate-[24deg] rounded-full bg-white/70 blur-[3px]" />
          </motion.div>

          {/* status badge */}
          <div
            className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/90 backdrop-blur-md"
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            In stock
          </div>
        </div>

        {/* body */}
        <div
          className="relative rounded-b-[24px] bg-gradient-to-t from-panel via-panel/95 to-panel/60 p-5"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="flex items-center justify-between"
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-brand-soft">
              Ambient Lighting
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              4.9
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-500">128</span>
            </span>
          </div>

          <h3
            className="mt-2 text-lg font-semibold text-white"
            style={{ transform: "translateZ(38px)" }}
          >
            Halo Aurora Lamp
          </h3>
          <p
            className="mt-1.5 text-sm leading-relaxed text-zinc-400"
            style={{ transform: "translateZ(22px)" }}
          >
            A hand-blown glass orb that drifts your room through slow aurora
            light. App-tuned scenes, 16M colors, USB-C.
          </p>

          <div
            className="mt-4 flex items-center justify-between"
            style={{ transform: "translateZ(34px)" }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-white">$189</span>
              <span className="text-sm text-zinc-500 line-through">$249</span>
            </div>
            <button
              type="button"
              className="group/btn inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-glow px-4 py-2 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(124,108,255,0.9)] transition-transform duration-300 hover:scale-[1.03] active:scale-95"
            >
              Add to bag
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </CometCard>
    </div>
  );
}
