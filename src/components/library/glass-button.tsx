"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlassButton({
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
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-white",
        "bg-white/10 backdrop-blur-md backdrop-saturate-150",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.6), inset 0 0 0 1px rgba(255,255,255,0.12), 0 8px 24px -8px rgba(0,0,0,0.6)",
      }}
    >
      {/* top sheen */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-70"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)",
        }}
      />
      {/* sweeping shimmer on hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center gap-4 overflow-hidden p-8">
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[#7c6cff] blur-[80px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#22d3ee] blur-[80px]" />
        <div className="absolute bottom-6 left-1/3 h-40 w-40 rounded-full bg-[#ff5f8f] blur-[70px]" />
      </div>

      <div className="relative flex flex-wrap items-center justify-center gap-4">
        <GlassButton>
          Get started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </GlassButton>
        <GlassButton className="bg-white/90 text-black">
          <span className="text-black">Download</span>
        </GlassButton>
      </div>
    </div>
  );
}
