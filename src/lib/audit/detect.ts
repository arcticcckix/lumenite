// Isomorphic site-section detector. Runs on raw HTML (no DOM), so it works in
// the Node/Edge API route AND in the static-demo fallback. Zero LLM cost — this
// is pure heuristics. The optional AI layer (see /api/audit) only rewrites the
// per-section pitch copy; detection and scoring live here.

export interface SectionFinding {
  id: string;
  label: string;
  /** true = we found this section on the page */
  found: boolean;
  /** 0..1 confidence in the detection */
  confidence: number;
  /** short human evidence string */
  evidence: string;
  /** default pitch (may be overwritten by the AI layer) */
  pitch: string;
  /** recommended Lumenite component slugs, best first */
  recommend: string[];
}

export interface AuditReport {
  url: string;
  title: string;
  /** 0..100 — higher = already polished, lower = big opportunity */
  score: number;
  headline: string;
  sections: SectionFinding[];
  /** components we recommend across the whole report, de-duped */
  recommendedSlugs: string[];
  generatedNote?: string;
}

interface Rule {
  id: string;
  label: string;
  /** any of these substrings (lowercased HTML) → found */
  needles: (string | RegExp)[];
  recommend: string[];
  pitch: string;
  /** weight toward the score when MISSING (opportunity) */
  weight: number;
}

const RULES: Rule[] = [
  {
    id: "hero",
    label: "Hero section",
    needles: [/<h1[\s>]/],
    recommend: ["lamp-hero", "spotlight-hero", "split-hero", "aurora-background", "editorial-hero"],
    pitch:
      "Your hero is the first thing visitors see. A lamp, spotlight, or aurora hero makes it feel instantly premium.",
    weight: 22,
  },
  {
    id: "nav",
    label: "Navigation",
    needles: [/<nav[\s>]/, 'role="navigation"', "<header"],
    recommend: ["floating-navbar", "dock-menu", "animated-tabs"],
    pitch:
      "A floating or dock-style navbar signals a modern, considered product before anyone scrolls.",
    weight: 8,
  },
  {
    id: "testimonials",
    label: "Testimonials / social proof",
    needles: ["testimonial", "what our customers", "loved by", "trusted by", "reviews"],
    recommend: ["animated-testimonials", "testimonial-wall", "infinite-moving-cards", "logo-marquee"],
    pitch:
      "Social proof converts. Animated testimonials and a logo marquee make it feel alive instead of static.",
    weight: 16,
  },
  {
    id: "features",
    label: "Features / benefits",
    needles: ["features", "why choose", "everything you need", "built for", "how it works"],
    recommend: ["feature-grid", "bento-grid", "how-it-works", "spotlight-card"],
    pitch:
      "A bento or hover-highlighted feature grid turns a boring bullet list into something people actually read.",
    weight: 14,
  },
  {
    id: "pricing",
    label: "Pricing",
    needles: ["pricing", "/mo", "per month", "free plan", "get started free", "choose a plan"],
    recommend: ["pricing-cards"],
    pitch:
      "A clean, animated pricing block with a highlighted tier lifts conversion on the highest-intent page you have.",
    weight: 12,
  },
  {
    id: "cta",
    label: "Call to action",
    needles: ["get started", "sign up", "start free", "book a demo", "try it free", "join now"],
    recommend: ["cta-banner", "shimmer-button", "moving-border-button", "magnetic-button"],
    pitch:
      "Your primary button should feel clickable. A shimmer or magnetic CTA measurably increases clicks.",
    weight: 10,
  },
  {
    id: "stats",
    label: "Stats / metrics",
    needles: [/\d{2,}%/, "customers", "active users", "uptime", "downloads"],
    recommend: ["stats-grid", "trust-stats-bar", "number-ticker"],
    pitch:
      "Numbers count for more when they count up. An animated stats bar makes your traction impossible to miss.",
    weight: 8,
  },
  {
    id: "faq",
    label: "FAQ",
    needles: ["faq", "frequently asked", "common questions"],
    recommend: ["faq-accordion"],
    pitch:
      "A smooth animated FAQ accordion handles objections without cluttering the page.",
    weight: 6,
  },
  {
    id: "newsletter",
    label: "Email capture",
    needles: ["subscribe", "newsletter", "sign up for updates", "join the waitlist"],
    recommend: ["newsletter-signup", "spotlight-input"],
    pitch:
      "If you capture emails, the input should delight. A spotlight signup lifts opt-in rates.",
    weight: 6,
  },
  {
    id: "footer",
    label: "Footer",
    needles: [/<footer[\s>]/],
    recommend: ["mega-footer"],
    pitch:
      "A polished mega-footer with a newsletter row is the easy last impression most sites waste.",
    weight: 5,
  },
];

/** Signals that the site is ALREADY somewhat modern (reduce opportunity, raise score). */
const POLISH_SIGNALS: (string | RegExp)[] = [
  "framer-motion",
  "tailwind",
  /gsap/,
  "data-framer",
  "backdrop-blur",
  /animate-/,
];

function has(html: string, needles: (string | RegExp)[]): boolean {
  return needles.some((n) =>
    typeof n === "string" ? html.includes(n) : n.test(html)
  );
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]{1,120})<\/title>/i);
  return m ? m[1].trim() : "your site";
}

export function analyze(html: string, url: string): AuditReport {
  const lower = html.toLowerCase();
  const title = extractTitle(html);

  const sections: SectionFinding[] = RULES.map((r) => {
    const found = has(lower, r.needles);
    return {
      id: r.id,
      label: r.label,
      found,
      confidence: found ? 0.85 : 0.6,
      evidence: found
        ? `Detected a ${r.label.toLowerCase()} on the page.`
        : `No clear ${r.label.toLowerCase()} found — a quick win to add.`,
      pitch: r.pitch,
      recommend: r.recommend,
    };
  });

  // Opportunity score. Start at 100, subtract weight for every "found but
  // upgradeable" section a little, and for every missing high-value section a
  // lot. Then nudge up if we see modern-stack polish signals.
  const polishCount = POLISH_SIGNALS.filter((s) =>
    typeof s === "string" ? lower.includes(s) : s.test(lower)
  ).length;

  let score = 100;
  for (const r of RULES) {
    const found = has(lower, r.needles);
    // Found sections still have upside (partial), missing ones are full gaps.
    score -= found ? r.weight * 0.35 : r.weight * 0.9;
  }
  score += polishCount * 4;
  score = Math.max(28, Math.min(94, Math.round(score)));

  const recommendedSlugs = Array.from(
    new Set(
      sections
        .slice()
        .sort((a, b) => Number(a.found) - Number(b.found)) // gaps first
        .flatMap((s) => s.recommend)
    )
  ).slice(0, 12);

  const opportunities = sections.filter((s) => !s.found).length;
  const headline =
    opportunities === 0
      ? `${title} has all the right sections — here are ${recommendedSlugs.length} components to make each one look world-class.`
      : score >= 80
        ? `${title} already looks sharp — here are ${recommendedSlugs.length} ways to make it unforgettable.`
        : score >= 55
          ? `We found ${opportunities} quick win${opportunities === 1 ? "" : "s"} and ${recommendedSlugs.length} components to level up ${title}.`
          : `Big opportunity: ${opportunities} sections on ${title} could look dramatically more premium.`;

  return {
    url,
    title,
    score,
    headline,
    sections,
    recommendedSlugs,
  };
}

/**
 * Deterministic simulated report for the static demo (GitHub Pages), where we
 * can't fetch cross-origin. Seeds which sections are "found" from the hostname
 * so the same URL always yields the same believable report.
 */
export function simulateReport(url: string): AuditReport {
  let host = url;
  try {
    host = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`).hostname;
  } catch {
    /* keep raw */
  }
  const seed = (i: number) => Math.abs(Math.sin(host.length * 7.13 + i * 3.7));
  const html = RULES.map((r, i) =>
    // include a needle for ~55% of sections, seeded per-rule
    seed(i) > 0.45 ? String(r.needles[0]).replace(/[\\/<>[\]()?:.*+]/g, " ") + " " : ""
  ).join(" ") + (seed(99) > 0.5 ? " framer-motion animate- backdrop-blur " : "");
  const base = analyze(
    `<title>${host}</title>${html}`,
    /^https?:\/\//.test(url) ? url : `https://${url}`
  );
  base.title = host;
  base.generatedNote = "Demo report — deploy with a live server for real scans.";
  return base;
}
