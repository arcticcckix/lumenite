"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  type Variants,
} from "framer-motion";
import {
  Rocket,
  Activity,
  ShieldCheck,
  GitPullRequest,
  Check,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export interface VerticalTab {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  metric: { value: string; label: string };
}

const panelVariants: Variants = {
  enter: { opacity: 0, y: 12, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(4px)" },
};

export function TabsVertical({
  tabs,
  className,
  interval = 4200,
  layoutId = "tabs-vertical-active",
}: {
  tabs: VerticalTab[];
  className?: string;
  interval?: number;
  layoutId?: string;
}) {
  const [active, setActive] = useState(0);
  const progress = useMotionValue(0);

  const activeRef = useRef(0);
  const elapsedRef = useRef(0);
  const pausedRef = useRef(false);
  const count = tabs.length;

  useEffect(() => {
    let raf = 0;
    let last: number | null = null;

    const tick = (now: number) => {
      if (last === null) last = now;
      const dt = now - last;
      last = now;

      if (!pausedRef.current && count > 1) {
        elapsedRef.current += dt;
        const p = Math.min(elapsedRef.current / interval, 1);
        progress.set(Math.round(p * 1000) / 1000);

        if (elapsedRef.current >= interval) {
          elapsedRef.current = 0;
          const next = (activeRef.current + 1) % count;
          activeRef.current = next;
          setActive(next);
          progress.set(0);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, interval, progress]);

  function select(i: number) {
    activeRef.current = i;
    elapsedRef.current = 0;
    progress.set(0);
    setActive(i);
  }

  const current = tabs[active];
  const CurrentIcon = current.icon;

  return (
    <div
      role="tablist"
      aria-label="Platform capabilities"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      className={cn(
        "flex h-full w-full gap-3 rounded-3xl border border-white/10 bg-[#0b0b12] p-3",
        className
      )}
    >
      {/* Tab rail */}
      <div className="flex w-[42%] max-w-[220px] flex-col">
        <div className="mb-2 px-3 pt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
          Platform
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          {tabs.map((tab, i) => {
            const isActive = i === active;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => select(i)}
                className="group/tab relative w-full rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-1 focus-visible:ring-brand/50"
              >
                {isActive && (
                  <motion.span
                    layoutId={layoutId}
                    aria-hidden
                    className="absolute inset-0 rounded-xl border border-brand/30 bg-brand/[0.08]"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  >
                    <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-gradient-to-b from-glow to-brand" />
                  </motion.span>
                )}

                <span className="relative z-10 flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                      isActive
                        ? "border-brand/40 bg-brand/15 text-white"
                        : "border-white/10 bg-white/[0.02] text-zinc-500 group-hover/tab:text-zinc-300"
                    )}
                  >
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span
                      className={cn(
                        "truncate text-sm font-medium transition-colors",
                        isActive
                          ? "text-white"
                          : "text-zinc-400 group-hover/tab:text-zinc-200"
                      )}
                    >
                      {tab.label}
                    </span>
                    <span className="truncate text-[11px] text-zinc-600">
                      {tab.hint}
                    </span>
                  </span>
                </span>

                {isActive && (
                  <motion.span
                    aria-hidden
                    className="absolute bottom-1.5 left-3 right-3 h-[2px] origin-left rounded-full bg-gradient-to-r from-brand to-glow"
                    style={{ scaleX: progress }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content panel */}
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#101018]">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/25 blur-3xl"
          animate={{ opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            role="tabpanel"
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: EASE }}
            className="relative flex h-full flex-col p-6"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold tabular-nums text-zinc-600">
                {`0${active + 1}`}
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-soft">
                {current.eyebrow}
              </span>
            </div>

            <h3 className="mt-2.5 text-lg font-semibold leading-snug text-white sm:text-xl">
              {current.title}
            </h3>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-zinc-400">
              {current.body}
            </p>

            <ul className="mt-4 space-y-2">
              {current.points.map((pt) => (
                <li
                  key={pt}
                  className="flex items-start gap-2.5 text-[13px] text-zinc-300"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-soft">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex items-end justify-between border-t border-white/[0.06] pt-3.5">
              <div>
                <div className="text-2xl font-semibold tracking-tight text-white">
                  {current.metric.value}
                </div>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {current.metric.label}
                </div>
              </div>
              <CurrentIcon
                size={44}
                strokeWidth={1.25}
                className="text-white/[0.06]"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const DEMO_TABS: VerticalTab[] = [
  {
    id: "deploy",
    label: "Deployments",
    hint: "Push to production",
    icon: Rocket,
    eyebrow: "Ship",
    title: "Deploy every push in seconds",
    body: "Every commit builds, previews, and promotes on its own. Instant rollbacks keep production one click from a known good release.",
    points: [
      "Immutable preview URL for every pull request",
      "Atomic promotions with zero downtime",
      "One-click rollback to any prior build",
    ],
    metric: { value: "12s", label: "median build to live" },
  },
  {
    id: "observe",
    label: "Observability",
    hint: "Traces, logs, metrics",
    icon: Activity,
    eyebrow: "Watch",
    title: "See every request as it happens",
    body: "Traces, logs, and metrics stream into one timeline. Filter by route, region, or release to catch the slow path before users feel it.",
    points: [
      "Distributed traces across all services",
      "Live tail with structured log search",
      "Alerts wired to Slack and PagerDuty",
    ],
    metric: { value: "1.4M", label: "spans indexed per minute" },
  },
  {
    id: "access",
    label: "Access Control",
    hint: "Roles and audit",
    icon: ShieldCheck,
    eyebrow: "Secure",
    title: "Least-privilege access by default",
    body: "Scoped tokens, SSO, and per-environment roles keep production locked down. Every action lands in an immutable audit log you can export.",
    points: [
      "SAML and SCIM for your identity provider",
      "Fine-grained roles per project and environment",
      "Signed audit trail retained for 90 days",
    ],
    metric: { value: "SOC 2", label: "Type II certified" },
  },
  {
    id: "collab",
    label: "Collaboration",
    hint: "Review in the flow",
    icon: GitPullRequest,
    eyebrow: "Together",
    title: "Review changes without leaving the PR",
    body: "Preview links, inline comments, and deploy status land on the pull request. Required approvals gate promotion so nothing ships unseen.",
    points: [
      "Deploy status checks on every pull request",
      "Comment threads pinned to a live preview",
      "Required approvals before promote",
    ],
    metric: { value: "3x", label: "faster review cycles" },
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <TabsVertical tabs={DEMO_TABS} className="h-[404px] max-w-2xl" />
    </div>
  );
}
