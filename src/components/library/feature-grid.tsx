"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Zap,
  Shield,
  Layers,
  Globe,
  Cpu,
  type LucideIcon,
} from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureGrid({
  items,
  className,
}: {
  items: FeatureItem[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const isHovered = hovered === i;
        return (
          <div
            key={item.title}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="group relative overflow-hidden bg-panel p-6"
          >
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{
                opacity: isHovered ? 1 : 0,
                background:
                  "radial-gradient(180px circle at 30% 20%, rgba(124,108,255,0.14), transparent 70%)",
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-none"
              style={{
                boxShadow: isHovered
                  ? "inset 0 0 0 1px rgba(124,108,255,0.55)"
                  : "inset 0 0 0 1px rgba(255,255,255,0)",
              }}
              transition={{ duration: 0.25 }}
            />
            <motion.div
              className="relative z-10 mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand-soft"
              animate={{
                boxShadow: isHovered
                  ? "0 0 24px 4px rgba(124,108,255,0.35)"
                  : "0 0 0px 0px rgba(124,108,255,0)",
                scale: isHovered ? 1.06 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
            <h3 className="relative z-10 text-sm font-semibold text-white">
              {item.title}
            </h3>
            <p className="relative z-10 mt-2 text-sm leading-relaxed text-zinc-400">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

const demoItems: FeatureItem[] = [
  {
    icon: Sparkles,
    title: "Polished by default",
    description: "Every element ships with motion and depth baked in.",
  },
  {
    icon: Zap,
    title: "Instant feedback",
    description: "Hover states respond in under a frame, no lag.",
  },
  {
    icon: Shield,
    title: "Type-safe props",
    description: "Strict TypeScript interfaces across every component.",
  },
  {
    icon: Layers,
    title: "Composable layers",
    description: "Stack primitives together without fighting specificity.",
  },
  {
    icon: Globe,
    title: "Works anywhere",
    description: "Framework agnostic patterns, React-first execution.",
  },
  {
    icon: Cpu,
    title: "Lightweight runtime",
    description: "No heavy deps, just framer-motion doing the work.",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <FeatureGrid items={demoItems} className="max-w-3xl" />
    </div>
  );
}
