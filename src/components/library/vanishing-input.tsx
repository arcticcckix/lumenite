"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Deterministic pseudo-random in [0, 1), seeded so nothing that runs during
 * render/SSR depends on Math.random (no hydration mismatch). Only ever called
 * inside event handlers / effects below.
 */
function seed(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface Ember {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  size: number;
  life: number;
  decay: number;
  baseAlpha: number;
}

export interface VanishingInputProps {
  placeholders?: string[];
  onSubmit?: (value: string) => void;
  rotateInterval?: number;
  className?: string;
}

export function VanishingInput({
  placeholders = ["Type something…"],
  onSubmit,
  rotateInterval = 2600,
  className,
}: VanishingInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const embersRef = useRef<Ember[]>([]);
  const rafRef = useRef<number>(0);
  const animatingRef = useRef(false);

  const [value, setValue] = useState("");
  const [index, setIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const [vanishing, setVanishing] = useState(false);

  // Rotate the placeholder while the field is empty, keeps it alive at rest.
  useEffect(() => {
    if (value.length > 0 || placeholders.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((p) => (p + 1) % placeholders.length);
    }, rotateInterval);
    return () => window.clearInterval(id);
  }, [value.length, placeholders.length, rotateInterval]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const runVanish = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      let sweep = 0;
      let frames = 0;
      const sweepSpeed = Math.max(9, Math.round(w / 34));

      const tick = () => {
        frames += 1;
        sweep += sweepSpeed;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";

        const embers = embersRef.current;
        let alive = 0;

        for (let i = 0; i < embers.length; i++) {
          const p = embers[i];
          if (p.ox <= sweep) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02;
            p.vx *= 0.985;
            p.x += Math.sin((frames + p.ox) * 0.08) * 0.18;
            p.life -= p.decay;
          }
          if (p.life <= 0) continue;
          alive += 1;
          const a = p.life * p.baseAlpha;
          ctx.globalAlpha = a > 1 ? 1 : a;
          ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";

        if (alive > 0 && frames < 260) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          ctx.clearRect(0, 0, w, h);
          animatingRef.current = false;
          setVanishing(false);
        }
      };

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    },
    []
  );

  const vanish = useCallback(() => {
    const container = containerRef.current;
    const input = inputRef.current;
    const canvas = canvasRef.current;
    const text = value.trim();
    if (!container || !input || !canvas || text.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cRect = container.getBoundingClientRect();
    const iRect = input.getBoundingClientRect();
    const w = Math.max(1, Math.round(cRect.width));
    const h = Math.max(1, Math.round(cRect.height));
    canvas.width = w;
    canvas.height = h;

    const cs = window.getComputedStyle(input);
    ctx.clearRect(0, 0, w, h);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ctx.textBaseline = "middle";
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "#cdc6ff");
    grad.addColorStop(0.5, "#7c6cff");
    grad.addColorStop(1, "#5b8cff");
    ctx.fillStyle = grad;

    const padL = parseFloat(cs.paddingLeft || "0");
    const textX = iRect.left - cRect.left + padL;
    const textY = iRect.top - cRect.top + iRect.height / 2;
    ctx.fillText(value, textX, textY);

    const data = ctx.getImageData(0, 0, w, h).data;
    const embers: Ember[] = [];
    const step = 3;
    let n = 0;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = (y * w + x) * 4;
        const alpha = data[idx + 3];
        if (alpha > 90) {
          const s1 = seed(n * 2 + 1);
          const s2 = seed(n * 2 + 3);
          const s3 = seed(n + 7);
          embers.push({
            ox: x,
            oy: y,
            x,
            y,
            vx: (s1 - 0.35) * 1.4 + 0.25,
            vy: -(0.5 + s2 * 1.35),
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2],
            size: 1 + s3 * 1.7,
            life: 1,
            decay: 0.018 + s1 * 0.022,
            baseAlpha: alpha / 255,
          });
          n += 1;
        }
      }
    }

    if (embers.length === 0) return;
    embersRef.current = embers;
    animatingRef.current = true;
    setVanishing(true);
    onSubmit?.(value);
    setValue("");
    runVanish(ctx, w, h);
  }, [value, onSubmit, runVanish]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (animatingRef.current || value.trim().length === 0) return;
      vanish();
    },
    [value, vanish]
  );

  const empty = value.length === 0;
  const disabled = value.trim().length === 0;

  return (
    <div ref={containerRef} className={cn("relative w-full px-1 py-12", className)}>
      {/* ember canvas, sits above the field, headroom above lets sparks rise out */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 h-full w-full"
      />

      <div className="relative">
        {/* breathing glow, alive even in a static frame */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-4 rounded-[1.75rem] blur-2xl"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(124,108,255,0.32), rgba(91,140,255,0.10) 58%, transparent 100%)",
          }}
          animate={{ opacity: [0.45, 0.8, 0.45], scale: [0.985, 1.02, 0.985] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <form
          onSubmit={handleSubmit}
          className={cn(
            "relative z-10 flex h-14 items-center gap-2 rounded-2xl border bg-panel pl-4 pr-2 backdrop-blur transition-[border-color,box-shadow] duration-300",
            focused
              ? "border-brand/50 shadow-[0_0_0_1px_rgba(124,108,255,0.35),0_10px_34px_-10px_rgba(124,108,255,0.5)]"
              : "border-line"
          )}
        >
          <Sparkles
            aria-hidden
            className={cn(
              "h-4 w-4 shrink-0 transition-colors duration-300",
              focused ? "text-brand-soft" : "text-zinc-500"
            )}
          />

          <div className="relative h-full flex-1">
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="Prompt"
              spellCheck={false}
              autoComplete="off"
              className="absolute inset-0 h-full w-full bg-transparent text-[15px] text-white caret-brand-soft outline-none"
            />
            {/* animated rotating placeholder (hidden while typing or vanishing) */}
            {empty && !vanishing && (
              <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={index}
                    initial={{ y: "62%", opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-62%", opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="block truncate text-[15px] text-zinc-500"
                  >
                    {placeholders[index]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={disabled}
            aria-label="Submit"
            whileHover={{ scale: disabled ? 1 : 1.06 }}
            whileTap={{ scale: disabled ? 1 : 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition-[opacity,background-color] duration-300",
              disabled
                ? "bg-white/10 text-zinc-500"
                : "bg-brand shadow-[0_0_22px_-2px_rgba(124,108,255,0.65)] hover:bg-brand-soft"
            )}
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

export default function Demo() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#050508] px-6">
      <div className="text-center">
        <h3 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
          What should we build?
        </h3>
        <p className="mt-1.5 text-sm text-zinc-500">
          Type a prompt, hit enter, watch it scatter into light.
        </p>
      </div>

      <VanishingInput
        className="max-w-md"
        onSubmit={setLast}
        placeholders={[
          "Summarize the Q3 revenue report…",
          "Draft a launch email for the new API…",
          "What changed in the latest deploy?",
          "Generate 5 taglines for a peptide brand…",
          "Explain vector embeddings like I'm five…",
        ]}
      />

      <div className="flex h-5 items-center gap-2 text-xs text-zinc-600">
        <AnimatePresence mode="wait">
          {last ? (
            <motion.span
              key={last}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="text-zinc-400"
            >
              Sent · <span className="text-brand-soft">&ldquo;{last}&rdquo;</span>
            </motion.span>
          ) : (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              Press
              <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                Enter
              </kbd>
              to send
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
