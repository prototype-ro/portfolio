# Guia de render — robô de fundo (sequência de frames)

O site desenha o robô de fundo a partir de uma **sequência de frames pré-renderizados**
(WebP) em um `<canvas>`. Até que os frames existam, o componente
`RobotBackdrop` usa um **robô procedural 2D** (braço articulado) com o mesmo
mapeamento de scroll, inércia e telemetria.

> Trocar do robô procedural para o render 3D **não exige mudar código**:
> basta gerar os frames em `public/frames/robot/{desktop,mobile}/` e
> ajustar `public/frames/robot/manifest.json`.

---

## 1. Como o mapeamento funciona

- O scroll global (`scrollY / (docHeight - viewportHeight)`) posiciona o usuário.
- Cada seção (`#sobre`, `#projetos`, `#experiencias`, `#contato`) "possui" um
  trecho de frames, definido em `manifest.chapters` (`from`/`to`).
- Para cada seção calculamos o progresso `t ∈ [0,1]` entre
  `topo_da_seção − 0,5·viewport` e `base_da_seção − 0,5·viewport`. Assim o fim
  de um capítulo e o começo do próximo coincidem e o robô não "pula".
- O frame alvo persegue o alvo com *lerp* (`current += (target − current) · 0.12`)
  dentro de um `requestAnimationFrame`, parando quando `|target − current| < 0.01`.

Trechos padrão (240 frames): sobre `0–55`, projetos `56–140`,
experiências `141–195`, contato `196–239`, easter egg `228–239`.

---

## 2. Produzir os frames reais

1. **Modelar/animar** o robô em Blender (ou usar um modelo pronto com licença
   livre compatível).
2. **Câmera fixa**; iluminação de estúdio suave (key + fill + rim); chão
   infinito. Use **`#E4E3DF`** como cor de fundo para fundir com o site
   (ou renderize com alpha, se preferir).
3. **Animar a timeline em 240 frames**, cobrindo os quatro capítulos:
   - **Sobre** — repouso, braço levantado, cabeça "acordando".
   - **Projetos** — varredura lateral; garra percorrendo a timeline.
   - **Experiências** — garra abre e fecha; pega um cubo.
   - **Contato** — braço se estende em direção ao formulário e acena.
   - (Opcional) **easter egg** — últimos ~12 frames: aceno curto.
4. **Renderizar** em 1920×1080, PNG (EEVEE ou Cycles).
5. **Converter para WebP** com ffmpeg:

   ```bash
   # a partir de PNGs nomeados render/0001.png, 0002.png, ...
   ffmpeg -i render/%04d.png -vf "scale=1920:-1" \
     -c:v libwebp -quality 80 public/frames/robot/desktop/frame_%04d.webp

   ffmpeg -i render/%04d.png -vf "scale=1080:-1" \
     -c:v libwebp -quality 78 public/frames/robot/mobile/frame_%04d.webp
   ```

   Se você começar de um vídeo MP4:

   ```bash
   ffmpeg -i robot.mp4 -vf fps=30 render/%04d.png
   ```

6. **Orçamento de peso**: < 20 MB desktop, < 8 MB mobile.
   (O desktop padroniza 240 frames; o mobile carrega metade deles — `step = 2`.)

---

## 3. Ativar os frames

Em `public/frames/robot/manifest.json`, troque

```json
"placeholder": true
```

por

```json
"placeholder": false
```

e garanta que existam `frame_0001.webp` … `frame_0240.webp` em
`desktop/` e `mobile/`. O `RobotBackdrop` passa a desenhar os frames
automaticamente; se algum arquivo faltar, ele volta ao robô procedural sem
quebrar o site.

### Formato do `manifest.json`

```json
{
  "count": 240,
  "padding": 4,
  "ext": "webp",
  "width": 1920,
  "height": 1080,
  "basePath": "/frames/robot",
  "placeholder": true,
  "chapters": [
    { "id": "sobre",        "from": 0,   "to": 55  },
    { "id": "projetos",     "from": 56,  "to": 140 },
    { "id": "experiencias", "from": 141, "to": 195 },
    { "id": "contato",      "from": 196, "to": 239 }
  ],
  "anchors": [],
  "easterEgg": { "from": 228, "to": 239 }
}
```

- `anchors` (opcional): marcadores de canto `[ ]` ancorados em pontos do robô,
  `[{ "frame": 200, "x": 0.62, "y": 0.4, "label": "GRIPPER" }]`.
- `easterEgg` (opcional): trecho tocado ao clicar no fundo do site.

---

## 4. Personalizar ângulos de junta (telemetria)

A telemetria (ângulos exibidos no rodapé/status bar) é interpolada de uma
tabela por capítulo em `src/data/robot.ts` (`JOINT_KEYS`). Se os ângulos do
seu render divergirem, ajuste essa tabela para os números baterem com a pose.

---

## 5. Checklist rápido

- [ ] 240 frames em `desktop/` e `mobile/`
- [ ] `manifest.json` com `placeholder: false`
- [ ] Pesos dentro do orçamento
- [ ] `prefers-reduced-motion`: um frame estático por capítulo (automático)
- [ ] Sem 404 no console ao carregar
