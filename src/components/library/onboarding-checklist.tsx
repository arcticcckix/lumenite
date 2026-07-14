"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderPlus,
  Users,
  GitBranch,
  Rocket,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const ROW_HEIGHT = 54;

export type OnboardingStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type OnboardingChecklistProps = {
  /** Ordered setup steps. */
  steps?: OnboardingStep[];
  /** How many steps are complete, from the top. */
  completed: number;
  className?: string;
};

const DEFAULT_STEPS: OnboardingStep[] = [
  {
    title: "Create project",
    description: "Name your workspace and choose a region.",
    icon: FolderPlus,
  },
  {
    title: "Invite team",
    description: "Add teammates by email or a shared link.",
    icon: Users,
  },
  {
    title: "Connect repository",
    description: "Link a GitHub repo to sync changes.",
    icon: GitBranch,
  },
  {
    title: "Deploy",
    description: "Push to main and ship to production.",
    icon: Rocket,
  },
];

type RowState = "done" | "active" | "pending";

function StepIndicator({ state }: { state: RowState }) {
  return (
    <span className="relative flex h-6 w-6 items-center justify-center">
      <motion.span
        className="absolute inset-0 rounded-full border"
        animate={{
          borderColor:
            state === "done"
              ? "rgba(124,108,255,0)"
              : state === "active"
                ? "rgba(124,108,255,0.5)"
                : "rgba(255,255,255,0.12)",
        }}
        transition={{ duration: 0.35, ease: EASE }}
      />

      {state === "active" && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "0 0 0 1px rgba(124,108,255,0.45)" }}
          animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.12, 1] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {state === "done" && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand), var(--color-glow))",
              boxShadow: "0 6px 16px -6px rgba(124,108,255,0.7)",
            }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 22 }}
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="relative h-3.5 w-3.5"
            aria-hidden
          >
            <motion.path
              d="M5 12.5l4 4 10-10.5"
              stroke="#ffffff"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: EASE, delay: 0.08 }}
            />
          </svg>
        </>
      )}
    </span>
  );
}

export function OnboardingChecklist({
  steps = DEFAULT_STEPS,
  completed,
  className,
}: OnboardingChecklistProps) {
  const total = steps.length;
  const doneCount = Math.max(0, Math.min(completed, total));
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const complete = total > 0 && doneCount >= total;
  const activeIndex = doneCount < total ? doneCount : -1;

  return (
    <div
      className={cn(
        "relative w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-panel p-5 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.95)]",
        className
      )}
    >
      {/* ambient top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 left-1/2 h-52 w-72 -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,108,255,0.18), transparent 70%)",
        }}
      />

      {/* celebration bloom */}
      {complete && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(420px circle at 50% 42%, rgba(91,140,255,0.16), transparent 65%)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.8, 1.15, 1.2] }}
          transition={{ duration: 1.6, ease: EASE }}
        />
      )}

      {/* header */}
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold tracking-tight text-white">
              Getting started
            </h3>
            {complete && (
              <motion.span
                className="flex h-4 w-4 items-center justify-center rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-brand), var(--color-glow))",
                }}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 460, damping: 18 }}
              >
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
              </motion.span>
            )}
          </div>
          <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-zinc-500">
            {complete
              ? "Everything's connected. You're ready to ship."
              : "Finish these steps to launch your first deploy."}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="relative h-6 overflow-hidden font-mono text-2xl font-semibold leading-none tracking-tight text-white">
            <motion.span
              key={percent}
              className="block tabular-nums"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {percent}%
            </motion.span>
          </div>
          <div className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            complete
          </div>
        </div>
      </div>

      {/* progress bar */}
      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-brand), var(--color-glow))",
          }}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 26 }}
        />
        {complete && (
          <motion.div
            aria-hidden
            className="absolute inset-y-0 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "360%" }}
            transition={{ duration: 1.1, ease: EASE }}
          />
        )}
      </div>

      {/* steps */}
      <div className="relative mt-4" style={{ height: total * ROW_HEIGHT }}>
        {/* sliding active highlight */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 rounded-xl"
          style={{
            height: ROW_HEIGHT,
            background:
              "linear-gradient(90deg, rgba(124,108,255,0.10), rgba(124,108,255,0.02))",
            border: "1px solid rgba(124,108,255,0.14)",
          }}
          animate={{
            y: (activeIndex < 0 ? 0 : activeIndex) * ROW_HEIGHT,
            opacity: complete ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
        />

        {steps.map((step, i) => {
          const state: RowState =
            i < doneCount ? "done" : i === activeIndex ? "active" : "pending";
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              className="relative flex items-center gap-3 px-2.5"
              style={{ height: ROW_HEIGHT }}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, ease: EASE, duration: 0.45 }}
            >
              <motion.span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                animate={{
                  backgroundColor:
                    state === "done"
                      ? "rgba(124,108,255,0.12)"
                      : "rgba(255,255,255,0.03)",
                  borderColor:
                    state === "done"
                      ? "rgba(124,108,255,0.28)"
                      : "rgba(255,255,255,0.08)",
                  color:
                    state === "done"
                      ? "#a99dff"
                      : state === "active"
                        ? "#d4d4d8"
                        : "#6b6b78",
                }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </motion.span>

              <div className="min-w-0 flex-1">
                <motion.div
                  className="truncate text-sm font-medium"
                  animate={{
                    color:
                      state === "pending"
                        ? "#71717a"
                        : state === "active"
                          ? "#ffffff"
                          : "#e4e4e7",
                  }}
                  transition={{ duration: 0.35 }}
                >
                  {step.title}
                </motion.div>
                <div className="truncate text-xs leading-relaxed text-zinc-600">
                  {step.description}
                </div>
              </div>

              <StepIndicator state={state} />
            </motion.div>
          );
        })}
      </div>

      {/* footer */}
      <div className="relative mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <span className="text-xs text-zinc-500">
          {complete ? "Setup complete" : `${doneCount} of ${total} steps done`}
        </span>
        <motion.span
          className="flex items-center gap-1.5 text-xs font-medium"
          animate={{ color: complete ? "#a99dff" : "#52525b" }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          Open dashboard
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </motion.span>
      </div>
    </div>
  );
}

export default function Demo() {
  const [completed, setCompleted] = useState(0);
  const total = 4;

  useEffect(() => {
    const finished = completed >= total;
    const delay = finished ? 2400 : 1350;
    const id = setTimeout(() => {
      setCompleted((c) => (c >= total ? 0 : c + 1));
    }, delay);
    return () => clearTimeout(id);
  }, [completed]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <OnboardingChecklist completed={completed} />
    </div>
  );
}
