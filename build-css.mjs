// Génère le CSS Tailwind et le place dans index.html, entre les deux marqueurs.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const css = execSync('npx tailwindcss -c tailwind.config.js -i tailwind.input.css --minify', { encoding: 'utf8' });
const html = readFileSync('index.html', 'utf8');
const start = '<style id="tailwind">', end = '</style><!-- /tailwind -->';
const i = html.indexOf(start), j = html.indexOf(end);
if (i < 0 || j < 0) throw new Error('Marqueurs <style id="tailwind"> introuvables dans index.html');
writeFileSync('index.html', html.slice(0, i + start.length) + css.trim() + html.slice(j));
console.log(`CSS Tailwind intégré (${(css.length / 1024).toFixed(1)} Ko)`);
