"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Account", "Profile", "Confirm"] as const;

export function MultiStepForm({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [done, setDone] = useState(false);

  function go(next: number) {
    setDirection(next > step ? 1 : -1);
    if (next >= STEPS.length) {
      setDone(true);
      return;
    }
    setStep(Math.max(0, next));
  }

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-line bg-panel p-6", className)}>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
          <span>
            Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
          </span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand to-glow"
            animate={{ width: `${((done ? STEPS.length : step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="relative min-h-[140px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {done ? (
            <motion.div
              key="done"
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center justify-center gap-3 py-6 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                <Check className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-white">All set!</p>
              <p className="text-xs text-zinc-400">Your account is ready to go.</p>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-3"
            >
              {step === 0 && (
                <>
                  <p className="text-sm text-zinc-400">Let&apos;s create your account.</p>
                  <input
                    placeholder="Email address"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-brand/60"
                  />
                </>
              )}
              {step === 1 && (
                <>
                  <p className="text-sm text-zinc-400">Tell us a bit about you.</p>
                  <input
                    placeholder="Full name"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-brand/60"
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <p className="text-sm text-zinc-400">Review and confirm your details.</p>
                  <div className="rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-zinc-300">
                    Everything looks good.
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!done && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => go(step - 1)}
            disabled={step === 0}
            className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white disabled:opacity-40"
          >
            Back
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => go(step + 1)}
            className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white"
          >
            {step === STEPS.length - 1 ? "Finish" : "Continue"}
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <MultiStepForm />
    </div>
  );
}
