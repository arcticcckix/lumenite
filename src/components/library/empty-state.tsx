"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { FileText, Plus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

interface CardSpec {
  tx: number;
  rot: number;
  scale: number;
  opacity: number;
  z: number;
  duration: number;
  delay: number;
  floatY: number;
}

// Deterministic layout for the fanned document stack.
const CARDS: CardSpec[] = [
  { tx: -24, rot: -10, scale: 0.9, opacity: 0.5, z: 1, duration: 4.8, delay: 0.3, floatY: -5 },
  { tx: 24, rot: 10, scale: 0.9, opacity: 0.5, z: 2, duration: 5.4, delay: 0.7, floatY: -5 },
  { tx: 0, rot: 0, scale: 1, opacity: 1, z: 3, duration: 4.4, delay: 0, floatY: -8 },
];

function FrontDoc() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/[0.14] bg-gradient-to-b from-[#171722] to-[#0c0c13] p-3 shadow-[0_16px_36px_-14px_rgba(0,0,0,0.85)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="mb-2.5 flex items-center gap-1.5">
        <div className="flex h-4 w-4 items-center justify-center rounded-[5px] bg-brand/90 shadow-[0_0_10px_-1px_rgba(124,108,255,0.7)]">
          <FileText className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
        </div>
        <div className="h-1.5 w-9 rounded-full bg-white/20" />
      </div>
      <div className="space-y-1.5">
        <div className="h-1.5 w-full rounded-full bg-white/10" />
        <div className="h-1.5 w-[82%] rounded-full bg-white/10" />
        <div className="h-1.5 w-[64%] rounded-full bg-white/10" />
        <div className="h-1.5 w-[42%] rounded-full bg-brand/45" />
      </div>
    </div>
  );
}

function BackDoc() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-b from-[#101019] to-[#0a0a10] p-3">
      <div className="space-y-1.5 pt-1">
        <div className="h-1.5 w-2/3 rounded-full bg-white/[0.06]" />
        <div className="h-1.5 w-full rounded-full bg-white/[0.06]" />
        <div className="h-1.5 w-1/2 rounded-full bg-white/[0.06]" />
      </div>
    </div>
  );
}

export function DocumentStack() {
  return (
    <div className="relative flex h-[150px] w-full items-center justify-center">
      {/* Soft breathing glow */}
      <motion.div
        aria-hidden
        className="absolute h-40 w-40 rounded-full bg-brand/20 blur-[42px]"
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Orbiting dashed ring with a single glow node */}
      <motion.div
        aria-hidden
        className="absolute h-[148px] w-[148px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-white/[0.08]" />
        <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow shadow-[0_0_10px_2px_rgba(91,140,255,0.55)]" />
      </motion.div>
      {/* Fanned, gently floating document cards */}
      <div className="relative h-[116px] w-[94px]">
        {CARDS.map((c, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{ zIndex: c.z }}
            initial={{ opacity: 0, x: c.tx, rotate: c.rot, scale: c.scale * 0.9, y: 18 }}
            animate={{ opacity: c.opacity, x: c.tx, rotate: c.rot, scale: c.scale, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 * i, ease: EASE }}
          >
            <motion.div
              className="h-full w-full"
              animate={{ y: [0, c.floatY, 0] }}
              transition={{
                duration: c.duration,
                delay: c.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {i === CARDS.length - 1 ? <FrontDoc /> : <BackDoc />}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export interface EmptyStateAction {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  illustration?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  illustration,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        "relative w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-panel to-surface p-8",
        className
      )}
    >
      {/* Ambient top glow and a thin bright top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-44 w-72 -translate-x-1/2 rounded-full bg-brand/[0.12] blur-[64px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div variants={item} className="w-full">
          {illustration ?? <DocumentStack />}
        </motion.div>

        <motion.h3
          variants={item}
          className="mt-6 text-[17px] font-semibold tracking-tight text-white"
        >
          {title}
        </motion.h3>

        <motion.p
          variants={item}
          className="mt-2 max-w-[300px] text-sm leading-relaxed text-zinc-400"
        >
          {description}
        </motion.p>

        {(primaryAction || secondaryAction) && (
          <motion.div
            variants={item}
            className="mt-6 flex items-center gap-2.5"
          >
            {primaryAction && (
              <motion.button
                type="button"
                onClick={primaryAction.onClick}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(124,108,255,0.5),0_10px_26px_-10px_rgba(124,108,255,0.65)] transition-colors hover:bg-[#8878ff]"
              >
                {primaryAction.icon ?? <Plus className="h-4 w-4" strokeWidth={2.4} />}
                {primaryAction.label}
              </motion.button>
            )}
            {secondaryAction && (
              <motion.button
                type="button"
                onClick={secondaryAction.onClick}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
              >
                {secondaryAction.icon ?? <Upload className="h-4 w-4" strokeWidth={2.2} />}
                {secondaryAction.label}
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <EmptyState
        title="No documents yet"
        description="Create your first document, or import an existing file. Everything you add lands right here, ready when you need it."
        primaryAction={{ label: "New document" }}
        secondaryAction={{ label: "Import file" }}
      />
    </div>
  );
}
