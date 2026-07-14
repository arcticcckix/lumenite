import type { RegistryEntry } from "./types";
import DropdownMenuDemo from "@/components/library/dropdown-menu";
import ContextMenuDemo from "@/components/library/context-menu";
import ApiKeyManagerDemo from "@/components/library/api-key-manager";
import OnboardingChecklistDemo from "@/components/library/onboarding-checklist";
import FeatureComparisonTableDemo from "@/components/library/feature-comparison-table";
import HeroVideoDialogDemo from "@/components/library/hero-video-dialog";
import UploadProgressDemo from "@/components/library/upload-progress";
import KeyboardShortcutsModalDemo from "@/components/library/keyboard-shortcuts-modal";

export const signatureIEntries: RegistryEntry[] = [
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    description:
      "A frosted dropdown with grouped items, icons, keyboard hints, and a gliding highlight.",
    category: "navigation",
    tier: "free",
    component: DropdownMenuDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "context-menu",
    name: "Context Menu",
    description:
      "A right-click context menu with icons, a submenu row, and shortcuts, springing from the click point.",
    category: "navigation",
    tier: "pro",
    component: ContextMenuDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "api-key-manager",
    name: "API Key Manager",
    description:
      "A settings table of API keys with masked reveal, copy-to-check, created dates, and revoke.",
    category: "forms",
    tier: "pro",
    component: ApiKeyManagerDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "onboarding-checklist",
    name: "Onboarding Checklist",
    description:
      "A getting-started checklist with a progress bar that checks off steps with a spring.",
    category: "sections",
    tier: "free",
    component: OnboardingChecklistDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "feature-comparison-table",
    name: "Comparison Table",
    description:
      "A three-column feature comparison with a highlighted Pro column and a sweeping row highlight.",
    category: "sections",
    tier: "pro",
    component: FeatureComparisonTableDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "hero-video-dialog",
    name: "Hero Video Dialog",
    description:
      "A video thumbnail with a pulsing play button that opens into a centered player dialog on a loop.",
    category: "sections",
    tier: "free",
    component: HeroVideoDialogDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "upload-progress",
    name: "Upload Progress",
    description:
      "File upload rows with type icons, filling progress bars, and a spring check when complete.",
    category: "forms",
    tier: "free",
    component: UploadProgressDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "keyboard-shortcuts-modal",
    name: "Keyboard Shortcuts",
    description:
      "A shortcuts cheat-sheet modal with grouped rows, realistic keycaps, and a search field.",
    category: "effects",
    tier: "free",
    component: KeyboardShortcutsModalDemo,
    previewClassName: "h-[440px]",
  },
];
