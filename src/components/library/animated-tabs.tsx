"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
}

export function AnimatedTabs({
  tabs,
  layoutId = "animated-tabs-pill",
  className,
  onChange,
}: {
  tabs: Tab[];
  layoutId?: string;
  className?: string;
  onChange?: (id: string) => void;
}) {
  const [active, setActive] = useState(tabs[0]?.id);

  function select(id: string) {
    setActive(id);
    onChange?.(id);
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-panel p-1",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => select(tab.id)}
          className={cn(
            "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
            active === tab.id ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          {active === tab.id && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-full bg-brand/25 border border-brand/40"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function Demo() {
  const tabs: Tab[] = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <AnimatedTabs tabs={tabs} />
    </div>
  );
}
