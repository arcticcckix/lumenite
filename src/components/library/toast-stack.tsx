"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  CreditCard,
  GitMerge,
  Info,
  MessageSquare,
  Rocket,
  TrendingUp,
  TriangleAlert,
  UserPlus,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastSpec {
  accent: string;
  tint: string;
  icon: LucideIcon;
  title: string;
  message: string;
}

export interface ActiveToast extends ToastSpec {
  id: number;
}

const DEFAULT_TOASTS: ToastSpec[] = [
  {
    accent: "#34d399",
    tint: "rgba(52, 211, 153, 0.14)",
    icon: CreditCard,
    title: "Payment received",
    message: "$79.00 from Marcus Bell, Recovery Blend",
  },
  {
    accent: "#7c6cff",
    tint: "rgba(124, 108, 255, 0.16)",
    icon: Rocket,
    title: "Deployment live",
    message: "Production build shipped in 12s",
  },
  {
    accent: "#a99dff",
    tint: "rgba(169, 157, 255, 0.16)",
    icon: UserPlus,
    title: "New Pro subscriber",
    message: "Jordan Reyes upgraded from the trial",
  },
  {
    accent: "#fbbf24",
    tint: "rgba(251, 191, 36, 0.14)",
    icon: TriangleAlert,
    title: "Storage almost full",
    message: "You have used 92% of your quota",
  },
  {
    accent: "#22d3ee",
    tint: "rgba(34, 211, 238, 0.14)",
    icon: MessageSquare,
    title: "New mention",
    message: "Renee tagged you in Roadmap Q3",
  },
  {
    accent: "#fb7185",
    tint: "rgba(251, 113, 133, 0.14)",
    icon: XCircle,
    title: "Sync failed",
    message: "Retrying connection to us-east-1",
  },
  {
    accent: "#34d399",
    tint: "rgba(52, 211, 153, 0.14)",
    icon: GitMerge,
    title: "Pull request merged",
    message: "feat: streaming toasts into main",
  },
  {
    accent: "#5b8cff",
    tint: "rgba(91, 140, 255, 0.16)",
    icon: TrendingUp,
    title: "Revenue milestone",
    message: "Crossed $10k MRR this month",
  },
];

const r2 = (n: number) => Math.round(n * 100) / 100;

let toastUid = 0;

export function ToastStack({
  className,
  specs = DEFAULT_TOASTS,
  interval = 2000,
  duration = 5200,
  max = 3,
}: {
  className?: string;
  specs?: ToastSpec[];
  interval?: number;
  duration?: number;
  max?: number;
}) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const cursor = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const push = () => {
      const spec = specs[cursor.current % specs.length];
      cursor.current += 1;
      toastUid += 1;
      const entry: ActiveToast = { ...spec, id: toastUid };

      setToasts((prev) => [entry, ...prev].slice(0, max));

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== entry.id));
        timers.current.delete(entry.id);
      }, duration);
      timers.current.set(entry.id, timer);
    };

    const kickoff = setTimeout(push, 260);
    const loop = setInterval(push, interval);
    const snapshot = timers.current;
    return () => {
      clearTimeout(kickoff);
      clearInterval(loop);
      snapshot.forEach((t) => clearTimeout(t));
      snapshot.clear();
    };
  }, [specs, interval, duration, max]);

  const dismiss = (id: number) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div
      className={cn("relative h-[132px] w-[320px]", className)}
      style={{ perspective: 1200 }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast, i) => {
          const Icon = toast.icon;
          const front = i === 0;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9, y: 0 }}
              animate={{
                opacity: r2(Math.max(0, 1 - i * 0.34)),
                x: 0,
                y: r2(-i * 15),
                scale: r2(1 - i * 0.05),
              }}
              exit={{ opacity: 0, x: 60, scale: 0.92 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ zIndex: max - i }}
              className="absolute bottom-0 right-0 w-full origin-bottom"
            >
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-panel shadow-[0_20px_44px_-16px_rgba(0,0,0,0.75)]">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
                  }}
                />
                <div className="flex items-start gap-3 px-3.5 py-3">
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: toast.tint,
                      color: toast.accent,
                      boxShadow: `inset 0 0 0 1px ${toast.tint}`,
                    }}
                  >
                    <Icon className="h-[17px] w-[17px]" strokeWidth={2.1} />
                  </div>
                  <div className="min-w-0 flex-1 pt-px">
                    <p className="truncate text-[13px] font-semibold text-white">
                      {toast.title}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] leading-snug text-zinc-400">
                      {toast.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(toast.id)}
                    aria-label="Dismiss notification"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-white/5 hover:text-zinc-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {front && (
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5">
                    <motion.div
                      className="h-full origin-left"
                      style={{ background: toast.accent }}
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{ duration: duration / 1000, ease: "linear" }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-void p-6">
      <div
        className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124,108,255,0.16), transparent 70%)",
        }}
      />
      <div className="absolute left-5 top-5 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
          Realtime activity
        </span>
      </div>
      <ToastStack className="relative" />
    </div>
  );
}
