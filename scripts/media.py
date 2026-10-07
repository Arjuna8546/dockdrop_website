"""Image processing for the photo-collage story (Design amendment 3).

Runs with the project's private venv:  .venv-media/Scripts/python scripts/media.py <command> ...
Every command reads an image and writes a PNG (alpha kept). Results go to art-review/pending/
for founder approval; nothing here writes into src/, public/ or art-src/.

Commands
  cutout  IN OUT [--model isnet-general-use]        remove the background (rembg, offline)
  sticker IN OUT [--outline 0.012] [--shadow 0.35] [--keep-holes]
                                                    white sticker edge + soft shadow around the outer shape
                                                    (stray specks removed, edge smoothed)
  blur    IN OUT --rect x,y,w,h [--rect ...] [--sigma 0.02]   blur regions (logos, labels, private text)
  inpaint IN OUT --rect x,y,w,h [--rect ...]        fill regions from their surroundings (flat surfaces only)
  trim    IN OUT [--pad 0.02]                       crop to the visible (alpha) content
  resize  IN OUT --max 2400                         longest side to --max px
  crop    IN OUT --rect x,y,w,h                     crop to a rectangle
  clean   IN OUT [--min-island 0.01]                drop stray specks around an existing sticker
  chroma  IN OUT                                    green screen → transparent, with despill
  screen-hole IN --name N [--json src/art/frames.json]
                                                    measure a phone frame's see-through screen
                                                    (box, corner radius, tilt, notch strip) into JSON
Rect values may be pixels or fractions of the image (0–1), e.g. 0.42,0.55,0.1,0.06.
Sizes given as fractions (outline, sigma, pad) are relative to the image's longer side.
"""

import argparse
import sys

import cv2
import numpy as np


def load(path):
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img is None:
        sys.exit(f"cannot read {path}")
    if img.ndim == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
    elif img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    return img


def save(img, path):
    if not cv2.imwrite(path, img):
        sys.exit(f"cannot write {path}")
    h, w = img.shape[:2]
    print(f"{path}  {w}x{h}")


def rect(spec, w, h):
    vals = [float(v) for v in spec.split(",")]
    if all(v <= 1 for v in vals):
        vals = [vals[0] * w, vals[1] * h, vals[2] * w, vals[3] * h]
    x, y, rw, rh = (int(round(v)) for v in vals)
    return max(0, x), max(0, y), min(w - x, rw), min(h - y, rh)


def size_of(frac, img):
    return max(1, int(round(frac * max(img.shape[:2]))))


def cmd_cutout(a):
    from rembg import new_session, remove

    with open(a.inp, "rb") as f:
        data = f.read()
    out = remove(data, session=new_session(a.model), post_process_mask=True)
    arr = cv2.imdecode(np.frombuffer(out, np.uint8), cv2.IMREAD_UNCHANGED)
    save(arr, a.out)


def clean_alpha(alpha, min_island=0.004, smooth=0.002):
    """Drop stray specks (islands smaller than min_island of the largest piece) and soften jaggies."""
    _, solid = cv2.threshold(alpha, 24, 255, cv2.THRESH_BINARY)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(solid, 8)
    if n > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]
        keep = np.zeros(n, bool)
        keep[1:] = areas >= areas.max() * min_island
        alpha = np.where(keep[labels], alpha, 0).astype(np.uint8)
    k = max(1, int(round(smooth * max(alpha.shape))))
    if k > 1:
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k * 2 + 1, k * 2 + 1))
        closed = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel)
        alpha = cv2.morphologyEx(closed, cv2.MORPH_OPEN, kernel)
    return alpha


def bleed_colors(img):
    """Give every not-fully-opaque pixel the colour of its nearest opaque pixel.
    Cut-out tools leave black (or background-tinted) colour under transparent and edge pixels;
    without this, edge fringes and any later hole-filling show up as dark specks."""
    alpha = img[:, :, 3]
    to_fill = (alpha < 250).astype(np.uint8)
    if not to_fill.any() or to_fill.all():
        return img
    _, labels = cv2.distanceTransformWithLabels(to_fill, cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
    zy, zx = np.where(to_fill == 0)  # opaque pixels, numbered 1..N in scan order by the labels
    img[:, :, :3] = img[zy[labels - 1], zx[labels - 1], :3]
    return img


def cmd_sticker(a):
    img = load(a.inp)
    img = bleed_colors(img)  # first: smoothing below turns some transparent (black-underneath) pixels solid
    img[:, :, 3] = clean_alpha(img[:, :, 3])
    outline = size_of(a.outline, img)
    shadow = size_of(0.02, img) if a.shadow > 0 else 0
    pad = outline + shadow * 2 + 4
    img = cv2.copyMakeBorder(img, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=(0, 0, 0, 0))
    img = bleed_colors(img)  # the new border is black underneath; give it edge colours before any fill
    alpha = img[:, :, 3]

    # White edge around the OUTER shape only: fill interior holes (e.g. a phone's see-through
    # screen) for the dilation, then cut the holes back out so they stay clear with no inner rim.
    _, solid = cv2.threshold(alpha, 24, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(solid, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    filled = np.zeros_like(solid)
    cv2.drawContours(filled, contours, -1, 255, -1)
    holes = cv2.subtract(filled, solid)
    # Pinholes (< 0.2% of the image) are cut-out noise, not real openings: make them solid again.
    n, labels, stats, _ = cv2.connectedComponentsWithStats(holes, 8)
    tiny = np.zeros(n, bool)
    tiny[1:] = stats[1:, cv2.CC_STAT_AREA] < 0.002 * holes.size
    pin = tiny[labels]
    # Small gaps that touch the edge (e.g. where a hand leaves the photo) aren't holes; a closing
    # with a slightly larger brush finds those too.
    kb = size_of(0.004, img)
    big = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kb * 2 + 1, kb * 2 + 1))
    gaps = cv2.subtract(cv2.morphologyEx(solid, cv2.MORPH_CLOSE, big), solid) > 0
    pin = pin | (gaps & (holes == 0))
    # Colours were bled from the nearest opaque pixel, so solidifying pins needs no borrowing.
    img[:, :, 3] = np.where(pin, 255, img[:, :, 3])
    holes = np.where(pin, 0, holes).astype(np.uint8)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (outline * 2 + 1, outline * 2 + 1))
    edge = cv2.dilate(filled, kernel)
    edge = cv2.GaussianBlur(edge, (0, 0), max(1, outline * 0.15))
    if a.keep_holes:
        edge = cv2.subtract(edge, holes)

    h, w = alpha.shape
    canvas = np.zeros((h, w, 4), np.float32)

    if shadow:
        sh = cv2.GaussianBlur(edge.astype(np.float32), (0, 0), shadow)
        sh = np.roll(sh, (int(shadow * 0.6), int(shadow * 0.3)), axis=(0, 1))  # light from the top-left
        canvas[:, :, 3] = sh / 255.0 * a.shadow  # dark (ledger-ish) shadow
        canvas[:, :, 0:3] = (14, 22, 21)  # BGR of #15160E

    def over(dst, rgb, a_src):
        a_dst = dst[:, :, 3]
        a_out = a_src + a_dst * (1 - a_src)
        for c in range(3):
            dst[:, :, c] = np.where(
                a_out > 0, (rgb[c] * a_src + dst[:, :, c] * a_dst * (1 - a_src)) / np.maximum(a_out, 1e-6), 0
            )
        dst[:, :, 3] = a_out

    over(canvas, (255, 255, 255), edge.astype(np.float32) / 255.0)
    src = img.astype(np.float32)
    a_src = src[:, :, 3] / 255.0
    a_dst = canvas[:, :, 3]
    a_out = a_src + a_dst * (1 - a_src)
    for c in range(3):
        canvas[:, :, c] = np.where(
            a_out > 0, (src[:, :, c] * a_src + canvas[:, :, c] * a_dst * (1 - a_src)) / np.maximum(a_out, 1e-6), 0
        )
    canvas[:, :, 3] = a_out * 255
    save(np.clip(canvas, 0, 255).astype(np.uint8), a.out)


def cmd_blur(a):
    img = load(a.inp)
    h, w = img.shape[:2]
    sigma = size_of(a.sigma, img)
    for spec in a.rect:
        x, y, rw, rh = rect(spec, w, h)
        region = img[y : y + rh, x : x + rw]
        blurred = cv2.GaussianBlur(region, (0, 0), sigma)
        # Feather the edge so the blur doesn't show a hard box.
        mask = np.zeros((rh, rw), np.float32)
        f = max(2, min(rw, rh) // 8)
        cv2.rectangle(mask, (f, f), (rw - f, rh - f), 1.0, -1)
        mask = cv2.GaussianBlur(mask, (0, 0), f / 2)[:, :, None]
        img[y : y + rh, x : x + rw] = (blurred * mask + region * (1 - mask)).astype(np.uint8)
    save(img, a.out)


def cmd_inpaint(a):
    img = load(a.inp)
    h, w = img.shape[:2]
    mask = np.zeros((h, w), np.uint8)
    for spec in a.rect:
        x, y, rw, rh = rect(spec, w, h)
        mask[y : y + rh, x : x + rw] = 255
    bgr = cv2.inpaint(img[:, :, :3], mask, size_of(0.01, img), cv2.INPAINT_TELEA)
    img[:, :, :3] = bgr
    save(img, a.out)


def cmd_trim(a):
    img = load(a.inp)
    ys, xs = np.where(img[:, :, 3] > 8)
    if not len(xs):
        sys.exit("image is fully transparent")
    pad = size_of(a.pad, img)
    h, w = img.shape[:2]
    x0, x1 = max(0, xs.min() - pad), min(w, xs.max() + pad + 1)
    y0, y1 = max(0, ys.min() - pad), min(h, ys.max() + pad + 1)
    save(img[y0:y1, x0:x1], a.out)


def cmd_resize(a):
    img = load(a.inp)
    h, w = img.shape[:2]
    s = a.max / max(h, w)
    if s < 1:
        img = cv2.resize(img, (round(w * s), round(h * s)), interpolation=cv2.INTER_AREA)
    save(img, a.out)


def cmd_crop(a):
    img = load(a.inp)
    h, w = img.shape[:2]
    x, y, rw, rh = rect(a.rect[0], w, h)
    save(img[y : y + rh, x : x + rw], a.out)


def cmd_clean(a):
    """Drop stray specks around an existing sticker (no re-outlining)."""
    img = load(a.inp)
    _, solid = cv2.threshold(img[:, :, 3], a.thresh, 255, cv2.THRESH_BINARY)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(solid, 8)
    if n > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]
        keep = np.zeros(n, bool)
        keep[1:] = areas >= areas.max() * a.min_island
        # keep the soft (sub-threshold) shadow only next to kept pieces
        near = cv2.dilate(keep[labels].astype(np.uint8) * 255, np.ones((25, 25), np.uint8)) > 0
        img[:, :, 3] = np.where(near, img[:, :, 3], 0)
        img[:, :, 3] = np.where((solid > 0) & ~keep[labels], 0, img[:, :, 3])
    save(img, a.out)


def cmd_chroma(a):
    """Green screen → transparent (phone mockups), with despill on the antialiased rim."""
    img = load(a.inp).astype(np.int32)
    b, g, r = img[:, :, 0], img[:, :, 1], img[:, :, 2]
    green = g - np.maximum(r, b)
    key = np.clip((green - 40) / 140.0, 0, 1)  # 1 = fully green
    img[:, :, 3] = (img[:, :, 3] * (1 - key)).astype(np.int32)
    img[:, :, 1] = np.where(green > 0, np.maximum(r, b), g)  # despill
    save(np.clip(img, 0, 255).astype(np.uint8), a.out)


def cmd_screen_hole(a):
    """Measure the see-through screen of a phone frame and write it into a JSON map:
    { name: { left, top, width, height (%, of the unrotated hole), radius (% of hole width),
              rot (deg), strip (% of hole height covered by a notch / island at the top) } }"""
    import json
    import os

    img = load(a.inp)
    h, w = img.shape[:2]
    alpha = img[:, :, 3]
    opaque = (alpha >= 64).astype(np.uint8) * 255
    # interior holes = filled outer shape minus opaque
    contours, _ = cv2.findContours(opaque, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    filled = np.zeros_like(opaque)
    cv2.drawContours(filled, contours, -1, 255, -1)
    holes = cv2.subtract(filled, opaque)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(holes, 8)
    if n < 2:
        sys.exit("no see-through screen found")
    big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    hole = (labels == big).astype(np.uint8) * 255
    cs, _ = cv2.findContours(hole, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    hull = cv2.convexHull(cs[0])
    (cx, cy), (rw, rh), ang = cv2.minAreaRect(hull)
    # normalise to a small tilt; each 90° step swaps the rect's sides
    while ang > 45:
        ang -= 90
        rw, rh = rh, rw
    while ang < -45:
        ang += 90
        rw, rh = rh, rw
    # deskew so the hole is axis-aligned, then measure the corner radius and the notch strip
    M = cv2.getRotationMatrix2D((cx, cy), ang, 1.0)
    hole_d = cv2.warpAffine(hole, M, (w, h), flags=cv2.INTER_NEAREST)
    hull_d = np.zeros_like(hole_d)
    cv2.fillConvexPoly(hull_d, cv2.transform(hull, M).astype(np.int32), 255)
    x0, y0 = int(round(cx - rw / 2)), int(round(cy - rh / 2))
    x1, y1 = int(round(cx + rw / 2)), int(round(cy + rh / 2))
    # corner radius: rows at the bottom whose left edge is still curving inwards
    radius = 0
    for k in range(1, int(rh // 4)):
        row = hull_d[y1 - k, x0 : x1]
        xs = np.where(row > 0)[0]
        if len(xs) and xs[0] <= 2:
            radius = k
            break
    # notch / island: opaque run on the centre column inside the top 18% of the hole
    col = (hull_d[y0:y1, int(cx)] > 0) & (hole_d[y0:y1, int(cx)] == 0)
    strip = 0
    top = int(rh * 0.18)
    run = np.where(col[:top])[0]
    if len(run):
        strip = int(run.max()) + 1
    out = {
        "left": round((cx - rw / 2) / w * 100, 3),
        "top": round((cy - rh / 2) / h * 100, 3),
        "width": round(rw / w * 100, 3),
        "height": round(rh / h * 100, 3),
        "radius": round(radius / rw * 100, 2),
        "rot": round(-ang, 2),
        "strip": round(strip / rh * 100, 2),
        "aspect": round(rw / rh, 4),
    }
    data = {}
    if os.path.exists(a.json):
        with open(a.json, encoding="utf8") as f:
            data = json.load(f)
    data[a.name] = out
    with open(a.json, "w", encoding="utf8") as f:
        json.dump(data, f, indent=2)
        f.write("\n")
    print(a.name, out)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    def add(name, fn):
        sp = sub.add_parser(name)
        sp.add_argument("inp")
        sp.add_argument("out")
        sp.set_defaults(fn=fn)
        return sp

    add("cutout", cmd_cutout).add_argument("--model", default="isnet-general-use")
    s = add("sticker", cmd_sticker)
    s.add_argument("--outline", type=float, default=0.012)
    s.add_argument("--shadow", type=float, default=0.35)
    s.add_argument("--keep-holes", action="store_true", help="leave interior holes see-through (phone screens)")
    b = add("blur", cmd_blur)
    b.add_argument("--rect", action="append", required=True)
    b.add_argument("--sigma", type=float, default=0.02)
    add("inpaint", cmd_inpaint).add_argument("--rect", action="append", required=True)
    add("trim", cmd_trim).add_argument("--pad", type=float, default=0.02)
    add("resize", cmd_resize).add_argument("--max", type=int, required=True)
    add("crop", cmd_crop).add_argument("--rect", action="append", required=True)
    c = add("clean", cmd_clean)
    c.add_argument("--min-island", type=float, default=0.01)
    c.add_argument("--thresh", type=int, default=120)
    add("chroma", cmd_chroma)
    sh = sub.add_parser("screen-hole")
    sh.add_argument("inp")
    sh.add_argument("--name", required=True)
    sh.add_argument("--json", default="src/art/frames.json")
    sh.set_defaults(fn=cmd_screen_hole)

    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
