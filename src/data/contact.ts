import type { DictKey } from "./i18n";

export type ContactChannel = {
  id: "email" | "whatsapp" | "linkedin" | "github";
  labelKey: DictKey;
  href: string;
  /** Visible value, e.g. the address or handle. */
  handle: string;
};

export const contacts: ContactChannel[] = [
  {
    id: "email",
    labelKey: "contact.email",
    href: "mailto:[[email]]",
    handle: "[[email]]",
  },
  {
    id: "whatsapp",
    labelKey: "contact.whatsapp",
    href: "https://wa.me/[[whatsapp]]",
    handle: "+55 [[whatsapp]]",
  },
  {
    id: "linkedin",
    labelKey: "contact.linkedin",
    href: "https://www.linkedin.com/in/[[linkedin]]",
    handle: "/in/[[linkedin]]",
  },
  {
    id: "github",
    labelKey: "contact.github",
    href: "https://github.com/[[github]]",
    handle: "@[[github]]",
  },
];
