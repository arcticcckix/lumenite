"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxOption {
  id: string;
  label: string;
}

export function AnimatedCheckboxGroup({
  options,
  className,
}: {
  options: CheckboxOption[];
  className?: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className={cn("w-full max-w-sm space-y-4", className)}>
      <div className="space-y-2">
        {options.map((opt) => {
          const checked = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggle(opt.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                checked
                  ? "border-brand/50 bg-brand/10"
                  : "border-line bg-panel hover:border-white/20"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                  checked ? "border-brand bg-brand" : "border-line bg-surface"
                )}
              >
                <AnimatePresence>
                  {checked && (
                    <motion.span
                      initial={{ pathLength: 0, opacity: 0, scale: 0.5 }}
                      animate={{ pathLength: 1, opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <Check className="h-3.5 w-3.5 text-white" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="text-sm text-zinc-200">{opt.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex min-h-[32px] flex-wrap gap-2">
        <AnimatePresence>
          {selected.map((id) => {
            const opt = options.find((o) => o.id === id);
            if (!opt) return null;
            return (
              <motion.span
                key={id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/15 px-3 py-1 text-xs text-brand-soft"
              >
                {opt.label}
                <button onClick={() => toggle(id)} className="hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Demo() {
  const options: CheckboxOption[] = [
    { id: "design", label: "Product design" },
    { id: "eng", label: "Engineering" },
    { id: "growth", label: "Growth & marketing" },
    { id: "support", label: "Customer support" },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <AnimatedCheckboxGroup options={options} />
    </div>
  );
}
