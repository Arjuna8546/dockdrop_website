# dockdrop.in

Marketing site for DockDrop, the van-sales app for Kerala distributors. A scroll story in Malayalam (English on a toggle): one working day on paper, then the same day with DockDrop, followed by trust, pricing, FAQ and contact.

Source of truth: [`docs/BUILD_GUIDE.md`](docs/BUILD_GUIDE.md) (read the three design amendments at the top first). Image decisions: [`docs/ART_APPROVALS.md`](docs/ART_APPROVALS.md).

## Run

```bash
npm install
cp .env.example .env      # set VITE_WHATSAPP_NUMBER (and analytics IDs when ready)
npm run dev               # http://localhost:5173  (?lang=en for English)
npm run lint              # zero warnings
npm run build && npm run preview
```

## Images

| Command | What it does |
|---|---|
| `npm run art` | Builds approved `art-src/photos` + `art-src/screens` into `public/art/**` (WebP 1x/2x) and `src/art/manifest.json`. Skips anything not logged as approved. |
| `npm run brand` | Builds the logo, favicons and apple-touch icon from `brand-src/`. |
| `npm run og` | Builds the 1200×630 share image `public/og.png`. |
| `bash scripts/process-photos.sh` | Re-runs the photo clean-up (cut-outs, blurs, sticker edges) from `media-src/originals/` into `art-review/pending/`. Needs the local Python env: `python -m venv .venv-media && .venv-media/Scripts/pip install "rembg[cpu]" opencv-python-headless`. |
| `node scripts/preview.mjs <in.png> <out.png>` | Previews a transparent cut-out on the site's light and dark grounds before approval. |

Never put an image in `art-src/` that isn't logged as approved.

## Environment variables

| Variable | Used for |
|---|---|
| `VITE_WHATSAPP_NUMBER` | Every WhatsApp button and the free-trial button (international format, digits only, e.g. `919400000000`). |
| `VITE_GA_ID`, `VITE_GTM_ID`, `VITE_META_PIXEL_ID` | Optional analytics. Nothing loads while empty. Events: `story_stage_view`, `story_complete`, `skip_story`, `whatsapp_click`, `trial_click`, `language_switch`. |

## Deploy (Cloudflare Pages, free plan)

The site is static (`dist/`), hosted as a Cloudflare **Pages** project named **dockdrop** (`wrangler.jsonc`). Use Pages, not a Worker: a Worker's custom domain needs the domain's DNS on Cloudflare, and dockdrop.in's DNS stays at GoDaddy.

1. **Create the project:** Cloudflare dashboard → Workers & Pages → **Create** → **Pages** tab → **Connect to Git** → pick the repo.
   - Framework preset: Vite. Build command: `npm run build`. Build output directory: `dist`. No deploy command (Pages deploys the output itself).
   - **Environment variables (Production):** `VITE_WHATSAPP_NUMBER` (and analytics IDs later). `.env` is git-ignored, so the build server never sees it; values are baked in at build time, so redeploy after changing them.
   - The first build publishes `https://dockdrop.pages.dev` (or the name Cloudflare assigns if taken).
   - If a **Worker** named dockdrop was created by mistake (its builds fail with "Authentication error [code: 10000]" on `wrangler pages deploy`), delete it: Worker → Settings → Delete.
2. **From this machine instead (optional):** fill `.env`, run `npx wrangler login` once, then `npm run deploy`.
3. **Custom domain** (DNS stays at GoDaddy, the site lives on **www**):
   - Pages project → **Custom domains** → **Set up a custom domain** → `www.dockdrop.in`. Cloudflare shows a CNAME target (`dockdrop.pages.dev`).
   - GoDaddy → dockdrop.in → DNS → **Add record**: type `CNAME`, name `www`, value `dockdrop.pages.dev`, TTL 1 hour. If a `www` record already exists, edit it instead (don't touch `admin` or any other record).
   - Back in Cloudflare, wait until the domain shows **Active** (SSL issued; usually minutes, up to a day).
   - GoDaddy → dockdrop.in → **Forwarding** → forward to `https://www.dockdrop.in`, **Permanent (301)**, "Forward only". Check that `http://dockdrop.in` and `https://dockdrop.in` both land on www.
   - Canonical URLs, sitemap, robots and structured data already point at `https://www.dockdrop.in/`.
4. `public/_headers` sets long-term caching for `/assets/*` and `/art/*` plus basic security headers. Unknown paths fall back to `index.html` (Pages' default for a site without a 404 page).

Before launch, run through Part 4 of the build guide (native Malayalam review of `src/content/copy.js`, real founder photo, Terms page, a real-phone test on mobile data).
