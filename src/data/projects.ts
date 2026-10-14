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
    id: "quicknote",
    code: "P-01",
    name: "Quicknote",
    description: {
      pt: "App de notas nativo para iOS com notas de voz transcritas, Live Activity na Dynamic Island, widget e extensão de compartilhamento. Agrupa notas parecidas por significado direto no aparelho.",
      en: "Native iOS notes app with transcribed voice notes, a Dynamic Island Live Activity, a widget and a share extension. Groups related notes by meaning on device.",
    },
    tech: ["Swift", "SwiftUI", "SwiftData", "WidgetKit", "ActivityKit"],
    repo: "https://github.com/prototype-ro/QuickNote",
    period: { pt: "2026", en: "2026" },
    screen: "SCREEN 01",
    image: "/projects/quicknote.png",
  },
  {
    id: "eregion",
    code: "P-02",
    name: "Eregion",
    description: {
      pt: "Deck builder de Commander (Magic) com histórico de versões real: cada salvamento é um snapshot, com comparação entre versões, branches e merge com resolução de conflitos. Importa decks por link e busca cartas na Scryfall.",
      en: "Commander (Magic) deck builder with real version history: every save is a snapshot, with version diffs, branches and merges with conflict resolution. Imports decks from links and searches cards on Scryfall.",
    },
    tech: ["Java", "Spring Boot", "PostgreSQL", "Next.js", "Tailwind"],
    repo: "https://github.com/prototype-ro/Eregion",
    period: { pt: "2026", en: "2026" },
    screen: "SCREEN 02",
    image: "/projects/eregion.png",
  },
  {
    id: "the-simple-trip",
    code: "P-03",
    name: "The Simple Trip",
    description: {
      pt: "Template de Notion para planejar viagens que reúne roteiro, orçamento, documentos e hospedagem em um só lugar, com identidade visual própria e landing page de vendas em React.",
      en: "Notion travel-planning template that brings itinerary, budget, documents and lodging into one place, with its own visual identity and a React sales landing page.",
    },
    tech: ["Notion", "React", "TypeScript", "Tailwind", "Motion"],
    repo: "https://github.com/prototype-ro/The-Simple-Trip",
    period: { pt: "2026", en: "2026" },
    screen: "SCREEN 03",
    image: "/projects/the-simple-trip.png",
  },
];
