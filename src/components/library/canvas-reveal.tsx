"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Deterministic pseudo-random in [0,1), no Math.random at module/render scope. */
const seeded = (i: number) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const mix = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smooth = (n: number) => {
  const t = clamp01(n);
  return t * t * (3 - 2 * t);
};

interface Dot {
  x: number;
  y: number;
  idle: [number, number, number];
  active: [number, number, number];
  phase: number;
  peak: number;
}

export function CanvasReveal({
  children,
  className,
  colors = ["#7c6cff", "#5b8cff", "#22d3ee"],
  dotGap = 22,
  dotRadius = 1.7,
  idleColor = "#5b6479",
}: {
  children?: React.ReactNode;
  className?: string;
  /** Palette the dot-matrix reveals in on hover. */
  colors?: string[];
  /** Spacing between dots in px. */
  dotGap?: number;
  /** Base dot radius in px. */
  dotRadius?: number;
  /** Muted color the dots rest at. */
  idleColor?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef(false);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const [hovering, setHovering] = useState(false);

  const colorKey = colors.join(",");
  const colorsRef = useRef(colors);
  colorsRef.current = colors;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let diag = 1;
    let dots: Dot[] = [];
    let reveal = 0;
    let t = 0;

    const idleRgb = hexToRgb(idleColor);
    const palette = colorsRef.current.map(hexToRgb);

    function build() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      diag = Math.sqrt(width * width + height * height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Keep the particle count comfortably under 300.
      let gap = dotGap;
      let cols = Math.floor(width / gap) + 1;
      let rows = Math.floor(height / gap) + 1;
      while (cols * rows > 300 && gap < 64) {
        gap += 2;
        cols = Math.floor(width / gap) + 1;
        rows = Math.floor(height / gap) + 1;
      }

      const offX = (width - (cols - 1) * gap) / 2;
      const offY = (height - (rows - 1) * gap) / 2;

      dots = [];
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          idx++;
          const base = palette[Math.floor(seeded(idx * 7.3) * palette.length) % palette.length];
          dots.push({
            x: offX + c * gap,
            y: offY + r * gap,
            active: base,
            // Rest color is a whisper of the dot's own hue over the muted base.
            idle: mix(idleRgb, base, 0.22),
            phase: seeded(idx * 3.11) * Math.PI * 2,
            peak: 0.7 + seeded(idx * 5.7) * 0.3,
          });
        }
      }
    }

    function frame() {
      if (!ctx) return;
      t += 0.016;
      reveal += ((hoverRef.current ? 1 : 0) - reveal) * 0.07;

      const focalX = pointer.current.active ? pointer.current.x : width / 2;
      const focalY = pointer.current.active ? pointer.current.y : height * 0.42;
      const wave = reveal * 1.42;

      ctx.clearRect(0, 0, width, height);

      for (const d of dots) {
        const dx = d.x - focalX;
        const dy = d.y - focalY;
        const dist = Math.sqrt(dx * dx + dy * dy) / diag;
        const local = smooth((wave - dist) / 0.34);

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.15 + d.phase);
        const idleA = 0.045 + 0.055 * pulse;
        const alpha = idleA + (d.peak - idleA) * local;

        const [r, g, b] = mix(d.idle, d.active, local);
        const radius = dotRadius * (0.88 + 0.5 * local + 0.12 * pulse);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    build();
    frame();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [colorKey, dotGap, dotRadius, idleColor]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointer.current.x = e.clientX - rect.left;
    pointer.current.y = e.clientY - rect.top;
    pointer.current.active = true;
  }

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseEnter={() => {
        hoverRef.current = true;
        setHovering(true);
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        pointer.current.active = false;
        setHovering(false);
      }}
      animate={{
        borderColor: hovering ? "rgba(124,108,255,0.35)" : "rgba(255,255,255,0.10)",
        boxShadow: hovering
          ? "0 24px 70px -32px rgba(91,140,255,0.55)"
          : "0 24px 70px -40px rgba(0,0,0,0.9)",
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-panel",
        className
      )}
    >
      {/* Dot-matrix canvas, faded toward the edges for depth. */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(130%_130%_at_50%_35%,#000_45%,transparent_100%)]"
      />
      {/* Hover bloom that keeps the reveal from reading flat. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 40%, rgba(124,108,255,0.16), transparent 70%)",
        }}
        animate={{ opacity: hovering ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <CanvasReveal className="h-full max-h-[380px] w-full max-w-sm">
        <div className="flex h-full flex-col justify-between p-7">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-soft backdrop-blur-sm">
              <Activity className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 backdrop-blur-sm">
              Live
            </span>
          </div>

          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-soft/80">
              Observability
            </p>
            <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold leading-tight text-transparent">
              See every request, live
            </h3>
            <p className="mt-2.5 max-w-[19rem] text-sm leading-relaxed text-zinc-400">
              Trace latency, errors, and cold starts across every edge region,
              streamed to your dashboard in under 200ms.
            </p>
          </div>

          <button
            type="button"
            className="group/cta inline-flex items-center gap-1.5 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-brand/40 hover:bg-brand/10"
          >
            Explore tracing
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
          </button>
        </div>
      </CanvasReveal>
    </div>
  );
}
