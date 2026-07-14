import type { RegistryEntry } from "./types";
import BorderBeamDemo from "@/components/library/border-beam";
import AnimatedGridPatternDemo from "@/components/library/animated-grid-pattern";
import RetroGridDemo from "@/components/library/retro-grid";
import RippleGridDemo from "@/components/library/ripple-grid";
import DotPatternGlowDemo from "@/components/library/dot-pattern-glow";
import WarpBackgroundDemo from "@/components/library/warp-background";
import AnimatedGradientTextDemo from "@/components/library/animated-gradient-text";

export const signatureAEntries: RegistryEntry[] = [
  {
    slug: "border-beam",
    name: "Border Beam",
    description:
      "A card with a soft light beam that travels continuously around its border.",
    category: "backgrounds",
    tier: "free",
    component: BorderBeamDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "animated-grid-pattern",
    name: "Animated Grid Pattern",
    description:
      "A subtle grid where random cells softly illuminate and fade, masked with a radial glow.",
    category: "backgrounds",
    tier: "free",
    component: AnimatedGridPatternDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "retro-grid",
    name: "Retro Grid",
    description:
      "A synthwave perspective grid receding to a glowing horizon, scrolling toward the viewer.",
    category: "backgrounds",
    tier: "pro",
    component: RetroGridDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "ripple-grid",
    name: "Ripple Grid",
    description:
      "Concentric rings expanding outward from a central point over a dotted field.",
    category: "effects",
    tier: "free",
    component: RippleGridDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "dot-pattern-glow",
    name: "Dot Pattern Glow",
    description:
      "A field of dots with a soft light that follows the cursor, warming nearby dots.",
    category: "backgrounds",
    tier: "free",
    component: DotPatternGlowDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "warp-background",
    name: "Warp Background",
    description:
      "Thin panels flow outward from the center in perspective, giving a warp-speed feel.",
    category: "backgrounds",
    tier: "pro",
    component: WarpBackgroundDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "animated-gradient-text",
    name: "Animated Gradient Text",
    description:
      "Text with a smooth flowing multi-stop gradient and an optional shimmer chip.",
    category: "text",
    tier: "free",
    component: AnimatedGradientTextDemo,
    previewClassName: "h-[420px]",
  },
];
