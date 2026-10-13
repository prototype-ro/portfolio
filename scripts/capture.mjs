import { chromium } from "playwright";
import { mkdir, rm, readdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const BASE = process.env.BASE_URL ?? "http://localhost:3001";
const OUT = path.resolve("docs/prototipo");
const TMP = path.resolve(".capture-frames");

const errors = [];

async function main() {
  await mkdir(OUT, { recursive: true });
  await rm(TMP, { recursive: true, force: true });
  await mkdir(TMP, { recursive: true });

  const browser = await chromium.launch();

  // ---------- desktop ----------
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await desktop.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) => {
    const url = r.url();
    const text = r.failure()?.errorText ?? "";
    // Next.js dev aborts cancelled RSC prefetches — not a real failure.
    if (url.includes("_rsc=") || text.includes("ERR_ABORTED")) return;
    errors.push(`requestfailed: ${url} ${text}`);
  });

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const sections = ["sobre", "projetos", "experiencias", "contato"];
  for (const id of sections) {
    await page.evaluate((sid) => {
      document.getElementById(sid)?.scrollIntoView({ block: "start" });
    }, id);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(OUT, `${id}.png`) });
    console.log(`saved ${id}.png`);
  }

  // ---------- scroll gif ----------
  const frames = 30;
  for (let i = 0; i < frames; i++) {
    const t = i / (frames - 1);
    await page.evaluate((ratio) => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.round(max * ratio));
    }, t);
    await page.waitForTimeout(260);
    const n = String(i).padStart(2, "0");
    await page.screenshot({ path: path.join(TMP, `f_${n}.png`) });
  }
  console.log("captured scroll frames");

  // ---------- mobile ----------
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mpage = await mobile.newPage();
  mpage.on("pageerror", (e) => errors.push(`mobile pageerror: ${e.message}`));
  await mpage.goto(BASE, { waitUntil: "networkidle" });
  await mpage.waitForTimeout(1500);
  await mpage.screenshot({ path: path.join(OUT, "mobile.png") });
  console.log("saved mobile.png");

  await browser.close();

  // ---------- assemble gif ----------
  const first = (await readdir(TMP)).filter((f) => f.endsWith(".png")).sort();
  console.log(`frames on disk: ${first.length}`);
  await run("ffmpeg", [
    "-y",
    "-framerate",
    "10",
    "-i",
    path.join(TMP, "f_%02d.png"),
    "-vf",
    "scale=760:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse",
    "-loop",
    "0",
    path.join(OUT, "scroll.gif"),
  ]);
  console.log("saved scroll.gif");

  // size report
  const { stdout } = await run("du", ["-sh", TMP]);
  console.log(`temp frames: ${stdout.trim()}`);

  if (errors.length) {
    console.log("\n--- CONSOLE / NETWORK ERRORS ---");
    for (const e of errors) console.log(e);
    process.exitCode = 1;
  } else {
    console.log("\nNo console/network errors detected.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
