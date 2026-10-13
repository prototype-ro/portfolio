"use client";

import { useI18n } from "@/lib/i18n-context";
import { contacts } from "@/data/contact";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Led } from "@/components/Led";

export function Footer() {
  const { t } = useI18n();
  const { progress } = useScrollProgress();
  const pct = String(Math.round(progress * 100)).padStart(3, "0");

  return (
    <footer className="relative border-t border-line px-5 py-8 sm:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold tracking-tight">
            © {new Date().getFullYear()} Rodrigo [[sobrenome]]
          </span>
          <span className="label-mono-sm">{t("footer.rights")}</span>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {contacts.map((channel) => (
            <a
              key={channel.id}
              href={channel.href}
              target={channel.id === "email" ? undefined : "_blank"}
              rel={channel.id === "email" ? undefined : "noreferrer"}
              className="label-mono transition-colors hover:text-accent"
            >
              {t(channel.labelKey)} ↗
            </a>
          ))}
        </div>

        {/* Hardware scroll readout */}
        <div className="chamfer-sm flex items-center gap-3 border border-line bg-bg-dark px-3 py-2">
          <Led on={progress > 0} blink={progress > 0 && progress < 1} />
          <span className="label-mono-sm text-led-off">
            {t("hud.scroll")}
          </span>
          <span className="display-scroll text-2xl leading-none text-accent tabular-nums">
            {pct}%
          </span>
          <span className="h-6 w-px bg-white/10" />
          <div className="h-1.5 w-24 border border-white/15 bg-white/5">
            <div
              className="h-full bg-accent transition-[width] duration-150"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2 border-t border-line pt-4 md:flex-row md:items-center md:justify-between">
        <span className="label-mono-sm">{t("footer.madeIn")}</span>
        <span className="label-mono-sm">{t("footer.built")}</span>
        <span className="label-mono-sm">{t("header.version")}</span>
      </div>
    </footer>
  );
}
