// Renders the Android launcher icons and the Play Store icon from the two SVG layers.
// Run with: npm run icons
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const res = join(here, '..', 'android', 'app', 'src', 'main', 'res');
const inner = file => readFileSync(join(here, file), 'utf8').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const bg = inner('icon-background.svg'), fg = inner('icon-foreground.svg');

// Adaptive layers are 108 units; launchers show the centre 72. Legacy and store icons use that crop.
const layer = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">${body}</svg>`;
const shaped = clip => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="18 18 72 72">
  <defs><clipPath id="shape">${clip}</clipPath></defs><g clip-path="url(#shape)">${bg}${fg}</g></svg>`;
const SQUARE = '<rect x="18" y="18" width="72" height="72"/>';
const ROUNDED = '<rect x="20" y="20" width="68" height="68" rx="14"/>';
const CIRCLE = '<circle cx="54" cy="54" r="34"/>';

function png(svg, size, out) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng());
}

const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [d, k] of Object.entries(densities)) {
  const dir = join(res, `mipmap-${d}`);
  png(layer(fg), 108 * k, join(dir, 'ic_launcher_foreground.png'));
  png(layer(bg), 108 * k, join(dir, 'ic_launcher_background.png'));
  png(shaped(ROUNDED), 48 * k, join(dir, 'ic_launcher.png'));
  png(shaped(CIRCLE), 48 * k, join(dir, 'ic_launcher_round.png'));
}
// Launch splash: dark field with the cyan core glow and red embers, emblem centred at 42% of the short side.
function splash(w, h) {
  const s = Math.min(w, h) * 0.42, x = (w - s) / 2, y = (h - s) / 2, r = Math.max(w, h);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="sc" cx="${w / 2}" cy="${h / 2}" r="${s * 0.9}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#145566" stop-opacity="0.75"/><stop offset="1" stop-color="#050912" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="se" cx="${w / 2}" cy="${h * 1.08}" r="${r * 0.55}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ff4a3a" stop-opacity="0.7"/><stop offset="0.5" stop-color="#9c1c18" stop-opacity="0.3"/><stop offset="1" stop-color="#3a0808" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#050912"/>
  <rect width="${w}" height="${h}" fill="url(#sc)"/>
  <rect width="${w}" height="${h}" fill="url(#se)"/>
  <svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="18 18 72 72">
    <defs>
      <linearGradient id="fade" x1="0" y1="70" x2="0" y2="90" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
      <mask id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="108" height="108"><rect width="108" height="108" fill="url(#fade)"/></mask>
    </defs>
    <g mask="url(#cut)">${fg}</g>
  </svg>
</svg>`;
}
const splashSizes = {
  'drawable': [480, 320],
  'drawable-land-mdpi': [480, 320], 'drawable-land-hdpi': [800, 480], 'drawable-land-xhdpi': [1280, 720],
  'drawable-land-xxhdpi': [1600, 960], 'drawable-land-xxxhdpi': [1920, 1280],
  'drawable-port-mdpi': [320, 480], 'drawable-port-hdpi': [480, 800], 'drawable-port-xhdpi': [720, 1280],
  'drawable-port-xxhdpi': [960, 1600], 'drawable-port-xxxhdpi': [1280, 1920]
};
for (const [dir, [w, h]] of Object.entries(splashSizes)) png(splash(w, h), w, join(res, dir, 'splash.png'));

png(shaped(SQUARE), 512, join(here, 'play-store-icon-512.png'));
png(shaped(CIRCLE), 1024, join(here, 'preview-round-1024.png'));
console.log('Icons and splash screens written.');
