# Imagens dos projetos

Coloque aqui as capturas/GIFs dos projetos em execução. Enquanto não houver
arquivos, a `ProjectCard` desenha uma caixa 16:10 neutra rotulada `SCREEN 0N`.

Convenção sugerida (16:10, ~1280×800, WebP/PNG/GIF):

```
public/projects/
  quicknote.webp
  the-simple-trip.webp
  eregion.webp
```

Depois, em `src/data/projects.ts`, preencha o campo `image` de cada projeto:

```ts
{ id: "quicknote", image: "/projects/quicknote.webp", /* ... */ }
```

O componente usa `next/image`; para GIFs grandes prefira WebP animado ou MP4.
