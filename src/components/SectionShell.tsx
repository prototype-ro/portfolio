import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionShellProps = {
  id: string;
  index: string;
  title: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
};

/** A page module: numbered header, hairline separators, gridded body. */
export function SectionShell({
  id,
  index,
  title,
  kicker,
  children,
  className,
}: SectionShellProps) {
  return (
    <section
      id={id}
      data-robot-tap
      className={cn("relative border-t border-line", className)}
    >
      <header className="flex flex-col gap-3 border-b border-line px-5 py-6 sm:px-8 md:flex-row md:items-end md:justify-between md:py-7">
        <div className="flex items-baseline gap-4">
          <span className="label-mono">{index}</span>
          <span aria-hidden className="h-px w-8 bg-line" />
          <h2 className="text-3xl font-semibold uppercase leading-none tracking-[-0.03em] md:text-4xl">
            {title}
          </h2>
        </div>
        {kicker ? (
          <p className="max-w-md text-sm leading-relaxed text-ink-dim">
            {kicker}
          </p>
        ) : null}
      </header>
      <div className="px-5 py-10 sm:px-8 md:py-14">{children}</div>
    </section>
  );
}
