export type Lang = "pt" | "en";

export const LANGUAGES: Lang[] = ["pt", "en"];

/** A bilingual string. */
export type Localized = Record<Lang, string>;

export const dict = {
  pt: {
    "skip.link": "Pular para o conteúdo",
    "header.model": "MODEL RD-01",
    "header.serial": "S/N 2026-10-13",
    "header.location": "BELO HORIZONTE, BR",
    "header.version": "v0.1 PROTOTYPE",
    "header.menu": "Abrir menu",
    "header.close": "Fechar menu",
    "lang.pt": "PT",
    "lang.en": "EN",

    "nav.sobre": "Sobre",
    "nav.projetos": "Projetos",
    "nav.experiencias": "Experiências",
    "nav.contato": "Contato",

    "hero.kicker": "ESTUDANTE DE ENGENHARIA DE SOFTWARE · PUC MINAS",
    "hero.name": "Rodrigo",
    "hero.tagline.pt": "Construo apps e produtos digitais do zero, do design ao código.",
    "hero.tagline.en":
      "I build apps and digital products from scratch — from design to code.",
    "hero.status": "STATUS: ACTIVE · MODE: AUTONOMOUS",
    "hero.cta.projects": "VER PROJETOS",
    "hero.cta.contact": "FALAR COMIGO",
    "hero.stack": "STACK / TECNOLOGIAS",

    "stat.projects": "PROJETOS",
    "stat.techs": "TECNOLOGIAS",
    "stat.years": "ANOS DE CURSO",

    "about.p1":
      "Estudante de Engenharia de Software na PUC Minas, em Belo Horizonte. Construo apps e produtos digitais do zero, do design ao código, com obsessão por detalhe e acabamento.",
    "about.p2":
      "Atualmente equilibro a graduação com projetos autorais de produto — de apps nativos a backends e marcas digitais.",
    "about.spec.formacao": "Formação",
    "about.spec.formacao.value": "Engenharia de Software · PUC Minas (2024–)",
    "about.spec.atuacao": "Área de atuação",
    "about.spec.atuacao.value": "Desenvolvimento de produto · Mobile · Web",
    "about.spec.local": "Local",
    "about.spec.local.value": "Belo Horizonte, MG · BR",
    "about.spec.interesses": "Interesses",
    "about.spec.interesses.value": "Design de produto, tipografia, hardware, áudio",
    "about.spec.objetivos": "Objetivos",
    "about.spec.objetivos.value": "Lançar produtos próprios e atuar como engenheiro full-stack",

    "projects.intro":
      "Do mais antigo ao mais recente. Cada módulo abaixo é um experimento registrado.",
    "projects.repo": "REPO",
    "projects.tech": "TECNOLOGIAS",
    "projects.screen": "SCREEN",

    "exp.intro": "Ficha técnica de atividades, formações e colaborações.",
    "exp.period": "Período",
    "exp.role": "Atividade",
    "exp.institution": "Instituição",
    "exp.expand": "Expandir",
    "exp.collapse": "Recolher",

    "contact.intro":
      "Canais diretos e um formulário. O robô acompanha o cursor — foco no campo e ele se prepara para receber.",
    "contact.email": "E-mail",
    "contact.whatsapp": "WhatsApp",
    "contact.linkedin": "LinkedIn",
    "contact.github": "GitHub",
    "contact.form.name": "Nome",
    "contact.form.name.placeholder": "Como devo te chamar?",
    "contact.form.email": "E-mail",
    "contact.form.email.placeholder": "voce@exemplo.com",
    "contact.form.message": "Mensagem",
    "contact.form.message.placeholder": "Conte um pouco sobre a ideia…",
    "contact.form.send": "ENVIAR",
    "contact.form.sending": "ENVIANDO…",
    "contact.form.success": "Mensagem registrada no log. Respondo em breve.",
    "contact.form.disableHints": "PRONTO PARA RECEBER",
    "contact.form.error.name": "Informe pelo menos 2 caracteres.",
    "contact.form.error.email": "Informe um e-mail válido.",
    "contact.form.error.message": "Escreva pelo menos 10 caracteres.",
    "contact.form.error.send":
      "Não foi possível enviar agora. Tente novamente ou use um canal direto.",
    "contact.form.simulated":
      "MODO SIMULADO — configure .env.local para envio real (ver .env.example)",

    "footer.rights": "Todos os direitos reservados.",
    "footer.built": "Feito com Next.js · TypeScript · Tailwind",
    "footer.madeIn": "PROJETADO E MONTADO EM BELO HORIZONTE",

    "hud.title": "TELEMETRIA",
    "hud.frame": "FRAME",
    "hud.joint1": "JOINT 1",
    "hud.joint2": "JOINT 2",
    "hud.joint3": "JOINT 3",
    "hud.gripper": "GRIPPER",
    "hud.scroll": "SCROLL",
    "hud.loading": "LOADING FRAMES",
    "hud.mode.frames": "3D",
    "hud.mode.procedural": "PROC",
    "hud.replace": "REPLACE WITH /public/frames",
    "hud.open": "OPEN",
    "hud.closed": "CLOSED",
    "hud.cycle": "ARM CYCLE INIT",
    "hud.stable": "STATUS: STABLE",
  },
  en: {
    "skip.link": "Skip to content",
    "header.model": "MODEL RD-01",
    "header.serial": "S/N 2026-10-13",
    "header.location": "BELO HORIZONTE, BR",
    "header.version": "v0.1 PROTOTYPE",
    "header.menu": "Open menu",
    "header.close": "Close menu",
    "lang.pt": "PT",
    "lang.en": "EN",

    "nav.sobre": "About",
    "nav.projetos": "Projects",
    "nav.experiencias": "Experience",
    "nav.contato": "Contact",

    "hero.kicker": "SOFTWARE ENGINEERING STUDENT · PUC MINAS",
    "hero.name": "Rodrigo",
    "hero.tagline.pt": "Construo apps e produtos digitais do zero, do design ao código.",
    "hero.tagline.en":
      "I build apps and digital products from scratch — from design to code.",
    "hero.status": "STATUS: ACTIVE · MODE: AUTONOMOUS",
    "hero.cta.projects": "VIEW PROJECTS",
    "hero.cta.contact": "GET IN TOUCH",
    "hero.stack": "STACK / TECHNOLOGIES",

    "stat.projects": "PROJECTS",
    "stat.techs": "TECHNOLOGIES",
    "stat.years": "YEARS OF STUDY",

    "about.p1":
      "Software Engineering student at PUC Minas, in Belo Horizonte. I build apps and digital products from scratch — from design to code, with an obsession for detail and finish.",
    "about.p2":
      "I balance my degree with self-directed product work — from native apps to backends and digital brands.",
    "about.spec.formacao": "Education",
    "about.spec.formacao.value": "Software Engineering · PUC Minas (2024–)",
    "about.spec.atuacao": "Field",
    "about.spec.atuacao.value": "Product engineering · Mobile · Web",
    "about.spec.local": "Location",
    "about.spec.local.value": "Belo Horizonte, MG · BR",
    "about.spec.interesses": "Interests",
    "about.spec.interesses.value": "Product design, typography, hardware, audio",
    "about.spec.objetivos": "Goals",
    "about.spec.objetivos.value": "Ship my own products and work as a full-stack engineer",

    "projects.intro":
      "From oldest to newest. Every module below is a logged experiment.",
    "projects.repo": "REPO",
    "projects.tech": "TECH",
    "projects.screen": "SCREEN",

    "exp.intro": "Technical sheet of activities, education and collaborations.",
    "exp.period": "Period",
    "exp.role": "Activity",
    "exp.institution": "Institution",
    "exp.expand": "Expand",
    "exp.collapse": "Collapse",

    "contact.intro":
      "Direct channels and a form. The robot tracks the cursor — focus a field and it gets ready to receive.",
    "contact.email": "Email",
    "contact.whatsapp": "WhatsApp",
    "contact.linkedin": "LinkedIn",
    "contact.github": "GitHub",
    "contact.form.name": "Name",
    "contact.form.name.placeholder": "What should I call you?",
    "contact.form.email": "Email",
    "contact.form.email.placeholder": "you@example.com",
    "contact.form.message": "Message",
    "contact.form.message.placeholder": "Tell me a bit about the idea…",
    "contact.form.send": "SEND",
    "contact.form.sending": "SENDING…",
    "contact.form.success": "Message written to the log. I'll reply soon.",
    "contact.form.disableHints": "READY TO RECEIVE",
    "contact.form.error.name": "Enter at least 2 characters.",
    "contact.form.error.email": "Enter a valid email.",
    "contact.form.error.message": "Write at least 10 characters.",
    "contact.form.error.send":
      "Could not send right now. Try again or use a direct channel.",
    "contact.form.simulated":
      "SIMULATED MODE — set up .env.local for real delivery (see .env.example)",

    "footer.rights": "All rights reserved.",
    "footer.built": "Built with Next.js · TypeScript · Tailwind",
    "footer.madeIn": "DESIGNED AND ASSEMBLED IN BELO HORIZONTE",

    "hud.title": "TELEMETRY",
    "hud.frame": "FRAME",
    "hud.joint1": "JOINT 1",
    "hud.joint2": "JOINT 2",
    "hud.joint3": "JOINT 3",
    "hud.gripper": "GRIPPER",
    "hud.scroll": "SCROLL",
    "hud.loading": "LOADING FRAMES",
    "hud.mode.frames": "3D",
    "hud.mode.procedural": "PROC",
    "hud.replace": "REPLACE WITH /public/frames",
    "hud.open": "OPEN",
    "hud.closed": "CLOSED",
    "hud.cycle": "ARM CYCLE INIT",
    "hud.stable": "STATUS: STABLE",
  },
} as const;

export type DictKey = keyof (typeof dict)["pt"];
