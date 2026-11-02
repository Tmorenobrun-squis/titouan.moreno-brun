// Usage : node screenshot.mjs <url> [label]
// Sauvegarde dans "./temporary screenshots/screenshot-N[-label].png" (jamais écrasé)
import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const OUT_DIR = join(ROOT, 'temporary screenshots');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3];
const width = Number(process.env.WIDTH) || 1440;
const height = Number(process.env.HEIGHT) || 900;

if (url.startsWith('file://')) {
  console.error('Utiliser une URL localhost, pas file://');
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });
const files = await readdir(OUT_DIR);
const next =
  files.reduce((max, f) => {
    const m = f.match(/^screenshot-(\d+)/);
    return m ? Math.max(max, Number(m[1])) : max;
  }, 0) + 1;
const outPath = join(OUT_DIR, `screenshot-${next}${label ? `-${label}` : ''}.png`);

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  // Laisser le temps aux polices et animations d'entrée de se stabiliser
  await page.evaluate(() => document.fonts.ready);
  // Laisser l'intro se terminer (réglable : WAIT=ms)
  await new Promise((r) => setTimeout(r, Number(process.env.WAIT) || 2500));
  // Défiler toute la page pour déclencher les animations d'apparition au scroll
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 120));
    }
    // Figer les révélations GSAP à leur état final (sinon elles s'inversent en remontant)
    window.ScrollTrigger?.getAll().forEach((t) => {
      if (t.vars.scrub || !t.animation) return;
      t.animation?.progress(1);
      t.kill();
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(outPath);
} finally {
  await browser.close();
}
