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
    href: "mailto:rodrigo.lagedc@gmail.com",
    handle: "rodrigo.lagedc@gmail.com",
  },
  {
    id: "whatsapp",
    labelKey: "contact.whatsapp",
    href: "https://wa.me/5531985937611",
    handle: "+55 (31) 98593-7611",
  },
  {
    id: "linkedin",
    labelKey: "contact.linkedin",
    href: "https://www.linkedin.com/in/rodrigo-lage-da-costa-3992911b5/",
    handle: "/in/rodrigo-lage-da-costa",
  },
  {
    id: "github",
    labelKey: "contact.github",
    href: "https://github.com/prototype-ro",
    handle: "@prototype-ro",
  },
];
