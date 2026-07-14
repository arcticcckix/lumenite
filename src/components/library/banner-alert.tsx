"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Info,
  CheckCircle2,
  TriangleAlert,
  XCircle,
  ArrowRight,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type BannerVariant = "info" | "success" | "warning" | "error";

interface VariantStyle {
  icon: LucideIcon;
  label: string;
  accent: string;
  glow: string;
}

const VARIANT_STYLE: Record<BannerVariant, VariantStyle> = {
  info: {
    icon: Info,
    label: "Update",
    accent: "#8b7dff",
    glow: "rgba(124, 108, 255, 0.30)",
  },
  success: {
    icon: CheckCircle2,
    label: "Success",
    accent: "#34d399",
    glow: "rgba(52, 211, 153, 0.28)",
  },
  warning: {
    icon: TriangleAlert,
    label: "Warning",
    accent: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.26)",
  },
  error: {
    icon: XCircle,
    label: "Error",
    accent: "#fb7185",
    glow: "rgba(251, 113, 133, 0.28)",
  },
};

export interface BannerAlertProps {
  variant?: BannerVariant;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  /** When set, renders a bottom progress bar that fires onDismiss when it fills. */
  autoDismissMs?: number;
  className?: string;
}

export function BannerAlert({
  variant = "info",
  title,
  message,
  actionLabel,
  onAction,
  onDismiss,
  autoDismissMs,
  className,
}: BannerAlertProps) {
  const style = VARIANT_STYLE[variant];
  const Icon = style.icon;

  // Guard so the progress bar completing and the X click can never both advance.
  const dismissedRef = useRef(false);
  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    onDismiss?.();
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-panel",
        className
      )}
      style={{ boxShadow: "0 20px 60px -30px rgba(0,0,0,0.9)" }}
    >
      {/* variant glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full blur-2xl"
        style={{ background: style.glow }}
      />
      {/* top hairline highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)",
        }}
      />
      {/* left accent edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent, ${style.accent}, transparent)`,
        }}
      />

      <div className="relative flex items-start gap-3.5 p-4 pr-3">
        <div
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
          style={{
            borderColor: `${style.accent}45`,
            background: `${style.accent}1f`,
          }}
        >
          <Icon
            className="h-[18px] w-[18px]"
            strokeWidth={2}
            style={{ color: style.accent }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{title}</span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
              style={{
                color: style.accent,
                background: `${style.accent}1a`,
              }}
            >
              {style.label}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
            {message}
          </p>
          {actionLabel ? (
            <button
              type="button"
              onClick={onAction}
              className="group/act mt-2.5 inline-flex items-center gap-1 text-[13px] font-medium transition-colors"
              style={{ color: style.accent }}
            >
              {actionLabel}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/act:translate-x-0.5" />
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="-mr-0.5 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {typeof autoDismissMs === "number" ? (
        <div className="relative h-[3px] w-full overflow-hidden bg-white/[0.06]">
          <motion.div
            className="absolute inset-y-0 left-0 w-full origin-left"
            style={{ background: style.accent, transformOrigin: "left" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: autoDismissMs / 1000, ease: "linear" }}
            onAnimationComplete={dismiss}
          />
        </div>
      ) : null}
    </div>
  );
}

interface DemoBanner {
  variant: BannerVariant;
  title: string;
  message: string;
  actionLabel: string;
}

const DEMO_BANNERS: DemoBanner[] = [
  {
    variant: "info",
    title: "Realtime is now live",
    message:
      "Collaborative editing ships to every workspace today. Invite your team and build together in the same canvas.",
    actionLabel: "See what changed",
  },
  {
    variant: "success",
    title: "Deployment succeeded",
    message:
      "lumenite-web reached production in 41 seconds. All 218 checks passed with zero regressions.",
    actionLabel: "View deployment",
  },
  {
    variant: "warning",
    title: "Usage approaching limit",
    message:
      "You have used 82 percent of this month's render minutes. Upgrade before renewal to avoid throttling.",
    actionLabel: "Manage plan",
  },
  {
    variant: "error",
    title: "Payment failed",
    message:
      "We could not charge the card ending in 4242. Update your billing details to keep services running.",
    actionLabel: "Update billing",
  },
];

const CYCLE_MS = 4600;

export default function Demo() {
  const [index, setIndex] = useState(0);
  const banner = DEMO_BANNERS[index];

  const advance = () => setIndex((i) => (i + 1) % DEMO_BANNERS.length);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-full max-w-md items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-brand"
              animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
            Notifications
          </span>
        </div>
        <span className="font-mono text-[11px] text-zinc-600">
          {String(index + 1).padStart(2, "0")} / {String(DEMO_BANNERS.length).padStart(2, "0")}
        </span>
      </div>

      <div className="flex min-h-[136px] w-full max-w-md items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full overflow-hidden"
          >
            <BannerAlert
              variant={banner.variant}
              title={banner.title}
              message={banner.message}
              actionLabel={banner.actionLabel}
              autoDismissMs={CYCLE_MS}
              onDismiss={advance}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        {DEMO_BANNERS.map((b, i) => {
          const active = i === index;
          return (
            <button
              key={b.variant}
              type="button"
              aria-label={`Show ${b.variant} banner`}
              onClick={() => setIndex(i)}
              className="h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{
                width: active ? 22 : 6,
                background: active
                  ? VARIANT_STYLE[b.variant].accent
                  : "rgba(255,255,255,0.16)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
