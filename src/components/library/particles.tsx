"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Deterministic pseudo-random in [0,1); safe for SSR (no Math.random). */
const seeded = (i: number) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;

type RGB = [number, number, number];

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  color: RGB;
  glow: number;
}

export interface ParticlesProps {
  className?: string;
  /** Hard cap on particle count. Kept under 220 for 60fps. */
  quantity?: number;
  /** Distance (px) under which two dots are wired together. */
  connectDistance?: number;
  /** Radius (px) of the cursor's repulsion field. */
  repelRadius?: number;
  /** Palette the dots are drawn from. */
  palette?: RGB[];
}

const DEFAULT_PALETTE: RGB[] = [
  [124, 108, 255], // brand
  [91, 140, 255], // glow
  [173, 196, 255], // ice
];

export function Particles({
  className,
  quantity = 160,
  connectDistance = 116,
  repelRadius = 130,
  palette = DEFAULT_PALETTE,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let t = 0;

    const cap = Math.min(quantity, 220);

    function build() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale count to area so small cards stay airy, large stay full.
      const target = Math.floor((width * height) / 2600);
      const count = Math.max(28, Math.min(cap, target));

      dots = Array.from({ length: count }, (_, i) => {
        const speed = 0.12 + seeded(i + 3000) * 0.22;
        const angle = seeded(i + 3500) * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const color = palette[Math.floor(seeded(i + 7000) * palette.length)];
        return {
          x: seeded(i) * width,
          y: seeded(i + 1000) * height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          size: 0.8 + seeded(i + 2000) * 1.6,
          color: color ?? DEFAULT_PALETTE[0],
          glow: 0.35 + seeded(i + 5000) * 0.65,
        };
      });
    }

    function step() {
      if (!ctx) return;
      t += 1;
      ctx.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;
      const maxD2 = connectDistance * connectDistance;
      const repel2 = repelRadius * repelRadius;

      // Advance + integrate forces.
      for (const p of dots) {
        // Ease velocity back toward its gentle home drift.
        p.vx += (p.baseVx - p.vx) * 0.03;
        p.vy += (p.baseVy - p.vy) * 0.03;

        if (mouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < repel2 && d2 > 0.02) {
            const d = Math.sqrt(d2);
            const force = (1 - d / repelRadius) * 0.9;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        // Clamp speed so a fast cursor never flings dots.
        const sp = Math.hypot(p.vx, p.vy);
        const cap2 = 2.4;
        if (sp > cap2) {
          p.vx = (p.vx / sp) * cap2;
          p.vy = (p.vy / sp) * cap2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges for an endless field.
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;
      }

      // Constellation links (drawn under the dots).
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > maxD2) continue;
          const d = Math.sqrt(d2);
          const alpha = (1 - d / connectDistance) * 0.38;
          ctx.strokeStyle = `rgba(140,152,224,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Glowing dots, additive so overlaps bloom.
      ctx.globalCompositeOperation = "lighter";
      for (const p of dots) {
        const [r, g, bl] = p.color;
        const pulse = 0.72 + 0.28 * Math.sin(t * 0.03 + p.x * 0.01);
        const a = p.glow * pulse;
        // soft halo
        ctx.fillStyle = `rgba(${r},${g},${bl},${(a * 0.16).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
        // mid
        ctx.fillStyle = `rgba(${r},${g},${bl},${(a * 0.3).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
        // bright core
        ctx.fillStyle = `rgba(${r},${g},${bl},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(step);
    }

    build();
    step();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [quantity, connectDistance, repelRadius, palette]);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onLeave() {
    mouseRef.current = null;
  }

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("absolute inset-0", className)}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-void">
      {/* depth wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(124,108,255,0.12), transparent 55%), radial-gradient(90% 80% at 50% 120%, rgba(91,140,255,0.10), transparent 60%)",
        }}
      />
      <Particles />

      <div className="pointer-events-none relative z-10 flex flex-col items-center px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand-soft/70"
        >
          Canvas field
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="mt-3 bg-gradient-to-b from-white to-white/55 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl"
        >
          Points in motion
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400"
        >
          A deterministic constellation that drifts on its own and parts around
          your cursor. Move across it to break the threads.
        </motion.p>
      </div>

      {/* top edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}
