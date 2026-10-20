import type { ReactNode } from "react";

/** Header strip at the top of every tracker page. */
export default function PageHeader({ title, children, crumb }: { title: ReactNode; children?: ReactNode; crumb?: ReactNode }) {
  return (
    <header className="flex min-h-12 flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-2 sm:px-6">
      <h1 className="flex min-w-0 items-center gap-2 text-[13px] font-medium">
        {crumb}
        {title}
      </h1>
      <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>
    </header>
  );
}
