import { cn } from "@/lib/utils";

type CornerMarksProps = {
  className?: string;
  size?: number;
  color?: string;
};

/** L-shaped corner brackets, the recurring framing device of the design. */
export function CornerMarks({
  className,
  size = 10,
  color = "var(--accent)",
}: CornerMarksProps) {
  const marks = [
    { pos: "left-0 top-0", borders: "border-l border-t" },
    { pos: "right-0 top-0", borders: "border-r border-t" },
    { pos: "left-0 bottom-0", borders: "border-l border-b" },
    { pos: "right-0 bottom-0", borders: "border-r border-b" },
  ];
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-10", className)}
      style={{ color }}
    >
      {marks.map((mark) => (
        <span
          key={mark.pos}
          className={cn("absolute border-current", mark.pos, mark.borders)}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}
