"use client";

import { useI18n } from "@/lib/i18n-context";
import { LANGUAGES, type Lang } from "@/data/i18n";
import { cn } from "@/lib/utils";

/** PT | EN segmented switch. */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={`${t("lang.pt")} / ${t("lang.en")}`}
      className={cn(
        "flex items-stretch border border-line bg-bg-panel p-0.5",
        className,
      )}
    >
      {LANGUAGES.map((code: Lang) => {
        const isActive = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={isActive}
            className={cn(
              "te-key label-mono-sm min-w-8 px-2 py-1 transition-colors",
              isActive
                ? "bg-accent text-accent-ink"
                : "text-ink-dim hover:text-ink",
            )}
          >
            {code === "pt" ? t("lang.pt") : t("lang.en")}
          </button>
        );
      })}
    </div>
  );
}
