"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Beam {
  x: number;
  len: number;
  speed: number;
  y: number;
  w: number;
  brand: boolean;
  delay: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  brand: boolean;
}

interface Burst {
  x: number;
  life: number;
  maxLife: number;
  brand: boolean;
}

const TAU = Math.PI * 2;

/** Deterministic PRNG (mulberry32) so no Math.random is used anywhere. */
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cool = { core: "206,224,255", glow: "91,140,255" };
const brandC = { core: "196,186,255", glow: "124,108,255" };

export interface BeamsCollisionProps {
  children?: React.ReactNode;
  className?: string;
  /** Number of falling beams. Kept small for a restrained, elegant field. */
  beamCount?: number;
}

export function BeamsCollision({
  children,
  className,
  beamCount = 7,
}: BeamsCollisionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rng = makeRng(0x13391f + beamCount * 2654435761);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 1;
    let height = 1;
    let raf = 0;
    let last = 0;
    let beams: Beam[] = [];
    const sparks: Spark[] = [];
    const bursts: Burst[] = [];

    const buildBeams = () => {
      beams = [];
      for (let i = 0; i < beamCount; i++) {
        const slot = width / beamCount;
        const x = slot * (i + 0.5) + (rng() - 0.5) * slot * 0.55;
        const len = 90 + rng() * 130;
        beams.push({
          x,
          len,
          speed: 115 + rng() * 165,
          // Pre-distribute so the very first painted frame already looks alive.
          y: rng() * (height + len) - len * 0.5,
          w: rng() < 0.55 ? 1 : 1.4,
          brand: rng() < 0.28,
          delay: rng() * 0.5,
        });
      }
    };

    const setup = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildBeams();
      if (reduce) renderStatic();
    };

    const spawn = (x: number, brand: boolean) => {
      if (sparks.length > 230) return;
      const count = 8 + Math.floor(rng() * 6);
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (rng() - 0.5) * Math.PI * 0.95;
        const speed = 45 + rng() * 150;
        sparks.push({
          x,
          y: height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 0.45 + rng() * 0.55,
          size: 0.8 + rng() * 1.7,
          brand,
        });
      }
      bursts.push({ x, life: 0, maxLife: 0.45, brand });
    };

    const drawFloor = () => {
      const g = ctx.createLinearGradient(0, height - 42, 0, height);
      g.addColorStop(0, "rgba(91,140,255,0)");
      g.addColorStop(1, "rgba(91,140,255,0.07)");
      ctx.fillStyle = g;
      ctx.fillRect(0, height - 42, width, 42);
    };

    const drawBeam = (b: Beam) => {
      if (b.y < 0) return;
      const topY = b.y - b.len;
      const c = b.brand ? brandC : cool;

      const glow = ctx.createLinearGradient(b.x, topY, b.x, b.y);
      glow.addColorStop(0, `rgba(${c.glow},0)`);
      glow.addColorStop(0.7, `rgba(${c.glow},0.05)`);
      glow.addColorStop(1, `rgba(${c.glow},0.5)`);
      ctx.strokeStyle = glow;
      ctx.lineWidth = b.w * 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(b.x, topY);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      const core = ctx.createLinearGradient(b.x, topY, b.x, b.y);
      core.addColorStop(0, `rgba(${c.core},0)`);
      core.addColorStop(1, `rgba(${c.core},0.9)`);
      ctx.strokeStyle = core;
      ctx.lineWidth = b.w;
      ctx.beginPath();
      ctx.moveTo(b.x, topY);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      const head = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 6.5);
      head.addColorStop(0, "rgba(255,255,255,0.95)");
      head.addColorStop(0.4, `rgba(${c.core},0.6)`);
      head.addColorStop(1, `rgba(${c.glow},0)`);
      ctx.fillStyle = head;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6.5, 0, TAU);
      ctx.fill();
    };

    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      drawFloor();
      for (const b of beams) {
        const y = Math.min(b.y, height - 2);
        drawBeam({ ...b, y });
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const step = (now: number) => {
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      drawFloor();

      for (const b of beams) {
        if (b.delay > 0) {
          b.delay -= dt;
        } else {
          b.y += b.speed * dt;
        }
        if (b.y >= height) {
          spawn(b.x, b.brand);
          const slot = width / beamCount;
          const i = Math.max(0, Math.min(beamCount - 1, Math.floor(b.x / slot)));
          b.x = slot * (i + 0.5) + (rng() - 0.5) * slot * 0.55;
          b.y = -b.len - rng() * height * 0.5;
          b.speed = 115 + rng() * 165;
          b.brand = rng() < 0.28;
          b.delay = rng() * 0.45;
        }
        drawBeam(b);
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        const bu = bursts[i];
        bu.life += dt;
        const t = bu.life / bu.maxLife;
        if (t >= 1) {
          bursts.splice(i, 1);
          continue;
        }
        const c = bu.brand ? brandC : cool;
        const rx = 20 + t * 74;
        const alpha = (1 - t) * 0.5;
        ctx.save();
        ctx.translate(bu.x, height);
        ctx.scale(1, 0.26);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        g.addColorStop(0, `rgba(${c.glow},${alpha})`);
        g.addColorStop(1, `rgba(${c.glow},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, TAU);
        ctx.fill();
        ctx.restore();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        const alpha = 1 - s.life / s.maxLife;
        if (alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.vy += 300 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const c = s.brand ? brandC : cool;
        ctx.fillStyle = `rgba(${c.glow},${alpha * 0.28})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2.4, 0, TAU);
        ctx.fill();
        ctx.fillStyle = `rgba(${c.core},${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, TAU);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(step);
    };

    setup();
    const ro = new ResizeObserver(() => setup());
    ro.observe(container);
    if (!reduce) raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [beamCount]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative isolate overflow-hidden bg-[#050508]",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(124,108,255,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_55%_at_50%_120%,rgba(91,140,255,0.09),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.55)]" />
      <div className="relative z-10 flex h-full w-full flex-col">{children}</div>
    </div>
  );
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-4">
      <BeamsCollision className="h-full w-full rounded-2xl border border-white/10">
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white/45"
          >
            Ambient background
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
            className="max-w-md bg-gradient-to-b from-white to-white/55 bg-clip-text text-3xl font-semibold leading-tight tracking-tight text-transparent sm:text-4xl"
          >
            Collisions, rendered in light
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
            className="mt-4 max-w-sm text-sm leading-relaxed text-white/55"
          >
            Thin beams descend from the top and scatter into sparks the moment
            they land. Continuous, seeded, and quietly efficient.
          </motion.p>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.24 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/[0.1]"
          >
            Explore effects
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </BeamsCollision>
    </div>
  );
}
