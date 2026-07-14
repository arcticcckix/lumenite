import type { RegistryEntry } from "./types";
import ProductCardDemo from "@/components/library/product-card";
import CartDrawerDemo from "@/components/library/cart-drawer";
import PromoBarDemo from "@/components/library/promo-bar";
import FreeShippingMeterDemo from "@/components/library/free-shipping-meter";
import SplitHeroDemo from "@/components/library/split-hero";
import EditorialHeroDemo from "@/components/library/editorial-hero";
import TrustStatsBarDemo from "@/components/library/trust-stats-bar";
import ProductQuickviewDemo from "@/components/library/product-quickview";

export const commerceEntries: RegistryEntry[] = [
  {
    slug: "product-card",
    name: "Product Card",
    description:
      "Premium product card with CSS-art visual, hover lift, rating stars and an animated add-to-cart button.",
    category: "commerce",
    tier: "free",
    component: ProductCardDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "cart-drawer",
    name: "Cart Drawer",
    description:
      "Slide-in cart with line items, quantity steppers and a live subtotal, spring-animated.",
    category: "commerce",
    tier: "pro",
    component: CartDrawerDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "promo-bar",
    name: "Promo Bar",
    description:
      "Top announcement bar that cycles through offers with vertical slide transitions and a dismiss button.",
    category: "commerce",
    tier: "free",
    component: PromoBarDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "free-shipping-meter",
    name: "Free Shipping Meter",
    description:
      "Animated progress meter that fills toward a free-shipping threshold and celebrates at 100%.",
    category: "commerce",
    tier: "free",
    component: FreeShippingMeterDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "split-hero",
    name: "Split Hero",
    description:
      "Left-aligned split hero with dual CTAs and a floating, glowing product visual with mouse parallax.",
    category: "heroes",
    tier: "free",
    component: SplitHeroDemo,
    previewClassName: "h-[460px]",
  },
  {
    slug: "editorial-hero",
    name: "Editorial Hero",
    description:
      "Centered editorial hero with an oversized serif headline, thin rules and a fade-up stagger.",
    category: "heroes",
    tier: "free",
    component: EditorialHeroDemo,
    previewClassName: "h-[460px]",
  },
  {
    slug: "trust-stats-bar",
    name: "Trust Stats Bar",
    description:
      "Horizontal band of trust stats with count-up on view and subtle icon glow.",
    category: "commerce",
    tier: "free",
    component: TrustStatsBarDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "product-quickview",
    name: "Product Quick View",
    description:
      "Product card that morphs into a quick-view modal with gallery dots, specs and add-to-cart.",
    category: "commerce",
    tier: "pro",
    component: ProductQuickviewDemo,
    previewClassName: "h-[460px]",
  },
];
