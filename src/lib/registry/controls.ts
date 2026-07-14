import type { RegistryEntry } from "./types";
import ToggleSwitchDemo from "@/components/library/toggle-switch";
import LoaderCollectionDemo from "@/components/library/loader-collection";
import CopyButtonDemo from "@/components/library/copy-button";
import FileDropzoneDemo from "@/components/library/file-dropzone";
import StarRatingDemo from "@/components/library/star-rating";
import CommandPaletteDemo from "@/components/library/command-palette";
import ToastStackDemo from "@/components/library/toast-stack";
import SegmentedControlDemo from "@/components/library/segmented-control";
import OtpInputDemo from "@/components/library/otp-input";
import RangeSliderDemo from "@/components/library/range-slider";
import AvatarStackDemo from "@/components/library/avatar-stack";
import KbdKeysDemo from "@/components/library/kbd-keys";

export const controlsEntries: RegistryEntry[] = [
  {
    slug: "toggle-switch",
    name: "Toggle Switch",
    description:
      "Premium settings toggles with a spring-animated thumb and a soft glow when on.",
    category: "forms",
    tier: "free",
    component: ToggleSwitchDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "loader-collection",
    name: "Loaders",
    description:
      "A tasteful set of loaders: spinning ring, bouncing dots, animated bars, and an orbiting dot.",
    category: "effects",
    tier: "free",
    component: LoaderCollectionDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "copy-button",
    name: "Copy Button",
    description:
      "A copy-to-clipboard button whose icon morphs to a check with a ripple, then reverts.",
    category: "buttons",
    tier: "free",
    component: CopyButtonDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "file-dropzone",
    name: "File Dropzone",
    description:
      "A drag-and-drop upload zone with an animated border and file chips that fill with progress.",
    category: "forms",
    tier: "pro",
    component: FileDropzoneDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "star-rating",
    name: "Star Rating",
    description:
      "An interactive 5-star rating with springy fill on hover and a live average.",
    category: "forms",
    tier: "free",
    component: StarRatingDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "command-palette",
    name: "Command Palette",
    description:
      "A Cmd-K palette with grouped results, lucide icons, keyboard hints, and an auto-advancing selection.",
    category: "navigation",
    tier: "pro",
    component: CommandPaletteDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "toast-stack",
    name: "Toast Stack",
    description:
      "Notification toasts that slide in with status icons and an auto-dismiss progress bar.",
    category: "sections",
    tier: "free",
    component: ToastStackDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "segmented-control",
    name: "Segmented Control",
    description:
      "An Apple-style segmented control with a sliding frosted thumb and crossfading content.",
    category: "navigation",
    tier: "free",
    component: SegmentedControlDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "otp-input",
    name: "OTP Input",
    description:
      "A one-time-code input with a glowing active box, springy digit pops, and a success state.",
    category: "forms",
    tier: "free",
    component: OtpInputDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "range-slider",
    name: "Range Slider",
    description:
      "A gradient-filled range slider with a glossy thumb and a value tooltip above it.",
    category: "forms",
    tier: "free",
    component: RangeSliderDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "avatar-stack",
    name: "Avatar Stack",
    description:
      "Overlapping avatars with a +N overflow chip that lift and label on hover.",
    category: "effects",
    tier: "free",
    component: AvatarStackDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "kbd-keys",
    name: "Keyboard Keys",
    description:
      "Realistic 3D keycaps that depress on a loop to type out a keyboard shortcut.",
    category: "text",
    tier: "free",
    component: KbdKeysDemo,
    previewClassName: "h-[440px]",
  },
];
