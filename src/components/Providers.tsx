"use client";

import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n-context";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {children}
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
