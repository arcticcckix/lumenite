"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  phase: number;
}

const seeded = (i: number) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;

export function Sparkles({
  className,
  density = 140,
  color = "#7c6cff",
}: {
  className?: string;
  density?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: Math.min(density, 300) }, (_, i) => ({
        x: seeded(i) * width,
        y: seeded(i + 1000) * height,
        size: 0.5 + seeded(i + 2000) * 1.5,
        speed: 0.05 + seeded(i + 3000) * 0.15,
        drift: (seeded(i + 4000) - 0.5) * 0.2,
        opacity: seeded(i + 5000),
        phase: seeded(i + 6000) * Math.PI * 2,
      }));
    }

    let t = 0;
    function draw() {
      if (!ctx) return;
      t += 0.02;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t + p.phase));
        ctx.globalAlpha = p.opacity * twinkle;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-void">
      <Sparkles />
      <div className="pointer-events-none relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold text-transparent">
          Sparkles
        </h3>
        <p className="max-w-xs text-sm text-zinc-400">
          A drifting field of twinkling particles rendered on canvas.
        </p>
      </div>
    </div>
  );
}
