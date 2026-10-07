// Builds web images from the approved sources in art-src/ (npm run art), guide 8.4 adapted for
// Design amendment 3 (photo collage). Only files logged as approved in docs/ART_APPROVALS.md are built.
//
//   art-src/photos/<id>.png   → public/art/photos/<id>.webp (2x) + <id>@1x.webp
//   art-src/screens/<id>.png  → public/art/screens/<id>.webp (2x) + <id>@1x.webp
//   src/art/manifest.json     → { "<group>/<id>": { w, h, kb2x, kb1x } }   (w/h = 1x CSS size)
import { readdir, readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const GROUPS = {
  photos: { max2x: 1600, quality: 80 },
  screens: { max2x: 1748, quality: 84 }, // keep full 780px width (2x) so app text stays crisp
};

const approvals = await readFile('docs/ART_APPROVALS.md', 'utf8');
const manifest = {};
let warnings = 0;

for (const [group, opts] of Object.entries(GROUPS)) {
  const src = path.join('art-src', group);
  const out = path.join('public', 'art', group);
  await mkdir(out, { recursive: true });
  let files = [];
  try {
    files = (await readdir(src)).filter((f) => f.endsWith('.png'));
  } catch {
    continue;
  }
  for (const file of files) {
    const id = file.replace(/\.png$/, '');
    const rel = `art-src/${group}/${file}`;
    const baseId = id.replace(/-(en|ml)$/, '');
    if (!approvals.includes(rel) && !approvals.includes(`art-src/${group}/${baseId}-{en,ml}.png`)) {
      console.warn(`! ${rel} is not logged as approved in docs/ART_APPROVALS.md — skipped`);
      warnings++;
      continue;
    }
    const meta = await sharp(path.join(src, file)).metadata();
    const scale2 = Math.min(1, opts.max2x / Math.max(meta.width, meta.height));
    const w2 = Math.round(meta.width * scale2);
    const h2 = Math.round(meta.height * scale2);
    const w1 = Math.round(w2 / 2);
    const h1 = Math.round(h2 / 2);
    const o2 = path.join(out, `${id}.webp`);
    const o1 = path.join(out, `${id}@1x.webp`);
    const enc = { quality: opts.quality, alphaQuality: 90, effort: 5 };
    await sharp(path.join(src, file)).resize(w2, h2).webp(enc).toFile(o2);
    await sharp(path.join(src, file)).resize(w1, h1).webp(enc).toFile(o1);
    const kb2x = Math.round((await stat(o2)).size / 1024);
    const kb1x = Math.round((await stat(o1)).size / 1024);
    manifest[`${group}/${id}`] = { w: w1, h: h1, kb2x, kb1x };
    console.log(`${group}/${id}`.padEnd(34), `${w2}×${h2}`.padEnd(11), `${kb2x} KB (2x)`.padEnd(14), `${kb1x} KB (1x)`);
  }
}

// Every screenshot must match the phone screens it goes into (src/art/frames.json, from
// `media.py screen-hole`); a mismatch over 3% would crop app content.
try {
  const frames = JSON.parse(await readFile('src/art/frames.json', 'utf8'));
  for (const [key, m] of Object.entries(manifest)) {
    if (!key.startsWith('screens/')) continue;
    for (const [name, f] of Object.entries(frames)) {
      const holeAspect = f.aspect;
      const usable = holeAspect / (1 - f.strip / 100); // the status strip takes the top of the screen
      const diff = Math.abs(m.w / m.h - usable) / usable;
      if (diff > 0.03) {
        console.warn(`! ${key} (${m.w}×${m.h}) is ${(diff * 100).toFixed(1)}% off the "${name}" phone screen; it will be cropped at the bottom`);
        warnings++;
      }
    }
  }
} catch {
  /* no frames.json yet */
}

await mkdir('src/art', { recursive: true });
await writeFile('src/art/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n${Object.keys(manifest).length} images → src/art/manifest.json${warnings ? `, ${warnings} skipped` : ''}`);
