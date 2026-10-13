# Portfólio — Rodrigo [[sobrenome]]

Portfólio profissional de um estudante de **Engenharia de Software (PUC Minas)**,
com estética de **hardware Teenage Engineering** e um **robô de fundo animado
pelo scroll**.

**Status:** 🟠 Lab01S01 em andamento — protótipo navegável (S02 e S03 a seguir).

[![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-087ea4?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-2ea44f)](./LICENSE)

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Wireframes (Figma)](#wireframes-figma)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Instalação e execução](#instalação-e-execução)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Demonstração](#demonstração)
- [Planejamento das sprints](#planejamento-das-sprints)
- [O robô de fundo](#o-robô-de-fundo)
- [O que ainda é placeholder](#o-que-ainda-é-placeholder)
- [Autores](#autores)
- [Licença](#licença)

## Sobre o projeto

Portfólio de **página única com rolagem contínua**: quatro seções ancoradas
(`#sobre`, `#projetos`, `#experiencias`, `#contato`) numa linha do tempo
compartilhada que também controla a animação do robô de fundo.

O projeto é desenvolvido para a disciplina **Desenvolvimento e Integração de
Aplicações Web (DIAW)** — **Laboratório 01** (Prof. João Paulo Aramuni), nas
sprints S01 (planejamento e protótipo), S02 (funcionalidades) e S03 (deploy e
acabamento).

## Funcionalidades

- Cabeçalho fixo com navegação por âncoras e **seção ativa** via
  `IntersectionObserver`; menu mobile em `Sheet`.
- Alternador **PT | EN** global (dicionário próprio + persistência em
  `localStorage`), com `<html lang>` acompanhando o idioma.
- Quatro seções no estilo ficha técnica: **Sobre** (título, subtítulo bilíngue,
  botões, tiles de estatística e *spec sheet*), **Projetos** (timeline vertical
  com cartões alternados), **Experiências** (itens expansíveis) e **Contato**
  (ícones diretos + formulário).
- **Robô de fundo** em `<canvas>` mapeado ao scroll, com inércia, parallax e
  telemetria em tempo real (ver abaixo).
- Rodapé com contador de rolagem estilo hardware.
- Acessibilidade: *skip link*, foco visível, rótulos e contraste AA.

## Wireframes (Figma)

Wireframes de **média fidelidade** das quatro seções (desktop 1440 px e mobile
390 px), em SVG vetorial editável e PNG. Arquivos em
[`docs/wireframes/`](docs/wireframes/) — passo a passo de importação em
[`docs/wireframes/LEIA-ME.md`](docs/wireframes/LEIA-ME.md).

🔗 **Link do Figma:** `[[LINK FIGMA]]`

| Desktop | Mobile |
| --- | --- |
| ![Sobre](docs/wireframes/desktop-sobre.png) | ![Sobre mobile](docs/wireframes/mobile-sobre.png) |
| ![Projetos](docs/wireframes/desktop-projetos.png) | ![Projetos mobile](docs/wireframes/mobile-projetos.png) |
| ![Experiências](docs/wireframes/desktop-experiencias.png) | ![Experiências mobile](docs/wireframes/mobile-experiencias.png) |
| ![Contato](docs/wireframes/desktop-contato.png) | ![Contato mobile](docs/wireframes/mobile-contato.png) |

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19 |
| Linguagem | TypeScript (estrito) |
| Estilo | Tailwind CSS v4 (tokens em `globals.css`), shadcn/ui |
| Animação | Framer Motion |
| Formulário | React Hook Form + Zod |
| E-mail | EmailJS (`@emailjs/browser`) |
| Capturas | Playwright |

## Arquitetura

- **Página única** com âncoras; sem back-end próprio.
- **Dados em `src/data/`** (`projects`, `experiences`, `contact`, `i18n`,
  `robot`): todo o conteúdo é editável sem tocar nos componentes.
- **i18n** próprio: dicionário tipado, Context e persistência.
- **Robô** desacoplado: `RobotBackdrop` (canvas fixo) lê o scroll, faz *lerp*
  para a inércia e publica a telemetria num *store* externo consumido pelo
  `TelemetryHUD` (`useSyncExternalStore`).
- **Frames opcionais:** o robô funciona em modo procedural 2D; se existirem
  frames WebP em `public/frames/robot/`, ele usa a sequência sem mudar código.

## Instalação e execução

Pré-requisitos: **Node 20+** e npm.

```bash
npm install
cp .env.example .env.local   # opcional (EmailJS); sem isso o form é simulado
npm run dev                  # http://localhost:3000
npm run build && npm start   # build de produção
npm run lint                 # ESLint
```

## Estrutura de pastas

```
src/
  app/            layout, page (4 seções), globals.css
  components/     RobotBackdrop, TelemetryHUD, Header, Footer, seções, primitivos
  components/ui/  primitivos shadcn/ui
  data/           projects, experiences, contact, i18n, robot
  hooks/          useScrollProgress, useActiveSection, useReducedMotion
  lib/            frames (carregamento progressivo), robot-store, i18n-context
public/frames/robot/   manifest.json + frames (vazio no protótipo → fallback 2D)
docs/
  wireframes/     wireframes SVG/PNG + LEIA-ME.md
  prototipo/      capturas (sobre, projetos, experiencias, contato, mobile) + scroll.gif
  render-guide.md como produzir/trocar os frames do robô
scripts/          capture.mjs, check-overflow.mjs, wireframes.mjs
```

## Demonstração

Capturas do protótipo atual (Playwright, 1440×900 e 390×844) em
[`docs/prototipo/`](docs/prototipo/).

| Sobre | Projetos |
| --- | --- |
| ![Sobre](docs/prototipo/sobre.png) | ![Projetos](docs/prototipo/projetos.png) |

| Experiências | Contato |
| --- | --- |
| ![Experiências](docs/prototipo/experiencias.png) | ![Contato](docs/prototipo/contato.png) |

![Rolagem](docs/prototipo/scroll.gif)

## Planejamento das sprints

| Sprint | Escopo | Status |
| --- | --- | --- |
| **Lab01S01** | Repositório, wireframes, protótipo navegável, layout e robô (fallback 2D) | ✅ |
| **Lab01S02** | Sobre bilíngue, timeline de projetos, experiências, formulário validado, EmailJS | ⏳ |
| **Lab01S03** | Deploy na Vercel, acabamento visual, capturas, README final | ⏳ |

## O robô de fundo

O `RobotBackdrop` (canvas fixo, `aria-hidden`) usa uma sequência de frames
mapeada ao scroll, com **inércia (lerp)** e telemetria em tempo real.

- **Sem frames** (padrão do protótipo): desenha um robô procedural 2D — mesmo
  mapeamento e inércia. Marca `PLACEHOLDER ROBOT` no canto.
- **Com frames**: coloque os WebP em `public/frames/robot/{desktop,mobile}/` e
  ligue `placeholder: false` em `manifest.json`. Nenhum código muda.

Interações: parallax do mouse (desktop), hover nos cartões (empurrão),
foco no formulário e envio com sucesso. `prefers-reduced-motion` desativa o
movimento. Detalhes em [`docs/render-guide.md`](docs/render-guide.md).

## O que ainda é placeholder

Ver [`CONTEUDO-PENDENTE.md`](CONTEUDO-PENDENTE.md). Em resumo: nome/e-mail/
telefone/links e textos marcados `[[...]]` em `src/data/`, imagens dos projetos
(caixas 16:10 com `SCREEN 0N`) e link do Figma.

## Autores

**Rodrigo [[sobrenome]]** — Engenharia de Software, PUC Minas.
Orientação: Prof. João Paulo Aramuni (DIAW).

## Licença

Distribuído sob a licença **MIT** — ver [`LICENSE`](./LICENSE). Projeto de uso
acadêmico, com identidade e textos originais.
