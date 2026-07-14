"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  type Transition,
} from "framer-motion";
import { Delete, Fingerprint, LockKeyhole, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

type Status = "typing" | "success";

interface Ripple {
  id: number;
  keyId: string;
  x: number;
  y: number;
}

const DIGITS: { d: string; sub: string }[] = [
  { d: "1", sub: "" },
  { d: "2", sub: "ABC" },
  { d: "3", sub: "DEF" },
  { d: "4", sub: "GHI" },
  { d: "5", sub: "JKL" },
  { d: "6", sub: "MNO" },
  { d: "7", sub: "PQRS" },
  { d: "8", sub: "TUV" },
  { d: "9", sub: "WXYZ" },
];

export interface OtpKeypadProps {
  /** Number of passcode dots. */
  length?: number;
  /** The code the demo types on loop. Sanitized to digits, clamped to `length`. */
  code?: string;
  /** Autoplay the type-fill-unlock loop when idle. */
  autoplay?: boolean;
  /** Fires once a full code is entered (autoplay or manual). */
  onComplete?: (code: string) => void;
  className?: string;
}

export function OtpKeypad({
  length = 4,
  code = "4827",
  autoplay = true,
  onComplete,
  className,
}: OtpKeypadProps) {
  const sequence = code.replace(/\D/g, "").slice(0, length);

  const [entered, setEntered] = useState("");
  const [status, setStatus] = useState<Status>("typing");
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [interacting, setInteracting] = useState(false);

  const rippleId = useRef(0);
  const enteredRef = useRef("");
  const interactingRef = useRef(false);
  const resumeTimer = useRef<number | null>(null);
  const successTimer = useRef<number | null>(null);

  const success = status === "success";

  const triggerRipple = useCallback((keyId: string, x = 50, y = 50) => {
    const id = rippleId.current++;
    setRipples((prev) => [...prev, { id, keyId, x: Math.round(x), y: Math.round(y) }]);
  }, []);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Autoplay engine: type the code, fill the dots, flash unlock, repeat.
  useEffect(() => {
    if (interacting || !autoplay || sequence.length === 0) return;
    let alive = true;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    async function run() {
      while (alive) {
        setStatus("typing");
        setEntered("");
        enteredRef.current = "";
        await wait(720);
        if (!alive) return;

        for (let i = 0; i < sequence.length; i++) {
          if (!alive) return;
          const digit = sequence[i];
          setPressedKey(digit);
          triggerRipple(digit);
          setEntered((prev) => prev + digit);
          await wait(150);
          if (!alive) return;
          setPressedKey(null);
          await wait(300);
        }
        if (!alive) return;

        await wait(440);
        setStatus("success");
        onComplete?.(sequence);
        await wait(1600);
      }
    }

    run();
    return () => {
      alive = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [interacting, autoplay, sequence, triggerRipple, onComplete]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      if (successTimer.current) window.clearTimeout(successTimer.current);
    };
  }, []);

  function scheduleResume(ms: number) {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      interactingRef.current = false;
      setInteracting(false);
    }, ms);
  }

  function beginInteractive() {
    if (!interactingRef.current) {
      interactingRef.current = true;
      setInteracting(true);
      enteredRef.current = "";
      setEntered("");
      setStatus("typing");
      setPressedKey(null);
    }
    scheduleResume(5000);
  }

  function pressDigit(digit: string, e: React.MouseEvent<HTMLButtonElement>) {
    beginInteractive();
    const rect = e.currentTarget.getBoundingClientRect();
    triggerRipple(
      digit,
      ((e.clientX - rect.left) / rect.width) * 100,
      ((e.clientY - rect.top) / rect.height) * 100
    );
    if (enteredRef.current.length >= length) return;
    const next = enteredRef.current + digit;
    enteredRef.current = next;
    setEntered(next);
    if (next.length === length) {
      if (successTimer.current) window.clearTimeout(successTimer.current);
      successTimer.current = window.setTimeout(() => {
        setStatus("success");
        onComplete?.(next);
      }, 320);
      scheduleResume(2000);
    }
  }

  function pressDelete(e: React.MouseEvent<HTMLButtonElement>) {
    beginInteractive();
    const rect = e.currentTarget.getBoundingClientRect();
    triggerRipple(
      "del",
      ((e.clientX - rect.left) / rect.width) * 100,
      ((e.clientY - rect.top) / rect.height) * 100
    );
    const next = enteredRef.current.slice(0, -1);
    enteredRef.current = next;
    setEntered(next);
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-[280px] overflow-hidden rounded-[26px] border p-5",
        "bg-gradient-to-b from-panel to-[#0a0a10] shadow-[0_30px_80px_-45px_rgba(0,0,0,0.95)]",
        "transition-colors duration-500",
        success ? "border-emerald-400/30" : "border-white/10",
        className
      )}
    >
      {/* thin bright top edge */}
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* ambient top glow, brand at rest, emerald on unlock */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-2xl"
        animate={{
          backgroundColor: success
            ? "rgba(52,211,153,0.20)"
            : "rgba(124,108,255,0.10)",
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative flex flex-col items-center">
        {/* lock badge */}
        <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <AnimatePresence mode="wait" initial={false}>
            {success ? (
              <motion.span
                key="unlocked"
                initial={{ scale: 0.4, opacity: 0, rotate: -25 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
              >
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </motion.span>
            ) : (
              <motion.span
                key="locked"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
              >
                <LockKeyhole className="h-5 w-5 text-brand-soft" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* label */}
        <div className="mt-3 flex h-9 flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait" initial={false}>
            {success ? (
              <motion.div
                key="ok"
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -6, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="text-sm font-medium text-emerald-300"
              >
                Passcode accepted
              </motion.div>
            ) : (
              <motion.div
                key="prompt"
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -6, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <div className="text-sm font-medium text-white">Enter passcode</div>
                <div className="mt-0.5 text-[11px] text-white/35">
                  Autoplaying · tap the keys to try
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* dots */}
        <div className="mt-4 flex items-center gap-3">
          {Array.from({ length }).map((_, i) => {
            const filled = i < entered.length;
            return (
              <span
                key={i}
                className="flex h-2.5 w-2.5 items-center justify-center rounded-full ring-1 ring-inset ring-white/15"
              >
                <motion.span
                  initial={false}
                  animate={{ scale: filled ? 1 : 0, opacity: filled ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 520, damping: 26 }}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    success
                      ? "bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.45)]"
                      : "bg-white shadow-[0_0_10px_2px_rgba(124,108,255,0.45)]"
                  )}
                />
              </span>
            );
          })}
        </div>

        {/* keypad */}
        <div className="mt-5 grid grid-cols-3 place-items-center gap-x-5 gap-y-2.5">
          {DIGITS.map((k) => (
            <Key
              key={k.d}
              keyId={k.d}
              pressed={pressedKey === k.d}
              ripples={ripples}
              onRippleDone={removeRipple}
              onPress={(e) => pressDigit(k.d, e)}
            >
              <span className="text-lg font-medium leading-none tabular-nums text-white">
                {k.d}
              </span>
              {k.sub ? (
                <span className="mt-0.5 text-[8px] font-semibold leading-none tracking-[0.18em] text-white/35">
                  {k.sub}
                </span>
              ) : null}
            </Key>
          ))}

          {/* fingerprint (decorative, non-interactive) */}
          <div className="flex h-12 w-12 items-center justify-center">
            <Fingerprint className="h-5 w-5 text-white/20" />
          </div>

          <Key
            keyId="0"
            pressed={pressedKey === "0"}
            ripples={ripples}
            onRippleDone={removeRipple}
            onPress={(e) => pressDigit("0", e)}
          >
            <span className="text-lg font-medium leading-none tabular-nums text-white">
              0
            </span>
            <span className="mt-0.5 text-[8px] font-semibold leading-none tracking-[0.18em] text-white/35">
              +
            </span>
          </Key>

          <Key
            keyId="del"
            variant="action"
            ripples={ripples}
            onRippleDone={removeRipple}
            onPress={pressDelete}
          >
            <Delete className="h-5 w-5 text-white/55" />
          </Key>
        </div>
      </div>
    </div>
  );
}

function Key({
  keyId,
  children,
  ripples,
  onRippleDone,
  onPress,
  pressed = false,
  variant = "digit",
}: {
  keyId: string;
  children: React.ReactNode;
  ripples: Ripple[];
  onRippleDone: (id: number) => void;
  onPress: (e: React.MouseEvent<HTMLButtonElement>) => void;
  pressed?: boolean;
  variant?: "digit" | "action";
}) {
  const mine = ripples.filter((r) => r.keyId === keyId);
  return (
    <motion.button
      type="button"
      onClick={onPress}
      whileTap={{ scale: 0.9 }}
      animate={{ scale: pressed ? 0.9 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 24 }}
      className={cn(
        "relative flex h-12 w-12 flex-col items-center justify-center overflow-hidden rounded-full",
        "border transition-colors duration-200",
        variant === "digit"
          ? "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
          : "border-transparent bg-transparent hover:bg-white/[0.05]"
      )}
    >
      {/* press glow */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-white/10"
        animate={{ opacity: pressed ? 1 : 0 }}
        transition={{ duration: 0.18 }}
      />
      {/* ripples */}
      {mine.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute"
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
        >
          <motion.span
            className="block rounded-full bg-white/25"
            style={{ width: 18, height: 18, marginLeft: -9, marginTop: -9 }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 6, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            onAnimationComplete={() => onRippleDone(r.id)}
          />
        </span>
      ))}
      <span className="relative flex flex-col items-center">{children}</span>
    </motion.button>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <OtpKeypad />
    </div>
  );
}
