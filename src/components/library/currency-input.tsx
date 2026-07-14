"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, Check, ChevronDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

export type CurrencyCode = "USD" | "EUR" | "GBP";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  /** Value of one unit expressed in USD, used for conversion + rate. */
  usdValue: number;
  /** Currency the conversion line quotes against. */
  quoteAgainst: CurrencyCode;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", usdValue: 1, quoteAgainst: "EUR" },
  { code: "EUR", symbol: "€", name: "Euro", usdValue: 1.085, quoteAgainst: "USD" },
  { code: "GBP", symbol: "£", name: "British Pound", usdValue: 1.268, quoteAgainst: "USD" },
];

export interface CurrencyAmount {
  code: CurrencyCode;
  /** e.g. "9820.00" or "3,275.50" */
  amount: string;
}

/* Amounts the preview types and switches between, on a loop. */
const LOOP: CurrencyAmount[] = [
  { code: "USD", amount: "9820.00" },
  { code: "EUR", amount: "14500.00" },
  { code: "GBP", amount: "3275.50" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getCurrency(list: Currency[], code: CurrencyCode): Currency {
  return list.find((c) => c.code === code) ?? list[0];
}

/** Group a raw digit string into thousands, dropping leading zeros. */
function groupInt(digits: string): string {
  if (digits === "") return "";
  const n = digits.replace(/^0+(?=\d)/, "");
  return n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parseAmount(a: string): { whole: string; cents: string } {
  const cleaned = a.replace(/,/g, "");
  const [w, c = "00"] = cleaned.split(".");
  const cents = (c + "00").slice(0, 2);
  return { whole: w.replace(/\D/g, "") || "0", cents };
}

function formatMoney(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Deterministic jitter so auto-typing never feels mechanical. */
function jitter(i: number): number {
  return Math.abs(Math.sin((i + 1) * 127.1));
}

/* ------------------------------------------------------------------ */
/*  Caret                                                             */
/* ------------------------------------------------------------------ */

function Caret() {
  return (
    <motion.span
      aria-hidden
      className="ml-1 inline-block w-[3px] shrink-0 self-center rounded-full"
      style={{ height: 34, background: "linear-gradient(180deg,#a99dff,#5b8cff)" }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1.05, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
    />
  );
}

/* Currency mark, drawn from the symbol, no emoji, no images. */
function CurrencyMark({ symbol, className }: { symbol: string; className?: string }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-full text-[13px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]",
        className
      )}
      style={{ background: "linear-gradient(140deg,#7c6cff,#5b8cff)" }}
    >
      {symbol}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  CurrencyInput                                                     */
/* ------------------------------------------------------------------ */

export interface CurrencyInputProps {
  currencies?: Currency[];
  defaultCode?: CurrencyCode;
  /**
   * Amounts the field cycles through on a loop, typing each one and switching
   * currency between them. Hovering pauses the loop for manual entry; leaving
   * resumes it.
   */
  autoplay?: CurrencyAmount[];
  className?: string;
}

export function CurrencyInput({
  currencies = CURRENCIES,
  defaultCode = "USD",
  autoplay,
  className,
}: CurrencyInputProps) {
  const autoplayOn = Array.isArray(autoplay) && autoplay.length > 0;

  const [selectedCode, setSelectedCode] = useState<CurrencyCode>(
    autoplayOn ? autoplay![0].code : defaultCode
  );
  const [whole, setWhole] = useState("");
  const [cents, setCents] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeCode, setActiveCode] = useState<CurrencyCode>(selectedCode);
  const [fieldFocused, setFieldFocused] = useState(false);
  const [interacting, setInteracting] = useState(false);

  const pausedRef = useRef(false);

  const selected = getCurrency(currencies, selectedCode);
  const target = getCurrency(currencies, selected.quoteAgainst);
  const numeric = parseFloat(`${whole === "" ? "0" : whole}.${cents ?? "00"}`);
  const converted = numeric * (selected.usdValue / target.usdValue);
  const rate = selected.usdValue / target.usdValue;
  const displayInt = groupInt(whole);
  const hasValue = whole !== "";

  /* ---- autoplay loop ---------------------------------------------- */
  useEffect(() => {
    if (!autoplayOn) return;
    const entries = autoplay!;
    let cancelled = false;
    const timers: number[] = [];

    const wait = (ms: number) =>
      new Promise<void>((res) => {
        timers.push(window.setTimeout(res, ms));
      });

    /* Hold here while the user is interacting. */
    const gate = async () => {
      while (!cancelled && pausedRef.current) await wait(180);
    };

    async function run() {
      let i = 0;
      while (!cancelled) {
        await gate();
        if (cancelled) return;

        const cur = entries[i % entries.length];
        const nxt = entries[(i + 1) % entries.length];
        const { whole: w, cents: c } = parseAmount(cur.amount);

        setSelectedCode(cur.code);
        setActiveCode(cur.code);
        setOpen(false);
        setWhole("");
        setCents(null);
        await wait(360);

        for (let k = 1; k <= w.length; k++) {
          if (cancelled) return;
          setWhole(w.slice(0, k));
          await wait(78 + Math.round(jitter(k) * 72));
        }

        if (cancelled) return;
        setCents("");
        await wait(150);
        for (let k = 1; k <= c.length; k++) {
          if (cancelled) return;
          setCents(c.slice(0, k));
          await wait(120);
        }

        await wait(1700);
        await gate();
        if (cancelled) return;

        // Reveal the selector and slide the highlight to the next currency.
        setOpen(true);
        setActiveCode(cur.code);
        await wait(520);
        setActiveCode(nxt.code);
        await wait(780);
        setOpen(false);
        await wait(380);

        i++;
      }
    }

    run();
    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplayOn, autoplay, currencies]);

  /* ---- interactive handlers --------------------------------------- */
  function toggleOpen() {
    setOpen((o) => {
      const next = !o;
      if (next) setActiveCode(selectedCode);
      return next;
    });
  }

  function selectCurrency(code: CurrencyCode) {
    setSelectedCode(code);
    setActiveCode(code);
    setOpen(false);
  }

  function onAmountKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (cents !== null) {
        if (cents.length > 0) setCents(cents.slice(0, -1));
        else setCents(null);
      } else {
        setWhole((w) => w.slice(0, -1));
      }
      return;
    }
    if (e.key === "." || e.key === ",") {
      e.preventDefault();
      if (cents === null) setCents("");
      return;
    }
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      if (cents === null) {
        setWhole((w) => (w.length >= 9 ? w : w + e.key));
      } else {
        setCents((c) => ((c ?? "").length >= 2 ? c : (c ?? "") + e.key));
      }
    }
  }

  const activeRing = open || fieldFocused || interacting;
  const showCaret = autoplayOn ? !open : fieldFocused;

  return (
    <div
      className={cn("relative w-full select-none", className)}
      onMouseEnter={() => {
        pausedRef.current = true;
        setInteracting(true);
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
        setInteracting(false);
      }}
    >
      {/* Label + currency selector -------------------------------------- */}
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-white/40">
          You send
        </span>

        <div className="relative">
          <button
            type="button"
            onClick={toggleOpen}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Currency ${selected.name}`}
            className={cn(
              "flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-2.5 transition-colors",
              open
                ? "border-brand/45 bg-brand/10"
                : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
            )}
          >
            <CurrencyMark symbol={selected.symbol} className="h-6 w-6" />
            <span className="relative inline-flex h-5 w-8 items-center overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={selected.code}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center text-sm font-semibold tabular-nums text-white/90"
                >
                  {selected.code}
                </motion.span>
              </AnimatePresence>
            </span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/40"
            >
              <ChevronDown size={14} />
            </motion.span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                role="listbox"
                className="absolute right-0 top-full z-30 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-panel/95 p-1 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85)] backdrop-blur-xl"
              >
                {currencies.map((c) => {
                  const isSel = c.code === selectedCode;
                  const isActive = c.code === activeCode;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      role="option"
                      aria-selected={isSel}
                      onMouseEnter={() => setActiveCode(c.code)}
                      onClick={() => selectCurrency(c.code)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                        isActive ? "bg-brand/12" : "hover:bg-white/[0.03]"
                      )}
                    >
                      <CurrencyMark symbol={c.symbol} className="h-7 w-7" />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-sm font-medium text-white/90">
                          {c.code}
                        </span>
                        <span className="truncate text-xs text-white/40">
                          {c.name}
                        </span>
                      </span>
                      {isSel && (
                        <Check size={15} className="shrink-0 text-brand-soft" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Amount field --------------------------------------------------- */}
      <div
        role="textbox"
        aria-label="Amount"
        tabIndex={0}
        onKeyDown={onAmountKeyDown}
        onFocus={() => setFieldFocused(true)}
        onBlur={() => setFieldFocused(false)}
        className={cn(
          "relative flex cursor-text items-baseline overflow-hidden rounded-2xl border px-4 py-4 outline-none transition-[border-color,box-shadow,background-color] duration-500",
          activeRing
            ? "border-brand/40 bg-brand/[0.04] shadow-[0_0_0_1px_rgba(124,108,255,0.25),0_18px_50px_-22px_rgba(124,108,255,0.55)]"
            : "border-white/10 bg-white/[0.02] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
        )}
      >
        {/* thin bright top edge */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <span className="mr-1 self-start pt-1 text-2xl font-medium text-white/45">
          {selected.symbol}
        </span>
        <span
          className={cn(
            "text-[44px] font-semibold leading-none tracking-tight tabular-nums",
            hasValue ? "text-white" : "text-white/25"
          )}
        >
          {hasValue ? displayInt : "0"}
        </span>
        {cents !== null && (
          <span className="text-[30px] font-semibold leading-none tracking-tight tabular-nums text-white/35">
            .{cents}
          </span>
        )}
        {showCaret && <Caret />}
      </div>

      {/* Conversion ----------------------------------------------------- */}
      <div className="mt-4 space-y-2.5">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={13} className="text-brand-soft/70" />
            <span className="text-[13px] text-white/40">Recipient gets</span>
          </div>
          <div className="flex items-baseline gap-1 tabular-nums">
            <span className="text-[15px] font-medium text-white/85">
              {target.symbol}
              {formatMoney(converted)}
            </span>
            <span className="text-xs text-white/35">{target.code}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-white/35">
          <span className="relative flex h-1.5 w-1.5">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-brand-soft"
              animate={{ opacity: [0.55, 0, 0.55], scale: [1, 2.6, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-soft" />
          </span>
          <span>Mid-market rate</span>
          <span className="text-white/20">·</span>
          <span className="tabular-nums text-white/50">
            1 {selected.code} = {rate.toFixed(4)} {target.code}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo                                                              */
/* ------------------------------------------------------------------ */

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#050508] p-6">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[480px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(124,108,255,0.16), rgba(91,140,255,0.05) 42%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-panel/80 p-6 backdrop-blur-xl"
        style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.9)" }}
      >
        <div className="mb-5">
          <h3 className="text-[15px] font-semibold text-white">Send money abroad</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            No hidden spread. You always get the mid-market rate.
          </p>
        </div>

        <CurrencyInput autoplay={LOOP} />

        <button
          type="button"
          className="mt-6 w-full rounded-xl border border-white/10 bg-gradient-to-b from-brand to-[#6656e6] py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(124,108,255,0.7)] transition-colors hover:from-[#8a7bff] hover:to-brand"
        >
          Continue to review
        </button>

        <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <Lock size={12} className="text-zinc-500" />
          Rate locked for 30 seconds at checkout.
        </div>
      </motion.div>
    </div>
  );
}
