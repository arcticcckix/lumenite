"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { SITE } from "@/lib/site";
import { REGISTRY } from "@/lib/registry";
import { cn } from "@/lib/utils";

const freeCount = REGISTRY.filter((e) => e.tier === "free").length;
const proCount = REGISTRY.filter((e) => e.tier === "pro").length;

type Tier = {
  name: string;
  audience: string;
  price: string;
  note: string;
  highlight?: boolean;
  cta: { label: string; href: string; external?: boolean };
  points: string[];
};

const TIERS: Tier[] = [
  {
    name: "Free",
    audience: "For trying it out and side projects",
    price: "$0",
    note: "forever",
    cta: { label: "Start building", href: "/components" },
    points: [
      `${freeCount} components, MIT-style license`,
      "Unlimited commercial & client use",
      "Copy-paste source, no attribution",
    ],
  },
  {
    name: "Pro",
    audience: "For indie devs and freelancers who ship",
    price: SITE.pricing.pro.label,
    note: "once, yours for life",
    highlight: true,
    cta: { label: "Get Pro", href: SITE.whopCheckoutUrl, external: true },
    points: [
      `Everything free, plus all ${proCount} Pro components`,
      "Every premium page template",
      "Every future release, no extra cost",
      "Instant license key via Whop",
    ],
  },
  {
    name: "Team",
    audience: "For agencies and product teams",
    price: SITE.pricing.team.label,
    note: "once, up to 10 seats",
    cta: { label: "Get Team", href: SITE.whopCheckoutUrl, external: true },
    points: [
      "Everything in Pro",
      "Up to 10 developer seats",
      "One invoice, one license key",
      "Priority support",
    ],
  },
];

type Row = { label: string; free: string | boolean; pro: string | boolean; team: string | boolean };
type Group = { title: string; rows: Row[] };

const COMPARISON: Group[] = [
  {
    title: "Components",
    rows: [
      { label: "Free components", free: `${freeCount}`, pro: `${freeCount}`, team: `${freeCount}` },
      { label: "Pro components", free: false, pro: `${proCount}`, team: `${proCount}` },
      { label: "Full source access", free: "Free tier", pro: true, team: true },
      { label: "Future components", free: "Free only", pro: true, team: true },
    ],
  },
  {
    title: "Templates & updates",
    rows: [
      { label: "Premium page templates", free: false, pro: true, team: true },
      { label: "Lifetime updates", free: false, pro: true, team: true },
    ],
  },
  {
    title: "Licensing",
    rows: [
      { label: "Personal & commercial use", free: true, pro: true, team: true },
      { label: "Unlimited client projects", free: true, pro: true, team: true },
      { label: "Developer seats", free: "1", pro: "1", team: "10" },
    ],
  },
  {
    title: "Support",
    rows: [
      { label: "Community", free: true, pro: true, team: true },
      { label: "Priority support", free: false, pro: false, team: true },
      { label: "Refund window", free: "—", pro: "7 days", team: "7 days" },
    ],
  },
];

export function PricingView() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      {/* header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Own it once.
          <span className="block text-zinc-500">Use it forever.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-zinc-400">
          The free tier is genuinely useful, not a teaser. Pro is a single
          payment that unlocks everything and never expires.
        </p>
      </div>

      {/* tiers */}
      <div className="mt-20 grid gap-5 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={cn(
              "relative flex flex-col rounded-3xl border p-8",
              t.highlight
                ? "border-brand/40 bg-panel"
                : "border-line bg-surface"
            )}
          >
            {t.highlight && (
              <div className="absolute right-6 top-8 text-[11px] font-medium uppercase tracking-widest text-brand-soft">
                Recommended
              </div>
            )}
            <h2 className="text-sm font-medium text-zinc-300">{t.name}</h2>
            <p className="mt-1 h-9 max-w-[15rem] text-xs leading-relaxed text-zinc-500">
              {t.audience}
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight">
                {t.price}
              </span>
              <span className="text-sm text-zinc-500">{t.note}</span>
            </div>

            {t.cta.external ? (
              <a
                href={t.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-7 block rounded-full py-3 text-center text-sm font-medium transition",
                  t.highlight
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "border border-line text-zinc-300 hover:border-zinc-600 hover:text-white"
                )}
              >
                {t.cta.label}
              </a>
            ) : (
              <Link
                href={t.cta.href}
                className="mt-7 block rounded-full border border-line py-3 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
              >
                {t.cta.label}
              </Link>
            )}

            <ul className="mt-8 space-y-3 border-t border-line pt-6">
              {t.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" />
                  <span className="text-zinc-300">{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* comparison */}
      <div className="mt-24">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Compare every detail
        </h2>

        <div className="mt-10 overflow-hidden rounded-2xl border border-line">
          {/* sticky-ish header */}
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] border-b border-line bg-surface text-sm">
            <div className="px-5 py-4 text-zinc-500">Plan</div>
            {["Free", "Pro", "Team"].map((n) => (
              <div
                key={n}
                className={cn(
                  "px-5 py-4 text-center font-medium",
                  n === "Pro" ? "text-brand-soft" : "text-zinc-300"
                )}
              >
                {n}
              </div>
            ))}
          </div>

          {COMPARISON.map((group) => (
            <div key={group.title}>
              <div className="bg-void/60 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                {group.title}
              </div>
              {group.rows.map((row, idx) => (
                <div
                  key={row.label}
                  className={cn(
                    "grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center text-sm",
                    idx % 2 === 0 ? "bg-surface/40" : "bg-transparent"
                  )}
                >
                  <div className="px-5 py-3.5 text-zinc-300">{row.label}</div>
                  <Cell value={row.free} />
                  <Cell value={row.pro} highlight />
                  <Cell value={row.team} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* trust note */}
      <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-line bg-surface p-6 text-center text-sm leading-relaxed text-zinc-400">
        Checkout runs on{" "}
        <span className="text-zinc-200">Whop</span>, the merchant of record, so
        receipts and taxes are handled for you. Your license key arrives the
        second you pay. Activate it in the{" "}
        <Link href="/dashboard" className="text-brand-soft hover:underline">
          Dashboard
        </Link>{" "}
        and read the{" "}
        <Link href="/legal/refunds" className="text-brand-soft hover:underline">
          refund policy
        </Link>{" "}
        for the fine print.
      </div>
    </div>
  );
}

function Cell({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-5 py-3.5",
        highlight && "bg-brand/[0.06]"
      )}
    >
      {typeof value === "boolean" ? (
        value ? (
          <Check className={cn("h-4 w-4", highlight ? "text-brand-soft" : "text-emerald-400")} />
        ) : (
          <Minus className="h-4 w-4 text-zinc-700" />
        )
      ) : (
        <span className={cn("text-xs", highlight ? "text-white" : "text-zinc-400")}>
          {value}
        </span>
      )}
    </div>
  );
}
