import type { RegistryEntry } from "./types";
import LiquidGlassCardDemo from "@/components/library/liquid-glass-card";
import GlassButtonDemo from "@/components/library/glass-button";
import GlassDockDemo from "@/components/library/glass-dock";
import GlassNavDemo from "@/components/library/glass-nav";

export const glassEntries: RegistryEntry[] = [
  {
    slug: "liquid-glass-card",
    name: "Liquid Glass Card",
    description:
      "An Apple-style translucent glass panel with backdrop refraction, a specular edge, and a cursor-tracked highlight.",
    category: "glass",
    tier: "free",
    component: LiquidGlassCardDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "glass-button",
    name: "Glass Button",
    description:
      "A frosted-glass pill button with a bright top sheen and a shimmer that sweeps across on hover.",
    category: "glass",
    tier: "free",
    component: GlassButtonDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "glass-dock",
    name: "Glass Dock",
    description:
      "A macOS-style liquid glass dock whose icons magnify toward the cursor with a spring.",
    category: "glass",
    tier: "pro",
    component: GlassDockDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "glass-nav",
    name: "Glass Nav",
    description:
      "A floating glass navigation bar with a sliding liquid pill indicator behind the active link.",
    category: "glass",
    tier: "pro",
    component: GlassNavDemo,
    previewClassName: "h-[440px]",
  },
];
