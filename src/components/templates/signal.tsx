"use client";

import { motion } from "framer-motion";
import {
  Radar,
  Bell,
  Filter,
  Workflow,
  Plug,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { ShootingStars } from "@/components/library/shooting-stars";
import { Particles } from "@/components/library/particles";
import { NewsletterSignup } from "@/components/library/newsletter-signup";
import { LiveVisitorCount } from "@/components/library/live-visitor-count";
import { StatsGrid, type StatItem } from "@/components/library/stats-grid";
import { FeatureGrid, type FeatureItem } from "@/components/library/feature-grid";
import { HowItWorks, type Step } from "@/components/library/how-it-works";
import { FaqAccordion, type FaqItem } from "@/components/library/faq-accordion";
import { MegaFooter } from "@/components/library/mega-footer";

/* -------------------------------------------------------------------------- */
/*  Brand mark                                                                */
/* -------------------------------------------------------------------------- */

function SignalMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-brand-soft"
    >
      <circle cx="12" cy="18" r="2.4" fill="currentColor" />
      <path
        d="M6.5 15.4a7.5 7.5 0 0 1 11 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M3.4 12.1a12 12 0 0 1 17.2 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

function Wordmark() {
  return (
    <div className="inline-flex items-center gap-2">
      <SignalMark />
      <span className="text-[15px] font-semibold tracking-tight text-white">
        Signal
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared section heading                                                    */
/* -------------------------------------------------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand-soft/70"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
        className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
      >
        {title}
      </motion.h2>
      {blurb && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400"
        >
          {blurb}
        </motion.p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const WAITLIST_STATS: StatItem[] = [
  { label: "On the waitlist", value: 4283, suffix: "+" },
  { label: "Design partners", value: 42 },
  { label: "Signals modeled in beta", value: 12, suffix: "M" },
  { label: "Hours saved / rep / week", value: 6 },
];

const FEATURES: FeatureItem[] = [
  {
    icon: Radar,
    title: "Intent radar",
    description:
      "Every account is scored by how close it is to buying, then reordered so the ten that matter sit at the top of your day.",
  },
  {
    icon: Bell,
    title: "Moment alerts",
    description:
      "Get pinged the instant an account crosses a threshold you care about, delivered to Slack or your inbox in real time.",
  },
  {
    icon: Filter,
    title: "Noise removed",
    description:
      "Signal strips out the idle logins and tire-kickers so the feed only ever shows movement worth a conversation.",
  },
  {
    icon: Workflow,
    title: "Routed automatically",
    description:
      "Hot accounts land with the right owner the second they heat up, with the context needed to open the thread.",
  },
  {
    icon: Plug,
    title: "Connects to your stack",
    description:
      "Point it at your warehouse, event stream, or CRM. No new tracking to install, no six-week integration project.",
  },
  {
    icon: LineChart,
    title: "Attribution you trust",
    description:
      "Every touch is tied back to revenue, so you can prove which signals actually turned into closed pipeline.",
  },
];

const STEPS: Step[] = [
  {
    title: "Join the list",
    description:
      "Drop your email. We onboard new teams in weekly cohorts, biggest use cases first.",
  },
  {
    title: "Connect your product",
    description:
      "Point Signal at your warehouse or event stream. Your first scored feed lands within a day.",
  },
  {
    title: "Work the top of the list",
    description:
      "Open Signal each morning to the accounts most likely to move. Close the loop, and it keeps learning.",
  },
];

const FAQS: FaqItem[] = [
  {
    question: "When does Signal launch?",
    answer:
      "Private beta is open to design partners now, with general early access rolling out through Q2 2026. Waitlist members get access in the order they join, cohort by cohort.",
  },
  {
    question: "What does Signal need to get started?",
    answer:
      "A read-only connection to wherever your product usage already lives, a warehouse table, an event stream, or your CRM. There is nothing new to instrument, and your first scored feed arrives inside a day.",
  },
  {
    question: "Is my product data safe?",
    answer:
      "Signal reads usage data through scoped, read-only credentials and never writes back to your systems. Data is encrypted in transit and at rest, and you can revoke access at any time.",
  },
  {
    question: "How is this different from the lead scoring I already have?",
    answer:
      "Most lead scores rank contacts on static firmographics. Signal watches live product behavior and tells you the day an account changes its mind, which is the part a fixed score can never capture.",
  },
  {
    question: "What will it cost?",
    answer:
      "Pricing scales with the number of accounts you track, and waitlist members lock in launch pricing for their first year. Design partners in the private beta pay nothing during the program.",
  },
  {
    question: "Can I get in sooner?",
    answer:
      "Yes. Teams that connect a data source during onboarding move to the front of the cohort, because a live feed helps us tune the models faster.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Template                                                                  */
/* -------------------------------------------------------------------------- */

export default function SignalTemplate() {
  return (
    <div className="min-h-screen w-full bg-void text-white">
      {/* ------------------------------------------------------------------ */}
      {/*  Hero                                                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative flex min-h-[92vh] w-full items-center justify-center overflow-hidden">
        <ShootingStars />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, rgba(124,108,255,0.18), transparent 55%), radial-gradient(90% 70% at 50% 120%, rgba(91,140,255,0.12), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void"
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Wordmark />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-panel/70 px-3.5 py-1.5 backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
                animate={{ scale: [1, 2.4], opacity: [0.65, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-zinc-300">
              Private beta, general access opening Q2 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
            className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl"
          >
            Know the exact moment
            <br className="hidden sm:block" /> an account is ready to buy.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400"
          >
            Signal reads every session, click, and integration inside your
            product and turns it into a ranked feed of buying intent. No
            dashboards to babysit. Just the next best account, the moment it
            matters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
            className="mt-9 flex w-full flex-col items-center"
          >
            <NewsletterSignup className="mx-auto text-left" />
            <p className="mt-4 text-sm text-zinc-500">
              Join 4,200+ operators on the waitlist. One launch email, no spam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Live proof                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative w-full border-t border-line/60 py-24 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand-soft/70">
              Live in the beta
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Momentum you can watch in real time.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400">
              This is the same live surface our design partners open every
              morning. Accounts move in and out as their behavior shifts, and
              the feed reranks itself the instant something changes. Nothing to
              refresh, nothing to configure.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Scored the second an event lands, not on an overnight batch",
                "Every account traced back to the signal that surfaced it",
                "Built to hold steady from ten accounts to ten thousand",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-zinc-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LiveVisitorCount baseCount={1840} overflowCount={216} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Stats band                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative w-full py-20">
        <div className="mx-auto max-w-6xl px-6">
          <StatsGrid stats={WAITLIST_STATS} />
          <p className="mt-4 text-center text-xs text-zinc-600">
            Figures reflect the private beta as of this quarter.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  What's coming                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative w-full py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="What's coming"
            title="Everything Signal does the day it launches."
            blurb="One feed that turns raw product usage into the next conversation worth having, wired into the tools your team already lives in."
          />
          <div className="mt-14">
            <FeatureGrid items={FEATURES} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  How early access works                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative w-full border-t border-line/60 py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading
            eyebrow="Early access"
            title="From waitlist to working feed in three steps."
            blurb="We onboard in small cohorts so every new team gets a real setup, not a self-serve form and a shrug."
          />
          <div className="mt-16 flex justify-center">
            <HowItWorks steps={STEPS} className="max-w-3xl" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  FAQ                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative w-full py-24 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="Before you sign up"
            title="Questions from the waitlist."
          />
          <div className="mt-12">
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Final CTA                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative w-full overflow-hidden border-t border-line/60">
        <Particles className="opacity-70" quantity={120} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 100% at 50% 0%, rgba(124,108,255,0.14), transparent 60%)",
          }}
        />
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 py-28 text-center">
          <div className="mb-6">
            <Wordmark />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Be first in line when Signal opens.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400">
            Reserve your spot now. Cohorts move in the order they were joined,
            and connecting a data source moves you to the front.
          </p>
          <div className="mt-9 flex w-full flex-col items-center">
            <NewsletterSignup className="mx-auto text-left" />
            <a
              href="#"
              className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-soft"
            >
              Read the launch notes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Footer                                                            */}
      {/* ------------------------------------------------------------------ */}
      <MegaFooter className="rounded-none" />
    </div>
  );
}
