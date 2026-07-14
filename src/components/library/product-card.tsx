"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductVisual({ hovering }: { hovering: boolean }) {
  return (
    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-void via-surface to-panel">
      <motion.div
        className="absolute h-32 w-32 rounded-full bg-brand/25 blur-2xl"
        animate={{ scale: hovering ? 1.25 : 1, opacity: hovering ? 0.9 : 0.6 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.div
        className="relative flex h-24 w-14 flex-col items-center"
        animate={{ y: hovering ? -6 : 0, rotate: hovering ? -3 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="h-4 w-6 rounded-t-sm bg-gradient-to-b from-zinc-300 to-zinc-500" />
        <div className="h-1 w-8 rounded-full bg-zinc-600" />
        <div className="relative h-18 w-14 flex-1 rounded-b-lg rounded-t-sm border border-white/20 bg-gradient-to-b from-brand/70 via-brand/40 to-brand-soft/60 shadow-inner">
          <div className="absolute inset-x-1 top-2 h-8 rounded-sm bg-white/15 backdrop-blur-sm" />
        </div>
      </motion.div>
    </div>
  );
}

export function ProductCard({
  name,
  price,
  rating = 5,
  className,
}: {
  name: string;
  price: string;
  rating?: number;
  className?: string;
}) {
  const [hovering, setHovering] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (added) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <motion.div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "group relative w-64 rounded-2xl border border-line bg-panel p-4 shadow-lg shadow-black/20",
        hovering && "shadow-2xl shadow-brand/10",
        className
      )}
      style={{ transition: "box-shadow 0.3s ease" }}
    >
      <ProductVisual hovering={hovering} />
      <div className="mt-4 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < rating ? "fill-brand-soft text-brand-soft" : "fill-transparent text-zinc-600"
            )}
          />
        ))}
      </div>
      <h3 className="mt-2 text-sm font-semibold text-white">{name}</h3>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-base font-semibold text-white">{price}</span>
        <motion.button
          onClick={handleAdd}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-line bg-void text-white transition-colors",
            added && "border-emerald-400/50 bg-emerald-500/20"
          )}
          aria-label="Add to cart"
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="check"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center justify-center text-emerald-400"
              >
                <Check className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span
                key="plus"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <ProductCard name="Lumen Vial, 10ml" price="$68.00" rating={5} />
    </div>
  );
}
