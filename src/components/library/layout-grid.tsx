"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { Activity, Globe, Search, ShieldCheck, Webhook, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LayoutTile {
  id: string;
  title: string;
  meta: string;
  teaser: string;
  description: string;
  icon: React.ReactNode;
  /** Accent as an "r, g, b" triple, e.g. "124, 108, 255". Used sparingly. */
  accent: string;
  stats: { k: string; v: string }[];
  /** Tailwind grid-span classes for this tile's slot. */
  span: string;
  /** Render as a large feature tile (bottom-aligned copy). */
  large?: boolean;
}

const MORPH: Transition = {
  type: "spring",
  stiffness: 230,
  damping: 26,
  mass: 0.9,
};

const EASE = [0.16, 1, 0.3, 1] as const;

function tileGradient(accent: string, strong: boolean): string {
  const a = strong ? 0.22 : 0.14;
  return (
    `radial-gradient(120% 130% at 18% 0%, rgba(${accent}, ${a}), transparent 55%),` +
    "linear-gradient(155deg, #12131d 0%, #0b0b12 100%)"
  );
}

export function LayoutGrid({
  tiles,
  autoCycle = true,
  className,
}: {
  tiles: LayoutTile[];
  autoCycle?: boolean;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const idxRef = useRef(0);

  useEffect(() => {
    if (!autoCycle || hovering || tiles.length === 0) return;
    const iv = setInterval(() => {
      setOpenId((cur) => {
        if (cur !== null) {
          idxRef.current = (idxRef.current + 1) % tiles.length;
          return null;
        }
        return tiles[idxRef.current % tiles.length].id;
      });
    }, 2300);
    return () => clearInterval(iv);
  }, [autoCycle, hovering, tiles]);

  const open = tiles.find((t) => t.id === openId) ?? null;

  function toggle(id: string) {
    idxRef.current = Math.max(
      0,
      tiles.findIndex((t) => t.id === id)
    );
    setOpenId((cur) => (cur === id ? null : id));
  }

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        if (autoCycle) setOpenId(null);
      }}
      className={cn("relative h-full w-full", className)}
    >
      <div className="grid h-full w-full grid-cols-6 grid-rows-2 gap-2.5">
        {tiles.map((tile, i) => (
          <motion.button
            key={tile.id}
            type="button"
            layoutId={`tile-${tile.id}`}
            transition={MORPH}
            onClick={() => toggle(tile.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            style={{ backgroundImage: tileGradient(tile.accent, !!tile.large) }}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 p-4 text-left",
              "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_18px_40px_-30px_rgba(0,0,0,0.9)]",
              tile.large ? "justify-end" : "justify-between",
              tile.span
            )}
          >
            {/* thin bright top edge */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {/* idle breathing glow */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -inset-8 rounded-full"
              style={{
                background: `radial-gradient(closest-side, rgba(${tile.accent}, 0.35), transparent 70%)`,
              }}
              initial={{ opacity: 0.35 }}
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{
                duration: 6 + i * 0.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />

            <motion.span
              layoutId={`icon-${tile.id}`}
              transition={MORPH}
              className="relative z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
              style={{ color: `rgb(${tile.accent})` }}
            >
              {tile.icon}
            </motion.span>

            <div className={cn("relative z-10", tile.large ? "mt-4" : "mt-2")}>
              <motion.h4
                layoutId={`title-${tile.id}`}
                transition={MORPH}
                className="text-sm font-semibold leading-tight text-white"
              >
                {tile.title}
              </motion.h4>
              <motion.p
                layoutId={`meta-${tile.id}`}
                transition={MORPH}
                className="mt-0.5 text-[11px] font-medium"
                style={{ color: `rgb(${tile.accent})` }}
              >
                {tile.meta}
              </motion.p>
              {tile.large && (
                <p className="mt-1.5 max-w-[22ch] text-xs leading-relaxed text-zinc-500">
                  {tile.teaser}
                </p>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={() => setOpenId(null)}
              className="absolute inset-0 z-20 rounded-2xl bg-black/60 backdrop-blur-sm"
            />
            <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-3">
              <motion.div
                key={open.id}
                layoutId={`tile-${open.id}`}
                transition={MORPH}
                onClick={() => setOpenId(null)}
                style={{ backgroundImage: tileGradient(open.accent, true) }}
                className="pointer-events-auto relative w-full max-w-sm cursor-pointer overflow-hidden rounded-2xl border border-white/10 p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_40px_80px_-40px_rgba(0,0,0,0.95)]"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                <div className="flex items-start justify-between">
                  <motion.span
                    layoutId={`icon-${open.id}`}
                    transition={MORPH}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]"
                    style={{ color: `rgb(${open.accent})` }}
                  >
                    {open.icon}
                  </motion.span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:text-white">
                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                </div>

                <div className="mt-4">
                  <motion.h3
                    layoutId={`title-${open.id}`}
                    transition={MORPH}
                    className="text-lg font-semibold text-white"
                  >
                    {open.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`meta-${open.id}`}
                    transition={MORPH}
                    className="mt-0.5 text-xs font-medium"
                    style={{ color: `rgb(${open.accent})` }}
                  >
                    {open.meta}
                  </motion.p>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE, delay: 0.08 }}
                  className="mt-3 text-[13px] leading-relaxed text-zinc-400"
                >
                  {open.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE, delay: 0.14 }}
                  className="mt-5 flex flex-wrap gap-2"
                >
                  {open.stats.map((s) => (
                    <div
                      key={s.k}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5"
                    >
                      <div className="text-[10px] uppercase tracking-wide text-zinc-500">
                        {s.k}
                      </div>
                      <div className="text-xs font-semibold text-white">
                        {s.v}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const TILES: LayoutTile[] = [
  {
    id: "sync",
    title: "Realtime sync",
    meta: "12ms p50",
    teaser: "Conflict-free state, streamed to every client.",
    description:
      "Bidirectional streams keep every session in lockstep. Writes merge on the edge with CRDT resolution, so two people editing the same field never clobber each other.",
    icon: <Activity className="h-4 w-4" strokeWidth={2} />,
    accent: "124, 108, 255",
    stats: [
      { k: "Median sync", v: "12ms" },
      { k: "Merge model", v: "CRDT" },
      { k: "Uptime", v: "99.99%" },
    ],
    span: "col-span-3 row-span-2",
    large: true,
  },
  {
    id: "edge",
    title: "Edge network",
    meta: "310 regions",
    teaser: "",
    description:
      "Requests resolve at the nearest point of presence across 310 regions. Cold starts stay under 40ms and static assets ship from cache in a single round trip.",
    icon: <Globe className="h-4 w-4" strokeWidth={2} />,
    accent: "91, 140, 255",
    stats: [
      { k: "Regions", v: "310" },
      { k: "Cold start", v: "38ms" },
    ],
    span: "col-span-3 row-span-1",
  },
  {
    id: "search",
    title: "Vector search",
    meta: "sub-40ms",
    teaser: "",
    description:
      "Hybrid keyword and vector ranking over billions of embeddings, with sub-40ms recall. Filters, facets, and relevance tuning ship out of the box.",
    icon: <Search className="h-4 w-4" strokeWidth={2} />,
    accent: "56, 189, 197",
    stats: [
      { k: "Recall", v: "< 40ms" },
      { k: "Vectors", v: "2.1B" },
    ],
    span: "col-span-1 row-span-1",
  },
  {
    id: "audit",
    title: "Audit trail",
    meta: "SOC 2",
    teaser: "",
    description:
      "Every mutation is signed, timestamped, and immutable. Export a tamper-evident log to your SIEM, or replay any object back to a point in time.",
    icon: <ShieldCheck className="h-4 w-4" strokeWidth={2} />,
    accent: "216, 180, 90",
    stats: [
      { k: "Retention", v: "7 yr" },
      { k: "Standard", v: "SOC 2" },
    ],
    span: "col-span-1 row-span-1",
  },
  {
    id: "hooks",
    title: "Webhooks",
    meta: "at-least-once",
    teaser: "",
    description:
      "Deliver events with automatic retries, exponential backoff, and signed payloads. Inspect every attempt and replay failures straight from the dashboard.",
    icon: <Webhook className="h-4 w-4" strokeWidth={2} />,
    accent: "104, 190, 140",
    stats: [
      { k: "Delivery", v: "at-least-once" },
      { k: "Retries", v: "auto" },
    ],
    span: "col-span-1 row-span-1",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col bg-void p-6">
      <div className="relative min-h-0 flex-1">
        <LayoutGrid tiles={TILES} />
      </div>
      <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-zinc-600">
        <span className="flex items-center gap-1.5">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-brand"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.85, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          Auto-touring the grid
        </span>
        <span>Hover to explore</span>
      </div>
    </div>
  );
}
