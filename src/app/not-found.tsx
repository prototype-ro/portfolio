import Link from "next/link";

import { CornerMarks } from "@/components/CornerMarks";
import { Led } from "@/components/Led";

export default function NotFound() {
  return (
    <section className="border-t border-line px-5 py-20 sm:px-8 md:py-28">
      <div className="relative mx-auto flex max-w-3xl flex-col border border-line bg-bg-panel/70 p-6 backdrop-blur-sm md:p-10">
        <CornerMarks size={14} color="var(--ink)" />
        <div className="flex items-center justify-between">
          <span className="label-mono">ERROR 404</span>
          <span className="label-mono-sm flex items-center gap-2">
            <Led on={false} />
            SIGNAL LOST
          </span>
        </div>

        <h1 className="mt-10 text-[clamp(3rem,12vw,7rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em]">
          404
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-dim">
          Módulo não encontrado. O endereço não corresponde a nenhuma seção do
          painel.
        </p>
        <p className="mt-1 max-w-md font-mono text-xs text-ink-dim">
          Module not found — this address isn&apos;t wired to any section.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="te-key chamfer inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-ink transition-colors hover:brightness-95"
          >
            VOLTAR AO INÍCIO
          </Link>
        </div>
      </div>
    </section>
  );
}
