# Lumenite UI — Library component conventions (for generator agents)

Every library component lives at `src/components/library/<slug>.tsx` and MUST follow these rules exactly:

1. `"use client";` first line. TypeScript, React 19, Tailwind v4 classes, `motion` imported from `framer-motion` (v12 — import as `import { motion } from "framer-motion";`).
2. The file exports its reusable pieces as named exports, and a **`export default function Demo()`** at the bottom — a self-contained demo instance used as the live preview. The Demo must look great on a dark `#050508` background inside a container ~`h-[420px]` wide card, be fully self-contained (its own sample copy/text/data), and animate on mount or hover.
3. Only these imports are allowed: `react`, `framer-motion`, `next/link`, `next/image` (avoid remote images — use gradients/CSS art instead), `lucide-react`, and `import { cn } from "@/lib/utils";`. NO other packages, NO fetch calls, NO external URLs/images.
4. Available custom Tailwind tokens: colors `void, surface, panel, line, brand (#7c6cff), brand-soft, glow (#5b8cff)`; animations `animate-marquee`, `animate-marquee-reverse`, `animate-shimmer`, `animate-spotlight`, `animate-aurora` (marquee keyframes translate 0 → -50%, so duplicate content twice for seamless loops).
5. Deterministic rendering only: NO `Math.random()`/`Date.now()` at module or render scope (hydration mismatch). If randomness is needed, use a seeded function e.g. `const rand = (i:number)=>Math.abs(Math.sin(i*999)) ;` in `useMemo`, or generate inside `useEffect`.
6. Mouse-tracking effects: use `useMotionValue`/`useSpring`/`useTransform` from framer-motion, listeners on the component itself (not window where avoidable).
7. Canvas effects allowed (plain 2D canvas in `useEffect` with cleanup + `resize` handling). Keep them cheap (<300 particles).
8. Quality bar: Aceternity-level polish — generous whitespace, subtle borders (`border-line` / `white/10`), glows, gradient text, smooth easings (`easeOut`, springs). Nothing that looks like Bootstrap.
9. No TypeScript errors under strict mode. Props fully typed. No `any`.
10. After writing your components, register them by writing ONE batch file at `src/lib/registry/<batch-name>.ts`:

```ts
import type { RegistryEntry } from "./types";
import SpotlightCardDemo, ... // default demo imports
export const <batchName>Entries: RegistryEntry[] = [
  {
    slug: "spotlight-card",
    name: "Spotlight Card",
    description: "A card with a radial spotlight that follows the cursor.",
    category: "cards", // one of: backgrounds|cards|buttons|text|heroes|navigation|grids|effects|forms|testimonials
    tier: "free", // or "pro"
    component: SpotlightCardDemo,
    previewClassName: "h-[420px]", // optional
  },
];
```

See `src/lib/registry/types.ts` for the exact interface and `src/components/library/spotlight-card.tsx` for the exemplar.

11. Verify your work: run `npx tsc --noEmit` from the repo root and fix every error in your files before finishing.
