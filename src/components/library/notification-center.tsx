"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Bell,
  GitMerge,
  AtSign,
  CreditCard,
  TriangleAlert,
  Check,
  Settings2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationTone = "brand" | "glow" | "positive" | "warn";

export interface NotificationItem {
  id: string;
  icon: LucideIcon;
  title: string;
  detail: string;
  time: string;
  tone: NotificationTone;
}

const TONE: Record<NotificationTone, { box: string; icon: string; dot: string }> = {
  brand: {
    box: "border-[#7c6cff]/25 bg-[#7c6cff]/12",
    icon: "text-[#a99dff]",
    dot: "bg-[#7c6cff] shadow-[0_0_8px_rgba(124,108,255,0.85)]",
  },
  glow: {
    box: "border-[#5b8cff]/25 bg-[#5b8cff]/12",
    icon: "text-[#8fb2ff]",
    dot: "bg-[#5b8cff] shadow-[0_0_8px_rgba(91,140,255,0.85)]",
  },
  positive: {
    box: "border-emerald-400/25 bg-emerald-400/10",
    icon: "text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]",
  },
  warn: {
    box: "border-amber-400/25 bg-amber-400/10",
    icon: "text-amber-300",
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]",
  },
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.14 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
};

export function NotificationCenter({
  items,
  auto = true,
  className,
}: {
  items: NotificationItem[];
  auto?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const unread = read ? 0 : items.length;
  const shouldRing = unread > 0 && !open;

  // Self-driving demo loop: ring, open, read, close, repeat. Pauses on interaction.
  useEffect(() => {
    if (!auto || interacted) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const cycle = () => {
      if (cancelled) return;
      setOpen(false);
      setRead(false);
      timers.push(setTimeout(() => !cancelled && setOpen(true), 1300));
      timers.push(setTimeout(() => !cancelled && setRead(true), 3900));
      timers.push(setTimeout(() => !cancelled && setOpen(false), 5600));
      timers.push(setTimeout(cycle, 7000));
    };
    cycle();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [auto, interacted]);

  function toggle() {
    setInteracted(true);
    setOpen((o) => !o);
  }

  function markAllRead() {
    setInteracted(true);
    setRead(true);
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 backdrop-blur-md transition-colors hover:bg-white/[0.07] hover:text-white"
      >
        <motion.span
          className="inline-flex"
          style={{ transformOrigin: "50% 18%" }}
          animate={shouldRing ? { rotate: [0, -14, 11, -8, 5, -2, 0] } : { rotate: 0 }}
          transition={
            shouldRing
              ? { duration: 1.1, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.6 }
              : { duration: 0.3 }
          }
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </motion.span>

        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 480, damping: 22 }}
              className="pointer-events-none absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold tabular-nums text-white shadow-[0_0_0_2px_#050508,0_4px_12px_rgba(124,108,255,0.55)]"
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-brand/60"
                animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
              />
              <span className="relative">{unread}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="absolute right-0 top-[calc(100%+12px)] z-20 w-[336px] origin-top-right"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
              {/* thin bright top edge */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              {/* faint interior glow */}
              <div className="pointer-events-none absolute -left-10 -top-16 h-32 w-32 rounded-full bg-brand/15 blur-3xl" />

              {/* header */}
              <div className="relative flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">Notifications</span>
                  <AnimatePresence>
                    {unread > 0 && (
                      <motion.span
                        key="count-pill"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-full border border-brand/30 bg-brand/15 px-2 py-0.5 text-[10px] font-medium tabular-nums text-brand-soft"
                      >
                        {unread} new
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  type="button"
                  aria-label="Notification settings"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
                >
                  <Settings2 className="h-[15px] w-[15px]" strokeWidth={1.8} />
                </button>
              </div>

              <div className="h-px bg-white/[0.06]" />

              {/* list */}
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="relative divide-y divide-white/[0.045]"
              >
                {items.map((n) => {
                  const t = TONE[n.tone];
                  const Icon = n.icon;
                  return (
                    <motion.li
                      key={n.id}
                      variants={itemVariants}
                      className={cn(
                        "flex items-start gap-3 px-4 py-2.5 transition-colors duration-500",
                        read && "opacity-55"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                          t.box
                        )}
                      >
                        <Icon className={cn("h-4 w-4", t.icon)} strokeWidth={1.9} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[13px] font-medium text-zinc-100">
                            {n.title}
                          </p>
                          <span className="shrink-0 text-[11px] tabular-nums text-zinc-500">
                            {n.time}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[12px] text-zinc-400">
                          {n.detail}
                        </p>
                      </div>

                      <AnimatePresence>
                        {!read && (
                          <motion.span
                            key="unread-dot"
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                              "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                              t.dot
                            )}
                          />
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* footer */}
              <div className="border-t border-white/[0.06] p-2">
                <button
                  type="button"
                  onClick={markAllRead}
                  disabled={read}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors",
                    read
                      ? "cursor-default text-zinc-500"
                      : "text-brand-soft hover:bg-white/[0.05]"
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {read ? (
                      <motion.span
                        key="done"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.24 }}
                        className="flex items-center gap-1.5"
                      >
                        <Check className="h-[15px] w-[15px]" strokeWidth={2} />
                        All caught up
                      </motion.span>
                    ) : (
                      <motion.span
                        key="mark"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.24 }}
                      >
                        Mark all as read
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DEMO_ITEMS: NotificationItem[] = [
  {
    id: "deploy",
    icon: GitMerge,
    title: "Deployment successful",
    detail: "web-app is live on production",
    time: "2m",
    tone: "glow",
  },
  {
    id: "mention",
    icon: AtSign,
    title: "Priya mentioned you",
    detail: "Design review · #product",
    time: "9m",
    tone: "brand",
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Payment received",
    detail: "Northwind Labs · $4,200",
    time: "24m",
    tone: "positive",
  },
  {
    id: "usage",
    icon: TriangleAlert,
    title: "API usage at 82%",
    detail: "Resets in 6 days",
    time: "1h",
    tone: "warn",
  },
];

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-start justify-center overflow-hidden bg-void px-6 pt-8">
      {/* frosted-glass backdrop context */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute -top-24 right-6 h-64 w-64 rounded-full bg-brand/20 blur-[90px]" />
        <div className="absolute top-12 left-0 h-56 w-56 rounded-full bg-glow/10 blur-[80px]" />
      </div>

      <div className="relative w-full max-w-[380px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-glow shadow-[0_6px_18px_-4px_rgba(124,108,255,0.6)]">
              <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-white">Console</p>
              <p className="mt-1.5 text-[11px] leading-none text-zinc-500">
                Workspace activity
              </p>
            </div>
          </div>

          <NotificationCenter items={DEMO_ITEMS} />
        </div>
      </div>
    </div>
  );
}
