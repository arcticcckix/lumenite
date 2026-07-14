"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Brand marks (lucide dropped brand icons). Minimal inline SVGs.
type IconProps = { className?: string };
const Twitter = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M18.9 2H22l-7.1 8.1L23.2 22h-6.6l-5.2-6.8L5.5 22H2.3l7.6-8.7L1 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.2 3.8H5.3L17.7 20Z" />
  </svg>
);
const Github = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);
const Linkedin = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
  </svg>
);

interface FooterColumn {
  title: string;
  links: string[];
}

const COLUMNS: FooterColumn[] = [
  { title: "Product", links: ["Components", "Templates", "Pricing", "Changelog"] },
  { title: "Resources", links: ["Docs", "Guides", "Blog", "Support"] },
  { title: "Company", links: ["About", "Careers", "Contact", "Brand"] },
];

const SOCIALS = [
  { icon: Twitter, label: "Twitter" },
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
];

export function MegaFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden rounded-t-2xl border-t border-line bg-panel px-8 pb-8 pt-10",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-brand), var(--color-glow), transparent)",
        }}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <p className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-lg font-semibold text-transparent">
            Lumenite UI
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Aceternity-grade components for teams who ship fast.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <input
              placeholder="you@company.com"
              className="w-full max-w-[180px] rounded-lg border border-line bg-void px-3 py-2 text-xs text-zinc-300 outline-none focus:border-brand/60"
            />
            <button className="shrink-0 rounded-lg bg-brand px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-brand/90">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      className="cursor-pointer text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Lumenite UI. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          {SOCIALS.map(({ icon: Icon, label }) => (
            <motion.button
              key={label}
              type="button"
              aria-label={label}
              whileHover={{ y: -2, color: "#fff" }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-line text-zinc-400"
            >
              <Icon className="h-3.5 w-3.5" />
            </motion.button>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-end justify-center bg-[#050508]">
      <MegaFooter className="w-full" />
    </div>
  );
}
