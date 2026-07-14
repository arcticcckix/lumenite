import type { RegistryEntry } from "./types";
import GitGraphDemo from "@/components/library/git-graph";
import CursorPresenceDemo from "@/components/library/cursor-presence";
import ToastPromiseDemo from "@/components/library/toast-promise";
import OtpKeypadDemo from "@/components/library/otp-keypad";
import CurrencyInputDemo from "@/components/library/currency-input";
import AvatarPickerDemo from "@/components/library/avatar-picker";
import FeatureSpotlightDemo from "@/components/library/feature-spotlight";
import LiveVisitorCountDemo from "@/components/library/live-visitor-count";

export const signatureKEntries: RegistryEntry[] = [
  {
    slug: "git-graph",
    name: "Git Graph",
    description:
      "A commit graph with colored branches, merge curves, and a new commit drawing in on a loop.",
    category: "effects",
    tier: "pro",
    component: GitGraphDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "cursor-presence",
    name: "Cursor Presence",
    description:
      "Multiplayer live cursors with name tags gliding around a panel, like Figma or Linear.",
    category: "effects",
    tier: "free",
    component: CursorPresenceDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "toast-promise",
    name: "Toast Promise",
    description:
      "A toast that moves from loading to success or error and dismisses, on a loop.",
    category: "sections",
    tier: "free",
    component: ToastPromiseDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "otp-keypad",
    name: "OTP Keypad",
    description:
      "A numeric PIN keypad with press ripples that types a code and flashes an unlock success.",
    category: "forms",
    tier: "free",
    component: OtpKeypadDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "currency-input",
    name: "Currency Input",
    description:
      "A currency amount field with a selector, thousands separators, and a conversion line.",
    category: "forms",
    tier: "free",
    component: CurrencyInputDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "avatar-picker",
    name: "Avatar Picker",
    description:
      "An avatar picker with a morphing preview and a selection ring that springs into place.",
    category: "forms",
    tier: "free",
    component: AvatarPickerDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "feature-spotlight",
    name: "Feature Spotlight",
    description:
      "A spotlight that moves to highlight the active feature while the others dim, auto-advancing.",
    category: "sections",
    tier: "pro",
    component: FeatureSpotlightDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "live-visitor-count",
    name: "Live Visitor Count",
    description:
      "A live analytics widget with a pulsing dot, count-up, visitor avatars, and a scrolling sparkline.",
    category: "sections",
    tier: "free",
    component: LiveVisitorCountDemo,
    previewClassName: "h-[440px]",
  },
];
