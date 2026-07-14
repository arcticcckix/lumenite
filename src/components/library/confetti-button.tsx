"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#7c6cff", "#5b8cff", "#a78bfa", "#f0abfc", "#ffffff"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  rotation: number;
  vr: number;
}

function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function ConfettiButton({
  label = "Celebrate",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const seedRef = useRef(0);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    resize();
    window.addEventListener("resize", resize);

    function loop() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.rotation += p.vr;
        p.life -= 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.life / 60);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function burst() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.offsetWidth / 2;
    const cy = canvas.offsetHeight * 0.55;
    const count = 60;
    for (let i = 0; i < count; i++) {
      seedRef.current += 1;
      const s = seedRef.current;
      const angle = seededRand(s) * Math.PI * 2;
      const speed = 3 + seededRand(s * 1.7) * 6;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 4 + seededRand(s * 2.3) * 4,
        color: COLORS[Math.floor(seededRand(s * 3.1) * COLORS.length)],
        life: 50 + seededRand(s * 4.2) * 30,
        rotation: seededRand(s * 5.5) * Math.PI,
        vr: (seededRand(s * 6.6) - 0.5) * 0.5,
      });
    }
  }

  function handleClick() {
    setPressed(true);
    burst();
    setTimeout(() => setPressed(false), 200);
  }

  return (
    <div className={cn("relative flex h-56 w-72 items-center justify-center", className)}>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.94 }}
        animate={{ scale: pressed ? 0.96 : 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="relative z-10 flex items-center gap-2 rounded-full border border-line bg-gradient-to-b from-panel to-void px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/30 transition-colors hover:border-brand/50 hover:shadow-brand/20"
      >
        <PartyPopper className="h-4 w-4 text-brand-soft" />
        {label}
      </motion.button>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <ConfettiButton />
    </div>
  );
}
