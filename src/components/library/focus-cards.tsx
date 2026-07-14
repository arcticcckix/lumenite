"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Static fractal-noise texture (deterministic, no external asset).
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export type FocusCardItem = {
  /** Headline shown at the bottom of the card, always visible. */
  title: string;
  /** Secondary line revealed when the card is focused. */
  meta: string;
  /** Small pill in the top corner. */
  tag: string;
  /** Full CSS background value used as the card "image". */
  gradient: string;
  /** Two orb colors that drift behind the gradient to keep it alive at rest. */
  orbA: string;
  orbB: string;
};

function FocusCard({
  item,
  index,
  isFocused,
  onFocus,
  className,
}: {
  item: FocusCardItem;
  index: number;
  isFocused: boolean;
  onFocus: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      aria-label={item.title}
      onMouseEnter={onFocus}
      onFocus={onFocus}
      initial={false}
      animate={{
        scale: isFocused ? 1 : 0.965,
        opacity: isFocused ? 1 : 0.62,
        boxShadow: isFocused
          ? "0 24px 60px -24px rgba(124,108,255,0.55)"
          : "0 0px 0px 0px rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn(
        "group relative h-[190px] overflow-hidden rounded-2xl border border-white/10 text-left outline-none sm:h-[300px]",
        "focus-visible:ring-2 focus-visible:ring-brand/70",
        className
      )}
    >
      {/* Blurred imagery layer, sharp only when this card is focused. */}
      <motion.span
        aria-hidden
        className="absolute inset-0 block"
        style={{ background: item.gradient }}
        initial={false}
        animate={{ filter: isFocused ? "blur(0px)" : "blur(4px)" }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <motion.span
          className="absolute -left-8 -top-10 h-36 w-36 rounded-full blur-2xl"
          style={{ background: item.orbA }}
          animate={{ x: [0, 20, 0], y: [0, 16, 0] }}
          transition={{
            duration: 9 + index,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.span
          className="absolute -right-10 bottom-8 h-32 w-32 rounded-full blur-2xl"
          style={{ background: item.orbB }}
          animate={{ x: [0, -16, 0], y: [0, -20, 0] }}
          transition={{
            duration: 11 + index,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* readability scrim + grain */}
        <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <span
          className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={{ backgroundImage: NOISE }}
        />
      </motion.span>

      {/* Highlight ring for the focused card (kept crisp, outside the blur). */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        initial={false}
        animate={{ opacity: isFocused ? 1 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-4">
        <span className="w-fit rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
          {item.tag}
        </span>

        <div>
          <h3 className="text-base font-semibold text-white drop-shadow-sm">
            {item.title}
          </h3>
          <motion.div
            initial={false}
            animate={{
              opacity: isFocused ? 1 : 0,
              y: isFocused ? 0 : 8,
            }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-1.5 flex items-center justify-between gap-2"
          >
            <span className="text-xs text-white/65">{item.meta}</span>
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-white/90">
              View
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
}

export function FocusCards({
  items,
  autoCycleMs = 2200,
  className,
}: {
  items: FocusCardItem[];
  /** How long each card holds focus during the idle auto-cycle. */
  autoCycleMs?: number;
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);

  // Idle auto-focus: gently sweeps focus across the row so the effect reads
  // without any interaction. Pauses entirely while the user is hovering.
  useEffect(() => {
    if (hovered !== null || items.length <= 1) return;
    const id = window.setInterval(() => {
      setAuto((i) => (i + 1) % items.length);
    }, autoCycleMs);
    return () => window.clearInterval(id);
  }, [hovered, items.length, autoCycleMs]);

  const focused = hovered ?? auto;

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "grid w-full grid-cols-2 gap-3 sm:grid-cols-4",
        className
      )}
    >
      {items.map((item, i) => (
        <FocusCard
          key={item.title}
          item={item}
          index={i}
          isFocused={i === focused}
          onFocus={() => setHovered(i)}
        />
      ))}
    </div>
  );
}

const DEMO_ITEMS: FocusCardItem[] = [
  {
    title: "Aurora Drift",
    meta: "Nebula series · Plate 04",
    tag: "Gradient",
    gradient:
      "radial-gradient(130% 130% at 22% 12%, #8b7bff 0%, #4b30b8 38%, #17102e 78%, #0a0812 100%)",
    orbA: "rgba(124,108,255,0.70)",
    orbB: "rgba(91,140,255,0.55)",
  },
  {
    title: "Tidal Glass",
    meta: "Chroma set · Plate 12",
    tag: "Motion",
    gradient:
      "radial-gradient(130% 130% at 78% 10%, #59b8ff 0%, #2350c8 40%, #0d1636 80%, #080a1c 100%)",
    orbA: "rgba(91,140,255,0.70)",
    orbB: "rgba(90,220,255,0.45)",
  },
  {
    title: "Verdant Flux",
    meta: "Spectra study · Plate 07",
    tag: "Texture",
    gradient:
      "radial-gradient(130% 130% at 28% 88%, #35d6c4 0%, #0f7d84 38%, #0b2f3a 78%, #071a20 100%)",
    orbA: "rgba(53,214,196,0.55)",
    orbB: "rgba(91,140,255,0.42)",
  },
  {
    title: "Rose Signal",
    meta: "Aperture · Plate 09",
    tag: "Editorial",
    gradient:
      "radial-gradient(130% 130% at 82% 82%, #ff6fae 0%, #a02f7e 40%, #3a123a 80%, #1a0a1e 100%)",
    orbA: "rgba(255,111,174,0.52)",
    orbB: "rgba(124,108,255,0.50)",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-5 p-6 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-soft/80">
            Featured collection
          </p>
          <h3 className="mt-1.5 text-xl font-semibold text-white">
            Chromatic Studies
          </h3>
        </div>
        <span className="hidden text-xs text-zinc-500 sm:block">
          Hover to focus a plate
        </span>
      </div>
      <FocusCards items={DEMO_ITEMS} />
    </div>
  );
}
