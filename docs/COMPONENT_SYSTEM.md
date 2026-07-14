# Lumenite UI — the system for adding & maintaining components

This is the repeatable pipeline. Follow it every time and the build stays green and launch-ready.

## Architecture (how a component exists)

1. **Source file** — `src/components/library/<slug>.tsx`
   - `"use client"` first line. Named export(s) + `export default function Demo()`.
   - Follows `docs/COMPONENT_CONVENTIONS.md` exactly (allowed imports, tokens, deterministic rendering).
2. **Registry entry** — added to a batch file in `src/lib/registry/*.ts` (e.g. `signatureA.ts`), which is spread into `src/lib/registry/index.ts`.
3. **Source extraction** — `scripts/extract-source.mjs` reads every library file into `src/lib/registry/source.json` (powers the "Code" tab). Runs automatically on `predev`/`prebuild`.
4. **Categories** — declared in `src/lib/registry/types.ts` (`Category`) and labeled in `index.ts` (`CATEGORIES`).

## The add-a-batch loop

1. **Catalog / research** — decide which components to add (gap analysis vs competitors; pull effect *ideas* from public sites, build our own code — never copy paid source).
2. **Generate** — spawn one agent per component (or a Workflow) with: the conventions file, strong art direction, the deterministic-float rule, and "preserve exports/slug". Each agent owns exactly one file. Agents may run concurrently (no git inside them).
3. **Register** — add each new component to a batch registry file; wire the batch into `index.ts`.
4. **Extract + typecheck** — `node scripts/extract-source.mjs && npx tsc --noEmit` (must be 0 errors).
5. **Browser QA (the gate that matters)** — run the dev server and actually LOOK at each new component:
   - Does it look premium *at rest* (not dependent on hover/scroll to not look broken)?
   - 0 console errors, 0 hydration warnings, 0 nested-anchor errors.
   - Fits the preview card; graceful at narrow widths.
6. **Build both modes** — `npm run build` (server) and `GITHUB_PAGES=1 npm run build` with `src/app/api` temporarily moved out (static export). Both must pass.
7. **Deploy** — commit + push; GitHub Actions redeploys the static showcase. Verify live.

## Definition of done (launch gate — "0 problems")

- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` green + static export green
- [ ] every new/changed component viewed in the browser, looks premium at rest
- [ ] 0 console errors, 0 hydration mismatches, 0 `<a>`-in-`<a>` nesting
- [ ] deterministic: any float written to a DOM style/attr is rounded (hydration safety)
- [ ] no AI-slop tells (badge pills, em-dashes, middots, "10x/supercharge" hyperbole)
- [ ] deployed and confirmed live

## Recurring quality pass (automated)

Saved Workflow: **`lumenite-craft-upgrade`** — audits every component from code, rebuilds the weak ones in parallel, and upgrades template placeholders. Re-runnable any time. Script lives under the session's `workflows/scripts/`. Re-invoke with `{scriptPath, args:{slugs:[...]}}`.

## Common pitfalls (learned the hard way)

- **Scroll-driven demos look dead in preview cards** — the resting state is faded/tilted. Make demos self-animate; keep scroll reactivity optional for real-page use.
- **Hover-only effects look like nothing at rest** — always show a subtle always-on state, intensify on hover.
- **Unrounded floats (`Math.sin(...)*100`) in DOM styles → hydration mismatch.** Round to 3 dp.
- **Nested anchors** — component demos must not contain `<a>`/`next/link`; the gallery already wraps each card in a `<Link>`. Use `<button>`/`<span role>` inside demos.
- **lucide dropped brand icons** (Github/Twitter/Linkedin/Slack/Figma) — use inline SVGs or generic icons.
