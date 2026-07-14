import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Full page templates assembled from Lumenite UI components — included with Pro.",
};

const TEMPLATES = [
  {
    name: "Nova — SaaS Landing",
    desc: "Aurora hero, live feature bento, animated testimonials, pricing and FAQ. The page this whole site's homepage is built from.",
    blocks: ["Aurora Background", "Bento Grid", "Infinite Moving Cards", "Pricing Cards", "FAQ Accordion"],
    gradient: "from-brand/40 via-glow/20 to-transparent",
  },
  {
    name: "Pulse — Startup Hero Pack",
    desc: "Five interchangeable hero sections: lamp, spotlight, parallax grid, typewriter and gradient variants, each with matching nav.",
    blocks: ["Lamp Hero", "Spotlight Hero", "Hero Parallax Grid", "Floating Navbar", "Typewriter"],
    gradient: "from-emerald-400/30 via-brand/20 to-transparent",
  },
  {
    name: "Orbit — Portfolio",
    desc: "A dark portfolio with dock navigation, tilt project cards, scramble-text headings and a timeline about section.",
    blocks: ["Dock Menu", "3D Tilt Card", "Scramble Text", "Timeline", "Following Pointer"],
    gradient: "from-amber-400/25 via-rose-500/15 to-transparent",
  },
  {
    name: "Signal — Waitlist / Launch",
    desc: "Single-page launch site: shooting-star backdrop, number-ticker social proof, newsletter capture with success states.",
    blocks: ["Shooting Stars", "Number Ticker", "Newsletter Signup", "Shimmer Button", "Logo Marquee"],
    gradient: "from-glow/35 via-brand/20 to-transparent",
  },
];

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Templates</h1>
        <p className="mt-4 text-zinc-400">
          Complete pages assembled from the library — copy the whole thing and
          swap the copy. All templates are included with{" "}
          <Link href="/pricing" className="text-brand-soft hover:underline">Pro</Link>{" "}
          and downloadable from your dashboard.
        </p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {TEMPLATES.map((t) => (
          <div
            key={t.name}
            className="group overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-zinc-600"
          >
            <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${t.gradient}`}>
              {/* stylized page mock */}
              <div className="absolute inset-x-10 top-8 rounded-t-xl border border-white/10 bg-void/80 p-4 transition duration-500 group-hover:-translate-y-2">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400/60" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/60" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
                </div>
                <div className="mx-auto mt-5 h-3 w-2/3 rounded bg-white/15" />
                <div className="mx-auto mt-2 h-3 w-1/2 rounded bg-white/8" />
                <div className="mx-auto mt-4 h-6 w-24 rounded-full bg-brand/50" />
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="h-10 rounded bg-white/6" />
                  <div className="h-10 rounded bg-white/6" />
                  <div className="h-10 rounded bg-white/6" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-white">{t.name}</h2>
                <span className="rounded-full bg-brand/20 px-2.5 py-0.5 text-[11px] font-medium text-brand-soft">PRO</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{t.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {t.blocks.map((b) => (
                  <span key={b} className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-zinc-500">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-line bg-panel p-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          All four templates. {SITE.pricing.pro.label}. Once.
        </h2>
        <p className="max-w-md text-sm text-zinc-400">
          Included with Pro alongside every premium component — plus everything
          we release in the future.
        </p>
        <a
          href={SITE.whopCheckoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          Get Pro on Whop <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
