export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-void">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <article
          className="
            [&>p]:mt-4 [&>p]:leading-relaxed [&>p]:text-zinc-400
            [&>h1]:text-4xl [&>h1]:font-semibold [&>h1]:tracking-tight [&>h1]:text-white
            [&>h2]:mt-12 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:tracking-tight [&>h2]:text-white
            [&>h3]:mt-8 [&>h3]:text-base [&>h3]:font-medium [&>h3]:text-zinc-200
            [&>ul]:mt-4 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul]:text-zinc-400
            [&>ol]:mt-4 [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:pl-5 [&>ol]:text-zinc-400
            [&_strong]:font-medium [&_strong]:text-zinc-200
            [&_a]:text-brand-soft [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white
          "
        >
          {children}
        </article>
      </div>
    </div>
  );
}
