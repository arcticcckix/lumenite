import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="!mt-2 text-sm text-zinc-500">Effective date: July 14, 2026</p>

      <p>
        {SITE.name} (&ldquo;{SITE.shortName}&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;) is built to collect as little personal information
        as possible. This Privacy Policy explains what we collect, why, and
        the rights you have over it.
      </p>

      <h2>1. Summary</h2>
      <ul>
        <li>We do not require you to create an account.</li>
        <li>
          We do not process, see, or store your payment card details &mdash;
          all payments go through Whop.
        </li>
        <li>
          Your Pro license key is stored locally in your browser, not on a
          {SITE.shortName} server tied to your identity.
        </li>
        <li>We do not sell your personal data, ever.</li>
      </ul>

      <h2>2. Information we collect</h2>
      <h3>2.1 Information you provide</h3>
      <p>
        If you purchase a Pro or Team license, the checkout itself is
        operated by Whop, our payment processor. Whop collects the billing
        information necessary to process your payment (such as your email
        address and payment method) and shares with us only the minimum
        information needed to issue and validate your license &mdash;
        typically your email address, order ID, and license tier. If you
        email us directly, we retain that correspondence to respond to you
        and for our own recordkeeping.
      </p>

      <h3>2.2 Information stored in your browser</h3>
      <p>
        When you activate a Pro or Team license, {SITE.shortName} stores a
        license key in your browser&rsquo;s <code>localStorage</code>. This
        key lives entirely on your device, is used only to unlock Pro content
        in your browser session, and is not a tracking identifier. Clearing
        your browser storage or using a different browser/device will require
        you to re-activate your license.
      </p>

      <h3>2.3 Information collected automatically</h3>
      <p>
        We use privacy-conscious, aggregate website analytics (for example,
        page views, referrers, and general device/browser type) to
        understand how the Service is used and to improve it. This analytics
        placeholder is disclosed here so you know it exists; it does not tie
        usage data to your name, email, or license unless you have separately
        provided that information to us. We do not use invasive
        cross-site advertising trackers.
      </p>

      <h2>3. How we use information</h2>
      <p>We use the limited information described above to:</p>
      <ul>
        <li>Issue, validate, and support your license;</li>
        <li>Respond to support requests and correspondence;</li>
        <li>Maintain the security and integrity of the Service;</li>
        <li>Understand aggregate usage trends to improve the product; and</li>
        <li>Comply with legal obligations, such as tax recordkeeping performed by Whop as merchant of record.</li>
      </ul>

      <h2>4. What we don&rsquo;t do</h2>
      <p>
        We do not sell, rent, or trade your personal information to third
        parties for their marketing purposes. We do not build advertising
        profiles from your activity on the Service. We never see or store
        your full payment card number, expiration date, or CVC &mdash;
        that data is handled entirely within Whop&rsquo;s PCI-compliant
        infrastructure.
      </p>

      <h2>5. Third parties</h2>
      <p>
        The only third party that regularly processes personal data on our
        behalf is Whop, which acts as the merchant of record for all
        payments and handles billing, tax collection and remittance, and
        payment disputes under its own privacy policy. We may also use
        standard infrastructure providers (such as our hosting provider) to
        operate the Service; these providers process data only as necessary
        to deliver the Service and are contractually restricted from using
        it for their own purposes.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We retain license and correspondence records for as long as
        necessary to support your purchase, resolve disputes, and satisfy
        legal and accounting obligations. Locally stored license keys remain
        in your browser until you clear your browser data or revoke access
        yourself.
      </p>

      <h2>7. Your rights (GDPR / CCPA)</h2>
      <p>
        Depending on where you live, you may have the right to request
        access to, correction of, or deletion of the personal information we
        hold about you; to object to or restrict certain processing; to
        request a portable copy of your data; and, for California residents,
        to know what categories of personal information we collect and to
        opt out of any sale of personal information (we do not sell personal
        information, so there is nothing to opt out of). To exercise any of
        these rights, contact us at{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> and
        we will respond within the time required by applicable law.
      </p>

      <h2>8. Children&rsquo;s privacy</h2>
      <p>
        The Service is not directed to children under 16, and we do not
        knowingly collect personal information from children.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material
        changes will be reflected by an updated effective date at the top of
        this page.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about this Privacy Policy, or requests relating to your
        personal data, can be sent to{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. See
        also our <Link href="/legal/terms">Terms of Service</Link>.
      </p>
    </>
  );
}
