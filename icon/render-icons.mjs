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
png(shaped(SQUARE), 512, join(here, 'play-store-icon-512.png'));
png(shaped(CIRCLE), 1024, join(here, 'preview-round-1024.png'));
console.log('Icons written.');
