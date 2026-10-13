// Generates medium-fidelity wireframes (SVG + PNG) for the four sections,
// desktop and mobile. Output goes to docs/wireframes/.
//
//   node scripts/wireframes.mjs
//
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("docs/wireframes");

const C = {
  bg: "#E4E3DF",
  panel: "#EFEEEA",
  ink: "#151617",
  dim: "#6C6E70",
  line: "#BDBCB7",
  accent: "#FF5A1F",
  sky: "#A9C7DB",
  white: "#FFFFFF",
};
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function rect(x, y, w, h, o = {}) {
  const {
    fill = "none",
    stroke = C.line,
    sw = 1,
    dash = false,
    r = 0,
    op = 1,
  } = o;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ' stroke-dasharray="6 5"' : ""}${op !== 1 ? ` opacity="${op}"` : ""}/>`;
}

function text(x, y, s, o = {}) {
  const {
    size = 14,
    weight = 400,
    anchor = "start",
    family = MONO,
    fill = C.ink,
    ls = 0,
    upper = false,
    op = 1,
  } = o;
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}" letter-spacing="${ls}"${op !== 1 ? ` opacity="${op}"` : ""}>${esc(upper ? s.toUpperCase() : s)}</text>`;
}

function line(x1, y1, x2, y2, o = {}) {
  const { stroke = C.line, sw = 1, dash = false } = o;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${dash ? ' stroke-dasharray="6 5"' : ""}/>`;
}

function label(x, y, s, o = {}) {
  return text(x, y, s, { size: 10, ls: 1.1, fill: C.dim, upper: true, ...o });
}

function chip(x, y, s, w) {
  const cw = w ?? s.length * 7 + 16;
  return rect(x, y - 14, cw, 20, { fill: C.white, stroke: C.line, r: 2 }) +
    text(x + cw / 2, y, s, { size: 10, anchor: "middle", fill: C.dim, ls: 0.6 });
}

function corners(x, y, w, h, s = 12) {
  return (
    `<path d="M${x} ${y + s} V${y} H${x + s}" fill="none" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<path d="M${x + w - s} ${y} H${x + w} V${y + s}" fill="none" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<path d="M${x} ${y + h - s} V${y + h} H${x + s}" fill="none" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<path d="M${x + w - s} ${y + h} H${x + w} V${y + h - s}" fill="none" stroke="${C.ink}" stroke-width="1.5"/>`
  );
}

function dottedRow(x, y, w, lab, val, o = {}) {
  const { size = 12 } = o;
  return (
    line(x, y + 8, x + w, y + 8, { dash: true, stroke: C.line }) +
    text(x, y, lab, { size: 10, ls: 1, fill: C.dim, upper: true, family: MONO }) +
    text(x + w, y, val, { size, anchor: "end", family: MONO, fill: C.ink })
  );
}

// ---------------------------------------------------------------------------
// Shared chrome
// ---------------------------------------------------------------------------
function note(h, s) {
  return (
    rect(20, h - 68, 236, 26, { fill: C.panel, stroke: C.accent, r: 3 }) +
    text(138, h - 50, s, { size: 10, anchor: "middle", fill: C.accent, ls: 1, upper: true })
  );
}

function header(w, mobile) {
  const out = [];
  out.push(rect(0, 0, w, 56, { fill: C.bg }));
  out.push(line(0, 56, w, 56));
  out.push(rect(20, 16, 24, 24, { fill: C.ink, stroke: C.ink }));
  out.push(text(54, 34, "Rodrigo", { size: 15, weight: 600, family: SANS }));
  out.push(text(54, 46, "MODEL RD-01", { size: 9, ls: 1.2, fill: C.dim }));
  if (mobile) {
    out.push(rect(w - 52, 16, 32, 24, { fill: C.panel, stroke: C.line, r: 2 }));
    for (let i = 0; i < 3; i++) out.push(line(w - 46, 23 + i * 5, w - 26, 23 + i * 5, { stroke: C.ink, sw: 1.5 }));
  } else {
    const items = ["01 SOBRE", "02 PROJETOS", "03 EXPERIÊNCIAS", "04 CONTATO"];
    let x = w - 720;
    for (const it of items) {
      out.push(line(x, 40, x + 150, 40, { stroke: C.ink, sw: 2 }));
      out.push(text(x, 34, it, { size: 10, ls: 0.8, fill: C.ink }));
      x += 160;
    }
    out.push(rect(w - 168, 18, 56, 22, { fill: C.panel, stroke: C.line, r: 2 }));
    out.push(text(w - 140, 33, "PT | EN", { size: 9, anchor: "middle", ls: 1 }));
    // serial strip
    out.push(line(0, 74, w, 74));
    out.push(label(20, 69, "S/N 2026-10-13"));
    out.push(label(w / 2, 69, "BELO HORIZONTE, BR", { anchor: "middle" }));
    out.push(label(w - 20, 69, "v0.1 PROTOTYPE", { anchor: "end" }));
  }
  return out.join("");
}

function footer(w, h, mobile) {
  const out = [];
  out.push(line(0, h - 34, w, h - 34));
  out.push(label(20, h - 16, "© 2026 Rodrigo [[sobrenome]]"));
  if (!mobile) {
    out.push(
      rect(w - 340, h - 28, 320, 22, { fill: C.panel, stroke: C.line, r: 2 }) +
      label(w - 328, h - 13, "TELEMETRIA  ·  FRAME 000/240  ·  SCROLL 000%"),
    );
  }
  return out.join("");
}

function sectionHeader(w, y, index, title, kicker, mobile) {
  const out = [];
  out.push(line(0, y, w, y));
  const baseY = y + 44;
  out.push(text(20, baseY, index, { size: 12, ls: 1, fill: C.dim }));
  out.push(line(52, baseY - 4, 84, baseY - 4, { stroke: C.line }));
  out.push(text(96, baseY, title, { size: mobile ? 26 : 38, weight: 600, family: SANS, ls: -0.6 }));
  if (!mobile) {
    out.push(text(w - 20, baseY - 10, kicker, { size: 12, anchor: "end", fill: C.dim, family: SANS }));
    out.push(text(w - 20, baseY + 6, "", {}));
  }
  out.push(line(0, y + 64, w, y + 64));
  return out.join("");
}

// ---------------------------------------------------------------------------
// Sections — desktop (1440 x 1080)
// ---------------------------------------------------------------------------
function desktopSobre() {
  const w = 1440;
  const h = 1080;
  const o = [header(w, false)];
  o.push(sectionHeader(w, 74, "01", "Sobre", "Estudante de Engenharia de Software · PUC Minas", false));

  // left column
  o.push(label(24, 190, "Estudante de Engenharia de Software · PUC Minas"));
  o.push(text(24, 300, "Rodrigo", { size: 96, weight: 600, family: SANS, ls: -3 }));
  o.push(text(24, 340, "Construo apps e produtos digitais do zero, do design ao código.", { size: 16, family: SANS }));
  o.push(text(24, 364, "I build apps and digital products from scratch — design to code.", { size: 13, family: SANS, fill: C.dim }));
  o.push(rect(24, 400, 170, 46, { fill: C.accent, stroke: C.accent, r: 2 }) + text(109, 428, "VER PROJETOS", { size: 11, anchor: "middle", fill: C.white, ls: 1 }));
  o.push(rect(206, 400, 170, 46, { fill: C.white, stroke: C.ink, r: 2 }) + text(291, 428, "FALAR COMIGO", { size: 11, anchor: "middle", ls: 1 }));
  o.push(line(24, 480, 760, 480));
  o.push(label(24, 506, "Stack / Tecnologias"));
  const tech = ["TypeScript", "React", "Next.js", "Tailwind", "Swift", "Java", "Spring"];
  let tx = 24;
  for (const s of tech) { o.push(chip(tx, 534, s)); tx += s.length * 7 + 26; }

  // right column — robot stage + stats
  o.push(rect(800, 150, 616, 380, { fill: C.panel, stroke: C.line, dash: true }));
  o.push(corners(800, 150, 616, 380, 14));
  o.push(label(816, 174, "Robot stage · CAM 01 · LIVE FEED"));
  o.push(text(1108, 360, "ROBÔ DE FUNDO", { size: 16, anchor: "middle", fill: C.dim, ls: 1 }));
  o.push(text(1108, 384, "(animado pelo scroll)", { size: 12, anchor: "middle", fill: C.dim, family: SANS }));
  const stats = [["01", "PROJETOS"], ["10", "TECNOLOGIAS"], ["02", "ANOS DE CURSO"]];
  stats.forEach((s, i) => {
    const x = 800 + i * 210;
    o.push(rect(x, 552, 192, 130, { fill: C.panel, stroke: C.line, r: 3 }));
    o.push(rect(x + 14, 570, 40, 4, { fill: i === 1 ? C.sky : C.accent, stroke: "none" }));
    o.push(text(x + 14, 634, s[0], { size: 42, weight: 600, family: SANS, ls: -1 }));
    o.push(label(x + 14, 664, s[1]));
  });

  // spec sheet
  o.push(rect(24, 700, 1392, 300, { fill: C.panel, stroke: C.line }));
  o.push(label(40, 726, "SPEC SHEET"));
  o.push(label(1400, 726, "RD-01", { anchor: "end" }));
  const rows = [
    ["Formação", "Engenharia de Software · PUC Minas (2024–)"],
    ["Área de atuação", "Desenvolvimento de produto · Mobile · Web"],
    ["Local", "Belo Horizonte, MG · BR"],
    ["Interesses", "Design de produto, tipografia, hardware"],
    ["Objetivos", "Lançar produtos próprios, atuar full-stack"],
    ["Status", "Activo · modo autônomo"],
  ];
  rows.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    o.push(dottedRow(40 + col * 700, 780 + row * 50, 640, r[0], r[1]));
  });
  o.push(note(h, "SEÇÃO 01 — SOBRE"));
  o.push(footer(w, h, false));
  return frame(w, h, o.join(""));
}

function projectCard(x, y, cw, code, name) {
  const o = [];
  o.push(rect(x, y, cw, 430, { fill: C.panel, stroke: C.line }));
  o.push(rect(x + 16, y + 16, cw - 32, 190, { fill: "#D8D7D2", stroke: C.line }));
  o.push(corners(x + 16, y + 16, cw - 32, 190, 12));
  o.push(text(x + cw / 2, y + 112, "SCREEN " + code.replace("P-", ""), { size: 11, anchor: "middle", fill: C.dim, ls: 1 }));
  o.push(text(x + cw - 30, y + 34, "● REC", { size: 9, anchor: "end", fill: C.accent, ls: 1 }));
  o.push(text(x + 16, y + 236, name, { size: 24, weight: 600, family: SANS, ls: -0.4 }));
  o.push(label(x + 16, y + 256, "2024"));
  o.push(text(x + cw - 16, y + 236, code, { size: 10, anchor: "end", fill: C.dim }));
  o.push(text(x + 16, y + 284, "Descrição curta do projeto (PT/EN).", { size: 12, family: SANS, fill: C.dim }));
  o.push(text(x + 16, y + 300, "Tecnologias, contexto e aprendizado.", { size: 12, family: SANS, fill: C.dim }));
  o.push(chip(x + 16, y + 336, "Swift"));
  o.push(chip(x + 16 + 70, y + 336, "SwiftUI"));
  o.push(rect(x + 16, y + 364, 100, 38, { fill: C.white, stroke: C.ink, r: 2 }));
  o.push(text(x + 66, y + 388, "REPO ↗", { size: 10, anchor: "middle", ls: 1 }));
  return o.join("");
}

function desktopProjetos() {
  const w = 1440, h = 1080;
  const o = [header(w, false)];
  o.push(sectionHeader(w, 74, "02", "Projetos", "Do mais antigo ao mais recente. Cada módulo é um experimento.", false));
  const cx = w / 2;
  o.push(line(cx, 160, cx, h - 50, { stroke: C.line }));
  const items = [["P-01", "[[Projeto antigo]]", "left"], ["P-02", "Quicknote", "right"], ["P-03", "The Simple Trip", "left"]];
  items.forEach((it, i) => {
    const y = 170 + i * 300;
    o.push(rect(cx - 8, y + 40, 16, 16, { fill: C.panel, stroke: i === 0 ? C.accent : C.line }));
    o.push(text(cx, y + 24, it[0], { size: 10, anchor: "middle", fill: C.dim, family: MONO }));
    const cardX = it[2] === "left" ? 60 : cx + 60;
    o.push(projectCard(cardX, y + 40, 560, it[0], it[1]));
  });
  o.push(note(h, "SEÇÃO 02 — PROJETOS (TIMELINE)"));
  o.push(footer(w, h, false));
  return frame(w, h, o.join(""));
}

function desktopExperiencias() {
  const w = 1440, h = 1080;
  const o = [header(w, false)];
  o.push(sectionHeader(w, 74, "03", "Experiências", "Ficha técnica de atividades, formações e colaborações.", false));
  o.push(line(24, 168, w - 24, 168));
  const rows = [
    ["X-01", "[[Instituição]]", "[[Cargo / atividade]]", "[[Período]]"],
    ["X-02", "[[Instituição]]", "[[Cargo / atividade]]", "[[Período]]"],
    ["X-03", "[[Instituição]]", "[[Cargo / atividade]]", "[[Período]]"],
  ];
  let y = 200;
  rows.forEach((r, i) => {
    o.push(text(24, y + 20, r[0], { size: 10, fill: C.dim }));
    o.push(text(70, y + 20, r[1], { size: 18, weight: 600, family: SANS }));
    o.push(text(360, y + 20, r[2], { size: 10, fill: C.dim, ls: 1, upper: true }));
    o.push(text(w - 48, y + 20, r[3], { size: 12, anchor: "end", family: MONO, fill: C.dim }));
    o.push(text(w - 28, y + 20, i === 0 ? "⌃" : "⌄", { size: 14, anchor: "end", fill: C.dim }));
    o.push(line(24, y + 40, w - 24, y + 40));
    if (i === 0) {
      o.push(dottedRow(56, y + 84, 500, "Instituição", "[[Instituição]]"));
      o.push(dottedRow(56, y + 124, 500, "Atividade", "[[Cargo / atividade]]"));
      o.push(dottedRow(56, y + 164, 500, "Período", "[[Período]]"));
      o.push(text(56, y + 210, "Descrição breve da experiência, responsabilidades e resultados.", { size: 12, family: SANS, fill: C.dim }));
      o.push(text(56, y + 228, "Campo expansível (anima a abertura).", { size: 11, family: SANS, fill: C.dim }));
      y += 260;
    } else {
      y += 90;
    }
  });
  o.push(note(h, "SEÇÃO 03 — EXPERIÊNCIAS"));
  o.push(footer(w, h, false));
  return frame(w, h, o.join(""));
}

function desktopContato() {
  const w = 1440, h = 1080;
  const o = [header(w, false)];
  o.push(sectionHeader(w, 74, "04", "Contato", "Canais diretos e um formulário. O robô acompanha o cursor.", false));
  o.push(label(24, 180, "Canal direto"));
  const keys = [["✉", "E-MAIL"], ["◍", "WHATSAPP"], ["▦", "LINKEDIN"], ["‹›", "GITHUB"]];
  keys.forEach((k, i) => {
    const x = 24 + (i % 2) * 340;
    const y = 200 + Math.floor(i / 2) * 200;
    o.push(rect(x, y, 316, 180, { fill: C.panel, stroke: C.line }));
    o.push(text(x + 20, y + 44, k[0], { size: 26, fill: C.ink }));
    o.push(text(x + 296, y + 40, "↗", { size: 16, anchor: "end", fill: C.dim }));
    o.push(label(x + 20, y + 130, k[1]));
    o.push(text(x + 20, y + 152, "[[handle]]", { size: 11, fill: C.ink }));
  });
  o.push(label(750, 180, "Formulário"));
  o.push(rect(750, 200, 666, 620, { fill: C.panel, stroke: C.line }));
  const fields = [["Nome", "Como devo te chamar?"], ["E-mail", "voce@exemplo.com"], ["Mensagem", "Conte um pouco sobre a ideia…"]];
  let fy = 236;
  fields.forEach((f, i) => {
    o.push(label(774, fy, f[0]));
    const fh = i === 2 ? 160 : 48;
    o.push(rect(774, fy + 12, 618, fh, { fill: C.white, stroke: C.line }));
    o.push(text(790, fy + 42, f[1], { size: 12, family: SANS, fill: C.dim, op: 0.75 }));
    fy += fh + 46;
  });
  o.push(label(774, fy + 10, "● PRONTO PARA RECEBER"));
  o.push(rect(1258, fy - 24, 134, 46, { fill: C.accent, stroke: C.accent, r: 2 }));
  o.push(text(1325, fy + 4, "ENVIAR", { size: 11, anchor: "middle", fill: C.white, ls: 1 }));
  o.push(note(h, "SEÇÃO 04 — CONTATO"));
  o.push(footer(w, h, false));
  return frame(w, h, o.join(""));
}

// ---------------------------------------------------------------------------
// Sections — mobile (390 x 844)
// ---------------------------------------------------------------------------
function mobileCard(x, y, w, techs) {
  const o = [];
  o.push(rect(x, y, w, 300, { fill: C.panel, stroke: C.line }));
  o.push(rect(x + 14, y + 14, w - 28, 150, { fill: "#D8D7D2", stroke: C.line }));
  o.push(text(x + w / 2, y + 92, "SCREEN", { size: 10, anchor: "middle", fill: C.dim, ls: 1 }));
  o.push(text(x + 14, y + 192, "Nome do projeto", { size: 17, weight: 600, family: SANS }));
  o.push(label(x + 14, y + 210, "2024"));
  o.push(chip(x + 14, y + 240, techs));
  o.push(rect(x + 14, y + 256, 90, 30, { fill: C.white, stroke: C.ink, r: 2 }));
  o.push(text(x + 59, y + 276, "REPO ↗", { size: 9, anchor: "middle" }));
  return o.join("");
}

function mobileSobre() {
  const w = 390, h = 844;
  const o = [header(w, true)];
  o.push(sectionHeader(w, 74, "01", "Sobre", "", true));
  o.push(label(20, 172, "Estudante de Eng. de Software"));
  o.push(text(20, 226, "Rodrigo", { size: 52, weight: 600, family: SANS, ls: -2 }));
  o.push(text(20, 256, "Construo apps e produtos digitais", { size: 13, family: SANS }));
  o.push(text(20, 274, "do zero, do design ao código.", { size: 13, family: SANS }));
  o.push(rect(20, 296, 165, 44, { fill: C.accent, stroke: C.accent, r: 2 }) + text(102, 323, "VER PROJETOS", { size: 10, anchor: "middle", fill: C.white, ls: 1 }));
  o.push(rect(197, 296, 165, 44, { fill: C.white, stroke: C.ink, r: 2 }) + text(279, 323, "FALAR COMIGO", { size: 10, anchor: "middle", ls: 1 }));
  o.push(line(20, 360, 370, 360));
  o.push(label(20, 382, "Stack / Tecnologias"));
  let x = 20;
  ["TypeScript", "React", "Next.js", "Swift", "Java"].forEach((s) => { o.push(chip(x, 404, s)); x += s.length * 7 + 26; });
  const stats = [["01", "PROJETOS"], ["10", "TECNOLOGIAS"], ["02", "ANOS"]];
  stats.forEach((s, i) => {
    const sx = 20 + i * 120;
    o.push(rect(sx, 440, 110, 110, { fill: C.panel, stroke: C.line, r: 3 }));
    o.push(rect(sx + 12, 456, 28, 4, { fill: i === 1 ? C.sky : C.accent, stroke: "none" }));
    o.push(text(sx + 12, 512, s[0], { size: 30, weight: 600, family: SANS, ls: -1 }));
    o.push(label(sx + 12, 536, s[1]));
  });
  o.push(rect(20, 570, 350, 210, { fill: C.panel, stroke: C.line }));
  o.push(label(36, 596, "SPEC SHEET"));
  dottedRowsMobile(o, 36, 622, 318, [["Formação", "PUC Minas (2024–)"], ["Local", "Belo Horizonte, BR"], ["Foco", "Produto · Mobile · Web"], ["Status", "Activo"]]);
  o.push(note(h, "MOBILE"));
  o.push(footer(w, h, true));
  return frame(w, h, o.join(""));
}

function dottedRowsMobile(o, x, y, w, rows) {
  rows.forEach((r, i) => o.push(dottedRow(x, y + i * 34, w, r[0], r[1])));
  return o;
}

function mobileProjetos() {
  const w = 390, h = 844;
  const o = [header(w, true)];
  o.push(sectionHeader(w, 74, "02", "Projetos", "", true));
  o.push(text(20, 176, "Do mais antigo ao mais recente.", { size: 12, family: SANS, fill: C.dim }));
  const cx = 34;
  o.push(line(cx, 196, cx, h - 50));
  const items = [["P-01"], ["P-02"], ["P-03"]];
  items.forEach((it, i) => {
    const y = 200 + i * 320;
    o.push(rect(cx - 7, y + 8, 14, 14, { fill: C.panel, stroke: i === 0 ? C.accent : C.line }));
    o.push(text(cx + 16, y + 20, it[0], { size: 9, fill: C.dim }));
    o.push(mobileCard(58, y, 312, "Swift · SwiftUI"));
  });
  o.push(note(h, "MOBILE"));
  o.push(footer(w, h, true));
  return frame(w, h, o.join(""));
}

function mobileExperiencias() {
  const w = 390, h = 844;
  const o = [header(w, true)];
  o.push(sectionHeader(w, 74, "03", "Experiências", "", true));
  o.push(text(20, 176, "Ficha técnica de atividades.", { size: 12, family: SANS, fill: C.dim }));
  let y = 200;
  for (let i = 0; i < 3; i++) {
    o.push(text(20, y + 6, "X-0" + (i + 1), { size: 9, fill: C.dim }));
    o.push(text(60, y + 6, "[[Instituição]]", { size: 15, weight: 600, family: SANS }));
    o.push(text(20, y + 26, "[[Cargo / atividade]]", { size: 9, fill: C.dim, ls: 1, upper: true }));
    o.push(text(370, y + 6, i === 0 ? "⌃" : "⌄", { size: 14, anchor: "end", fill: C.dim }));
    o.push(line(20, y + 40, 370, y + 40));
    if (i === 0) {
      o.push(dottedRow(32, y + 76, 338, "Período", "[[Período]]"));
      o.push(text(32, y + 108, "Descrição breve da experiência,", { size: 11, family: SANS, fill: C.dim }));
      o.push(text(32, y + 124, "responsabilidades e resultados.", { size: 11, family: SANS, fill: C.dim }));
      y += 170;
    } else y += 90;
  }
  o.push(note(h, "MOBILE"));
  o.push(footer(w, h, true));
  return frame(w, h, o.join(""));
}

function mobileContato() {
  const w = 390, h = 844;
  const o = [header(w, true)];
  o.push(sectionHeader(w, 74, "04", "Contato", "", true));
  o.push(label(20, 172, "Canal direto"));
  const keys = [["✉", "E-MAIL"], ["◍", "WHATSAPP"], ["▦", "LINKEDIN"], ["‹›", "GITHUB"]];
  keys.forEach((k, i) => {
    const x = 20 + (i % 2) * 178;
    const y = 190 + Math.floor(i / 2) * 96;
    o.push(rect(x, y, 164, 84, { fill: C.panel, stroke: C.line }));
    o.push(text(x + 14, y + 34, k[0], { size: 18 }));
    o.push(label(x + 14, y + 60, k[1]));
  });
  o.push(label(20, 396, "Formulário"));
  o.push(rect(20, 408, 350, 340, { fill: C.panel, stroke: C.line }));
  const fields = [["Nome", "Como devo te chamar?"], ["E-mail", "voce@exemplo.com"], ["Mensagem", "Conte um pouco…"]];
  let fy = 434;
  fields.forEach((f, i) => {
    o.push(label(36, fy, f[0]));
    const fh = i === 2 ? 90 : 40;
    o.push(rect(36, fy + 10, 318, fh, { fill: C.white, stroke: C.line }));
    o.push(text(48, fy + 36, f[1], { size: 11, family: SANS, fill: C.dim }));
    fy += fh + 34;
  });
  o.push(rect(36, fy + 6, 318, 42, { fill: C.accent, stroke: C.accent, r: 2 }));
  o.push(text(195, fy + 33, "ENVIAR", { size: 11, anchor: "middle", fill: C.white, ls: 1 }));
  o.push(note(h, "MOBILE"));
  o.push(footer(w, h, true));
  return frame(w, h, o.join(""));
}

// ---------------------------------------------------------------------------
function frame(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="${w}" height="${h}" fill="${C.bg}"/>
${body}
<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="${C.ink}" stroke-width="1"/>
</svg>`;
}

const files = {
  "desktop-sobre": desktopSobre(),
  "desktop-projetos": desktopProjetos(),
  "desktop-experiencias": desktopExperiencias(),
  "desktop-contato": desktopContato(),
  "mobile-sobre": mobileSobre(),
  "mobile-projetos": mobileProjetos(),
  "mobile-experiencias": mobileExperiencias(),
  "mobile-contato": mobileContato(),
};

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const [name, svg] of Object.entries(files)) {
    await writeFile(path.join(OUT, `${name}.svg`), svg, "utf8");
    const page = await browser.newPage({
      viewport: { width: name.startsWith("mobile") ? 390 : 1440, height: 1080 },
      deviceScaleFactor: 2,
    });
    await page.setContent(
      `<style>html,body{margin:0;padding:0}svg{display:block}</style>${svg}`,
    );
    const el = await page.$("svg");
    await el.screenshot({ path: path.join(OUT, `${name}.png`) });
    await page.close();
    console.log(`saved ${name}.svg + ${name}.png`);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
