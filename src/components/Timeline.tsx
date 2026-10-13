"use client";

import { useEffect, useState } from "react";

import { projects as defaultProjects, type Project } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { cn } from "@/lib/utils";

type TimelineProps = {
  projects?: Project[];
};

/** Vertical timeline: thin centre axis with numbered square nodes. */
export function Timeline({ projects = defaultProjects }: TimelineProps) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute bottom-0 left-[15px] top-0 w-px bg-line md:left-1/2 md:-translate-x-1/2"
      />
      <ol className="flex flex-col gap-12 md:gap-20">
        {projects.map((project, index) => {
          const side = index % 2 === 0 ? "left" : "right";
          return (
            <li
              key={project.id}
              className="relative pl-10 md:grid md:grid-cols-2 md:gap-14 md:pl-0"
            >
              <TimelineNode code={project.code} />
              <div
                className={cn(
                  side === "left"
                    ? "md:col-start-1 md:pr-6"
                    : "md:col-start-2 md:pl-6",
                )}
              >
                <ProjectCard project={project} side={side} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function TimelineNode({ code }: { code: string }) {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setLit(true), 250);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="absolute left-[15px] top-6 z-10 -translate-x-1/2 md:left-1/2">
      <span
        className={cn(
          "grid size-4 place-items-center border transition-colors",
          lit
            ? "border-accent bg-accent/15"
            : "border-line bg-bg-panel",
        )}
      >
        <span
          className={cn(
            "size-1.5",
            lit ? "bg-accent" : "bg-led-off",
          )}
        />
      </span>
      <span className="label-mono-sm absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap md:hidden">
        {code}
      </span>
    </div>
  );
}
