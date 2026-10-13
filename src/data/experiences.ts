import type { Localized } from "./i18n";

export type Experience = {
  id: string;
  code: string;
  institution: string;
  role: Localized;
  period: Localized;
  description: Localized;
};

export const experiences: Experience[] = [
  {
    id: "exp-01",
    code: "X-01",
    institution: "[[Instituição]]",
    role: { pt: "[[Cargo / atividade]]", en: "[[Role / activity]]" },
    period: { pt: "[[Período]]", en: "[[Period]]" },
    description: {
      pt: "[[Descrição breve da experiência, responsabilidades e resultados.]]",
      en: "[[Short description of the experience, responsibilities and outcomes.]]",
    },
  },
  {
    id: "exp-02",
    code: "X-02",
    institution: "[[Instituição]]",
    role: { pt: "[[Cargo / atividade]]", en: "[[Role / activity]]" },
    period: { pt: "[[Período]]", en: "[[Period]]" },
    description: {
      pt: "[[Descrição breve da experiência, responsabilidades e resultados.]]",
      en: "[[Short description of the experience, responsibilities and outcomes.]]",
    },
  },
  {
    id: "exp-03",
    code: "X-03",
    institution: "[[Instituição]]",
    role: { pt: "[[Cargo / atividade]]", en: "[[Role / activity]]" },
    period: { pt: "[[Período]]", en: "[[Period]]" },
    description: {
      pt: "[[Descrição breve da experiência, responsabilidades e resultados.]]",
      en: "[[Short description of the experience, responsibilities and outcomes.]]",
    },
  },
];
