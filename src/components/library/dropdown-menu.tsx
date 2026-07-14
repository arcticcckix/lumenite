"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  User,
  CreditCard,
  UserPlus,
  KeyRound,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Lucide icons satisfy this shape without importing extra type exports. */
type MenuIcon = React.ComponentType<{
  className?: string;
  size?: number | string;
  strokeWidth?: number;
}>;

export type MenuItem = {
  id: string;
  label: string;
  icon: MenuIcon;
  /** Keyboard hint, one chip per string, e.g. ["⌘", "P"]. */
  keys?: string[];
  /** Renders in red and tints the highlight when it lands here. */
  destructive?: boolean;
};

export type MenuGroup = {
  /** Optional small uppercase section label. */
  label?: string;
  items: MenuItem[];
};

export type MenuAccount = {
  name: string;
  email: string;
  initials: string;
};

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] border border-white/10 bg-white/[0.04] px-1 font-sans text-[11px] font-medium leading-none text-zinc-400">
      {children}
    </kbd>
  );
}

export function DropdownMenu({
  account,
  groups,
  autoplay = true,
  interval = 1050,
  className,
}: {
  account: MenuAccount;
  groups: MenuGroup[];
  /** Auto-open and cycle the highlight so a static preview looks alive. */
  autoplay?: boolean;
  interval?: number;
  className?: string;
}) {
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [hovering, setHovering] = useState(false);

  // Self-driving timeline: open, walk the highlight down, linger, close, repeat.
  useEffect(() => {
    if (!autoplay || hovering) return;
    let t: number;
    if (!open) {
      t = window.setTimeout(() => {
        setOpen(true);
        setActive(0);
      }, 820);
    } else if (active < flat.length - 1) {
      t = window.setTimeout(() => setActive((a) => a + 1), interval);
    } else {
      t = window.setTimeout(() => {
        setOpen(false);
        setActive(-1);
      }, 1400);
    }
    return () => window.clearTimeout(t);
  }, [autoplay, hovering, open, active, interval, flat.length]);

  const activeItem = active >= 0 && active < flat.length ? flat[active] : null;
  const activeDestructive = !!activeItem?.destructive;

  // Stable flat index while rendering nested groups.
  let idx = -1;

  return (
    <div
      className={cn("relative w-[280px]", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen((o) => {
            const next = !o;
            setActive(next ? 0 : -1);
            return next;
          });
        }}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200",
          open
            ? "border-white/15 bg-white/[0.06]"
            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
        )}
      >
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-glow text-[13px] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(124,108,255,0.7)]">
          {account.initials}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[13.5px] font-medium leading-tight text-white">
            {account.name}
          </span>
          <span className="truncate text-[11.5px] leading-tight text-zinc-500">
            {account.email}
          </span>
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="shrink-0 text-zinc-500"
        >
          <ChevronDown size={16} strokeWidth={2.2} />
        </motion.span>
      </button>

      {/* menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ type: "spring", stiffness: 460, damping: 32, mass: 0.7 }}
            style={{ transformOrigin: "top left" }}
            className="absolute inset-x-0 top-full z-20 mt-2 origin-top"
          >
            {/* ambient glow behind the frosted panel */}
            <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[24px] bg-brand/15 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c13]/80 p-1.5 shadow-[0_28px_90px_-24px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
              {/* top hairline highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* header */}
              <div className="flex items-center gap-2.5 px-2.5 py-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-glow text-[11px] font-semibold text-white">
                  {account.initials}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[12.5px] font-medium leading-tight text-white">
                    {account.name}
                  </span>
                  <span className="truncate text-[11px] leading-tight text-zinc-500">
                    {account.email}
                  </span>
                </span>
              </div>

              {groups.map((group, gi) => (
                <div key={gi}>
                  <div className="mx-1 my-1 h-px bg-white/[0.06]" />
                  {group.label && (
                    <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                      {group.label}
                    </div>
                  )}
                  {group.items.map((item) => {
                    idx += 1;
                    const i = idx;
                    const isActive = i === active;
                    const Icon = item.icon;
                    const danger = !!item.destructive;
                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setActive(i)}
                        className="relative flex h-9 cursor-default items-center gap-2.5 rounded-lg px-2.5"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="dropdown-highlight"
                            className="absolute inset-0 rounded-lg border"
                            animate={{
                              backgroundColor: activeDestructive
                                ? "rgba(244,63,94,0.10)"
                                : "rgba(255,255,255,0.05)",
                              borderColor: activeDestructive
                                ? "rgba(244,63,94,0.22)"
                                : "rgba(255,255,255,0.08)",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 520,
                              damping: 40,
                              mass: 0.6,
                            }}
                          >
                            <span
                              className="absolute inset-y-1.5 left-0 w-[3px] rounded-full"
                              style={{
                                background: activeDestructive
                                  ? "linear-gradient(to bottom, #fb7185, #f43f5e)"
                                  : "linear-gradient(to bottom, #7c6cff, #5b8cff)",
                              }}
                            />
                          </motion.div>
                        )}

                        <div
                          className={cn(
                            "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
                            danger
                              ? "border-rose-500/25 bg-rose-500/10 text-rose-300"
                              : isActive
                                ? "border-brand/25 bg-brand/10 text-brand-soft"
                                : "border-white/[0.07] bg-white/[0.02] text-zinc-500"
                          )}
                        >
                          <Icon size={14} strokeWidth={2} />
                        </div>

                        <span
                          className={cn(
                            "relative z-10 flex-1 truncate text-[13px] transition-colors duration-200",
                            danger
                              ? isActive
                                ? "text-rose-200"
                                : "text-rose-400"
                              : isActive
                                ? "text-white"
                                : "text-zinc-300"
                          )}
                        >
                          {item.label}
                        </span>

                        {item.keys && (
                          <div className="relative z-10 flex shrink-0 items-center gap-1">
                            {item.keys.map((k, ki) => (
                              <Kbd key={ki}>{k}</Kbd>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DEMO_ACCOUNT: MenuAccount = {
  name: "Avery Quinn",
  email: "avery@lumenite.dev",
  initials: "AQ",
};

const DEMO_GROUPS: MenuGroup[] = [
  {
    label: "Account",
    items: [
      { id: "profile", label: "Profile", icon: User, keys: ["⌘", "P"] },
      { id: "billing", label: "Billing & plans", icon: CreditCard },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "invite", label: "Invite teammates", icon: UserPlus, keys: ["⌘", "I"] },
      { id: "tokens", label: "API tokens", icon: KeyRound },
    ],
  },
  {
    items: [
      {
        id: "delete",
        label: "Delete workspace",
        icon: Trash2,
        keys: ["⇧", "⌘", "⌫"],
        destructive: true,
      },
    ],
  },
];

export default function Demo() {
  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-hidden px-6 pt-9">
      {/* frosted backdrop: soft color blobs sit behind the panel */}
      <div className="pointer-events-none absolute -left-8 top-4 h-52 w-52 rounded-full bg-brand/20 blur-[80px]" />
      <div className="pointer-events-none absolute -right-6 bottom-2 h-52 w-52 rounded-full bg-glow/15 blur-[90px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(5,5,8,0.9) 100%)",
        }}
      />
      <DropdownMenu account={DEMO_ACCOUNT} groups={DEMO_GROUPS} />
    </div>
  );
}
