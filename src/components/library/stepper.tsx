"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface StepItem {
  label: string;
  description?: string;
}

type StepState = "complete" | "current" | "upcoming";

function StepMarker({
  index,
  state,
  label,
  description,
}: {
  index: number;
  state: StepState;
  label: string;
  description?: string;
}) {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center">
      <div className="relative flex h-12 w-12 items-center justify-center">
        {state === "current" && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-brand"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity }}
          />
        )}
        <div
          className={cn(
            "relative flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold transition-[background-color,border-color,box-shadow,color] duration-500",
            state === "complete" &&
              "border-transparent bg-gradient-to-br from-brand to-glow text-white shadow-[0_0_20px_-2px_rgba(124,108,255,0.6)]",
            state === "current" &&
              "border-brand bg-brand/10 text-white shadow-[0_0_24px_-4px_rgba(124,108,255,0.7)]",
            state === "upcoming" && "border-white/10 bg-white/[0.03] text-zinc-500"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {state === "complete" ? (
              <motion.span
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 520, damping: 22 }}
              >
                <Check className="h-5 w-5" strokeWidth={2.75} />
              </motion.span>
            ) : (
              <motion.span
                key="number"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                {index + 1}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 text-center">
        <div
          className={cn(
            "text-xs font-medium transition-colors duration-500",
            state === "upcoming" ? "text-zinc-500" : "text-white"
          )}
        >
          {label}
        </div>
        {description && (
          <div className="mt-0.5 text-[11px] leading-tight text-zinc-600">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

export function Stepper({
  steps,
  active,
  className,
}: {
  steps: StepItem[];
  active: number;
  className?: string;
}) {
  const edge = Math.round((50 / steps.length) * 1000) / 1000;
  const denom = Math.max(steps.length - 1, 1);
  const rawFill = Math.min(Math.max(active / denom, 0), 1);
  const fillPct = Math.round(rawFill * 10000) / 100;

  return (
    <div className={cn("relative w-full", className)}>
      {/* connecting track */}
      <div
        aria-hidden
        className="pointer-events-none absolute h-0.5 -translate-y-1/2 rounded-full bg-white/10"
        style={{ top: 24, left: `${edge}%`, right: `${edge}%` }}
      >
        <motion.div
          className="relative h-full rounded-full bg-gradient-to-r from-brand to-glow"
          style={{ boxShadow: "0 0 12px rgba(91,140,255,0.55)" }}
          initial={{ width: "0%" }}
          animate={{ width: `${fillPct}%` }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(91,140,255,0.85)]" />
        </motion.div>
      </div>

      {/* markers */}
      <div className="relative flex">
        {steps.map((step, i) => {
          const state: StepState =
            i < active ? "complete" : i === active ? "current" : "upcoming";
          return (
            <StepMarker
              key={step.label}
              index={i}
              state={state}
              label={step.label}
              description={step.description}
            />
          );
        })}
      </div>
    </div>
  );
}

const DEMO_STEPS: StepItem[] = [
  { label: "Account", description: "Your details" },
  { label: "Plan", description: "Pick a tier" },
  { label: "Payment", description: "Billing info" },
  { label: "Done", description: "All set" },
];

const DEMO_CONTENT: { title: string; body: string }[] = [
  {
    title: "Create your account",
    body: "Add your name and work email to get started. We will send a verification link before the next step.",
  },
  {
    title: "Choose your plan",
    body: "Start on Pro with a 14 day trial. Switch tiers or cancel anytime from your workspace settings.",
  },
  {
    title: "Add a payment method",
    body: "Enter a card to activate billing. Nothing is charged until your trial ends two weeks from today.",
  },
  {
    title: "Review and confirm",
    body: "Everything looks good. Confirm the details to finish provisioning your new workspace.",
  },
];

export default function Demo() {
  const total = DEMO_STEPS.length;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const delay = active >= total ? 2100 : active === 0 ? 1100 : 1450;
    const t = setTimeout(() => {
      setActive((a) => (a >= total ? 0 : a + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [active, total]);

  const done = active >= total;
  const percent = Math.round((Math.min(active, total) / total) * 100);
  const contentKey = done ? "done" : active;

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-panel p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-soft">
              Onboarding
            </div>
            <h3 className="mt-1 text-lg font-semibold text-white">
              Set up your workspace
            </h3>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-white">
              {done ? "Complete" : `Step ${Math.min(active + 1, total)} of ${total}`}
            </div>
            <div className="text-[11px] text-zinc-500">{percent}% complete</div>
          </div>
        </div>

        <Stepper steps={DEMO_STEPS} active={active} />

        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={contentKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {done ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-glow text-white shadow-[0_0_20px_-2px_rgba(124,108,255,0.6)]">
                    <Check className="h-5 w-5" strokeWidth={2.75} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Workspace ready
                    </div>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-400">
                      Your account is live. Redirecting you to the dashboard.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm font-semibold text-white">
                    {DEMO_CONTENT[active].title}
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
                    {DEMO_CONTENT[active].body}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
