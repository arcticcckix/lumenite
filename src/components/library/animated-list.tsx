"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Star, UserPlus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  id: number;
  icon: typeof DollarSign;
  gradient: string;
  title: string;
  subtitle: string;
}

const POOL: Omit<Item, "id">[] = [
  {
    icon: DollarSign,
    gradient: "from-emerald-500 to-teal-400",
    title: "New sale — $79.00",
    subtitle: "Recovery Peptide Blend",
  },
  {
    icon: Star,
    gradient: "from-brand to-glow",
    title: "New star on GitHub",
    subtitle: "lumenite/ui crossed 2.1k",
  },
  {
    icon: UserPlus,
    gradient: "from-amber-500 to-orange-400",
    title: "New subscriber",
    subtitle: "joined the Pro plan",
  },
  {
    icon: Zap,
    gradient: "from-fuchsia-500 to-purple-500",
    title: "Deploy succeeded",
    subtitle: "production · 12s build",
  },
];

let uid = 0;

export function AnimatedList({ className }: { className?: string }) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const next = POOL[uid % POOL.length];
        uid += 1;
        const entry: Item = { id: uid, ...next };
        const updated = [entry, ...prev];
        return updated.slice(0, 4);
      });
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("w-full max-w-sm space-y-2", className)}>
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 rounded-xl border border-line bg-panel px-3.5 py-3 shadow-lg shadow-black/20"
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                  item.gradient
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-white">
                  {item.title}
                </p>
                <p className="truncate text-[11.5px] text-zinc-500">
                  {item.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-line px-3.5 py-6 text-center text-xs text-zinc-600">
          Waiting for activity…
        </div>
      )}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <AnimatedList />
    </div>
  );
}
