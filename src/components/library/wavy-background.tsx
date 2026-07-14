"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function WavyBackground({
  children,
  className,
  colors = ["#7c6cff", "#5b8cff", "#a78bfa"],
}: {
  children?: React.ReactNode;
  className?: string;
  colors?: string[];
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
    let t = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawWave(
      offset: number,
      amplitude: number,
      wavelength: number,
      color: string,
      alpha: number
    ) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 8) {
        const y =
          height * 0.55 +
          Math.sin(x / wavelength + t + offset) * amplitude +
          Math.sin(x / (wavelength * 2) - t * 0.6) * amplitude * 0.4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function draw() {
      if (!ctx) return;
      t += 0.008;
      ctx.clearRect(0, 0, width, height);
      drawWave(0, 30, 120, colors[0] ?? "#7c6cff", 0.35);
      drawWave(2, 40, 160, colors[1] ?? "#5b8cff", 0.3);
      drawWave(4, 25, 100, colors[2] ?? "#a78bfa", 0.25);
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
  }, [colors]);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-line bg-void",
        className
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <WavyBackground>
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold text-transparent">
          Wavy Background
        </h3>
        <p className="max-w-xs text-sm text-zinc-400">
          Layered flowing wave blobs animate gently behind your content.
        </p>
      </div>
    </WavyBackground>
  );
}
