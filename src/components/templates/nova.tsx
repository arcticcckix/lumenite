"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Database,
  GitBranch,
  Layers,
  LineChart,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Highlight } from "@/components/library/hero-highlight";
import { SpotlightNew } from "@/components/library/spotlight-new";
import { LogoMarquee, type MarqueeLogo } from "@/components/library/logo-marquee";
import { FeatureGrid, type FeatureItem } from "@/components/library/feature-grid";
import { BentoGrid, BentoCell } from "@/components/library/bento-grid";
import { MiniCharts } from "@/components/library/mini-charts";
import {
  MetricCardGroup,
  type Metric,
} from "@/components/library/metric-card-group";
import {
  AnimatedTestimonials,
  type Testimonial,
} from "@/components/library/animated-testimonials";
import { PricingCards, type PricingTier } from "@/components/library/pricing-cards";
import { FaqAccordion, type FaqItem } from "@/components/library/faq-accordion";
import { MegaFooter } from "@/components/library/mega-footer";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Deterministic sparkline data (Math.sin only, safe at module scope)        */
/* -------------------------------------------------------------------------- */

function spark(seed: number, dir: 1 | -1, n = 20): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const wiggle =
      Math.sin(i * 1.7 + seed) * 5 + Math.sin(i * 0.55 + seed * 2) * 2.8;
    const trend = dir === 1 ? t * 30 : (1 - t) * 30;
    out.push(Math.round((40 + trend + wiggle) * 100) / 100);
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/*  Shared reveal + section primitives                                        */
/* -------------------------------------------------------------------------- */

const reveal: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative w-full", className)}>
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-brand-soft">
      <span className="h-px w-6 bg-gradient-to-r from-transparent to-brand-soft/70" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left"
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-[2.6rem]">
        {title}
      </h2>
      <p className="text-[15px] leading-relaxed text-zinc-400">{subtitle}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = ["Product", "Features", "Pricing", "Customers", "Docs"];

const TOP_LOGOS: MarqueeLogo[] = [
  { name: "Northwind" },
  { name: "Cobalt" },
  { name: "Everly" },
  { name: "Runway" },
  { name: "Fathom" },
  { name: "Beacon" },
];

const BOTTOM_LOGOS: MarqueeLogo[] = [
  { name: "Loop" },
  { name: "Vantage" },
  { name: "Semaphore" },
  { name: "Harbor" },
  { name: "Ledger" },
  { name: "Cadence" },
];

const FEATURES: FeatureItem[] = [
  {
    icon: Zap,
    title: "Autotracking, zero setup",
    description:
      "Drop in one snippet and Nova captures every click, route change, and API call. No manual event code to maintain.",
  },
  {
    icon: Database,
    title: "Warehouse-native",
    description:
      "Model on top of Snowflake, BigQuery, or Postgres. Nova reads your source of truth instead of forking it.",
  },
  {
    icon: Users,
    title: "Cohorts and retention",
    description:
      "Build any cohort in a few clicks and watch retention curves update as your product and pricing evolve.",
  },
  {
    icon: LineChart,
    title: "Live dashboards",
    description:
      "Metrics refresh in seconds, not overnight. Pin the numbers that matter and share a link the whole team can open.",
  },
  {
    icon: Play,
    title: "Session replay in context",
    description:
      "Jump from any funnel drop-off straight into the exact sessions behind it, with console and network attached.",
  },
  {
    icon: ShieldCheck,
    title: "Governed by default",
    description:
      "SOC 2 Type II, SSO, and column-level permissions so analysts move fast without exposing sensitive fields.",
  },
];

const METRICS: Metric[] = [
  {
    label: "Weekly active",
    value: 48219,
    delta: "+14.2%",
    trendUp: true,
    icon: Users,
    series: spark(1.3, 1),
  },
  {
    label: "Activation",
    value: 62.4,
    suffix: "%",
    decimals: 1,
    delta: "+5.1%",
    trendUp: true,
    icon: Zap,
    series: spark(2.7, 1),
  },
  {
    label: "Net revenue",
    value: 128400,
    prefix: "$",
    delta: "+9.7%",
    trendUp: true,
    icon: LineChart,
    series: spark(4.1, 1),
  },
  {
    label: "Trial churn",
    value: 3204,
    delta: "-2.4%",
    trendUp: false,
    icon: GitBranch,
    series: spark(5.6, -1),
  },
];

const BENTO_CELLS: {
  icon: LucideIcon;
  title: string;
  description: string;
  span: string;
  featured?: boolean;
}[] = [
  {
    icon: Workflow,
    title: "Funnels that explain themselves",
    description:
      "Chain any sequence of events and Nova annotates each step with the drop-off, the cohort, and the sessions to watch.",
    span: "col-span-2 row-span-2",
    featured: true,
  },
  {
    icon: Bell,
    title: "Anomaly alerts",
    description: "Get paged the moment a metric breaks its own trend.",
    span: "col-span-1 row-span-1",
  },
  {
    icon: Users,
    title: "Auto-cohorts",
    description: "Nova groups users by behavior without a query.",
    span: "col-span-1 row-span-1",
  },
  {
    icon: Play,
    title: "Replay attached to every chart",
    description:
      "Click a point on any line and land inside the sessions that produced it.",
    span: "col-span-2 row-span-1",
  },
  {
    icon: Layers,
    title: "Reverse ETL",
    description: "Push cohorts back to your CRM and ad tools.",
    span: "col-span-1 row-span-1",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Nova replaced three dashboards and a standing data request. Our PMs finally answer their own questions the same day they ask them.",
    name: "Dana Whitfield",
    title: "VP Product, Northwind",
    gradient: "linear-gradient(135deg, #7c6cff, #5b8cff)",
  },
  {
    quote:
      "We connected our warehouse in an afternoon and shipped retention alerts by Friday. The time-to-first-insight is unlike anything we tried before.",
    name: "Marco Silva",
    title: "Head of Growth, Cobalt",
    gradient: "linear-gradient(135deg, #5bffb0, #5b8cff)",
  },
  {
    quote:
      "Session replay wired directly into the funnel is the feature I never knew I needed. Debugging activation went from days to minutes.",
    name: "Priya Anand",
    title: "Staff Engineer, Runway",
    gradient: "linear-gradient(135deg, #ff8a5b, #ff5b9c)",
  },
];

const STATS: { value: string; label: string }[] = [
  { value: "4,200+", label: "Product teams" },
  { value: "38B", label: "Events / month" },
  { value: "1.4s", label: "Median query" },
  { value: "99.98%", label: "Uptime" },
];

const PRICING: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "mo",
    description: "For solo builders validating an idea.",
    features: [
      "Up to 1M events / month",
      "3 dashboards",
      "7-day session replay",
      "Community support",
    ],
    cta: "Start free",
  },
  {
    name: "Scale",
    price: "$399",
    period: "mo",
    description: "For product teams shipping every week.",
    features: [
      "Up to 50M events / month",
      "Unlimited dashboards",
      "Warehouse sync + reverse ETL",
      "90-day session replay",
      "Anomaly alerts",
    ],
    highlighted: true,
    cta: "Start 14-day trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For orgs with security and scale needs.",
    features: [
      "Unlimited events",
      "SSO, SCIM, and audit logs",
      "Column-level permissions",
      "Dedicated success engineer",
    ],
    cta: "Talk to sales",
  },
];

const FAQS: FaqItem[] = [
  {
    question: "How long does it take to see data in Nova?",
    answer:
      "Most teams see live events within ten minutes of dropping in the snippet or connecting a warehouse. Historical backfills stream in behind the scenes without blocking your dashboards.",
  },
  {
    question: "Do I have to send you all of my data?",
    answer:
      "No. Nova is warehouse-native, so it can query Snowflake, BigQuery, or Postgres in place. You choose exactly which tables and columns are exposed, and sensitive fields can stay masked.",
  },
  {
    question: "Can non-technical teammates use it?",
    answer:
      "That is the point. Funnels, cohorts, and retention are all built with clicks, and every chart links to the underlying sessions so anyone can go from a number to the story behind it.",
  },
  {
    question: "What happens when I hit my event limit?",
    answer:
      "Nothing breaks. We keep ingesting and simply flag the overage in billing so you are never surprised by a dropped week of data. You can upgrade or set a hard cap whenever you like.",
  },
  {
    question: "Is Nova secure enough for enterprise?",
    answer:
      "Yes. Nova is SOC 2 Type II certified with SSO, SCIM provisioning, audit logs, and column-level permissions available on Enterprise plans.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Local UI pieces                                                            */
/* -------------------------------------------------------------------------- */

function NovaMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid h-7 w-7 place-items-center rounded-[9px] bg-gradient-to-br from-brand to-glow shadow-[0_0_18px_rgba(124,108,255,0.55)]",
        className
      )}
    >
      <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2.4} />
    </span>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-void/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <NovaMark />
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Nova
          </span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              type="button"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {link}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="hidden text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:block"
          >
            Sign in
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.03] active:scale-95"
          >
            Start free
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative">
      <SpotlightNew className="min-h-[88vh]">
        <div className="mx-auto flex min-h-[88vh] max-w-3xl flex-col items-center justify-center px-6 pb-24 pt-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-brand-soft backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(124,108,255,0.9)]" />
            Now with warehouse-native replay
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl"
          >
            Understand every user,
            <br className="hidden sm:block" />{" "}
            <Highlight delay={0.6}>without the data backlog</Highlight>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
            className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400"
          >
            Nova unifies product events, revenue, and session replay into one
            live workspace. Anyone on the team can answer why a number moved in
            seconds, not sprints.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <button
              type="button"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.03] active:scale-95"
            >
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-zinc-200 backdrop-blur-sm transition-colors hover:border-white/25 hover:text-white"
            >
              Book a demo
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.36, ease: EASE }}
            className="mt-6 text-xs text-zinc-500"
          >
            No credit card. 1M events free every month.
          </motion.p>
        </div>
      </SpotlightNew>
    </section>
  );
}

function LogoBand() {
  return (
    <Section className="py-16">
      <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
        Trusted by product teams at fast-moving companies
      </p>
      <LogoMarquee topRow={TOP_LOGOS} bottomRow={BOTTOM_LOGOS} className="mx-auto max-w-4xl" />
    </Section>
  );
}

function Features() {
  return (
    <Section id="features" className="py-24">
      <Reveal>
        <SectionHeading
          eyebrow="The platform"
          title="Everything you need to read your product"
          subtitle="Instrument once, model on your own warehouse, and give every team a self-serve path from a metric to the sessions behind it."
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-14">
        <FeatureGrid items={FEATURES} />
      </Reveal>
    </Section>
  );
}

function Showcase() {
  return (
    <Section className="py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <Eyebrow>Live workspace</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-[2.4rem]">
            Your metrics, updating while you watch
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
            Revenue, sessions, and conversion refresh continuously on one
            surface. Switch a range and the whole board recomputes in under two
            seconds, so the number on the wall is always the number right now.
          </p>
          <ul className="mt-7 space-y-4">
            {[
              {
                icon: LineChart,
                text: "Streaming charts with sub-second refresh, no scheduled rebuilds.",
              },
              {
                icon: Bell,
                text: "Threshold and anomaly alerts routed to Slack, email, or PagerDuty.",
              },
              {
                icon: GitBranch,
                text: "Branch a dashboard, test a metric definition, then merge it in.",
              },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <li key={row.text} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand-soft ring-1 ring-inset ring-brand/20">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm leading-relaxed text-zinc-300">
                    {row.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <MiniCharts />
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-16">
        <MetricCardGroup metrics={METRICS} />
      </Reveal>
    </Section>
  );
}

function Capabilities() {
  return (
    <Section className="py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Built for the whole funnel"
          title="One workspace, from first touch to renewal"
          subtitle="Nova connects acquisition, activation, and retention so the story never breaks across tools."
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-14">
        <BentoGrid className="mx-auto max-w-4xl">
          {BENTO_CELLS.map((cell) => {
            const Icon = cell.icon;
            return (
              <BentoCell
                key={cell.title}
                className={cell.span}
                featured={cell.featured}
                icon={<Icon className="h-4 w-4" />}
                title={cell.title}
                description={cell.description}
              />
            );
          })}
        </BentoGrid>
      </Reveal>
    </Section>
  );
}

function SocialProof() {
  return (
    <Section className="py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>Loved by operators</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-[2.4rem]">
            The workspace teams stop arguing with
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
            When everyone reads from the same live source of truth, the debate
            moves from whose number is right to what to build next.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-2">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-semibold tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex justify-center lg:justify-end">
          <AnimatedTestimonials testimonials={TESTIMONIALS} />
        </Reveal>
      </div>
    </Section>
  );
}

function Pricing() {
  return (
    <Section id="pricing" className="py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Pricing"
          title="Start free, scale when it pays off"
          subtitle="Every plan includes autotracking, dashboards, and session replay. Upgrade only when your event volume does."
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-16">
        <PricingCards tiers={PRICING} />
      </Reveal>
    </Section>
  );
}

function Faq() {
  return (
    <Section className="py-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Answers before you ask"
            subtitle="Still unsure about something? Our team replies to every trial in under a business day."
            align="left"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <FaqAccordion items={FAQS} />
        </Reveal>
      </div>
    </Section>
  );
}

function CtaBand() {
  return (
    <Section className="py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-b from-brand/12 via-panel to-panel px-8 py-16 text-center shadow-[0_0_60px_-20px_rgba(124,108,255,0.6)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[70%] -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(124,108,255,0.35), transparent 68%)",
            }}
          />
          <div className="relative flex flex-col items-center">
            <NovaMark className="h-10 w-10 rounded-xl" />
            <h2 className="mt-6 max-w-xl text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl">
              See your product clearly, starting today
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-400">
              Connect a source, drop in the snippet, and watch the first cohorts
              land in minutes. No card, no sales call required.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <button
                type="button"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.03] active:scale-95"
              >
                Start for free
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-white/25 hover:text-white"
              >
                Talk to sales
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function NovaTemplate() {
  return (
    <div className="min-h-screen w-full bg-void text-white antialiased">
      <Nav />
      <main>
        <Hero />
        <LogoBand />
        <Features />
        <Showcase />
        <Capabilities />
        <SocialProof />
        <Pricing />
        <Faq />
        <CtaBand />
      </main>
      <MegaFooter />
    </div>
  );
}
