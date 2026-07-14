import type { ComponentType } from "react";
import NovaTemplate from "@/components/templates/nova";
import PulseTemplate from "@/components/templates/pulse";
import OrbitTemplate from "@/components/templates/orbit";
import SignalTemplate from "@/components/templates/signal";

export interface TemplateEntry {
  slug: string;
  name: string;
  tagline: string;
  /** short blurb for the card */
  description: string;
  blocks: string[];
  component: ComponentType;
}

export const TEMPLATES: TemplateEntry[] = [
  {
    slug: "nova",
    name: "Nova",
    tagline: "SaaS Landing",
    description:
      "A complete SaaS landing page: aurora hero, feature grid, dashboard showcase, testimonials, pricing and FAQ.",
    blocks: ["Hero Highlight", "Feature Grid", "Mini Charts", "Testimonials", "Pricing", "FAQ"],
    component: NovaTemplate,
  },
  {
    slug: "pulse",
    name: "Pulse",
    tagline: "Startup Launch",
    description:
      "A bold launch page: lamp hero, how-it-works, stats band, feature spotlight and a strong CTA.",
    blocks: ["Lamp Hero", "How It Works", "Stats", "Feature Spotlight", "CTA Banner"],
    component: PulseTemplate,
  },
  {
    slug: "orbit",
    name: "Orbit",
    tagline: "Portfolio",
    description:
      "A dark designer portfolio: editorial hero, tilting project cards, an experience timeline and a contact CTA.",
    blocks: ["Editorial Hero", "Project Cards", "Timeline", "Testimonial", "Contact"],
    component: OrbitTemplate,
  },
  {
    slug: "signal",
    name: "Signal",
    tagline: "Waitlist",
    description:
      "A pre-launch waitlist page: starfield hero with email capture, live proof, a roadmap and an FAQ.",
    blocks: ["Shooting Stars", "Newsletter", "Live Count", "Roadmap", "FAQ"],
    component: SignalTemplate,
  },
];

export function templateBySlug(slug: string): TemplateEntry | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}
