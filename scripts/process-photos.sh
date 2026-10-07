#!/usr/bin/env bash
# Reproducible processing of the founder's photos into collage cut-outs (Design amendment 3).
# Run from the project root:  bash scripts/process-photos.sh
# Output: art-review/pending/<asset>.png (reviewed before moving to art-src/photos/).
set -euo pipefail
PY=.venv-media/Scripts/python
M=scripts/media.py
O=media-src/originals
W=art-review/pending/work
P=art-review/pending
mkdir -p "$W"

# a1-hand-writing-billbook: sepia hand writing in a carbon bill book (already a sticker).
# Soften the printed Portuguese form text so no foreign words read; the page lines stay.
$PY $M trim  $O/a1-hand-writing-billbook.png $W/a1-trim.png --pad 0.005
$PY $M blur  $W/a1-trim.png $P/a1-hand-writing-billbook.png --rect 0.15,0.34,0.62,0.50 --sigma 0.0035

# a3-hands-writing-booklet: NOT USED (reference only). Its printed "Coffee Works" form stays
# readable unless the writing hand is blurred too; stage a3 reuses a1-hand-writing-billbook instead.

# a2-van-rear-loading: van rear being loaded (person bent over, face hidden), as a photo print.
# Blur every box brand/label (SafeTouch, coop, Digitec Galaxus, orell fuessli, oeko, Anbruch).
$PY $M resize  $O/a2-van-rear-loading.jpg $W/a2-1800.png --max 1800
$PY $M blur    $W/a2-1800.png $W/a2-blur.png \
  --rect 0.60,0.71,0.30,0.16 --rect 0.27,0.71,0.16,0.08 --rect 0.12,0.64,0.16,0.10 \
  --rect 0.05,0.44,0.16,0.09 --rect 0.50,0.55,0.13,0.11 --rect 0.65,0.28,0.17,0.06 \
  --rect 0.55,0.66,0.20,0.06 --rect 0.40,0.29,0.12,0.06 --sigma 0.008
$PY $M sticker $W/a2-blur.png $P/a2-van-rear-loading.png --outline 0.02

# b2-van-topdown-loading: van seen from above being loaded (worker in a cap, face hidden).
# Crop away the garbled number plate and bumper; fresh sticker edge.
$PY $M trim    $O/b2-van-topdown-loading.png $W/b2-trim.png --pad 0
$PY $M crop    $W/b2-trim.png $W/b2-crop.png --rect 0,0,1,0.83
$PY $M sticker $W/b2-crop.png $P/b2-van-topdown-loading.png --outline 0.008

# a3-pettikada-kiosk: petti kada counter window only (no shutter sign, no branded tiles).
# Blur the soft-drink fridge.
$PY $M trim    $O/a3-pettikada-kiosk.png $W/pk-trim.png --pad 0
$PY $M crop    $W/pk-trim.png $W/pk-crop.png --rect 0.13,0.205,0.82,0.485
$PY $M blur    $W/pk-crop.png $W/pk-blur.png --rect 0.52,0.16,0.34,0.74 --rect 0.40,0.40,0.22,0.15 --rect 0.15,0.22,0.12,0.45 --sigma 0.03
$PY $M sticker $W/pk-blur.png $P/a3-pettikada-kiosk.png --outline 0.02

# b3-shop-snack-counter: a shop backdrop, brands and price tags blurred.
$PY $M resize  $O/b3-shop-snack-counter.jpg $W/b3-1800.png --max 1800
$PY $M blur    $W/b3-1800.png $W/b3-blur.png \
  --rect 0.34,0.17,0.15,0.13 --rect 0.35,0.28,0.13,0.12 --rect 0.12,0.37,0.06,0.07 \
  --rect 0.76,0.38,0.06,0.06 --rect 0.47,0.73,0.07,0.07 --rect 0.90,0.35,0.07,0.09 \
  --rect 0.64,0.42,0.09,0.12 --rect 0.85,0.06,0.14,0.15 --rect 0.79,0.55,0.19,0.11 \
  --rect 0.03,0.68,0.33,0.11 --sigma 0.01
$PY $M sticker $W/b3-blur.png $P/b3-shop-snack-counter.png --outline 0.02

# van-box-truck-side: THE distributor van (already a sticker, no logos). Trim and face right.
$PY $M trim    $O/van-box-truck-side.png $W/van-trim.png --pad 0.005
$PY - <<'EOF'
import cv2
img = cv2.imread('art-review/pending/work/van-trim.png', cv2.IMREAD_UNCHANGED)
cv2.imwrite('art-review/pending/van-box-truck-side.png', cv2.flip(img, 1))
print('art-review/pending/van-box-truck-side.png', img.shape[1], 'x', img.shape[0], '(mirrored to face right)')
EOF

# ---- Founder feedback round (2026-10-06) ----

# phone-frame: Pngtree bare phone mockup; key out the green screen, trim, 2x Lanczos (flat bezel stays
# crisp on 2x screens), then measure its screen into src/art/frames.json.
$PY $M chroma  $O/phone-frame-green.png $W/phone-key.png
$PY $M trim    $W/phone-key.png $W/phone-trim.png --pad 0.004
$PY - <<'PYEOF'
import cv2
im = cv2.imread('art-review/pending/work/phone-trim.png', cv2.IMREAD_UNCHANGED)
cv2.imwrite('art-review/pending/phone-frame.png', cv2.resize(im, None, fx=2, fy=2, interpolation=cv2.INTER_LANCZOS4))
PYEOF
# after approval + copy to art-src/photos/:
#   $PY $M screen-hole art-src/photos/phone-frame.png --name bare
#   $PY $M screen-hole art-src/photos/b1-hand-phone.png --name hand

# t stickers (already stickers): drop stray specks, trim, resize.
for n in t-owner-head-in-hands t-paper-folder; do
  $PY $M clean  $O/$n.png $W/$n-clean.png
  $PY $M trim   $W/$n-clean.png $W/$n-trim.png --pad 0.004
  $PY $M resize $W/$n-trim.png $P/$n.png --max 1800
done

# a3-fruit-shop-kerala: blur boxes / QR boards / crate stencils, crop off the soft-drink sign.
$PY $M blur    $O/a3-fruit-shop-kerala.jpg $W/fs-blur.png --rect 0.89,0.48,0.11,0.10 --rect 0.685,0.41,0.06,0.11 \
  --rect 0.25,0.35,0.11,0.045 --rect 0.42,0.35,0.07,0.035 --rect 0.66,0.545,0.13,0.08 --rect 0.78,0.55,0.12,0.08 \
  --rect 0.89,0.61,0.11,0.08 --rect 0.92,0.69,0.08,0.15 --rect 0,0.68,0.07,0.08 --rect 0.69,0.37,0.06,0.05 --sigma 0.006
$PY $M crop    $W/fs-blur.png $W/fs-crop.png --rect 0,0.15,0.89,0.69
$PY $M resize  $W/fs-crop.png $W/fs-1800.png --max 1800
$PY $M sticker $W/fs-1800.png $P/a3-fruit-shop-kerala.png --outline 0.02

# a4-receipts-pile: blur the readable print, crop, Part A sepia, photo-print edge.
$PY $M blur    $O/a4-receipts-pile.jpg $W/rp-blur.png --rect 0.30,0.42,0.62,0.30 --rect 0.62,0.78,0.36,0.12 --sigma 0.004
$PY $M crop    $W/rp-blur.png $W/rp-crop.png --rect 0,0.12,1,0.78
$PY $M resize  $W/rp-crop.png $W/rp-1600.png --max 1600
$PY - <<'PYEOF'
import cv2, numpy as np
im = cv2.imread('art-review/pending/work/rp-1600.png', cv2.IMREAD_UNCHANGED)
g = cv2.cvtColor(im[:, :, :3], cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
im[:, :, :3] = np.clip(np.stack([g * 0.62 + 0.06, g * 0.80 + 0.07, g * 0.92 + 0.08], -1) * 255, 0, 255).astype(np.uint8)
cv2.imwrite('art-review/pending/work/rp-sepia.png', im)
PYEOF
$PY $M sticker $W/rp-sepia.png $P/a4-receipts-pile.png --outline 0.018
