import { cn } from "@/lib/utils";

type LedProps = {
  on?: boolean;
  blink?: boolean;
  className?: string;
  title?: string;
};

/** Status indicator light. Blinks like a device heartbeat when `blink`. */
export function Led({ on = true, blink = false, className, title }: LedProps) {
  return (
    <span
      role="presentation"
      title={title}
      className={cn(
        "inline-block size-2 shrink-0 rounded-full transition-colors",
        on && blink && "led-blink",
        className,
      )}
      style={{
        backgroundColor: on ? "var(--led-on)" : "var(--led-off)",
        boxShadow: on ? "0 0 6px rgba(255,90,31,0.65)" : "none",
      }}
    />
  );
}
