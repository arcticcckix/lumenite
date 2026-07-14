"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "loading" | "success" | "error";

interface PhaseCopy {
  title: string;
  subtitle: string;
}

interface PhaseStyle {
  accent: string;
  ring: string;
  glow: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const PHASE_STYLES: Record<Phase, PhaseStyle> = {
  loading: {
    accent: "#a99dff",
    ring: "rgba(124, 108, 255, 0.16)",
    glow: "rgba(124, 108, 255, 0.22)",
  },
  success: {
    accent: "#34d399",
    ring: "rgba(52, 211, 153, 0.16)",
    glow: "rgba(52, 211, 153, 0.20)",
  },
  error: {
    accent: "#fb7185",
    ring: "rgba(251, 113, 133, 0.16)",
    glow: "rgba(251, 113, 133, 0.20)",
  },
};

const DEFAULT_COPY: Record<Phase, PhaseCopy> = {
  loading: { title: "Saving changes", subtitle: "Syncing 3 fields to your workspace" },
  success: { title: "Changes saved", subtitle: "Synced to the cloud just now" },
  error: { title: "Couldn't save", subtitle: "Network hiccup. Retrying in a moment" },
};

// Deterministic outcome cadence: success is the norm, an occasional failure.
const OUTCOME_PATTERN: Phase[] = [
  "success",
  "success",
  "success",
  "error",
  "success",
  "success",
];

function Spinner({ color }: { color: string }) {
  return (
    <motion.div
      className="h-[18px] w-[18px]"
      style={{ color }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="2.4"
        />
        <path
          d="M12 3a9 9 0 0 1 9 9"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

function CheckGlyph({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" style={{ color }}>
      <motion.path
        d="M5 12.5l4 4 10-10.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.42, ease: EASE }}
      />
    </svg>
  );
}

function ErrorGlyph({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" style={{ color }}>
      <motion.path
        d="M7 7l10 10"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.28, ease: EASE }}
      />
      <motion.path
        d="M17 7L7 17"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.28, delay: 0.12, ease: EASE }}
      />
    </svg>
  );
}

function LoadingDots({ color }: { color: string }) {
  return (
    <span className="ml-1 inline-flex items-center align-middle">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="ml-[3px] inline-block h-[3px] w-[3px] rounded-full"
          style={{ background: color }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            delay: i * 0.16,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function ToastPromise({
  className,
  loadingMs = 1900,
  holdMs = 1700,
  gapMs = 850,
  loop = true,
  showTrigger = true,
  copy = DEFAULT_COPY,
}: {
  className?: string;
  loadingMs?: number;
  holdMs?: number;
  gapMs?: number;
  loop?: boolean;
  showTrigger?: boolean;
  copy?: Record<Phase, PhaseCopy>;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [visible, setVisible] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runRef = useRef<() => void>(() => {});
  const index = useRef(0);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const at = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    runRef.current = () => {
      clear();
      const outcome = OUTCOME_PATTERN[index.current % OUTCOME_PATTERN.length];
      index.current += 1;

      setPhase("loading");
      setVisible(true);

      at(() => setPhase(outcome), loadingMs);
      at(() => setVisible(false), loadingMs + holdMs);
      if (loop) {
        at(() => runRef.current(), loadingMs + holdMs + gapMs);
      }
    };

    runRef.current();
    return clear;
  }, [loadingMs, holdMs, gapMs, loop]);

  const s = PHASE_STYLES[phase];
  const c = copy[phase];

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Phase-tinted ambient glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/2 h-40 w-56 -translate-x-1/2 rounded-full blur-2xl"
        animate={{ background: `radial-gradient(circle, ${s.glow}, transparent 70%)` }}
        transition={{ duration: 0.6, ease: EASE }}
      />

      <div className="relative h-[92px] w-[330px]">
        <AnimatePresence>
          {visible && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute inset-x-0 top-0"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]">
                {/* Thin bright top edge */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
                  }}
                />

                <div className="flex items-center gap-3.5 px-4 py-3.5">
                  <motion.div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    animate={{
                      backgroundColor: s.ring,
                      boxShadow: `inset 0 0 0 1px ${s.ring}`,
                    }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={phase}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        className="flex items-center justify-center"
                      >
                        {phase === "loading" ? (
                          <Spinner color={s.accent} />
                        ) : phase === "success" ? (
                          <CheckGlyph color={s.accent} />
                        ) : (
                          <ErrorGlyph color={s.accent} />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>

                  <div className="min-w-0 flex-1">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={phase}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.26, ease: EASE }}
                      >
                        <div className="flex items-center text-[13.5px] font-semibold leading-none text-white">
                          <span className="truncate">{c.title}</span>
                          {phase === "loading" && <LoadingDots color={s.accent} />}
                        </div>
                        <p className="mt-1.5 truncate text-[12px] leading-none text-zinc-400">
                          {c.subtitle}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Progress rail */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden bg-white/[0.06]">
                  {phase === "loading" ? (
                    <motion.div
                      className="absolute top-0 h-full w-1/3 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`,
                      }}
                      animate={{ x: ["-110%", "320%"] }}
                      transition={{
                        duration: 1.15,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ) : (
                    <motion.div
                      className="h-full origin-left"
                      style={{ background: s.accent }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showTrigger && (
        <motion.button
          type="button"
          onClick={() => runRef.current()}
          whileTap={{ scale: 0.97 }}
          className="group mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[12.5px] font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
        >
          <RotateCw className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:-rotate-180" />
          Run again
        </motion.button>
      )}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-void">
      {/* Faint grid wash for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 20%, rgba(124,108,255,0.08), transparent 55%)",
        }}
      />

      <div className="absolute left-5 top-5 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          Autosave
        </span>
      </div>

      <ToastPromise />
    </div>
  );
}
