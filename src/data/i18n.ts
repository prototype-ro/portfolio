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
    "stat.years": "PERÍODOS",

    "about.p1":
      "Estudante de Engenharia de Software na PUC Minas e engenheiro civil em Belo Horizonte. Há 6 anos projeto estruturas de concreto armado para projetos de mineração e industriais, hoje como Engenheiro Civil Júnior na Worley.",
    "about.p2":
      "Meu foco sempre foi resolver problemas com tecnologia: automações em VBA, modelos 3D e ferramentas que poupam horas da equipe. Agora levo isso para apps e produtos digitais próprios, do design ao código.",
    "about.spec.formacao": "Formação",
    "about.spec.formacao.value": "Eng. de Software · PUC Minas (2026–) · Eng. Civil · PUC Minas (2017–2021) · Pós em Eng. Estrutural · PUC Minas (2022–2023)",
    "about.spec.atuacao": "Área de atuação",
    "about.spec.atuacao.value": "Engenharia estrutural · Automação · Desenvolvimento de produto",
    "about.spec.local": "Local",
    "about.spec.local.value": "Belo Horizonte, MG · BR",
    "about.spec.interesses": "Interesses",
    "about.spec.interesses.value": "Música, arte, games, tecnologia, cinema e viagens",
    "about.quote":
      "To see the world, things dangerous to come to, to see behind walls, draw closer, to find each other, and to feel. That is the purpose of life.",
    "about.quote.source": "LEMA DA REVISTA LIFE · A VIDA SECRETA DE WALTER MITTY (2013)",
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

    "rec.record": "REC",
    "rec.stop": "PARAR",
    "rec.started":
      "Gravação iniciada — escolha a aba do site na janela do navegador.",
    "rec.saved": "Vídeo salvo (.webm).",
    "rec.error": "Não foi possível iniciar a gravação.",
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
    "stat.years": "SEMESTERS",

    "about.p1":
      "Software Engineering student at PUC Minas and civil engineer in Belo Horizonte. For 6 years I have designed reinforced concrete structures for mining and industrial projects, currently as a Junior Civil Engineer at Worley.",
    "about.p2":
      "I have always solved problems with technology: VBA automations, 3D models and tools that save my team hours. Now I bring that to my own apps and digital products, from design to code.",
    "about.spec.formacao": "Education",
    "about.spec.formacao.value": "Software Engineering · PUC Minas (2026–) · Civil Engineering · PUC Minas (2017–2021) · Postgrad in Structural Engineering · PUC Minas (2022–2023)",
    "about.spec.atuacao": "Field",
    "about.spec.atuacao.value": "Structural engineering · Automation · Product development",
    "about.spec.local": "Location",
    "about.spec.local.value": "Belo Horizonte, MG · BR",
    "about.spec.interesses": "Interests",
    "about.spec.interesses.value": "Music, art, games, technology, movies and travel",
    "about.quote":
      "To see the world, things dangerous to come to, to see behind walls, draw closer, to find each other, and to feel. That is the purpose of life.",
    "about.quote.source": "LIFE MAGAZINE MOTTO · THE SECRET LIFE OF WALTER MITTY (2013)",
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

    "rec.record": "REC",
    "rec.stop": "STOP",
    "rec.started":
      "Recording started — pick the site tab in the browser dialog.",
    "rec.saved": "Video saved (.webm).",
    "rec.error": "Could not start the recording.",
  },
} as const;

export type DictKey = keyof (typeof dict)["pt"];
