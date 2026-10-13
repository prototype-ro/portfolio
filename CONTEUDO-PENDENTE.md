# Conteúdo pendente

Tudo abaixo está com placeholder `[[...]]` e precisa do seu conteúdo real. Nada
disso quebra o site — basta substituir nos arquivos indicados.

## 1. Identidade

- [ ] **Sobrenome** — substitua `[[sobrenome]]` em `README.md`, `LICENSE`,
      `src/app/layout.tsx` (metadata), `src/components/Header.tsx` e
      `src/components/Footer.tsx`.
- [ ] **Link do Figma** — `README.md` (`[[LINK FIGMA]]`).

## 2. Contato — `src/data/contact.ts`

- [ ] `[[email]]` (no `href` e no `handle`)
- [ ] `[[whatsapp]]` (só dígitos, ex.: `5531999998888`)
- [ ] `[[linkedin]]` (handle)
- [ ] `[[github]]` (usuário)

## 3. Projetos — `src/data/projects.ts`

- [ ] P-01 `[[Projeto antigo]]`: nome, descrição PT/EN, tecnologias, repo.
- [ ] `[[usuario]]` nos links de repo (P-02 Quicknote, P-03 The Simple Trip,
      P-04 Eregion).
- [ ] (Opcional) **Capturas/GIFs** de cada projeto → salve em
      `public/projects/` e preencha o campo `image` do projeto
      (ex.: `image: "/projects/quicknote.webp"`).

## 4. Experiências — `src/data/experiences.ts`

Para cada um dos 3 itens:

- [ ] `[[Instituição]]`
- [ ] `[[Cargo / atividade]]` (PT/EN)
- [ ] `[[Período]]` (PT/EN)
- [ ] `[[Descrição breve ...]]` (PT/EN)

## 5. Textos "Sobre" — `src/data/i18n.ts`

- [ ] `about.p1` / `about.p2` — revise o texto PT/EN (marquei para revisar).
- [ ] `about.spec.*` — confira formação, foco, interesses e objetivos.
- [ ] Substitua o marcador `[[REVISAR]]` onde aparecer.

## 6. Números reais — `src/app/page.tsx`

- [ ] Tiles de estatística: `projetos` (automático), `tecnologias`
      (automático da lista `STACK`), `anos de curso` (hoje fixo em `02`) e
      `projetos.length`.
- [ ] Lista `STACK` em `src/app/page.tsx` — ajuste se necessário.

## 7. EmailJS (formulário) — `.env.local`

- [ ] `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- [ ] `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- [ ] `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

Sem elas o formulário roda em **modo simulado**. Passo a passo no topo de
`.env.example`.

## 8. Deploy

- [ ] Conectar o repositório na **Vercel** e configurar as 3 variáveis acima
      no painel (Settings → Environment Variables).
- [ ] Colar a URL `*.vercel.app` no `README.md` (seção Deploy).

## 9. Robô 3D (opcional)

- [ ] Renderizar os frames WebP e seguir `docs/render-guide.md` para trocar o
      robô procedural pelo render final (sem mudar código).
