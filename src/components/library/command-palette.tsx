"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Rocket,
  Users,
  LayoutGrid,
  FileText,
  Moon,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Lucide icons satisfy this shape without pulling in extra type exports. */
type CommandIcon = React.ComponentType<{
  className?: string;
  size?: number | string;
  strokeWidth?: number;
}>;

export type CommandItem = {
  id: string;
  label: string;
  icon: CommandIcon;
  /** Keyboard hint, one chip per string, e.g. ["⌘", "K"] or ["G", "D"]. */
  keys?: string[];
};

export type CommandGroup = {
  heading: string;
  items: CommandItem[];
};

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="flex h-5 min-w-[20px] items-center justify-center rounded-[5px] border border-white/10 bg-white/[0.04] px-1.5 font-sans text-[11px] font-medium leading-none text-zinc-400">
      {children}
    </kbd>
  );
}

export function CommandPalette({
  groups,
  placeholder = "Search commands, files, and actions",
  loop = true,
  interval = 1500,
  className,
}: {
  groups: CommandGroup[];
  placeholder?: string;
  /** Auto-advance the active row on a loop so a static preview looks alive. */
  loop?: boolean;
  interval?: number;
  className?: string;
}) {
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!loop || flat.length <= 1) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % flat.length),
      interval
    );
    return () => clearInterval(id);
  }, [loop, interval, flat.length]);

  // Render rows imperatively so each item keeps a stable flat index.
  let idx = -1;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c13]/70 shadow-[0_28px_90px_-24px_rgba(0,0,0,0.85)] backdrop-blur-2xl",
        className
      )}
    >
      {/* top hairline highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* search field */}
      <div className="flex h-12 items-center gap-3 border-b border-white/[0.07] px-4">
        <Search size={17} strokeWidth={2} className="shrink-0 text-zinc-500" />
        <div className="flex flex-1 items-center gap-px overflow-hidden">
          <motion.span
            aria-hidden
            className="block w-[2px] shrink-0 rounded-full bg-brand-soft"
            style={{ height: 18 }}
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{
              duration: 1.05,
              times: [0, 0.5, 0.5, 1],
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <span className="truncate pl-1.5 text-[13.5px] text-zinc-500">
            {placeholder}
          </span>
        </div>
        <div className="hidden shrink-0 items-center gap-1 sm:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </div>

      {/* results */}
      <div className="px-2 py-2">
        {groups.map((group) => (
          <div key={group.heading} className="mb-1 last:mb-0">
            <div className="px-2.5 pb-1 pt-2 text-[10.5px] font-medium uppercase tracking-[0.14em] text-zinc-600">
              {group.heading}
            </div>
            {group.items.map((item) => {
              idx += 1;
              const i = idx;
              const isActive = i === active;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="relative flex h-10 cursor-default items-center gap-2.5 rounded-lg px-2.5"
                >
                  {isActive && (
                    <motion.div
                      layoutId="cmdk-active"
                      className="absolute inset-0 rounded-lg border border-white/[0.08] bg-white/[0.05]"
                      transition={{
                        type: "spring",
                        stiffness: 520,
                        damping: 40,
                        mass: 0.6,
                      }}
                    >
                      <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-brand to-glow" />
                    </motion.div>
                  )}

                  <div
                    className={cn(
                      "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
                      isActive
                        ? "border-brand/25 bg-brand/10 text-brand-soft"
                        : "border-white/[0.07] bg-white/[0.02] text-zinc-500"
                    )}
                  >
                    <Icon size={15} strokeWidth={2} />
                  </div>

                  <span
                    className={cn(
                      "relative z-10 flex-1 truncate text-[13.5px] transition-colors duration-200",
                      isActive ? "text-white" : "text-zinc-400"
                    )}
                  >
                    {item.label}
                  </span>

                  <div className="relative z-10 flex shrink-0 items-center gap-1.5">
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, x: 4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 4 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center gap-1 text-[11px] font-medium text-brand-soft"
                        >
                          <CornerDownLeft size={12} strokeWidth={2.2} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {item.keys && (
                      <div className="flex items-center gap-1">
                        {item.keys.map((k, ki) => (
                          <Kbd key={ki}>{k}</Kbd>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* footer */}
      <div className="flex h-9 items-center justify-between border-t border-white/[0.07] px-4 text-[11px] text-zinc-600">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="flex h-4 w-4 items-center justify-center rounded border border-white/10 bg-white/[0.03]">
              <ArrowUp size={10} strokeWidth={2.4} />
            </span>
            <span className="flex h-4 w-4 items-center justify-center rounded border border-white/10 bg-white/[0.03]">
              <ArrowDown size={10} strokeWidth={2.4} />
            </span>
            <span className="ml-0.5">Navigate</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="flex h-4 w-4 items-center justify-center rounded border border-white/10 bg-white/[0.03]">
              <CornerDownLeft size={10} strokeWidth={2.4} />
            </span>
            <span className="ml-0.5">Open</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(124,108,255,0.9)]" />
          <span className="font-medium tracking-tight text-zinc-500">
            Command Menu
          </span>
        </div>
      </div>
    </div>
  );
}

const DEMO_GROUPS: CommandGroup[] = [
  {
    heading: "Suggestions",
    items: [
      { id: "deploy", label: "New deployment", icon: Rocket, keys: ["⌘", "D"] },
      { id: "invite", label: "Invite teammate", icon: Users, keys: ["⌘", "I"] },
    ],
  },
  {
    heading: "Navigation",
    items: [
      { id: "dashboard", label: "Go to Dashboard", icon: LayoutGrid, keys: ["G", "H"] },
      { id: "docs", label: "Open Documentation", icon: FileText, keys: ["G", "D"] },
    ],
  },
  {
    heading: "Actions",
    items: [
      { id: "theme", label: "Toggle appearance", icon: Moon, keys: ["⌘", "T"] },
      { id: "settings", label: "Open settings", icon: Settings, keys: ["⌘", ","] },
    ],
  },
];

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-5">
      {/* frosted backdrop: soft color blobs sit behind the blurred panel */}
      <div className="pointer-events-none absolute -left-10 top-2 h-56 w-56 rounded-full bg-brand/25 blur-[80px]" />
      <div className="pointer-events-none absolute -right-8 bottom-0 h-56 w-56 rounded-full bg-glow/20 blur-[90px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(5,5,8,0.9) 100%)",
        }}
      />
      <CommandPalette groups={DEMO_GROUPS} className="w-full max-w-md" />
    </div>
  );
}
