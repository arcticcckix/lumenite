"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Copy, Infinity as InfinityIcon, Layers, Palette, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { REGISTRY, CATEGORIES } from "@/lib/registry";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ---------------- Hero ---------------- */

export function Hero() {
  const free = REGISTRY.filter((e) => e.tier === "free").length;
  const total = REGISTRY.length;
  return (
    <section className="relative overflow-hidden">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand/20 blur-[160px]" />
        <div className="absolute left-[15%] top-[30%] h-[300px] w-[300px] rounded-full bg-glow/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-28 text-center sm:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-1.5 text-xs text-zinc-400 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-soft" />
          {total}+ animated components · {free} free forever
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.06] tracking-tight sm:text-7xl"
        >
          Make your website look
          <span className="block bg-gradient-to-r from-brand-soft via-white to-glow bg-clip-text text-transparent">
            10x more expensive
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400"
        >
          Copy-paste stunning React components built with Tailwind CSS and
          Framer Motion. No install, no config, no design skills required —
          just ship interfaces people screenshot.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
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
            className="rounded-full border border-line bg-panel/60 px-7 py-3 text-sm text-zinc-300 backdrop-blur transition hover:border-zinc-600 hover:text-white"
          >
            Get Pro — {SITE.pricing.pro.label} once
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-6 text-xs text-zinc-600"
        >
          <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> MIT-licensed free tier</span>
          <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> React 19 + Tailwind v4</span>
          <span className="hidden items-center gap-1.5 sm:flex"><Check className="h-3.5 w-3.5 text-emerald-500" /> One-time payment</span>
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
  const entries = WALL_SLUGS.map((s) => REGISTRY.find((e) => e.slug === s)).filter(
    (e): e is NonNullable<typeof e> => !!e
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Everything is <span className="text-brand-soft">live</span>. Hover around.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          These aren&apos;t screenshots — every card below is the real component
          running in your browser. Click any of them to grab the code.
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
                  <span className="text-sm font-medium text-zinc-200">{entry.name}</span>
                  <span className="text-xs text-zinc-600 transition group-hover:text-brand-soft">
                    View code →
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/components"
          className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
        >
          See all {REGISTRY.length} components <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- How it works / features ---------------- */

const FEATURES = [
  { icon: Copy, title: "Copy. Paste. Done.", body: "No package to install, no CLI, no config. Open a component, copy the source, drop it in your project. It just works." },
  { icon: Zap, title: "Framer Motion powered", body: "Springs, layout animations, scroll effects — every interaction is buttery 60fps, tuned by hand." },
  { icon: Palette, title: "Tailwind-native", body: "Pure Tailwind classes. Restyle anything by editing classNames — no CSS files, no theme lock-in." },
  { icon: Layers, title: `${CATEGORIES.length} categories`, body: "Heroes, cards, backgrounds, text effects, navigation, forms, testimonials — a full design system of wow." },
  { icon: ShieldCheck, title: "TypeScript strict", body: "Every component ships fully typed with zero `any`. Autocomplete everything." },
  { icon: InfinityIcon, title: "Lifetime updates", body: "Pro is a one-time payment. Every new component and template we ever add is yours, forever." },
];

export function Features() {
  return (
    <section className="border-t border-line bg-surface/50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for developers who&apos;d rather ship than fiddle
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="group bg-surface p-8 transition hover:bg-panel">
              <f.icon className="h-5 w-5 text-brand-soft transition group-hover:scale-110" />
              <h3 className="mt-4 font-medium text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing teaser ---------------- */

export function PricingTeaser() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[140px]" />
      <div className="relative mx-auto max-w-4xl px-6 py-28 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Half the price of the alternatives.
          <span className="block text-zinc-500">None of the subscription.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-zinc-400">
          {SITE.pricing.pro.label} once. Every Pro component, every template,
          every future release. Compare that to $199+ elsewhere.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/pricing"
            className="rounded-full bg-gradient-to-r from-brand to-glow px-8 py-3 text-sm font-medium text-white shadow-[0_0_40px_rgba(124,108,255,0.4)] transition hover:shadow-[0_0_60px_rgba(124,108,255,0.6)]"
          >
            See pricing
          </Link>
          <Link
            href="/components"
            className="rounded-full border border-line px-8 py-3 text-sm text-zinc-300 transition hover:text-white"
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
  { q: "Is it really free?", a: "Yes — the free tier is MIT-style licensed. Use those components in personal, client, and commercial projects with no attribution. Pro unlocks the premium components, full templates, and lifetime updates." },
  { q: "What do I need to use it?", a: "A React project with Tailwind CSS and framer-motion installed. Next.js is the happy path, but anything that renders React works. Copy the code, paste it in, done." },
  { q: "How does Pro access work?", a: "Checkout happens through Whop. You get a license key instantly; enter it once in your Dashboard and every Pro component's source unlocks in your browser." },
  { q: "Is it a subscription?", a: "No. One payment, lifetime access, lifetime updates. We hate subscription fatigue as much as you do." },
  { q: "Can I use these in client work?", a: "Absolutely — unlimited projects, commercial included. The only thing you can't do is resell or redistribute the components themselves as a library." },
  { q: "What about refunds?", a: "7-day no-questions refund policy, handled through Whop. See the refund policy for details." },
];

export function FAQ() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-3xl px-6 py-24">
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
        <span className={cn("text-zinc-500 transition-transform group-open:rotate-45")}>+</span>
      </summary>
      <p className="px-6 pb-5 text-sm leading-relaxed text-zinc-400">{a}</p>
    </details>
  );
}
