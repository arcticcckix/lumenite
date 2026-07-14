import type { ComponentType } from "react";

export type Tier = "free" | "pro";

export type Category =
  | "backgrounds"
  | "cards"
  | "buttons"
  | "text"
  | "heroes"
  | "navigation"
  | "grids"
  | "effects"
  | "forms"
  | "testimonials"
  | "commerce"
  | "sections";

export interface RegistryEntry {
  /** URL slug, kebab-case, unique */
  slug: string;
  name: string;
  description: string;
  category: Category;
  tier: Tier;
  /** Live preview component (default export of the library file) */
  component: ComponentType;
  /** Tailwind classes for the preview container, if it needs a fixed height etc. */
  previewClassName?: string;
  /** Extra npm deps beyond framer-motion/clsx/tailwind-merge, if any */
  dependencies?: string[];
}
