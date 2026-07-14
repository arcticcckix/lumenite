import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Home,
  LayoutGrid,
  Aperture,
  Mail,
  Compass,
  Sparkles,
} from "lucide-react";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Full page templates assembled from Lumenite UI components, included with Pro.",
};

type Kind = "nova" | "pulse" | "orbit" | "signal";

const TEMPLATES: {
  name: string;
  desc: string;
  blocks: string[];
  gradient: string;
  kind: Kind;
}[] = [
  {
    name: "Nova: SaaS Landing",
    desc: "Aurora hero, live feature bento, animated testimonials, pricing and FAQ. The page this whole site's homepage is built from.",
    blocks: ["Aurora Background", "Bento Grid", "Infinite Moving Cards", "Pricing Cards", "FAQ Accordion"],
    gradient: "from-brand/40 via-glow/20 to-transparent",
    kind: "nova",
  },
  {
    name: "Pulse: Startup Hero Pack",
    desc: "Five interchangeable hero sections: lamp, spotlight, parallax grid, typewriter and gradient variants, each with matching nav.",
    blocks: ["Lamp Hero", "Spotlight Hero", "Hero Parallax Grid", "Floating Navbar", "Typewriter"],
    gradient: "from-emerald-400/30 via-brand/20 to-transparent",
    kind: "pulse",
  },
  {
    name: "Orbit: Portfolio",
    desc: "A dark portfolio with dock navigation, tilt project cards, scramble-text headings and a timeline about section.",
    blocks: ["Dock Menu", "3D Tilt Card", "Scramble Text", "Timeline", "Following Pointer"],
    gradient: "from-amber-400/25 via-rose-500/15 to-transparent",
    kind: "orbit",
  },
  {
    name: "Signal: Waitlist / Launch",
    desc: "Single-page launch site: shooting-star backdrop, number-ticker social proof, newsletter capture with success states.",
    blocks: ["Shooting Stars", "Number Ticker", "Newsletter Signup", "Shimmer Button", "Logo Marquee"],
    gradient: "from-glow/35 via-brand/20 to-transparent",
    kind: "signal",
  },
];

// Premium easing shared across hover transitions.
const EASE = "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]";

// Deterministic pseudo-random field for the Signal night sky. Seeded with
// Math.sin and fully rounded so server and client markup match exactly.
const rand = (seed: number) => {
  const v = Math.sin(seed) * 43758.5453;
  return v - Math.floor(v);
};
const r2 = (n: number) => Math.round(n * 100) / 100;
const r1 = (n: number) => Math.round(n * 10) / 10;

const STARS = Array.from({ length: 30 }, (_, i) => ({
  x: r1(rand(i * 1.3 + 0.5) * 100),
  y: r1(rand(i * 2.7 + 1.1) * 88),
  size: r2(0.6 + rand(i * 3.1) * 1.4),
  dur: r2(1.8 + rand(i * 4.2) * 2.8),
  delay: r2(rand(i * 5.9) * 3),
  base: r2(0.2 + rand(i * 6.4) * 0.55),
}));

const SHOOTS = [
  { left: 6, top: 8, dur: 3.2, delay: 0.4 },
  { left: 48, top: -6, dur: 3.8, delay: 1.9 },
  { left: 70, top: 14, dur: 2.9, delay: 3.1 },
];

/* ---------------------------------- Nova ---------------------------------- */
function NovaPreview() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-void">
      {/* aurora wash */}
      <div
        className="absolute -top-20 left-1/2 h-56 w-[130%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,108,255,0.38),transparent_62%)] blur-2xl"
        style={{ animation: "lmnt-float 9s ease-in-out infinite" }}
      />
      <div
        className="absolute -top-10 left-[16%] h-40 w-[62%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(91,140,255,0.3),transparent_66%)] blur-2xl"
        style={{ animation: "lmnt-float 12s ease-in-out infinite reverse" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(5,5,8,0.72))]" />

      {/* framed app surface */}
      <div className="absolute inset-4 rounded-xl border border-white/10 bg-void/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[2px]">
        {/* nav */}
        <div className="flex items-center justify-between px-4 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-[5px] bg-gradient-to-br from-brand to-glow shadow-[0_0_10px_rgba(124,108,255,0.7)]" />
            <span className="text-[9px] font-semibold tracking-tight text-white">Lumenite</span>
          </div>
          <div className="hidden items-center gap-2.5 min-[420px]:flex">
            <span className="h-1 w-6 rounded-full bg-white/15" />
            <span className="h-1 w-5 rounded-full bg-white/15" />
            <span className="h-1 w-6 rounded-full bg-white/15" />
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[8px] font-semibold text-black">Get Pro</span>
        </div>

        {/* hero + bento */}
        <div className="flex gap-3 px-4 pt-4">
          <div className="w-[52%] shrink-0">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[7px] text-brand-soft">
              <span className="h-1 w-1 rounded-full bg-brand" /> v2.0 shipping
            </span>
            <div className="mt-2 text-[15px] font-semibold leading-[1.08] tracking-tight text-white">
              Ship interfaces
              <br />
              that feel{" "}
              <span className="bg-gradient-to-r from-brand-soft to-glow bg-clip-text text-transparent">alive</span>.
            </div>
            <p className="mt-1.5 text-[8px] leading-relaxed text-zinc-400">
              The animated component library teams reach for.
            </p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="rounded-md bg-brand px-2.5 py-1 text-[8px] font-semibold text-white shadow-[0_0_16px_rgba(124,108,255,0.5)]">
                Start building
              </span>
              <span className="rounded-md border border-white/10 px-2 py-1 text-[8px] text-zinc-300">Docs</span>
            </div>
          </div>

          {/* bento */}
          <div className="grid flex-1 grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`rounded-lg border border-white/10 bg-white/[0.03] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-transform duration-700 group-hover:-translate-y-1 ${EASE}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {i === 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[6px] text-zinc-500">Revenue</span>
                      <span className="text-[6px] font-semibold text-emerald-400">+38%</span>
                    </div>
                    <svg viewBox="0 0 44 14" preserveAspectRatio="none" className="mt-1 h-4 w-full">
                      <polyline
                        points="0,11 8,9 16,10 24,5 32,6 44,1"
                        fill="none"
                        stroke="#a99dff"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
                {i === 1 && (
                  <>
                    <span className="text-[6px] text-zinc-500">Teams</span>
                    <div className="mt-1 flex -space-x-1">
                      <span className="h-3 w-3 rounded-full bg-gradient-to-br from-brand to-glow ring-1 ring-void" />
                      <span className="h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-brand ring-1 ring-void" />
                      <span className="h-3 w-3 rounded-full bg-gradient-to-br from-rose-400 to-amber-300 ring-1 ring-void" />
                    </div>
                    <div className="mt-0.5 text-[8px] font-semibold tracking-tight text-white">1,240+</div>
                  </>
                )}
                {i === 2 && (
                  <>
                    <span className="text-[6px] text-zinc-500">p95 latency</span>
                    <div className="mt-1 flex h-5 items-end gap-0.5">
                      {["h-[6px]", "h-[11px]", "h-[8px]", "h-[14px]", "h-[10px]"].map((h, b) => (
                        <span key={b} className={`w-1 rounded-sm bg-gradient-to-t from-brand/40 to-glow/70 ${h}`} />
                      ))}
                    </div>
                  </>
                )}
                {i === 3 && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                      <span className="text-[6px] text-zinc-500">Uptime</span>
                    </div>
                    <div className="mt-0.5 text-[13px] font-semibold tracking-tight text-white">99.9%</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Pulse ---------------------------------- */
function PulsePreview() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-void">
      {/* lamp cones */}
      <div className="absolute left-1/2 top-0 h-28 w-44 origin-top -translate-x-full -rotate-[9deg] bg-gradient-to-b from-brand/25 via-brand/10 to-transparent blur-md" />
      <div className="absolute left-1/2 top-0 h-28 w-44 origin-top rotate-[9deg] bg-gradient-to-b from-brand/25 via-brand/10 to-transparent blur-md" />
      {/* emerald undertone for differentiation */}
      <div className="absolute left-1/2 top-2 h-16 w-48 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-2xl" />
      {/* bright line + glow */}
      <div
        className="absolute left-1/2 top-2 h-20 w-52 -translate-x-1/2 rounded-full bg-brand/30 blur-2xl"
        style={{ animation: "lmnt-beam 6s ease-in-out infinite" }}
      />
      <div
        className="absolute left-1/2 top-9 h-[2px] w-48 -translate-x-1/2 rounded-full bg-brand-soft shadow-[0_0_18px_5px_rgba(124,108,255,0.65)]"
        style={{ animation: "lmnt-beam 6s ease-in-out infinite" }}
      />

      {/* floating navbar */}
      <div className="absolute left-1/2 top-[52px] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
        <Sparkles className="h-2.5 w-2.5 text-brand-soft" />
        <span className="h-1 w-4 rounded-full bg-white/20" />
        <span className="h-1 w-3 rounded-full bg-white/20" />
        <span className="h-1 w-4 rounded-full bg-white/20" />
        <span className="rounded-full bg-white/90 px-1.5 py-0.5 text-[6px] font-semibold text-black">Ship</span>
      </div>

      {/* centered hero */}
      <div className="absolute inset-x-0 bottom-0 top-[86px] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-[20px] font-semibold leading-[1.02] tracking-tight text-white">
          Launch faster.
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-[9px] text-zinc-400">
          <span>Five heroes. One install.</span>
          <span
            className="inline-block h-3 w-[2px] bg-brand-soft"
            style={{ animation: "lmnt-caret 1.05s steps(1) infinite" }}
          />
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="rounded-lg bg-white px-3 py-1 text-[8px] font-semibold text-black shadow-[0_0_20px_rgba(124,108,255,0.35)]">
            Get started
          </span>
          <span className="rounded-lg border border-white/15 px-2.5 py-1 text-[8px] text-zinc-300">
            Live preview
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Orbit ---------------------------------- */
function OrbitPreview() {
  const dock = [Home, LayoutGrid, Aperture, Mail, Compass];
  return (
    <div className="absolute inset-0 overflow-hidden bg-void">
      <div className="absolute -bottom-12 -left-6 h-44 w-56 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.16),transparent_65%)] blur-2xl" />
      <div className="absolute -top-8 right-2 h-32 w-40 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.14),transparent_65%)] blur-2xl" />

      {/* identity */}
      <div className="absolute left-5 top-5 max-w-[46%]">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-300 via-rose-400 to-brand ring-1 ring-white/20" />
          <div>
            <div className="text-[11px] font-semibold tracking-tight text-white">Ava Reyes</div>
            <div className="text-[8px] text-zinc-400">Design Engineer · SF</div>
          </div>
        </div>
        <div className="mt-2 text-[8px] leading-relaxed text-zinc-500">
          Crafting interfaces at the seam of motion &amp; systems.
        </div>
        <div className="mt-2 flex gap-1">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[6px] text-zinc-300">
            Available
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[6px] text-zinc-300">
            2025 →
          </span>
        </div>
      </div>

      {/* tilted project card */}
      <div className="absolute right-4 top-6 [perspective:600px]">
        <div
          className={`w-32 rounded-xl border border-white/10 bg-panel/90 p-2 shadow-[0_22px_45px_-18px_rgba(0,0,0,0.85)] transition-transform duration-700 [transform:rotateX(14deg)_rotateY(-17deg)] group-hover:[transform:rotateX(4deg)_rotateY(-6deg)] ${EASE}`}
        >
          <div className="relative h-14 w-full overflow-hidden rounded-lg bg-gradient-to-br from-rose-500/40 via-amber-400/25 to-brand/45">
            <svg viewBox="0 0 120 56" className="absolute inset-0 h-full w-full opacity-70">
              <ellipse cx="60" cy="28" rx="42" ry="16" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              <ellipse cx="60" cy="28" rx="26" ry="10" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
              <circle cx="60" cy="28" r="5" fill="#fbbf24" />
              <circle cx="102" cy="28" r="2.2" fill="#ffffff" />
            </svg>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[9px] font-medium text-white">Nebula</span>
            <span className="text-[7px] text-zinc-400">2025</span>
          </div>
          <div className="mt-1 flex gap-1">
            <span className="rounded bg-white/10 px-1 py-0.5 text-[6px] text-zinc-300">Design System</span>
            <span className="rounded bg-white/10 px-1 py-0.5 text-[6px] text-zinc-300">Motion</span>
          </div>
        </div>
        {/* following pointer label */}
        <span
          className={`pointer-events-none absolute -bottom-1 left-2 flex translate-y-1 items-center gap-1 rounded-md bg-brand px-1.5 py-0.5 text-[7px] font-medium text-white opacity-0 shadow-[0_6px_16px_-4px_rgba(124,108,255,0.7)] transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 ${EASE}`}
        >
          <span className="h-1 w-1 rounded-full bg-white" /> View case study
        </span>
      </div>

      {/* dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <div className="flex items-end gap-1.5 rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
          {dock.map((Icon, i) => (
            <span
              key={i}
              className={`grid place-items-center rounded-lg bg-white/10 ${
                i === 2 ? "h-7 w-7 -translate-y-1 bg-brand/30 ring-1 ring-brand/40" : "h-5 w-5"
              }`}
            >
              <Icon className={i === 2 ? "h-3.5 w-3.5 text-white" : "h-2.5 w-2.5 text-white/75"} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Signal --------------------------------- */
function SignalPreview() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,#0b0b14,#050508_72%)]">
      {/* stars */}
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.base,
            animation: `lmnt-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      {/* shooting stars */}
      {SHOOTS.map((s, i) => (
        <span
          key={`sh-${i}`}
          className="absolute h-px w-10 rounded-full bg-gradient-to-r from-white via-white/70 to-transparent"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animation: `lmnt-shoot ${s.dur}s ease-in ${s.delay}s infinite`,
          }}
        />
      ))}
      {/* glow */}
      <div className="absolute left-1/2 top-1/2 h-40 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(91,140,255,0.18),transparent_70%)] blur-2xl" />

      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[7px] text-brand-soft backdrop-blur-md">
          <span className="h-1 w-1 rounded-full bg-glow shadow-[0_0_6px_rgba(91,140,255,0.9)]" /> Launching soon
        </span>
        <div className="mt-2 text-[16px] font-semibold tracking-tight text-white">Join the waitlist</div>
        <p className="mt-1 max-w-[190px] text-[8px] leading-relaxed text-zinc-400">
          Be first through the door when Signal ships. One email, no noise.
        </p>

        <div className="mt-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] p-1 pl-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <Mail className="h-2.5 w-2.5 text-zinc-500" />
          <span className="text-[8px] text-zinc-500">you@studio.com</span>
          <span className="relative overflow-hidden rounded-full bg-brand px-2.5 py-1 text-[8px] font-semibold text-white shadow-[0_0_16px_rgba(124,108,255,0.45)]">
            Notify me
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent"
              style={{ animation: "lmnt-sheen 2.6s ease-in-out infinite" }}
            />
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            {["from-brand to-glow", "from-emerald-400 to-brand", "from-rose-400 to-amber-300", "from-glow to-brand-soft"].map(
              (g, i) => (
                <span key={i} className={`h-3.5 w-3.5 rounded-full bg-gradient-to-br ${g} ring-1 ring-void`} />
              )
            )}
          </div>
          <span className="text-[8px] text-zinc-400">
            <span className="font-semibold tabular-nums text-white">2,847</span> builders joined
          </span>
          <span className="flex items-center gap-0.5 text-[7px] text-emerald-400">
            <span
              className="h-1 w-1 rounded-full bg-emerald-400"
              style={{ animation: "lmnt-twinkle 1.4s ease-in-out infinite" }}
            />
            +12 today
          </span>
        </div>
      </div>
    </div>
  );
}

const PREVIEWS = {
  nova: NovaPreview,
  pulse: PulsePreview,
  orbit: OrbitPreview,
  signal: SignalPreview,
};

function PreviewKeyframes() {
  return (
    <style>{`
      @keyframes lmnt-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      @keyframes lmnt-twinkle { 0%,100%{opacity:.2} 50%{opacity:1} }
      @keyframes lmnt-beam { 0%,100%{opacity:.75;transform:translateX(-50%) scaleX(1)} 50%{opacity:1;transform:translateX(-50%) scaleX(1.06)} }
      @keyframes lmnt-caret { 0%,49%{opacity:1} 50%,100%{opacity:0} }
      @keyframes lmnt-sheen { 0%{transform:translateX(-120%)} 55%,100%{transform:translateX(240%)} }
      @keyframes lmnt-shoot {
        0%{transform:translate3d(0,0,0) rotate(28deg);opacity:0}
        10%{opacity:1}
        70%{opacity:1}
        100%{transform:translate3d(130px,69px,0) rotate(28deg);opacity:0}
      }
      @media (prefers-reduced-motion: reduce) {
        [style*="lmnt-"] { animation: none !important; }
      }
    `}</style>
  );
}

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <PreviewKeyframes />
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Templates</h1>
        <p className="mt-4 text-zinc-400">
          Complete pages assembled from the library, copy the whole thing and
          swap the copy. All templates are included with{" "}
          <Link href="/pricing" className="text-brand-soft hover:underline">Pro</Link>{" "}
          and downloadable from your dashboard.
        </p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {TEMPLATES.map((t) => {
          const Preview = PREVIEWS[t.kind];
          return (
            <Link
              key={t.name}
              href={`/templates/${t.kind}`}
              className="group block overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-zinc-600 hover:shadow-[0_0_40px_rgba(124,108,255,0.08)]"
            >
              <div className="relative h-56 overflow-hidden">
                <Preview />
                <div className="absolute inset-0 flex items-center justify-center bg-void/50 opacity-0 backdrop-blur-[1px] transition group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
                    View live example
                    <ArrowRight className="h-4 w-4" />
                  </span>
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
                <div className="mt-4 flex items-center gap-1.5 text-sm text-brand-soft">
                  View live example
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-line bg-panel p-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          All four templates. {SITE.pricing.pro.label}. Once.
        </h2>
        <p className="max-w-md text-sm text-zinc-400">
          Included with Pro alongside every premium component, plus everything
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
