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

## Deploy (Cloudflare Worker with static assets, free plan)

The site is static (`dist/`), served by the Cloudflare Worker **dockdrop-website** (`wrangler.jsonc`: assets from `./dist`, unknown paths fall back to `index.html`, no server code). The Worker's name in the dashboard must match `"name"` in `wrangler.jsonc`.

1. **Cloudflare Git builds** (Worker → Settings → Build): build command `npm run build`, deploy command `npx wrangler deploy` (not `wrangler pages deploy`: the Worker's build token cannot deploy Pages projects).
2. **Build variables** (same page): add `VITE_WHATSAPP_NUMBER` (and analytics IDs later). `.env` is git-ignored, so the build server never sees it; values are baked in at build time, so redeploy after changing them.
3. Every push to the production branch rebuilds and publishes at `https://dockdrop-website.<your-subdomain>.workers.dev`.
4. **From this machine instead (optional):** fill `.env`, `npx wrangler login` once, then `npm run deploy`.
5. **Custom domain:** a Worker's custom domain needs dockdrop.in's DNS on Cloudflare (free plan): Cloudflare → **Add a domain** → dockdrop.in → review the imported DNS records and make sure **every** existing record is there (e.g. `admin`, mail) → change the nameservers at GoDaddy to the two Cloudflare shows → when the zone is Active: Worker → Settings → Domains & Routes → **Add** → Custom domain → `www.dockdrop.in` (and `dockdrop.in`, plus a redirect rule `dockdrop.in/*` → `https://www.dockdrop.in/$1`, 301). A plain GoDaddy CNAME to `workers.dev` does **not** work for Workers.
   - Canonical URLs, sitemap, robots and structured data point at `https://www.dockdrop.in/`.
6. `public/_headers` sets long-term caching for `/assets/*` and `/art/*` plus basic security headers.

Before launch, run through Part 4 of the build guide (native Malayalam review of `src/content/copy.js`, real founder photo, Terms page, a real-phone test on mobile data).
