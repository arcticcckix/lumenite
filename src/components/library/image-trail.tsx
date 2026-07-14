"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useAnimationFrame,
} from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

// A single tile left behind along the path. Spawned on movement, it blooms to
// full size then dissolves and shrinks, so the trail reads as a soft ribbon of
// light chasing the pointer.
interface Tile {
  id: number;
  x: number;
  y: number;
  size: number;
  rot: number;
  c1: string;
  c2: string;
}

// Cool, coherent gradient pairs kept in the brand + glow family so the trail
// never turns into confetti. One faint cyan for restrained variation.
const GRADIENTS: ReadonlyArray<readonly [string, string]> = [
  ["#7c6cff", "#5b8cff"],
  ["#5b8cff", "#8ab4ff"],
  ["#9a7cff", "#6c8cff"],
  ["#5f7cff", "#4fd1c5"],
  ["#8b6cff", "#5b8cff"],
];

// Deterministic pseudo-random in [0,1) from an integer index. No Math.random,
// so nothing depends on wall-clock or render order.
function seeded(i: number): number {
  const v = Math.sin(i * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}

const MAX_TILES = 26;
const STEP = 16; // px between spawned tiles along the path
const LIFE = 1.05; // seconds each tile lives

export function ImageTrail({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  const [tiles, setTiles] = useState<Tile[]>([]);

  // Mutable driving state kept in refs so the animation loop reads fresh
  // values without re-subscribing.
  const idRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(false);
  const lastMoveRef = useRef(0);
  const lastSpawnRef = useRef<{ x: number; y: number } | null>(null);

  // Head glow that rides the front of the trail, smoothed with a spring.
  const headX = useMotionValue(0);
  const headY = useMotionValue(0);
  const glowX = useSpring(headX, { stiffness: 520, damping: 42, mass: 0.5 });
  const glowY = useSpring(headY, { stiffness: 520, damping: 42, mass: 0.5 });
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => {
      sizeRef.current = { w: el.clientWidth, h: el.clientHeight };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function spawn(x: number, y: number) {
    const id = idRef.current++;
    const r1 = seeded(id);
    const r2 = seeded(id + 101);
    const size = Math.round(40 + r1 * 26); // 40 - 66px
    const rot = Math.round((r2 * 36 - 18) * 10) / 10; // -18 - 18deg
    const g = GRADIENTS[id % GRADIENTS.length];
    const tile: Tile = {
      id,
      x: Math.round(x),
      y: Math.round(y),
      size,
      rot,
      c1: g[0],
      c2: g[1],
    };
    setTiles((prev) => {
      const next = prev.concat(tile);
      return next.length > MAX_TILES ? next.slice(next.length - MAX_TILES) : next;
    });
  }

  useAnimationFrame((t) => {
    const { w, h } = sizeRef.current;
    if (!w || !h) return;

    const s = t / 1000;
    const active = activeRef.current && t - lastMoveRef.current < 480;

    let px: number;
    let py: number;
    if (active) {
      px = targetRef.current.x;
      py = targetRef.current.y;
    } else {
      // Seeded Lissajous-style wander that keeps the panel alive at rest.
      px =
        w * 0.5 +
        Math.sin(s * 0.62) * w * 0.3 +
        Math.sin(s * 1.63 + 1.3) * w * 0.09;
      py =
        h * 0.5 +
        Math.sin(s * 0.85 + 2.1) * h * 0.28 +
        Math.cos(s * 1.27) * h * 0.08;
    }

    headX.set(Math.round(px));
    headY.set(Math.round(py));
    if (!awake) setAwake(true);

    const last = lastSpawnRef.current ?? { x: px, y: py };
    let dx = px - last.x;
    let dy = py - last.y;
    let dist = Math.hypot(dx, dy);

    if (dist >= STEP) {
      const ux = dx / dist;
      const uy = dy / dist;
      let cx = last.x;
      let cy = last.y;
      let count = 0;
      // Fill the segment with evenly spaced tiles, capped so a fast flick
      // never dumps a giant burst in one frame.
      while (dist >= STEP && count < 4) {
        cx += ux * STEP;
        cy += uy * STEP;
        dist -= STEP;
        spawn(cx, cy);
        count += 1;
      }
      lastSpawnRef.current = { x: cx, y: cy };
    } else if (lastSpawnRef.current === null) {
      lastSpawnRef.current = { x: px, y: py };
    }
  });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    activeRef.current = true;
    lastMoveRef.current = performance.now();
  }

  return (
    <div
      ref={rootRef}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        activeRef.current = false;
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#101018]",
        className
      )}
      style={{
        backgroundImage:
          "radial-gradient(120% 90% at 50% 0%, rgba(124,108,255,0.10), transparent 55%), radial-gradient(90% 90% at 100% 100%, rgba(91,140,255,0.08), transparent 60%)",
      }}
    >
      {/* Faint dotted field for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* The trail itself */}
      <div className="pointer-events-none absolute inset-0">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className="absolute"
            style={{
              left: Math.round(tile.x - tile.size / 2),
              top: Math.round(tile.y - tile.size / 2),
              width: tile.size,
              height: tile.size,
            }}
          >
            <motion.div
              className="h-full w-full rounded-[14px] border border-white/15"
              style={{
                background: `linear-gradient(135deg, ${tile.c1}, ${tile.c2})`,
                boxShadow: `0 8px 26px -10px ${tile.c1}, inset 0 1px 0 rgba(255,255,255,0.28)`,
                willChange: "transform, opacity",
              }}
              initial={{ opacity: 0, scale: 0.5, rotate: tile.rot }}
              animate={{
                opacity: [0, 0.85, 0],
                scale: [0.5, 1, 0.82],
                rotate: [tile.rot, tile.rot, tile.rot + 4],
              }}
              transition={{
                duration: LIFE,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.2, 1],
              }}
              onAnimationComplete={() =>
                setTiles((prev) => prev.filter((p) => p.id !== tile.id))
              }
            />
          </div>
        ))}
      </div>

      {/* Head glow riding the front of the trail */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-10"
        style={{ x: glowX, y: glowY }}
        animate={{ opacity: awake ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 150,
            height: 150,
            background:
              "radial-gradient(circle, rgba(124,108,255,0.28), transparent 65%)",
            filter: "blur(4px)",
          }}
        />
        <div
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{
            width: 8,
            height: 8,
            boxShadow: "0 0 14px 3px rgba(124,108,255,0.9)",
          }}
        />
      </motion.div>

      {children}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <ImageTrail className="h-[400px] w-full max-w-2xl">
        {/* Overlay copy sits above the trail but never intercepts the pointer */}
        <div className="pointer-events-none relative z-20 flex h-full flex-col justify-between p-7">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
              Cursor field
            </span>
            <h3 className="mt-3 max-w-sm text-2xl font-semibold leading-tight text-white">
              Every movement leaves a trace
            </h3>
            <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-white/45">
              Drift across the panel and tiles bloom along your path, then
              dissolve. Leave it be and it keeps drawing its own.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-white/40">
            <MousePointer2 className="h-3.5 w-3.5 text-[#7c6cff]" />
            <span>Move your cursor across the surface</span>
          </div>
        </div>
      </ImageTrail>
    </div>
  );
}
