"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return { r: 124, g: 108, b: 255 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function FlickeringGrid({
  squareSize = 3,
  gridGap = 7,
  colors = ["#7c6cff", "#5b8cff"],
  maxOpacity = 0.42,
  className,
}: {
  /** Side length of each cell in CSS pixels. */
  squareSize?: number;
  /** Gap between cells in CSS pixels. */
  gridGap?: number;
  /** Two-tone tint; each cell picks a blend between the first and last color. */
  colors?: string[];
  /** Upper bound on any cell's opacity. */
  maxOpacity?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorKey = colors.join("|");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = colorKey.split("|").map(hexToRgb);
    const c0 = palette[0];
    const c1 = palette[palette.length - 1];

    const TAU = Math.PI * 2;
    const frac = (x: number) => x - Math.floor(x);
    // Deterministic per-cell hash, so nothing depends on Math.random.
    const hash = (n: number) => frac(Math.sin(n) * 43758.5453123);

    let dpr = 1;
    let cols = 0;
    let rows = 0;
    // Packed per-cell state: [ceiling, phase, freq, twinklePhase, mix].
    let cells = new Float32Array(0);
    const pitch = squareSize + gridGap;

    const setup = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      cols = Math.ceil(w / pitch) + 1;
      rows = Math.ceil(h / pitch) + 1;
      const count = cols * rows;
      cells = new Float32Array(count * 5);
      for (let i = 0; i < count; i++) {
        const a = hash(i * 12.9898 + 4.13);
        const b = hash(i * 78.233 + 2.71);
        const c = hash(i * 39.425 + 9.31);
        const d = hash(i * 15.147 + 1.37);
        const e = hash(i * 51.617 + 6.19);
        const o = i * 5;
        cells[o] = Math.pow(a, 2.4); // brightness ceiling, biased dim for a sparse feel
        cells[o + 1] = b * TAU; // breathe phase
        cells[o + 2] = 0.22 + c * 0.7; // breathe frequency
        cells[o + 3] = d * TAU; // twinkle phase
        cells[o + 4] = e; // color blend
      }
    };

    let raf = 0;
    const start =
      typeof performance !== "undefined" ? performance.now() : 0;

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sq = Math.max(1, Math.round(squareSize * dpr));
      const step = pitch * dpr;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const o = (y * cols + x) * 5;
          const ceiling = cells[o];
          const breathe = 0.5 + 0.5 * Math.sin(t * cells[o + 2] + cells[o + 1]);
          // Sharp, occasional sparkle on top of the slow breathe.
          const spark = Math.pow(
            0.5 + 0.5 * Math.sin(t * 1.9 + cells[o + 3]),
            9
          );
          const op = ceiling * maxOpacity * (0.16 + 0.5 * breathe + 0.5 * spark);
          if (op < 0.014) continue;

          const mix = cells[o + 4];
          const r = Math.round(c0.r + (c1.r - c0.r) * mix);
          const g = Math.round(c0.g + (c1.g - c0.g) * mix);
          const b = Math.round(c0.b + (c1.b - c0.b) * mix);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(op, 1).toFixed(3)})`;
          ctx.fillRect(Math.round(x * step), Math.round(y * step), sq, sq);
        }
      }
      raf = requestAnimationFrame(draw);
    };

    setup();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => setup());
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [squareSize, gridGap, maxOpacity, colorKey]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{
          maskImage:
            "radial-gradient(ellipse 78% 82% at 50% 46%, #000 0%, #000 34%, rgba(0,0,0,0.35) 68%, transparent 88%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 78% 82% at 50% 46%, #000 0%, #000 34%, rgba(0,0,0,0.35) 68%, transparent 88%)",
        }}
      />
    </div>
  );
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-void">
      <FlickeringGrid />

      {/* Soft brand glow pooled behind the headline. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_44%,rgba(124,108,255,0.16),transparent_70%)]" />
      {/* Edge vignette for depth. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_120%_at_50%_50%,transparent_55%,rgba(5,5,8,0.9)_100%)]" />
      {/* Thin bright top edge. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 flex max-w-md flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-zinc-400"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_2px_rgba(124,108,255,0.7)]" />
          LUMENITE BACKGROUNDS
        </motion.span>

        <motion.h3
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.08 }}
          className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-3xl font-semibold leading-tight text-transparent sm:text-4xl"
        >
          A quiet grid that never sits still
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.16 }}
          className="mt-3 text-sm leading-relaxed text-zinc-400"
        >
          Thousands of cells breathe on their own timing, tinted violet and blue.
          Calm from across the room, alive when you lean in.
        </motion.p>
      </div>
    </div>
  );
}
