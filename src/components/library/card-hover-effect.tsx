"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  GitBranch,
  Layers,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CardHoverItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/**
 * A responsive grid of feature cards. A soft, brand-tinted highlight block
 * slides behind the active card via a shared layout animation. When the user
 * isn't pointing at anything, the highlight auto-cycles through the cards so a
 * static preview always looks alive.
 */
export function CardHoverEffect({
  items,
  className,
  autoCycle = true,
  cycleMs = 2200,
}: {
  items: CardHoverItem[];
  className?: string;
  autoCycle?: boolean;
  cycleMs?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [idle, setIdle] = useState(0);

  useEffect(() => {
    if (!autoCycle || items.length < 2 || hovered !== null) return;
    const id = window.setInterval(() => {
      setIdle((i) => (i + 1) % items.length);
    }, cycleMs);
    return () => window.clearInterval(id);
  }, [autoCycle, cycleMs, items.length, hovered]);

  const active = hovered ?? idle;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = active === idx;
        return (
          <div
            key={item.title}
            className="group relative block p-1.5"
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => {
              setIdle(idx);
              setHovered(null);
            }}
          >
            <AnimatePresence>
              {isActive && (
                <motion.span
                  layoutId="card-hover-highlight"
                  className="absolute inset-0 block rounded-[20px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.15 } }}
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 240,
                      damping: 30,
                      mass: 0.9,
                    },
                  }}
                >
                  {/* Base tint */}
                  <span className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-brand/25 via-brand/10 to-glow/20" />
                  {/* Inset ring */}
                  <span className="absolute inset-0 rounded-[20px] ring-1 ring-inset ring-brand/30" />
                  {/* Outer glow */}
                  <span className="absolute inset-0 rounded-[20px] shadow-[0_0_50px_-8px_rgba(124,108,255,0.45)]" />
                  {/* Breathing core, keeps the highlight alive at rest */}
                  <motion.span
                    className="absolute inset-2 rounded-2xl bg-brand/15 blur-xl"
                    animate={{ opacity: [0.35, 0.7, 0.35] }}
                    transition={{
                      duration: 3.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.span>
              )}
            </AnimatePresence>

            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel/85 p-4 backdrop-blur-sm transition-colors duration-300 group-hover:border-white/20"
            >
              {/* Top sheen */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/10 transition-colors duration-300",
                  isActive
                    ? "text-brand-soft ring-brand/30"
                    : "text-zinc-400 group-hover:text-brand-soft"
                )}
              >
                <Icon size={17} strokeWidth={1.75} />
              </span>

              <h3 className="mt-3.5 text-sm font-semibold tracking-tight text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-400">
                {item.description}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

const DEMO_ITEMS: CardHoverItem[] = [
  {
    icon: Zap,
    title: "Edge deploys",
    description: "Push to production and go live on 300+ edge nodes in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Zero-trust auth",
    description: "Signed, scoped requests audited automatically on every call.",
  },
  {
    icon: Activity,
    title: "Live analytics",
    description: "Sub-second metrics streamed straight from real production traffic.",
  },
  {
    icon: GitBranch,
    title: "Preview branches",
    description: "Every pull request spins up an isolated, shareable environment.",
  },
  {
    icon: Layers,
    title: "Composable infra",
    description: "Functions, queues, and cron in one declarative pipeline.",
  },
  {
    icon: Sparkles,
    title: "AI copilots",
    description: "Refactor and review changes without ever leaving your editor.",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-5">
      <div className="w-full max-w-3xl">
        <div className="mb-4 px-1.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-soft/80">
            Platform
          </span>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
            Everything you need to ship
          </h2>
        </div>
        <CardHoverEffect items={DEMO_ITEMS} />
      </div>
    </div>
  );
}
