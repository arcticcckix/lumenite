"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";

type Hsv = { h: number; s: number; v: number };
type Rgb = { r: number; g: number; b: number };

const EASE = [0.16, 1, 0.3, 1] as const;

const DEFAULT_PRESETS = [
  "#7C6CFF",
  "#5B8CFF",
  "#2DD4BF",
  "#34D399",
  "#F5B544",
  "#F2734F",
  "#F472B6",
];

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

// round to 1 decimal for values written into DOM styles
const r1 = (n: number) => Math.round(n * 10) / 10;

function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const sn = s / 100;
  const vn = v / 100;
  const c = vn * sn;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = vn - c;
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const to = (n: number) => clamp(n, 0, 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

function hexToHsv(hex: string): Hsv {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : (d / max) * 100, v: max * 100 };
}

// perceptual-ish distance so swatches light up as the loop crosses them
function hsvDistance(a: Hsv, b: Hsv): number {
  let dh = Math.abs(a.h - b.h);
  dh = Math.min(dh, 360 - dh) / 180;
  const ds = Math.abs(a.s - b.s) / 100;
  const dv = Math.abs(a.v - b.v) / 100;
  return dh * dh + ds * ds * 0.5 + dv * dv * 0.5;
}

export function ColorPicker({
  presets = DEFAULT_PRESETS,
  defaultColor = "#7C6CFF",
  autoCycle = true,
  onChange,
  className,
}: {
  presets?: string[];
  defaultColor?: string;
  autoCycle?: boolean;
  onChange?: (hex: string) => void;
  className?: string;
}) {
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(defaultColor));
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  const hsvRef = useRef<Hsv>(hsv);
  hsvRef.current = hsv;

  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragCleanup = useRef<(() => void) | null>(null);

  const presetHsv = useMemo(() => presets.map(hexToHsv), [presets]);

  const rgb = hsvToRgb(hsv);
  const hex = rgbToHex(rgb);
  const hueColor = `hsl(${Math.round(hsv.h)}, 100%, 50%)`;

  const activeIdx = useMemo(() => {
    let best = -1;
    let bestD = Infinity;
    for (let i = 0; i < presetHsv.length; i++) {
      const d = hsvDistance(presetHsv[i], hsv);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return bestD < 0.02 ? best : -1;
  }, [presetHsv, hsv]);

  // idle loop: ease through the preset colors so the picker looks alive
  useEffect(() => {
    if (!autoCycle || paused || presetHsv.length < 2) return;

    const TRANSITION = 2200;
    const DWELL = 900;
    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const lerpHue = (a: number, b: number, t: number) => {
      let dd = b - a;
      if (dd > 180) dd -= 360;
      if (dd < -180) dd += 360;
      return ((a + dd * t) % 360 + 360) % 360;
    };

    let from: Hsv = { ...hsvRef.current };
    let nearest = 0;
    let nd = Infinity;
    for (let i = 0; i < presetHsv.length; i++) {
      const d = hsvDistance(presetHsv[i], from);
      if (d < nd) {
        nd = d;
        nearest = i;
      }
    }
    let toIdx = nd < 0.01 ? (nearest + 1) % presetHsv.length : nearest;

    let raf = 0;
    let prev = 0;
    let phase = 0;
    let dwell = 0;

    const step = (t: number) => {
      if (prev === 0) prev = t;
      const dt = t - prev;
      prev = t;

      if (dwell > 0) {
        dwell -= dt;
      } else {
        phase += dt / TRANSITION;
        if (phase >= 1) {
          phase = 0;
          from = { ...presetHsv[toIdx] };
          toIdx = (toIdx + 1) % presetHsv.length;
          dwell = DWELL;
          setHsv(from);
        } else {
          const e = easeInOut(phase);
          const target = presetHsv[toIdx];
          setHsv({
            h: lerpHue(from.h, target.h, e),
            s: from.s + (target.s - from.s) * e,
            v: from.v + (target.v - from.v) * e,
          });
        }
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [autoCycle, paused, presetHsv]);

  useEffect(() => {
    onChange?.(hex);
  }, [hex, onChange]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      dragCleanup.current?.();
    };
  }, []);

  function beginInteract() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setPaused(true);
  }
  function endInteract() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 2800);
  }

  function trackDrag(
    el: HTMLElement | null,
    read: (x: number, y: number, rect: DOMRect) => void,
    e: React.PointerEvent
  ) {
    if (!el) return;
    e.preventDefault();
    beginInteract();
    dragCleanup.current?.();
    const apply = (cx: number, cy: number) => {
      const rect = el.getBoundingClientRect();
      read(cx, cy, rect);
    };
    apply(e.clientX, e.clientY);
    const move = (ev: PointerEvent) => apply(ev.clientX, ev.clientY);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      dragCleanup.current = null;
      endInteract();
    };
    dragCleanup.current = up;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  function onSvDown(e: React.PointerEvent) {
    trackDrag(
      svRef.current,
      (cx, cy, rect) => {
        const s = clamp(((cx - rect.left) / rect.width) * 100, 0, 100);
        const v = clamp((1 - (cy - rect.top) / rect.height) * 100, 0, 100);
        setHsv((c) => ({ h: c.h, s, v }));
      },
      e
    );
  }

  function onHueDown(e: React.PointerEvent) {
    trackDrag(
      hueRef.current,
      (cx, _cy, rect) => {
        const h = clamp(((cx - rect.left) / rect.width) * 360, 0, 360);
        setHsv((c) => ({ h, s: c.s, v: c.v }));
      },
      e
    );
  }

  function selectPreset(hexValue: string) {
    beginInteract();
    setHsv(hexToHsv(hexValue));
    endInteract();
  }

  function copyHex() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(hex).catch(() => {});
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1400);
  }

  const svBackground = `linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, ${hueColor})`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn(
        "relative w-[300px] select-none rounded-2xl border border-white/10 bg-panel p-4",
        "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      {/* living tint that follows the current color */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
        style={{
          background: `radial-gradient(120% 80% at 50% -10%, ${hex}1f, rgba(0,0,0,0) 60%)`,
        }}
      />

      <div className="relative">
        {/* header: preview chip + readout */}
        <div className="mb-4 flex items-center gap-3">
          <motion.div
            className="relative h-11 w-11 shrink-0 rounded-xl border border-white/15"
            animate={{ backgroundColor: hex }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ boxShadow: `0 0 22px -2px ${hex}, inset 0 0 0 1px rgba(255,255,255,0.06)` }}
          />
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
              <Pipette className="h-3 w-3" strokeWidth={2} />
              Accent color
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[15px] font-semibold tracking-tight text-white">
                {hex}
              </span>
              <span className="truncate font-mono text-[11px] text-zinc-500">
                {rgb.r} {rgb.g} {rgb.b}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={copyHex}
            aria-label="Copy hex value"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" strokeWidth={2.5} />
            ) : (
              <Copy className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* saturation / value square */}
        <div
          ref={svRef}
          onPointerDown={onSvDown}
          className="relative h-[158px] w-full cursor-crosshair touch-none overflow-hidden rounded-xl border border-white/10"
          style={{ background: svBackground }}
        >
          <div
            className="pointer-events-none absolute"
            style={{ left: `${r1(hsv.s)}%`, top: `${r1(100 - hsv.v)}%` }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <motion.span
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: hex, width: 26, height: 26 }}
                animate={{ opacity: [0.35, 0.12, 0.35], scale: [1, 1.5, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <div
                className="relative rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                style={{ backgroundColor: hex, width: 16, height: 16 }}
              />
            </div>
          </div>
        </div>

        {/* hue slider */}
        <div
          ref={hueRef}
          onPointerDown={onHueDown}
          className="relative mt-4 h-3 w-full cursor-pointer touch-none rounded-full"
          style={{
            background:
              "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
            style={{ left: `${r1((hsv.h / 360) * 100)}%`, backgroundColor: hueColor }}
          />
        </div>

        {/* preset swatches */}
        <div className="mt-4 flex items-center justify-between">
          {presets.map((preset, i) => {
            const active = i === activeIdx;
            return (
              <motion.button
                key={preset}
                type="button"
                onClick={() => selectPreset(preset)}
                aria-label={`Use ${preset}`}
                className="relative h-7 w-7 rounded-full border border-white/10"
                style={{ backgroundColor: preset }}
                animate={{ scale: active ? 1.16 : 1 }}
                whileHover={{ scale: 1.16 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
              >
                {active && (
                  <motion.span
                    layoutId="preset-ring"
                    className="absolute -inset-[3px] rounded-full ring-2 ring-white/80"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <ColorPicker />
    </div>
  );
}
