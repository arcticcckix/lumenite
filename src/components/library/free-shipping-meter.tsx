"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export function FreeShippingMeter({
  goal = 75,
  current,
  className,
}: {
  goal?: number;
  current: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (current / goal) * 100));
  const remaining = Math.max(0, goal - current);
  const done = remaining === 0;

  return (
    <div className={cn("w-72 rounded-xl border border-line bg-panel p-4", className)}>
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white">
        {done ? (
          <PartyPopper className="h-3.5 w-3.5 text-brand-soft" />
        ) : (
          <Truck className="h-3.5 w-3.5 text-brand-soft" />
        )}
        <span>
          {done
            ? "You unlocked free shipping!"
            : `You're $${remaining.toFixed(0)} away from free shipping`}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-void">
        <motion.div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-brand to-brand-soft",
            done && "from-emerald-400 to-brand-soft"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        {done && (
          <motion.div
            className="absolute inset-0 bg-white/40"
            initial={{ opacity: 0.6, x: "-100%" }}
            animate={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </div>
    </div>
  );
}

export default function Demo() {
  const [current, setCurrent] = useState(0);
  const goal = 75;

  useEffect(() => {
    const targets = [22, 52, 75, 22];
    let i = 0;
    setCurrent(targets[0]);
    const id = setInterval(() => {
      i = (i + 1) % targets.length;
      setCurrent(targets[i]);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <FreeShippingMeter goal={goal} current={current} />
    </div>
  );
}
