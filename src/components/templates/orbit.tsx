"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  MapPin,
  PenTool,
  Boxes,
  Gauge,
  Frame,
  Accessibility,
  Zap,
} from "lucide-react";

import { CometCard } from "@/components/library/comet-card";
import { FocusCards, type FocusCardItem } from "@/components/library/focus-cards";
import {
  CardHoverEffect,
  type CardHoverItem,
} from "@/components/library/card-hover-effect";
import { LogoMarquee, type MarqueeLogo } from "@/components/library/logo-marquee";
import {
  TimelineHorizontal,
  type Milestone,
} from "@/components/library/timeline-horizontal";
import {
  TestimonialCarousel,
  type Testimonial,
} from "@/components/library/testimonial-carousel";
import { CtaBanner } from "@/components/library/cta-banner";
import { MegaFooter } from "@/components/library/mega-footer";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* --------------------------------- Data ---------------------------------- */

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

type FeaturedProject = {
  index: string;
  tag: string;
  year: string;
  title: string;
  description: string;
  role: string;
  gradient: string;
  glow: string;
};

const FEATURED: FeaturedProject[] = [
  {
    index: "01",
    tag: "Design systems",
    year: "2025",
    title: "Vantage Design System",
    description:
      "A 240-component library and typed token pipeline that keeps nine product teams in sync from Figma straight through to production React.",
    role: "Lead design engineer",
    gradient:
      "radial-gradient(130% 120% at 20% 8%, #2a2065 0%, #171233 52%, #0a0814 100%)",
    glow: "#a99dff",
  },
  {
    index: "02",
    tag: "Product, Motion",
    year: "2024",
    title: "Cadence Analytics",
    description:
      "Rebuilt a dense analytics workspace around a real-time canvas with live cursors, so teams read the same numbers at the same moment.",
    role: "Design engineer",
    gradient:
      "radial-gradient(130% 120% at 78% 6%, #16345f 0%, #0f2038 54%, #080b1c 100%)",
    glow: "#5b8cff",
  },
];

const MORE_WORK: FocusCardItem[] = [
  {
    title: "Orbital Docs",
    meta: "Documentation platform, 2025",
    tag: "Web",
    gradient:
      "radial-gradient(130% 130% at 24% 12%, #8b7bff 0%, #4b30b8 40%, #14102c 80%, #0a0812 100%)",
    orbA: "rgba(124,108,255,0.65)",
    orbB: "rgba(91,140,255,0.5)",
  },
  {
    title: "Meridian Mobile",
    meta: "iOS companion app, 2024",
    tag: "Product",
    gradient:
      "radial-gradient(130% 130% at 78% 10%, #59b8ff 0%, #2350c8 42%, #0d1636 80%, #080a1c 100%)",
    orbA: "rgba(91,140,255,0.65)",
    orbB: "rgba(90,220,255,0.42)",
  },
  {
    title: "Parallel Identity",
    meta: "Brand and motion system, 2023",
    tag: "Brand",
    gradient:
      "radial-gradient(130% 130% at 28% 86%, #ff8a5b 0%, #b23f6c 42%, #3a123a 80%, #1a0a1e 100%)",
    orbA: "rgba(255,138,91,0.5)",
    orbB: "rgba(124,108,255,0.48)",
  },
  {
    title: "Halcyon Editor",
    meta: "Collaborative editor, 2022",
    tag: "Prototype",
    gradient:
      "radial-gradient(130% 130% at 82% 84%, #35d6c4 0%, #0f7d84 40%, #0b2f3a 80%, #071a20 100%)",
    orbA: "rgba(53,214,196,0.52)",
    orbB: "rgba(91,140,255,0.4)",
  },
];

const CAPABILITIES: CardHoverItem[] = [
  {
    icon: PenTool,
    title: "Interface design",
    description:
      "High-craft product UI from the first wireframe to a pixel-locked spec engineers can build without guessing.",
  },
  {
    icon: Boxes,
    title: "Design systems",
    description:
      "Typed tokens and components that stay in sync from Figma to code, documented so the whole team can move fast.",
  },
  {
    icon: Gauge,
    title: "Performance",
    description:
      "Motion and layout tuned to hold a clean 60fps, even on the three-year-old phones in your test drawer.",
  },
  {
    icon: Frame,
    title: "Prototyping",
    description:
      "Interactive prototypes real enough to user-test, then handed off as the source of truth for the build.",
  },
  {
    icon: Accessibility,
    title: "Accessibility",
    description:
      "WCAG 2.2 AA baked in from the start, with focus order and contrast audited on every pull request.",
  },
  {
    icon: Zap,
    title: "Front-end",
    description:
      "React, TypeScript and Framer Motion shipped to production, so the design survives contact with real data.",
  },
];

const TOOLS: MarqueeLogo[] = [
  { name: "Figma" },
  { name: "React" },
  { name: "TypeScript" },
  { name: "Framer Motion" },
  { name: "Storybook" },
  { name: "Vite" },
];

const CLIENTS: MarqueeLogo[] = [
  { name: "Vantage" },
  { name: "Cadence" },
  { name: "Meridian" },
  { name: "Parallel" },
  { name: "Halcyon" },
  { name: "Lattice" },
];

const EXPERIENCE: Milestone[] = [
  {
    date: "2019",
    title: "Lattice",
    description: "Second design hire, built the core UI kit.",
  },
  {
    date: "2021",
    title: "Parallel",
    description: "Led brand and motion for the 1.0 launch.",
  },
  {
    date: "2023",
    title: "Cadence",
    description: "Design engineer on the analytics rebuild.",
  },
  {
    date: "2025",
    title: "Vantage",
    description: "Lead design engineer, owned the system.",
  },
  {
    date: "2026",
    title: "Independent",
    description: "Consulting for teams that ship craft.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Ava is the rare engineer who art-directs and ships. She rebuilt our design system and the whole product felt intentional within a month.",
    name: "Daniel Osei",
    role: "VP Product, Cadence",
    gradient: "linear-gradient(135deg, #7c6cff, #5b8cff)",
    rating: 5,
  },
  {
    quote:
      "We handed Ava a messy analytics surface and got back something our customers genuinely enjoy using. The motion work alone lifted weekly engagement.",
    name: "Mira Kapoor",
    role: "Cofounder, Meridian",
    gradient: "linear-gradient(135deg, #5b8cff, #4bd6c9)",
    rating: 5,
  },
  {
    quote:
      "She thinks in systems and ships in pixels. Every handoff was production-ready, which almost never happens with a design partner.",
    name: "Sasha Romero",
    role: "Design Director, Vantage",
    gradient: "linear-gradient(135deg, #a678ff, #7c6cff)",
    rating: 5,
  },
];

// Hero orbit rings. Deterministic radii + speeds, no random at module scope.
const ORBITS = [
  { r: 205, size: 11, color: "#a99dff", dur: 26, dir: 1 },
  { r: 150, size: 8, color: "#5b8cff", dur: 18, dir: -1 },
  { r: 95, size: 6, color: "#4bd6c9", dur: 12, dir: 1 },
];
const VIEW = 440;
const CENTER = VIEW / 2;

/* ------------------------------- Primitives ------------------------------ */

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6", className)}>
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-brand-soft/80">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------- Header -------------------------------- */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-void/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand via-glow to-brand-soft text-[11px] font-semibold text-white ring-1 ring-white/20">
            AR
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            Ava Reed
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
          href="#contact"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:border-brand-soft/60 hover:text-brand-soft"
        >
          <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
          Email me
        </a>
      </Container>
    </header>
  );
}

/* ---------------------------------- Hero --------------------------------- */

function OrbitGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="orbit-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a99dff" />
            <stop offset="46%" stopColor="#5b8cff" />
            <stop offset="100%" stopColor="#1a1740" />
          </radialGradient>
        </defs>
        {ORBITS.map((o) => (
          <circle
            key={o.r}
            cx={CENTER}
            cy={CENTER}
            r={o.r}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={1}
          />
        ))}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={26}
          fill="url(#orbit-core)"
          opacity={0.9}
        />
      </svg>

      {/* soft center glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,108,255,0.4),transparent_70%)] blur-2xl" />

      {/* orbiting bodies */}
      {ORBITS.map((o) => {
        const topPct = ((CENTER - o.r) / VIEW) * 100;
        return (
          <div key={o.r} className="absolute inset-0">
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: o.dir * 360 }}
              transition={{ duration: o.dur, repeat: Infinity, ease: "linear" }}
            >
              <span
                className="absolute left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  top: `${topPct}%`,
                  width: o.size,
                  height: o.size,
                  background: o.color,
                  boxShadow: `0 0 14px 2px ${o.color}`,
                }}
              />
            </motion.div>
          </div>
        );
      })}

      {/* center monogram */}
      <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-void/80 text-sm font-semibold tracking-tight text-white backdrop-blur-sm">
        AR
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-[120%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,108,255,0.22),transparent_64%)] blur-3xl" />
        <div className="absolute right-[8%] top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(91,140,255,0.16),transparent_66%)] blur-3xl" />
      </div>

      <Container className="relative grid items-center gap-16 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-300"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Available for projects from June 2026
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.06 }}
            className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl"
          >
            Ava Reed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
            className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl"
          >
            Design engineer building calm, motion-led interfaces for teams that
            care about the last ten percent.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
            className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-500"
          >
            I work at the seam of design and front-end, turning dense product
            surfaces into interfaces people trust. Ten years shipping systems,
            most recently as lead design engineer at Vantage.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-void shadow-[0_10px_30px_-10px_rgba(255,255,255,0.4)] transition-transform hover:scale-[1.02] active:scale-95"
            >
              View selected work
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-white transition-colors hover:border-brand-soft/60 hover:text-brand-soft"
            >
              Start a project
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.32 }}
            className="mt-10 flex items-center gap-6 text-xs text-zinc-500"
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
              San Francisco, remote friendly
            </span>
            <span className="h-4 w-px bg-line" />
            <span>Design engineering, systems, motion</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="hidden lg:block"
        >
          <OrbitGraphic />
        </motion.div>
      </Container>
    </section>
  );
}

/* -------------------------------- Featured ------------------------------- */

function FeaturedVisual({ project }: { project: FeaturedProject }) {
  return (
    <div
      className="relative h-52 w-full overflow-hidden"
      style={{ background: project.gradient }}
    >
      {/* concentric rings */}
      <svg
        viewBox="0 0 400 208"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <g fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={1}>
          <ellipse cx={200} cy={104} rx={150} ry={66} />
          <ellipse cx={200} cy={104} rx={104} ry={44} />
          <ellipse cx={200} cy={104} rx={58} ry={24} />
        </g>
      </svg>

      {/* central body */}
      <div
        className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle at 34% 30%, #ffffff 0%, ${project.glow} 46%, #16143a 100%)`,
          boxShadow: `0 0 34px 4px ${project.glow}`,
        }}
      />

      {/* orbiting planet on the outer elliptical ring */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2">
        <div style={{ transform: "scaleY(0.44)", height: "100%", width: "100%" }}>
          <motion.div
            className="relative h-full w-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            <span
              className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full"
              style={{
                background: project.glow,
                boxShadow: `0 0 12px 2px ${project.glow}`,
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* readability scrim + index */}
      <span className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/10 to-transparent" />
      <span className="absolute left-4 top-4 font-mono text-xs tracking-widest text-white/50">
        {project.index}
      </span>
    </div>
  );
}

function FeaturedCard({ project }: { project: FeaturedProject }) {
  return (
    <CometCard className="h-full">
      <FeaturedVisual project={project} />
      <div
        className="relative bg-panel p-6"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em]"
          style={{ transform: "translateZ(28px)" }}
        >
          <span className="font-medium text-brand-soft">{project.tag}</span>
          <span className="text-zinc-500">{project.year}</span>
        </div>

        <h3
          className="mt-3 text-xl font-semibold text-white"
          style={{ transform: "translateZ(36px)" }}
        >
          {project.title}
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed text-zinc-400"
          style={{ transform: "translateZ(20px)" }}
        >
          {project.description}
        </p>

        <div
          className="mt-5 flex items-center justify-between border-t border-white/5 pt-4"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="text-xs text-zinc-500">{project.role}</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white transition-colors group-hover:text-brand-soft">
            View case study
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </div>
      </div>
    </CometCard>
  );
}

function FeaturedWork() {
  return (
    <section id="work" className="relative py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Two projects worth the deep dive"
            description="A closer look at the work that shaped how I build. Full case studies cover the research, the system, and the trade-offs behind every decision."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {FEATURED.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.08}>
              <FeaturedCard project={project} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <h3 className="text-lg font-semibold text-white">More projects</h3>
            <span className="text-xs text-zinc-500">
              Hover to focus a plate
            </span>
          </div>
          <FocusCards items={MORE_WORK} />
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------ Capabilities ----------------------------- */

function Capabilities() {
  return (
    <section id="capabilities" className="relative py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="How I work"
            title="One person, the full surface"
            description="From the first sketch to the merged pull request, I own the details that make an interface feel considered rather than assembled."
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-14">
          <CardHoverEffect items={CAPABILITIES} />
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------- Toolkit -------------------------------- */

function Toolkit() {
  return (
    <section className="relative border-y border-line/60 py-20">
      <Container>
        <Reveal className="text-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-500">
            The toolkit and the teams behind it
          </span>
        </Reveal>
      </Container>
      <Reveal delay={0.06} className="mt-10">
        <LogoMarquee topRow={TOOLS} bottomRow={CLIENTS} />
      </Reveal>
    </section>
  );
}

/* ------------------------------- Experience ------------------------------ */

function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="The path here"
            title="Ten years, five chapters"
            description="Each stop taught me a different half of the craft. The through line is the same: design that survives contact with real engineering."
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-14">
          <div className="h-[340px] w-full">
            <TimelineHorizontal milestones={EXPERIENCE} />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------ Testimonial ------------------------------ */

function Words() {
  return (
    <section className="relative py-24 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <SectionHeading
            eyebrow="In their words"
            title="What it is like to work together"
            description="I take on a handful of engagements at a time so every partner gets the same attention. Here is what a few of them said afterwards."
          />
        </Reveal>

        <Reveal delay={0.08} className="flex justify-center lg:justify-end">
          <TestimonialCarousel testimonials={TESTIMONIALS} className="max-w-lg" />
        </Reveal>
      </Container>
    </section>
  );
}

/* --------------------------------- Contact ------------------------------- */

function Contact() {
  return (
    <section id="contact" className="relative py-16 sm:py-20">
      <Container>
        <Reveal>
          <CtaBanner
            eyebrow="Let us work together"
            title="Have a product that deserves better craft?"
            description="I take on a small number of design engineering engagements each quarter. Tell me what you are building and where it hurts."
            ctaLabel="Start a project"
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-4">
          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-line bg-panel px-6 py-5 text-sm sm:flex-row">
            <span className="text-zinc-400">
              Prefer email? Reach me directly and I will reply within two days.
            </span>
            <a
              href="#top"
              className="inline-flex items-center gap-2 font-medium text-white transition-colors hover:text-brand-soft"
            >
              hello@avareed.studio
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* --------------------------------- Page ---------------------------------- */

export default function OrbitTemplate() {
  return (
    <div className="min-h-screen bg-void text-white">
      <SiteHeader />
      <main>
        <Hero />
        <FeaturedWork />
        <Capabilities />
        <Toolkit />
        <Experience />
        <Words />
        <Contact />
      </main>
      <Container className="pb-8 pt-4">
        <MegaFooter />
      </Container>
    </div>
  );
}
