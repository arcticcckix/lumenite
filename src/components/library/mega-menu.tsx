"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Blocks,
  BookOpen,
  Bot,
  Boxes,
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  Code,
  Compass,
  Gauge,
  GitBranch,
  Hexagon,
  KeyRound,
  Layers,
  LifeBuoy,
  LineChart,
  MessagesSquare,
  Newspaper,
  Package,
  Puzzle,
  Rocket,
  ShoppingBag,
  Terminal,
  TrendingUp,
  Users,
  Webhook,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MenuLink = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type MenuColumn = {
  heading: string;
  links: MenuLink[];
};

type MenuPromo = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
};

type NavItem = {
  label: string;
  columns: MenuColumn[];
  promo: MenuPromo;
};

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_ITEMS: NavItem[] = [
  {
    label: "Product",
    columns: [
      {
        heading: "Platform",
        links: [
          {
            icon: Layers,
            title: "Orchestration",
            description: "Coordinate agents across every environment",
          },
          {
            icon: Workflow,
            title: "Pipelines",
            description: "Compose multi-step jobs with typed inputs",
          },
          {
            icon: Gauge,
            title: "Observability",
            description: "Trace latency, cost, and tokens in real time",
          },
        ],
      },
      {
        heading: "Building blocks",
        links: [
          {
            icon: Boxes,
            title: "Components",
            description: "Prebuilt UI primitives ready to drop in",
          },
          {
            icon: Blocks,
            title: "Templates",
            description: "Production starters for common surfaces",
          },
          {
            icon: Puzzle,
            title: "Integrations",
            description: "Connect the tools your team already uses",
          },
        ],
      },
    ],
    promo: {
      icon: Zap,
      eyebrow: "New",
      title: "Edge runtime v2",
      description: "Ship globally with 40ms cold starts.",
      cta: "Read the changelog",
    },
  },
  {
    label: "Solutions",
    columns: [
      {
        heading: "By team",
        links: [
          {
            icon: Rocket,
            title: "Startups",
            description: "Go from prototype to production in a weekend",
          },
          {
            icon: Building2,
            title: "Enterprise",
            description: "SOC 2 controls, SSO, and audit logs",
          },
          {
            icon: Users,
            title: "Agencies",
            description: "Manage many client workspaces at once",
          },
        ],
      },
      {
        heading: "By use case",
        links: [
          {
            icon: ShoppingBag,
            title: "Commerce",
            description: "Storefronts that convert on every device",
          },
          {
            icon: LineChart,
            title: "Analytics",
            description: "Dashboards your operators actually read",
          },
          {
            icon: Bot,
            title: "AI apps",
            description: "Chat and agent surfaces with guardrails",
          },
        ],
      },
    ],
    promo: {
      icon: TrendingUp,
      eyebrow: "Guide",
      title: "Scaling to a million users",
      description: "The architecture behind our busiest tenants.",
      cta: "Open the playbook",
    },
  },
  {
    label: "Developers",
    columns: [
      {
        heading: "Get started",
        links: [
          {
            icon: Terminal,
            title: "Quickstart",
            description: "Deploy your first project in five minutes",
          },
          {
            icon: BookOpen,
            title: "Documentation",
            description: "Guides, references, and API details",
          },
          {
            icon: Code,
            title: "Examples",
            description: "Copy and paste snippets for every framework",
          },
        ],
      },
      {
        heading: "Reference",
        links: [
          {
            icon: Webhook,
            title: "API",
            description: "Typed REST and streaming endpoints",
          },
          {
            icon: KeyRound,
            title: "Authentication",
            description: "Tokens, scopes, and rotation policies",
          },
          {
            icon: GitBranch,
            title: "CLI",
            description: "Automate deploys from your terminal",
          },
        ],
      },
    ],
    promo: {
      icon: Package,
      eyebrow: "SDK",
      title: "TypeScript client 3.0",
      description: "Fully typed, tree shakeable, zero deps.",
      cta: "View on the registry",
    },
  },
  {
    label: "Company",
    columns: [
      {
        heading: "About",
        links: [
          {
            icon: Compass,
            title: "Mission",
            description: "Why we are building for the agent era",
          },
          {
            icon: Newspaper,
            title: "Blog",
            description: "Product notes and engineering deep dives",
          },
          {
            icon: Briefcase,
            title: "Careers",
            description: "Join a small team shipping quickly",
          },
        ],
      },
      {
        heading: "Connect",
        links: [
          {
            icon: LifeBuoy,
            title: "Support",
            description: "Reach an engineer, not a ticket queue",
          },
          {
            icon: MessagesSquare,
            title: "Community",
            description: "Trade patterns with other builders",
          },
          {
            icon: Calendar,
            title: "Events",
            description: "Workshops, talks, and office hours",
          },
        ],
      },
    ],
    promo: {
      icon: Users,
      eyebrow: "Hiring",
      title: "We are growing the team",
      description: "Twelve open roles across product and infra.",
      cta: "See open positions",
    },
  },
];

function PromoTile({ promo }: { promo: MenuPromo }) {
  const Icon = promo.icon;
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#181830] to-[#101018] p-4">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-brand/30 blur-2xl"
        animate={{ x: [0, -18, 0], y: [0, 14, 0], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex h-full flex-col">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-brand-soft">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-soft">
          {promo.eyebrow}
        </span>
        <span className="mt-1 text-[13px] font-semibold leading-tight text-white">
          {promo.title}
        </span>
        <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
          {promo.description}
        </p>
        <div className="mt-auto flex items-center gap-1.5 pt-3 text-[11px] font-medium text-white">
          {promo.cta}
          <ArrowRight className="h-3 w-3" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

export function MegaMenu({
  items = NAV_ITEMS,
  autoPlay = true,
  className,
}: {
  items?: NavItem[];
  autoPlay?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState<number | null>(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => {
        const base = prev ?? -1;
        return (base + 1) % items.length;
      });
    }, 2800);
    return () => window.clearInterval(id);
  }, [autoPlay, paused, items.length]);

  return (
    <div
      className={cn("relative w-full max-w-[600px]", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Nav bar */}
      <nav
        className="relative mx-auto flex w-fit items-center gap-1 rounded-2xl border border-white/10 bg-[#101018]/80 p-1.5 backdrop-blur-xl"
        style={{
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 12px 34px -14px rgba(0,0,0,0.75)",
        }}
      >
        <div className="flex items-center gap-2 pl-1.5 pr-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand to-glow text-white shadow-[0_4px_12px_-4px_rgba(124,108,255,0.8)]">
            <Hexagon className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <span className="text-[13px] font-semibold tracking-tight text-white">
            Lumenite
          </span>
        </div>

        <span className="mx-1 h-5 w-px bg-white/10" />

        {items.map((item, i) => {
          const isActive = active === i;
          return (
            <button
              key={item.label}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="relative rounded-xl px-3 py-1.5 text-[13px] font-medium outline-none"
            >
              {isActive && (
                <motion.span
                  layoutId="mega-menu-pill"
                  className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.06]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex items-center gap-1 transition-colors duration-200",
                  isActive ? "text-white" : "text-white/55"
                )}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    isActive && "rotate-180"
                  )}
                  strokeWidth={2}
                />
              </span>
            </button>
          );
        })}

        <span className="mx-1 h-5 w-px bg-white/10" />

        <button
          type="button"
          className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-white/60 transition-colors hover:text-white"
        >
          Sign in
        </button>
        <button
          type="button"
          className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-[#0b0b10] transition-transform active:scale-[0.97]"
        >
          Get started
        </button>
      </nav>

      {/* Mega panel */}
      <div className="absolute left-1/2 top-full z-20 mt-3 w-full -translate-x-1/2">
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key="mega-panel"
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.85 }}
              className="origin-top"
            >
              <div
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101018]/85 p-2.5 backdrop-blur-2xl"
                style={{
                  boxShadow:
                    "0 34px 70px -24px rgba(0,0,0,0.85), inset 0 1px 0 0 rgba(255,255,255,0.06)",
                }}
              >
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: EASE }}
                    className="grid min-h-[214px] grid-cols-[minmax(0,1fr)_minmax(0,1fr)_190px] gap-2"
                  >
                    {items[active].columns.map((col, ci) => (
                      <div key={col.heading} className="p-1.5">
                        <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                          {col.heading}
                        </div>
                        <div className="space-y-0.5">
                          {col.links.map((link, li) => {
                            const Icon = link.icon;
                            const delay =
                              Math.round((ci * 3 + li) * 45) / 1000;
                            return (
                              <motion.button
                                key={link.title}
                                type="button"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.35,
                                  ease: EASE,
                                  delay,
                                }}
                                className="group/link flex w-full items-start gap-3 rounded-xl p-2 text-left outline-none transition-colors hover:bg-white/[0.045]"
                              >
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/65 transition-colors duration-200 group-hover/link:border-brand/40 group-hover/link:bg-brand/10 group-hover/link:text-brand-soft">
                                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-[13px] font-medium leading-tight text-white/90">
                                    {link.title}
                                  </span>
                                  <span className="mt-0.5 block text-[11px] leading-snug text-white/40">
                                    {link.description}
                                  </span>
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.14 }}
                      className="p-1.5"
                    >
                      <PromoTile promo={items[active].promo} />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-hidden bg-[#050508] px-6 pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-64 w-[540px] -translate-x-1/2 rounded-full bg-brand/10 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
          }}
        />
      </div>
      <MegaMenu />
    </div>
  );
}
