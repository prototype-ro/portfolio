# Wireframes — Lab01S01

Wireframes de **média fidelidade** das quatro seções do portfólio, em desktop
(1440 px) e mobile (390 px). Feitos para serem **importados no Figma** e
apresentados no README do projeto.

Cada arquivo tem duas versões:

- `.svg` — vetor limpo (arraste para o Figma sem perder qualidade);
- `.png` — exportação 2×, pronta para colar em slides ou no README.

## Arquivos

| Seção | Desktop | Mobile |
| --- | --- | --- |
| 01 — Sobre | `desktop-sobre.svg` | `mobile-sobre.svg` |
| 02 — Projetos (timeline) | `desktop-projetos.svg` | `mobile-projetos.svg` |
| 03 — Experiências | `desktop-experiencias.svg` | `mobile-experiencias.svg` |
| 04 — Contato | `desktop-contato.svg` | `mobile-contato.svg` |

## Como importar no Figma

1. Abra o Figma e crie um arquivo novo (**New design file**).
2. Arraste os 8 `.svg` de `docs/wireframes/` para dentro do canvas — o Figma
   converte cada um em *frame* vetorial editável.
3. Organize em duas linhas: **desktop** (topo) e **mobile** (abaixo), na ordem
   01 → 04.
4. (Opcional) Selecione tudo e aplique um *frame* de apresentação:
   `Prototype` → *Present* para navegar entre as telas.
5. **Compartilhe:** botão **Share** → *Anyone with the link* → **Copy link**.
   Cole esse link no README (marcador `[[LINK FIGMA]]`) e me avise.

## Anotações de design embutidas

- Cabeçalho fixo com navegação por âncoras e alternador **PT | EN**.
- Faixa de rolagem (*telemetria*) fixa no rodapé, estilo hardware.
- Botão primário laranja, secundário contornado, canto chanfrado.
- Cartões de projeto com caixa 16:10 e marcadores de canto `[ ]`.
- Timeline vertical com eixo fino e nós quadrados numerados (`P-01`…).
- Ficha técnica com linhas pontilhadas (`label ········ valor`).
- Robô de fundo é um **stage reservado** no layout (camada fixa, `z-0`).

## Regerar

```bash
node scripts/wireframes.mjs
```

O script `scripts/wireframes.mjs` desenha os SVGs e exporta os PNGs com
Playwright (requer `npm install`).
