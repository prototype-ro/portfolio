import type { Localized } from "./i18n";

export type Experience = {
  id: string;
  code: string;
  institution: string;
  role: Localized;
  period: Localized;
  description: Localized;
};

// Newest → oldest.
export const experiences: Experience[] = [
  {
    id: "worley",
    code: "X-01",
    institution: "Worley",
    role: { pt: "Engenheiro Civil Júnior", en: "Junior Civil Engineer" },
    period: { pt: "02/2024 – atual", en: "02/2024 – present" },
    description: {
      pt: "Projeto estruturas de concreto armado para projetos de mineração da Vale (Tamanduá e Britagem VGR2), trabalhando com modelos 3D ao lado de arquitetura, elétrica, tubulação e mecânica. Meu diferencial é transformar tarefas repetitivas em ferramentas: desenvolvi uma automação que lê os resultados do Robot Structural Analysis e monta a memória de cálculo sozinha, aumentando a produtividade da equipe em mais de 80%, e outra que cruza os quantitativos dos engenheiros com os exportados do Revit para encontrar inconsistências.",
      en: "I design reinforced concrete structures for Vale mining projects (Tamanduá and VGR2 Crushing), working in 3D models alongside architecture, electrical, piping and mechanical teams. What sets my work apart is turning repetitive tasks into tools: I built an automation that reads Robot Structural Analysis results and assembles the calculation report on its own, raising team productivity by over 80%, and another that cross-checks the engineers' quantities against Revit exports to catch inconsistencies.",
    },
  },
  {
    id: "atkinsrealis",
    code: "X-02",
    institution: "AtkinsRéalis (SNC-Lavalin)",
    role: {
      pt: "Estagiário → Assistente Técnico → Analista de Engenharia Júnior",
      en: "Intern → Technical Assistant → Junior Engineering Analyst",
    },
    period: { pt: "2021 – 02/2024", en: "2021 – 02/2024" },
    description: {
      pt: "Comecei como estagiário e cresci até analista de engenharia em três projetos de mineração da Vale (S11D, Capanema e Filtragem de Brucutu), dimensionando estruturas de concreto armado, modelando em 3D e elaborando memórias de cálculo. Já unindo engenharia e programação, criei uma ferramenta de controle de projeto, emissão de documentos e previsão de equipe (MFL) e apresentei soluções de automação da disciplina de concreto no AtkinsRéalis Excellence Project Brasil 2023.",
      en: "I started as an intern and grew into an engineering analyst across three Vale mining projects (S11D, Capanema and Brucutu Filtering), designing reinforced concrete structures, modeling in 3D and writing calculation reports. Already combining engineering and programming, I built a tool for project control, document issuance and manpower forecasting (MFL), and presented the concrete team's automation solutions at AtkinsRéalis Excellence Project Brazil 2023.",
    },
  },
];
