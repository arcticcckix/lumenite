"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Step {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function HowItWorks({
  steps,
  className,
}: {
  steps: Step[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
        <svg
          className="pointer-events-none absolute left-0 top-8 hidden h-[2px] w-full sm:block"
          preserveAspectRatio="none"
          viewBox="0 0 100 2"
        >
          <line
            x1="16"
            y1="1"
            x2="84"
            y2="1"
            stroke="var(--color-line)"
            strokeWidth="1"
          />
          <motion.line
            x1="16"
            y1="1"
            x2="84"
            y2="1"
            stroke="var(--color-brand)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            className="relative flex flex-col items-center text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: 0.15 * i, ease: "easeOut" }}
          >
            <motion.div
              className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-panel text-lg font-semibold text-brand-soft shadow-[0_0_0_6px_var(--color-void)]"
              initial={{ scale: 0.6 }}
              animate={inView ? { scale: 1 } : { scale: 0.6 }}
              transition={{ duration: 0.4, delay: 0.15 * i + 0.1, ease: "easeOut" }}
            >
              {step.icon ?? i + 1}
            </motion.div>
            <h3 className="text-base font-semibold text-white">{step.title}</h3>
            <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-zinc-400">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-10">
      <HowItWorks
        className="max-w-2xl"
        steps={[
          {
            title: "Connect",
            description: "Link your workspace in seconds, no config needed.",
          },
          {
            title: "Customize",
            description: "Tune the theme tokens to match your brand.",
          },
          {
            title: "Launch",
            description: "Ship a polished experience your users will love.",
          },
        ]}
      />
    </div>
  );
}
