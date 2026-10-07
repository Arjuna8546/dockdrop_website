// Builds public/og.png (1200×630) from approved art + brand mark (npm run og).
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const W = 1200;
const H = 630;
const phone = await sharp('art-src/photos/b1-hand-phone.png').resize({ height: 520 }).png().toBuffer();
const mark = await sharp('public/brand/mark-256.webp').resize(76, 76).png().toBuffer();
const pm = await sharp(phone).metadata();

// The screenshot sits under the phone's see-through screen: the same measured hole the site uses
// (src/art/frames.json, `media.py screen-hole`), cropped from the top like PhoneShot.
const phoneLeft = W - pm.width - 10;
const phoneTop = H - pm.height + 30;
const hole = JSON.parse(await readFile('src/art/frames.json', 'utf8')).hand;
const box = (pct, size) => Math.round((pct / 100) * size);
const screenW = box(hole.width, pm.width) + 4;
const screenH = box(hole.height, pm.height) + 4;
const strip = Math.round((hole.strip / 100) * screenH); // paper strip under the notch, as on the site
const shotFit = await sharp({ create: { width: screenW, height: screenH, channels: 4, background: '#E9EEEA' } })
  .composite([
    {
      input: await sharp('art-src/screens/b1-dashboard-en.png').resize(screenW, screenH - strip, { fit: 'cover', position: 'top' }).png().toBuffer(),
      left: 0,
      top: strip,
    },
  ])
  .png()
  .toBuffer();

const text = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .h { font: 700 58px 'Segoe UI', Arial, sans-serif; fill: #E9EEEA; }
    .s { font: 500 28px 'Segoe UI', Arial, sans-serif; fill: #CFEA3E; }
    .w { font: 700 34px 'Segoe UI', Arial, sans-serif; fill: #E9EEEA; }
  </style>
  <text x="152" y="122" class="w">DockDrop</text>
  <text x="72" y="270" class="h">Van sales app for</text>
  <text x="72" y="340" class="h">Kerala distributors</text>
  <text x="72" y="410" class="s">In Malayalam · ₹349 / month</text>
</svg>`);

await sharp({ create: { width: W, height: H, channels: 4, background: '#15160E' } })
  .composite([
    { input: shotFit, left: phoneLeft + box(hole.left, pm.width) - 2, top: phoneTop + box(hole.top, pm.height) - 2 },
    { input: phone, left: phoneLeft, top: phoneTop },
    { input: mark, left: 64, top: 64 },
    { input: text, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile('public/og.png');
console.log('public/og.png 1200×630');
