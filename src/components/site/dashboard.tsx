"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  Crown,
  Download,
  KeyRound,
  Layers,
  LoaderCircle,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useLicense } from "@/lib/license";
import { REGISTRY } from "@/lib/registry";
import { SITE } from "@/lib/site";

const IS_STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

export function Dashboard() {
  const { license, loaded, activate, deactivate, isPro } = useLicense();

  if (!loaded)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-6 w-6 animate-spin text-zinc-600" />
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <AnimatePresence mode="wait">
        {isPro && license ? (
          <ProDashboard key="pro" licenseKey={license.key} plan={license.plan} onLogout={deactivate} />
        ) : (
          <Activation key="lock" onActivate={activate} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Locked state: activation ---------- */

function Activation({
  onActivate,
}: {
  onActivate: (key: string) => Promise<{ ok: boolean } & Record<string, unknown>>;
}) {
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await onActivate(key);
    setBusy(false);
    if (!res.ok) setError((res as { error?: string }).error ?? "Invalid key.");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-md pt-10 text-center"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel shadow-[0_0_40px_rgba(124,108,255,0.15)]">
        <KeyRound className="h-6 w-6 text-brand-soft" />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Activate your license</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        Enter the license key from your Whop purchase to unlock every Pro
        component and template in this browser.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-3">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={IS_STATIC_DEMO ? "Try the demo key: DEMO-2026" : "mem_XXXXXXXXXXXX"}
          className="w-full rounded-xl border border-line bg-panel px-4 py-3 text-center font-mono text-sm text-white placeholder-zinc-600 outline-none transition focus:border-brand/60 focus:shadow-[0_0_24px_rgba(124,108,255,0.15)]"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={busy || !key.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50"
        >
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
          Activate
        </button>
      </form>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300"
        >
          {error}
        </motion.p>
      )}

      <div className="mt-10 rounded-xl border border-line bg-surface p-5 text-left text-sm text-zinc-400">
        <p>
          <span className="text-zinc-200">No license yet?</span> Pro is{" "}
          {SITE.pricing.pro.label} one-time on{" "}
          <a
            href={SITE.whopCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-soft hover:underline"
          >
            Whop
          </a>
          . Your key is delivered instantly after checkout.
        </p>
        {IS_STATIC_DEMO && (
          <p className="mt-3 border-t border-line pt-3 text-xs text-zinc-500">
            This public showcase runs in demo mode — use{" "}
            <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-brand-soft">DEMO-2026</code>{" "}
            to preview the Pro dashboard.
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ---------- Unlocked state ---------- */

function ProDashboard({
  licenseKey,
  plan,
  onLogout,
}: {
  licenseKey: string;
  plan: "pro" | "team";
  onLogout: () => void;
}) {
  const proComponents = REGISTRY.filter((e) => e.tier === "pro");
  const masked =
    licenseKey.length > 8
      ? `${licenseKey.slice(0, 4)}••••${licenseKey.slice(-4)}`
      : licenseKey;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand/30 to-glow/30 px-3 py-1 text-xs font-medium text-brand-soft">
              <Crown className="h-3.5 w-3.5" /> {plan === "team" ? "Team" : "Pro"} active
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            License <code className="font-mono text-zinc-400">{masked}</code> — unlocked on this browser.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-zinc-400 transition hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" /> Deactivate
        </button>
      </div>

      {/* stats */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Sparkles, label: "Pro components unlocked", value: proComponents.length },
          { icon: Layers, label: "Templates included", value: 4 },
          { icon: BadgeCheck, label: "Lifetime updates", value: "∞" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-6">
            <s.icon className="h-5 w-5 text-brand-soft" />
            <div className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</div>
            <div className="mt-1 text-xs text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* pro components */}
      <h2 className="mt-14 text-lg font-medium">Your Pro components</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Full source is now visible on every component page.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {proComponents.map((e) => (
          <Link
            key={e.slug}
            href={`/components/${e.slug}`}
            className="group flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-4 transition hover:border-zinc-600 hover:bg-panel"
          >
            <div>
              <div className="text-sm font-medium text-zinc-200">{e.name}</div>
              <div className="text-[11px] uppercase tracking-wide text-zinc-600">{e.category}</div>
            </div>
            <span className="text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-brand-soft">→</span>
          </Link>
        ))}
      </div>

      {/* templates */}
      <h2 className="mt-14 text-lg font-medium">Templates</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {["Nova — SaaS Landing", "Pulse — Startup Hero Pack", "Orbit — Portfolio", "Signal — Waitlist / Launch"].map((t) => (
          <div key={t} className="flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-4">
            <span className="text-sm text-zinc-200">{t}</span>
            <a
              href={SITE.whopCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-panel px-3.5 py-1.5 text-xs text-zinc-300 transition hover:text-white"
              title="Template bundles are delivered through your Whop purchase page"
            >
              <Download className="h-3.5 w-3.5" /> Get files
            </a>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-600">
        Template source bundles are delivered via your Whop purchase — the
        &ldquo;Get files&rdquo; button opens your access page.
      </p>
    </motion.div>
  );
}
