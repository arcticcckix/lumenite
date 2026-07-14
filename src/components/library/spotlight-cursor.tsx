"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useAnimationFrame,
} from "framer-motion";
import {
  Activity,
  GitPullRequest,
  Globe,
  KeyRound,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SpotlightFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const DEFAULT_FEATURES: SpotlightFeature[] = [
  {
    icon: Zap,
    title: "Edge runtime",
    description: "Cold starts under 40ms in every region.",
  },
  {
    icon: ShieldCheck,
    title: "SOC 2 Type II",
    description: "Audited controls, encrypted at rest.",
  },
  {
    icon: GitPullRequest,
    title: "Preview deploys",
    description: "A fresh URL for every pull request.",
  },
  {
    icon: Activity,
    title: "Live metrics",
    description: "p99 latency streamed as it happens.",
  },
  {
    icon: KeyRound,
    title: "Secrets vault",
    description: "Rotating keys, scoped per environment.",
  },
  {
    icon: Globe,
    title: "Global routing",
    description: "Anycast across 30 points of presence.",
  },
];

const GRID_CLASS = "grid grid-cols-2 gap-3 sm:grid-cols-3";

function FeatureTile({ feature, lit }: { feature: SpotlightFeature; lit: boolean }) {
  const Icon = feature.icon;
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors duration-300",
        lit
          ? "border-white/15 bg-white/[0.04]"
          : "border-white/[0.06] bg-white/[0.015]"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-300",
          lit
            ? "border-brand/30 bg-brand/15 text-brand-soft"
            : "border-white/10 bg-white/[0.02] text-zinc-600"
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>
      <div
        className={cn(
          "mt-3 text-sm font-medium transition-colors duration-300",
          lit ? "text-white" : "text-zinc-500"
        )}
      >
        {feature.title}
      </div>
      <div
        className={cn(
          "mt-1 text-xs leading-relaxed transition-colors duration-300",
          lit ? "text-zinc-400" : "text-zinc-600/70"
        )}
      >
        {feature.description}
      </div>
    </div>
  );
}

export function SpotlightCursor({
  features = DEFAULT_FEATURES,
  radius = 190,
  className,
}: {
  features?: SpotlightFeature[];
  radius?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ w: 640, h: 360 });
  const hoveringRef = useRef(false);

  const mx = useMotionValue(320);
  const my = useMotionValue(180);
  const sx = useSpring(mx, { stiffness: 140, damping: 24, mass: 0.55 });
  const sy = useSpring(my, { stiffness: 140, damping: 24, mass: 0.55 });

  // Round every value that reaches a style string to keep the DOM tidy.
  const rx = useTransform(sx, (v) => Math.round(v));
  const ry = useTransform(sy, (v) => Math.round(v));

  const maskImage = useMotionTemplate`radial-gradient(${radius}px circle at ${rx}px ${ry}px, #000 0%, #000 30%, transparent 72%)`;
  const glow = useMotionTemplate`radial-gradient(${Math.round(
    radius * 1.15
  )}px circle at ${rx}px ${ry}px, rgba(124,108,255,0.16), rgba(91,140,255,0.05) 42%, transparent 70%)`;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
    };
    measure();
    mx.set(sizeRef.current.w / 2);
    my.set(sizeRef.current.h / 2);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mx, my]);

  // At rest the spotlight drifts on a slow Lissajous path so a static
  // preview still reads as alive; the spring smooths the handoff to/from
  // the cursor. `time` comes from the frame loop, never Date.now().
  useAnimationFrame((time) => {
    if (hoveringRef.current) return;
    const { w, h } = sizeRef.current;
    const t = time / 1000;
    mx.set(w / 2 + Math.sin(t * 0.32) * w * 0.32);
    my.set(h / 2 + Math.cos(t * 0.24) * h * 0.3);
  });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-panel",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(124,108,255,0.10),transparent)]" />

      <div className="relative flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div>
          <div className="text-[13px] font-medium text-white">
            Platform capabilities
          </div>
          <div className="mt-0.5 text-xs text-zinc-500">
            Move across the grid to bring it into focus.
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(124,108,255,0.9)]" />
          Live
        </div>
      </div>

      <div
        ref={wrapRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => {
          hoveringRef.current = true;
        }}
        onMouseLeave={() => {
          hoveringRef.current = false;
        }}
        className="relative p-5"
      >
        {/* Dimmed base layer (the readable one) */}
        <div className={GRID_CLASS}>
          {features.map((f) => (
            <FeatureTile key={f.title} feature={f} lit={false} />
          ))}
        </div>

        {/* Bright layer, revealed only under the spotlight mask */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 p-5"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          <div className={GRID_CLASS}>
            {features.map((f) => (
              <FeatureTile key={f.title} feature={f} lit />
            ))}
          </div>
        </motion.div>

        {/* Soft coloured glow of the light itself */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: glow }}
        />
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <SpotlightCursor />
    </div>
  );
}
