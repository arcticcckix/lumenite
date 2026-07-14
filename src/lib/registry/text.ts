import type { RegistryEntry } from "./types";
import TextGenerateDemo from "@/components/library/text-generate";
import TypewriterDemo from "@/components/library/typewriter";
import FlipWordsDemo from "@/components/library/flip-words";
import GradientHeadingDemo from "@/components/library/gradient-heading";
import TextRevealScrollDemo from "@/components/library/text-reveal-scroll";
import NumberTickerDemo from "@/components/library/number-ticker";
import ScrambleTextDemo from "@/components/library/scramble-text";
import TextHoverGlowDemo from "@/components/library/text-hover-glow";
import BlurFadeHeadingDemo from "@/components/library/blur-fade-heading";

export const textEntries: RegistryEntry[] = [
  {
    slug: "text-generate",
    name: "Text Generate",
    description: "Words fade and blur in one by one, like AI generating text live.",
    category: "text",
    tier: "free",
    component: TextGenerateDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "typewriter",
    name: "Typewriter",
    description: "Classic typewriter effect with a blinking cursor cycling through phrases.",
    category: "text",
    tier: "free",
    component: TypewriterDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "flip-words",
    name: "Flip Words",
    description: "One word in a sentence flips through alternatives with a 3D rotation.",
    category: "text",
    tier: "free",
    component: FlipWordsDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "gradient-heading",
    name: "Gradient Heading",
    description: "Animated moving gradient text for bold headlines.",
    category: "text",
    tier: "free",
    component: GradientHeadingDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "text-reveal-scroll",
    name: "Text Reveal On Scroll",
    description: "Words brighten from dim to bright as you scroll through a passage.",
    category: "text",
    tier: "free",
    component: TextRevealScrollDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "number-ticker",
    name: "Number Ticker",
    description: "Animated spring-driven count-up numbers, formatted with commas.",
    category: "text",
    tier: "free",
    component: NumberTickerDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "scramble-text",
    name: "Scramble Text",
    description: "Hover-triggered character scramble decode effect.",
    category: "text",
    tier: "pro",
    component: ScrambleTextDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "text-hover-glow",
    name: "Text Hover Glow",
    description: "Per-letter lift and glow on hover across a headline.",
    category: "text",
    tier: "free",
    component: TextHoverGlowDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "blur-fade-heading",
    name: "Blur Fade Heading",
    description: "Staggered blur-to-sharp entrance animation for hero headlines.",
    category: "text",
    tier: "free",
    component: BlurFadeHeadingDemo,
    previewClassName: "h-[420px]",
  },
];
