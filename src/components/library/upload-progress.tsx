"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileArchive,
  Film,
  FileText,
  Database,
  FileImage,
  FileCode,
  File as FileIcon,
  Check,
  TriangleAlert,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FileType =
  | "archive"
  | "video"
  | "document"
  | "database"
  | "image"
  | "code"
  | "generic";

export interface UploadItem {
  /** File name shown in the row, e.g. "launch-film-master.mp4". */
  name: string;
  /** Size in megabytes. */
  sizeMB: number;
  /** Drives which file-type icon renders. */
  type?: FileType;
  /** Time in ms this row takes to reach its target. */
  durationMs?: number;
  /** Delay in ms before this row starts filling. */
  delayMs?: number;
  /** If set (0..1), the row fails at this fraction instead of completing. */
  failAt?: number;
}

type Status = "uploading" | "complete" | "error";
type Frame = { p: number; status: Status };

const ICONS: Record<FileType, LucideIcon> = {
  archive: FileArchive,
  video: Film,
  document: FileText,
  database: Database,
  image: FileImage,
  code: FileCode,
  generic: FileIcon,
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function formatSize(mb: number): string {
  if (mb >= 1024) return `${(Math.round((mb / 1024) * 10) / 10).toFixed(1)} GB`;
  return `${(Math.round(mb * 10) / 10).toFixed(1)} MB`;
}

const FILL: Record<Status, string> = {
  uploading: "linear-gradient(90deg, #7c6cff, #5b8cff)",
  complete: "linear-gradient(90deg, #34d399, #10b981)",
  error: "linear-gradient(90deg, #fb7185, #f43f5e)",
};

const CAP_GLOW: Record<Status, string> = {
  uploading: "0 0 10px 1px rgba(124,108,255,0.75)",
  complete: "0 0 10px 1px rgba(52,211,153,0.6)",
  error: "0 0 10px 1px rgba(244,63,94,0.6)",
};

const HOLD_MS = 1600;
const FADE_MS = 340;
const RING_C = 113.1; // 2·π·18

export function UploadProgress({
  files,
  title = "Uploading files",
  className,
}: {
  files: UploadItem[];
  title?: string;
  className?: string;
}) {
  const items = useMemo(
    () =>
      files.map((f, i) => ({
        ...f,
        delay: f.delayMs ?? i * 260,
        duration: f.durationMs ?? 3200,
        Icon: ICONS[f.type ?? "generic"],
      })),
    [files]
  );

  const totalCycle = useMemo(() => {
    const window = items.reduce(
      (max, it) => Math.max(max, it.delay + it.duration),
      0
    );
    return window + HOLD_MS;
  }, [items]);

  const totalMB = useMemo(
    () => files.reduce((sum, f) => sum + f.sizeMB, 0),
    [files]
  );

  const [frames, setFrames] = useState<Frame[]>(() =>
    items.map(() => ({ p: 0, status: "uploading" as Status }))
  );
  const [contentOpacity, setContentOpacity] = useState(0);

  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      let elapsed = now - startRef.current;
      if (elapsed >= totalCycle) {
        startRef.current = now;
        elapsed = 0;
      }

      const next: Frame[] = items.map((it) => {
        const local = clamp01((elapsed - it.delay) / it.duration);
        const eased = easeOutCubic(local);
        if (it.failAt != null) {
          return {
            p: it.failAt * eased,
            status: local >= 1 ? "error" : "uploading",
          };
        }
        return { p: eased, status: local >= 1 ? "complete" : "uploading" };
      });
      setFrames(next);

      let op = 1;
      if (elapsed < FADE_MS) op = elapsed / FADE_MS;
      else if (elapsed > totalCycle - FADE_MS)
        op = clamp01((totalCycle - elapsed) / FADE_MS);
      setContentOpacity(Math.round(op * 1000) / 1000);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items, totalCycle]);

  const overall =
    frames.length > 0
      ? frames.reduce((s, f) => s + f.p, 0) / frames.length
      : 0;
  const overallPct = Math.round(overall * 100);
  const ringOffset = Math.round(RING_C * (1 - overall) * 10) / 10;

  return (
    <div
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#101018] p-5",
        className
      )}
    >
      {/* bright top edge + restrained corner glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />

      <div style={{ opacity: contentOpacity }} className="relative">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
              <UploadCloud className="h-[18px] w-[18px] text-brand-soft" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{title}</div>
              <div className="mt-0.5 text-xs text-zinc-500">
                {files.length} files · {formatSize(totalMB)}
              </div>
            </div>
          </div>

          <div className="relative h-11 w-11">
            <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90">
              <defs>
                <linearGradient id="lm-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c6cff" />
                  <stop offset="100%" stopColor="#5b8cff" />
                </linearGradient>
              </defs>
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="3"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="url(#lm-ring)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={ringOffset}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-medium tabular-nums text-white">
              {overallPct}%
            </div>
          </div>
        </div>

        <div className="my-4 h-px bg-white/[0.06]" />

        {/* rows */}
        <div className="flex flex-col gap-3">
          {items.map((it, i) => {
            const frame = frames[i] ?? { p: 0, status: "uploading" as Status };
            const { p, status } = frame;
            const widthNum = Math.round(p * 1000) / 10;
            const uploaded = Math.round(it.sizeMB * p * 10) / 10;
            const Icon = it.Icon;

            const iconTint =
              status === "complete"
                ? "text-emerald-300"
                : status === "error"
                ? "text-rose-300"
                : "text-zinc-300";

            return (
              <div
                key={it.name}
                className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3 py-2.5"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]",
                    iconTint
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-[13px] font-medium text-zinc-100">
                      {it.name}
                    </span>
                    <StatusBadge status={status} p={p} />
                  </div>

                  {/* track */}
                  <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
                      style={{ width: `${widthNum}%`, background: FILL[status] }}
                    >
                      {status === "uploading" && (
                        <motion.div
                          aria-hidden
                          className="absolute inset-y-0 w-1/3"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
                          }}
                          animate={{ x: ["-120%", "320%"] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      )}
                    </div>
                    {status === "uploading" && widthNum > 2 && widthNum < 99 && (
                      <span
                        aria-hidden
                        className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                        style={{
                          left: `${widthNum}%`,
                          boxShadow: CAP_GLOW[status],
                        }}
                      />
                    )}
                  </div>

                  {/* subline */}
                  <div className="mt-1.5 text-[11px] tabular-nums text-zinc-500">
                    {status === "complete" ? (
                      <span className="text-zinc-400">
                        {formatSize(it.sizeMB)} · Uploaded
                      </span>
                    ) : status === "error" ? (
                      <span className="text-rose-300/80">
                        Upload failed · retry available
                      </span>
                    ) : (
                      <span>
                        {uploaded.toFixed(1)} MB of {formatSize(it.sizeMB)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, p }: { status: Status; p: number }) {
  return (
    <div className="flex h-5 w-auto min-w-[2.5rem] items-center justify-end">
      <AnimatePresence mode="wait" initial={false}>
        {status === "uploading" && (
          <motion.span
            key="pct"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-medium tabular-nums text-zinc-400"
          >
            {Math.round(p * 100)}%
          </motion.span>
        )}
        {status === "complete" && (
          <motion.span
            key="done"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ type: "spring", stiffness: 520, damping: 20 }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"
            style={{ boxShadow: "0 0 12px 0 rgba(52,211,153,0.35)" }}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </motion.span>
        )}
        {status === "error" && (
          <motion.span
            key="err"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ type: "spring", stiffness: 520, damping: 20 }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-400/15 text-rose-300"
          >
            <TriangleAlert className="h-3 w-3" strokeWidth={2.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

const DEMO_FILES: UploadItem[] = [
  {
    name: "product-photography.zip",
    sizeMB: 86.4,
    type: "archive",
    delayMs: 200,
    durationMs: 3400,
  },
  {
    name: "launch-film-master.mp4",
    sizeMB: 212.7,
    type: "video",
    delayMs: 0,
    durationMs: 5200,
  },
  {
    name: "brand-guidelines.pdf",
    sizeMB: 9.1,
    type: "document",
    delayMs: 450,
    durationMs: 2200,
  },
  {
    name: "warehouse-snapshot.sql",
    sizeMB: 44.2,
    type: "database",
    delayMs: 300,
    durationMs: 2700,
    failAt: 0.62,
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <UploadProgress files={DEMO_FILES} title="Uploading to workspace" />
    </div>
  );
}
