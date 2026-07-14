"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export function PricingCards({
  tiers,
  className,
}: {
  tiers: PricingTier[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 items-center gap-6 md:grid-cols-3",
        className
      )}
    >
      {tiers.map((tier) => (
        <motion.div
          key={tier.name}
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={cn(
            "relative flex h-full flex-col rounded-2xl border p-6",
            tier.highlighted
              ? "border-brand/50 bg-gradient-to-b from-brand/10 to-panel shadow-[0_0_40px_-10px_rgba(124,108,255,0.5)]"
              : "border-line bg-panel"
          )}
        >
          {tier.highlighted && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              Most Popular
            </span>
          )}
          <h3 className="text-sm font-semibold text-white">{tier.name}</h3>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{tier.price}</span>
            {tier.period && (
              <span className="text-sm text-zinc-500">/{tier.period}</span>
            )}
          </div>
          <p className="mt-2 text-sm text-zinc-400">{tier.description}</p>

          <ul className="mt-6 flex-1 space-y-3">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" />
                {f}
              </li>
            ))}
          </ul>

          <button
            className={cn(
              "mt-8 w-full rounded-lg py-2.5 text-sm font-semibold transition-colors",
              tier.highlighted
                ? "bg-brand text-white hover:bg-brand/90"
                : "border border-line text-zinc-200 hover:bg-white/5"
            )}
          >
            {tier.cta}
          </button>
        </motion.div>
      ))}
    </div>
  );
}

const demoTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    period: "mo",
    description: "For side projects and prototypes.",
    features: ["5 components/mo", "Community support", "Basic themes"],
    cta: "Get started",
  },
  {
    name: "Pro",
    price: "$29",
    period: "mo",
    description: "For teams shipping real products.",
    features: [
      "Unlimited components",
      "Priority support",
      "All pro themes",
      "Figma files",
    ],
    highlighted: true,
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "mo",
    description: "For scaled orgs with custom needs.",
    features: ["Everything in Pro", "SSO & audit logs", "Dedicated Slack channel"],
    cta: "Contact sales",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <PricingCards tiers={demoTiers} className="max-w-3xl" />
    </div>
  );
}
