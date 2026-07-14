import type { RegistryEntry } from "./types";
import FeatureGridDemo from "@/components/library/feature-grid";
import AnimatedTestimonialsDemo from "@/components/library/animated-testimonials";
import LogoMarqueeDemo from "@/components/library/logo-marquee";
import PricingCardsDemo from "@/components/library/pricing-cards";
import StatsGridDemo from "@/components/library/stats-grid";
import FaqAccordionDemo from "@/components/library/faq-accordion";
import CompareSliderDemo from "@/components/library/compare-slider";
import GlobeDotsDemo from "@/components/library/globe-dots";
import CardStackDemo from "@/components/library/card-stack";
import FollowingPointerDemo from "@/components/library/following-pointer";

export const gridsEntries: RegistryEntry[] = [
  {
    slug: "feature-grid",
    name: "Feature Grid",
    description:
      "A hover-highlighted feature grid with icon glow and border illumination on the active cell.",
    category: "grids",
    tier: "free",
    component: FeatureGridDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "animated-testimonials",
    name: "Animated Testimonials",
    description:
      "A rotating testimonial card with a gradient avatar stack and word-stagger quote reveal.",
    category: "testimonials",
    tier: "free",
    component: AnimatedTestimonialsDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "logo-marquee",
    name: "Logo Marquee",
    description:
      "A dual-row infinite logo marquee with opposite-direction rows and edge fade masks.",
    category: "testimonials",
    tier: "free",
    component: LogoMarqueeDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "pricing-cards",
    name: "Pricing Cards",
    description:
      "A three-tier pricing layout with a highlighted middle tier, hover lift, and popular badge.",
    category: "cards",
    tier: "free",
    component: PricingCardsDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "stats-grid",
    name: "Stats Grid",
    description: "Stat tiles that animate a count-up once they scroll into view.",
    category: "grids",
    tier: "free",
    component: StatsGridDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "faq-accordion",
    name: "FAQ Accordion",
    description: "A smooth height-animated accordion with a rotating chevron indicator.",
    category: "grids",
    tier: "free",
    component: FaqAccordionDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "compare-slider",
    name: "Compare Slider",
    description: "A draggable before/after comparison slider between two styled panels.",
    category: "effects",
    tier: "pro",
    component: CompareSliderDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "globe-dots",
    name: "Globe Dots",
    description:
      "A rotating dotted globe illusion built in pure SVG with orbiting connection arcs.",
    category: "effects",
    tier: "pro",
    component: GlobeDotsDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "card-stack",
    name: "Card Stack",
    description: "An auto-cycling stack of cards that spring-shuffle to the front.",
    category: "cards",
    tier: "pro",
    component: CardStackDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "following-pointer",
    name: "Following Pointer",
    description: "A custom animated pointer and name tag that spring-follows the cursor.",
    category: "effects",
    tier: "free",
    component: FollowingPointerDemo,
    previewClassName: "h-[420px]",
  },
];
