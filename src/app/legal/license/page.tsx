import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "License",
};

export default function LicensePage() {
  return (
    <>
      <h1>{SITE.name} License</h1>
      <p className="!mt-2 text-sm text-zinc-500">Effective date: July 14, 2026</p>

      <p>
        This page describes the license terms that apply to components
        distributed through {SITE.name}. It is split into two tiers: Free
        components and Pro components. Read the section that applies to what
        you&rsquo;re using &mdash; if you&rsquo;re not sure whether a
        component is free or Pro, check the component&rsquo;s badge on its
        listing page.
      </p>

      <h2>1. Free components</h2>
      <p>
        Free components are licensed to you under permissive, MIT-style
        terms. You may:
      </p>
      <ul>
        <li>Use them in unlimited personal, client, and commercial projects;</li>
        <li>Modify, restyle, and adapt the code however you like;</li>
        <li>Ship them in open-source or closed-source products; and</li>
        <li>
          Use them without providing attribution to {SITE.name}, though we
          always appreciate a shout-out.
        </li>
      </ul>
      <p>
        Free components are provided &ldquo;as is,&rdquo; without warranty of
        any kind, consistent with our{" "}
        <Link href="/legal/terms">Terms of Service</Link>.
      </p>

      <h2>2. Pro components</h2>
      <p>
        Pro components are unlocked with a one-time purchase and licensed to
        you (or your organization, for Team licenses) for use in building
        products. A Pro license grants you the right to:
      </p>
      <ul>
        <li>
          Use, modify, and ship Pro components in an unlimited number of
          personal projects and client projects, for as long as your license
          remains active and in good standing;
        </li>
        <li>
          Include compiled/bundled output built with Pro components in
          products you sell to your own end users (for example, a SaaS app
          or a website you build for a client); and
        </li>
        <li>
          Adapt, restyle, and extend the component code to fit your project.
        </li>
      </ul>

      <h3>2.1 What you may not do</h3>
      <p>A Pro license does not permit you to:</p>
      <ul>
        <li>
          Redistribute, resell, sublicense, or otherwise make the Pro
          component source code available as a standalone product, whether
          for free or for payment &mdash; this includes posting it in public
          repositories, template marketplaces, or code snippet sites;
        </li>
        <li>
          Repackage Pro components, in whole or substantial part, into a
          competing component library, UI kit, boilerplate, or theme that is
          itself distributed to others;
        </li>
        <li>
          Share your license key or Pro access with individuals outside the
          seats covered by your license; or
        </li>
        <li>
          Claim authorship of the underlying component design or code.
        </li>
      </ul>
      <p>
        The distinction is simple: you can build and ship as many end
        products as you like with Pro components inside them, but you cannot
        turn around and sell the components themselves, or a close
        derivative of them, as a library or template product.
      </p>

      <h2>3. Team license (10 seats)</h2>
      <p>
        The Team license ({SITE.pricing.team.label},{" "}
        {SITE.pricing.team.note}) extends Pro access to up to ten (10)
        individual developers within the same organization. Each seat is
        intended for a named individual; seats are not required to be
        assigned permanently, but license sharing beyond the ten-seat limit
        is not permitted. If your organization needs more than ten seats,
        contact us at{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>

      <h2>4. License duration</h2>
      <p>
        Both Pro and Team licenses are sold as one-time purchases with
        lifetime access to the version of the component library available at
        the time of purchase, including reasonable updates and bug fixes we
        publish to those components going forward. Access is tied to the
        license key issued at checkout; see our{" "}
        <Link href="/legal/refunds">Refund Policy</Link> for cancellation and
        refund terms.
      </p>

      <h2>5. Enforcement</h2>
      <p>
        Violating the redistribution restrictions in Section 2.1 is a
        material breach of both this License and our{" "}
        <Link href="/legal/terms">Terms of Service</Link>, and may result in
        immediate revocation of your license without refund, in addition to
        any other remedies available to us.
      </p>

      <h2>6. Questions</h2>
      <p>
        If you have a use case that doesn&rsquo;t clearly fit the categories
        above &mdash; for example, building and selling your own
        boilerplate that includes Pro components &mdash; reach out to{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>{" "}
        before you ship. We&rsquo;re generally happy to work out a license
        that fits, and we&rsquo;d rather grant permission than send a
        takedown notice.
      </p>
    </>
  );
}
