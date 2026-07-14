import Link from "next/link";
import { SITE } from "@/lib/site";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/components", label: "Components" },
      { href: "/templates", label: "Templates" },
      { href: "/pricing", label: "Pricing" },
      { href: "/docs", label: "Documentation" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/pricing", label: "Upgrade to Pro" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/license", label: "License" },
      { href: "/legal/refunds", label: "Refund Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-lg font-semibold tracking-tight">
            {SITE.shortName}
            <span className="text-brand-soft"> UI</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
            {SITE.tagline}
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <div className="text-sm font-medium text-zinc-300">{col.title}</div>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-500 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line px-6 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved. Built
        with Tailwind CSS &amp; Framer Motion.
      </div>
    </footer>
  );
}
