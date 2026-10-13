"use client";

import { useEffect, useState } from "react";

export type ScrollMetrics = {
  /** Global scroll progress, 0..1. */
  progress: number;
  scrollY: number;
  docHeight: number;
  viewportHeight: number;
};

const initial: ScrollMetrics = {
  progress: 0,
  scrollY: 0,
  docHeight: 1,
  viewportHeight: 1,
};

/** rAF-throttled read of the page scroll position. */
export function useScrollProgress(): ScrollMetrics {
  const [metrics, setMetrics] = useState<ScrollMetrics>(initial);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const max = Math.max(1, docHeight - viewportHeight);
      setMetrics({
        progress: Math.min(1, Math.max(0, scrollY / max)),
        scrollY,
        docHeight,
        viewportHeight,
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return metrics;
}
