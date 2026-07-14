"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlowButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      animate="rest"
      className={cn("relative inline-flex items-center justify-center", className)}
    >
      <motion.span
        variants={{
          rest: { opacity: 0.4, scale: 0.9 },
          hover: { opacity: 0.9, scale: 1.15 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand via-glow to-brand-soft blur-xl"
        aria-hidden
      />
      <motion.span
        variants={{ rest: { scale: 1 }, hover: { scale: 1.03 } }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 rounded-xl border border-line bg-surface px-6 py-3 text-sm font-medium text-white"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <GlowButton>Launch Product</GlowButton>
    </div>
  );
}
