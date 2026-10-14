# Prompt do robô — Midjourney (poses + animação) e text-to-video

Prompts para gerar o robô **direto no motor de vídeo**, sem Blender. Foco em
Midjourney (imagem → vídeo com **pose inicial + pose final**) e uma versão para
text-to-video (Seedance 2.5 / Kling / Runway / Veo).

> Depois: `ffmpeg`/Pillow → WebP → `public/frames/robot/manifest.json`
> (`"placeholder": false`). Ver [`render-guide.md`](render-guide.md).

## Anatomia do prompt

1. **Sujeito + atributos** → 2. **Pose + cenário** → 3. **Ambiente + paleta** →
4. **Luz** → 5. **Detalhes** → 6. **Partes** → 7. **Ação** → 8. **Composição** →
9. **Estilo + tom**

**Regras que matam o "gibberish":** uma só ação lenta e contínua; poses
parecidas em silhueta; design/luz/fundo/câmera travados (mesma `--seed`).

**Cor (erros das tentativas anteriores):** fundo **cinza neutro frio**, nunca
sépia/laranja; corpo **branco‑painel**, nunca bege/creme; o laranja fica
**confinado** a uma faixa fina e a pads — não tinge a cena.

---

## Bloco de design (cole VERBATIM nas duas poses)

Robô novo: quatro patas, torso chamfrado, cabeça pan-tilt com antenas — cores da
nossa paleta.

```text
RD-01, a compact four-legged utility walker robot, hard-surface industrial
design with chamfered edges and flat panels. A two-part chamfered rectangular
torso, the upper block slightly wider, sitting on a dark charcoal underframe.
On top, a small pan-tilt sensor head: a chamfered box with two small round
black lens eyes and two thin whip antennas angled back. Four multi-jointed legs
splay outward — each with a chamfered upper thigh, a slim shin and a flat
chamfered foot. A single thin orange band wraps the front of the torso, with
orange trim pads on the knee joints; small sky-blue accents on a side panel and
a tiny status screen. Colors mapped to this palette: off-white body panels
(#EFEEEA), pale grey backdrop (#E4E3DF), charcoal underframe and joints
(#1A1B1C), a single vivid orange accent stripe (#FF5A1F), and small sky-blue
detailing (#A9C7DB). Matte finish, crisp panel lines, a few tiny perforated
vent holes. Clean, precise, mid-century-industrial precision instrument,
Teenage Engineering / retro-Casio aesthetic. Absolutely no text, no logos, no
branding, no visible lettering anywhere.
```

**Cenário + luz (igual nas duas — sem tom quente):**

```text
Seamless studio backdrop in flat cool neutral light grey, exactly #E4E3DF — a
pale desaturated grey with no warm cast, no orange, no sepia, no cream, no
gradient and no vignette. Neutral white-balance lighting at 5500K: one large
soft key, gentle fill, a cool white rim light. High-key, even, color-accurate,
no color grading. Locked-off camera, three-quarter side view, slightly
elevated, the robot in the RIGHT third of the frame. Single point of view
(one view only, not a design sheet or multi-view layout).
```

---

## Seção A — Midjourney

### A1. Pose INICIAL (start frame)

```text
RD-01, a compact four-legged utility walker robot, hard-surface industrial
design with chamfered edges and flat panels. A two-part chamfered rectangular
torso, the upper block slightly wider, sitting on a dark charcoal underframe.
On top, a small pan-tilt sensor head: a chamfered box with two small round
black lens eyes and two thin whip antennas angled back. Four multi-jointed legs
splay outward — each with a chamfered upper thigh, a slim shin and a flat
chamfered foot. A single thin orange band wraps the front of the torso, with
orange trim pads on the knee joints; small sky-blue accents on a side panel and
a tiny status screen. Colors: off-white body panels (#EFEEEA), pale grey
backdrop (#E4E3DF), charcoal underframe and joints (#1A1B1C), a single vivid
orange accent stripe (#FF5A1F), small sky-blue detailing (#A9C7DB). Matte
finish, crisp panel lines, tiny perforated vent holes. Clean mid-century
industrial precision instrument, Teenage Engineering / retro-Casio aesthetic.
No text, no logos, no lettering. The robot is AT REST: the torso settled low,
the legs folded compact beneath it, the head lowered and level, the lens eyes
dim, the orange LED off. Seamless studio backdrop in flat cool neutral light
grey, exactly #E4E3DF — pale desaturated grey, no warm cast, no orange, no
sepia, no gradient, no vignette. Neutral 5500K lighting: large soft key,
gentle fill, cool white rim. High-key, even, color-accurate, no color grading.
Locked-off camera, three-quarter side view, slightly elevated, robot in the
right third of the frame, single point of view. Clean neutral studio product
photography, photorealistic, sharp, accurate color science. --ar 16:9 --style raw
--stylize 100 --seed 4207 --no sepia, warm color cast, orange background,
gradient background, vignette, text, watermark, logo, branding, design sheet,
grid of views
```

### A2. Pose FINAL (end frame)

Mesmo bloco, trocando **só** a frase de pose (mantenha `--seed 4207`):

```text
... (mesmo design e cenário/luz acima) ... The robot is ALERT: the torso raised
up on its legs, the front pair planted, the sensor head lifted and turned
toward the camera with the lens eyes lit, the two antennas upright, the orange
stripe and knee pads catching the light, a small orange LED glowing. ...
(mesmo estilo) ... --ar 16:9 --style raw --stylize 100 --seed 4207 --no sepia,
warm color cast, orange background, gradient background, vignette, text,
watermark, logo, branding, design sheet, grid of views
```

> **Consistência:** mesma `--seed`. Gere a inicial, escolha a melhor variação e
> use‑a como referência (`--oref`/`--cref`, conforme a versão) ao gerar a final.

### A3. Prompt de ANIMAÇÃO (motion — curto e específico)

Pose inicial como frame inicial (e a final como frame final, se houver).
**motion = Low.**

```text
static locked camera, one single slow continuous motion: the robot settles and
then rises slightly on its planted legs, the sensor head smoothly pans and
tilts up toward the camera, the two antennas sway gently, the orange stripe
catches the light. All four feet stay planted — no walking, no stepping, no leg
crossing. Smooth ease in and out, constant slow speed, no jerks, no cuts. The
design, proportions, colors, background, lighting and framing stay exactly the
same in every frame; only the head and body move.
```

**Negative:**

```text
sepia, warm tone, orange background, beige, cream, tan, yellow, gradient
background, vignette, text, watermark, logo, branding, morphing, warping,
melting, flicker, extra legs, extra limbs, walking, running, camera movement,
zoom, pan, cuts, humans
```

---

### A4. Prompt dos 5 SEGUNDOS EXTRAS (extensão)

Quando o clipe de 10s terminar, **estenda +5s** no Midjourney (ou gere 15s
direto no text-to-video). Mesma câmera/design/luz; a ação agora é o **retorno ao
repouso**, para fechar um loop limpo.

```text
static locked camera, one single slow continuous motion: the robot holds the
alert pose for a moment, then slowly lowers back down to its resting pose — the
torso settles low on its legs, the sensor head tips back down and levels out,
the antennas settle, and the amber glow dims to off. Smooth ease in and out,
constant slow speed, no jerks, no cuts. All four feet stay planted — no
walking. The design, proportions, colors, background, lighting and framing stay
exactly the same; only the head and body move.
```

**Negative:** igual ao A3.

Loop resultante: `0–10s` acorda e ergue a cabeça → `10–15s` assenta e volta ao
repouso.

> **Alternativa** (se preferir um beat de varredura em vez de voltar): troque por
> *"...the sensor head slowly scans from one side to the other and then stops
> facing the camera again."* — mas aí o loop não fecha no repouso.

---

## Seção B — Text-to-video (Seedance 2.5 / Kling / Runway / Veo)

Um único prompt, uma única ação suave (sem caminhar):

```text
A compact four-legged utility walker robot, RD-01, on a seamless cool neutral
light-grey studio backdrop (#E4E3DF). Hard-surface industrial design with
chamfered edges: a two-part chamfered rectangular torso on a charcoal
underframe, a small pan-tilt sensor head with two small round black lens eyes
and two thin whip antennas, four multi-jointed legs with chamfered thighs,
slim shins and flat feet. Off-white body panels (#EFEEEA), charcoal joints
(#1A1B1C), a single thin vivid orange accent stripe (#FF5A1F) plus orange knee
pads, small sky-blue details (#A9C7DB). Matte finish, crisp panel lines, no
text or logos. CAMERA: fully static and locked-off, three-quarter side view,
slightly elevated, robot in the right third. LIGHTING: neutral 5500K key +
fill + cool rim, high-key, even, no color grading, background always flat
neutral grey with no warm cast. MOTION, 10 seconds, 24 fps, one single seamless
action: the robot settles, then slowly rises on its planted legs while the
sensor head pans and tilts up toward the camera and the antennas sway gently;
all feet stay planted, no walking. Slow ease-in-out, no jerks; easing back to
the rest pose for a seamless loop. CONSISTENCY: identical body color, design,
background and lighting every frame; only the head and body move; the camera
never changes. No morphing, no extra limbs, no flicker.
```

**Variante mobile:** `Vertical 9:16 (1080x1920). The robot is CENTERED and
slightly smaller; same fixed camera and identical motion.`

**Negative + settings:** igual à seção A3 · 1080p · 16:9 (desktop) / 9:16
(mobile) · 10 s · 24 fps.

**Para 15 s (10 s + os 5 s extras):** acrescente ao **final** do prompt acima:

```text
After 10 seconds, the robot holds the alert pose briefly, then slowly lowers
back down to its rest pose, closing a seamless 15-second loop.
```

E use `15 s · 24 fps · 360 frames`.

---

## Se sair errado (troubleshooting)

| Sintoma | Correção |
| --- | --- |
| Fundo quente/laranja/sépia | Reforce `cool neutral grey #E4E3DF, 5500K`; `--no warm color cast, sepia`; **`--stylize 50–100`**. |
| Virou folha com várias vistas | Acrescente `single view, one hero shot, not a design sheet`. |
| Apareceu "CASIO"/texto | Reforce `no text, no logos, no branding` + `--no text, logo, branding`. |
| Pernas viram tentáculo/tremem | `four legs, chamfered thighs and slim shins`, e no motion `all feet planted, no walking`. |
| Laranja tomou a cena | Deixe o laranja só na faixa + joelhos; `--no orange background`. |

---

## Depois de gerar

1. MP4 → WebP (`ffmpeg -vf fps=24 -start_number 1 .../frame_%04d.png` + Pillow
   `quality 80` se faltar `libwebp`).
2. `frame_0001.webp …` em `public/frames/robot/{desktop,mobile}/`.
3. Ajuste `count` no `manifest.json` (reescale `chapters`) e `"placeholder": false`.

**Contagem de frames:** `10 s → 240 frames`; `15 s (com os +5 s) → 360 frames`.
Use o `count` real. Se quiser manter 240 no manifesto com um clipe de 15 s,
reescreva com `ffmpeg -vf fps=16` (240 frames) — fica menos fluido, então prefira
360 e só reescale os `chapters` proporcionalmente (mesma fração de 0–1).
