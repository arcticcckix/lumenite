"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Eye,
  RefreshCw,
  Rocket,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SplitAction = {
  label: string;
  hint: string;
  icon: LucideIcon;
};

export type SplitButtonProps = {
  actions: SplitAction[];
  defaultIndex?: number;
  autoCycle?: boolean;
  onAction?: (action: SplitAction, index: number) => void;
  className?: string;
};

const SPRING = { type: "spring" as const, stiffness: 460, damping: 34, mass: 0.9 };
const PRESS = { type: "spring" as const, stiffness: 700, damping: 30 };
const MENU = { type: "spring" as const, stiffness: 520, damping: 40, mass: 0.7 };
const HIGHLIGHT = { type: "spring" as const, stiffness: 640, damping: 46 };

export function SplitButton({
  actions,
  defaultIndex = 0,
  autoCycle = false,
  onAction,
  className,
}: SplitButtonProps) {
  const [selected, setSelected] = useState(defaultIndex);
  const [active, setActive] = useState(defaultIndex);
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(autoCycle);
  const [pulse, setPulse] = useState(0);

  const selectedRef = useRef(selected);
  const onActionRef = useRef(onAction);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);
  useEffect(() => {
    onActionRef.current = onAction;
  }, [onAction]);

  function commit(index: number) {
    setSelected(index);
    setActive(index);
    setPulse((p) => p + 1);
    onActionRef.current?.(actions[index], index);
  }

  // Idle auto-cycle: opens the menu, scans the highlight across the
  // alternates, commits one, then closes. Fully deterministic.
  useEffect(() => {
    if (!auto || actions.length < 2) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        timers.push(setTimeout(res, ms));
      });

    async function run() {
      await wait(1300);
      let step = 0;
      while (!cancelled) {
        const from = selectedRef.current;
        const distance = 1 + (step % (actions.length - 1));
        const target = (from + distance) % actions.length;
        step += 1;

        setOpen(true);
        setActive(from);
        await wait(560);
        if (cancelled) break;

        let cursor = from;
        while (cursor !== target) {
          cursor = (cursor + 1) % actions.length;
          setActive(cursor);
          await wait(280);
          if (cancelled) break;
        }
        if (cancelled) break;

        await wait(340);
        commit(target);
        await wait(520);
        if (cancelled) break;

        setOpen(false);
        await wait(2100);
      }
    }

    void run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, actions]);

  useEffect(
    () => () => {
      if (resumeRef.current) clearTimeout(resumeRef.current);
    },
    [],
  );

  function pauseAuto() {
    if (resumeRef.current) clearTimeout(resumeRef.current);
    if (autoCycle) setAuto(false);
  }
  function scheduleResume() {
    if (!autoCycle) return;
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setAuto(true), 2400);
  }

  const current = actions[selected];
  const CurrentIcon = current.icon;

  return (
    <div
      onMouseEnter={pauseAuto}
      onMouseLeave={() => {
        setActive(selectedRef.current);
        scheduleResume();
      }}
      className={cn("relative inline-block text-left", className)}
    >
      {/* Confirmation pulse, re-fires on every committed pick */}
      <motion.span
        key={pulse}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        initial={{ opacity: 0.5, scale: 0.97 }}
        animate={{ opacity: 0, scale: 1.14 }}
        transition={{ duration: 0.62, ease: "easeOut" }}
        style={{
          boxShadow:
            "0 0 0 1px rgba(124,108,255,0.5), 0 0 26px 2px rgba(124,108,255,0.32)",
        }}
      />

      {/* Button row */}
      <div className="relative z-10 flex items-stretch rounded-xl border border-white/10 bg-panel shadow-[0_12px_34px_-14px_rgba(0,0,0,0.85)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        <motion.button
          type="button"
          whileTap={{ scale: 0.965 }}
          transition={PRESS}
          onClick={() => {
            pauseAuto();
            setOpen(false);
            commit(selected);
          }}
          className="relative z-10 flex items-center rounded-l-[11px] py-2.5 pl-4 pr-3.5 text-[13px] font-medium text-white outline-none transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.05]"
        >
          <motion.span layout transition={SPRING} className="flex items-center gap-2.5">
            <span className="relative inline-flex h-4 w-4 items-center justify-center">
              <AnimatePresence initial={false}>
                <motion.span
                  key={selected}
                  initial={{ scale: 0.4, opacity: 0, rotate: -35 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.4, opacity: 0, rotate: 35 }}
                  transition={SPRING}
                  className="absolute inset-0 flex items-center justify-center text-brand-soft"
                >
                  <CurrentIcon className="h-4 w-4" strokeWidth={2} />
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="relative block overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={selected}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={SPRING}
                  className="block whitespace-nowrap"
                >
                  {current.label}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.span>
        </motion.button>

        <span
          aria-hidden
          className="my-2 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent"
        />

        <motion.button
          type="button"
          aria-label="More actions"
          aria-expanded={open}
          whileTap={{ scale: 0.965 }}
          transition={PRESS}
          onClick={() => {
            pauseAuto();
            setOpen((o) => !o);
          }}
          className="relative z-10 flex items-center rounded-r-[11px] px-2.5 text-zinc-400 outline-none transition-colors hover:bg-white/[0.04] hover:text-zinc-200 focus-visible:bg-white/[0.05]"
        >
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={SPRING}>
            <ChevronDown className="h-4 w-4" strokeWidth={2.25} />
          </motion.span>
        </motion.button>
      </div>

      {/* Menu of alternate actions */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={MENU}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+10px)] z-30 w-[272px] rounded-xl border border-white/10 bg-panel/95 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <div className="px-2.5 pb-1.5 pt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
              Choose action
            </div>
            {actions.map((action, i) => {
              const ItemIcon = action.icon;
              const isSelected = i === selected;
              const isActive = i === active;
              return (
                <button
                  key={action.label}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    pauseAuto();
                    setOpen(false);
                    commit(i);
                  }}
                  className="group/item relative flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left outline-none"
                >
                  {isActive && (
                    <motion.span
                      layoutId="split-menu-highlight"
                      transition={HIGHLIGHT}
                      className="absolute inset-0 rounded-lg bg-white/[0.055] ring-1 ring-inset ring-white/10"
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-white/[0.02] transition-colors",
                      isActive
                        ? "border-brand/30 text-brand-soft"
                        : "border-white/10 text-zinc-400",
                    )}
                  >
                    <ItemIcon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="relative z-10 min-w-0 flex-1">
                    <span className="block text-[13px] font-medium leading-tight text-zinc-100">
                      {action.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] leading-tight text-zinc-500">
                      {action.hint}
                    </span>
                  </span>
                  {isSelected && (
                    <Check
                      className="relative z-10 h-3.5 w-3.5 shrink-0 text-brand-soft"
                      strokeWidth={2.5}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DEMO_ACTIONS: SplitAction[] = [
  { label: "Deploy to Production", hint: "Ship main to production", icon: Rocket },
  { label: "Deploy Preview", hint: "Spin up a preview URL", icon: Eye },
  { label: "Redeploy Latest", hint: "Rebuild the last commit", icon: RefreshCw },
  { label: "Roll Back", hint: "Revert to the previous build", icon: Undo2 },
];

export default function Demo() {
  const [last, setLast] = useState<SplitAction>(DEMO_ACTIONS[0]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden p-6">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,108,255,0.14), transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600">
          Deployments
        </span>
        <p className="max-w-[15rem] text-center text-[13px] leading-relaxed text-zinc-500">
          One default action, a menu of the rest. The library cycles picks so you
          can feel the motion.
        </p>
      </div>

      <SplitButton
        className="relative z-10"
        actions={DEMO_ACTIONS}
        autoCycle
        onAction={(action) => setLast(action)}
      />

      <div className="relative z-10 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glow/70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-glow" />
        </span>
        <span className="text-[11px] text-zinc-500">Default action</span>
        <span className="text-[11px] font-medium text-zinc-200">{last.label}</span>
      </div>
    </div>
  );
}
