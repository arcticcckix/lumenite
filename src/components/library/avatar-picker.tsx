"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type AvatarOption = {
  id: string;
  /** Display name shown under the preview when this avatar is selected. */
  name: string;
  /** [from, to] used for the avatar gradient. */
  gradient: [string, string];
};

const EASE = [0.16, 1, 0.3, 1] as const;
const RING_SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;
const MORPH_SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 22,
  mass: 0.9,
} as const;

const UPLOAD_ID = "__upload__";

const DEFAULT_AVATARS: AvatarOption[] = [
  { id: "nebula", name: "Nebula", gradient: ["#7c6cff", "#5b8cff"] },
  { id: "aurora", name: "Aurora", gradient: ["#22d3ee", "#6366f1"] },
  { id: "ember", name: "Ember", gradient: ["#fb7185", "#f59e0b"] },
  { id: "lagoon", name: "Lagoon", gradient: ["#2dd4bf", "#3b82f6"] },
  { id: "marigold", name: "Marigold", gradient: ["#fbbf24", "#f97316"] },
  { id: "orchid", name: "Orchid", gradient: ["#f472b6", "#a855f7"] },
  { id: "glacier", name: "Glacier", gradient: ["#a5b4fc", "#38bdf8"] },
  { id: "verdant", name: "Verdant", gradient: ["#34d399", "#22d3ee"] },
];

/** Thin bright ring that slides between tiles via a shared layout id. */
function SelectionRing() {
  return (
    <motion.span
      layoutId="avatar-picker-ring"
      transition={RING_SPRING}
      className="pointer-events-none absolute -inset-[3px] rounded-full ring-2 ring-white/90"
      style={{ boxShadow: "0 0 0 1px rgba(124,108,255,0.5), 0 0 16px 2px rgba(124,108,255,0.45)" }}
    />
  );
}

export function AvatarPicker({
  avatars = DEFAULT_AVATARS,
  defaultId,
  autoCycle = true,
  onSelect,
  className,
}: {
  avatars?: AvatarOption[];
  defaultId?: string;
  autoCycle?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const [selectedId, setSelectedId] = useState<string>(
    () => defaultId ?? avatars[0]?.id ?? UPLOAD_ID
  );
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = useMemo(
    () => avatars.find((a) => a.id === selectedId) ?? null,
    [avatars, selectedId]
  );
  const isUpload = selectedId === UPLOAD_ID;
  const glow = current?.gradient[0] ?? "#7c6cff";

  // Idle loop: ease through the gradient avatars so the picker looks alive at rest.
  useEffect(() => {
    if (!autoCycle || paused || avatars.length < 2) return;
    const iv = setInterval(() => {
      setSelectedId((cur) => {
        const idx = avatars.findIndex((a) => a.id === cur);
        const next = avatars[(idx + 1) % avatars.length];
        return next ? next.id : cur;
      });
    }, 2200);
    return () => clearInterval(iv);
  }, [autoCycle, paused, avatars]);

  useEffect(() => {
    onSelect?.(selectedId);
  }, [selectedId, onSelect]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  function beginInteract() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setPaused(true);
  }
  function endInteract() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 2600);
  }
  function select(id: string) {
    beginInteract();
    setSelectedId(id);
  }

  const caption = isUpload
    ? { title: "Upload a photo", sub: "PNG or JPG, up to 4 MB" }
    : { title: current?.name ?? "Avatar", sub: "Generated gradient" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseEnter={beginInteract}
      onMouseLeave={endInteract}
      className={cn(
        "relative w-[300px] select-none rounded-2xl border border-white/10 bg-panel p-5",
        "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      {/* living tint that tracks the current avatar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-70 transition-colors"
        style={{ background: `radial-gradient(120% 70% at 50% -12%, ${glow}22, rgba(0,0,0,0) 62%)` }}
      />

      <div className="relative">
        {/* header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-soft">
              Profile
            </div>
            <div className="mt-1 text-[15px] font-semibold text-white">
              Choose your avatar
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-zinc-400">
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: paused ? "#52525b" : "#7c6cff" }}
              animate={paused ? { opacity: 1 } : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            {paused ? "Paused" : "Auto"}
          </div>
        </div>

        {/* preview */}
        <div className="flex flex-col items-center">
          <div className="relative" style={{ width: 108, height: 108 }}>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-full blur-2xl"
              style={{ background: `radial-gradient(circle, ${glow}, transparent 68%)` }}
              animate={{ opacity: [0.5, 0.75, 0.5], scale: [1, 1.06, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative h-full w-full overflow-hidden rounded-full ring-1 ring-white/15">
              <AnimatePresence>
                {isUpload ? (
                  <motion.div
                    key="preview-upload"
                    initial={{ opacity: 0, scale: 0.62, rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.16, rotate: 8 }}
                    transition={MORPH_SPRING}
                    className="absolute inset-0 flex items-center justify-center bg-white/[0.04]"
                  >
                    <ImagePlus className="h-8 w-8 text-brand-soft" strokeWidth={1.6} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={selectedId}
                    initial={{ opacity: 0, scale: 0.62, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.16, rotate: 8 }}
                    transition={MORPH_SPRING}
                    className="absolute inset-0"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `linear-gradient(140deg, ${current?.gradient[0]}, ${current?.gradient[1]})`,
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(120% 90% at 28% 22%, rgba(255,255,255,0.42), rgba(255,255,255,0) 56%)",
                      }}
                    />
                    <motion.div
                      className="absolute inset-[-35%]"
                      style={{
                        background: `conic-gradient(from 0deg, transparent, ${current?.gradient[1]}66, transparent 42%)`,
                        mixBlendMode: "overlay",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="mt-4 text-center"
            >
              <div className="text-sm font-semibold text-white">{caption.title}</div>
              <div className="mt-0.5 text-xs text-zinc-500">{caption.sub}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* option grid */}
        <div className="mt-6 flex justify-center">
          <div className="grid grid-cols-3 gap-2.5">
            {avatars.map((a) => {
              const active = a.id === selectedId;
              return (
                <motion.button
                  key={a.id}
                  type="button"
                  onClick={() => select(a.id)}
                  aria-label={`Use ${a.name} avatar`}
                  aria-pressed={active}
                  whileHover={{ scale: 1.09 }}
                  whileTap={{ scale: 0.93 }}
                  transition={{ type: "spring", stiffness: 460, damping: 26 }}
                  className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
                  style={{ width: 54, height: 54 }}
                >
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundImage: `linear-gradient(140deg, ${a.gradient[0]}, ${a.gradient[1]})`,
                    }}
                  />
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(115% 90% at 30% 22%, rgba(255,255,255,0.36), rgba(255,255,255,0) 56%)",
                    }}
                  />
                  <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/25" />
                  {active && <SelectionRing />}
                </motion.button>
              );
            })}

            {/* upload tile */}
            <motion.button
              type="button"
              onClick={() => select(UPLOAD_ID)}
              aria-label="Upload a photo"
              aria-pressed={isUpload}
              whileHover={{ scale: 1.09 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 460, damping: 26 }}
              className="relative grid place-items-center rounded-full border border-dashed border-white/20 bg-white/[0.03] text-zinc-400 outline-none transition-colors hover:border-white/40 hover:text-white focus-visible:ring-2 focus-visible:ring-brand-soft"
              style={{ width: 54, height: 54 }}
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              {isUpload && <SelectionRing />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <AvatarPicker />
    </div>
  );
}
