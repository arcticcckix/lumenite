import type { RegistryEntry, Category, Tier } from "./types";
import SpotlightCardDemo from "@/components/library/spotlight-card";
import { backgroundsEntries } from "./backgrounds";
import { cardsEntries } from "./cards";
import { textEntries } from "./text";
import { buttonsEntries } from "./buttons";
import { heroesEntries } from "./heroes";
import { gridsEntries } from "./grids";
import { commerceEntries } from "./commerce";
import { sectionsEntries } from "./sections";
import { signatureAEntries } from "./signatureA";
import { signatureBEntries } from "./signatureB";
import { signatureCEntries } from "./signatureC";
import { controlsEntries } from "./controls";
import { signatureDEntries } from "./signatureD";
import { glassEntries } from "./glass";

const baseEntries: RegistryEntry[] = [
  {
    slug: "spotlight-card",
    name: "Spotlight Card",
    description: "A card with a radial spotlight that follows the cursor.",
    category: "cards",
    tier: "free",
    component: SpotlightCardDemo,
    previewClassName: "h-[420px]",
  },
];

export const REGISTRY: RegistryEntry[] = [
  ...baseEntries,
  ...backgroundsEntries,
  ...cardsEntries,
  ...textEntries,
  ...buttonsEntries,
  ...heroesEntries,
  ...gridsEntries,
  ...commerceEntries,
  ...sectionsEntries,
  ...signatureAEntries,
  ...signatureBEntries,
  ...signatureCEntries,
  ...controlsEntries,
  ...signatureDEntries,
  ...glassEntries,
].sort((a, b) => a.name.localeCompare(b.name));

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "backgrounds", label: "Backgrounds" },
  { id: "cards", label: "Cards" },
  { id: "buttons", label: "Buttons" },
  { id: "text", label: "Text Effects" },
  { id: "heroes", label: "Hero Sections" },
  { id: "navigation", label: "Navigation" },
  { id: "grids", label: "Grids & Layout" },
  { id: "effects", label: "Effects" },
  { id: "forms", label: "Forms" },
  { id: "testimonials", label: "Testimonials" },
  { id: "commerce", label: "Commerce" },
  { id: "sections", label: "Page Sections" },
  { id: "glass", label: "Liquid Glass" },
];

export function bySlug(slug: string): RegistryEntry | undefined {
  return REGISTRY.find((e) => e.slug === slug);
}

export function byTier(tier: Tier): RegistryEntry[] {
  return REGISTRY.filter((e) => e.tier === tier);
}

export const FREE_COUNT = () => byTier("free").length;
export const PRO_COUNT = () => byTier("pro").length;
