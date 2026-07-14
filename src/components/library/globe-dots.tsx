"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Dot {
  x: number;
  y: number;
  r: number;
  opacity: number;
}

function seeded(i: number, salt: number) {
  return Math.abs(Math.sin(i * 999 + salt * 137.13));
}

function buildGlobeDots(rings = 14, perRing = 22): Dot[] {
  const dots: Dot[] = [];
  const cx = 200;
  const cy = 200;
  const radius = 170;

  for (let ring = 0; ring < rings; ring++) {
    const phi = (Math.PI * (ring + 0.5)) / rings; // 0..PI
    const ringRadius = Math.sin(phi) * radius;
    const y = cy - Math.cos(phi) * radius;
    const count = Math.max(6, Math.round(perRing * Math.sin(phi)));
    for (let j = 0; j < count; j++) {
      const theta = (2 * Math.PI * j) / count;
      const x = cx + Math.cos(theta) * ringRadius;
      const depth = Math.sin(theta); // -1 front .. 1 back-ish (visual only)
      // round to 2dp so server/client float serialization matches (hydration)
      dots.push({
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
        r: Math.round((1.1 + 0.6 * seeded(ring * 31 + j, 1)) * 100) / 100,
        opacity: Math.round((0.25 + 0.55 * ((depth + 1) / 2)) * 1000) / 1000,
      });
    }
  }
  return dots;
}

const ARCS = [
  { from: [90, 140], to: [280, 110], delay: 0 },
  { from: [140, 300], to: [260, 260], delay: 0.6 },
  { from: [70, 220], to: [200, 90], delay: 1.2 },
];

export function GlobeDots({ className }: { className?: string }) {
  const dots = useMemo(() => buildGlobeDots(), []);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <motion.svg
        viewBox="0 0 400 400"
        className="h-full w-full max-w-[380px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={200} cy={200} r={170} fill="none" stroke="rgba(124,108,255,0.12)" strokeWidth={1} />
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={`rgba(120, 140, 255, ${d.opacity})`}
          />
        ))}
        {ARCS.map((arc, i) => (
          <motion.path
            key={i}
            d={`M ${arc.from[0]} ${arc.from[1]} Q 200 200 ${arc.to[0]} ${arc.to[1]}`}
            fill="none"
            stroke="url(#arc-gradient)"
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: arc.delay,
              ease: "easeInOut",
            }}
          />
        ))}
        <defs>
          <linearGradient id="arc-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c6cff" stopOpacity={0} />
            <stop offset="50%" stopColor="#5b8cff" stopOpacity={1} />
            <stop offset="100%" stopColor="#7c6cff" stopOpacity={0} />
          </linearGradient>
        </defs>
      </motion.svg>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 55%, #050508 78%)",
        }}
      />
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <GlobeDots className="h-[380px] w-[380px]" />
    </div>
  );
}
