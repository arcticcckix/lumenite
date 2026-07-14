import { ComponentsSidebar } from "@/components/site/components-sidebar";

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6">
      <div className="flex gap-8">
        <ComponentsSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
