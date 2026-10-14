"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { I18nProvider } from "@/lib/i18n-context";
import { Toaster } from "@/components/ui/sonner";
import type { Lang } from "@/data/i18n";

export function Providers({
  children,
  initialLang = "pt",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  return (
    <I18nProvider initialLang={initialLang}>
      {/* Respect the OS "reduce motion" setting for every Framer animation. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          style: {
            borderRadius: 0,
            border: "1px solid var(--line)",
            background: "var(--bg-panel)",
            color: "var(--ink)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
          },
        }}
      />
    </I18nProvider>
  );
}
