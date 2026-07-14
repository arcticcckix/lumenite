"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartLine {
  id: string;
  name: string;
  price: number;
  qty: number;
}

const INITIAL_LINES: CartLine[] = [
  { id: "1", name: "Lumen Vial, 10ml", price: 68 },
  { id: "2", name: "BAC Water, 3ml", price: 14 },
  { id: "3", name: "Sterile Vial Kit", price: 22 },
].map((l) => ({ ...l, qty: 1 }));

function MiniVisual({ tint }: { tint: string }) {
  return (
    <div
      className="h-10 w-8 flex-shrink-0 rounded-md border border-white/15"
      style={{ background: `linear-gradient(180deg, ${tint}aa, ${tint}33)` }}
    />
  );
}

const TINTS = ["#5b8cff", "#7c6cff", "#5bffd0"];

export function CartDrawer({
  open,
  onClose,
  className,
}: {
  open: boolean;
  onClose: () => void;
  className?: string;
}) {
  const [lines, setLines] = useState<CartLine[]>(INITIAL_LINES);

  function updateQty(id: string, delta: number) {
    setLines((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: Math.max(0, l.qty + delta) } : l))
        .filter((l) => l.qty > 0)
    );
  }

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    [lines]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-10 bg-black/50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className={cn(
              "absolute right-0 top-0 z-20 flex h-full w-72 flex-col border-l border-line bg-panel p-4",
              className
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShoppingBag className="h-4 w-4 text-brand-soft" />
                Your cart
              </div>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto">
              <AnimatePresence initial={false}>
                {lines.map((line, i) => (
                  <motion.div
                    key={line.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex items-center gap-3 rounded-lg border border-line bg-void/60 p-2"
                  >
                    <MiniVisual tint={TINTS[i % TINTS.length]} />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">{line.name}</p>
                      <p className="text-[11px] text-zinc-500">${line.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-line px-1.5 py-0.5">
                      <button
                        onClick={() => updateQty(line.id, -1)}
                        className="flex h-5 w-5 items-center justify-center text-zinc-400 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-[11px] text-white">{line.qty}</span>
                      <button
                        onClick={() => updateQty(line.id, 1)}
                        className="flex h-5 w-5 items-center justify-center text-zinc-400 hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {lines.length === 0 && (
                <p className="mt-8 text-center text-xs text-zinc-500">Your cart is empty.</p>
              )}
            </div>

            <div className="mt-4 border-t border-line pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <button className="mt-3 w-full rounded-full bg-brand py-2 text-xs font-semibold text-white transition-colors hover:bg-brand/90">
                Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Demo() {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#050508]">
      <div className="flex h-full w-full items-center justify-center">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-xs font-medium text-white transition-colors hover:border-brand-soft/60"
        >
          <ShoppingBag className="h-3.5 w-3.5 text-brand-soft" />
          Open cart
        </button>
      </div>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
