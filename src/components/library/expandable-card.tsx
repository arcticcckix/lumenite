"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Palette,
  Waves,
  Accessibility,
  ArrowUpRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface ExpandableStat {
  label: string;
  value: string;
}

export interface ExpandableItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  icon: React.ReactNode;
  /** Optional short kicker shown above the title in the expanded view. */
  tag?: string;
  /** Optional numbers shown in the expanded footer. */
  stats?: ExpandableStat[];
}

/* -------------------------------------------------------------------------- */
/*  Ambient aurora, a slow rotating glow that keeps a static preview alive.   */
/* -------------------------------------------------------------------------- */

function Aurora({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute -inset-24 -z-0", className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      style={{
        background:
          "conic-gradient(from 0deg, transparent 0deg, rgba(124,108,255,0.18) 70deg, transparent 150deg, rgba(91,140,255,0.16) 250deg, transparent 340deg)",
        filter: "blur(44px)",
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Expanded card, morphs from the trigger via a shared layoutId.            */
/* -------------------------------------------------------------------------- */

export function ExpandableCard({
  item,
  onClose,
}: {
  item: ExpandableItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/80 backdrop-blur-md"
          />

          <motion.div
            key="modal"
            layoutId={`card-${item.id}`}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-panel p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
            transition={{ layout: { duration: 0.5, ease: EASE } }}
          >
            <Aurora />
            {/* thin bright top edge */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <motion.div
                  layoutId={`icon-${item.id}`}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-brand/15 text-brand-soft"
                >
                  {item.icon}
                </motion.div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>

              {item.tag && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.14 } }}
                  className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-soft/80"
                >
                  {item.tag}
                </motion.p>
              )}

              <motion.h3
                layoutId={`title-${item.id}`}
                className={cn(
                  "text-xl font-semibold tracking-tight text-white",
                  item.tag ? "mt-1" : "mt-5"
                )}
              >
                {item.title}
              </motion.h3>
              <motion.p
                layoutId={`subtitle-${item.id}`}
                className="mt-1 text-sm text-zinc-500"
              >
                {item.subtitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.18 } }}
                exit={{ opacity: 0 }}
                className="mt-4 text-sm leading-relaxed text-zinc-400"
              >
                {item.content}
              </motion.p>

              {item.stats && item.stats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.24 } }}
                  className="mt-6 grid grid-cols-3 gap-2"
                >
                  {item.stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5"
                    >
                      <div className="text-sm font-semibold text-white">
                        {s.value}
                      </div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-zinc-500">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/5"
                >
                  Close
                </button>
                <span className="text-[11px] text-zinc-600">
                  Press{" "}
                  <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                    Esc
                  </kbd>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trigger row, a list item that morphs open on click.                      */
/*  When `active`, a conic beam sweeps its border so the preview reads alive.  */
/* -------------------------------------------------------------------------- */

export function ExpandableCardTrigger({
  item,
  active = false,
  onOpen,
  onHoverStart,
  onHoverEnd,
}: {
  item: ExpandableItem;
  active?: boolean;
  onOpen: (item: ExpandableItem) => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}) {
  return (
    <motion.button
      layoutId={`card-${item.id}`}
      onClick={() => onOpen(item)}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      transition={{ layout: { duration: 0.5, ease: EASE } }}
      className="relative block w-full overflow-hidden rounded-2xl p-px text-left"
    >
      {/* rotating conic beam, only on the active row */}
      <AnimatePresence>
        {active && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 rounded-2xl"
          >
            <motion.span
              className="absolute left-1/2 top-1/2 h-[320%] w-[160%] -translate-x-1/2 -translate-y-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, transparent 260deg, #7c6cff 320deg, #5b8cff 352deg, transparent 360deg)",
              }}
            />
          </motion.span>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          backgroundColor: active
            ? "rgba(255,255,255,0.035)"
            : "rgba(255,255,255,0.012)",
        }}
        transition={{ duration: 0.4, ease: EASE }}
        className={cn(
          "relative z-10 flex items-center gap-4 rounded-[15px] p-4",
          !active && "border border-white/10"
        )}
      >
        <motion.div
          layoutId={`icon-${item.id}`}
          animate={{
            boxShadow: active
              ? "0 0 22px -4px rgba(124,108,255,0.55)"
              : "0 0 0px 0px rgba(124,108,255,0)",
          }}
          transition={{ duration: 0.45, ease: EASE }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-brand/15 text-brand-soft"
        >
          {item.icon}
        </motion.div>

        <div className="min-w-0 flex-1">
          <motion.h4
            layoutId={`title-${item.id}`}
            className="truncate text-sm font-semibold text-white"
          >
            {item.title}
          </motion.h4>
          <motion.p
            layoutId={`subtitle-${item.id}`}
            className="truncate text-xs text-zinc-500"
          >
            {item.subtitle}
          </motion.p>
        </div>

        <motion.div
          animate={{ opacity: active ? 1 : 0.35, x: active ? 0 : -4 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="shrink-0 text-zinc-400"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Demo                                                                       */
/* -------------------------------------------------------------------------- */

const items: ExpandableItem[] = [
  {
    id: "tokens",
    title: "Design tokens",
    subtitle: "One source for color, space, and type",
    tag: "Foundations",
    content:
      "Every primitive reads from the same token set, so one edit ripples across the whole system without any visual drift.",
    icon: <Palette className="h-5 w-5" strokeWidth={1.75} />,
    stats: [
      { label: "Tokens", value: "128" },
      { label: "Themes", value: "4" },
      { label: "Drift", value: "0" },
    ],
  },
  {
    id: "motion",
    title: "Motion presets",
    subtitle: "Springs and easings tuned for feel",
    tag: "Interaction",
    content:
      "Reusable spring and easing configs keep interactions consistent, from a single button press to a full page transition.",
    icon: <Waves className="h-5 w-5" strokeWidth={1.75} />,
    stats: [
      { label: "Presets", value: "16" },
      { label: "Springs", value: "9" },
      { label: "FPS", value: "60" },
    ],
  },
  {
    id: "a11y",
    title: "Accessible by default",
    subtitle: "WCAG AA baked into every primitive",
    tag: "Inclusive",
    content:
      "Focus rings, roles, and contrast ratios live inside each component, so accessibility is handled long before review.",
    icon: <Accessibility className="h-5 w-5" strokeWidth={1.75} />,
    stats: [
      { label: "Contrast", value: "AA" },
      { label: "Roles", value: "Auto" },
      { label: "Audit", value: "100%" },
    ],
  },
];

export default function Demo() {
  const [open, setOpen] = useState<ExpandableItem | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);

  // Auto-advance the highlighted row so a static preview stays alive.
  // Pauses whenever the user is hovering a row or a card is expanded.
  useEffect(() => {
    if (open || hovered !== null) return;
    const id = setInterval(() => {
      setCycle((c) => (c + 1) % items.length);
    }, 2600);
    return () => clearInterval(id);
  }, [open, hovered]);

  const activeIndex = open ? -1 : hovered ?? cycle;

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="relative w-full max-w-sm">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-panel/80 p-5">
          <Aurora className="opacity-70" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white">
                  What ships in every component
                </h3>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Tap a row to expand the details
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.25, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="h-1.5 w-1.5 rounded-full bg-glow"
                  style={{ boxShadow: "0 0 8px 1px #5b8cff" }}
                />
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Live
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {items.map((item, i) => (
                <ExpandableCardTrigger
                  key={item.id}
                  item={item}
                  active={activeIndex === i}
                  onOpen={setOpen}
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                />
              ))}
            </div>
          </div>
        </div>

        <ExpandableCard item={open} onClose={() => setOpen(null)} />
      </div>
    </div>
  );
}
