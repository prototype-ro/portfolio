"use client";

import { useI18n } from "@/lib/i18n-context";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#conteudo"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-accent focus:bg-bg focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.08em] focus:text-ink"
    >
      {t("skip.link")}
    </a>
  );
}
