import { chromium } from "playwright";
const BASE = process.env.BASE_URL ?? "http://localhost:3001";
const widths = [375, 768, 1280, 1920];
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const res = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  const overflow = res.scrollW - res.clientW;
  console.log(`${w}px -> scrollWidth=${res.scrollW} clientWidth=${res.clientW} overflow=${overflow}`);
  await ctx.close();
}
await browser.close();
