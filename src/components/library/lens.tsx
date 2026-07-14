"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Lens: a circular magnifier that enlarges whatever sits under it.   */
/*  It drifts across the panel on a loop at rest, and follows the      */
/*  cursor on hover. The scene is rendered twice: once as the base,    */
/*  once inside the clipped lens, scaled up about the point under the  */
/*  lens center so the two copies stay perfectly registered.          */
/* ------------------------------------------------------------------ */

type LensProps = {
  children: React.ReactNode;
  className?: string;
  /** Lens radius in px. */
  radius?: number;
  /** Magnification factor. */
  zoom?: number;
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export function Lens({
  children,
  className,
  radius = 82,
  zoom = 1.9,
}: LensProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Panel size, measured on the client. Defaults keep the first paint
  // deterministic so hydration never mismatches.
  const [size, setSize] = useState<{ w: number; h: number }>({
    w: 640,
    h: 380,
  });
  const sizeRef = useRef(size);
  const hoveringRef = useRef(false);

  // Raw target (updated by drift loop or cursor) -> spring for the glide.
  const targetX = useMotionValue(320);
  const targetY = useMotionValue(190);
  const x = useSpring(targetX, { stiffness: 90, damping: 18, mass: 0.6 });
  const y = useSpring(targetY, { stiffness: 90, damping: 18, mass: 0.6 });

  // Gentle scale bump while the cursor is inspecting.
  const hoverScale = useSpring(1, { stiffness: 220, damping: 22 });

  // Lens top-left = center - radius.
  const lensX = useTransform(x, (v) => v - radius);
  const lensY = useTransform(y, (v) => v - radius);

  // Inner wrapper offset: puts the scene origin back at panel (0,0)
  // inside the lens-local coordinate space.
  const innerX = useTransform(x, (v) => radius - v);
  const innerY = useTransform(y, (v) => radius - v);

  // Magnify transform: scale about the scene origin, then translate so
  // the point beneath the lens center stays fixed.
  const magX = useTransform(x, (v) => (1 - zoom) * v);
  const magY = useTransform(y, (v) => (1 - zoom) * v);
  const magnify = useMotionTemplate`translate(${magX}px, ${magY}px) scale(${zoom})`;

  // Measure the panel and keep the ref/state in sync.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const next = {
        w: Math.round(rect.width),
        h: Math.round(rect.height),
      };
      sizeRef.current = next;
      setSize(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Idle drift loop. A slow Lissajous wander keeps the lens alive at
  // rest; pauses while the cursor is driving it.
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
        const bx = Math.max(0, w / 2 - radius - 14);
        const by = Math.max(0, h / 2 - radius - 14);
        const nx = w / 2 + Math.sin(t * 0.45) * bx * 0.86;
        const ny = h / 2 + Math.sin(t * 0.63 + 1.4) * by * 0.78;
        targetX.set(nx);
        targetY.set(ny);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [radius, targetX, targetY]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = clamp(e.clientX - rect.left, radius + 6, rect.width - radius - 6);
    const py = clamp(e.clientY - rect.top, radius + 6, rect.height - radius - 6);
    targetX.set(px);
    targetY.set(py);
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        hoveringRef.current = true;
        hoverScale.set(1.06);
      }}
      onMouseLeave={() => {
        hoveringRef.current = false;
        hoverScale.set(1);
      }}
      onMouseMove={onMove}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#080810]",
        "shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      {/* Base scene */}
      <div className="absolute inset-0">{children}</div>

      {/* Lens */}
      <motion.div
        style={{
          x: lensX,
          y: lensY,
          scale: hoverScale,
          width: radius * 2,
          height: radius * 2,
        }}
        className="absolute left-0 top-0 rounded-full will-change-transform"
      >
        {/* Magnified content, clipped to the circle */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <motion.div
            style={{ x: innerX, y: innerY, width: size.w, height: size.h }}
            className="absolute left-0 top-0"
          >
            <motion.div
              style={{
                width: size.w,
                height: size.h,
                transformOrigin: "0 0",
                transform: magnify,
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        </div>

        {/* Glass rim, refraction tint, specular highlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "0 12px 40px -8px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.09), inset 0 0 24px rgba(8,10,22,0.55), inset 0 2px 3px rgba(255,255,255,0.30)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-full border border-white/25" />
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 50%, transparent 60%, rgba(124,108,255,0.10) 82%, rgba(91,140,255,0.18) 100%)",
            mixBlendMode: "screen",
          }}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute -top-3 left-[22%] h-1/2 w-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.24), transparent 70%)",
              filter: "blur(2px)",
            }}
          />
        </div>
        <div
          className="pointer-events-none absolute rounded-full"
          style={{ inset: 7, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
        />
      </motion.div>

      {/* Chrome, stays crisp above the glass */}
      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white/60 backdrop-blur-sm">
        <Search className="h-3 w-3 text-brand-soft" />
        Optical loupe
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/30 px-2 py-1 font-mono text-[11px] text-white/55 backdrop-blur-sm">
        {zoom.toFixed(1)}×
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RidgeScene: the CSS/SVG art panel the lens inspects.              */
/*  Deterministic star field, layered gradient ridgeline, fine        */
/*  contour lines and tiny type so magnification reads clearly.       */
/* ------------------------------------------------------------------ */

type Star = {
  x: number;
  y: number;
  r: number;
  o: number;
  twinkle: boolean;
  dur: number;
  delay: number;
};

const seed = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const round2 = (n: number) => Math.round(n * 100) / 100;

function RidgeScene() {
  const uid = useId().replace(/:/g, "");
  const sky = `sky-${uid}`;
  const sun = `sun-${uid}`;
  const bloom = `bloom-${uid}`;
  const r1 = `r1-${uid}`;
  const r2 = `r2-${uid}`;
  const r3 = `r3-${uid}`;
  const haze = `haze-${uid}`;
  const blurId = `blur-${uid}`;

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const twinkle = i % 4 === 0;
      return {
        x: round2(seed(i + 1) * 600),
        y: round2(10 + seed(i + 9) * 220),
        r: round2(0.5 + seed(i + 3) * 1.3),
        o: round2(0.25 + seed(i + 5) * 0.6),
        twinkle,
        dur: round2(2.6 + seed(i + 7) * 3.2),
        delay: round2(seed(i + 11) * 3),
      };
    });
  }, []);

  return (
    <svg
      viewBox="0 0 600 380"
      preserveAspectRatio="none"
      className="block h-full w-full"
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#05060f" />
          <stop offset="42%" stopColor="#0a1030" />
          <stop offset="70%" stopColor="#141a3e" />
          <stop offset="100%" stopColor="#1b2450" />
        </linearGradient>
        <radialGradient id={sun} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e9f0ff" />
          <stop offset="34%" stopColor="#a99dff" />
          <stop offset="70%" stopColor="#7c6cff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7c6cff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={bloom} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5b8cff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#5b8cff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={r1} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b3570" />
          <stop offset="100%" stopColor="#141a3e" />
        </linearGradient>
        <linearGradient id={r2} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c2450" />
          <stop offset="100%" stopColor="#0d1230" />
        </linearGradient>
        <linearGradient id={r3} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1026" />
          <stop offset="100%" stopColor="#070812" />
        </linearGradient>
        <linearGradient id={haze} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070812" stopOpacity="0" />
          <stop offset="100%" stopColor="#050510" stopOpacity="0.9" />
        </linearGradient>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="600" height="380" fill={`url(#${sky})`} />

      {/* Star field */}
      {stars.map((s, i) =>
        s.twinkle ? (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#dfe7ff"
            initial={{ opacity: s.o }}
            animate={{ opacity: [s.o * 0.35, s.o, s.o * 0.35] }}
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ) : (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#cdd6f5" opacity={s.o} />
        )
      )}

      {/* Sun bloom + disc, slow ambient pulse */}
      <motion.circle
        cx="300"
        cy="248"
        r="86"
        fill={`url(#${bloom})`}
        filter={`url(#${blurId})`}
        initial={{ opacity: 0.7, scale: 1 }}
        animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "300px 248px" }}
      />
      <circle cx="300" cy="250" r="42" fill={`url(#${sun})`} />
      <circle
        cx="300"
        cy="250"
        r="20"
        fill="#eef3ff"
        opacity="0.85"
      />

      {/* Back ridge */}
      <path
        d="M0,300 L80,262 L150,286 L230,246 L320,292 L400,256 L480,296 L560,266 L600,286 L600,380 L0,380 Z"
        fill={`url(#${r1})`}
      />
      <path
        d="M0,300 L80,262 L150,286 L230,246 L320,292 L400,256 L480,296 L560,266 L600,286"
        fill="none"
        stroke="#8fa0ff"
        strokeWidth="1"
        strokeOpacity="0.4"
      />

      {/* Mid ridge */}
      <path
        d="M0,338 L70,314 L160,344 L250,306 L340,350 L430,314 L520,352 L600,324 L600,380 L0,380 Z"
        fill={`url(#${r2})`}
      />
      <path
        d="M0,338 L70,314 L160,344 L250,306 L340,350 L430,314 L520,352 L600,324"
        fill="none"
        stroke="#6f7fdd"
        strokeWidth="1"
        strokeOpacity="0.32"
      />

      {/* Front ridge */}
      <path
        d="M0,360 L90,338 L180,366 L280,332 L380,368 L470,340 L560,368 L600,352 L600,380 L0,380 Z"
        fill={`url(#${r3})`}
      />
      <path
        d="M0,360 L90,338 L180,366 L280,332 L380,368 L470,340 L560,368 L600,352"
        fill="none"
        stroke="#4a56a0"
        strokeWidth="1"
        strokeOpacity="0.3"
      />

      {/* Fine contour detail, reveals the magnification */}
      <path
        d="M40,318 C140,300 220,300 320,318 S520,338 590,320"
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.5"
        strokeOpacity="0.07"
      />
      <path
        d="M20,352 C160,336 260,340 360,354 S520,364 596,350"
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.5"
        strokeOpacity="0.06"
      />

      {/* Foreground haze */}
      <rect x="0" y="300" width="600" height="80" fill={`url(#${haze})`} />

      {/* Tiny type, magnifies dramatically */}
      <text
        x="16"
        y="28"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="11"
        letterSpacing="3"
        fill="#ffffff"
        fillOpacity="0.42"
      >
        LUMEN RIDGE
      </text>
      <text
        x="16"
        y="42"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="8"
        letterSpacing="1"
        fill="#ffffff"
        fillOpacity="0.24"
      >
        42.361° N · 071.058° W · ELEV 1240m
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo                                                              */
/* ------------------------------------------------------------------ */

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <Lens className="h-[340px] w-full max-w-xl">
        <RidgeScene />
      </Lens>
    </div>
  );
}
