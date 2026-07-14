"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export type MarqueeTestimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Adds a thin brand top edge for emphasis. Use sparingly. */
  accent?: boolean;
};

export type MarqueeVerticalProps = {
  /** One array of cards per column. Middle column scrolls the opposite way. */
  columns: MarqueeTestimonial[][];
  /** Seconds each card takes to travel one card height. Larger is slower. */
  secondsPerCard?: number;
  className?: string;
};

const MARQUEE_CSS = `
@keyframes lum-mv-up { from { transform: translateY(0); } to { transform: translateY(-50%); } }
@keyframes lum-mv-down { from { transform: translateY(-50%); } to { transform: translateY(0); } }
.lum-mv-track { will-change: transform; }
.lum-mv-anim-up { animation-name: lum-mv-up; animation-timing-function: linear; animation-iteration-count: infinite; }
.lum-mv-anim-down { animation-name: lum-mv-down; animation-timing-function: linear; animation-iteration-count: infinite; }
.lum-mv-root:hover .lum-mv-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .lum-mv-track { animation: none !important; transform: none !important; } }
`;

// Restrained, brand-family avatar gradients. No rainbow.
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #7c6cff, #5b8cff)",
  "linear-gradient(135deg, #5b8cff, #38bdf8)",
  "linear-gradient(135deg, #a99dff, #7c6cff)",
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #3f4657, #5b6272)",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + second).toUpperCase();
}

function gradientFor(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
}

function TestimonialCard({ t }: { t: MarqueeTestimonial }) {
  return (
    <div
      className={cn(
        "relative mb-4 rounded-2xl border border-white/10 bg-panel/80 p-5 backdrop-blur-sm",
        t.accent && "border-brand/30"
      )}
    >
      {t.accent && (
        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
      )}
      <Quote className="h-4 w-4 text-brand-soft/50" strokeWidth={2} aria-hidden />
      <p className="mt-3 text-[13px] leading-relaxed text-zinc-300">{t.quote}</p>
      <div className="mt-4 flex items-center gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white/95"
          style={{ background: gradientFor(t.name) }}
          aria-hidden
        >
          {initials(t.name)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[12px] font-medium text-white">
            {t.name}
          </div>
          <div className="truncate text-[11px] text-zinc-500">
            {t.role}, {t.company}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarqueeColumn({
  items,
  direction,
  durationSeconds,
}: {
  items: MarqueeTestimonial[];
  direction: "up" | "down";
  durationSeconds: number;
}) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          "lum-mv-track flex flex-col",
          direction === "up" ? "lum-mv-anim-up" : "lum-mv-anim-down"
        )}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {loop.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export function MarqueeVertical({
  columns,
  secondsPerCard = 4.5,
  className,
}: MarqueeVerticalProps) {
  // Different speeds per column, deterministic. Middle column runs opposite.
  const speedFactors = [1, 1.32, 1.12];
  const fade =
    "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)";

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn("lum-mv-root relative h-full w-full overflow-hidden", className)}
    >
      <style>{MARQUEE_CSS}</style>

      {/* Soft brand wash so the wall feels alive at rest */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_55%_at_50%_-10%,rgba(124,108,255,0.10),transparent_60%)]" />

      <div
        className="relative grid h-full gap-4 px-1"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
          maskImage: fade,
          WebkitMaskImage: fade,
        }}
      >
        {columns.map((items, i) => (
          <MarqueeColumn
            key={i}
            items={items}
            direction={i % 2 === 1 ? "down" : "up"}
            durationSeconds={Math.round(
              items.length * secondsPerCard * (speedFactors[i % speedFactors.length])
            )}
          />
        ))}
      </div>
    </motion.div>
  );
}

const DEMO_COLUMNS: MarqueeTestimonial[][] = [
  [
    {
      quote:
        "We rebuilt our marketing site in a weekend. The motion presets saved us days of fiddling.",
      name: "Elena Ross",
      role: "Frontend Lead",
      company: "Northwind",
      accent: true,
    },
    {
      quote: "Every component feels considered. Nothing here looks like a template.",
      name: "Marcus Bailey",
      role: "Design Engineer",
      company: "Cobalt",
    },
    {
      quote:
        "The dark defaults are gorgeous. We shipped without touching a single color.",
      name: "Sana Malik",
      role: "Staff Engineer",
      company: "Meridian",
    },
  ],
  [
    {
      quote: "Our pricing page conversion climbed the week we dropped these in.",
      name: "Priya Nair",
      role: "Head of Growth",
      company: "Halcyon",
    },
    {
      quote:
        "Finally a library where the live demos match the code you actually copy.",
      name: "Diego Alvarez",
      role: "Product Engineer",
      company: "Sable",
      accent: true,
    },
    {
      quote: "Accessibility was already handled. That basically never happens.",
      name: "Grace Whitman",
      role: "Eng Manager",
      company: "Vantage",
    },
  ],
  [
    {
      quote: "The attention to detail on the edges and glows is genuinely unreal.",
      name: "Noah Kim",
      role: "Product Designer",
      company: "Orbit",
    },
    {
      quote: "Cut our component backlog in half during the first sprint.",
      name: "Ava Bennett",
      role: "CTO",
      company: "Kindred",
      accent: true,
    },
    {
      quote: "My designers stopped fighting the framework and started shipping.",
      name: "Tom Fischer",
      role: "Founder",
      company: "Beacon",
    },
  ],
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <div className="relative h-full w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-surface/60">
        <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" />
        <MarqueeVertical columns={DEMO_COLUMNS} />
      </div>
    </div>
  );
}
