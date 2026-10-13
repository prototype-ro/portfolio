import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpecRowProps = {
  label: string;
  value?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/** Technical datasheet row: label on the left, dotted leader, value right. */
export function SpecRow({ label, value, children, className }: SpecRowProps) {
  return (
    <div
      className={cn(
        "dotted-row flex items-baseline justify-between gap-4 py-3",
        className,
      )}
    >
      <span className="label-mono shrink-0">{label}</span>
      <span className="font-mono text-right text-xs leading-relaxed text-ink">
        {children ?? value}
      </span>
    </div>
  );
}
