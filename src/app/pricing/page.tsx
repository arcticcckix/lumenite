import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { REGISTRY } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free components forever. Pro is a one-time payment — every premium component, every template, lifetime updates.",
};

const free = () => REGISTRY.filter((e) => e.tier === "free").length;
const pro = () => REGISTRY.filter((e) => e.tier === "pro").length;

export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      note: "forever",
      cta: { label: "Browse components", href: "/components" },
      highlight: false,
      features: [
        { ok: true, label: `${free()} free components, MIT-style license` },
        { ok: true, label: "Commercial & client projects" },
        { ok: true, label: "Copy-paste source, no attribution" },
        { ok: true, label: "TypeScript + Tailwind v4 + Framer Motion" },
        { ok: false, label: `${pro()} Pro components` },
        { ok: false, label: "Premium page templates" },
        { ok: false, label: "Lifetime updates to Pro content" },
      ],
    },
    {
      name: "Pro",
      price: SITE.pricing.pro.label,
      note: SITE.pricing.pro.note,
      cta: { label: "Get Pro on Whop", href: SITE.whopCheckoutUrl, external: true },
      highlight: true,
      features: [
        { ok: true, label: "Everything in Free" },
        { ok: true, label: `All ${pro()} Pro components — full source` },
        { ok: true, label: "Premium page templates" },
        { ok: true, label: "Every future component & template" },
        { ok: true, label: "Unlimited personal & client projects" },
        { ok: true, label: "Instant license key via Whop" },
        { ok: true, label: "7-day refund policy" },
      ],
    },
    {
      name: "Team",
      price: SITE.pricing.team.label,
      note: SITE.pricing.team.note,
      cta: { label: "Get Team on Whop", href: SITE.whopCheckoutUrl, external: true },
      highlight: false,
      features: [
        { ok: true, label: "Everything in Pro" },
        { ok: true, label: "Up to 10 team seats" },
        { ok: true, label: "Use across your whole agency" },
        { ok: true, label: "Priority support" },
        { ok: true, label: "One invoice, one key" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Simple pricing. No subscription.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          Pay once, own it forever. Cheaper than every comparable library —
          and the free tier is genuinely useful, not a teaser.
        </p>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={
              t.highlight
                ? "relative rounded-2xl border border-brand/50 bg-panel p-8 shadow-[0_0_60px_rgba(124,108,255,0.15)]"
                : "rounded-2xl border border-line bg-surface p-8"
            }
          >
            {t.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand to-glow px-4 py-1 text-xs font-medium text-white">
                Most popular
              </span>
            )}
            <h2 className="text-lg font-medium text-zinc-200">{t.name}</h2>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight">{t.price}</span>
              <span className="text-sm text-zinc-500">{t.note}</span>
            </div>
            <ul className="mt-8 space-y-3">
              {t.features.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5 text-sm">
                  {f.ok ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-zinc-700" />
                  )}
                  <span className={f.ok ? "text-zinc-300" : "text-zinc-600"}>
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>
            {"external" in t.cta && t.cta.external ? (
              <a
                href={t.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  t.highlight
                    ? "mt-8 block rounded-full bg-white py-3 text-center text-sm font-medium text-black transition hover:bg-zinc-200"
                    : "mt-8 block rounded-full border border-line py-3 text-center text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                }
              >
                {t.cta.label}
              </a>
            ) : (
              <Link
                href={t.cta.href}
                className="mt-8 block rounded-full border border-line py-3 text-center text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
              >
                {t.cta.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-xl border border-line bg-surface p-6 text-center text-sm text-zinc-400">
        Payments are processed by{" "}
        <span className="text-zinc-200">Whop</span> (merchant of record — they
        handle checkout, receipts and taxes). After purchase your license key
        arrives instantly; activate it in the{" "}
        <Link href="/dashboard" className="text-brand-soft hover:underline">
          Dashboard
        </Link>{" "}
        to unlock everything. See our{" "}
        <Link href="/legal/refunds" className="text-brand-soft hover:underline">
          refund policy
        </Link>
        .
      </div>
    </div>
  );
}
