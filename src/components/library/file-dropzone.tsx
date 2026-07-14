"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  FileArchive,
  FileImage,
  FileText,
  FileVideo,
  type LucideIcon,
  UploadCloud,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export type DropFileKind = "image" | "pdf" | "zip" | "video" | "doc";

export interface DropFile {
  id: string;
  name: string;
  size: string;
  kind: DropFileKind;
  /** 0 to 100 */
  progress: number;
}

const KIND_META: Record<
  DropFileKind,
  { icon: LucideIcon; tint: string; ring: string }
> = {
  image: { icon: FileImage, tint: "text-sky-300", ring: "bg-sky-400/10" },
  pdf: { icon: FileText, tint: "text-rose-300", ring: "bg-rose-400/10" },
  zip: { icon: FileArchive, tint: "text-amber-300", ring: "bg-amber-400/10" },
  video: { icon: FileVideo, tint: "text-violet-300", ring: "bg-violet-400/10" },
  doc: { icon: FileText, tint: "text-zinc-300", ring: "bg-white/5" },
};

function FileChip({
  file,
  onRemove,
}: {
  file: DropFile;
  onRemove?: (id: string) => void;
}) {
  const meta = KIND_META[file.kind];
  const Icon = meta.icon;
  const pct = Math.max(0, Math.min(100, Math.round(file.progress)));
  const done = pct >= 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="group/chip flex items-center gap-3 rounded-xl border border-line bg-void/60 px-3 py-2.5"
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          meta.ring
        )}
      >
        <Icon className={cn("h-4.5 w-4.5", meta.tint)} strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-[13px] font-medium text-zinc-100">
            {file.name}
          </span>
          <span className="shrink-0 text-[11px] tabular-nums text-zinc-500">
            {done ? file.size : `${pct}%`}
          </span>
        </div>

        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className={cn(
              "h-full rounded-full",
              done
                ? "bg-emerald-400/80"
                : "bg-gradient-to-r from-brand to-glow"
            )}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.span
              key="done"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </motion.span>
          ) : (
            <motion.span
              key="spin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{
                rotate: { duration: 0.9, ease: "linear", repeat: Infinity },
                opacity: { duration: 0.2 },
              }}
              className="block h-3.5 w-3.5 rounded-full border-[1.5px] border-white/15 border-t-brand-soft"
            />
          )}
        </AnimatePresence>

        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            aria-label={`Remove ${file.name}`}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-void/70 text-zinc-500 opacity-0 backdrop-blur-sm transition-opacity hover:text-white group-hover/chip:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function FileDropzone({
  files = [],
  onDropFiles,
  onRemove,
  title = "Drop files to upload",
  hint = "PNG, PDF, MP4 or ZIP up to 200 MB",
  className,
}: {
  files?: DropFile[];
  onDropFiles?: (files: FileList) => void;
  onRemove?: (id: string) => void;
  title?: string;
  hint?: string;
  className?: string;
}) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = zoneRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dashW = Math.max(0, size.w - 3);
  const dashH = Math.max(0, size.h - 3);

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <div
        ref={zoneRef}
        onDragOver={(e) => {
          e.preventDefault();
          if (!dragOver) setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) onDropFiles?.(e.dataTransfer.files);
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl px-6 py-8 transition-colors duration-300",
          dragOver ? "bg-brand/[0.06]" : "bg-white/[0.015]"
        )}
      >
        {/* soft radial wash that intensifies on drag-over */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, rgba(124,108,255,0.16), transparent 70%)",
          }}
          animate={{ opacity: dragOver ? 1 : 0.35 }}
          transition={{ duration: 0.35, ease: EASE }}
        />

        {/* animated dashed marching-ants border */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0"
          width={size.w}
          height={size.h}
        >
          <defs>
            <linearGradient id="fdz-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c6cff" />
              <stop offset="100%" stopColor="#5b8cff" />
            </linearGradient>
          </defs>
          {dashW > 0 && dashH > 0 && (
            <motion.rect
              x={1.5}
              y={1.5}
              width={dashW}
              height={dashH}
              rx={16}
              ry={16}
              fill="none"
              stroke={dragOver ? "url(#fdz-stroke)" : "rgba(255,255,255,0.16)"}
              strokeWidth={1.5}
              strokeDasharray="7 9"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{
                duration: dragOver ? 0.7 : 1.8,
                ease: "linear",
                repeat: Infinity,
              }}
              style={{
                filter: dragOver
                  ? "drop-shadow(0 0 6px rgba(124,108,255,0.5))"
                  : "none",
              }}
            />
          )}
        </svg>

        <div className="relative flex flex-col items-center text-center">
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel"
            animate={
              dragOver
                ? { y: -8, scale: 1.06 }
                : { y: [0, -4, 0], scale: 1 }
            }
            transition={
              dragOver
                ? { type: "spring", stiffness: 380, damping: 20 }
                : { duration: 3.4, ease: "easeInOut", repeat: Infinity }
            }
            style={{
              boxShadow: dragOver
                ? "0 12px 30px -8px rgba(124,108,255,0.45)"
                : "0 8px 24px -12px rgba(0,0,0,0.8)",
            }}
          >
            <motion.div
              animate={{ color: dragOver ? "#a99dff" : "#e4e4e7" }}
              transition={{ duration: 0.25 }}
            >
              <UploadCloud className="h-6 w-6" strokeWidth={1.6} />
            </motion.div>
          </motion.div>

          <p className="mt-4 text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-xs text-zinc-500">{hint}</p>

          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
            <span className="h-px w-6 bg-line" />
            <span>or</span>
            <span className="h-px w-6 bg-line" />
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="mt-3 rounded-lg border border-line bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-brand/40 hover:bg-white/[0.08] hover:text-white"
          >
            Browse files
          </motion.button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {files.map((f) => (
              <FileChip key={f.id} file={f} onRemove={onRemove} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- demo ----------------------------- */

const SEED_FILES: DropFile[] = [
  {
    id: "a",
    name: "brand-guidelines.pdf",
    size: "8.2 MB",
    kind: "pdf",
    progress: 100,
  },
  {
    id: "b",
    name: "hero-poster.png",
    size: "2.4 MB",
    kind: "image",
    progress: 46,
  },
  {
    id: "c",
    name: "product-reel.mp4",
    size: "54 MB",
    kind: "video",
    progress: 18,
  },
];

const SPEED: Record<string, number> = { b: 7, c: 4 };

export default function Demo() {
  const [files, setFiles] = useState<DropFile[]>(SEED_FILES);

  useEffect(() => {
    let resetting = false;
    const id = setInterval(() => {
      setFiles((prev) => {
        const allDone = prev.every((f) => f.progress >= 100);
        if (allDone) {
          if (!resetting) {
            resetting = true;
            window.setTimeout(() => {
              resetting = false;
              setFiles((cur) =>
                cur.map((f) =>
                  f.id === "a" ? f : { ...f, progress: f.id === "b" ? 24 : 6 }
                )
              );
            }, 1700);
          }
          return prev;
        }
        return prev.map((f) => {
          if (f.progress >= 100) return f;
          const step = SPEED[f.id] ?? 5;
          return { ...f, progress: Math.min(100, f.progress + step) };
        });
      });
    }, 140);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <div className="w-full max-w-sm">
        <FileDropzone files={files} onRemove={() => {}} />
      </div>
    </div>
  );
}
