"use client";

import { Mail, MessageCircle, Briefcase, Code2, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { contacts, type ContactChannel } from "@/data/contact";
import { useI18n } from "@/lib/i18n-context";
import { impulse } from "@/lib/robot-store";

const ICONS: Record<ContactChannel["id"], LucideIcon> = {
  email: Mail,
  whatsapp: MessageCircle,
  linkedin: Briefcase,
  github: Code2,
};

/** 2×2 grid of contact "keys". */
export function ContactKeys() {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-2 gap-3">
      {contacts.map((channel) => {
        const Icon = ICONS[channel.id];
        const external = channel.id !== "email";
        return (
          <a
            key={channel.id}
            href={channel.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            onMouseEnter={() => impulse(3, 500)}
            onFocus={() => impulse(3, 500)}
            className="te-key group flex min-h-32 flex-col justify-between border border-line bg-bg-panel p-4 transition-colors hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <Icon className="size-6 text-ink" />
              <ArrowUpRight className="size-4 text-ink-dim transition-colors group-hover:text-accent" />
            </div>
            <div className="mt-6">
              <span className="label-mono block">{t(channel.labelKey)}</span>
              <span className="mt-1 block truncate font-mono text-xs text-ink">
                {channel.handle}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
