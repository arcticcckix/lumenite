"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Lock,
  LoaderCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { runAudit } from "@/lib/audit/client";
import type { AuditReport } from "@/lib/audit/detect";
import { bySlug } from "@/lib/registry";
import { useLicense } from "@/lib/license";

const SCAN_STEPS = [
  "Fetching your page…",
  "Detecting sections…",
  "Scoring your design…",
  "Matching components…",
];

export function AuditTool() {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [step, setStep] = useState(0);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setReport(null);
    setPhase("scanning");
    setStep(0);
    const ticker = setInterval(
      () => setStep((s) => (s + 1) % SCAN_STEPS.length),
      700
    );
    const result = await runAudit(url);
    clearInterval(ticker);
    if (!result.ok) {
      setError(result.error);
      setPhase("idle");
      return;
    }
    setReport(result.report);
    setDemo(result.demo);
    setPhase("done");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* header */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-1.5 text-xs text-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-brand-soft" /> Free · no signup
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Is your site leaving money on the table?
        </h1>
        <p className="mt-4 text-zinc-400">
          Paste your URL. Our AI scans your page, scores your design, and shows
          the exact Lumenite components that would make each section convert
          harder.
        </p>
      </div>

      {/* input */}
      <form onSubmit={submit} className="mx-auto mt-10 flex max-w-xl gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourwebsite.com"
            className="w-full rounded-full border border-line bg-panel py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-brand/60 focus:shadow-[0_0_24px_rgba(124,108,255,0.15)]"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button
          type="submit"
          disabled={phase === "scanning" || !url.trim()}
          className="flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50"
        >
          {phase === "scanning" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            "Scan my site"
          )}
        </button>
      </form>

      {error && (
        <p className="mx-auto mt-4 max-w-xl rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-center text-xs text-rose-300">
          {error}
        </p>
      )}

      {/* scanning animation */}
      <AnimatePresence>
        {phase === "scanning" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3"
          >
            <div className="h-1 w-full overflow-hidden rounded-full bg-panel">
              <motion.div
                className="h-full bg-gradient-to-r from-brand to-glow"
                initial={{ width: "0%" }}
                animate={{ width: ["0%", "40%", "70%", "92%"] }}
                transition={{ duration: 2.6, ease: "easeInOut" }}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-zinc-400"
              >
                {SCAN_STEPS[step]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* report */}
      <AnimatePresence>
        {phase === "done" && report && (
          <Report report={report} demo={demo} />
        )}
      </AnimatePresence>

      {phase === "idle" && !error && <HowItWorks />}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const tone =
    score >= 80 ? "#34d399" : score >= 55 ? "#a99dff" : "#f59e0b";
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1c1c28" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (score / 100) * c }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold">{score}</span>
        <span className="text-[10px] uppercase tracking-wide text-zinc-500">
          / 100
        </span>
      </div>
    </div>
  );
}

function Report({ report, demo }: { report: AuditReport; demo: boolean }) {
  const { isPro } = useLicense();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-14"
    >
      {/* summary card */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-surface p-8 sm:flex-row sm:items-center">
        <ScoreRing score={report.score} />
        <div className="flex-1 text-center sm:text-left">
          <div className="text-xs uppercase tracking-wide text-zinc-500">
            Design score for {report.title}
          </div>
          <h2 className="mt-1 text-xl font-semibold leading-snug">
            {report.headline}
          </h2>
          {(demo || report.generatedNote) && (
            <p className="mt-2 text-xs text-zinc-600">{report.generatedNote}</p>
          )}
        </div>
      </div>

      {/* sections */}
      <div className="mt-10 space-y-4">
        {report.sections
          .slice()
          .sort((a, b) => Number(a.found) - Number(b.found))
          .map((s, i) => {
            const rec = s.recommend
              .map((slug) => bySlug(slug))
              .filter((e): e is NonNullable<typeof e> => !!e)
              .slice(0, 3);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className="rounded-2xl border border-line bg-surface p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                          s.found
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-amber-500/15 text-amber-400"
                        )}
                      >
                        {s.found ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      </span>
                      <h3 className="font-medium text-white">{s.label}</h3>
                    </div>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
                      {s.pitch}
                    </p>
                  </div>
                </div>

                {/* recommended components */}
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {rec.map((e) => {
                    const locked = e.tier === "pro" && !isPro;
                    const Demo = e.component;
                    return (
                      <Link
                        key={e.slug}
                        href={`/components/${e.slug}`}
                        className="group relative overflow-hidden rounded-xl border border-line bg-void transition hover:border-zinc-600"
                      >
                        <div className="relative h-28 overflow-hidden">
                          <div className="absolute inset-0 origin-center scale-[0.55]">
                            <Demo />
                          </div>
                          {locked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-void/50 backdrop-blur-[1px]">
                              <Lock className="h-4 w-4 text-brand-soft" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between border-t border-line px-3 py-2">
                          <span className="truncate text-xs text-zinc-300">
                            {e.name}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase",
                              e.tier === "pro"
                                ? "bg-brand/20 text-brand-soft"
                                : "bg-emerald-500/15 text-emerald-400"
                            )}
                          >
                            {e.tier}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* CTA */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-brand/40 bg-panel p-10 text-center shadow-[0_0_60px_rgba(124,108,255,0.15)]">
        <h3 className="text-2xl font-semibold tracking-tight">
          Unlock every fix in this report
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
          Get {report.recommendedSlugs.length}+ recommended components — including
          all the Pro ones above — for {SITE.pricing.pro.label} once. Copy, paste,
          and your site looks like this report by tonight.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/pricing"
            className="flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Get Pro — {SITE.pricing.pro.label} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/components"
            className="rounded-full border border-line px-7 py-3 text-sm text-zinc-300 transition hover:text-white"
          >
            Browse free components
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function HowItWorks() {
  const steps = [
    { n: "1", t: "Paste your URL", d: "Any public website — your landing page, store, or portfolio." },
    { n: "2", t: "AI scans every section", d: "We detect your hero, nav, testimonials, pricing, CTA and more." },
    { n: "3", t: "Get your upgrade plan", d: "See the exact components to copy-paste, with live previews." },
  ];
  return (
    <div className="mx-auto mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
      {steps.map((s) => (
        <div key={s.n} className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-sm font-medium text-brand-soft">
            {s.n}
          </div>
          <h3 className="mt-4 font-medium text-white">{s.t}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{s.d}</p>
        </div>
      ))}
    </div>
  );
}
