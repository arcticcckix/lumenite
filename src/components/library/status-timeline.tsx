"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusKind = "operational" | "degraded" | "investigating" | "resolved";

interface StatusMeta {
  label: string;
  dot: string;
  glow: string;
}

const STATUS: Record<StatusKind, StatusMeta> = {
  operational: {
    label: "Operational",
    dot: "#34d399",
    glow: "rgba(52, 211, 153, 0.5)",
  },
  degraded: {
    label: "Degraded",
    dot: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.5)",
  },
  investigating: {
    label: "Investigating",
    dot: "#fb7185",
    glow: "rgba(251, 113, 133, 0.5)",
  },
  resolved: {
    label: "Resolved",
    dot: "#7c6cff",
    glow: "rgba(124, 108, 255, 0.55)",
  },
};

interface Entry {
  id: number;
  status: StatusKind;
  title: string;
  note: string;
  clock: number;
}

const POOL: { status: StatusKind; title: string; note: string }[] = [
  {
    status: "resolved",
    title: "API latency recovered",
    note: "p99 back to 184ms after a pool resize.",
  },
  {
    status: "degraded",
    title: "Elevated 5xx in eu-west-1",
    note: "1.4% of writes returning 503 at the edge.",
  },
  {
    status: "operational",
    title: "Replica failover completed",
    note: "Streaming replication caught up in 40s.",
  },
  {
    status: "investigating",
    title: "Webhook delivery delayed",
    note: "Events worker backlog is draining now.",
  },
  {
    status: "resolved",
    title: "Auth incident resolved",
    note: "Sign-ins stable for the last 20 minutes.",
  },
  {
    status: "degraded",
    title: "Slower dashboard loads",
    note: "Stale CDN bundles in IAD, purge running.",
  },
  {
    status: "operational",
    title: "Nightly backups verified",
    note: "14 services snapshotted, checksums OK.",
  },
  {
    status: "investigating",
    title: "Search indexing lag",
    note: "New documents take up to 80s to appear.",
  },
];

const VISIBLE = 4;
const START_CLOCK = 9 * 60 + 42; // 9:42
const STEP = 7; // minutes between events

function fmtClock(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mm = m % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const meridiem = h24 < 12 ? "AM" : "PM";
  return `${h12}:${String(mm).padStart(2, "0")} ${meridiem}`;
}

function seedEntries(): Entry[] {
  // Newest first. Top entry is the most recent clock value.
  return Array.from({ length: VISIBLE }, (_, i) => {
    const pick = POOL[i % POOL.length];
    return {
      id: i + 1,
      status: pick.status,
      title: pick.title,
      note: pick.note,
      clock: START_CLOCK - i * STEP,
    };
  });
}

function StatusDot({
  meta,
  live,
}: {
  meta: StatusMeta;
  live: boolean;
}) {
  return (
    <span className="relative flex h-3 w-3 items-center justify-center">
      {live && (
        <motion.span
          className="absolute h-3 w-3 rounded-full"
          style={{ backgroundColor: meta.dot }}
          initial={{ opacity: 0.45, scale: 1 }}
          animate={{ opacity: 0, scale: 2.4 }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span
        className="relative h-[7px] w-[7px] rounded-full ring-2 ring-[#101018]"
        style={{ backgroundColor: meta.dot, boxShadow: `0 0 9px ${meta.glow}` }}
      />
    </span>
  );
}

export function StatusTimeline({
  className,
  intervalMs = 2800,
}: {
  className?: string;
  intervalMs?: number;
}) {
  const [items, setItems] = useState<Entry[]>(seedEntries);
  const cursor = useRef({ seq: VISIBLE, pool: VISIBLE, clock: START_CLOCK });

  useEffect(() => {
    const timer = setInterval(() => {
      setItems((prev) => {
        const c = cursor.current;
        const pick = POOL[c.pool % POOL.length];
        c.pool += 1;
        c.seq += 1;
        c.clock += STEP;
        const entry: Entry = {
          id: c.seq,
          status: pick.status,
          title: pick.title,
          note: pick.note,
          clock: c.clock,
        };
        return [entry, ...prev].slice(0, VISIBLE);
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return (
    <div
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#101018] p-5 shadow-2xl shadow-black/40",
        className
      )}
    >
      {/* thin bright top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      {/* restrained brand glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand-soft ring-1 ring-white/10">
            <Activity className="h-3.5 w-3.5" />
          </span>
          <div>
            <div className="text-[13px] font-medium text-white">
              System status
            </div>
            <div className="text-[11px] text-zinc-500">
              99.98% uptime over 90 days
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 items-center justify-center">
            <motion.span
              className="absolute h-2 w-2 rounded-full bg-emerald-400"
              animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.3, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-medium text-emerald-300/90">
            All systems operational
          </span>
        </div>
      </div>

      <ul className="relative overflow-hidden">
        <AnimatePresence initial={false}>
          {items.map((e, i) => {
            const meta = STATUS[e.status];
            return (
              <motion.li
                key={e.id}
                layout
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: Math.min(i, VISIBLE - 1) * 0.06,
                }}
                className="relative flex gap-3.5"
              >
                <div className="flex flex-col items-center pt-[3px]">
                  <StatusDot meta={meta} live={i === 0} />
                  <motion.span
                    className="mt-2 w-px flex-1 origin-top rounded-full"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(255,255,255,0.16), rgba(255,255,255,0.02))",
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                      delay: Math.min(i, VISIBLE - 1) * 0.06 + 0.12,
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1 pb-4">
                  <div className="truncate text-sm font-medium text-white">
                    {e.title}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                    <span
                      className="font-semibold uppercase tracking-[0.08em]"
                      style={{ color: meta.dot }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="tabular-nums text-zinc-500">
                      {fmtClock(e.clock)}
                    </span>
                  </div>
                  <p className="mt-1.5 truncate text-[12px] leading-relaxed text-zinc-400">
                    {e.note}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {/* bottom fade so the rail draws off into the panel */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[#101018]" />
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <StatusTimeline />
    </div>
  );
}
