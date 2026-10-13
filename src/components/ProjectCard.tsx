"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/data/projects";
import { useI18n } from "@/lib/i18n-context";
import { impulse } from "@/lib/robot-store";
import { CornerMarks } from "@/components/CornerMarks";
import { Led } from "@/components/Led";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  side: "left" | "right";
};

export function ProjectCard({ project, side }: ProjectCardProps) {
  const { t, pick } = useI18n();
  const [lit, setLit] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setLit(true)}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => impulse(side === "left" ? 3 : -3, 600)}
      onFocus={() => impulse(side === "left" ? 3 : -3, 600)}
      className={cn(
        "group relative border border-line bg-bg-panel/80 p-4 backdrop-blur-sm transition-colors md:p-5",
        lit ? "opacity-100" : "opacity-90",
      )}
    >
      {/* Screen */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border border-line bg-[#d8d7d2]">
        <CornerMarks size={12} color="var(--ink)" />
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          >
            <div className="te-grid-lines absolute inset-0 opacity-40" />
            <span className="label-mono relative">{project.screen}</span>
            <span className="label-mono-sm relative text-ink-dim/70">
              {project.code} · NO SIGNAL
            </span>
          </div>
        )}
        <span className="absolute right-2 top-2 z-20 flex items-center gap-2 border border-line bg-bg-panel/90 px-2 py-1">
          <Led on={lit} blink={lit} />
          <span className="label-mono-sm">{lit ? "REC" : "IDLE"}</span>
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
            {project.name}
          </h3>
          <span className="label-mono-sm mt-1 block">
            {pick(project.period)}
          </span>
        </div>
        <span className="label-mono-sm mt-1 shrink-0 border border-line px-2 py-1">
          {project.code}
        </span>
      </div>

      <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-dim">
        {pick(project.description)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {project.tech.map((techItem, index) => (
          <span
            key={`${techItem}-${index}`}
            className="chamfer-sm border border-line bg-bg px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-dim"
          >
            {techItem}
          </span>
        ))}
      </div>

      <a
        href={project.repo}
        target="_blank"
        rel="noreferrer"
        className="te-key chamfer-sm mt-5 inline-flex items-center gap-2 border border-ink bg-bg px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-bg"
      >
        {t("projects.repo")}
        <ArrowUpRight className="size-3.5" />
      </a>
    </motion.article>
  );
}
