# Lumenite UI

**Beautiful animated components. Copy, paste, ship.**

An Aceternity-style component library business: 56 production-ready React components (Tailwind CSS v4 + Framer Motion), a multi-page marketing site, and a Whop-gated Pro dashboard — all in one Next.js 16 app.

## What's inside

- **`/`** — animated landing page (live component wall, features, pricing teaser, FAQ)
- **`/components`** — full gallery with search + category/tier filters; every preview is live
- **`/components/[slug]`** — preview + copy-paste source; Pro components show a blurred paywall until licensed
- **`/pricing`** — Free / Pro $79 one-time / Team $149 (undercuts Aceternity's $199+)
- **`/templates`** — Pro template showcase
- **`/docs`** — getting started, `cn()` helper, theming
- **`/dashboard`** — license activation (Whop key) → unlocks all Pro source in-browser
- **`/legal/*`** — Terms, Privacy, License, Refund policy
- **`/api/license`** — server-side Whop license validation (needs `WHOP_API_KEY`)

## Business model

1. Free components are public — SEO/traffic magnet.
2. Checkout runs on **Whop** (merchant of record — taxes, receipts, refunds handled).
3. Buyer gets a license key instantly → activates it in `/dashboard` → Pro source unlocks.

## Deployments

| Target | What | How |
|---|---|---|
| **GitHub Pages** | Static showcase (demo-mode dashboard, key `DEMO-2026`) | auto on push to `main` via `.github/workflows/deploy.yml` |
| **Vercel** | Full app with real Whop validation | import repo → set `WHOP_API_KEY` env var → deploy |

## Going live checklist

1. Create the Whop product (Pro $79, Team $149) and set its checkout URL in `src/lib/site.ts` (`whopCheckoutUrl`).
2. Deploy to Vercel, add `WHOP_API_KEY` (Whop dashboard → Developer → API keys).
3. Point a domain, update `SITE.url`.
4. Run ads. Everything else is automated.

## Dev

```bash
npm install
npm run dev        # extracts component sources, starts Next dev
npm run build      # production build
npm run build:pages  # static export for GitHub Pages
```

Component conventions for adding more: `docs/COMPONENT_CONVENTIONS.md`.
