"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Binary } from "lucide-react";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/<>[]{}=+*#%";

// Deterministic 2D hash in [0,1). No Math.random / Date.now, so it is SSR safe.
function noise(a: number, b: number) {
  const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

type CellState = "locked" | "scramble" | "glitch";
type Cell = { ch: string; state: CellState };

export function ScrambleText({
  text,
  className,
  scrambleSpeed = 40,
  revealDelay = 3,
  loop = false,
  loopDelay = 4200,
  idle = true,
  caret = true,
}: {
  text: string;
  className?: string;
  /** Milliseconds per animation frame. */
  scrambleSpeed?: number;
  /** Frames each character stays scrambled before it locks in. */
  revealDelay?: number;
  /** Automatically re-run the decode on a timer. */
  loop?: boolean;
  /** Milliseconds to rest before an auto re-decode when `loop` is on. */
  loopDelay?: number;
  /** Keep a few settled characters flickering at rest so it never looks dead. */
  idle?: boolean;
  /** Show a blinking terminal caret. */
  caret?: boolean;
}) {
  const initial = useMemo<Cell[]>(
    () => text.split("").map((ch) => ({ ch, state: "locked" as const })),
    [text]
  );
  const [cells, setCells] = useState<Cell[]>(initial);

  // Per-character lock time (in frames), left-to-right with a little organic jitter.
  const lockAt = useMemo(() => {
    return text.split("").map((ch, i) =>
      ch === " " ? 0 : i * revealDelay + Math.round(noise(i, 1) * 5)
    );
  }, [text, revealDelay]);

  const maxLock = useMemo(
    () => lockAt.reduce((m, v) => Math.max(m, v), 0),
    [lockAt]
  );

  // Bumped on hover; the animation loop watches it to re-run a decode on demand.
  const triggerRef = useRef(0);

  useEffect(() => {
    setCells(initial);

    let raf = 0;
    let last = 0;
    let tick = 0;
    let mode: "decode" | "rest" = "decode";
    let decodeStart = 0;
    let restStart = 0;
    let seenTrigger = triggerRef.current;
    let sig = "";

    const glyph = (i: number, t: number) =>
      CHARS[Math.floor(noise(i * 2.3 + 5, t) * CHARS.length)];

    const chars = text.split("");
    const loopFrames = Math.max(1, Math.round(loopDelay / scrambleSpeed));

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (t - last < scrambleSpeed) return;
      last = t;
      tick += 1;

      // A hover since the last frame forces a fresh decode from the top.
      if (triggerRef.current !== seenTrigger) {
        seenTrigger = triggerRef.current;
        mode = "decode";
        decodeStart = tick;
      }

      const next: Cell[] = new Array(chars.length);

      if (mode === "decode") {
        const elapsed = tick - decodeStart;
        for (let i = 0; i < chars.length; i++) {
          const ch = chars[i];
          if (ch === " ") {
            next[i] = { ch: " ", state: "locked" };
          } else if (elapsed >= lockAt[i]) {
            next[i] = { ch, state: "locked" };
          } else {
            next[i] = { ch: glyph(i, tick), state: "scramble" };
          }
        }
        if (elapsed > maxLock + 1) {
          mode = "rest";
          restStart = tick;
        }
      } else {
        // Resting: settled text with sparse, deterministic flicker.
        const phase = Math.floor(tick / 2);
        for (let i = 0; i < chars.length; i++) {
          const ch = chars[i];
          if (idle && ch !== " " && noise(i * 7.7 + 3, phase) > 0.9) {
            next[i] = { ch: glyph(i, tick), state: "glitch" };
          } else {
            next[i] = { ch, state: "locked" };
          }
        }
        if (loop && tick - restStart >= loopFrames) {
          mode = "decode";
          decodeStart = tick;
        }
      }

      // Only commit when something actually changed.
      let nextSig = "";
      for (let i = 0; i < next.length; i++) nextSig += next[i].ch + next[i].state[0];
      if (nextSig !== sig) {
        sig = nextSig;
        setCells(next);
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [text, scrambleSpeed, lockAt, maxLock, loop, loopDelay, idle, initial]);

  return (
    <span
      role="text"
      aria-label={text}
      onMouseEnter={() => {
        triggerRef.current += 1;
      }}
      className={cn(
        "inline-flex cursor-default items-center whitespace-pre font-mono tabular-nums",
        className
      )}
    >
      <span aria-hidden className="whitespace-pre">
        {cells.map((c, i) => (
          <span
            key={i}
            className={
              c.state === "scramble"
                ? "text-glow"
                : c.state === "glitch"
                  ? "text-brand"
                  : undefined
            }
            style={
              c.state === "scramble"
                ? { textShadow: "0 0 12px rgba(91,140,255,0.45)" }
                : c.state === "glitch"
                  ? { textShadow: "0 0 10px rgba(124,108,255,0.5)" }
                  : undefined
            }
          >
            {c.ch}
          </span>
        ))}
      </span>
      {caret && (
        <motion.span
          aria-hidden
          className="ml-[0.12em] inline-block w-[0.5ch] self-stretch rounded-[1px] bg-brand-soft"
          style={{ minHeight: "1em" }}
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1.05, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" }}
        />
      )}
    </span>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-6">
      {/* Ambient glow, kept restrained. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(124,108,255,0.14), transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-panel/80 p-6 backdrop-blur-sm"
      >
        {/* Thin bright top edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,108,255,0.55), transparent)" }}
        />
        {/* Slow scanline so the panel breathes at rest. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(91,140,255,0.35), transparent)" }}
          animate={{ top: ["6%", "94%", "6%"], opacity: [0, 0.9, 0] }}
          transition={{ duration: 7.5, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-brand/10 text-brand-soft">
              <Binary size={14} strokeWidth={2} />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              Decoder
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-brand"
              animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              Live
            </span>
          </div>
        </div>

        {/* Headline that continuously re-decodes. */}
        <ScrambleText
          text="SIGNAL ACQUIRED"
          loop
          loopDelay={4600}
          className="text-3xl font-semibold tracking-tight text-white"
        />

        {/* Secondary cipher line, faster loop, offset rhythm. */}
        <div className="mt-3">
          <ScrambleText
            text="0x7F3A 9C21 E4B8 0D6E"
            loop
            loopDelay={3200}
            scrambleSpeed={32}
            caret={false}
            className="text-sm tracking-[0.05em] text-zinc-500"
          />
        </div>

        <p className="mt-6 text-sm leading-relaxed text-zinc-400">
          Hover the headline to re-run the decode. At rest it keeps a faint flicker,
          so the panel never reads as static.
        </p>

        {/* Meta footer */}
        <div className="mt-6 flex items-center gap-4 border-t border-white/5 pt-4 font-mono text-[11px] text-zinc-600">
          <span>
            cipher <span className="text-zinc-400">aes-256</span>
          </span>
          <span>
            latency <span className="text-zinc-400">12ms</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
