import type { RegistryEntry } from "./types";
import TiltCard3DDemo from "@/components/library/tilt-card-3d";
import GlareCardDemo from "@/components/library/glare-card";
import HoverBorderGradientDemo from "@/components/library/hover-border-gradient";
import WobbleCardDemo from "@/components/library/wobble-card";
import BentoGridDemo from "@/components/library/bento-grid";
import InfiniteMovingCardsDemo from "@/components/library/infinite-moving-cards";
import ExpandableCardDemo from "@/components/library/expandable-card";
import EvervaultCardDemo from "@/components/library/evervault-card";
import DirectionAwareHoverDemo from "@/components/library/direction-aware-hover";

export const cardsEntries: RegistryEntry[] = [
  {
    slug: "tilt-card-3d",
    name: "3D Tilt Card",
    description:
      "A card with 3D perspective tilt that follows the cursor, with inner elements floating at different depths.",
    category: "cards",
    tier: "free",
    component: TiltCard3DDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "glare-card",
    name: "Glare Card",
    description: "A holographic glare sweep that plays across the card on hover.",
    category: "cards",
    tier: "free",
    component: GlareCardDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "hover-border-gradient",
    name: "Hover Border Gradient",
    description: "An animated rotating conic gradient border revealed on hover.",
    category: "cards",
    tier: "free",
    component: HoverBorderGradientDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "wobble-card",
    name: "Wobble Card",
    description: "A card that translates and skews subtly with the cursor for a jelly feel.",
    category: "cards",
    tier: "free",
    component: WobbleCardDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "bento-grid",
    name: "Bento Grid",
    description: "A responsive bento grid with hover-lift cells and a large feature cell.",
    category: "grids",
    tier: "free",
    component: BentoGridDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "infinite-moving-cards",
    name: "Infinite Moving Cards",
    description: "A seamless horizontal marquee of testimonial cards.",
    category: "cards",
    tier: "free",
    component: InfiniteMovingCardsDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "expandable-card",
    name: "Expandable Card",
    description: "Click a card to expand it into a centered modal with a shared layout transition.",
    category: "cards",
    tier: "pro",
    component: ExpandableCardDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "evervault-card",
    name: "Evervault Card",
    description: "Hover reveals a moving matrix of characters under a radial mask.",
    category: "cards",
    tier: "pro",
    component: EvervaultCardDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "direction-aware-hover",
    name: "Direction Aware Hover",
    description: "An overlay slides in from whichever edge the cursor entered.",
    category: "cards",
    tier: "pro",
    component: DirectionAwareHoverDemo,
    previewClassName: "h-[420px]",
  },
];
