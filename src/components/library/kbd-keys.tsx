"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Command,
  Search,
  Save,
  PanelLeft,
  Braces,
  ArrowBigUp,
  Option,
  CornerDownLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type Shortcut = {
  /** Human label for the action, e.g. "Command menu". */
  label: string;
  /** Ordered key tokens, e.g. ["cmd", "K"]. Modifiers map to icons. */
  keys: string[];
  /** Optional action icon rendered on the left of the row. */
  icon?: LucideIcon;
};

/* -------------------------------------------------------------------------- */
/*  Key cap                                                                   */
/* -------------------------------------------------------------------------- */

const KEY_ICONS: Record<string, LucideIcon> = {
  cmd: Command,
  command: Command,
  shift: ArrowBigUp,
  opt: Option,
  option: Option,
  alt: Option,
  enter: CornerDownLeft,
  return: CornerDownLeft,
};

// Every state keeps four shadow layers so framer-motion interpolates cleanly.
const REST_SHADOW = [
  "0 3px 0 0 rgba(5,5,9,0.95)",
  "0 6px 11px -1px rgba(0,0,0,0.55)",
  "inset 0 1px 0 0 rgba(255,255,255,0.10)",
  "inset 0 -3px 5px 0 rgba(0,0,0,0.35)",
].join(", ");

const PRESS_SHADOW = [
  "0 1px 0 0 rgba(5,5,9,0.95)",
  "0 2px 4px -1px rgba(0,0,0,0.45)",
  "inset 0 1px 0 0 rgba(255,255,255,0.05)",
  "inset 0 2px 6px 0 rgba(0,0,0,0.55)",
].join(", ");

const PRESS_SHADOW_ACCENT = [
  "0 1px 0 0 rgba(52,44,104,0.95)",
  "0 2px 8px -1px rgba(124,108,255,0.30)",
  "inset 0 1px 0 0 rgba(168,157,255,0.18)",
  "inset 0 2px 7px 0 rgba(124,108,255,0.32)",
].join(", ");

function KeyCap({
  token,
  down,
  accent,
}: {
  token: string;
  down: boolean;
  accent: boolean;
}) {
  const Icon = KEY_ICONS[token.toLowerCase()];
  const tinted = down && accent;

  return (
    <motion.div
      initial={false}
      animate={{
        y: down ? 3 : 0,
        boxShadow: down
          ? accent
            ? PRESS_SHADOW_ACCENT
            : PRESS_SHADOW
          : REST_SHADOW,
        borderColor: tinted
          ? "rgba(124,108,255,0.55)"
          : "rgba(255,255,255,0.07)",
      }}
      transition={{
        y: { type: "spring", stiffness: 720, damping: 26, mass: 0.5 },
        default: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
      }}
      style={{
        backgroundImage:
          "linear-gradient(180deg, #25252f 0%, #191920 58%, #131319 100%)",
      }}
      className={cn(
        "flex h-9 min-w-9 items-center justify-center rounded-[11px] border px-[9px]",
        "font-mono text-[12.5px] font-semibold tabular-nums",
        tinted ? "text-brand-soft" : "text-zinc-300"
      )}
    >
      {Icon ? (
        <Icon className="h-[15px] w-[15px]" strokeWidth={2} />
      ) : (
        <span className="leading-none">{token}</span>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  KbdKeys, auto-typing shortcut panel                                       */
/* -------------------------------------------------------------------------- */

/**
 * A keyboard-shortcut display with realistic 3D key caps. It cycles through
 * the provided shortcuts and depresses each one's keys in sequence, like a
 * hand typing the combo, then releases and moves to the next.
 */
export function KbdKeys({
  shortcuts,
  title = "Keyboard shortcuts",
  caption = "Every action, one keystroke away.",
  className,
}: {
  shortcuts: Shortcut[];
  title?: string;
  caption?: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  // How many keys of the active shortcut are currently held down (0..n).
  const [held, setHeld] = useState(0);

  useEffect(() => {
    const keys = shortcuts[active]?.keys ?? [];
    const timers: ReturnType<typeof setTimeout>[] = [];

    let t = 460; // settle before the first press
    const step = 240; // gap between successive key presses
    const hold = 560; // hold the full combo
    const gap = 820; // pause after release before the next shortcut

    for (let i = 0; i < keys.length; i++) {
      t += step;
      const count = i + 1;
      timers.push(setTimeout(() => setHeld(count), t));
    }

    t += hold;
    timers.push(setTimeout(() => setHeld(0), t));

    t += gap;
    timers.push(
      setTimeout(() => setActive((a) => (a + 1) % shortcuts.length), t)
    );

    return () => timers.forEach(clearTimeout);
  }, [active, shortcuts]);

  const activeLabel = shortcuts[active]?.label ?? "";

  return (
    <div
      className={cn(
        "w-full max-w-[380px] rounded-2xl border border-line bg-panel p-4",
        "shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-1 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand-soft">
          <Command className="h-4 w-4" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="truncate text-xs text-zinc-500">{caption}</p>
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-0.5">
        {shortcuts.map((sc, index) => {
          const isActive = index === active;
          const fired = isActive && held === sc.keys.length && held > 0;
          const RowIcon = sc.icon;

          return (
            <div
              key={sc.label}
              className="relative flex items-center justify-between rounded-xl px-3 py-2.5"
            >
              {isActive && (
                <motion.div
                  layoutId="kbdActiveRow"
                  className="absolute inset-0 rounded-xl bg-brand/[0.06] ring-1 ring-inset ring-brand/20"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3">
                {RowIcon && (
                  <motion.div
                    animate={{
                      color: fired
                        ? "rgb(169,157,255)"
                        : isActive
                        ? "rgb(196,190,255)"
                        : "rgb(113,113,122)",
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex h-7 w-7 items-center justify-center"
                  >
                    <RowIcon className="h-[17px] w-[17px]" strokeWidth={1.75} />
                  </motion.div>
                )}
                <span
                  className={cn(
                    "text-[13px] font-medium transition-colors duration-200",
                    isActive ? "text-white" : "text-zinc-400"
                  )}
                >
                  {sc.label}
                </span>
              </div>

              <div className="relative z-10 flex items-center gap-1.5">
                {sc.keys.map((token, i) => (
                  <KeyCap
                    key={`${sc.label}-${i}`}
                    token={token}
                    down={isActive && i < held}
                    accent={isActive}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer status */}
      <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] px-2 pt-3">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-brand"
          animate={{
            opacity: [1, 0.35, 1],
            boxShadow: [
              "0 0 0 0 rgba(124,108,255,0.5)",
              "0 0 0 4px rgba(124,108,255,0)",
              "0 0 0 0 rgba(124,108,255,0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-xs text-zinc-500">Running</span>
        <span className="text-xs font-medium text-zinc-300">{activeLabel}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Demo                                                                      */
/* -------------------------------------------------------------------------- */

const DEMO_SHORTCUTS: Shortcut[] = [
  { label: "Command menu", keys: ["cmd", "K"], icon: Command },
  { label: "Search files", keys: ["cmd", "P"], icon: Search },
  { label: "Save changes", keys: ["cmd", "S"], icon: Save },
  { label: "Toggle sidebar", keys: ["cmd", "B"], icon: PanelLeft },
  { label: "Format document", keys: ["cmd", "shift", "F"], icon: Braces },
];

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-6">
      <div className="pointer-events-none absolute left-1/2 top-6 h-56 w-72 -translate-x-1/2 rounded-full bg-brand/15 blur-[90px]" />
      <KbdKeys shortcuts={DEMO_SHORTCUTS} />
    </div>
  );
}
