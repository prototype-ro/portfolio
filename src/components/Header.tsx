"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";

import { CHAPTERS } from "@/data/robot";
import type { DictKey } from "@/data/i18n";
import { useI18n } from "@/lib/i18n-context";
import { useActiveSection } from "@/hooks/useActiveSection";
import { publishRobot } from "@/lib/robot-store";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Led } from "@/components/Led";

const NAV = CHAPTERS.map((chapter) => ({
  id: chapter.id,
  anchor: chapter.anchor,
  index: chapter.index,
  key: `nav.${chapter.id}` as DictKey,
}));

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const anchors = useMemo(() => NAV.map((item) => item.anchor), []);
  const active = useActiveSection(anchors);

  useEffect(() => {
    publishRobot({ active });
  }, [active]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md md:top-3">
      <div className="flex h-14 items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#sobre" className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid size-6 place-items-center border border-line bg-bg-dark"
          >
            <span className="size-1.5 rounded-full bg-accent" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-[-0.02em]">
              Rodrigo <span className="text-ink-dim">Lage da Costa</span>
            </span>
            <span className="label-mono-sm mt-0.5">{t("header.model")}</span>
          </span>
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const isActive = active === item.anchor;
            return (
              <a
                key={item.id}
                href={`#${item.anchor}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group relative flex items-center gap-2 border-b-2 px-3 py-2 transition-colors",
                  isActive
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-dim hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "label-mono-sm",
                    isActive && "text-accent-text",
                  )}
                >
                  {item.index}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em]">
                  {t(item.key)}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={t("header.menu")}
                  className="chamfer-sm rounded-none border-line bg-bg-panel md:hidden"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="chamfer-none w-72 border-l border-line bg-bg text-ink"
            >
              <SheetHeader className="border-b border-line px-5 py-5">
                <SheetTitle className="label-mono">
                  {t("header.model")} — MENU
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Principal"
                className="flex flex-col px-2 py-2"
              >
                {NAV.map((item) => (
                  <SheetClose
                    key={item.id}
                    render={
                      <a
                        href={`#${item.anchor}`}
                        aria-current={active === item.anchor ? "true" : undefined}
                        className={cn(
                          "flex items-baseline gap-4 border-b border-line px-3 py-4",
                          active === item.anchor
                            ? "text-ink"
                            : "text-ink-dim",
                        )}
                      />
                    }
                  >
                    <span
                      className={cn(
                        "label-mono",
                        active === item.anchor && "text-accent-text",
                      )}
                    >
                      {item.index}
                    </span>
                    <span className="text-lg font-semibold uppercase tracking-[-0.02em]">
                      {t(item.key)}
                    </span>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex items-center gap-3 border-t border-line px-5 py-4">
                <Led blink />
                <span className="label-mono-sm">{t("hero.status")}</span>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="hidden items-center justify-between border-t border-line px-8 py-1 md:flex">
        <span className="label-mono-sm">{t("header.serial")}</span>
        <span className="label-mono-sm">{t("header.location")}</span>
        <span className="label-mono-sm flex items-center gap-2">
          <Led blink />
          {t("hud.stable")}
        </span>
        <span className="label-mono-sm">{t("header.version")}</span>
      </div>
    </header>
  );
}
