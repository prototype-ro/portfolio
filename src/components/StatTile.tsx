import { cn } from "@/lib/utils";

type StatTileProps = {
  value: string;
  label: string;
  accent?: string;
  className?: string;
};

/** D350-style tile: accent bar + big number + mono caption. */
export function StatTile({
  value,
  label,
  accent = "var(--accent)",
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "chamfer-sm flex flex-col gap-3 border border-line bg-bg-panel p-4",
        className,
      )}
    >
      <span aria-hidden style={{ background: accent }} className="h-1 w-10" />
      <span className="font-sans text-4xl font-semibold tabular-nums leading-none tracking-[-0.04em] md:text-5xl">
        {value}
      </span>
      <span className="label-mono">{label}</span>
    </div>
  );
}
