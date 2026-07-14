"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Eye, EyeOff, KeyRound, Lock, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export type ApiKeyEnvironment = "production" | "development";

export interface ApiKeyRecord {
  id: string;
  name: string;
  environment: ApiKeyEnvironment;
  /** Full secret, e.g. "sk_live_a3f9c2e81d7b4056" (prefix + 16 hex). */
  token: string;
  created: string;
  lastUsed: string;
}

const DEFAULT_KEYS: ApiKeyRecord[] = [
  {
    id: "key_prod",
    name: "Production server",
    environment: "production",
    token: "sk_live_a3f9c2e81d7b4056",
    created: "Apr 12, 2025",
    lastUsed: "4 hours ago",
  },
  {
    id: "key_edge",
    name: "Edge functions",
    environment: "production",
    token: "sk_live_7b1e4d90a6c35f28",
    created: "Mar 28, 2025",
    lastUsed: "2 days ago",
  },
  {
    id: "key_ci",
    name: "CI pipeline",
    environment: "development",
    token: "sk_test_2c9f0a71e8d34b65",
    created: "Feb 09, 2025",
    lastUsed: "just now",
  },
];

const NEW_KEY_NAMES = [
  "Staging worker",
  "Analytics job",
  "Webhook relay",
  "Mobile client",
  "Backups cron",
];

const HEX = "0123456789abcdef";

/** Deterministic 16-char hex body from a seed (no Math.random / Date.now). */
function seededToken(prefix: string, seed: number): string {
  let out = "";
  for (let i = 0; i < 16; i += 1) {
    const n = Math.abs(Math.sin((seed + 1) * 12.9898 + i * 78.233));
    out += HEX[Math.floor((n - Math.floor(n)) * 16)];
  }
  return prefix + out;
}

function EnvPill({ env }: { env: ApiKeyEnvironment }) {
  const isProd = env === "production";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
        isProd
          ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300/90"
          : "border-amber-400/20 bg-amber-400/[0.06] text-amber-300/90"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isProd ? "bg-emerald-400" : "bg-amber-400"
        )}
      />
      {isProd ? "Production" : "Development"}
    </span>
  );
}

function CopyIconButton({
  copied,
  onClick,
}: {
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      aria-label={copied ? "Copied" : "Copy secret key"}
      className={cn(
        "relative flex h-7 w-7 items-center justify-center rounded-md border transition-colors duration-300",
        copied
          ? "border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-300"
          : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 20 }}
            className="absolute"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 20 }}
            className="absolute"
          >
            <Copy className="h-3.5 w-3.5" strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function KeyRow({
  record,
  revealed,
  copied,
  active,
  onToggleReveal,
  onCopy,
  onRevoke,
}: {
  record: ApiKeyRecord;
  revealed: boolean;
  copied: boolean;
  active: boolean;
  onToggleReveal: () => void;
  onCopy: () => void;
  onRevoke: () => void;
}) {
  const prefix = record.token.slice(0, 8);
  const rest = record.token.slice(8);
  const last4 = record.token.slice(-4);
  const dots = "•".repeat(Math.max(rest.length - 4, 0));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.34, ease: EASE }}
      className={cn(
        "relative flex items-center gap-4 overflow-hidden border-t border-white/[0.05] px-5 py-3.5 transition-colors duration-500",
        active ? "bg-white/[0.02]" : "bg-transparent"
      )}
    >
      {/* Left accent that lights up while the row is auto-featured */}
      <span
        className={cn(
          "pointer-events-none absolute inset-y-2 left-0 w-[2px] rounded-full bg-gradient-to-b from-brand to-glow transition-opacity duration-500",
          active ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Name + environment */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13px] font-medium text-white/90">
            {record.name}
          </span>
          <EnvPill env={record.environment} />
        </div>
        <p className="mt-1 truncate text-[11px] text-zinc-600">
          Last used {record.lastUsed}
        </p>
      </div>

      {/* Masked secret + reveal toggle */}
      <div className="flex w-[236px] shrink-0 items-center gap-2">
        <code className="flex-1 overflow-hidden whitespace-nowrap font-mono text-[12px] leading-none tracking-tight">
          <span className="text-zinc-500">{prefix}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={revealed ? "full" : "masked"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="inline-block"
            >
              {revealed ? (
                <span className="text-zinc-200">{rest}</span>
              ) : (
                <>
                  <span className="text-zinc-600">{dots}</span>
                  <span className="text-zinc-400">{last4}</span>
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </code>
        <button
          type="button"
          onClick={onToggleReveal}
          aria-label={revealed ? "Hide secret key" : "Reveal secret key"}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-zinc-200"
        >
          {revealed ? (
            <EyeOff className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <Eye className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Created */}
      <div className="hidden w-[92px] shrink-0 text-right sm:block">
        <p className="text-[12px] tabular-nums text-zinc-400">{record.created}</p>
      </div>

      {/* Actions */}
      <div className="flex w-[64px] shrink-0 items-center justify-end gap-1">
        <CopyIconButton copied={copied} onClick={onCopy} />
        <button
          type="button"
          onClick={onRevoke}
          aria-label="Revoke secret key"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-zinc-500 transition-colors hover:border-red-500/30 hover:bg-red-500/[0.08] hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
        </button>
      </div>
    </motion.div>
  );
}

export function ApiKeyManager({
  keys = DEFAULT_KEYS,
  className,
  autoPlay = true,
}: {
  keys?: ApiKeyRecord[];
  className?: string;
  autoPlay?: boolean;
}) {
  const [rows, setRows] = useState<ApiKeyRecord[]>(keys);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoIndex, setAutoIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seed, setSeed] = useState(keys.length);

  const activeId =
    autoPlay && !paused && rows.length > 0
      ? rows[autoIndex % rows.length].id
      : null;

  // Idle choreography: feature one key at a time, reveal it, flash a copy,
  // then re-mask and advance. Visual only, never touches the real clipboard.
  useEffect(() => {
    if (!autoPlay || paused || rows.length === 0) return;
    const current = rows[autoIndex % rows.length];
    const id = current.id;

    setRevealed((r) => ({ ...r, [id]: true }));
    const t1 = setTimeout(() => setCopiedId(id), 950);
    const t2 = setTimeout(
      () => setCopiedId((c) => (c === id ? null : c)),
      2200
    );
    const t3 = setTimeout(
      () => setRevealed((r) => ({ ...r, [id]: false })),
      2750
    );
    const t4 = setTimeout(() => setAutoIndex((i) => i + 1), 3350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [autoIndex, paused, rows, autoPlay]);

  function toggleReveal(id: string) {
    setRevealed((r) => ({ ...r, [id]: !r[id] }));
  }

  async function handleCopy(record: ApiKeyRecord) {
    try {
      await navigator.clipboard?.writeText(record.token);
    } catch {
      // Clipboard is unavailable in sandboxed previews; the check still fires.
    }
    setCopiedId(record.id);
    setTimeout(() => setCopiedId((c) => (c === record.id ? null : c)), 1600);
  }

  function revoke(id: string) {
    setRows((prev) => prev.filter((k) => k.id !== id));
    setRevealed((r) => {
      const next = { ...r };
      delete next[id];
      return next;
    });
  }

  function createKey() {
    const env: ApiKeyEnvironment = seed % 2 === 0 ? "production" : "development";
    const prefix = env === "production" ? "sk_live_" : "sk_test_";
    const record: ApiKeyRecord = {
      id: `key_${seed}`,
      name: NEW_KEY_NAMES[seed % NEW_KEY_NAMES.length],
      environment: env,
      token: seededToken(prefix, seed),
      created: "Just now",
      lastUsed: "Never used",
    };
    setRows((prev) => [record, ...prev]);
    setSeed((s) => s + 1);
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-[0_24px_70px_-28px_rgba(0,0,0,0.85)]",
        className
      )}
    >
      {/* Thin bright top edge */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand/25 bg-brand/10 text-brand-soft">
            <KeyRound className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-white">API keys</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              Authenticate requests to the Lumenite API.
            </p>
          </div>
        </div>
        <motion.button
          type="button"
          onClick={createKey}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-gradient-to-b from-brand to-[#6a5aef] px-3 py-1.5 text-[12px] font-medium text-white shadow-[0_6px_18px_-6px_rgba(124,108,255,0.6)]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Create key
        </motion.button>
      </div>

      {/* Column labels */}
      <div className="flex items-center gap-4 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
        <span className="flex-1">Name</span>
        <span className="w-[236px] shrink-0">Secret key</span>
        <span className="hidden w-[92px] shrink-0 text-right sm:block">
          Created
        </span>
        <span className="w-[64px] shrink-0 text-right">Actions</span>
      </div>

      {/* Rows */}
      <div>
        <AnimatePresence initial={false}>
          {rows.map((record) => (
            <KeyRow
              key={record.id}
              record={record}
              revealed={Boolean(revealed[record.id])}
              copied={copiedId === record.id}
              active={activeId === record.id}
              onToggleReveal={() => toggleReveal(record.id)}
              onCopy={() => handleCopy(record)}
              onRevoke={() => revoke(record.id)}
            />
          ))}
        </AnimatePresence>

        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-600">
              <KeyRound className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <p className="text-sm font-medium text-zinc-300">No active keys</p>
            <p className="max-w-[220px] text-xs text-zinc-600">
              Create a secret key to start sending authenticated requests.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t border-white/[0.06] px-5 py-3 text-[11px] text-zinc-600">
        <Lock className="h-3 w-3 shrink-0" strokeWidth={2} />
        <span>
          Full secrets appear only at creation. Rotate keys regularly and never
          commit them.
        </span>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <ApiKeyManager />
    </div>
  );
}
