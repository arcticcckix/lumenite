"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickProduct {
  id: string;
  name: string;
  price: string;
  rating: number;
  specs: { label: string; value: string }[];
}

const PRODUCT: QuickProduct = {
  id: "lumen-vial",
  name: "Lumen Bottle, 10ml",
  price: "$68.00",
  rating: 5,
  specs: [
    { label: "Volume", value: "10 ml" },
    { label: "Material", value: "Borosilicate" },
    { label: "Finish", value: "Frosted" },
    { label: "Shipping", value: "Worldwide" },
  ],
};

function GalleryVisual({ tone }: { tone: number }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-void via-surface to-panel">
      <div
        className="absolute h-28 w-28 rounded-full blur-2xl"
        style={{ background: `hsl(${230 + tone * 20} 90% 65% / 0.3)` }}
      />
      <div className="relative flex h-24 w-14 flex-col items-center">
        <div className="h-4 w-6 rounded-t-sm bg-gradient-to-b from-zinc-300 to-zinc-500" />
        <div className="h-1 w-8 rounded-full bg-zinc-600" />
        <div
          className="relative h-18 w-14 flex-1 rounded-b-lg rounded-t-sm border border-white/20 shadow-inner"
          style={{
            background: `linear-gradient(180deg, hsl(${230 + tone * 20} 90% 70% / 0.8), hsl(${230 + tone * 20} 90% 60% / 0.4))`,
          }}
        >
          <div className="absolute inset-x-1 top-2 h-8 rounded-sm bg-white/15 backdrop-blur-sm" />
        </div>
      </div>
    </div>
  );
}

export function ProductQuickview({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [dot, setDot] = useState(0);
  const [added, setAdded] = useState(false);
  const [userTook, setUserTook] = useState(false);

  // Auto-demonstrate the quick view on a loop until the user interacts.
  useEffect(() => {
    if (userTook) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      while (!cancelled) {
        await wait(1400);
        if (cancelled) break;
        setOpen(true);
        await wait(1700);
        if (cancelled) break;
        setDot((d) => (d + 1) % 3);
        await wait(1500);
        if (cancelled) break;
        setOpen(false);
        await wait(1200);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userTook]);

  function handleAdd() {
    setUserTook(true);
    if (added) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className={cn("relative flex h-full w-full items-center justify-center", className)}>
      <motion.button
        layoutId={`card-${PRODUCT.id}`}
        onClick={() => {
          setUserTook(true);
          setOpen(true);
        }}
        className="w-48 rounded-2xl border border-line bg-panel p-3 text-left"
        whileHover={{ y: -4 }}
      >
        <motion.div layoutId={`visual-${PRODUCT.id}`} className="h-28 w-full">
          <GalleryVisual tone={0} />
        </motion.div>
        <motion.h3 layoutId={`title-${PRODUCT.id}`} className="mt-3 text-xs font-semibold text-white">
          {PRODUCT.name}
        </motion.h3>
        <p className="mt-1 text-sm font-semibold text-white">{PRODUCT.price}</p>
        <p className="mt-1 text-[10px] text-zinc-500">Click for quick view</p>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setUserTook(true);
                setOpen(false);
              }}
              className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`card-${PRODUCT.id}`}
              className="absolute inset-6 z-20 flex gap-4 overflow-hidden rounded-2xl border border-line bg-panel p-4"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close quick view"
                className="absolute right-3 top-3 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-void/70 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex w-1/2 flex-col gap-2">
                <motion.div layoutId={`visual-${PRODUCT.id}`} className="h-32 w-full">
                  <GalleryVisual tone={dot} />
                </motion.div>
                <div className="flex items-center justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setDot(i)}
                      aria-label={`View ${i + 1}`}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        dot === i ? "bg-brand-soft" : "bg-zinc-600"
                      )}
                    />
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12, duration: 0.3 }}
                className="flex w-1/2 flex-col"
              >
                <motion.h3 layoutId={`title-${PRODUCT.id}`} className="text-sm font-semibold text-white">
                  {PRODUCT.name}
                </motion.h3>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < PRODUCT.rating ? "fill-brand-soft text-brand-soft" : "text-zinc-600"
                      )}
                    />
                  ))}
                </div>
                <p className="mt-2 text-lg font-semibold text-white">{PRODUCT.price}</p>

                <div className="mt-3 space-y-1.5">
                  {PRODUCT.specs.map((s) => (
                    <div key={s.label} className="flex justify-between border-b border-line/60 py-1 text-[11px]">
                      <span className="text-zinc-500">{s.label}</span>
                      <span className="text-zinc-200">{s.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAdd}
                  className={cn(
                    "mt-auto flex items-center justify-center gap-1.5 rounded-full bg-brand py-2 text-xs font-semibold text-white transition-colors hover:bg-brand/90",
                    added && "bg-emerald-500 hover:bg-emerald-500"
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {added ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5"
                      >
                        <Check className="h-3.5 w-3.5" /> Added
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add to cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="h-full w-full bg-[#050508] p-6">
      <ProductQuickview />
    </div>
  );
}
