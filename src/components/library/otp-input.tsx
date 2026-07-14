"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type OtpStatus = "idle" | "success" | "error";

export interface OtpInputProps {
  /** Number of digit boxes. */
  length?: number;
  /** Controlled value (digits only). */
  value: string;
  /** Fires with the sanitized value on every keystroke or paste. */
  onChange?: (value: string) => void;
  /** Fires once the value fills every box. */
  onComplete?: (value: string) => void;
  /** Visual status of the field. */
  status?: OtpStatus;
  /** Force the focused visual (used by autoplay previews). */
  focused?: boolean;
  /** Purely presentational: ignores keystrokes, hides the OS keyboard. */
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
}

const EMERALD_BORDER = "rgba(52,211,153,0.55)";
const CORAL_BORDER = "rgba(248,113,113,0.55)";

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  status = "idle",
  focused,
  readOnly = false,
  disabled = false,
  className,
}: OtpInputProps) {
  const groupId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalFocused, setInternalFocused] = useState(false);
  const isFocused = (focused ?? internalFocused) && !disabled;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (readOnly || disabled) return;
    const next = e.target.value.replace(/\D/g, "").slice(0, length);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  }

  const success = status === "success";
  const error = status === "error";

  return (
    <div
      className={cn(
        "relative inline-flex select-none",
        disabled && "opacity-50",
        className
      )}
    >
      <LayoutGroup id={groupId}>
        <div className="flex gap-2.5">
          {Array.from({ length }).map((_, i) => {
            const digit = value[i] ?? "";
            const filled = i < value.length;
            const isNext =
              status === "idle" && !disabled && value.length < length && i === value.length;
            const showRing = isNext;
            const showCaret = isNext && isFocused;

            const borderColor = success
              ? EMERALD_BORDER
              : error
                ? CORAL_BORDER
                : filled
                  ? "rgba(255,255,255,0.20)"
                  : "rgba(255,255,255,0.08)";

            const boxShadow = success
              ? "inset 0 0 14px -8px rgba(52,211,153,0.7), 0 0 22px -8px rgba(52,211,153,0.55)"
              : filled
                ? "inset 0 1px 0 0 rgba(255,255,255,0.05)"
                : "none";

            return (
              <div
                key={i}
                className="relative flex h-16 w-12 items-center justify-center rounded-xl border bg-white/[0.02] transition-[border-color,box-shadow,background-color] duration-300"
                style={{
                  borderColor,
                  boxShadow,
                  backgroundColor: success ? "rgba(52,211,153,0.05)" : undefined,
                }}
              >
                {/* Glowing active ring, slides between boxes as you type */}
                {showRing && (
                  <motion.div
                    layoutId="otp-active-ring"
                    className="pointer-events-none absolute inset-[-1px] rounded-xl transition-[box-shadow,border-color] duration-300"
                    style={{
                      border: `1px solid ${
                        isFocused ? "rgba(124,108,255,0.9)" : "rgba(124,108,255,0.45)"
                      }`,
                      boxShadow: isFocused
                        ? "0 0 0 1px rgba(124,108,255,0.55), 0 0 22px -2px rgba(124,108,255,0.5), 0 0 46px -10px rgba(91,140,255,0.45)"
                        : "0 0 16px -7px rgba(124,108,255,0.6)",
                    }}
                    transition={{ type: "spring", stiffness: 480, damping: 34, mass: 0.6 }}
                  />
                )}

                {/* Blinking caret in the active box */}
                {showCaret && (
                  <motion.span
                    aria-hidden
                    className="absolute h-7 w-[2px] rounded-full"
                    style={{ background: "linear-gradient(180deg,#a99dff,#5b8cff)" }}
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{
                      duration: 1.05,
                      repeat: Infinity,
                      ease: "linear",
                      times: [0, 0.5, 0.5, 1],
                    }}
                  />
                )}

                {/* Digit pops in with a spring */}
                <AnimatePresence mode="popLayout">
                  {filled && (
                    <motion.span
                      key={digit + String(i)}
                      initial={{ opacity: 0, scale: 0.3, y: 7 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.55, y: -5 }}
                      transition={{ type: "spring", stiffness: 520, damping: 24, mass: 0.7 }}
                      className="font-mono text-2xl font-semibold leading-none"
                      style={{ color: success ? "#c9f7e2" : error ? "#fecaca" : "#ffffff" }}
                    >
                      {digit}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </LayoutGroup>

      {/* One transparent input captures typing, paste and OTP autofill */}
      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onFocus={() => setInternalFocused(true)}
        onBlur={() => setInternalFocused(false)}
        readOnly={readOnly}
        disabled={disabled}
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-label="One-time passcode"
        maxLength={length}
        tabIndex={readOnly || disabled ? -1 : 0}
        className={cn(
          "absolute inset-0 z-20 h-full w-full cursor-text bg-transparent text-transparent opacity-0 outline-none",
          (readOnly || disabled) && "pointer-events-none"
        )}
        style={{ caretColor: "transparent" }}
      />
    </div>
  );
}

const DEMO_CODE = "042931";
const TYPE_STEP = 440;

export default function Demo() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<OtpStatus>("idle");

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    function run() {
      if (cancelled) return;
      timers = [];
      setValue("");
      setStatus("idle");

      for (let i = 1; i <= DEMO_CODE.length; i++) {
        timers.push(
          setTimeout(() => setValue(DEMO_CODE.slice(0, i)), i * TYPE_STEP)
        );
      }
      const typedAt = DEMO_CODE.length * TYPE_STEP;
      timers.push(setTimeout(() => setStatus("success"), typedAt + 760));
      timers.push(setTimeout(run, typedAt + 760 + 2000));
    }

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const verifying = value.length === DEMO_CODE.length && status === "idle";

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#050508] p-6">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(124,108,255,0.16), rgba(91,140,255,0.06) 45%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-panel/80 p-7 backdrop-blur-xl"
        style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.9)" }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-brand/15 text-brand-soft">
            <ShieldCheck size={18} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">Verify it&apos;s you</h3>
            <p className="text-xs text-zinc-500">
              Code sent to a&bull;&bull;&bull;n@lumenite.dev
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <OtpInput value={value} status={status} focused readOnly />
        </div>

        <div className="mt-6 flex h-6 items-center justify-center text-xs">
          <AnimatePresence mode="wait" initial={false}>
            {status === "success" ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 font-medium text-emerald-300"
              >
                <motion.span
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.04 }}
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300"
                >
                  <Check size={11} strokeWidth={3} />
                </motion.span>
                Code verified
              </motion.div>
            ) : verifying ? (
              <motion.div
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-zinc-400"
              >
                <Loader2 size={13} className="animate-spin text-brand-soft" />
                Verifying code
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 text-zinc-500"
              >
                Didn&apos;t get it?
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  className="font-medium text-brand-soft transition-colors hover:text-white"
                >
                  Resend
                </motion.button>
                <span className="text-zinc-600">in 0:24</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
