"use client";

import { motion } from "framer-motion";
import {
  Box,
  MessageSquare,
  Palette,
  Zap,
  Database,
  Cloud,
  Puzzle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrbitIcon {
  Icon: typeof Box;
  radius: number;
  duration: number;
  startAngle: number;
  reverse?: boolean;
  color: string;
}

const ICONS: OrbitIcon[] = [
  { Icon: Box, radius: 70, duration: 14, startAngle: 20, color: "text-white" },
  { Icon: MessageSquare, radius: 70, duration: 14, startAngle: 200, color: "text-white" },
  { Icon: Palette, radius: 110, duration: 20, startAngle: 90, reverse: true, color: "text-white" },
  { Icon: Database, radius: 110, duration: 20, startAngle: 270, reverse: true, color: "text-white" },
  { Icon: Zap, radius: 150, duration: 26, startAngle: 0, color: "text-white" },
  { Icon: Cloud, radius: 150, duration: 26, startAngle: 145, color: "text-white" },
  { Icon: Puzzle, radius: 150, duration: 26, startAngle: 250, color: "text-white" },
];

function OrbitItem({ item }: { item: OrbitIcon }) {
  const { Icon, radius, duration, startAngle, reverse, color } = item;
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ marginLeft: -radius, marginTop: -radius, width: radius * 2, height: radius * 2 }}
      animate={{ rotate: reverse ? [startAngle, startAngle - 360] : [startAngle, startAngle + 360] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="absolute flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel shadow-lg shadow-black/30"
        style={{ left: radius * 2 - 18, top: radius - 18 }}
      >
        <Icon className={cn("h-4 w-4", color)} />
      </div>
    </motion.div>
  );
}

export function OrbitingLogos({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-80 w-80 items-center justify-center", className)}>
      {[70, 110, 150].map((r) => (
        <div
          key={r}
          className="absolute rounded-full border border-white/[0.06]"
          style={{ width: r * 2, height: r * 2 }}
        />
      ))}

      {ICONS.map((item, i) => (
        <OrbitItem key={i} item={item} />
      ))}

      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-gradient-to-br from-brand to-glow shadow-xl shadow-brand/20">
        <Sparkles className="h-7 w-7 text-white" />
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <OrbitingLogos />
    </div>
  );
}
