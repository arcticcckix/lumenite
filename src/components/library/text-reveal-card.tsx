"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MoveHorizontal, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

const seededRand = (i: number) =>
  Math.abs(Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1;

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  twinkle: number;
  glint: boolean;
}

/**
 * A twinkling starfield rendered behind the revealed phrase. It fills the whole
 * stage but is visually clipped by the parent wipe, so the stars only appear in
 * the portion that has been revealed.
 */
function RevealStars({ count = 90 }: { count?: number }) {
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
    const n = Math.min(count, 300);

    stars = Array.from({ length: n }, (_, i) => ({
      x: seededRand(i + 1),
      y: seededRand(i + 501),
      r: 0.4 + seededRand(i + 1001) * 1.4,
      phase: seededRand(i + 1501) * Math.PI * 2,
      twinkle: 0.6 + seededRand(i + 2001) * 2.2,
      glint: seededRand(i + 2501) > 0.86,
    }));

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let t = 0;
    function draw() {
      if (!ctx) return;
      t += 0.016;
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const x = s.x * width;
        const y = s.y * height;
        const a = 0.22 + 0.78 * Math.abs(Math.sin(t * s.twinkle + s.phase));
        ctx.globalAlpha = a;
        ctx.fillStyle = "#e9e6ff";
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.glint) {
          ctx.globalAlpha = a * 0.65;
          ctx.strokeStyle = "#a99dff";
          ctx.lineWidth = 0.6;
          const g = s.r * 3.6;
          ctx.beginPath();
          ctx.moveTo(x - g, y);
          ctx.lineTo(x + g, y);
          ctx.moveTo(x, y - g);
          ctx.lineTo(x, y + g);
          ctx.stroke();
        }
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
  }, [count]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

export function TextRevealCard({
  text,
  revealText,
  children,
  className,
}: {
  text: string;
  revealText: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seam = useMotionValue(50);
  const hoveringRef = useRef(false);
  const targetRef = useRef(50);
  const currentRef = useRef(50);

  // clipPath insets: horizontal edges drive the wipe, vertical edges stay
  // generous so text glow is never cut off.
  const revealClip = useTransform(seam, (v) => `inset(-40% ${100 - v}% -40% 0%)`);
  const baseClip = useTransform(seam, (v) => `inset(-40% 0% -40% ${v}%)`);
  const seamLeft = useTransform(seam, (v) => `${v}%`);

  useEffect(() => {
    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.016;
      if (!hoveringRef.current) {
        // organic two-wave sweep so the idle motion never looks mechanical.
        const s = Math.sin(t * 0.55) * 0.5 + Math.sin(t * 0.23 + 1.3) * 0.5;
        targetRef.current = 50 + s * 30;
      }
      currentRef.current += (targetRef.current - currentRef.current) * 0.1;
      seam.set(Math.round(currentRef.current * 100) / 100);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [seam]);

  function setFromClientX(clientX: number) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    targetRef.current = Math.max(2, Math.min(98, pct));
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        hoveringRef.current = true;
      }}
      onMouseLeave={() => {
        hoveringRef.current = false;
      }}
      onMouseMove={(e) => setFromClientX(e.clientX)}
      onTouchStart={() => {
        hoveringRef.current = true;
      }}
      onTouchEnd={() => {
        hoveringRef.current = false;
      }}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        if (touch) setFromClientX(touch.clientX);
      }}
      className={cn(
        "group relative w-full max-w-md select-none overflow-hidden rounded-3xl border border-white/10 bg-panel p-8",
        className
      )}
    >
      {/* ambient depth */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(124,108,255,0.08),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* pulsing corner sparkle */}
      <motion.div
        className="pointer-events-none absolute right-5 top-5 text-brand-soft"
        animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.9, 1.12, 0.9] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkle className="h-4 w-4" />
      </motion.div>

      <div className="relative">{children}</div>

      {/* reveal stage */}
      <div className="relative mt-6 h-32 w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-void/60">
        {/* revealed (hidden) phrase, left of the seam */}
        <motion.div
          style={{ clipPath: revealClip }}
          className="absolute inset-0"
        >
          <RevealStars />
          <div className="absolute inset-0 flex items-center justify-center px-5">
            <span
              className="bg-gradient-to-r from-white via-brand-soft to-glow bg-clip-text text-center text-4xl font-semibold tracking-tight text-transparent sm:text-5xl"
              style={{ textShadow: "0 0 26px rgba(124,108,255,0.28)" }}
            >
              {revealText}
            </span>
          </div>
        </motion.div>

        {/* base (surface) phrase, right of the seam */}
        <motion.div
          style={{ clipPath: baseClip }}
          className="absolute inset-0 flex items-center justify-center px-5"
        >
          <span className="bg-gradient-to-b from-zinc-500 to-zinc-700 bg-clip-text text-center text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            {text}
          </span>
        </motion.div>

        {/* glowing seam */}
        <motion.div
          style={{ left: seamLeft }}
          className="pointer-events-none absolute bottom-0 top-0 z-10 -translate-x-1/2"
        >
          <div
            className="relative h-full w-px bg-gradient-to-b from-transparent via-white to-transparent"
            style={{ boxShadow: "0 0 12px 1px rgba(91,140,255,0.6)" }}
          />
          <div className="absolute inset-y-0 left-1/2 w-7 -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(124,108,255,0.35),transparent)] blur-md" />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
            style={{ filter: "drop-shadow(0 0 6px rgba(124,108,255,0.9))" }}
          >
            <Sparkle className="h-3.5 w-3.5" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <TextRevealCard text="Looks simple" revealText="Runs deep">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          <Sparkle className="h-3 w-3 text-brand-soft" />
          Text reveal
        </div>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
          Move across the panel to wipe the surface away. Leave it be and the
          seam sweeps on its own.
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-500">
          <MoveHorizontal className="h-3.5 w-3.5" />
          Move to reveal
        </div>
      </TextRevealCard>
    </div>
  );
}
