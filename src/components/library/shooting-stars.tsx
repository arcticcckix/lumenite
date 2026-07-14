"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  tw: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const seeded = (i: number) => Math.abs(Math.sin(i * 45.164) * 10000) % 1;

export function ShootingStars({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shooting: ShootingStar[] = [];
    let frame = 0;
    let nextSpawn = 60;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: 120 }, (_, i) => ({
        x: seeded(i) * width,
        y: seeded(i + 1000) * height,
        r: 0.4 + seeded(i + 2000) * 1,
        o: 0.3 + seeded(i + 3000) * 0.7,
        tw: seeded(i + 4000) * Math.PI * 2,
      }));
    }

    function spawnShootingStar() {
      const startX = Math.random() * width * 0.6;
      shooting.push({
        x: startX,
        y: Math.random() * height * 0.3,
        vx: 6 + Math.random() * 4,
        vy: 3 + Math.random() * 2,
        life: 0,
        maxLife: 40 + Math.random() * 15,
      });
    }

    function draw() {
      if (!ctx) return;
      frame++;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(frame * 0.02 + s.tw);
        ctx.globalAlpha = s.o * twinkle;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (frame >= nextSpawn) {
        spawnShootingStar();
        nextSpawn = frame + 60 + Math.random() * 80;
      }

      shooting = shooting.filter((st) => st.life < st.maxLife);
      for (const st of shooting) {
        st.life++;
        st.x += st.vx;
        st.y += st.vy;
        const progress = st.life / st.maxLife;
        const alpha = 1 - progress;

        const grad = ctx.createLinearGradient(
          st.x,
          st.y,
          st.x - st.vx * 6,
          st.y - st.vy * 6
        );
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, "rgba(124,108,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x - st.vx * 6, st.y - st.vy * 6);
        ctx.stroke();
      }

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
  }, []);

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
      <ShootingStars />
      <div className="pointer-events-none relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold text-transparent">
          Shooting Stars
        </h3>
        <p className="max-w-xs text-sm text-zinc-400">
          A quiet starfield punctuated by the occasional shooting star.
        </p>
      </div>
    </div>
  );
}
