"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  ImageRevealMask                                                    */
/*                                                                     */
/*  Two registered layers occupy the same box. The base layer is       */
/*  always visible; the reveal layer shows only through a soft,         */
/*  feathered circular mask. That mask wanders across the panel on a    */
/*  slow loop at rest, so the piece looks alive in a static preview,    */
/*  and snaps to the cursor while a pointer is inside it.               */
/* ------------------------------------------------------------------ */

type ImageRevealMaskProps = {
  /** Layer that is always visible (e.g. a muted / grayscale scene). */
  base: ReactNode;
  /** Layer shown only inside the moving mask (e.g. the vivid scene). */
  reveal: ReactNode;
  className?: string;
  /** Mask radius in px. */
  radius?: number;
  /** Small text shown in the corner chip. */
  label?: string;
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
const round = (n: number) => Math.round(n);

export function ImageRevealMask({
  base,
  reveal,
  className,
  radius = 128,
  label = "Reveal mask",
}: ImageRevealMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ w: 640, h: 400 });
  const hoveringRef = useRef(false);
  const [tracking, setTracking] = useState(false);

  // Raw target (idle loop or cursor) -> spring for the glide.
  const targetX = useMotionValue(360);
  const targetY = useMotionValue(184);
  const mx = useSpring(targetX, { stiffness: 120, damping: 20, mass: 0.5 });
  const my = useSpring(targetY, { stiffness: 120, damping: 20, mass: 0.5 });
  // Mask radius grows a touch while the cursor is inspecting.
  const rad = useSpring(radius, { stiffness: 170, damping: 24 });

  // Every value written into a style string is rounded to an integer.
  const cx = useTransform(mx, round);
  const cy = useTransform(my, round);
  const cr = useTransform(rad, round);
  const softStop = useTransform(rad, (v) => round(v * 0.6));

  const maskImage = useMotionTemplate`radial-gradient(${cr}px circle at ${cx}px ${cy}px, #000 0px, #000 ${softStop}px, transparent ${cr}px)`;

  // Bright edge ring + soft bleed, both parked on the mask centre.
  const ringD = useTransform(rad, (v) => round(v * 1.64));
  const ringLeft = useTransform([mx, rad], ([x, r]: number[]) =>
    round(x - r * 0.82)
  );
  const ringTop = useTransform([my, rad], ([y, r]: number[]) =>
    round(y - r * 0.82)
  );
  const bleedD = useTransform(rad, (v) => round(v * 2.9));
  const bleedLeft = useTransform([mx, rad], ([x, r]: number[]) =>
    round(x - r * 1.45)
  );
  const bleedTop = useTransform([my, rad], ([y, r]: number[]) =>
    round(y - r * 1.45)
  );

  // Measure the panel; keep first paint deterministic to avoid mismatch.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      sizeRef.current = { w: round(rect.width), h: round(rect.height) };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Idle drift. A slow Lissajous wander keeps the reveal alive at rest;
  // it pauses the moment the cursor takes over.
  useEffect(() => {
    let raf = 0;
    let t = 0;
    let last = 0;
    const loop = (now: number) => {
      if (last === 0) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { w, h } = sizeRef.current;
      if (!hoveringRef.current && w > 0 && h > 0) {
        t += dt;
        const bx = Math.max(0, w / 2 - radius * 0.7);
        const by = Math.max(0, h / 2 - radius * 0.55);
        targetX.set(w / 2 + Math.sin(t * 0.34) * bx * 0.9);
        targetY.set(h / 2 + Math.sin(t * 0.47 + 1.1) * by * 0.82);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [radius, targetX, targetY]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    targetX.set(clamp(e.clientX - rect.left, 0, rect.width));
    targetY.set(clamp(e.clientY - rect.top, 0, rect.height));
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        hoveringRef.current = true;
        setTracking(true);
        rad.set(radius * 1.14);
      }}
      onMouseLeave={() => {
        hoveringRef.current = false;
        setTracking(false);
        rad.set(radius);
      }}
      onMouseMove={onMove}
      className={cn(
        "relative select-none overflow-hidden rounded-2xl border border-white/10 bg-[#080810]",
        "shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      {/* Base layer, always visible */}
      <div className="absolute inset-0">{base}</div>

      {/* Soft colour bleed under the reveal */}
      <motion.div
        aria-hidden
        style={{
          left: 0,
          top: 0,
          x: bleedLeft,
          y: bleedTop,
          width: bleedD,
          height: bleedD,
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(124,108,255,0.20), rgba(91,140,255,0.08) 46%, transparent 72%)",
          mixBlendMode: "screen",
        }}
        className="pointer-events-none absolute rounded-full will-change-transform"
      />

      {/* Reveal layer, clipped to the moving mask */}
      <motion.div
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
        className="absolute inset-0 will-change-[mask-image]"
      >
        {reveal}
      </motion.div>

      {/* Bright edge ring tracing the reveal boundary */}
      <motion.div
        aria-hidden
        style={{
          left: 0,
          top: 0,
          x: ringLeft,
          y: ringTop,
          width: ringD,
          height: ringD,
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.14), 0 0 24px rgba(124,108,255,0.28), inset 0 0 20px rgba(91,140,255,0.14)",
        }}
        className="pointer-events-none absolute rounded-full will-change-transform"
      />

      {/* Grid tick overlay, sits above everything for a lab-instrument feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(120% 120% at 50% 40%, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(120% 120% at 50% 40%, #000 55%, transparent 100%)",
        }}
      />

      {/* Vignette + top hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          background:
            "radial-gradient(140% 120% at 50% 0%, transparent 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Chrome */}
      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white/65 backdrop-blur-sm">
        <Aperture className="h-3 w-3 text-brand-soft" />
        {label}
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-2 py-1 font-mono text-[11px] text-white/55 backdrop-blur-sm">
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors duration-300",
            tracking ? "bg-brand" : "bg-white/30"
          )}
        />
        {tracking ? "Tracking" : "Idle"}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SpectrumScene: the CSS/SVG artwork revealed by the mask.           */
/*  Rendered once and layered twice by the demo (muted vs vivid) so    */
/*  the two copies stay pixel-perfectly registered.                    */
/* ------------------------------------------------------------------ */

type Dot = { x: number; y: number; r: number; o: number };

const rand = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const round2 = (n: number) => Math.round(n * 100) / 100;

function SpectrumScene() {
  const uid = useId().replace(/:/g, "");
  const bg = `bg-${uid}`;
  const bloom = `bloom-${uid}`;
  const core = `core-${uid}`;
  const ring = `ring-${uid}`;
  const horizon = `horizon-${uid}`;
  const soft = `soft-${uid}`;

  // Deterministic dot field, denser and brighter toward the bloom.
  const dots = useMemo<Dot[]>(() => {
    const out: Dot[] = [];
    const cxp = 360;
    const cyp = 176;
    for (let gy = 0; gy < 9; gy++) {
      for (let gx = 0; gx < 15; gx++) {
        const jx = (rand(gx * 7 + gy * 13 + 1) - 0.5) * 14;
        const jy = (rand(gx * 5 + gy * 17 + 3) - 0.5) * 14;
        const x = round2(24 + gx * 42 + jx);
        const y = round2(30 + gy * 40 + jy);
        const d = Math.hypot(x - cxp, y - cyp);
        const fall = clamp(1 - d / 300, 0, 1);
        out.push({
          x,
          y,
          r: round2(0.7 + fall * 1.5),
          o: round2(0.06 + fall * 0.5),
        });
      }
    }
    return out;
  }, []);

  return (
    <svg
      viewBox="0 0 640 400"
      preserveAspectRatio="none"
      className="block h-full w-full"
    >
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a16" />
          <stop offset="55%" stopColor="#0c0d1e" />
          <stop offset="100%" stopColor="#070610" />
        </linearGradient>
        <radialGradient id={bloom} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b9aaff" stopOpacity="0.9" />
          <stop offset="34%" stopColor="#7c6cff" stopOpacity="0.55" />
          <stop offset="66%" stopColor="#5b8cff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#5b8cff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eef0ff" />
          <stop offset="45%" stopColor="#a99dff" />
          <stop offset="100%" stopColor="#7c6cff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ring} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8f7dff" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#5b8cff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8f7dff" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={horizon} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b8cff" stopOpacity="0" />
          <stop offset="100%" stopColor="#6d5bff" stopOpacity="0.28" />
        </linearGradient>
        <radialGradient id={soft} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5b8cff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#5b8cff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Backdrop */}
      <rect x="0" y="0" width="640" height="400" fill={`url(#${bg})`} />

      {/* Dot field */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#cdd3ff" opacity={d.o} />
      ))}

      {/* Bloom, gentle ambient pulse */}
      <motion.circle
        cx="360"
        cy="176"
        r="150"
        fill={`url(#${bloom})`}
        initial={{ opacity: 0.85, scale: 1 }}
        animate={{ opacity: [0.7, 0.95, 0.7], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "360px 176px" }}
      />

      {/* Orbital rings, slow counter-rotation */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "360px 176px" }}
      >
        <ellipse
          cx="360"
          cy="176"
          rx="132"
          ry="52"
          fill="none"
          stroke={`url(#${ring})`}
          strokeWidth="1.2"
        />
        <circle cx="228" cy="176" r="2.4" fill="#cbd4ff" opacity="0.85" />
      </motion.g>
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 62, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "360px 176px" }}
      >
        <ellipse
          cx="360"
          cy="176"
          rx="104"
          ry="104"
          fill="none"
          stroke={`url(#${ring})`}
          strokeWidth="1"
          strokeOpacity="0.6"
        />
        <circle cx="360" cy="72" r="2" fill="#a99dff" opacity="0.8" />
      </motion.g>

      {/* Core */}
      <circle cx="360" cy="176" r="30" fill={`url(#${core})`} />
      <circle cx="360" cy="176" r="9" fill="#f4f5ff" opacity="0.92" />

      {/* Horizon glow */}
      <ellipse cx="360" cy="404" rx="360" ry="120" fill={`url(#${soft})`} />
      <rect x="0" y="300" width="640" height="100" fill={`url(#${horizon})`} />

      {/* Editorial type, reads clearly through the reveal */}
      <text
        x="20"
        y="30"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="11"
        letterSpacing="4"
        fill="#ffffff"
        fillOpacity="0.5"
      >
        SPECTRUM FIELD
      </text>
      <text
        x="20"
        y="46"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="8"
        letterSpacing="1.5"
        fill="#ffffff"
        fillOpacity="0.26"
      >
        NO. 07 · MONOCHROME TO COLOUR
      </text>
      <text
        x="20"
        y="382"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="8"
        letterSpacing="1.5"
        fill="#ffffff"
        fillOpacity="0.22"
      >
        λ 380–740 NM · GAIN 1.14
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo                                                               */
/* ------------------------------------------------------------------ */

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[#050508] p-6">
      <ImageRevealMask
        className="h-[300px] w-full max-w-xl"
        radius={124}
        label="Move to reveal"
        base={
          <div
            className="h-full w-full"
            style={{ filter: "grayscale(1) brightness(0.62) contrast(1.05)" }}
          >
            <SpectrumScene />
          </div>
        }
        reveal={
          <div className="h-full w-full" style={{ filter: "saturate(1.2)" }}>
            <SpectrumScene />
          </div>
        }
      />
      <p className="max-w-md text-center text-xs leading-relaxed text-white/40">
        The muted plate stays put while a feathered mask paints colour back in.
        It drifts on its own at rest and follows your cursor on hover.
      </p>
    </div>
  );
}
