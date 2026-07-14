import {
  Hero,
  ComponentWall,
  Features,
  GlassShowcase,
  AuditTeaser,
  PricingTeaser,
  FAQ,
} from "@/components/site/home";

export default function Home() {
  return (
    <>
      <Hero />
      <ComponentWall />
      <GlassShowcase />
      <Features />
      <AuditTeaser />
      <PricingTeaser />
      <FAQ />
    </>
  );
}
