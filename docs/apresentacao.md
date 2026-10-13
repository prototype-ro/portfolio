# Apresentação final — DIAW Lab01 (≈ 5 min)

Roteiro para apresentar o portfólio publicado. Fale como se estivesse
mostrando um equipamento: calmo, direto, com a tela na frente.

---

## 1. Objetivo e público (30 s)

> "Esse é o meu portfólio profissional. O público é recrutador técnico e
> professor: alguém que quer entender, em menos de um minuto, quem eu sou, o
> que construo e como falar comigo. Por isso uma única página com rolagem
> contínua — **quatro seções ancoradas** (`Sobre`, `Projetos`, `Experiências`,
> `Contato`) — em vez de várias rotas."

## 2. Decisões de design (60 s)

> "A direção visual é de **hardware**: cinza claro, grades de 1px, rótulos em
> mono maiúsculo, número de série, LEDs e um **único acento laranja**. É o
> vocabulário da Teenage Engineering — rigor e uma pitada de lúdico.
> O elemento-assinatura é o **robô de fundo** num canvas fixo: ele **não é
> decoração**, é um indicador de posição. O **scroll é o controle** da
> animação — cada seção 'possui' um trecho de movimento, com **inércia** para
> nada ficar travado. A ficha técnica com pontilhado reforça a ideia de
> datasheet."

## 3. Arquitetura e stack (60 s)

> "É **Next.js 15 (App Router) + React 19 + TypeScript estrito**, Tailwind v4 e
> componentes shadcn/ui. **Todo o conteúdo vive em `src/data/`** — projetos,
> experiências, contato e as traduções — então dá pra editar o site sem tocar em
> componente. O **i18n é próprio**: um dicionário tipado, um Context e
> persistência em `localStorage`. O robô é desacoplado: o `RobotBackdrop` lê o
> scroll, faz o *lerp* e publica a telemetria num store externo que o HUD
> consome. O formulário usa **React Hook Form + Zod** e envia por **EmailJS**,
> sem back-end. Deploy na Vercel."

## 4. Demonstração (90 s)

Roteiro na tela publicada:

1. **Sobre:** mostre o título, os botões e a *spec sheet*.
2. Clique em **EN** — tudo troca de idioma e a URL permanece a mesma; recarregue
   e continua em inglês (persistência).
3. Role até **Projetos:** a timeline entra animada e o robô gira o braço.
4. Abra uma **Experiência** (acordeão) e feche.
5. Em **Contato:** tente enviar vazio (erros inline em laranja), depois preencha
   e envie — **toast de sucesso** e o robô faz o gesto de "ok".
6. Volte ao topo com a navegação; mostre o **contador de scroll** no rodapé.

## 5. Desafios e como resolvi (45 s)

> "Três dores: (1) **inércia do scroll** sem travar — resolvi com um
> *requestAnimationFrame* único, *lerp* e parada quando o alvo chega perto;
> (2) **performance** do fundo — DPR limitado a 2, desenho em canvas e
> `prefers-reduced-motion` desligando o movimento; (3) **responsividade** —
> testei 375/768/1280/1920 com um script de Playwright que garante **zero
> rolagem horizontal**."

## 6. Próximos passos (15 s)

> "Renderizar o robô em 3D e trocar o placeholder pelos frames WebP — o
> componente já suporta, sem mudar código — e publicar as capturas reais dos
> projetos."

---

## 8 perguntas prováveis do professor

1. **"Por que uma página única e não rotas?"**
   É um portfólio de leitura linear; âncoras com *scroll* suave e seção ativa
   dão contexto sem perder o fluxo. Menos cliques, mais conteúdo visível.

2. **"Como a seção ativa é calculada?"**
   `IntersectionObserver` com `rootMargin` estreito no meio da tela; guardo a
   razão de interseção e escolho a maior, então não pisca entre duas seções.

3. **"Como funciona o i18n sem biblioteca?"**
   Um objeto `dict` tipado (`DictKey`), um `Context` com `t()`/`pick()`,
   persistência em `localStorage` dentro de `try/catch` e o atributo `lang` do
   `<html>` acompanhando o idioma.

4. **"O robô é 3D? Como ele segue o scroll?"**
   Hoje é um braço articulado 2D desenhado em `<canvas>` (placeholder
   procedural). O *scroll* vira um frame alvo que a animação persegue com
   *lerp*; se existirem frames WebP em `public/frames/robot/`, o mesmo
   componente passa a desenhá-los, sem mudar código.

5. **"E a performance?"**
   Canvas com DPR ≤ 2, geometria simples, sem texturas, pausa com a aba oculta
   e `prefers-reduced-motion` congelando as poses. Meta: Lighthouse ≥ 80.

6. **"O formulário realmente envia e-mail?"**
   Sim, via **EmailJS** no front-end (`NEXT_PUBLIC_EMAILJS_*`). Sem as chaves
   ele roda em modo simulado, com o código pronto para ligar. Tem validação
   Zod, *honeypot* e trava de duplo envio.

7. **"Onde eu edito o conteúdo?"**
   Só em `src/data/` (`projects.ts`, `experiences.ts`, `contact.ts`,
   `i18n.ts`) e nas imagens em `public/projects/`. Nenhum texto está fixo em
   componente.

8. **"O que é acessibilidade aqui?"**
   Contraste AA, anel de foco laranja de 2px, `aria-label`/`<label>`, *skip
   link*, navegação por teclado, `aria-hidden` no robô decorativo e respeito a
   `prefers-reduced-motion`.
