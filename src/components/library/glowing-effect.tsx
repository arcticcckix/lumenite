"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Gauge, ShieldCheck, GitBranch, Activity } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

export interface GlowingEffectProps {
  children?: React.ReactNode;
  className?: string;
  /** Distance in px from the card edge at which the glow starts to activate. */
  proximity?: number;
  /** Thickness of the crisp border light, in px. */
  borderWidth?: number;
  /** Half-width of the bright arc, in degrees. Larger reads softer. */
  spread?: number;
  /** Idle rotation speed of the resting sweep, in degrees per second. */
  idleSpeed?: number;
  /** Glow opacity when the cursor is nowhere near (the resting sweep). */
  restOpacity?: number;
  colorFrom?: string;
  colorTo?: string;
  /** Phase offset so a grid of cards does not sweep in lockstep. */
  seed?: number;
}

/**
 * A bright gradient arc that rides the card border and points toward the
 * cursor when it is near. At rest the arc sweeps around the edge on a slow
 * loop so a static card still looks alive.
 */
export function GlowingEffect({
  children,
  className,
  proximity = 100,
  borderWidth = 1.5,
  spread = 20,
  idleSpeed = 30,
  restOpacity = 0.42,
  colorFrom = "#7c6cff",
  colorTo = "#5b8cff",
  seed = 0,
}: GlowingEffectProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sharpRef = useRef<HTMLDivElement>(null);
  const softRef = useRef<HTMLDivElement>(null);

  // Deterministic starting angle so SSR and client agree and each card in a
  // grid begins its sweep from a different place.
  const seedAngle = useMemo(
    () => Math.round(Math.abs(Math.sin((seed + 1) * 12.9898)) * 360),
    [seed]
  );

  const gradient = useMemo(() => {
    const half = Math.round(spread);
    const fade = Math.round(spread * 2.6);
    return (
      `conic-gradient(from calc(var(--glow-start, ${seedAngle}) * 1deg) at 50% 50%, ` +
      `${colorFrom} 0deg, ` +
      `${colorTo} ${half}deg, ` +
      `transparent ${half + fade}deg, ` +
      `transparent ${360 - half - fade}deg, ` +
      `${colorTo} ${360 - half}deg, ` +
      `${colorFrom} 360deg)`
    );
  }, [spread, colorFrom, colorTo, seedAngle]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduce) {
      card.style.setProperty("--glow-start", String(seedAngle));
      if (sharpRef.current) sharpRef.current.style.opacity = String(restOpacity);
      if (softRef.current) softRef.current.style.opacity = "0";
      return;
    }

    let raf = 0;
    let current = seedAngle;
    let active = 0;
    let px = -99999;
    let py = -99999;
    let last = 0;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const frame = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016;
      last = t;

      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      // Distance from the pointer to the nearest edge of the card.
      const dx = Math.max(r.left - px, 0, px - r.right);
      const dy = Math.max(r.top - py, 0, py - r.bottom);
      const dist = Math.hypot(dx, dy);

      const target = dist <= proximity ? 1 : 0;
      active += (target - active) * Math.min(dt * 9, 1);

      // Resting sweep, whose influence fades out as the cursor takes over.
      current += idleSpeed * dt * (1 - active);
      if (active > 0.002) {
        const angle = (Math.atan2(py - cy, px - cx) * 180) / Math.PI;
        const diff = ((angle - current + 540) % 360) - 180;
        current += diff * Math.min(dt * 6, 1) * active;
      }
      current = ((current % 360) + 360) % 360;

      card.style.setProperty("--glow-start", String(Math.round(current)));
      const a = Math.round(active * 100) / 100;
      if (sharpRef.current) {
        sharpRef.current.style.opacity = String(
          Math.round((restOpacity + (1 - restOpacity) * a) * 100) / 100
        );
      }
      if (softRef.current) {
        softRef.current.style.opacity = String(Math.round(a * 0.7 * 100) / 100);
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [seedAngle, proximity, idleSpeed, restOpacity]);

  const maskStyle: React.CSSProperties = {
    WebkitMask:
      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
  };

  const initVars: CSSVars = { "--glow-start": seedAngle };

  return (
    <div
      ref={cardRef}
      style={initVars}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-panel",
        className
      )}
    >
      {/* Soft inner bloom that swells as the cursor approaches. The blur lives
          on this wrapper so it softens the masked ring below it, rather than
          being re-sharpened by the mask. */}
      <div
        ref={softRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] blur-[10px]"
        style={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{ ...maskStyle, padding: borderWidth + 2 }}
        >
          <div
            className="absolute left-1/2 top-1/2 aspect-square w-[210%]"
            style={{
              marginLeft: "-105%",
              marginTop: "-105%",
              background: gradient,
            }}
          />
        </div>
      </div>

      {/* Crisp border arc. */}
      <div
        ref={sharpRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ ...maskStyle, padding: borderWidth, opacity: restOpacity }}
      >
        <div
          className="absolute left-1/2 top-1/2 aspect-square w-[210%]"
          style={{
            marginLeft: "-105%",
            marginTop: "-105%",
            background: gradient,
          }}
        />
      </div>

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: Gauge,
    title: "Sub-40ms responses",
    body: "Cold starts eliminated. Every request runs at the region closest to your user.",
  },
  {
    icon: ShieldCheck,
    title: "SOC 2 by default",
    body: "Encryption, audit logs, and scoped access controls enabled from the first deploy.",
  },
  {
    icon: GitBranch,
    title: "A preview per branch",
    body: "Each push gets an isolated URL with full production parity, ready in seconds.",
  },
  {
    icon: Activity,
    title: "Traces, not guesses",
    body: "Span-level observability across every function, query, and downstream call.",
  },
];

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(560px circle at 50% 28%, rgba(124,108,255,0.07), transparent 70%)",
        }}
      />
      <div className="grid w-full max-w-xl grid-cols-2 gap-4">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <GlowingEffect seed={i} className="h-full">
                <div className="flex h-full flex-col gap-3 p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-brand-soft">
                    <Icon className="h-4 w-4" strokeWidth={1.6} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{f.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                      {f.body}
                    </p>
                  </div>
                </div>
              </GlowingEffect>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
