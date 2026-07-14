"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnimatedGradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #7c6cff 0%, #5b8cff 25%, #ffffff 50%, #5b8cff 75%, #7c6cff 100%)",
        backgroundSize: "200% 100%",
      }}
      animate={{ backgroundPosition: ["0% 50%", "-200% 50%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

export function GradientChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">
      <Sparkles className="h-3 w-3 text-brand-soft" />
      {children}
    </span>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-6 text-center">
      <GradientChip>Now shipping v2.0</GradientChip>
      <h2 className="text-4xl font-semibold tracking-tight">
        <AnimatedGradientText>Design that flows</AnimatedGradientText>
      </h2>
      <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
        A slow, continuous gradient sweep — restrained enough for a headline,
        rich enough to notice.
      </p>
    </div>
  );
}
