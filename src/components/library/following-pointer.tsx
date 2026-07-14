"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Collaborator = { name: string; color: string };

const DEFAULT_COLLABORATORS: Collaborator[] = [
  { name: "Maya Rodriguez", color: "#5b8cff" },
  { name: "Devin Park", color: "#2bb3a3" },
  { name: "Iris Kaan", color: "#d1568a" },
];

// Pick black or white text for a given pill color so labels stay readable.
function readableText(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.62 ? "#0b0b12" : "#ffffff";
}

// The visual: a crisp pointer arrow plus a colored name pill. Reused by
// both the ambient collaborator cursors and the viewer's own cursor.
function CursorTag({ name, color }: Collaborator) {
  return (
    <div className="flex -translate-x-1 -translate-y-0.5 items-center gap-1.5">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        style={{ filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.5)) drop-shadow(0 0 9px ${color}55)` }}
      >
        <path
          d="M5 3L5 19.4L9.2 15.3L11.7 20.7L14.3 19.5L11.8 14.1L18 13.9Z"
          fill={color}
          stroke="#ffffff"
          strokeOpacity="0.9"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="whitespace-nowrap rounded-full px-2 py-[3px] text-[11px] font-semibold leading-none"
        style={{
          backgroundColor: color,
          color: readableText(color),
          boxShadow: `0 8px 20px -8px ${color}, inset 0 0 0 1px rgba(255,255,255,0.18)`,
        }}
      >
        {name}
      </span>
    </div>
  );
}

// One collaborator cursor that drifts forever along a smooth, deterministic
// Lissajous path derived from its index. No randomness, no timers.
function AmbientCursor({
  sizeRef,
  index,
  collaborator,
  dimmed,
}: {
  sizeRef: React.RefObject<{ w: number; h: number }>;
  index: number;
  collaborator: Collaborator;
  dimmed: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [ready, setReady] = useState(false);

  const p = useMemo(() => {
    const seed = (n: number) => {
      const v = Math.sin((index + 1) * n) * 43758.5453;
      return Math.abs(v - Math.floor(v));
    };
    return {
      speed: 0.00024 + seed(12.9898) * 0.00015,
      ratio: 1.3 + seed(78.233) * 0.9,
      phaseX: seed(37.719) * Math.PI * 2,
      phaseY: seed(9.174) * Math.PI * 2,
      ampX: 0.55 + seed(4.517) * 0.28,
      ampY: 0.5 + seed(6.311) * 0.3,
    };
  }, [index]);

  useAnimationFrame((t) => {
    const { w, h } = sizeRef.current;
    if (!w || !h) return;
    const pad = 48;
    const rx = Math.max(0, w / 2 - pad);
    const ry = Math.max(0, h / 2 - pad);
    const nx = w / 2 + Math.sin(t * p.speed + p.phaseX) * rx * p.ampX;
    const ny = h / 2 + Math.sin(t * p.speed * p.ratio + p.phaseY) * ry * p.ampY;
    x.set(Math.round(nx));
    y.set(Math.round(ny));
    if (!ready) setReady(true);
  });

  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-20"
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? (dimmed ? 0.4 : 1) : 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <CursorTag {...collaborator} />
    </motion.div>
  );
}

export function FollowingPointer({
  name = "You",
  color = "#7c6cff",
  children,
  className,
  collaborators = DEFAULT_COLLABORATORS,
}: {
  name?: string;
  color?: string;
  children: React.ReactNode;
  className?: string;
  collaborators?: Collaborator[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 520, damping: 42, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 520, damping: 42, mass: 0.4 });

  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${springX}px ${springY}px, rgba(124,108,255,0.12), transparent 70%)`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      sizeRef.current = { w: el.clientWidth, h: el.clientHeight };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(Math.round(e.clientX - rect.left));
    y.set(Math.round(e.clientY - rect.top));
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn(
        "group relative cursor-none overflow-hidden rounded-2xl border border-line bg-panel",
        className
      )}
    >
      {/* Slow breathing brand glow, always alive */}
      <motion.div
        className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,108,255,0.16), transparent 70%)" }}
        animate={{ opacity: [0.45, 0.8, 0.45], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Faint dotted canvas */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* Spotlight follows the real cursor on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ background: spotlight, opacity: visible ? 1 : 0 }}
      />

      {children}

      {/* Idle collaborators drifting over the surface */}
      {collaborators.map((c, i) => (
        <AmbientCursor
          key={c.name}
          index={i}
          collaborator={c}
          sizeRef={sizeRef}
          dimmed={visible}
        />
      ))}

      {/* Hint that fades once you take control */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center"
        animate={{ opacity: visible ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/45 backdrop-blur-sm">
          Move your cursor to join the room
        </span>
      </motion.div>

      {/* The viewer's own cursor */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-30"
        style={{ x: springX, y: springY }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.7 }}
        transition={{ duration: 0.15 }}
      >
        <CursorTag name={name} color={color} />
      </motion.div>
    </div>
  );
}

export default function Demo() {
  const collaborators = DEFAULT_COLLABORATORS;

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <FollowingPointer
        name="You"
        color="#7c6cff"
        collaborators={collaborators}
        className="h-[340px] w-full max-w-lg"
      >
        <div className="pointer-events-none relative z-10 flex h-full flex-col p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[13px] font-medium text-white/90">
                Q3 launch canvas
              </div>
              <div className="mt-0.5 text-[11px] text-white/35">
                Shared workspace · updated just now
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <Users className="h-3 w-3 text-white/45" />
              <span className="text-[11px] font-medium text-white/70">
                {collaborators.length + 1} live
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"
                style={
                  i === 1
                    ? { boxShadow: `inset 0 0 0 1px ${collaborators[0].color}55` }
                    : undefined
                }
              >
                <div className="h-1.5 w-8 rounded-full bg-white/20" />
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-white/[0.08]" />
                <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-white/[0.08]" />
              </div>
            ))}
          </div>

          <div className="mt-auto space-y-2">
            <div className="h-1.5 w-1/2 rounded-full bg-white/[0.07]" />
            <div className="h-1.5 w-3/4 rounded-full bg-white/[0.05]" />
          </div>
        </div>
      </FollowingPointer>
    </div>
  );
}
