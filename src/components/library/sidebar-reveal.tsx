"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Activity,
  Settings,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

interface NavItem {
  label: string;
  icon: LucideIcon;
  hint: string;
  metric: string;
  value: string;
  delta: string;
  /** 7 integer heights (0-100) for the mini activity chart. */
  bars: number[];
}

const ITEMS: NavItem[] = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    hint: "Everything across the workspace, at a glance.",
    metric: "Active users",
    value: "18,204",
    delta: "+8.2%",
    bars: [38, 52, 44, 66, 58, 80, 72],
  },
  {
    label: "Analytics",
    icon: BarChart3,
    hint: "Traffic, funnels and conversion in one view.",
    metric: "Conversion",
    value: "4.7%",
    delta: "+0.6pt",
    bars: [30, 46, 60, 52, 74, 68, 88],
  },
  {
    label: "Members",
    icon: Users,
    hint: "Manage roles, seats and access levels.",
    metric: "Seats in use",
    value: "126 / 150",
    delta: "+9",
    bars: [50, 54, 58, 61, 64, 70, 74],
  },
  {
    label: "Activity",
    icon: Activity,
    hint: "A live stream of every event as it lands.",
    metric: "Events / min",
    value: "1,940",
    delta: "live",
    bars: [64, 40, 72, 48, 84, 56, 92],
  },
  {
    label: "Settings",
    icon: Settings,
    hint: "Preferences, integrations and billing.",
    metric: "Integrations",
    value: "12 active",
    delta: "2 new",
    bars: [44, 46, 50, 49, 54, 52, 58],
  },
];

function BrandMark({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="relative h-8 w-8 shrink-0">
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[10px] bg-brand/40 blur-md"
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.3, 0.65, 0.3], scale: [0.9, 1.08, 0.9] }
        }
        transition={{ duration: 3.6, ease: "easeInOut", repeat: Infinity }}
      />
      <div className="relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand to-glow">
        <div className="h-3 w-3 rounded-[4px] bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.55)]" />
      </div>
    </div>
  );
}

export function SidebarReveal({
  className,
  autoCycle = true,
  onActiveChange,
}: {
  className?: string;
  autoCycle?: boolean;
  onActiveChange?: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const uid = useId();

  // Keep the latest `open` readable inside the interval without resetting it.
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  // Idle life: quietly advance the selection while the sidebar is at rest, so a
  // static preview reads as a working product rather than a frozen screenshot.
  useEffect(() => {
    if (!autoCycle || reduceMotion) return;
    const id = setInterval(() => {
      if (openRef.current) return; // pause while the user is exploring
      setActive((i) => (i + 1) % ITEMS.length);
    }, 2600);
    return () => clearInterval(id);
  }, [autoCycle, reduceMotion]);

  return (
    <motion.div
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      animate={{ width: open ? 214 : 68 }}
      transition={{ duration: 0.44, ease: EASE }}
      className={cn(
        "relative flex h-full shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-panel/90",
        className
      )}
    >
      {/* thin bright top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* brand */}
      <div className="flex items-center gap-3 px-[15px] pb-4 pt-4">
        <BrandMark reduceMotion={reduceMotion} />
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.26, ease: EASE }}
              className="min-w-0"
            >
              <div className="whitespace-nowrap text-[13px] font-semibold leading-tight text-white">
                Lumenite
              </div>
              <div className="whitespace-nowrap text-[11px] leading-tight text-zinc-500">
                Production workspace
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-3 h-px bg-line/70" />

      {/* nav */}
      <nav className="flex flex-1 flex-col gap-1 px-2 pt-3">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isActive = active === i;
          return (
            <button
              key={item.label}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className="group/item relative flex h-10 items-center rounded-xl px-[13px] outline-none focus-visible:ring-1 focus-visible:ring-brand/60"
            >
              {isActive && (
                <>
                  <motion.span
                    layoutId={`${uid}-pill`}
                    className="absolute inset-0 rounded-xl border border-white/10 bg-brand/[0.14]"
                    style={{
                      boxShadow:
                        "0 8px 24px -14px rgba(124,108,255,0.9), inset 0 1px 0 0 rgba(255,255,255,0.05)",
                    }}
                    transition={{ duration: 0.44, ease: EASE }}
                  />
                  <motion.span
                    layoutId={`${uid}-bar`}
                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand-soft"
                    style={{ boxShadow: "0 0 10px rgba(169,157,255,0.8)" }}
                    transition={{ duration: 0.44, ease: EASE }}
                  />
                </>
              )}
              <Icon
                className={cn(
                  "relative z-10 h-[18px] w-[18px] shrink-0 transition-colors duration-200",
                  isActive
                    ? "text-brand-soft"
                    : "text-zinc-500 group-hover/item:text-zinc-200"
                )}
              />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.24, ease: EASE }}
                    className={cn(
                      "relative z-10 ml-3 whitespace-nowrap text-[13px] font-medium",
                      isActive ? "text-white" : "text-zinc-400"
                    )}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* footer account card */}
      <div className="mt-auto px-2 pb-3 pt-2">
        <div className="mx-1 mb-2 h-px bg-line/70" />
        <div className="flex h-11 items-center rounded-xl px-[9px]">
          <div className="relative h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-glow to-brand">
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-panel bg-emerald-400" />
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.24, ease: EASE }}
                className="ml-3 min-w-0"
              >
                <div className="truncate text-[12px] font-medium leading-tight text-white">
                  Austin Reyes
                </div>
                <div className="truncate text-[11px] leading-tight text-zinc-500">
                  austin@lumenite.dev
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function ContentPreview({ index }: { index: number }) {
  const item = ITEMS[index];
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative hidden flex-1 overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 sm:block">
      {/* dotted grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.045) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* slow light sweep keeps the panel alive at rest */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
          animate={{ x: ["0%", "420%"] }}
          transition={{ duration: 7.5, ease: "linear", repeat: Infinity }}
        />
      )}

      <div className="relative">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          <span>Workspace</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-400">{item.label}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
              {item.label}
            </h3>
            <p className="mt-1 max-w-[34ch] text-[13px] leading-relaxed text-zinc-400">
              {item.hint}
            </p>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="text-[11px] text-zinc-500">{item.metric}</div>
                <div className="mt-0.5 text-2xl font-semibold tracking-tight tabular-nums text-white">
                  {item.value}
                </div>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-brand-soft">
                {item.delta}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Last 7 days</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-soft" />
              per day
            </span>
          </div>
          <div className="flex h-16 items-end gap-1.5">
            {item.bars.map((h, i) => (
              <motion.div
                key={`${index}-${i}`}
                className="flex-1 rounded-sm bg-gradient-to-t from-brand/35 to-brand-soft/80"
                initial={{ height: "18%", opacity: 0.4 }}
                animate={{ height: `${h}%`, opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.045 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex h-full w-full items-stretch gap-5 bg-void p-6">
      <SidebarReveal onActiveChange={setActive} className="h-full" />
      <ContentPreview index={active} />
    </div>
  );
}
