"use client";

import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";
import { useI18n } from "@/lib/i18n-context";

import { SectionShell } from "@/components/SectionShell";
import { StatTile } from "@/components/StatTile";
import { SpecRow } from "@/components/SpecRow";
import { CornerMarks } from "@/components/CornerMarks";
import { Led } from "@/components/Led";
import { Timeline } from "@/components/Timeline";
import { ExperienceItem } from "@/components/ExperienceItem";
import { ContactKeys } from "@/components/ContactKeys";
import { ContactForm } from "@/components/ContactForm";

const TECHS = Array.from(new Set(projects.flatMap((p) => p.tech))).filter(
  (techItem) => !techItem.startsWith("[["),
);

const STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Swift",
  "SwiftUI",
  "Java",
  "Spring Boot",
  "Notion",
  "Figma",
];

export default function Page() {
  const { t } = useI18n();

  return (
    <>
      <SectionShell
        id="sobre"
        index="01"
        title={t("nav.sobre")}
        kicker={t("about.p1")}
      >
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-12">
          <div className="flex flex-col">
            <p className="label-mono">{t("hero.kicker")}</p>
            <h1 className="mt-4 text-[clamp(3.5rem,12vw,10rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em]">
              Rodrigo
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-snug text-ink">
              {t("hero.tagline.pt")}
            </p>
            <p className="mt-1 max-w-xl text-sm leading-snug text-ink-dim">
              {t("hero.tagline.en")}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-dim">
              {t("about.p2")}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#projetos"
                className="te-key chamfer bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-ink transition-colors hover:brightness-95"
              >
                {t("hero.cta.projects")}
              </a>
              <a
                href="#contato"
                className="te-key chamfer bg-sky px-6 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink transition-colors hover:brightness-95"
              >
                {t("hero.cta.contact")}
              </a>
            </div>

            <div className="mt-9 border-y border-line py-4">
              <span className="label-mono">{t("hero.stack")}</span>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {STACK.map((item) => (
                  <li key={item} className="font-mono text-xs text-ink-dim">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Stage: the background robot stands here on desktop. */}
            <aside className="relative hidden min-h-[300px] flex-1 border border-dashed border-line/70 md:block">
              <CornerMarks size={14} color="var(--ink)" />
              <span className="label-mono absolute left-3 top-3">
                {t("hero.status")}
              </span>
              <span className="label-mono-sm absolute bottom-3 left-3 flex items-center gap-2">
                <Led blink />
                CAM 01 · LIVE FEED
              </span>
            </aside>

            <div className="grid grid-cols-3 gap-3">
              <StatTile
                value={String(projects.length).padStart(2, "0")}
                label={t("stat.projects")}
              />
              <StatTile
                value={String(STACK.length).padStart(2, "0")}
                label={t("stat.techs")}
                accent="var(--sky)"
              />
              <StatTile value="02" label={t("stat.years")} />
            </div>
          </div>
        </div>

        <div className="mt-10 border border-line bg-bg-panel/75 p-5 backdrop-blur-sm md:p-6">
          <div className="flex items-center justify-between">
            <span className="label-mono">SPEC SHEET</span>
            <span className="label-mono-sm">RD-01</span>
          </div>
          <div className="mt-4 grid gap-x-12 md:grid-cols-2">
            <SpecRow
              label={t("about.spec.formacao")}
              value={t("about.spec.formacao.value")}
            />
            <SpecRow
              label={t("about.spec.atuacao")}
              value={t("about.spec.atuacao.value")}
            />
            <SpecRow
              label={t("about.spec.local")}
              value={t("about.spec.local.value")}
            />
            <SpecRow
              label={t("about.spec.interesses")}
              value={t("about.spec.interesses.value")}
            />
            <SpecRow
              label={t("about.spec.objetivos")}
              value={t("about.spec.objetivos.value")}
            />
            <SpecRow label="STATUS" value={t("hero.status")} />
          </div>
        </div>

        <figure className="mt-10 border-l-2 border-accent pl-5 md:pl-6">
          <blockquote className="max-w-3xl text-xl leading-snug text-ink md:text-2xl">
            “{t("about.quote")}”
          </blockquote>
          <figcaption className="label-mono mt-3">
            {t("about.quote.source")}
          </figcaption>
        </figure>
      </SectionShell>

      <SectionShell
        id="projetos"
        index="02"
        title={t("nav.projetos")}
        kicker={t("projects.intro")}
      >
        <Timeline />
      </SectionShell>

      <SectionShell
        id="experiencias"
        index="03"
        title={t("nav.experiencias")}
        kicker={t("exp.intro")}
      >
        <div className="border-t border-line">
          {experiences.map((experience) => (
            <ExperienceItem key={experience.id} experience={experience} />
          ))}
        </div>
        <p className="label-mono-sm mt-6">{"// " + TECHS.join(" · ")}</p>
      </SectionShell>

      <SectionShell
        id="contato"
        index="04"
        title={t("nav.contato")}
        kicker={t("contact.intro")}
      >
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <span className="label-mono">CANAL DIRETO</span>
            <div className="mt-4">
              <ContactKeys />
            </div>
          </div>
          <div>
            <span className="label-mono">FORMULÁRIO</span>
            <div className="mt-4">
              <ContactForm />
            </div>
          </div>
        </div>
      </SectionShell>
    </>
  );
}
