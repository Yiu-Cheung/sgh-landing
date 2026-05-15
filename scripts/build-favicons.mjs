// Regenerate favicons at proper sizes from src/assets/logo.png.
// Run once after the source logo changes:  node scripts/build-favicons.mjs
//
// The old favicons in public/ were 371 kB copies of the full-size logo,
// which (a) blew the byte budget on every page load and (b) caused Google's
// favicon crawler to fall back to the "A" letter avatar.

import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const logo = path.join(repoRoot, 'src/assets/logo.png');
const out = path.join(repoRoot, 'public');

const targets = [
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'favicon.png', size: 32 }, // canonical PNG favicon
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
];

const before = await fs.stat(logo).then((s) => s.size).catch(() => null);
if (!before) {
  console.error('Source logo not found:', logo);
  process.exit(1);
}

for (const { file, size } of targets) {
  const target = path.join(out, file);
  await sharp(logo).resize(size, size, { fit: 'cover' }).png({ compressionLevel: 9 }).toFile(target);
  const after = (await fs.stat(target)).size;
  console.log(`  ${file.padEnd(28)} ${size}x${size}  →  ${(after / 1024).toFixed(1)} KB`);
}

// favicon.ico: a 32x32 PNG renamed/wrapped. Real .ico is multi-resolution but
// browsers tolerate a single PNG with the .ico extension. Cheap + works.
const icoBuffer = await sharp(logo).resize(32, 32, { fit: 'cover' }).png({ compressionLevel: 9 }).toBuffer();
await fs.writeFile(path.join(out, 'favicon.ico'), icoBuffer);
console.log(`  favicon.ico                  32x32  →  ${(icoBuffer.length / 1024).toFixed(1)} KB`);

console.log(`\nSource: ${(before / 1024).toFixed(1)} KB → favicons regenerated.`);
