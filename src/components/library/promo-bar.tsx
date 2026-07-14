"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_OFFERS = [
  "Free shipping on orders over $75",
  "New: subscribe & save 15% every month",
  "Limited batch — Lumen Vial restocked today",
];

export function PromoBar({
  offers = DEFAULT_OFFERS,
  interval = 2600,
  className,
}: {
  offers?: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % offers.length);
    }, interval);
    return () => clearInterval(id);
  }, [dismissed, interval, offers.length]);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "relative flex h-10 w-full items-center justify-center overflow-hidden border-b border-line bg-gradient-to-r from-brand/20 via-panel to-brand/20 text-xs text-white",
        className
      )}
    >
      <Sparkles className="mr-2 h-3.5 w-3.5 text-brand-soft" />
      <div className="relative h-4 w-72 overflow-hidden text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 whitespace-nowrap font-medium tracking-wide"
          >
            {offers[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col bg-[#050508]">
      <PromoBar />
      <div className="flex flex-1 items-center justify-center">
        <p className="max-w-xs text-center text-sm text-zinc-500">
          A cycling announcement bar for promos, restocks, and shipping thresholds.
        </p>
      </div>
    </div>
  );
}
