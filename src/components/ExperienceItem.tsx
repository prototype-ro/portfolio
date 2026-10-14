"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import type { Experience } from "@/data/experiences";
import { useI18n } from "@/lib/i18n-context";
import { impulse } from "@/lib/robot-store";
import { SpecRow } from "@/components/SpecRow";
import { cn } from "@/lib/utils";

export function ExperienceItem({ experience }: { experience: Experience }) {
  const { t, pick } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          impulse(2, 450);
        }}
        aria-expanded={open}
        aria-label={open ? t("exp.collapse") : t("exp.expand")}
        className="flex w-full items-baseline justify-between gap-4 py-4 text-left transition-colors hover:text-accent-text"
      >
        <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="label-mono">{experience.code}</span>
          <span className="text-lg font-semibold tracking-[-0.02em]">
            {experience.institution}
          </span>
          <span className="label-mono-sm">{pick(experience.role)}</span>
        </span>
        <span className="flex shrink-0 items-center gap-4">
          <span className="font-mono text-xs text-ink-dim">
            {pick(experience.period)}
          </span>
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 pl-0 sm:pl-14">
              <SpecRow label={t("exp.institution")} value={experience.institution} />
              <SpecRow label={t("exp.role")} value={pick(experience.role)} />
              <SpecRow label={t("exp.period")} value={pick(experience.period)} />
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-dim">
                {pick(experience.description)}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
