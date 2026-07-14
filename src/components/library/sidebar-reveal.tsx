"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Settings,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  { label: "Dashboard", icon: Home },
  { label: "Search", icon: Search },
  { label: "Team", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export function SidebarReveal({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  return (
    <motion.div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      animate={{ width: open ? 200 : 64 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={cn(
        "flex h-full flex-col gap-2 overflow-hidden rounded-xl border border-line bg-panel py-4",
        className
      )}
    >
      <div className="mb-4 flex items-center gap-3 px-4">
        <div className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-brand to-glow" />
        <AnimatePresence>
          {open ? (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="whitespace-nowrap text-sm font-semibold text-white"
            >
              Lumenite
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      {ITEMS.map((item, i) => {
        const Icon = item.icon;
        const isActive = active === i;
        return (
          <button
            key={item.label}
            onClick={() => setActive(i)}
            className={cn(
              "mx-2 flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
              isActive
                ? "bg-brand/15 text-brand-soft"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <AnimatePresence>
              {open ? (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="whitespace-nowrap text-xs font-medium"
                >
                  {item.label}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </button>
        );
      })}
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-6 bg-void p-8">
      <div className="h-[340px]">
        <SidebarReveal />
      </div>
      <p className="max-w-[180px] text-xs text-zinc-500">
        Hover the sidebar to expand it and reveal labels.
      </p>
    </div>
  );
}
