"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

interface Ripple {
  id: number;
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  onCopy,
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  onCopy?: (value: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const handleCopy = useCallback(async () => {
    const id = (rippleId.current += 1);
    setRipples((prev) => [...prev, { id }]);

    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      // Clipboard may be unavailable in sandboxed previews. The visual
      // feedback still fires so the interaction reads correctly.
    }

    onCopy?.(value);
    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 1600);
  }, [value, onCopy]);

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      aria-label={copied ? copiedLabel : label}
      className={cn(
        "group relative inline-flex select-none items-center gap-2 overflow-hidden rounded-lg px-3.5 py-2",
        "border text-[13px] font-medium transition-colors duration-300",
        copied
          ? "border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-50"
          : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white",
        className
      )}
      style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.06)" }}
    >
      {/* Soft ripple, centered, expanding outward on each press */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              initial={{ scale: 0, opacity: 0.45 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              onAnimationComplete={() =>
                setRipples((prev) => prev.filter((x) => x.id !== r.id))
              }
              className={cn(
                "h-8 w-8 rounded-full",
                copied ? "bg-emerald-300/25" : "bg-white/20"
              )}
            />
          ))}
        </AnimatePresence>
      </span>

      {/* Icon morphs clipboard -> check with a spring */}
      <span className="relative z-10 flex h-4 w-4 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -35, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 35, opacity: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 20 }}
              className="absolute text-emerald-400"
            >
              <Check className="h-4 w-4" strokeWidth={2.75} />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 20 }}
              className="absolute"
            >
              <Copy className="h-4 w-4" strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {label ? (
        <span className="relative z-10 inline-flex min-w-[3.25rem] justify-start overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "copied" : "idle"}
              initial={{ y: 9, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -9, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="block whitespace-nowrap"
            >
              {copied ? copiedLabel : label}
            </motion.span>
          </AnimatePresence>
        </span>
      ) : null}
    </motion.button>
  );
}

const COMMAND = "npx lumenite add copy-button";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <div className="w-full max-w-md">
        {/* Card shell */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-[0_20px_60px_-24px_rgba(0,0,0,0.8)]">
          {/* Thin bright top edge */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-3.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/12 text-brand-soft">
              <TerminalSquare className="h-3.5 w-3.5" />
            </span>
            <span className="text-[13px] font-medium text-zinc-200">
              Quickstart
            </span>
            <span className="ml-auto rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              bash
            </span>
          </div>

          {/* Command body */}
          <div className="px-5 py-6">
            <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-zinc-600">
              Add the component
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0a0a10] px-4 py-3.5">
              <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] no-scrollbar">
                <span className="text-zinc-600">$&nbsp;</span>
                <span className="text-emerald-300/90">npx</span>{" "}
                <span className="text-zinc-200">lumenite</span>{" "}
                <span className="text-zinc-200">add</span>{" "}
                <span className="text-brand-soft">copy-button</span>
                {/* Blinking caret keeps the panel alive at rest */}
                <motion.span
                  aria-hidden
                  className="ml-0.5 inline-block h-[15px] w-[7px] translate-y-[2px] rounded-[1px] bg-brand/70 align-middle"
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{
                    duration: 1.1,
                    times: [0, 0.5, 0.5, 1],
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </code>
            </div>

            {/* Footer meta + action */}
            <div className="mt-5 flex items-center justify-between">
              <span className="font-mono text-[11px] text-zinc-600">
                1 file, 0 dependencies
              </span>
              <CopyButton value={COMMAND} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
