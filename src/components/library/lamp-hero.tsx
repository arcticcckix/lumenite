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
  const grow = {
    initial: { opacity: 0.5, width: "8rem" },
    animate: { opacity: 1, width: "30rem" },
    transition: { delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <div
      className={cn(
        "relative min-h-[440px] w-full overflow-hidden bg-void",
        className
      )}
    >
      {/* lamp: the bright bar lives at ~34% from top, cone spreads downward */}
      <div className="absolute inset-x-0 top-[34%] flex items-start justify-center">
        {/* left cone */}
        <motion.div
          {...grow}
          className="absolute right-1/2 h-72 origin-top blur-[3px]"
          style={{
            backgroundImage:
              "conic-gradient(from 65deg at center top, rgba(124,108,255,0.7), transparent 58%)",
            maskImage: "linear-gradient(to top, transparent, white 24%)",
            WebkitMaskImage: "linear-gradient(to top, transparent, white 24%)",
          }}
        />
        {/* right cone */}
        <motion.div
          {...grow}
          className="absolute left-1/2 h-72 origin-top blur-[3px]"
          style={{
            backgroundImage:
              "conic-gradient(from 295deg at center top, transparent 42%, rgba(91,140,255,0.7))",
            maskImage: "linear-gradient(to top, transparent, white 24%)",
            WebkitMaskImage: "linear-gradient(to top, transparent, white 24%)",
          }}
        />

        {/* glow ball + filament, centered on the bar */}
        <motion.div
          initial={{ width: "8rem" }}
          animate={{ width: "20rem" }}
          transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 h-36 -translate-y-1/2 rounded-full bg-brand/30 blur-[60px]"
        />
        <motion.div
          initial={{ width: "7rem", opacity: 0.6 }}
          animate={{ width: "20rem", opacity: 1 }}
          transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 h-[3px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_28px_6px_rgba(169,157,255,0.9)]"
        />
      </div>

      {/* headline sits just below the bar, lit from above */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 top-[46%] flex flex-col items-center px-6 text-center"
      >
        <h1 className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl">
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
      title="Build something luminous"
      subtitle="A cone of light draws every eye straight to your headline, just like Linear."
    />
  );
}
