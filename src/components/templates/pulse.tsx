"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  Code2,
  Globe,
  LineChart,
  Play,
  Plug,
  Radio,
  ShieldCheck,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

import { LampHero } from "@/components/library/lamp-hero";
import { HowItWorks, type Step } from "@/components/library/how-it-works";
import { StatsGrid, type StatItem } from "@/components/library/stats-grid";
import {
  FeatureSpotlight,
  type Feature,
} from "@/components/library/feature-spotlight";
import { FeatureGrid, type FeatureItem } from "@/components/library/feature-grid";
import {
  AnimatedTestimonials,
  type Testimonial,
} from "@/components/library/animated-testimonials";
import { CtaBanner } from "@/components/library/cta-banner";
import { MegaFooter } from "@/components/library/mega-footer";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------- shared bits ------------------------------ */

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left"
      )}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-soft">
        <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_var(--color-brand)]" />
        {eyebrow}
      </span>
      <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}

/* ----------------------------------- nav ---------------------------------- */

const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Proof", href: "#proof" },
];

function PulseNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-void/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-glow shadow-[0_0_18px_rgba(124,108,255,0.55)]">
            <Activity className="h-4 w-4 text-white" strokeWidth={2.4} />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            Pulse
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#cta"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-void transition-colors hover:bg-white/90"
        >
          Start free
        </a>
      </div>
    </header>
  );
}

/* --------------------------------- content -------------------------------- */

const TRUST_LOGOS = ["Northwind", "Loop", "Cadence", "Vela", "Beacon", "Orbit"];

const STEPS: Step[] = [
  {
    title: "Instrument in five minutes",
    description:
      "Drop one snippet into your app. Pulse captures events as they fire, with no schema to define up front.",
    icon: <Code2 className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Watch it come alive",
    description:
      "Dashboards render the moment data lands. Filter, cohort, and drill in without waiting on a query queue.",
    icon: <LineChart className="h-6 w-6" strokeWidth={1.75} />,
  },
  {
    title: "Act before it hurts",
    description:
      "Set a threshold once. Pulse pages the right person the second a metric drifts, chart already attached.",
    icon: <Bell className="h-6 w-6" strokeWidth={1.75} />,
  },
];

const STATS: StatItem[] = [
  { label: "Peak events ingested", value: 4, suffix: "M/s" },
  { label: "Median query latency", value: 12, suffix: "ms" },
  { label: "Product teams on Pulse", value: 30, suffix: "K+" },
  { label: "Uptime, last 12 months", value: 99, suffix: ".99%" },
];

const SPOTLIGHT_FEATURES: Feature[] = [
  {
    icon: Radio,
    title: "Live event stream",
    metric: "0 lag",
    caption:
      "Events surface the instant they fire. No batching window, no five minute gap between an action and its answer.",
  },
  {
    icon: BarChart3,
    title: "Instant cohorts",
    metric: "< 50ms",
    caption:
      "Slice any funnel by plan, region, or release and the chart repaints before you lift your finger off the filter.",
  },
  {
    icon: Bell,
    title: "Signal, not noise",
    metric: "Auto",
    caption:
      "Pulse learns each metric's normal rhythm and only pages you on a real shift, not when traffic simply dips at night.",
  },
  {
    icon: Workflow,
    title: "Pipe it anywhere",
    metric: "40+",
    caption:
      "Forward clean, typed events to your warehouse, Slack, or a webhook with a toggle instead of a data pipeline ticket.",
  },
];

const SHOWCASE_POINTS = [
  "One screen the whole launch room can watch together",
  "Product, growth, and on-call share the same numbers",
  "Every chart is a live query, never a stale screenshot",
];

const CAPABILITIES: FeatureItem[] = [
  {
    icon: Zap,
    title: "Sub-second ingestion",
    description:
      "From client call to visible datapoint in under a second, at any volume you throw at it.",
  },
  {
    icon: ShieldCheck,
    title: "PII redaction at the edge",
    description:
      "Mask sensitive fields before a single byte reaches storage, so compliance stays out of your way.",
  },
  {
    icon: LineChart,
    title: "Retention, not sampling",
    description:
      "Query raw events for thirteen months. No rollups quietly hiding the outliers that matter.",
  },
  {
    icon: Users,
    title: "Unlimited seats",
    description:
      "Invite the whole company. Pulse never charges per viewer, so nobody gets locked out of the data.",
  },
  {
    icon: Globe,
    title: "Regioned by default",
    description:
      "Pin data to US or EU regions with a dropdown and keep your data residency reviews short.",
  },
  {
    icon: Plug,
    title: "SDKs everywhere",
    description:
      "First-party libraries for web, iOS, Android, Node, Python, and Go, all versioned together.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We caught a checkout regression eleven minutes after deploy, before a single customer emailed us. Pulse paid for itself that afternoon.",
    name: "Dana Okafor",
    title: "Head of Growth, Loop",
    gradient: "linear-gradient(135deg, #7c6cff, #5b8cff)",
  },
  {
    quote:
      "Our on-call went from guessing to knowing. The alerts stay quiet until they matter, then they hand you the exact chart.",
    name: "Ravi Menon",
    title: "Staff Engineer, Cadence",
    gradient: "linear-gradient(135deg, #34d399, #7c6cff)",
  },
  {
    quote:
      "Launch day used to mean fifteen dashboards and a prayer. Now the whole room watches one screen and actually breathes.",
    name: "Sofia Bianchi",
    title: "VP Product, Northwind",
    gradient: "linear-gradient(135deg, #ff8a5b, #ff5b9c)",
  },
];

/* --------------------------------- template ------------------------------- */

export default function PulseTemplate() {
  return (
    <div id="top" className="min-h-screen bg-void text-white">
      <PulseNav />

      {/* Hero */}
      <section className="relative">
        <LampHero
          title="Your product, in real time"
          subtitle="Pulse streams every event and anomaly into one live view, so your team reacts in seconds instead of sprints."
        />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
          className="relative z-10 -mt-16 flex flex-col items-center gap-5 px-6 pb-8 text-center"
        >
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#cta"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-void shadow-[0_10px_40px_-12px_rgba(124,108,255,0.7)] transition-colors hover:bg-white/90"
            >
              Start free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-6 py-3 text-sm font-medium text-zinc-200 transition-colors hover:text-white"
            >
              <Play className="h-4 w-4 text-brand-soft" />
              Watch the 2 minute demo
            </a>
          </div>
          <p className="text-xs text-zinc-500">
            No credit card required. Full Pro features free for 14 days.
          </p>
        </motion.div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-line/60 bg-surface/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-600">
            Powering real-time decisions at fast-moving teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {TRUST_LOGOS.map((name) => (
              <span
                key={name}
                className="text-base font-semibold tracking-tight text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="From install to insight in one sitting"
          description="No warehouse to provision, no data team to book. Three steps and your product is streaming."
        />
        <div className="mt-16 flex justify-center">
          <HowItWorks steps={STEPS} className="max-w-4xl" />
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-line/60 bg-surface/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <StatsGrid stats={STATS} />
          <p className="mt-6 text-center text-xs text-zinc-600">
            Measured across production traffic for the trailing twelve months.
          </p>
        </div>
      </section>

      {/* Feature showcase */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="One live view"
              title="The whole team, watching the same heartbeat"
              description="Stop pasting screenshots into Slack. Pulse gives everyone the same real-time picture, updated as fast as your users move."
            />
            <ul className="mt-8 space-y-4">
              {SHOWCASE_POINTS.map((point, i) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: EASE }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-soft">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed text-zinc-300">
                    {point}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="h-[440px] w-full"
          >
            <FeatureSpotlight features={SPOTLIGHT_FEATURES} />
          </motion.div>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="mx-auto max-w-6xl px-6 pb-24 sm:pb-28">
        <SectionHeading
          eyebrow="Under the hood"
          title="Everything you need to launch on live data"
          description="The infrastructure work is already done. You get the fast path from the first event to a decision."
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-14"
        >
          <FeatureGrid items={CAPABILITIES} />
        </motion.div>
      </section>

      {/* Testimonials */}
      <section
        id="proof"
        className="border-t border-line/60 bg-surface/30 py-24 sm:py-28"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6">
          <SectionHeading
            eyebrow="Proof"
            title="Teams that launched on Pulse"
            description="Growth leads, on-call engineers, and product heads who traded guesswork for a live signal."
          />
          <div className="mt-14 flex justify-center">
            <AnimatedTestimonials testimonials={TESTIMONIALS} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-5xl px-6 py-24 sm:py-28">
        <CtaBanner
          eyebrow="Public beta"
          title="Put your product on Pulse"
          description="Instrument in five minutes, watch your first live dashboard fill in, and never launch blind again."
          ctaLabel="Start free"
        />
      </section>

      {/* Footer */}
      <div className="mx-auto max-w-6xl px-6">
        <MegaFooter />
      </div>
    </div>
  );
}
