#!/usr/bin/env node
/**
 * Renders /og with the system Chrome and writes src/app/opengraph-image.jpg + twitter-image.jpg (1200×630, < 300 KB for WhatsApp).
 * Usage: pnpm dev (in another terminal) then `node scripts/og.mjs [http://localhost:3000]`
 */
import puppeteer from "puppeteer-core";
import { execFileSync } from "node:child_process";
import { statSync, copyFileSync, writeFileSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--window-size=1200,630"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto(`${base}/og`, { waitUntil: "networkidle2", timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 2000));
await page.screenshot({ path: "public/og-source.png" });
await browser.close();

let quality = 86;
for (;;) {
  execFileSync("magick", ["public/og-source.png", "-strip", "-interlace", "Plane", "-sampling-factor", "4:2:0", "-quality", String(quality), "src/app/opengraph-image.jpg"]);
  const kb = statSync("src/app/opengraph-image.jpg").size / 1024;
  console.log(`quality ${quality}: ${kb.toFixed(0)} KB`);
  if (kb < 290 || quality <= 60) break;
  quality -= 6;
}
copyFileSync("src/app/opengraph-image.jpg", "src/app/twitter-image.jpg");
writeFileSync("src/app/opengraph-image.alt.txt", "دعوتِ نکاح — ساجد راجپوت و ایمن خان — جمعہ ۱۶ اکتوبر ۲۰۲۶ء، بعد نمازِ عصر، مسجدِ قبا، لاہور");
writeFileSync("src/app/twitter-image.alt.txt", "Nikkah invitation — Sajid Rajput & Aiman Khan — Friday 16 October 2026, after Asr, Masjid-e-Quba, Lahore");
execFileSync("rm", ["-f", "public/og-source.png"]);
console.log("done");
