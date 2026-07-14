import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documentation",
};

const TOC = [
  { href: "#getting-started", label: "Getting started" },
  { href: "#the-cn-util", label: "The cn() utility" },
  { href: "#copy-paste-workflow", label: "Copy-paste workflow" },
  { href: "#theming", label: "Theming" },
  { href: "#faq", label: "FAQ" },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-black/40 p-4 text-[13px] leading-relaxed text-zinc-300">
      <code>{children}</code>
    </pre>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line pt-12 first:border-none first:pt-0">
      <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-zinc-400">
        {children}
      </div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="bg-void">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-16 lg:grid-cols-[1fr_240px]">
          <div className="min-w-0">
            <div className="text-sm font-medium text-brand-soft">Documentation</div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
              Everything you need to ship with {SITE.shortName}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
              {SITE.shortName} isn&rsquo;t an npm package you install &mdash;
              it&rsquo;s a library of components you copy into your own
              codebase, own outright, and customize freely. This page covers
              everything from initial setup to theming to licensing.
            </p>

            <div className="mt-16 space-y-14">
              <Section id="getting-started" title="Getting started">
                <p>
                  {SITE.shortName} components are built for{" "}
                  <strong>Next.js</strong> with the{" "}
                  <strong>App Router</strong>, styled with{" "}
                  <strong>Tailwind CSS v4</strong>, and animated with{" "}
                  <strong>Framer Motion</strong>. They&rsquo;ll also work in
                  any React project with Tailwind configured &mdash; Next.js
                  is just what we build and test against.
                </p>
                <p>Install the small set of dependencies most components rely on:</p>
                <CodeBlock>{`npm i framer-motion clsx tailwind-merge lucide-react`}</CodeBlock>
                <p>
                  If your project doesn&rsquo;t already have Tailwind CSS v4
                  set up, follow the official{" "}
                  <a
                    href="https://tailwindcss.com/docs/installation"
                    className="text-brand-soft underline underline-offset-4 hover:text-white"
                  >
                    Tailwind installation guide
                  </a>{" "}
                  first &mdash; {SITE.shortName} components assume Tailwind
                  utility classes are available and use v4&rsquo;s{" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-[13px]">
                    @theme
                  </code>{" "}
                  token system for color and font variables.
                </p>
              </Section>

              <Section id="the-cn-util" title="The cn() utility">
                <p>
                  Nearly every component uses a small <code className="rounded bg-white/5 px-1.5 py-0.5 text-[13px]">cn()</code> helper
                  to merge Tailwind class names safely, so conditional
                  classes and consumer-supplied <code className="rounded bg-white/5 px-1.5 py-0.5 text-[13px]">className</code> props
                  don&rsquo;t collide. Add this once to your project at{" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-[13px]">
                    lib/utils.ts
                  </code>
                  :
                </p>
                <CodeBlock>{`import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}</CodeBlock>
                <p>
                  Every {SITE.shortName} component snippet imports this from{" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-[13px]">
                    @/lib/utils
                  </code>{" "}
                  &mdash; adjust the import path if your project structure
                  differs.
                </p>
              </Section>

              <Section id="copy-paste-workflow" title="Copy-paste workflow">
                <p>
                  There&rsquo;s no package to add to your{" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-[13px]">
                    package.json
                  </code>{" "}
                  and no black-box dependency to upgrade later. Instead:
                </p>
                <ol className="list-decimal space-y-2 pl-5">
                  <li>
                    Browse the <Link href="/components" className="text-brand-soft underline underline-offset-4 hover:text-white">/components</Link> gallery
                    and preview components live, in both light and dark mode
                    where relevant.
                  </li>
                  <li>
                    Click a component to open its detail page and copy the
                    full source code with one click.
                  </li>
                  <li>
                    Paste it into your project &mdash; typically as a new
                    file under <code className="rounded bg-white/5 px-1.5 py-0.5 text-[13px]">components/ui/</code> &mdash;
                    and import it wherever you need it.
                  </li>
                  <li>
                    Edit it. It&rsquo;s your code now: rename props, restyle
                    with your own tokens, strip out what you don&rsquo;t
                    need.
                  </li>
                </ol>
                <p>
                  Pro components follow the exact same workflow &mdash; the
                  only difference is that the source is hidden behind your
                  license until you unlock it. See the{" "}
                  <Link href="/legal/license" className="text-brand-soft underline underline-offset-4 hover:text-white">License</Link> page
                  for what you can and can&rsquo;t do with copied code.
                </p>
              </Section>

              <Section id="theming" title="Theming">
                <p>
                  Components are written against a small set of semantic
                  Tailwind tokens rather than hard-coded hex values, so
                  re-theming your whole app means editing your{" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-[13px]">
                    globals.css
                  </code>{" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-[13px]">
                    @theme
                  </code>{" "}
                  block once, not every component individually.
                </p>
                <div className="mt-4 overflow-x-auto rounded-xl border border-line">
                  <table className="w-full min-w-[420px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-zinc-400">
                        <th className="px-4 py-3 font-medium">Token</th>
                        <th className="px-4 py-3 font-medium">Used for</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-400">
                      <tr className="border-b border-line/60">
                        <td className="px-4 py-3 font-mono text-[13px] text-zinc-200">bg-void</td>
                        <td className="px-4 py-3">Page background, deepest layer</td>
                      </tr>
                      <tr className="border-b border-line/60">
                        <td className="px-4 py-3 font-mono text-[13px] text-zinc-200">bg-surface</td>
                        <td className="px-4 py-3">Section and footer background</td>
                      </tr>
                      <tr className="border-b border-line/60">
                        <td className="px-4 py-3 font-mono text-[13px] text-zinc-200">bg-panel</td>
                        <td className="px-4 py-3">Cards, panels, elevated surfaces</td>
                      </tr>
                      <tr className="border-b border-line/60">
                        <td className="px-4 py-3 font-mono text-[13px] text-zinc-200">border-line</td>
                        <td className="px-4 py-3">Hairline borders and dividers</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-[13px] text-zinc-200">text-brand-soft</td>
                        <td className="px-4 py-3">Accent text, links, highlights</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  Swap the underlying color values in your{" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-[13px]">
                    @theme
                  </code>{" "}
                  block and every copied component picks up your brand
                  automatically &mdash; no find-and-replace across files.
                </p>
              </Section>

              <Section id="faq" title="FAQ">
                <div>
                  <h3 className="text-base font-medium text-zinc-200">
                    Do I need a license to use free components?
                  </h3>
                  <p className="mt-2">
                    No. Free components can be used in unlimited personal and
                    commercial projects with no attribution required. See the{" "}
                    <Link href="/legal/license" className="text-brand-soft underline underline-offset-4 hover:text-white">License</Link> page
                    for the full terms.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-medium text-zinc-200">
                    Can I use Pro components on client projects?
                  </h3>
                  <p className="mt-2">
                    Yes &mdash; a Pro license covers unlimited personal and
                    client projects. What it doesn&rsquo;t cover is
                    redistributing the component source itself as a
                    standalone product. Full details on the{" "}
                    <Link href="/legal/license" className="text-brand-soft underline underline-offset-4 hover:text-white">License</Link> page.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-medium text-zinc-200">
                    How many people can use a Team license?
                  </h3>
                  <p className="mt-2">
                    Up to ten developers within the same organization. See{" "}
                    <Link href="/legal/license" className="text-brand-soft underline underline-offset-4 hover:text-white">License</Link> for
                    details.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-medium text-zinc-200">
                    Can I get a refund?
                  </h3>
                  <p className="mt-2">
                    We offer a 7-day refund window for reasonable evaluation
                    use. See our{" "}
                    <Link href="/legal/refunds" className="text-brand-soft underline underline-offset-4 hover:text-white">Refund Policy</Link> for
                    the exact terms.
                  </p>
                </div>
              </Section>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                On this page
              </div>
              <ul className="mt-4 space-y-2.5 border-l border-line pl-4">
                {TOC.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-zinc-500 transition hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
