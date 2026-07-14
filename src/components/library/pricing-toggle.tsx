"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Rolling number                                                            */
/* -------------------------------------------------------------------------- */

function RollingDigit({ digit, delay }: { digit: number; delay: number }) {
  return (
    <span
      className="relative inline-block overflow-hidden"
      style={{ width: "0.62ch", height: "1em" }}
    >
      <motion.span
        className="absolute left-0 top-0 flex w-full flex-col"
        initial={false}
        animate={{ y: `${-digit}em` }}
        transition={{ duration: 0.72, ease: EASE, delay }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="flex h-[1em] w-full items-end justify-center leading-none"
          >
            {i}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * An odometer-style number where each digit column rolls vertically to its
 * new value. Integer values only. Deterministic (no random, no float writes).
 */
export function RollingNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const rounded = Math.round(value);
  const digits = String(rounded).split("");
  return (
    <span
      className={cn("inline-flex tabular-nums", className)}
      aria-label={String(rounded)}
    >
      {digits.map((d, i) => (
        <RollingDigit key={i} digit={Number(d)} delay={i * 0.06} />
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pricing toggle                                                            */
/* -------------------------------------------------------------------------- */

const OPT_W = 108; // px per option
const PAD = 4; // px inset around the thumb

const THUMB_SPRING = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.85,
} as const;

/**
 * A monthly / annual billing toggle with a sliding thumb and a savings chip.
 * Controlled via `annual` + `onChange`. Fixed track geometry keeps the thumb
 * pixel-aligned to each option.
 */
export function PricingToggle({
  annual,
  onChange,
  savingsLabel = "Save 20%",
  className,
}: {
  annual: boolean;
  onChange: (annual: boolean) => void;
  savingsLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        role="tablist"
        aria-label="Billing period"
        className="relative inline-flex rounded-full border border-white/10 bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        style={{ padding: PAD }}
      >
        {/* Sliding thumb */}
        <motion.span
          aria-hidden
          className="absolute rounded-full border border-white/10 bg-white/[0.08]"
          style={{ top: PAD, bottom: PAD, left: PAD, width: OPT_W }}
          initial={false}
          animate={{ x: annual ? OPT_W : 0 }}
          transition={THUMB_SPRING}
        >
          <span className="absolute inset-0 rounded-full shadow-[0_0_22px_rgba(124,108,255,0.28)]" />
          <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </motion.span>

        {(["monthly", "annual"] as const).map((key) => {
          const isAnnual = key === "annual";
          const active = isAnnual === annual;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(isAnnual)}
              style={{ width: OPT_W }}
              className={cn(
                "relative z-10 select-none rounded-full py-2 text-sm font-medium capitalize transition-colors duration-300",
                "outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-panel",
                active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {key}
            </button>
          );
        })}
      </div>

      {/* Savings chip */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{
          scale: annual ? 1 : 0.94,
          opacity: annual ? 1 : 0.5,
        }}
        transition={{ duration: 0.32, ease: EASE }}
        className={cn(
          "whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-colors duration-300",
          annual
            ? "border-brand/40 bg-brand/15 text-brand-soft"
            : "border-white/10 bg-white/[0.03] text-zinc-500"
        )}
      >
        {savingsLabel}
      </motion.span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Demo                                                                       */
/* -------------------------------------------------------------------------- */

const PLAN = {
  name: "Pro",
  tagline: "For teams shipping every day.",
  monthly: 40,
  annual: 32, // per month, billed annually
  features: [
    "Unlimited projects and seats",
    "Advanced usage analytics",
    "Priority support, 4h response",
  ],
};

const ANNUAL_TOTAL = PLAN.annual * 12; // 384
const SAVED_PER_YEAR = (PLAN.monthly - PLAN.annual) * 12; // 96
const SAVINGS_PCT = Math.round((1 - PLAN.annual / PLAN.monthly) * 100); // 20

export default function Demo() {
  const [annual, setAnnual] = useState(false);
  const [nonce, setNonce] = useState(0);

  // Idle loop: gently flip the toggle so a static preview looks alive.
  // `nonce` restarts the timer after a manual interaction so it does not
  // snap back immediately.
  useEffect(() => {
    const id = setInterval(() => setAnnual((a) => !a), 2900);
    return () => clearInterval(id);
  }, [nonce]);

  function handleChange(next: boolean) {
    setAnnual(next);
    setNonce((n) => n + 1);
  }

  const price = annual ? PLAN.annual : PLAN.monthly;

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="relative w-full max-w-[21rem] overflow-hidden rounded-[26px] border border-white/10 bg-panel p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
        {/* Top edge highlight */}
        <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {/* Ambient glow behind the price */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-20 h-40 w-40 -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,108,255,0.22), transparent 70%)",
          }}
          animate={{ opacity: annual ? 0.9 : 0.55 }}
          transition={{ duration: 0.6, ease: EASE }}
        />

        {/* Header */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand-soft">
            <Zap className="h-[17px] w-[17px]" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{PLAN.name}</h3>
            <p className="text-xs text-zinc-500">{PLAN.tagline}</p>
          </div>
        </div>

        {/* Price */}
        <div className="relative mt-5 flex items-end justify-center">
          <span className="mb-[0.5em] text-2xl font-medium text-zinc-400">
            $
          </span>
          <RollingNumber
            value={price}
            className="text-[54px] font-semibold leading-none tracking-tight text-white"
          />
          <span className="mb-[0.5em] ml-1 text-sm font-medium text-zinc-500">
            /mo
          </span>
        </div>

        {/* Billing detail */}
        <div className="relative mt-2 h-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={annual ? "annual" : "monthly"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="absolute inset-x-0 text-center text-xs text-zinc-500"
            >
              {annual
                ? `Billed $${ANNUAL_TOTAL} yearly, you save $${SAVED_PER_YEAR}`
                : "Billed monthly, cancel anytime"}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Toggle */}
        <div className="relative mt-5 flex justify-center">
          <PricingToggle
            annual={annual}
            onChange={handleChange}
            savingsLabel={`Save ${SAVINGS_PCT}%`}
          />
        </div>

        {/* Divider */}
        <div className="relative my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Features */}
        <ul className="relative space-y-2.5">
          {PLAN.features.map((feat) => (
            <li key={feat} className="flex items-center gap-3 text-sm text-zinc-300">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand/25 bg-brand/10 text-brand-soft">
                <Check className="h-3 w-3" strokeWidth={2.5} />
              </span>
              {feat}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <motion.button
          type="button"
          initial={false}
          animate={{
            boxShadow: [
              "0 10px 30px -12px rgba(124,108,255,0.45)",
              "0 14px 40px -12px rgba(124,108,255,0.7)",
              "0 10px 30px -12px rgba(124,108,255,0.45)",
            ],
          }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className="relative mt-5 w-full overflow-hidden rounded-xl py-2.5 text-sm font-semibold text-white"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #7c6cff 0%, #5b8cff 100%)",
          }}
        >
          <span className="absolute inset-x-0 top-0 h-px bg-white/40" />
          Start 14-day trial
        </motion.button>
      </div>
    </div>
  );
}
