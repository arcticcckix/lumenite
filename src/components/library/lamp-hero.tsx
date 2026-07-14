"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LampHero({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-void",
        className
      )}
    >
      <div className="absolute inset-0 flex items-start justify-center">
        <motion.div
          initial={{ opacity: 0.4, width: "8rem" }}
          animate={{ opacity: 1, width: "20rem" }}
          transition={{ delay: 0.2, duration: 1.2, ease: "easeInOut" }}
          className="absolute top-0 h-56 w-80"
          style={{
            background:
              "conic-gradient(from 90deg at 50% 0%, transparent 0deg, rgba(124,108,255,0.55) 90deg, transparent 180deg)",
          }}
        />
        <motion.div
          initial={{ opacity: 0.4, width: "8rem" }}
          animate={{ opacity: 1, width: "20rem" }}
          transition={{ delay: 0.2, duration: 1.2, ease: "easeInOut" }}
          className="absolute top-0 h-56 w-80"
          style={{
            background:
              "conic-gradient(from 270deg at 50% 0%, transparent 180deg, rgba(91,140,255,0.55) 270deg, transparent 360deg)",
          }}
        />
        <motion.div
          initial={{ width: "6rem", opacity: 0.5 }}
          animate={{ width: "14rem", opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.2, ease: "easeInOut" }}
          className="absolute top-0 h-1 rounded-full bg-brand-soft shadow-[0_0_60px_20px_rgba(124,108,255,0.6)]"
        />
        <div className="absolute top-0 h-56 w-full bg-void [mask-image:radial-gradient(circle_at_top,transparent_10%,black_80%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="relative z-10 mt-10 flex flex-col items-center px-6 text-center"
      >
        <h1 className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
            {subtitle}
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}

export default function Demo() {
  return (
    <LampHero
      title="Illuminate your product"
      subtitle="A glowing lamp effect that draws every eye straight to your headline."
    />
  );
}
