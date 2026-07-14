import type { RegistryEntry } from "./types";
import BackgroundGradientAnimationDemo from "@/components/library/background-gradient-animation";
import GlowingEffectDemo from "@/components/library/glowing-effect";
import SpotlightNewDemo from "@/components/library/spotlight-new";
import TextRevealCardDemo from "@/components/library/text-reveal-card";
import ShineBorderDemo from "@/components/library/shine-border";
import ThreeDPinDemo from "@/components/library/3d-pin";
import LensDemo from "@/components/library/lens";
import DraggableCardDemo from "@/components/library/draggable-card";
import LayoutGridDemo from "@/components/library/layout-grid";
import FlickeringGridDemo from "@/components/library/flickering-grid";
import ParticlesDemo from "@/components/library/particles";
import BeamsCollisionDemo from "@/components/library/background-beams-collision";

export const signatureDEntries: RegistryEntry[] = [
  {
    slug: "background-gradient-animation",
    name: "Background Gradient Animation",
    description:
      "Soft gooey gradient blobs drifting and morphing behind content, with a cursor-following blob.",
    category: "backgrounds",
    tier: "free",
    component: BackgroundGradientAnimationDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "glowing-effect",
    name: "Glowing Effect",
    description:
      "A card grid where a bright border glow rides toward the cursor, sweeping on a loop at rest.",
    category: "cards",
    tier: "free",
    component: GlowingEffectDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "spotlight-new",
    name: "Spotlight",
    description:
      "A refined hero with two large soft light beams sweeping in over a dark grid.",
    category: "backgrounds",
    tier: "free",
    component: SpotlightNewDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "text-reveal-card",
    name: "Text Reveal Card",
    description:
      "Move across the card to wipe a mask and reveal a hidden phrase, with an auto-sweep at rest.",
    category: "cards",
    tier: "pro",
    component: TextRevealCardDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "shine-border",
    name: "Shine Border",
    description:
      "A card with a thin, bright shine traveling continuously around its border.",
    category: "cards",
    tier: "free",
    component: ShineBorderDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "3d-pin",
    name: "3D Pin",
    description:
      "A card that tilts back in 3D on hover while a glowing pin and label rise above it.",
    category: "cards",
    tier: "pro",
    component: ThreeDPinDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "lens",
    name: "Lens",
    description:
      "A circular magnifying lens that enlarges whatever it drifts over, following the cursor on hover.",
    category: "effects",
    tier: "pro",
    component: LensDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "draggable-card",
    name: "Draggable Card",
    description:
      "A card you can drag and throw with momentum, rotating toward the throw, floating at rest.",
    category: "cards",
    tier: "free",
    component: DraggableCardDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "layout-grid",
    name: "Layout Grid",
    description:
      "A bento grid whose tiles morph into a large detail card on click, auto-cycling in the demo.",
    category: "grids",
    tier: "pro",
    component: LayoutGridDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "flickering-grid",
    name: "Flickering Grid",
    description:
      "A fine grid of squares that softly flicker on and off with a brand tint, radial-masked.",
    category: "backgrounds",
    tier: "free",
    component: FlickeringGridDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "particles",
    name: "Particles",
    description:
      "A canvas constellation of drifting glowing dots that connect nearby and repel the cursor.",
    category: "backgrounds",
    tier: "free",
    component: ParticlesDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "background-beams-collision",
    name: "Beams Collision",
    description:
      "Light beams fall and burst into sparks at the bottom on a continuous, staggered loop.",
    category: "backgrounds",
    tier: "pro",
    component: BeamsCollisionDemo,
    previewClassName: "h-[440px]",
  },
];
