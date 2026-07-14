import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TEMPLATES, templateBySlug } from "@/lib/templates";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = templateBySlug(slug);
  return {
    title: t ? `${t.name} — ${t.tagline} template` : "Template",
    description: t?.description,
  };
}

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = templateBySlug(slug);
  if (!t) notFound();

  const Template = t.component;

  return (
    <div className="relative">
      {/* preview toolbar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-void/80 px-4 py-2.5 backdrop-blur-xl sm:px-6">
        <Link
          href="/templates"
          className="flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Templates
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden text-zinc-500 sm:inline">
            {t.name} · {t.tagline}
          </span>
          <span className="rounded-full bg-brand/20 px-2.5 py-0.5 text-[11px] font-medium text-brand-soft">
            Live preview
          </span>
        </div>
        <a
          href={SITE.whopCheckoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          Get this template
        </a>
      </div>

      {/* the full template, rendered live */}
      <div className="overflow-hidden">
        <Template />
      </div>
    </div>
  );
}
