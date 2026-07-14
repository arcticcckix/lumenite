import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy",
};

export default function RefundsPage() {
  return (
    <>
      <h1>Refund Policy</h1>
      <p className="!mt-2 text-sm text-zinc-500">Effective date: July 14, 2026</p>

      <p>
        {SITE.name} is a digital product: once you have access to a Pro or
        Team license, the component source code can be copied instantly.
        This policy explains when and how you can get a refund, and its
        limits, so there are no surprises for either side.
      </p>

      <h2>1. 7-day refund window</h2>
      <p>
        We offer a no-questions-asked refund within seven (7) days of
        purchase, provided you have not accessed a substantial amount of the
        Pro component source. &ldquo;A reasonable amount&rdquo; means
        browsing and evaluating the library &mdash; viewing previews,
        copying a handful of components to try them out, or exploring the
        docs. It does not mean copying the majority of the Pro catalog into
        your own codebase or template and then requesting a refund; at that
        point you&rsquo;ve received the value of the license, and Section 2
        applies instead.
      </p>
      <p>
        This threshold exists to keep pricing fair for everyone: because Pro
        access unlocks full source code immediately, an unconditional refund
        window on unlimited copying would let anyone use the product for
        free. If your refund request falls in a genuine gray area, email us
        &mdash; we review these individually and err on the side of the
        customer when usage looks like normal evaluation.
      </p>

      <h2>2. After the 7-day window, or after substantial access</h2>
      <p>
        Once the 7-day window has passed, or once you&rsquo;ve copied a
        substantial portion of the Pro library into your own project(s), the
        purchase is final and non-refundable, except where required by law
        (see Section 4 for EU/UK buyers).
      </p>

      <h2>3. How to request a refund</h2>
      <p>You can request a refund one of two ways:</p>
      <ul>
        <li>
          Email us at{" "}
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>{" "}
          with your order ID or the email address used at checkout, and a
          brief reason for the request. We aim to respond within two
          business days.
        </li>
        <li>
          Open a dispute directly with Whop, our payment processor and
          merchant of record, through your Whop order confirmation or
          account. Whop handles the transaction and can process the refund
          on our behalf.
        </li>
      </ul>
      <p>
        Approved refunds are issued to your original payment method through
        Whop and may take several business days to appear, depending on your
        bank or card issuer.
      </p>

      <h2>4. EU / UK 14-day right of withdrawal</h2>
      <p>
        If you are a consumer located in the European Union or United
        Kingdom, you may ordinarily have a statutory right to withdraw from a
        digital purchase within fourteen (14) days without giving a reason.
        Because {SITE.name} grants you immediate access to downloadable
        source code upon purchase, by completing checkout you acknowledge
        that you are requesting immediate access to digital content and, to
        the extent permitted by applicable law, that your right of
        withdrawal may end once you have accessed and made use of that
        content. Where local law nonetheless entitles you to a refund within
        the 14-day period, we will honor that right &mdash; contact us at{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> and
        reference this policy.
      </p>

      <h2>5. License revocation on refund</h2>
      <p>
        When a refund is issued, your Pro or Team license key is deactivated
        and you must stop using Pro components in any new work. Refunds do
        not retroactively require you to remove Pro components already
        shipped in a finished product prior to the refund date, but continued
        redistribution of the component source itself remains governed by
        our <Link href="/legal/license">License</Link> page regardless of
        refund status.
      </p>

      <h2>6. Chargebacks</h2>
      <p>
        We&rsquo;d rather resolve a billing issue directly &mdash; please
        email us before filing a chargeback with your bank. Chargebacks
        filed without first attempting a refund request may result in
        immediate license revocation and, if fraud is suspected, may be
        contested through Whop&rsquo;s dispute process.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about this policy can be sent to{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. See
        also our <Link href="/legal/terms">Terms of Service</Link>.
      </p>
    </>
  );
}
