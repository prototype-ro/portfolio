import type { Localized } from "./i18n";

export type Project = {
  id: string;
  /** Timeline marker code, e.g. "P-01". */
  code: string;
  name: string;
  description: Localized;
  tech: string[];
  repo: string;
  /** Human readable period, e.g. "2024". */
  period: Localized;
  /** Placeholder artwork label shown inside the 16:10 screen box. */
  screen: string;
  /** Optional real image/GIF path (kept empty until assets exist). */
  image?: string;
};

// Chronological order: oldest → newest.
export const projects: Project[] = [
  {
    id: "projeto-antigo",
    code: "P-01",
    name: "[[Projeto antigo]]",
    description: {
      pt: "Primeiro projeto do perfil. Substituir por um projeto real: contexto, problema e aprendizado.",
      en: "The profile's first project. Replace with a real one: context, problem and takeaway.",
    },
    tech: ["[[tech-1]]", "[[tech-2]]"],
    repo: "https://github.com/[[usuario]]/[[repo]]",
    period: { pt: "2023", en: "2023" },
    screen: "SCREEN 01",
  },
  {
    id: "quicknote",
    code: "P-02",
    name: "Quicknote",
    description: {
      pt: "App de notas nativo para iOS, focado em captura instantânea com sincronização leve e atalhos de teclado.",
      en: "Native iOS notes app focused on instant capture, with lightweight sync and keyboard shortcuts.",
    },
    tech: ["Swift", "SwiftUI"],
    repo: "https://github.com/[[usuario]]/quicknote",
    period: { pt: "2024", en: "2024" },
    screen: "SCREEN 02",
  },
  {
    id: "the-simple-trip",
    code: "P-03",
    name: "The Simple Trip",
    description: {
      pt: "Marca de planejamento de viagens, começando como template de Notion: sistema de roteiros, checklists e identidade visual.",
      en: "Travel planning brand starting as a Notion template: itinerary system, checklists and visual identity.",
    },
    tech: ["Notion", "Branding"],
    repo: "https://github.com/[[usuario]]/the-simple-trip",
    period: { pt: "2025", en: "2025" },
    screen: "SCREEN 03",
  },
  {
    id: "eregion",
    code: "P-04",
    name: "Eregion",
    description: {
      pt: "Backend de deck builder de Magic com histórico de versões — comparação de decks, ramificações e rollback.",
      en: "Magic deck builder backend with version history — deck diffing, branching and rollback.",
    },
    tech: ["Java", "Spring Boot"],
    repo: "https://github.com/[[usuario]]/eregion",
    period: { pt: "2025–2026", en: "2025–2026" },
    screen: "SCREEN 04",
  },
];
