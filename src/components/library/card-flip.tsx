"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { ArrowRight, Check, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Face: one glossy side of the card. backface-hidden so only the      */
/* forward-facing side is ever visible during the flip.                */
/* ------------------------------------------------------------------ */

function Face({
  children,
  back = false,
  className,
}: {
  children: React.ReactNode;
  back?: boolean;
  className?: string;
}) {
  return (
    <div
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
      }}
      className={cn(
        "absolute inset-0 flex flex-col overflow-hidden rounded-[26px] border border-white/10 bg-panel",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_20px_50px_-24px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      {/* bright top edge (the glossy rim) */}
      <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      {/* soft ambient bloom behind the content */}
      <div
        className={cn(
          "pointer-events-none absolute -top-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full blur-3xl",
          back ? "bg-glow/20" : "bg-brand/20"
        )}
      />
      {/* slow travelling sheen, keeps the surface alive at rest */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.07) 46%, transparent 62%)",
        }}
        animate={{ x: ["-130%", "130%"] }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1.6,
        }}
      />
      <div className="relative z-10 flex h-full flex-col p-6">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardFlip: reusable 3D flip primitive. Flips on hover; an optional    */
/* `flipped` prop lets a parent drive it (used by the demo loop). A     */
/* gentle pointer-tracked tilt gives it a tactile, physical feel.       */
/* ------------------------------------------------------------------ */

export function CardFlip({
  front,
  back,
  flipped,
  className,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const active = hovered || Boolean(flipped);

  const tiltX = useSpring(0, { stiffness: 140, damping: 16 });
  const tiltY = useSpring(0, { stiffness: 140, damping: 16 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * 9);
    tiltX.set(-py * 9);
  }

  function onMouseLeave() {
    tiltX.set(0);
    tiltY.set(0);
    setHovered(false);
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      className={cn("group relative", className)}
      style={{ perspective: 1600 }}
    >
      {/* ambient glow that lifts when the card is engaged */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[34px] bg-glow/10 blur-2xl"
        animate={{ opacity: active ? 0.85 : 0.35 }}
        transition={{ duration: 0.6, ease: EASE }}
      />

      {/* tilt layer */}
      <motion.div
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX: tiltX,
          rotateY: tiltY,
        }}
      >
        {/* flip layer */}
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: active ? 180 : 0 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <Face>{front}</Face>
          <Face back>{back}</Face>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo: a self-contained product card that flips on a gentle loop.    */
/* ------------------------------------------------------------------ */

const BARS = [46, 70, 58, 92, 64, 82, 52];
const PEAK = BARS.indexOf(Math.max(...BARS));

const FEATURES = [
  "Live event stream, no five minute delay",
  "Funnels and retention, ready out of the box",
  "Slack alerts the moment a metric moves",
  "Unlimited seats for the whole team",
];

function FrontFace() {
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-soft">
            <Radio size={17} strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
            Realtime analytics
          </span>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-medium tracking-wide text-zinc-400">
          Pro
        </span>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          Pulse
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
          See every signup, event, and dollar the moment it lands.
        </p>
      </div>

      {/* deterministic mini chart, gently breathing */}
      <div className="mt-auto flex h-16 items-end gap-2">
        {BARS.map((h, i) => (
          <motion.div
            key={i}
            className={cn(
              "flex-1 origin-bottom rounded-t-[3px]",
              i === PEAK
                ? "bg-gradient-to-t from-brand/40 to-brand-soft"
                : "bg-white/12"
            )}
            style={{ height: `${h}%` }}
            animate={{ scaleY: [1, 0.64, 1] }}
            transition={{
              duration: 2.6,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.16,
            }}
          />
        ))}
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-white/5 pt-4">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold text-white">$18</span>
          <span className="text-xs text-zinc-500">/ month</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
          Details
          <ArrowRight size={13} strokeWidth={2} />
        </div>
      </div>
    </>
  );
}

function BackFace() {
  return (
    <>
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-white">
          Inside Pulse Pro
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          Everything in Free, and then some.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {FEATURES.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-soft">
              <Check size={11} strokeWidth={2.5} />
            </span>
            <span className="text-[13px] leading-snug text-zinc-300">{f}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(124,108,255,0.7)] transition-colors duration-200 hover:bg-brand-soft"
      >
        Start 14 day trial
        <ArrowRight size={15} strokeWidth={2.25} />
      </button>
      <p className="mt-2.5 text-center text-[11px] text-zinc-500">
        No card required. Cancel anytime.
      </p>
    </>
  );
}

export default function Demo() {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setFlipped((f) => !f), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <CardFlip
        flipped={flipped}
        className="h-[380px] w-[310px]"
        front={<FrontFace />}
        back={<BackFace />}
      />
    </div>
  );
}
