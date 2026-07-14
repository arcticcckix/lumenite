"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { LumeniteMark } from "@/components/brand/logo";

const LINKS = [
  { href: "/components", label: "Components" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-void/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LumeniteMark size={30} className="drop-shadow-[0_0_12px_rgba(124,108,255,0.45)]" />
          <span className="text-[15px] font-semibold tracking-tight">
            {SITE.shortName}
            <span className="text-brand-soft"> UI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm text-zinc-400 transition hover:text-white",
                pathname?.startsWith(l.href) && "bg-panel text-white"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
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
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-surface px-4 py-4 md:hidden">
          {[...LINKS, { href: "/dashboard", label: "Dashboard" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-panel"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
