import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { REGISTRY, bySlug } from "@/lib/registry";
import { ComponentViewer } from "@/components/site/component-viewer";
import sourceMap from "@/lib/registry/source.json";

export function generateStaticParams() {
  return REGISTRY.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = bySlug(slug);
  return {
    title: entry ? entry.name : "Component",
    description: entry?.description,
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = bySlug(slug);
  if (!entry) notFound();

  const code =
    (sourceMap as Record<string, string>)[slug] ?? "// source unavailable";

  const idx = REGISTRY.findIndex((e) => e.slug === slug);
  const prev = REGISTRY[(idx - 1 + REGISTRY.length) % REGISTRY.length];
  const next = REGISTRY[(idx + 1) % REGISTRY.length];

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/components" className="transition hover:text-white">
          Components
        </Link>
        <span>/</span>
        <span className="capitalize text-zinc-400">{entry.category}</span>
      </div>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {entry.name}
          </h1>
          <p className="mt-2 max-w-xl text-zinc-400">{entry.description}</p>
        </div>
        <span
          className={
            entry.tier === "pro"
              ? "rounded-full bg-brand/20 px-3 py-1 text-xs font-medium text-brand-soft"
              : "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400"
          }
        >
          {entry.tier === "pro" ? "Pro" : "Free"}
        </span>
      </div>

      <ComponentViewer entry={entry} code={code} />

      <div className="mt-10 rounded-xl border border-line bg-surface p-5 text-sm text-zinc-400">
        <span className="font-medium text-zinc-200">Usage:</span> paste this
        file into your project (e.g.{" "}
        <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-xs text-brand-soft">
          components/{entry.slug}.tsx
        </code>
        ), make sure <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-xs">framer-motion</code>,{" "}
        <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-xs">clsx</code> and{" "}
        <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-xs">tailwind-merge</code>{" "}
        are installed, and add the <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-xs">cn()</code>{" "}
        helper from the <Link href="/docs" className="text-brand-soft hover:underline">docs</Link>.
      </div>

      <div className="mt-10 flex justify-between text-sm">
        <Link
          href={`/components/${prev.slug}`}
          className="text-zinc-500 transition hover:text-white"
        >
          ← {prev.name}
        </Link>
        <Link
          href={`/components/${next.slug}`}
          className="text-zinc-500 transition hover:text-white"
        >
          {next.name} →
        </Link>
      </div>
    </div>
  );
}
