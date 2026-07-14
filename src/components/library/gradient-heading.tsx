"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GradientHeading({
  children,
  className,
  colors = "from-brand-soft via-glow to-brand-soft",
}: {
  children: React.ReactNode;
  className?: string;
  colors?: string;
}) {
  return (
    <motion.span
      animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className={cn(
        "inline-block bg-gradient-to-r bg-[length:200%_auto] bg-clip-text text-transparent",
        colors,
        className
      )}
    >
      {children}
    </motion.span>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <h2 className="max-w-lg text-center text-4xl font-bold leading-tight">
        <GradientHeading>Build beautiful interfaces</GradientHeading>
      </h2>
    </div>
  );
}
