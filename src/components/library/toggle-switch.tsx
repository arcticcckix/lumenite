"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Activity, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ToggleSwitchProps = {
  checked: boolean;
  onCheckedChange?: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

/**
 * A premium on/off switch with a spring-driven thumb and a soft glow at rest.
 * Controlled via `checked` / `onCheckedChange`.
 */
export function ToggleSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  className,
}: ToggleSwitchProps) {
  // Track is 48px wide, thumb 22px, 3px inset -> travel = 48 - 6 - 22 = 20px.
  const travel = 20;

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-panel",
        disabled && "cursor-not-allowed opacity-40",
        className
      )}
    >
      {/* Off base */}
      <span className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.05]" />

      {/* On gradient + breathing glow */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage: "linear-gradient(135deg, #7c6cff 0%, #5b8cff 100%)",
        }}
        initial={false}
        animate={
          checked
            ? {
                opacity: 1,
                boxShadow: [
                  "0 0 14px rgba(124,108,255,0.30)",
                  "0 0 22px rgba(124,108,255,0.52)",
                  "0 0 14px rgba(124,108,255,0.30)",
                ],
              }
            : { opacity: 0, boxShadow: "0 0 0px rgba(124,108,255,0)" }
        }
        transition={
          checked
            ? {
                opacity: { duration: 0.2 },
                boxShadow: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
              }
            : { duration: 0.2 }
        }
      />

      {/* Thumb */}
      <motion.span
        className="relative z-10 ml-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
        initial={false}
        animate={{ x: checked ? travel : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.7 }}
      >
        <span
          className={cn(
            "absolute inset-[3px] rounded-full transition-colors duration-300",
            checked ? "bg-brand/25" : "bg-transparent"
          )}
        />
      </motion.span>
    </motion.button>
  );
}

type SettingRow = {
  key: string;
  icon: LucideIcon;
  label: string;
  description: string;
};

const ROWS: SettingRow[] = [
  {
    key: "twofa",
    icon: ShieldCheck,
    label: "Two-factor authentication",
    description: "Require a login code on new devices.",
  },
  {
    key: "email",
    icon: Mail,
    label: "Email notifications",
    description: "Weekly digest and security alerts.",
  },
  {
    key: "analytics",
    icon: Activity,
    label: "Usage analytics",
    description: "Share anonymized product usage.",
  },
];

export default function Demo() {
  const [state, setState] = useState<Record<string, boolean>>({
    twofa: true,
    email: true,
    analytics: false,
  });

  const enabled = Object.values(state).filter(Boolean).length;

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_20px_60px_-24px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Account settings</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              Manage security and alerts.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium tabular-nums text-zinc-400">
            {enabled} of {ROWS.length} on
          </span>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {ROWS.map((row) => {
            const on = state[row.key];
            const Icon = row.icon;
            return (
              <div key={row.key} className="flex items-center gap-3.5 px-5 py-4">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300",
                    on
                      ? "border-brand/30 bg-brand/10 text-brand-soft"
                      : "border-white/10 bg-white/[0.03] text-zinc-500"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white/90">
                    {row.label}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {row.description}
                  </p>
                </div>

                <ToggleSwitch
                  label={row.label}
                  checked={on}
                  onCheckedChange={(v) =>
                    setState((prev) => ({ ...prev, [row.key]: v }))
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
