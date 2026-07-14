"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SpotlightHero({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-void",
        className
      )}
    >
      <svg
        className="pointer-events-none absolute -top-1/4 left-1/2 h-[60rem] w-[100rem] -translate-x-1/2 animate-spotlight opacity-70"
        viewBox="0 0 3787 2842"
        fill="none"
      >
        <g filter="url(#lumenite-spotlight-blur)">
          <ellipse
            cx="1924.71"
            cy="273.5"
            rx="1924.71"
            ry="273.5"
            transform="matrix(-0.8 0.6 0.6 0.8 300 -100)"
            fill="rgba(124,108,255,0.28)"
          />
        </g>
        <defs>
          <filter id="lumenite-spotlight-blur">
            <feGaussianBlur stdDeviation="150" />
          </filter>
        </defs>
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex max-w-xl flex-col items-center px-6 text-center"
      >
        {eyebrow ? (
          <span className="mb-4 rounded-full border border-line bg-panel px-3 py-1 text-xs text-brand-soft">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            {subtitle}
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}

export default function Demo() {
  return (
    <SpotlightHero
      eyebrow="Introducing Lumenite"
      title="Build interfaces that glow"
      subtitle="A sweeping spotlight animation that gives any hero section instant depth and drama."
    />
  );
}
