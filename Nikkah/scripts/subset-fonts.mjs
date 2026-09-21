#!/usr/bin/env node
/**
 * Build-time font subsetting (runs as `prebuild`).
 * Noto Nastaliq Urdu is ~239 KB because Nastaliq needs thousands of contextual glyphs. Subsetting it to the
 * characters this site actually renders keeps HarfBuzz shaping identical (layout tables are retained) and
 * cuts ~35% off the largest asset on the critical path. Every string literal in src/ is scanned, so editing
 * copy and rebuilding keeps the subset complete.
 */
import subsetFont from "subset-font";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const FULL = "src/app/fonts/NotoNastaliqUrdu-full.woff2";
const OUT = "src/app/fonts/NotoNastaliqUrdu-subset.woff2";

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(tsx?|mjs|css)$/.test(name)) acc.push(p);
  }
  return acc;
}

const chars = new Set();
// Digits, punctuation and symbols always included.
for (const c of "۰۱۲۳۴۵۶۷۸۹0123456789،۔؛؟٪٫٬؍ء()«»[]{}.,:;!?'\"-–—·•/\\&%+*=@#_  ‌‍‎‏،۔") chars.add(c);
// Basic Latin so any English fallback inside Urdu runs never hits .notdef.
for (let i = 0x20; i < 0x7f; i++) chars.add(String.fromCharCode(i));
for (const file of walk("src")) {
  if (file.endsWith(OUT.split("/").pop())) continue;
  const text = readFileSync(file, "utf8");
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if ((cp >= 0x0600 && cp <= 0x06ff) || (cp >= 0x0750 && cp <= 0x077f) || (cp >= 0xfb50 && cp <= 0xfdff) || (cp >= 0xfe70 && cp <= 0xfeff) || cp === 0x0670) chars.add(ch);
  }
}
const text = [...chars].join("");
const full = readFileSync(FULL);
const subset = await subsetFont(full, text, { targetFormat: "woff2" });
writeFileSync(OUT, subset);
console.log(`Nastaliq subset: ${chars.size} characters, ${(full.length / 1024).toFixed(0)} KB -> ${(subset.length / 1024).toFixed(0)} KB`);
