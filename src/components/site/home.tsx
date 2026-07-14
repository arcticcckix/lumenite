"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { REGISTRY, CATEGORIES } from "@/lib/registry";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LiquidGlass } from "@/components/library/liquid-glass-card";

/* ---------------- Hero ---------------- */

export function Hero() {
  const free = REGISTRY.filter((e) => e.tier === "free").length;
  const total = REGISTRY.length;

  const stats = [
    { value: total, label: "Components" },
    { value: CATEGORIES.length, label: "Categories" },
    { value: free, label: "Free forever" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* backdrop: grid + Aceternity-style spotlight beams */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 75% 60% at 50% 0%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 60% at 50% 0%, black 30%, transparent 100%)",
          }}
        />
        {/* angled spotlight beams */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute -left-[10%] -top-[30%] h-[48rem] w-[34rem] -rotate-[28deg] blur-[70px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(139,92,246,0.28), transparent 62%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
          className="absolute -right-[6%] -top-[24%] h-[42rem] w-[28rem] rotate-[22deg] blur-[80px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(91,140,255,0.2), transparent 62%)",
          }}
        />
        <div className="absolute left-1/2 top-[-24%] h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-32 text-center sm:pt-40">
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-balance text-5xl font-semibold leading-[1.04] tracking-tight sm:text-7xl"
        >
          Beautiful components.
          <span className="block bg-gradient-to-br from-brand-soft via-white to-glow bg-clip-text text-transparent">
            Copy, paste, ship.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-zinc-400"
        >
          A library of animated React components built with Tailwind CSS and
          Framer Motion. Free to start, with a Pro tier that makes any interface
          look considered and expensive.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-11 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/components"
            className="group flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Browse components
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-line px-7 py-3 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            View pricing
          </Link>
        </motion.div>

        {/* Apple-style spec row — no icons, no badges, thin dividers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mx-auto mt-16 flex max-w-md items-stretch justify-center divide-x divide-line rounded-2xl border border-line bg-surface/40 backdrop-blur"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex-1 px-6 py-5">
              <div className="text-2xl font-semibold tracking-tight">{s.value}</div>
              <div className="mt-1 text-xs text-zinc-500">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Live component wall ---------------- */

const WALL_SLUGS = [
  "spotlight-card",
  "lamp-hero",
  "infinite-moving-cards",
  "aurora-background",
  "tilt-card-3d",
  "shimmer-button",
  "typewriter",
  "meteors",
  "bento-grid",
  "dock-menu",
  "glare-card",
  "number-ticker",
];

export function ComponentWall() {
  const entries = WALL_SLUGS.map((s) =>
    REGISTRY.find((e) => e.slug === s)
  ).filter((e): e is NonNullable<typeof e> => !!e);

  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Everything here is live.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-zinc-400">
          These aren&apos;t screenshots. Every card is the real component,
          running right here in your browser. Click one to take the code.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => {
          const Demo = entry.component;
          return (
            <motion.div
              key={entry.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group"
            >
              <Link href={`/components/${entry.slug}`} className="block">
                <div className="relative h-[340px] overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 group-hover:border-zinc-600">
                  <div className="pointer-events-auto absolute inset-0 origin-center scale-[0.85]">
                    <Demo />
                  </div>
                  {entry.tier === "pro" && (
                    <span className="absolute right-3 top-3 z-20 rounded-full bg-brand/20 px-2.5 py-0.5 text-[11px] font-medium text-brand-soft backdrop-blur">
                      PRO
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between px-1">
                  <span className="text-sm font-medium text-zinc-200">
                    {entry.name}
                  </span>
                  <span className="text-xs text-zinc-600 transition group-hover:text-white">
                    View code →
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/components"
          className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
        >
          See all {REGISTRY.length} components{" "}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */

const FEATURES = [
  {
    title: "Copy, paste, done",
    body: "No package to install, no CLI, no config. Open a component, copy the source, drop it into your project. It just works.",
  },
  {
    title: "Framer Motion inside",
    body: "Springs, layout animations, scroll effects. Every interaction runs at 60fps and was tuned by hand.",
  },
  {
    title: "Tailwind native",
    body: "Pure Tailwind classes. Restyle anything by editing classNames. No CSS files, no theme lock-in.",
  },
  {
    title: `${CATEGORIES.length} categories`,
    body: "Heroes, cards, backgrounds, text, navigation, commerce, forms. A full system, not a grab bag.",
  },
  {
    title: "TypeScript strict",
    body: "Every component ships fully typed, with zero use of any. Autocomplete everything.",
  },
  {
    title: "One payment, forever",
    body: "Pro is a single price with no subscription. Every component and template we add later is already yours.",
  },
];

export function Features() {
  return (
    <section className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Made to drop straight into your stack.
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-surface p-8 transition hover:bg-panel"
            >
              <h3 className="font-medium text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Liquid Glass showcase ---------------- */

export function GlassShowcase() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Now with Liquid Glass.
            </h2>
            <p className="mt-4 text-zinc-400">
              Apple&apos;s translucent material, done properly: real backdrop
              refraction, a specular edge, and a highlight that tracks the
              cursor. The bar at the top of this page uses it too.
            </p>
          </div>
          <Link
            href="/components"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-6 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            Explore the glass set
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* vivid backdrop so the translucency and refraction are obvious */}
        <div className="relative overflow-hidden rounded-3xl border border-line">
          <div className="absolute inset-0">
            <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-[#ff5f8f] blur-[90px]" />
            <div className="absolute right-10 top-4 h-72 w-72 rounded-full bg-[#7c6cff] blur-[90px]" />
            <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#22d3ee] blur-[100px]" />
            <div className="absolute bottom-6 right-1/4 h-56 w-56 rounded-full bg-[#f5c451] blur-[90px]" />
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
          </div>

          <div className="relative flex min-h-[420px] flex-wrap items-center justify-center gap-6 p-10">
            <LiquidGlass className="w-[320px] p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-lg">
                  ✦
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-white">
                    Liquid Glass Card
                  </div>
                  <div className="text-xs text-white/70">Move your cursor</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/85">
                A frosted panel that bends the color behind it, catches light on
                its edge, and follows your pointer with a soft highlight.
              </p>
              <div className="mt-5 flex gap-2">
                <button className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white">
                  Copy code
                </button>
                <button className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/20">
                  Preview
                </button>
              </div>
            </LiquidGlass>

            <LiquidGlass className="w-[220px] p-6" refraction={false}>
              <div className="text-4xl font-semibold tracking-tight text-white">
                4
              </div>
              <div className="mt-1 text-xs text-white/70">glass components</div>
              <div className="mt-5 space-y-2 text-sm text-white/85">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" /> Card
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" /> Button
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" /> Dock
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" /> Nav
                </div>
              </div>
            </LiquidGlass>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Audit teaser ---------------- */

export function AuditTeaser() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Not sure where to start? Point us at your site.
            </h2>
            <p className="mt-5 text-zinc-400">
              Paste your URL. Lumenite scans every section of your page, scores
              the design, and shows the exact components to upgrade each one.
              Free, and no signup.
            </p>
            <Link
              href="/audit"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Audit my site
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#1c1c28" strokeWidth="12" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#a99dff" strokeWidth="12" strokeLinecap="round" strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * 0.38} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                  62
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-zinc-500">
                  Design score
                </div>
                <div className="text-sm text-zinc-300">6 upgrades found</div>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {[
                { l: "Hero section", ok: false },
                { l: "Testimonials", ok: false },
                { l: "Navigation", ok: true },
                { l: "Pricing", ok: true },
              ].map((r) => (
                <div
                  key={r.l}
                  className="flex items-center gap-2 rounded-lg border border-line bg-void px-3 py-2 text-sm"
                >
                  <span className={r.ok ? "text-emerald-400" : "text-amber-400"}>
                    {r.ok ? <Check className="h-3.5 w-3.5" /> : "!"}
                  </span>
                  <span className="text-zinc-300">{r.l}</span>
                  {!r.ok && (
                    <span className="ml-auto text-xs text-brand-soft">
                      upgrade →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing teaser ---------------- */

export function PricingTeaser() {
  return (
    <section className="border-t border-line bg-surface/40">
      <div className="relative mx-auto max-w-4xl px-6 py-28 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Half the price of the alternatives.
          <span className="block text-zinc-500">None of the subscription.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-zinc-400">
          {SITE.pricing.pro.label} once. Every Pro component, every template,
          and every future release, for good. Comparable libraries start at
          $199 and keep charging.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/pricing"
            className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            View pricing
          </Link>
          <Link
            href="/components"
            className="rounded-full border border-line px-8 py-3 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            Start free
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. The free tier is MIT-style licensed, so you can use those components in personal, client, and commercial projects with no attribution. Pro unlocks the premium components, full templates, and lifetime updates.",
  },
  {
    q: "What do I need to use it?",
    a: "A React project with Tailwind CSS and framer-motion installed. Next.js is the happy path, but anything that renders React works. Copy the code, paste it in, and you are done.",
  },
  {
    q: "How does Pro access work?",
    a: "Checkout happens through Whop. You get a license key instantly, enter it once in your Dashboard, and every Pro component's source unlocks in your browser.",
  },
  {
    q: "Is it a subscription?",
    a: "No. One payment gets you lifetime access and lifetime updates. We dislike subscription fatigue as much as you do.",
  },
  {
    q: "Can I use these in client work?",
    a: "Yes, on unlimited projects, commercial included. The only thing you cannot do is resell or redistribute the components themselves as a competing library.",
  },
  {
    q: "What about refunds?",
    a: "There is a 7-day, no-questions refund policy handled through Whop. See the refund policy for the details.",
  },
];

export function FAQ() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-3xl px-6 py-28">
        <h2 className="text-center text-3xl font-semibold tracking-tight">
          Questions, answered
        </h2>
        <div className="mt-12 space-y-3">
          {FAQS.map((f) => (
            <FAQItem key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-line bg-surface open:bg-panel">
      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-sm font-medium text-zinc-200 [&::-webkit-details-marker]:hidden">
        {q}
        <span
          className={cn(
            "text-zinc-500 transition-transform group-open:rotate-45"
          )}
        >
          +
        </span>
      </summary>
      <p className="px-6 pb-5 text-sm leading-relaxed text-zinc-400">{a}</p>
    </details>
  );
}
