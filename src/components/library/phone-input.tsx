"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Phone, Search, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Flags, drawn with pure CSS, no emoji, no images                   */
/* ------------------------------------------------------------------ */

type FlagKind =
  | { t: "v"; c: [string, string, string] } // three vertical stripes
  | { t: "h"; c: [string, string, string] } // three horizontal stripes
  | { t: "h2"; c: [string, string] } // two horizontal stripes
  | { t: "spain" } // red / gold(2x) / red
  | { t: "circle"; base: string; dot: string } // Japan
  | { t: "nordic"; base: string; cross: string } // Sweden
  | { t: "union" } // United Kingdom
  | { t: "us" }
  | { t: "brazil" }
  | { t: "india" };

function FlagArt({ kind }: { kind: FlagKind }) {
  switch (kind.t) {
    case "v":
      return (
        <div className="flex h-full w-full">
          {kind.c.map((col, i) => (
            <div key={i} className="h-full flex-1" style={{ background: col }} />
          ))}
        </div>
      );
    case "h":
      return (
        <div className="flex h-full w-full flex-col">
          {kind.c.map((col, i) => (
            <div key={i} className="w-full flex-1" style={{ background: col }} />
          ))}
        </div>
      );
    case "h2":
      return (
        <div className="flex h-full w-full flex-col">
          {kind.c.map((col, i) => (
            <div key={i} className="w-full flex-1" style={{ background: col }} />
          ))}
        </div>
      );
    case "spain":
      return (
        <div className="flex h-full w-full flex-col">
          <div style={{ flex: 1, background: "#AA151B" }} />
          <div style={{ flex: 2, background: "#F1BF00" }} />
          <div style={{ flex: 1, background: "#AA151B" }} />
        </div>
      );
    case "circle":
      return (
        <>
          <div className="h-full w-full" style={{ background: kind.base }} />
          <div
            className="absolute left-1/2 top-1/2 h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: kind.dot }}
          />
        </>
      );
    case "nordic":
      return (
        <>
          <div className="h-full w-full" style={{ background: kind.base }} />
          <div
            className="absolute inset-y-0 w-[3px]"
            style={{ left: "31%", background: kind.cross }}
          />
          <div
            className="absolute inset-x-0 h-[3px] -translate-y-1/2"
            style={{ top: "50%", background: kind.cross }}
          />
        </>
      );
    case "union":
      return (
        <div
          className="h-full w-full"
          style={{
            background: [
              "linear-gradient(0deg, transparent 42%, #C8102E 42%, #C8102E 58%, transparent 58%)",
              "linear-gradient(90deg, transparent 42%, #C8102E 42%, #C8102E 58%, transparent 58%)",
              "linear-gradient(0deg, transparent 34%, #fff 34%, #fff 66%, transparent 66%)",
              "linear-gradient(90deg, transparent 34%, #fff 34%, #fff 66%, transparent 66%)",
              "linear-gradient(45deg, transparent 44%, #fff 44%, #fff 56%, transparent 56%)",
              "linear-gradient(135deg, transparent 44%, #fff 44%, #fff 56%, transparent 56%)",
              "#012169",
            ].join(","),
          }}
        />
      );
    case "us":
      return (
        <>
          <div
            className="h-full w-full"
            style={{
              background:
                "repeating-linear-gradient(#B22234 0 1.15px, #ffffff 1.15px 2.3px)",
            }}
          />
          <div
            className="absolute left-0 top-0"
            style={{ width: "42%", height: "54%", background: "#3C3B6E" }}
          />
          <div
            className="absolute left-0 top-0"
            style={{
              width: "42%",
              height: "54%",
              background:
                "radial-gradient(#fff 0.4px, transparent 0.7px) 0 0 / 3px 2.6px",
            }}
          />
        </>
      );
    case "brazil":
      return (
        <>
          <div className="h-full w-full" style={{ background: "#009C3B" }} />
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: "13px",
              height: "13px",
              transform: "translate(-50%,-50%) rotate(45deg)",
              background: "#FFDF00",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: "6px",
              height: "6px",
              transform: "translate(-50%,-50%)",
              background: "#002776",
            }}
          />
        </>
      );
    case "india":
      return (
        <>
          <div className="flex h-full w-full flex-col">
            <div style={{ flex: 1, background: "#FF9933" }} />
            <div style={{ flex: 1, background: "#ffffff" }} />
            <div style={{ flex: 1, background: "#138808" }} />
          </div>
          <div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: "6px",
              height: "6px",
              transform: "translate(-50%,-50%)",
              border: "1px solid #054AA6",
            }}
          />
        </>
      );
  }
}

function Flag({ kind, className }: { kind: FlagKind; className?: string }) {
  return (
    <div
      className={cn(
        "relative h-[15px] w-[22px] shrink-0 overflow-hidden rounded-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]",
        className
      )}
    >
      <FlagArt kind={kind} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

export interface Country {
  code: string; // ISO-3166 alpha-2
  name: string;
  dial: string; // "+1"
  flag: FlagKind;
  format: string; // "(###) ###-####"
  sample: string; // national digits used by the autoplay preview
}

export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", dial: "+1", flag: { t: "us" }, format: "(###) ###-####", sample: "2025550147" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: { t: "union" }, format: "#### ### ###", sample: "7911123456" },
  { code: "DE", name: "Germany", dial: "+49", flag: { t: "h", c: ["#000000", "#DD0000", "#FFCE00"] }, format: "#### ### ####", sample: "15123456789" },
  { code: "FR", name: "France", dial: "+33", flag: { t: "v", c: ["#0055A4", "#ffffff", "#EF4135"] }, format: "# ## ## ## ##", sample: "612345678" },
  { code: "JP", name: "Japan", dial: "+81", flag: { t: "circle", base: "#ffffff", dot: "#BC002D" }, format: "## #### ####", sample: "9012345678" },
  { code: "IN", name: "India", dial: "+91", flag: { t: "india" }, format: "##### #####", sample: "9812345678" },
  { code: "BR", name: "Brazil", dial: "+55", flag: { t: "brazil" }, format: "(##) #####-####", sample: "11987654321" },
  { code: "IT", name: "Italy", dial: "+39", flag: { t: "v", c: ["#008C45", "#F4F5F0", "#CD212A"] }, format: "### ### ####", sample: "3123456789" },
  { code: "ES", name: "Spain", dial: "+34", flag: { t: "spain" }, format: "### ## ## ##", sample: "612345678" },
  { code: "NL", name: "Netherlands", dial: "+31", flag: { t: "h", c: ["#AE1C28", "#ffffff", "#21468B"] }, format: "# ## ## ## ##", sample: "612345678" },
  { code: "SE", name: "Sweden", dial: "+46", flag: { t: "nordic", base: "#006AA7", cross: "#FECC00" }, format: "##-### ## ##", sample: "701234567" },
  { code: "MX", name: "Mexico", dial: "+52", flag: { t: "v", c: ["#006847", "#ffffff", "#CE1126"] }, format: "## #### ####", sample: "5512345678" },
  { code: "UA", name: "Ukraine", dial: "+380", flag: { t: "h2", c: ["#0057B7", "#FFD700"] }, format: "## ### ## ##", sample: "501234567" },
  { code: "NG", name: "Nigeria", dial: "+234", flag: { t: "v", c: ["#008751", "#ffffff", "#008751"] }, format: "### ### ####", sample: "8021234567" },
  { code: "AR", name: "Argentina", dial: "+54", flag: { t: "h", c: ["#74ACDF", "#ffffff", "#74ACDF"] }, format: "## ####-####", sample: "1123456789" },
  { code: "PL", name: "Poland", dial: "+48", flag: { t: "h2", c: ["#ffffff", "#DC143C"] }, format: "### ### ###", sample: "512345678" },
  { code: "IE", name: "Ireland", dial: "+353", flag: { t: "v", c: ["#169B62", "#ffffff", "#FF883E"] }, format: "## ### ####", sample: "851234567" },
];

/* Countries the preview cycles through, by ISO code. */
const LOOP = ["US", "JP", "DE", "FR", "BR"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function capacity(format: string): number {
  let n = 0;
  for (const ch of format) if (ch === "#") n++;
  return n;
}

function formatPhone(format: string, digits: string): string {
  let out = "";
  let di = 0;
  for (const ch of format) {
    if (ch === "#") {
      if (di < digits.length) {
        out += digits[di];
        di++;
      } else break;
    } else if (di < digits.length) {
      out += ch;
    } else break;
  }
  return out;
}

/* Deterministic jitter so the auto-typing never feels mechanical. */
function jitter(i: number): number {
  return Math.abs(Math.sin((i + 1) * 127.1));
}

/* ------------------------------------------------------------------ */
/*  Blinking caret                                                     */
/* ------------------------------------------------------------------ */

function Caret() {
  return (
    <motion.span
      aria-hidden
      className="mx-[1px] inline-block h-[17px] w-[2px] shrink-0 rounded-full"
      style={{ background: "linear-gradient(180deg,#a99dff,#5b8cff)" }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1.05, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  PhoneInput                                                         */
/* ------------------------------------------------------------------ */

export interface PhoneInputProps {
  /** Country list to choose from. */
  countries?: Country[];
  /** ISO code selected on first render (ignored when `autoplay` is set). */
  defaultCode?: string;
  /**
   * ISO codes the component cycles through on a loop, switching country and
   * typing that country's sample number. Hovering pauses the loop and hands
   * control back to the user; leaving resumes it.
   */
  autoplay?: string[];
  className?: string;
}

export function PhoneInput({
  countries = COUNTRIES,
  defaultCode = "US",
  autoplay,
  className,
}: PhoneInputProps) {
  const autoplayOn = Array.isArray(autoplay) && autoplay.length > 0;

  const [selectedIdx, setSelectedIdx] = useState<number>(() => {
    const code = autoplayOn ? autoplay![0] : defaultCode;
    const idx = countries.findIndex((c) => c.code === code);
    return idx < 0 ? 0 : idx;
  });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [digits, setDigits] = useState("");
  const [activeIdx, setActiveIdx] = useState<number>(selectedIdx);
  const [fieldFocused, setFieldFocused] = useState(false);
  const [interacting, setInteracting] = useState(false);

  const pausedRef = useRef(false);

  const selected = countries[selectedIdx] ?? countries[0];
  const cap = capacity(selected.format);
  const formatted = formatPhone(selected.format, digits);
  const placeholder = selected.format.replace(/#/g, "0");

  /* ---- autoplay loop ------------------------------------------------ */
  useEffect(() => {
    if (!autoplayOn) return;
    const codes = autoplay!;
    let cancelled = false;
    const timers: number[] = [];

    const wait = (ms: number) =>
      new Promise<void>((res) => {
        const t = window.setTimeout(res, ms);
        timers.push(t);
      });

    /* Hold here while the user is hovering / interacting. */
    const gate = async () => {
      while (!cancelled && pausedRef.current) await wait(180);
    };

    const findIdx = (code: string) => {
      const i = countries.findIndex((c) => c.code === code);
      return i < 0 ? 0 : i;
    };

    const typeDigits = async (sample: string) => {
      for (let k = 1; k <= sample.length; k++) {
        if (cancelled) return;
        setDigits(sample.slice(0, k));
        await wait(68 + Math.round(jitter(k) * 62));
      }
    };

    const typeQuery = async (text: string) => {
      for (let k = 1; k <= text.length; k++) {
        if (cancelled) return;
        setQuery(text.slice(0, k));
        await wait(56 + Math.round(jitter(k + 4) * 48));
      }
    };

    async function run() {
      let i = 0;
      while (!cancelled) {
        await gate();
        if (cancelled) return;

        const curIdx = findIdx(codes[i % codes.length]);
        const nextIdx = findIdx(codes[(i + 1) % codes.length]);

        setSelectedIdx(curIdx);
        setActiveIdx(curIdx);
        setOpen(false);
        setQuery("");
        setDigits("");
        await wait(280);

        await typeDigits(countries[curIdx].sample);
        if (cancelled) return;
        await wait(1500);

        await gate();
        if (cancelled) return;

        // Open the list and search for the next country.
        setOpen(true);
        setQuery("");
        setActiveIdx(nextIdx);
        await wait(420);

        const term = countries[nextIdx].name.slice(
          0,
          Math.min(5, countries[nextIdx].name.length)
        );
        await typeQuery(term);
        if (cancelled) return;
        setActiveIdx(nextIdx);
        await wait(700);

        // Commit the selection.
        setSelectedIdx(nextIdx);
        setActiveIdx(nextIdx);
        setOpen(false);
        setQuery("");
        setDigits("");
        await wait(520);

        i++;
      }
    }

    run();
    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplayOn, autoplay, countries]);

  /* ---- interactive handlers ---------------------------------------- */
  function toggleOpen() {
    setOpen((o) => {
      const next = !o;
      if (next) {
        setQuery("");
        setActiveIdx(selectedIdx);
      }
      return next;
    });
  }

  function selectCountry(i: number) {
    setSelectedIdx(i);
    setActiveIdx(i);
    setOpen(false);
    setQuery("");
  }

  function onNumberKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      setDigits((d) => (d.length >= cap ? d : d + e.key));
    }
  }

  const q = query.trim().toLowerCase();
  const filtered = countries
    .map((c, i) => ({ c, i }))
    .filter(
      ({ c }) =>
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q)
    );

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
      {/* Field ---------------------------------------------------------- */}
      <div
        className={cn(
          "relative flex items-stretch rounded-xl border bg-void/70 backdrop-blur transition-[border-color,box-shadow] duration-500",
          activeRing
            ? "border-brand/45 shadow-[0_0_0_1px_rgba(124,108,255,0.28),0_14px_40px_-16px_rgba(124,108,255,0.5)]"
            : "border-line shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
        )}
      >
        {/* Country selector */}
        <button
          type="button"
          onClick={toggleOpen}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Selected country ${selected.name} ${selected.dial}`}
          className="flex items-center gap-2 rounded-l-xl px-3 py-3 text-left transition-colors hover:bg-white/[0.03]"
        >
          <Flag kind={selected.flag} />
          <span className="text-sm font-medium tabular-nums text-white/85">
            {selected.dial}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/40"
          >
            <ChevronDown size={15} />
          </motion.span>
        </button>

        <div className="my-2 w-px bg-line" />

        {/* Number */}
        <div
          role="textbox"
          aria-label="Phone number"
          tabIndex={0}
          onKeyDown={onNumberKeyDown}
          onFocus={() => setFieldFocused(true)}
          onBlur={() => setFieldFocused(false)}
          className="flex min-w-0 flex-1 cursor-text items-center px-3 outline-none"
        >
          {digits.length === 0 ? (
            <div className="flex min-w-0 items-center">
              {showCaret && <Caret />}
              <span className="truncate text-[15px] tabular-nums tracking-[0.02em] text-white/25">
                {placeholder}
              </span>
            </div>
          ) : (
            <div className="flex min-w-0 items-center">
              <span className="truncate text-[15px] tabular-nums tracking-[0.03em] text-white">
                {formatted}
              </span>
              {showCaret && <Caret />}
            </div>
          )}
        </div>
      </div>

      {/* Dropdown ------------------------------------------------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.985 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full z-30 mt-2 origin-top overflow-hidden rounded-xl border border-line bg-panel/95 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
              <Search size={14} className="shrink-0 text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search countries"
                spellCheck={false}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              />
            </div>

            <div role="listbox" className="no-scrollbar max-h-[188px] overflow-y-auto py-1.5">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-white/40">
                  No countries match that search.
                </div>
              ) : (
                filtered.map(({ c, i }) => {
                  const isSel = i === selectedIdx;
                  const isActive = i === activeIdx;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      role="option"
                      aria-selected={isSel}
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => selectCountry(i)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                        isActive ? "bg-brand/12" : "hover:bg-white/[0.03]"
                      )}
                    >
                      <Flag kind={c.flag} />
                      <span className="flex-1 truncate text-sm text-white/85">
                        {c.name}
                      </span>
                      <span className="tabular-nums text-sm text-white/40">
                        {c.dial}
                      </span>
                      {isSel && <Check size={14} className="shrink-0 text-brand-soft" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo                                                               */
/* ------------------------------------------------------------------ */

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#050508] p-6">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[460px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(124,108,255,0.16), rgba(91,140,255,0.05) 42%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-panel/80 p-6 backdrop-blur-xl"
        style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.9)" }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-brand/15 text-brand-soft">
            <Phone size={17} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">Add your phone</h3>
            <p className="text-xs text-zinc-500">
              We&apos;ll text a code to confirm it&apos;s really you.
            </p>
          </div>
        </div>

        <label className="mb-2 block text-xs font-medium text-zinc-400">
          Phone number
        </label>
        <PhoneInput autoplay={LOOP} />

        <button
          type="button"
          className="mt-4 w-full rounded-xl border border-white/10 bg-gradient-to-b from-brand to-[#6656e6] py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(124,108,255,0.7)] transition-colors hover:from-[#8a7bff] hover:to-brand"
        >
          Send verification code
        </button>

        <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck size={12} className="text-zinc-500" />
          Standard carrier rates may apply. Never shared.
        </div>
      </motion.div>
    </div>
  );
}
