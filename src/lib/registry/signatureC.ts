import type { RegistryEntry } from "./types";
import BackgroundBoxesDemo from "@/components/library/background-boxes";
import CanvasRevealDemo from "@/components/library/canvas-reveal";
import HeroHighlightDemo from "@/components/library/hero-highlight";
import AnimatedTooltipDemo from "@/components/library/animated-tooltip";
import CometCardDemo from "@/components/library/comet-card";
import FocusCardsDemo from "@/components/library/focus-cards";
import CardHoverEffectDemo from "@/components/library/card-hover-effect";
import ColourfulTextDemo from "@/components/library/colourful-text";
import ContainerTextFlipDemo from "@/components/library/container-text-flip";
import PointerHighlightDemo from "@/components/library/pointer-highlight";
import WorldMapDemo from "@/components/library/world-map";
import VanishingInputDemo from "@/components/library/vanishing-input";

export const signatureCEntries: RegistryEntry[] = [
  {
    slug: "background-boxes",
    name: "Background Boxes",
    description:
      "A grid-of-boxes hero background where cells light up under the cursor, with a soft idle shimmer.",
    category: "backgrounds",
    tier: "free",
    component: BackgroundBoxesDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "canvas-reveal",
    name: "Canvas Reveal",
    description:
      "A card that reveals a colored dot-matrix on hover, with a slow dot pulse at rest.",
    category: "effects",
    tier: "free",
    component: CanvasRevealDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "hero-highlight",
    name: "Hero Highlight",
    description:
      "A dot-grid hero with a cursor-following spotlight and an animated gradient highlight on a key phrase.",
    category: "backgrounds",
    tier: "free",
    component: HeroHighlightDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "animated-tooltip",
    name: "Animated Tooltip",
    description:
      "Overlapping avatars that spring up a tilting name-and-role tooltip on hover.",
    category: "effects",
    tier: "free",
    component: AnimatedTooltipDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "comet-card",
    name: "Comet Card",
    description:
      "A 3D tilt card with a comet-like aurora sheen sweeping across its glossy surface.",
    category: "cards",
    tier: "pro",
    component: CometCardDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "focus-cards",
    name: "Focus Cards",
    description:
      "A row of cards where hovering one keeps it sharp while the others blur and dim.",
    category: "cards",
    tier: "free",
    component: FocusCardsDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "card-hover-effect",
    name: "Card Hover Effect",
    description:
      "A feature grid where a soft highlight block glides behind the hovered card.",
    category: "cards",
    tier: "free",
    component: CardHoverEffectDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "colourful-text",
    name: "Colourful Text",
    description:
      "A headline whose letters cycle through a tasteful multi-hue gradient with a subtle wave.",
    category: "text",
    tier: "free",
    component: ColourfulTextDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "container-text-flip",
    name: "Container Text Flip",
    description:
      "A word flips through options while its pill container smoothly resizes to fit.",
    category: "text",
    tier: "free",
    component: ContainerTextFlipDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "pointer-highlight",
    name: "Pointer Highlight",
    description:
      "A hand-drawn rectangle draws itself around a word as a small pointer moves to it.",
    category: "text",
    tier: "free",
    component: PointerHighlightDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "world-map",
    name: "World Map",
    description:
      "A dotted world map with glowing connection arcs traveling between city points on a loop.",
    category: "effects",
    tier: "pro",
    component: WorldMapDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "vanishing-input",
    name: "Vanishing Input",
    description:
      "An input with a rotating placeholder whose text dissolves into particles on submit.",
    category: "forms",
    tier: "pro",
    component: VanishingInputDemo,
    previewClassName: "h-[440px]",
  },
];
