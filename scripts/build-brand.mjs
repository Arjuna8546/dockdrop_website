// Builds web-ready logo files from the brand sources in brand-src/ (npm run brand).
// brand-src/dockdrop-mark.png : circle mark on transparent (header, captions, footer, favicon)
// brand-src/dockdrop-icon.png : square dark tile (apple-touch-icon, where transparency isn't allowed)
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const MARK = 'brand-src/dockdrop-mark.png';
const ICON = 'brand-src/dockdrop-icon.png';

await mkdir('public/brand', { recursive: true });

// Trim the transparent padding so the circle fills the image.
const trimmed = await sharp(MARK).trim({ threshold: 1 }).png().toBuffer();
const meta = await sharp(trimmed).metadata();
console.log(`mark trimmed to ${meta.width}×${meta.height}`);

const square = (size) =>
  sharp(trimmed).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });

for (const size of [64, 128, 256]) {
  await square(size).webp({ quality: 90, alphaQuality: 100 }).toFile(`public/brand/mark-${size}.webp`);
}
await square(32).png().toFile('public/favicon-32.png');
await square(192).png().toFile('public/favicon-192.png');
await sharp(ICON).resize(180, 180).png().toFile('public/apple-touch-icon.png');

console.log('brand files written: public/brand/mark-{64,128,256}.webp, favicon-32.png, favicon-192.png, apple-touch-icon.png');
