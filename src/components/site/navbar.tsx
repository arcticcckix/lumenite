"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { LumeniteMark } from "@/components/brand/logo";

// Apple-style Liquid Glass surface — shared by the nav bar and mobile sheet.
const GLASS_SHADOW =
  "inset 0 1px 0 0 rgba(255,255,255,0.28), inset 0 0 0 1px rgba(255,255,255,0.08), 0 18px 40px -18px rgba(0,0,0,0.8)";

const LINKS = [
  { href: "/components", label: "Components" },
  { href: "/templates", label: "Templates" },
  { href: "/audit", label: "Free Audit" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6">
      <nav
        className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 rounded-full bg-white/[0.06] px-3 pl-4 backdrop-blur-xl backdrop-saturate-150"
        style={{ boxShadow: GLASS_SHADOW }}
      >
        {/* top specular sheen */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-1/2 max-w-5xl rounded-t-full opacity-60"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.14), transparent)",
          }}
        />

        <Link
          href="/"
          className="group relative flex shrink-0 items-center gap-2.5"
        >
          <LumeniteMark
            size={28}
            spin
            className="drop-shadow-[0_0_12px_rgba(124,108,255,0.45)] transition-[filter] group-hover:[animation-duration:1.6s] group-hover:drop-shadow-[0_0_16px_rgba(124,108,255,0.7)]"
          />
          <span className="text-[15px] font-semibold tracking-tight">
            {SITE.shortName}
            <span className="text-brand-soft"> UI</span>
          </span>
        </Link>

        <div className="relative hidden items-center md:flex">
          {LINKS.map((l) => {
            const active = pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  active ? "text-white" : "text-zinc-400 hover:text-white"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-glass-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                    style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="relative hidden shrink-0 items-center gap-3 md:flex">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Get Pro
          </Link>
        </div>

        <button
          className="relative md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div
          className="mx-auto mt-2 max-w-5xl rounded-3xl bg-white/[0.06] px-3 py-3 backdrop-blur-xl backdrop-saturate-150 md:hidden"
          style={{ boxShadow: GLASS_SHADOW }}
        >
          {[...LINKS, { href: "/dashboard", label: "Dashboard" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
