"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  GitBranch,
  GitCommitHorizontal,
  Globe,
  Rocket,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

/**
 * A centered dialog that springs into view over a blurred backdrop.
 * Positioned `absolute`, so its nearest positioned ancestor must be
 * `relative` (the demo container handles this). Escape and backdrop
 * clicks both request a close.
 */
export function AnimatedModal({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center p-5"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            variants={backdropVariants}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="animated-modal-title"
            variants={panelVariants}
            transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.9 }}
            className={cn(
              "relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]",
              className,
            )}
          >
            {/* idle glow so a frozen frame still reads as alive */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(130% 120% at 50% -10%, rgba(124,108,255,0.16), transparent 55%)",
              }}
              animate={{ opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* thin bright top edge with a slow sweeping highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
              <motion.div
                className="h-px w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                animate={{ x: ["-130%", "380%"] }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1.4,
                }}
              />
            </div>

            <div className="relative">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Small labelled row used inside the demo's deploy summary. */
function SummaryRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm text-zinc-400">
        <span className="text-zinc-500">{icon}</span>
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-medium text-zinc-200",
          mono && "font-mono tracking-tight",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(true);

  // Gentle self-playing loop for the static preview. Any real click
  // stops it so the component feels interactive, not scripted.
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setOpen((o) => !o), open ? 3000 : 1700);
    return () => clearTimeout(t);
  }, [auto, open]);

  const handleOpen = () => {
    setAuto(false);
    setOpen(true);
  };
  const handleClose = () => {
    setAuto(false);
    setOpen(false);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-6">
      {/* ambient depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 0%, rgba(91,140,255,0.08), transparent 60%)",
        }}
      />

      {/* trigger */}
      <div className="relative">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-2xl bg-brand/25 blur-xl"
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.button
          type="button"
          onClick={handleOpen}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-panel px-5 py-2.5 text-sm font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <Rocket className="h-4 w-4 text-brand-soft" />
          Review deployment
        </motion.button>
      </div>

      <AnimatedModal open={open} onClose={handleClose}>
        {/* header */}
        <div className="relative px-5 pt-5">
          <div className="flex items-start gap-3 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-soft ring-1 ring-brand/25">
              <Rocket className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3
                id="animated-modal-title"
                className="text-[15px] font-semibold text-white"
              >
                Ship to production
              </h3>
              <p className="mt-0.5 truncate text-[13px] text-zinc-400">
                lumenite-ui · main
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Dismiss"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* content */}
        <div className="px-5 pt-4">
          <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-white/[0.02]">
            <SummaryRow
              icon={<GitBranch className="h-4 w-4" />}
              label="Branch"
              value="main → production"
            />
            <SummaryRow
              icon={<GitCommitHorizontal className="h-4 w-4" />}
              label="Commit"
              value="a3f9c21"
              mono
            />
            <SummaryRow
              icon={<Globe className="h-4 w-4" />}
              label="Regions"
              value="iad1 · sfo1 · fra1"
            />
          </div>
          <div className="flex items-center justify-between px-1 pt-3 text-xs text-zinc-500">
            <span>9 files changed</span>
            <span className="font-mono">
              <span className="text-emerald-400">+182</span>{" "}
              <span className="text-rose-400">-47</span>
            </span>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center justify-end gap-2.5 p-5 pt-5">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <motion.button
            type="button"
            onClick={handleClose}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(124,108,255,0.5),0_10px_30px_-8px_rgba(124,108,255,0.65)]"
          >
            Deploy
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
          </motion.button>
        </div>
      </AnimatedModal>
    </div>
  );
}
