"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Range logic                                                        */
/* ------------------------------------------------------------------ */

type PageItem = number | "left-ellipsis" | "right-ellipsis";

function span(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i += 1) out.push(i);
  return out;
}

/**
 * Compute the visible page items with first/last anchors and collapsed
 * ellipses. Mirrors the well-worn MUI/usePagination behaviour.
 */
function usePageItems(total: number, page: number, siblingCount: number): PageItem[] {
  return useMemo(() => {
    const pages = Math.max(1, total);
    // first + last + current + 2 ellipses + siblings on both sides
    const slots = siblingCount * 2 + 5;
    if (pages <= slots) return span(1, pages);

    const left = Math.max(page - siblingCount, 1);
    const right = Math.min(page + siblingCount, pages);
    const showLeft = left > 2;
    const showRight = right < pages - 1;
    const edge = 3 + siblingCount * 2;

    if (!showLeft && showRight) {
      return [...span(1, edge), "right-ellipsis", pages];
    }
    if (showLeft && !showRight) {
      return [1, "left-ellipsis", ...span(pages - edge + 1, pages)];
    }
    return [1, "left-ellipsis", ...span(left, right), "right-ellipsis", pages];
  }, [total, page, siblingCount]);
}

/* ------------------------------------------------------------------ */
/* Pagination                                                         */
/* ------------------------------------------------------------------ */

const PILL_SPRING = { type: "spring", stiffness: 460, damping: 38, mass: 0.9 } as const;

export interface PaginationProps {
  total: number;
  page?: number;
  defaultPage?: number;
  onChange?: (page: number) => void;
  siblingCount?: number;
  layoutId?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Animated pagination control with a sliding active pill (shared layout
 * animation), prev/next chevrons that disable at the ends, and collapsed
 * ellipses for long ranges. Controlled via `page`/`onChange` or
 * uncontrolled via `defaultPage`.
 */
export function Pagination({
  total,
  page,
  defaultPage = 1,
  onChange,
  siblingCount = 1,
  layoutId,
  ariaLabel = "Pagination",
  className,
}: PaginationProps) {
  const reactId = useId();
  const pillId = layoutId ?? `pagination-pill-${reactId}`;
  const [internal, setInternal] = useState(defaultPage);
  const current = Math.min(Math.max(page ?? internal, 1), Math.max(1, total));
  const items = usePageItems(total, current, siblingCount);

  function go(next: number) {
    const clamped = Math.min(Math.max(next, 1), Math.max(1, total));
    if (clamped === current) return;
    if (page === undefined) setInternal(clamped);
    onChange?.(clamped);
  }

  const atStart = current <= 1;
  const atEnd = current >= total;

  return (
    <nav aria-label={ariaLabel} className={cn("inline-flex items-center gap-1", className)}>
      <Arrow
        direction="prev"
        disabled={atStart}
        onClick={() => go(current - 1)}
      />

      <ul className="flex items-center gap-1">
        {items.map((item) => {
          if (item === "left-ellipsis" || item === "right-ellipsis") {
            return (
              <li key={item} aria-hidden className="flex h-9 w-7 items-center justify-center">
                <MoreHorizontal size={16} className="text-zinc-600" />
              </li>
            );
          }
          const isActive = item === current;
          return (
            <li key={item}>
              <motion.button
                type="button"
                aria-label={`Go to page ${item}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => go(item)}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 600, damping: 30 }}
                className={cn(
                  "relative flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-[13px] font-medium tabular-nums",
                  "outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand/50",
                  isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={pillId}
                    transition={PILL_SPRING}
                    className={cn(
                      "absolute inset-0 rounded-xl border border-white/10",
                      "bg-gradient-to-b from-brand/30 to-brand/10",
                      "shadow-[0_0_0_1px_rgba(124,108,255,0.14),0_8px_20px_-10px_rgba(124,108,255,0.7),inset_0_1px_0_rgba(255,255,255,0.14)]"
                    )}
                  />
                )}
                <span className="relative z-10">{item}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>

      <Arrow
        direction="next"
        disabled={atEnd}
        onClick={() => go(current + 1)}
      />
    </nav>
  );
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      type="button"
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl border text-zinc-300",
        "outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand/50",
        disabled
          ? "cursor-not-allowed border-white/[0.04] bg-white/[0.02] text-zinc-700"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
      )}
    >
      <Icon size={16} strokeWidth={2.25} />
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Demo                                                               */
/* ------------------------------------------------------------------ */

interface Slide {
  tag: string;
  name: string;
  blurb: string;
  from: string;
  to: string;
}

const SLIDES: Slide[] = [
  {
    tag: "Dashboard",
    name: "Nebula Analytics",
    blurb: "Realtime product metrics with cohort retention baked in.",
    from: "#7c6cff",
    to: "#5b8cff",
  },
  {
    tag: "Email",
    name: "Signal Inbox",
    blurb: "A keyboard-first client that triages itself while you sleep.",
    from: "#5b8cff",
    to: "#56d0c9",
  },
  {
    tag: "Knowledge",
    name: "Orbit Docs",
    blurb: "Living documentation that stays in sync with your codebase.",
    from: "#6f8dff",
    to: "#7c6cff",
  },
  {
    tag: "Payments",
    name: "Vault Billing",
    blurb: "Usage metering, invoices, and dunning without the spreadsheets.",
    from: "#9a7bff",
    to: "#7c6cff",
  },
  {
    tag: "Monitoring",
    name: "Pulse Status",
    blurb: "Incident timelines and uptime history your customers can trust.",
    from: "#4fd1c5",
    to: "#5b8cff",
  },
  {
    tag: "Sales",
    name: "Atlas CRM",
    blurb: "Pipeline that updates from the conversations you already have.",
    from: "#8b7bff",
    to: "#b58bff",
  },
];

const ADVANCE_MS = 2900;

export default function Demo() {
  const [page, setPage] = useState(1);
  const [locked, setLocked] = useState(false);
  const reduce = useReducedMotion();
  const slide = SLIDES[page - 1] ?? SLIDES[0];

  // Idle cinema: quietly walk the pages until the visitor takes over.
  useEffect(() => {
    if (locked || reduce) return;
    const t = setInterval(() => {
      setPage((prev) => (prev % SLIDES.length) + 1);
    }, ADVANCE_MS);
    return () => clearInterval(t);
  }, [locked, reduce]);

  function handleChange(next: number) {
    setLocked(true);
    setPage(next);
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <div className="relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel p-6 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.9)]">
        {/* ambient top glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -20%, rgba(124,108,255,0.16), transparent 70%)",
          }}
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
              <Layers size={13} className="text-brand-soft" />
            </span>
            <span className="text-sm font-medium text-zinc-300">Featured collection</span>
          </div>
          <span className="text-[11px] tabular-nums text-zinc-500">
            Page {page} of {SLIDES.length}
          </span>
        </div>

        {/* preview */}
        <div className="relative mt-5 h-[188px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b0b12]">
          <AnimatePresence>
            <motion.div
              key={page}
              initial={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.99, filter: "blur(8px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <motion.div
                aria-hidden
                className="absolute -inset-10"
                style={{
                  background: `radial-gradient(38% 46% at 26% 30%, ${slide.from}55, transparent 60%), radial-gradient(40% 44% at 78% 72%, ${slide.to}44, transparent 62%)`,
                }}
                animate={reduce ? undefined : { x: [0, 16, 0], y: [0, -12, 0] }}
                transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="absolute right-4 top-1 select-none text-[64px] font-semibold leading-none tracking-tight tabular-nums text-white/[0.05]">
                {page < 10 ? `0${page}` : page}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[11px] font-medium text-zinc-300">
                  {slide.tag}
                </span>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                  {slide.name}
                </h3>
                <p className="mt-1 max-w-[300px] text-[13px] leading-relaxed text-zinc-400">
                  {slide.blurb}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* control */}
        <div className="relative mt-5 flex justify-center">
          <Pagination
            total={SLIDES.length}
            page={page}
            onChange={handleChange}
            ariaLabel="Collection pages"
          />
        </div>
      </div>
    </div>
  );
}
