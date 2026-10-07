// Preview a transparent cut-out on the site's light (paper) and dark (ledger) grounds, side by side.
import sharp from 'sharp';
const [, , inp, out] = process.argv;
const img = sharp(inp);
const { width, height } = await img.metadata();
const h = 700;
const w = Math.round((width / height) * h);
const cut = await sharp(inp).resize(w, h).png().toBuffer();
const tile = (bg) => sharp({ create: { width: w + 80, height: h + 80, channels: 4, background: bg } }).composite([{ input: cut, left: 40, top: 40 }]).png().toBuffer();
const [light, dark] = await Promise.all([tile('#E9EEEA'), tile('#15160E')]);
await sharp({ create: { width: (w + 80) * 2, height: h + 80, channels: 4, background: '#ffffff' } })
  .composite([{ input: light, left: 0, top: 0 }, { input: dark, left: w + 80, top: 0 }])
  .jpeg({ quality: 85 })
  .toFile(out);
console.log(out);
