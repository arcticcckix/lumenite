import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p className="!mt-2 text-sm text-zinc-500">Effective date: July 14, 2026</p>

      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of {SITE.name} (&ldquo;{SITE.shortName}&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;), including our website, our
        library of component code, and any related documentation
        (collectively, the &ldquo;Service&rdquo;). By accessing the Service or
        purchasing a license, you agree to be bound by these Terms. If you do
        not agree, do not use the Service.
      </p>

      <h2>1. Who we are</h2>
      <p>
        {SITE.name} publishes a library of pre-built, production-ready React
        components styled with Tailwind CSS and animated with Framer Motion.
        Some components are provided free of charge; others (&ldquo;Pro
        components&rdquo;) are made available under a paid license as
        described on our Pricing page and in our{" "}
        <Link href="/legal/license">License</Link> page.
      </p>

      <h2>2. License to use the Service</h2>
      <p>
        Your right to copy, modify, and use any component code obtained
        through the Service is governed exclusively by our{" "}
        <Link href="/legal/license">License</Link> page, which is
        incorporated into these Terms by reference. In short: free components
        may be used broadly, including in commercial projects, without
        attribution. Pro components require a valid, active purchase and are
        licensed to you personally or to your organization for building
        products &mdash; they are not sold to you as a standalone asset you
        may resell or redistribute.
      </p>

      <h2>3. No resale or redistribution of Pro source</h2>
      <p>
        Regardless of how you use a Pro component inside a finished product,
        you may not extract, publish, sell, sublicense, or otherwise make
        available the underlying Pro component source code, in whole or in
        part, as a competing component library, template pack, boilerplate,
        code snippet marketplace listing, or any other standalone
        distribution of the code itself. Doing so is a material breach of
        these Terms and immediately terminates your license without refund.
      </p>

      <h2>4. Accounts and license keys</h2>
      <p>
        {SITE.name} does not require you to create a traditional account.
        When you purchase a Pro or Team license, a license key is issued to
        you and stored locally in your browser to unlock access to Pro
        content on this site. You are responsible for keeping your license
        key and purchase confirmation in a safe place. We may ask you to
        re-verify a purchase through our payment processor if a key is lost.
      </p>

      <h2>5. Payment and billing</h2>
      <p>
        All payments for the Service are processed by Whop, a third-party
        payment platform that acts as the merchant of record for your
        purchase. Whop is responsible for processing your payment, issuing
        receipts, calculating and remitting any applicable sales tax, VAT, or
        similar transaction taxes, and handling payment disputes and
        chargebacks in accordance with its own terms. {SITE.name} never
        receives or stores your full payment card details. Prices are listed
        in U.S. dollars unless otherwise noted and are subject to change for
        future purchases; existing licenses are not affected by price
        changes.
      </p>

      <h2>6. Refunds</h2>
      <p>
        Refund eligibility for Pro and Team licenses is described in detail
        in our <Link href="/legal/refunds">Refund Policy</Link>, which is
        incorporated into these Terms by reference.
      </p>

      <h2>7. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          Use the Service to build products that are illegal, fraudulent, or
          infringe the intellectual property rights of others;
        </li>
        <li>
          Circumvent, disable, or interfere with any license verification,
          paywall, or access-control mechanism on the Service;
        </li>
        <li>
          Scrape, mirror, or systematically download the Service or its
          component library other than through the intended copy-paste
          workflow for your own project use;
        </li>
        <li>
          Misrepresent your affiliation with {SITE.name} or claim authorship
          of the underlying component library itself.
        </li>
      </ul>

      <h2>8. Intellectual property</h2>
      <p>
        Except for the rights expressly granted to you under the{" "}
        <Link href="/legal/license">License</Link> page, {SITE.name} and its
        licensors retain all right, title, and interest in and to the
        Service, including all component source code, design systems,
        documentation, trademarks, and branding. These Terms do not transfer
        any ownership rights to you.
      </p>

      <h2>9. Disclaimer of warranties</h2>
      <p>
        The Service and all component code are provided &ldquo;as is&rdquo;
        and &ldquo;as available,&rdquo; without warranties of any kind,
        whether express, implied, or statutory, including but not limited to
        implied warranties of merchantability, fitness for a particular
        purpose, title, and non-infringement. We do not warrant that the
        Service will be uninterrupted, error-free, or free of security
        vulnerabilities, or that any component will be compatible with your
        specific project, framework version, or build tooling.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {SITE.name} and its owners,
        contributors, and licensors will not be liable for any indirect,
        incidental, special, consequential, or punitive damages, or any loss
        of profits, revenue, data, or goodwill, arising out of or related to
        your use of the Service, even if we have been advised of the
        possibility of such damages. In no event will our total aggregate
        liability arising out of or relating to these Terms exceed the
        amount you actually paid to us for the license giving rise to the
        claim in the twelve (12) months preceding the event.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold {SITE.name} harmless from any claims,
        damages, liabilities, and expenses (including reasonable
        attorneys&rsquo; fees) arising from your use of the Service, your
        violation of these Terms, or your violation of any rights of a third
        party through a product you build using the Service.
      </p>

      <h2>12. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time to reflect changes to the
        Service, our licensing model, or applicable law. Material changes
        will be reflected by an updated effective date at the top of this
        page. Continued use of the Service after changes take effect
        constitutes acceptance of the revised Terms.
      </p>

      <h2>13. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service if you breach
        these Terms, including the redistribution restrictions described
        above. Sections that by their nature should survive termination
        (including intellectual property, disclaimers, and limitation of
        liability) will survive.
      </p>

      <h2>14. Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of California,
        without regard to its conflict-of-law principles. Any dispute arising
        out of or relating to these Terms or the Service will be subject to
        the exclusive jurisdiction of the state and federal courts located in
        California.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these Terms can be sent to{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </>
  );
}
