#!/usr/bin/env node
/**
 * Visual QA helper: screenshots a URL with the system Chrome after real wall-clock waits.
 * Usage: node scripts/screenshot.mjs <url> <out.png> [--w=1280] [--h=800] [--wait=3000] [--scroll=0] [--full] [--mobile] [--click=<selector>] [--clickwait=<ms>] [--reduced]
 */
import puppeteer from "puppeteer-core";

const [url, out, ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.map((a) => { const m = a.match(/^--([^=]+)(?:=(.*))?$/); return m ? [m[1], m[2] ?? "1"] : [a, "1"]; }));
const width = Number(opt.w ?? (opt.mobile ? 390 : 1280));
const height = Number(opt.h ?? (opt.mobile ? 844 : 800));
const wait = Number(opt.wait ?? 3000);
const scroll = Number(opt.scroll ?? 0);

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", `--window-size=${width},${height}`],
});
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: opt.mobile ? 2 : 1, isMobile: Boolean(opt.mobile), hasTouch: Boolean(opt.mobile) });
if (opt.reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
if (opt.mobile) await page.setUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36");
const logs = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`); });
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
if (opt.click) {
  await page.waitForSelector(opt.click, { timeout: 15000 });
  await page.click(opt.click);
  await new Promise((r) => setTimeout(r, Number(opt.clickwait ?? 2500)));
}
if (scroll) {
  await page.evaluate(async (y) => { window.scrollTo({ top: y, behavior: "instant" }); }, scroll);
}
await new Promise((r) => setTimeout(r, wait));
await page.screenshot({ path: out, fullPage: Boolean(opt.full) });
const metrics = await page.evaluate(() => ({ scrollHeight: document.documentElement.scrollHeight, canvas: [...document.querySelectorAll("canvas")].map((c) => `${c.width}x${c.height}`) }));
console.log(JSON.stringify({ out, width, height, ...metrics, logs: logs.slice(0, 12) }));
await browser.close();
