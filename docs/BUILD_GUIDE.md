# DockDrop Website: Complete Build Guide

**One document to build the entire dockdrop.in website**: the story, the ink-and-wash puppet art, every section's layout and motion, all text, AI image generation with your approval, browser testing, the Claude Code prompts in order, and launch.

This guide **replaces** all earlier files (`DockDrop_Website_ClaudeCode_Prompts.md`, `DockDrop_ART_SPEC_InkWash_Puppet.md`, `AI_DEVELOPMENT_WORKFLOW.md`). Everything is merged here and made consistent.

---

## 0. How to use this guide

Save this file in your project as **`docs/BUILD_GUIDE.md`**. Every Claude Code prompt in Part 3 tells Claude Code to read it.

**Who does what:**
- **Claude Code** builds the site, **generates artwork with the Cloudflare FLUX MCP** (only with your explicit approval of every image), and **tests everything in a real browser with the Playwright MCP**.
- **You** approve or reject every generated image, cut approved characters into puppet parts (or approve Claude Code doing a first pass), set pivots in `/lab`, and review each phase.

**The rules for AI image generation and browser testing are in Part 0.** They apply to every phase.

### Roadmap

| Step | Who | What | Output |
|---|---|---|---|
| 1 | You | Create the project folder, save this file as `docs/BUILD_GUIDE.md`, make sure both MCP servers are connected in Claude Code | repo ready |
| 2 | Claude Code | **Phase 1**: foundation, navigator, placeholder stages (+ Playwright check) | working stepped story with grey boxes |
| 3 | Claude Code → You | **Phase 2**: generate the **style frame** and the **style test set** with FLUX, one asset at a time; you approve each | approved style test art in `art-src/` |
| 4 | You (or Claude Code with your OK) | Remove backgrounds and cut the owner into puppet parts (Part 2.11) | owner parts ready |
| 5 | Claude Code | **Phase 3**: asset script, Puppet system, rig editor, a4 style test (+ Playwright check) | first real scene on screen |
| 6 | You | Check a4 on your phone; set pivots in `/lab`; approve the style | style locked |
| 7 | Claude Code → You | **Phase 4**: generate **all remaining assets** with FLUX, one at a time, with your approval; cutting as in step 4 | full `art-src/` |
| 8 | Claude Code | **Phase 5**: integrate all assets | every component uses real art |
| 9 | Claude Code | **Phase 6**: Part A scenes (a1–a4) | the paper day |
| 10 | Claude Code | **Phase 7**: "Every day", rewind, b1 | the turn |
| 11 | Claude Code | **Phase 8**: Part B scenes (b2–b4) | the DockDrop day |
| 12 | Claude Code | **Phase 9**: trust, pricing, FAQ, CTA, SEO, analytics slots | complete page |
| 13 | Claude Code | **Phase 10**: performance, full Playwright test suite, deploy to Vercel | live on dockdrop.in |
| 14 | You | Launch checklist (Part 4) | launched |

Each phase prompt has **Do not change** rules and a **Confirmation checklist**; Claude Code reports against it, with Playwright evidence (screenshots) where relevant. Review in your own browser and phone too.

---

## Design amendment 1 (2026-10-06): full-screen scenes, caption band, real logo

Decided by the founder after Phase 1. **This section overrides the parts of the guide it names**; everything else stays as written. Where an older section conflicts with this amendment, this amendment wins.

**A. Full-screen scene camera (overrides 4.1, 4.2 scene sizing, 4.4 on phones)**
- Every stage is full-screen. There is no square scene box and no caption column beside the art: the visitor walks *through* the problem and the solution.
- Each stage's art sits on a **scene canvas of 1920×1200 units (16:10)** that always covers the screen: `W = max(100vw, 160svh)`, `H = W / 1.6`, positioned by a **camera focus** `--fx`, `--fy` (0–1), clamped so no edge ever shows. Implemented in `.scene-camera` (`src/styles/index.css`); default focus per stage in `src/content/stages.js`.
- Layers: `sky` stays full-bleed behind the camera; `far`, `mid`, `chars`, `fg`, `fx`, `ui` live inside the camera canvas (`far` and `fg` bleed 4% past its edges). Layer order and `data-layer` names are unchanged (4.3).
- **Coordinates:** the 1200×1200 positions in section 12 are the canvas centre column. **Add 360 to every x** (x 0 → 360, x 1200 → 1560); y is unchanged. Inside the canvas: `left = x / 19.2 %`, `top = y / 12 %`, `width = w / 19.2 %`. The canvas is a CSS size container, so scene UI cards size with `cqw`.
- ~~Camera follows the action on portrait phones~~ **(superseded 2026-10-07):** portrait and square screens (`max-aspect-ratio: 1/1`) show each stage's composed `mobile` window, centred and still; the `pan()` camera tweens were removed. `--fx/--fy` only frame landscape crops.
- **Composition safe zone:** faces, hands, the hero object, speech bubbles and UI cards stay within **y 100–780**. Below y 780 is calm ground, floor or table that can sit under the caption scrim.

**B. Caption band and reading highlight (overrides 6.2 placement and 4.2 caption positions)**
- The caption block sits in a **bottom band** over the scene on every device: 20px side padding on mobile, `6vw` on tablet and desktop, max-width 760px, clear of the progress dots on the right, bottom space for the scroll hint and the safe area.
- **Scrim: replaced (founder, 2026-10-06: no gradient band, "another way but professional").** Each caption sits on a **feathered frosted plate** (`.caption-plate` in `index.css`): the art behind the text only is blurred and tinted with that stage's sky colour, every edge fades out, nothing spans the screen; a faint sky-coloured halo lifts the letters. On portrait the scene canvas also fades out at its bottom edge so pieces never end in a straight cut above the caption. Original rule: a **scrim** gradient covers the bottom ~50% of the screen: `--ledger` (to ~0.82) with paper text on dark stages; `--paper` (to ~0.88) with ledger text on light stages.
- The main caption line uses a **highlight sweep** (`SweepText.jsx`, Motion): words start at 28% opacity and a gradient clipped to the text runs across each word in reading order (~0.05 s per character, the whole line 1.0–1.6 s), starting after the caption enters. Dark stages show a thin `--turmeric` leading edge. Text is split **only at spaces**, so Malayalam conjuncts are never broken. A language change shows the new line fully lit; reduced motion shows it fully lit with no sweep.
- Time label, subline and chips keep their 6.2 / 6.3 behaviour inside the band. **Every stage has a one-line description (subline) under the caption that says what the scene shows (founder, 2026-10-07)**; copy in `copy.js` `stage.<id>.subline` (Malayalam drafts await native review). This supersedes the b1 "other language's line" subline (12.7). Sublines are capped at 52ch; on phones the a1 scroll hint is a single line under it.
- **Caption size (overrides 5.4):** main line **56px desktop / 30px mobile** (Sora: line-height 1.06 / 1.16, tracking −0.025em / −0.015em; Malayalam: line-height 1.3 / 1.38, never letter-spaced), `text-wrap: balance`; sublines `text-wrap: pretty`; time label 14px / 13px with tabular figures.
- **Premium polish (design audit, 2026-10-06):** fixed paper-grain layer (5%, normal blending), stage-name labels on dot hover/focus, chip-row edge fade on mobile, swipe hint on touch devices, header divider and lime-tinted WhatsApp shadow, skip-to-content link.

**C. Logo (overrides the lime "D" in 6.1, 8.3, 12.5 and 15.3)**
- The DockDrop logo is the founder's mark: `brand-src/dockdrop-mark.png` (circle mark, transparent) and `brand-src/dockdrop-icon.png` (square dark tile). `npm run brand` builds `public/brand/mark-{64,128,256}.webp`, the favicons and the apple-touch icon. Use `BrandMark.jsx`; never redraw it.
- Animated uses (the stage `t` logo build, the van emblem) wait for the founder's **SVG** of the same mark. Until then, use the PNG mark (no DrawSVG build).
- The mark is a brand asset supplied by the founder, not FLUX art, so it doesn't go through 0.4. FLUX must never generate or imitate it.

**D. Art production changes (Part 2)**
- Scene backgrounds are composed **full-screen at 16:10**: `office`, `godown`, `pettiKada`, `supermarket`, `bakery` at **3200×2000** (instead of 2400×2400 / 2000×2000). Road strips, skyline and hills keep their wide sizes.
- Add this sentence to every scene and environment prompt (P3 and P8), right after the subject: *"Keep the lower third calm and uncluttered (floor, ground or table surface) for overlaid text; main subject in the upper two-thirds."*
- Characters, hands and props are still generated isolated on plain white (P1–P2, P4–P7) and placed by the scenes.

## Design amendment 2 (2026-10-06): artwork generator

> **Retired 2026-10-07 (founder): FLUX tooling removed.** `scripts/flux.mjs`, `npm run flux`, the `CF_*` env vars and the FLUX prompts are deleted; the site uses only approved photos and real app screenshots (amendment 3). Part 0's FLUX sections and this amendment are kept as history only. The rule that generated art is never used for text, UI, logo, skies or effects still stands for any future art.

Overrides **0.2 (cloudflare-flux row), 0.4 step 2, 0.5 resolution / seed limits and 2.1** where they name `mcp__cloudflare-flux__generate_image`.
- That MCP tool returns images only into the chat (they can't be saved to disk), outputs a fixed 1024×1024 square, and passes no steps or seed, so it can't support the 0.4 workflow or the 16:10 scenes.
- Artwork is generated with **`npm run flux`** (`scripts/flux.mjs`), which calls the same provider (Cloudflare Workers AI, the founder's account, credentials in the git-ignored `.env`) directly and saves every draft to `art-review/pending/<asset-id>-v<N>.<ext>` with a `.json` sidecar (prompt, model, size, steps, seed).
- Default model: **FLUX.2 [dev]** (`@cf/black-forest-labs/flux-2-dev`): sizes 256–1920 per side (scenes at **1920×1200**), seed recorded, and **up to 4 reference images** (each sent under 512×512). Expression heads (P5), hands (P6) and later character assets use the approved master as a reference image instead of relying on seed alone. FLUX.1 Schnell (`--model schnell`, 8 steps) remains available.
- Everything else in Part 0 is unchanged: one asset at a time, up to 3 variations per round, show, ask the exact approval question, wait, and log every decision in `docs/ART_APPROVALS.md`. Art larger than 1920 px is produced later by upscaling or tiling only with the founder's approval.
- The founder must confirm the model licence and Cloudflare terms allow commercial use of the images before launch (2.1).

## Design amendment 3 (2026-10-06): photo collage, real app screens, no generated art

Decided by the founder after the first style frames (realistic AI faces cause trust issues; no cartoon / storybook look), then built under the founder's delegation. **This overrides 7.1–7.3 (art direction), 9 (puppets), 10 (hero object), 12 (stage layouts) and Part 2 (asset production)** where they conflict.

**Look.** The story is a **photo collage**: real, free-licence photos (founder-supplied Unsplash/Pexels) cut out with a white sticker edge and soft shadow, plus tilted photo prints, on the stage's sky colours and paper grain. **No faces in frame.** Generated art (FLUX) is paused; use it only if the founder asks for a specific gap.

**Two sides, one rule kept from the original guide:** the paper day is paper and photographs; DockDrop is **crisp, real UI**: actual app screenshots (owner web app, EN + ML) inside the owner's phone, plus HTML/SVG app cards (van load, receipt, UPI QR, WhatsApp bill, offline pile, credit approval, day-end, dues, Excel). All text is real HTML from `copy.js` except inside screenshots (which swap with the language toggle).

**Assets.** Approved sources live in `art-src/photos/` and `art-src/screens/` (log: `docs/ART_APPROVALS.md`, incl. every edit and source). `npm run art` builds `public/art/**` (WebP 1x/2x) and `src/art/manifest.json`. Photo processing is reproducible: `scripts/process-photos.sh` with `scripts/media.py` (rembg cut-out, sticker edge, blur, inpaint; local only). Screenshots are captured from a local scratch copy of the backend + web app with a privacy pass (phones/GSTINs masked, story names: Sree Durga Spices, driver Sunil). Never from the live server.

**Scene system.** `src/scenes/CollageScene.jsx` (SceneHandle shell) + `PartA.jsx` / `PartB.jsx`. Pieces in `src/components/collage/` (`Photo`, `PhoneShot`, `Paper`, `Gadgets`, `Cards`). Canvas units 1920×1200; key content y 100–780. Each stage: intro + seamless loop (GSAP), chips synced with `loop.call(chip, [...])`, phone camera has a `mobile` portrait composition (no camera pans). Portrait screens use a wider camera (240vw, docked under the header) and scale the story cards 1.35×.

**Phones.** Two phone photos: `b1-hand-phone` (the owner's hand, b1) and `phone-frame` (a bare phone, Pngtree mockup with a footer credit; b2, b4, final CTA). Each phone's screen (box, corner radius, tilt, notch/island strip) is measured by `media.py screen-hole` into `src/art/frames.json`; `PhoneShot` (`frame="hand"|"bare"`) clips screenshots to it. Screenshots are captured at 390×804 so they fit both screens; `npm run art` warns if a screenshot is more than 3% off a screen.

**Portrait composition (2026-10-07).** On portrait and square screens (`max-aspect-ratio: 1/1`, widened from 4/5 in the 2026-10-07 cleanup) each stage is composed for phones instead of panning across the desktop canvas. A scene passes `mobile={{ part: { x, y, w, h?, r?, z? } }}` to `CollageScene`, in units of an 800×1200 window (canvas x 560–1360); `null` leaves a piece out. It is written as a scoped media-query stylesheet that overrides the inline desktop placement, so components need no extra props. The camera stays on that window (no pans) and is sized to fit above the caption band (`--W` in `index.css`, 320 px reserved). Keep the key pieces in window y ≈ 40–880; cards scale 1.35× around their centre, so leave ~70 units from the side edges. Malayalam captions use a fluid size on phones (24–30 px).

**Caption plate timing.** The plate's opacity (`--plate`) is animated by Motion with the caption text (0.45 s delay), and each plate carries its own stage tint, so no frosted patch shows over the previous stage during a transition.

**Shot list (replaces 12.1–12.10 layouts). Founder feedback round 2026-10-06 applied.**
- **a1** bill slip (circled balance draws) + sepia hand writing in the bill book + calculator −2,850 + three WhatsApp messages arriving.
- **a2** yesterday's bill slip (owner flips it) + van being loaded (photo print) + "?" bubbles + clock 6:40 → 7:40.
- **a3** the van drives in on the road; at **each of two shops** (the petti kada, then a fruit and vegetable shop) the bill is written by hand and the pink carbon copy tears off and goes; the van leaves.
- **a4** night: a sepia pile of old slips under the bill book; bill book riffled again and again, calculator counts to −2,850, slips, clock 8:15 → 9:40 → 11:40.
- **t** tear-off calendar pages fly (5 → 10), clock 11:40, the owner with his head in his hands (no face) and a folder stuffed with slips; subline spells out the nightly routine; then the DockDrop logo glows. (Thumbs up/down removed by the founder.)
- **b1** the owner's hand reaches in from the **bottom-right corner** with the **real dashboard** on the phone + Today's vans / Yesterday's collection / Shops with dues cards in the upper middle.
- **b2** van loading from above + Van Load card (rows tick, "1 left" caught, "All loaded") + delivery challan + real Assign Driver screen on the bare phone.
- **b3** the **shop ledger** (founder: "track each shop's credit balance with past orders, receipts, returns, nothing missed"): the badged van arrives at the shop, Joseph Stores' ledger opens (credit ₹2,850 of ₹10,000) and fills in beat by beat (chips: credit & limit, past orders + printed receipt, receipts + UPI scan → paid, returns, works offline → "Nothing missed"). Caption "Every shop's credit, orders, receipts and returns. Nothing gets missed.", subline "Billing still works without network."
- **b4** real money and reports screens (cross-fade) + day-end card + dues card (2 need attention) + Excel; the bare phone bottom-right (no van); clock-compare strip (11:40 PM vs 7:05 PM).

**Dropped from the original plan:** full-body puppet rigs, the `/lab` rig editor, the travelling hero object and the rewind special effect (t → b1 uses the standard transition). Driver-app screenshots (the web app blocks driver login; the Flutter app needs an unlocked phone): the b3 driver moments and the shop ledger are HTML cards instead. **Final CTA:** the van is replaced by the bare phone; when it scrolls into view it plays the app's own animated splash (`AppSplash.jsx`, the founder's splash artwork and timeline, 0.65× the app's 6.7 s), then fades to the real b1 dashboard (amended 2026-10-07); heading "Try DockDrop free in your business" (the seller uses the app; no van sticker).

---

# PART 0: AI TOOLS AND APPROVAL WORKFLOW

These rules apply to **every** Claude Code session and phase.

## 0.1 Precedence

1. **Part 1 (Specification) decides what to build**: story, layout, motion, copy, art direction, asset list, and which elements must be HTML / CSS / SVG.
2. **Part 0 (this part) decides how tools are used**: image generation, approvals and browser testing.
3. If anything conflicts, or a task isn't covered, **Claude Code stops and asks**. No guessing.

## 0.2 Available MCP servers

| Server | Tool | Full tool name | Purpose |
|---|---|---|---|
| `cloudflare-flux` | `generate_image` | `mcp__cloudflare-flux__generate_image` | Generates artwork with Cloudflare Workers AI **FLUX.1 Schnell** |
| Playwright MCP | its browser tools | `mcp__playwright__*` (use the names the server exposes) | Opens the site in a real browser to interact, test and verify |

If either server is missing in a session, Claude Code says so and stops that part of the work. It never substitutes another image source and never skips testing silently.

## 0.3 When FLUX may be used

**Only when artwork or illustration is required**: an asset listed in Part 2 (characters, hands, props, environments, textures, optional hero illustrations).

**Never for anything this guide says must be HTML, CSS or SVG** (section 8.3), including:
- any text or numbers: bill book writing, carbon slips, phone screen UI, receipts, calendar dates, calculator display, captions, labels
- clock hands
- chips, callouts, buttons, QR codes, signal bars, speech / "?" / approval bubbles, cloud tick, dues meter fill
- rain, sparkles, glows, lamp light, headlight beams, VHS lines, shadows
- the lime "D" emblem and the DockDrop logo
- skies and gradients, icons, any UI element

If it's unclear whether something is artwork or UI, ask before generating.

## 0.4 Approval workflow (mandatory, one asset at a time)

**Step 1: Identify the asset.** Before generating, state: the asset id and file name from Part 2 (e.g. `props/calculator/body`), where it's used, the full prompt, and the size.

**Step 2: Generate.** Call `mcp__cloudflare-flux__generate_image`. Up to **3 variations** of the same asset per round.

**Step 3: Show.** Show the image(s) in the conversation with prompt, size and seed (if returned). Pending images may be written **only** to `art-review/pending/<asset-id>-v<N>.<ext>` (git-ignored, never imported, referenced or copied into the website).

**Step 4: Ask.** Exactly: **"Do you approve `<asset-id>` (variation N) for the website? Reply approve, or tell me what to change."**

**Step 5: Wait. Never assume approval.**
- Approved **only** when the user clearly says so for that specific asset ("approve", "approved", "yes, use v2").
- **Not approval:** silence, "nice", "ok", "continue", "looks good so far", approving a different asset, or a general "go ahead" with the phase. Ambiguous reply → ask again.
- Never batch-approve on the user's behalf. A batch counts only if the user lists the asset ids.
- Never generate an asset that depends on an unapproved one (e.g. no hands before the character is approved).

**Step 6a: Approved.** Move the chosen file to `art-src/<path>.png` (section 8.1), delete the other variations, log it in `docs/ART_APPROVALS.md` (0.6). Only now may it be used in the website.

**Step 6b: Rejected.** Ask what needs to change (if not said), adjust the prompt, regenerate, repeat from Step 3. Delete rejected files; log the reason.

**Never:** save, import or reference an unapproved image in `src/`, `public/` or `art-src/`; replace an approved asset without approval of the replacement; edit, recolour or crop an approved asset without saying so first.

## 0.5 Consistency with FLUX.1 Schnell

- **Every prompt starts with P1 (master style prompt, Part 2.3)**, then the subject from Part 2, then **P2-inline** (Part 2.4). Schnell does **not** support negative prompts, so negatives are written as plain instructions inside the prompt.
- **Reuse approved wording.** Before each generation, read `docs/ART_APPROVALS.md` and copy the exact style sentences, colour hex values and character descriptions from approved prompts.
- **Fix a seed per character** once approved (if the tool supports seeds) and reuse it for that character's related assets.
- **Self-check before showing:** same line style, palette (5.2), light from the top-left, three-quarter view facing right for characters, plain white background, no fake letters. If a result clearly fails, regenerate before asking.
- **Known limits (tell the user when they apply, don't work around them silently):**
  - **No image reference, inpainting or editing.** Expression heads (P5) and hands (P6) can't be guaranteed to match the approved character. Try this first: same seed, same prompt, change only the expression / pose words; show the result **side by side with the approved master**. If it doesn't match, stop and ask the user how to proceed (e.g. the user edits the face in another tool and drops the file in `art-src/`).
  - **Resolution.** Output may be smaller than Part 2's sizes (characters 1536 px tall, backgrounds 3200 px wide). Report the actual output size before generating; for wide backgrounds, ask whether to generate in sections or accept a smaller size.
  - **No transparency.** Background removal and cutting into puppet parts (Part 2.11) are separate steps. **Ask before doing either.** If approved, Claude Code may remove plain white backgrounds with a local tool, keeping soft wash edges, and show the result for approval before saving to `art-src/`.
  - **Fake lettering** often appears on objects: reject it yourself and regenerate.

## 0.6 Approval log (`docs/ART_APPROVALS.md`)

Created on first use; one row per decision:

| Date | Asset id | File | Variation | Prompt (full) | Size | Seed | Decision | Notes / reason |
|---|---|---|---|---|---|---|---|---|

Every session reads it before generating, to stay consistent and to avoid regenerating approved assets.

## 0.7 Playwright: browser testing

Used whenever browser-level verification helps, and **always before a phase checklist is reported as done**. Runs against the local dev server (`npm run dev`) or a Vercel preview URL the user provides.

| Area | What to verify |
|---|---|
| Stepped navigation | Wheel, ArrowDown/Up, PageDown, Home/End, touch swipe (mobile emulation): one gesture = one stage; queued gestures never skip stages |
| Progress dots | Each dot opens the right stage and caption |
| Rewind | `t` → `b1` by scroll and by button; reverse `b1` → `t` |
| Leaving / re-entering | From `b4` scroll into the page; scroll back to the top → story resumes at `b4` |
| Skip story | Scrolls to `#trust` on desktop and mobile |
| Language | Opens in Malayalam; toggle to English and walk every stage and section: no Malayalam left (bill book page excepted); toggle back; `?lang=en` works; choice persists after reload |
| Responsive | 360×740, 390×844, 412×915, 844×390, 768×1024, 1280×800, 1440×900, 1920×1080: no horizontal scroll; layout per 4.2 |
| Images | Every `<img>` loads (no 404s, `naturalWidth > 0`), right 1x/2x served, **no unapproved image referenced** (every art path appears in `ART_APPROVALS.md`) |
| Animations | Each stage's intro and loop run; only the active stage animates |
| Reduced motion | Emulate `prefers-reduced-motion: reduce`: static scrolling page with all captions |
| Links | WhatsApp `href` has the env number and the message in the active language (check the `href`; never open WhatsApp) |
| Console / network | No console errors, no failed requests |
| Accessibility basics | Visible keyboard focus; dots and toggle have accessible names |

**Reporting:** screenshots of each touched stage at **390×844** and **1440×900** (plus any failing view) saved to `test-artifacts/<phase>/` (git-ignored) and shown to the user; each check reported pass / fail; failures fixed and re-run.

**Limits:** only `localhost` or preview URLs from the user; never submit real forms, send messages or click through to external services; Playwright never replaces the user's approval of artwork.

## 0.8 Session start checklist

1. Read `docs/BUILD_GUIDE.md` (this file) and `docs/ART_APPROVALS.md` (if it exists).
2. Confirm which MCP servers are available.
3. Confirm the current phase and what the user asked for.
4. Don't generate images or change the website until asked.

---

# PART 1: SPECIFICATION

## 1. Overview

DockDrop is a van-sales app for small wholesale distributors in Kerala (1–3 vans). The site tells **one working day of a distributor, twice**:

- **Part A: the paper day.** The bill book is the main character. Loading from old bills, billing shop by shop by hand, a long night where money and stock never match.
- **Part B: the same day with DockDrop.** Same people, same places, same clock, but the bill book has become the DockDrop app on a phone, and everything adds up.

**Look:** hand-drawn ink-and-wash illustration (editorial storybook quality) in the DockDrop palette. Characters are **puppets**: one drawing cut into parts that rotate at the joints. **The world is hand-drawn; the app is crisp and digital.** Every time DockDrop appears, its clean UI stands out.

**Interaction:** a **stepped story**. One scroll, swipe or arrow key moves to the next section. Each section plays an intro, then **loops automatically**, so the visitor sees the whole idea without scrolling inside the section. After the story, the page scrolls normally through trust, pricing, FAQ and contact.

**Text:** one short Malayalam line per section (English through a toggle), plus feature chips in Part B. Works equally well on **desktop and mobile**.

## 2. Stack and library ownership

- **Vite + React 18 + JavaScript** (`.jsx` for components, `.js` for logic, ES modules) **+ Tailwind CSS v3**
- **ESLint** with `eslint-plugin-react` and `eslint-plugin-react-hooks` (zero warnings); object shapes (scene handles, rigs, copy entries) documented with **JSDoc** comments
- **GSAP 3.13+** with `@gsap/react` (`useGSAP`). Plugins (all free): `ScrollTrigger`, `Observer`, `ScrollToPlugin`, `MotionPathPlugin`, `DrawSVGPlugin`, `CustomEase`
- **Motion** (Framer Motion, package `motion`, import from `motion/react`)
- **sharp** (dev dependency, asset script)
- No Lenis, no router library (a tiny path switch for `/lab`)
- Fonts (Google Fonts): **Sora** 600/700, **Inter** 400/500/600, **Noto Sans Malayalam** 500/600/700, **Kalam** 400 (handwriting on the bill book)
- Hosting: ~~Vercel~~ **Cloudflare, free plan (founder, 2026-10-07)**: the Worker `dockdrop-website` serving static assets (`wrangler.jsonc` → `dist/`, SPA fallback, `public/_headers`), built from Git (`npm run build`, then `npx wrangler deploy`; `VITE_*` as build variables). Domain dockdrop.in (registered at GoDaddy); the site is served on **www.dockdrop.in** and canonical URLs use www. A Worker custom domain needs the DNS on Cloudflare (see README). Where later checklists say Vercel / `vercel.json`, read Cloudflare / `_headers`.

**Ownership rule: two libraries never animate the same element.**

| GSAP owns | Motion owns |
|---|---|
| Stage navigation and transitions | Header, buttons, language toggle |
| Every scene timeline (intro, loop) | Caption and chip enter/exit (`AnimatePresence`) |
| Puppet joints and all illustrated parts | Phone **screen UI** cards |
| Hero object flights | Post-story sections (`whileInView`), FAQ accordion |
| Parallax layers, pointer parallax | Hover / tap micro-interactions |

All GSAP code lives inside `useGSAP` or `gsap.context()` and is cleaned up. Plugins are registered once in `src/lib/gsap.js`.

## 3. Interaction model (stepped story)

### 3.1 Stages

| # | id | Name | Clock | Sky preset | Grade |
|---|---|---|---|---|---|
| 0 | `a1` | Bill book (hero) | 10:30 PM | `night` | A-night |
| 1 | `a2` | Loading, paper way | 6:30 → 7:40 AM | `morningDull` | A |
| 2 | `a3` | Route, paper way | morning → evening | animated | A |
| 3 | `a4` | Night settlement, paper way | 7:00 → 11:40 PM | `night` | A-night |
| 4 | `t` | Every day | 11:40 PM | `night` | A-night |
| 5 | `b1` | Phone (hero) | 6:30 AM | `morning` | B |
| 6 | `b2` | Loading, DockDrop way | 6:30 → 6:45 AM | `morning` | B |
| 7 | `b3` | Route, DockDrop way | morning → late afternoon | animated | B |
| 8 | `b4` | Settlement, DockDrop way | 7:00 → 7:05 PM | `evening` | B |

The `t` → `b1` move uses the special **Rewind** (12.6), not the standard transition.

### 3.2 Navigation

- The story is a full-screen **theatre** (`height: 100svh`) at the top of the document. All stages stack inside it; only the active one is visible.
- While the theatre is active, a GSAP `Observer` (`type: 'wheel,touch,pointer'`, `tolerance: 40`, `preventDefault: true`) captures gestures:
  - down / swipe up / ArrowDown / PageDown / Space → next stage
  - up / swipe down / ArrowUp / PageUp → previous stage
- **Input lock** during a transition. One gesture = one stage. A gesture during a transition is queued (max 1) and runs when the lock releases.
- **Standard transition:** 0.9 s, `power3.inOut` (3.3).
- **Leaving the story:** on `b4`, a down gesture disables the Observer and glides the window to the first post-story section (`ScrollToPlugin`, 0.8 s); normal scrolling from there.
- **Coming back:** when the window is at `scrollY <= 0` and the user scrolls up, re-enable the Observer at `b4` (`ScrollTrigger` `onEnterBack` on the theatre).
- **Progress dots** jump to any stage (0.6 s crossfade when jumping more than one stage).
- **"Skip story"** in the header jumps to the post-story sections.
- **Keyboard:** arrows, PageUp/PageDown, Home (stage 0), End (stage 8). Visible focus.
- `html` gets `overflow: hidden; overscroll-behavior: none` while the theatre is active; released when leaving.
- Only the **active** stage runs its loop. All loops pause on `visibilitychange` (tab hidden).
- **Images gate transitions:** the next stage's images must be decoded before its transition runs (15.1). While waiting (rare), the current loop keeps playing.

### 3.3 Standard transition (parallax)

Going **down** from N to N+1:
- Stage N layers move **up and fade** at different speeds: `far` `yPercent: -8`, `mid` `-18`, `chars` `-26`, `fg` `-40`, opacity → 0. Caption and chips exit (Motion, `y: -16, opacity: 0`, 0.3 s).
- Stage N+1 layers enter **from below** (`far 8`, `mid 18`, `chars 26`, `fg 40` → 0) with 0.08 s stagger back to front.
- Sky gradient crossfades; the stage grade crossfades (A ↔ B only happens at the rewind).
- The **hero object** flies between anchors in the same 0.9 s (section 10).
- Going **up** mirrors it.

### 3.4 Reduced motion

With `prefers-reduced-motion: reduce`: no Observer, no lock. The story renders as a normal vertical page; each stage is a static full-height panel showing its **key frame** (section 12), caption and chips. No loops, parallax, flights or idle puppet motion. Motion reveals become 0.2 s opacity fades.

## 4. Layout system

### 4.1 Scene square + wide layers

- Each stage's main composition sits in a **square scene box** with a 1200×1200 coordinate system. Positions in section 12 use these units (x from left, y from top). Implement the box as a `position: relative` container with `aspect-ratio: 1`; place images and overlays inside with percentage positions (`left: x/12 %`, `top: y/12 %`, `width: w/12 %`).
- Full-bleed layers (`sky`, `far`, `fg`) sit behind and in front of the square and cover the whole screen (`object-fit: cover`, anchored bottom-centre).

### 4.2 Breakpoints

| Breakpoint | Layout |
|---|---|
| **Mobile** `< 768px` portrait | Header 56px. Scene square at top: `size = min(100vw, 100svh − 56px − 230px)`, centred. Caption block below the square, 20px side padding. Chips: one horizontally scrollable row. Dots: vertical, right edge, 6px, 10px gap. |
| **Tablet** `768–1023px` | Square `min(80vw, 100svh − 64px − 240px)`, centred. Caption below, max-width 640px, centred. |
| **Desktop** `≥ 1024px` | Header 64px. Square `min(86svh, 62vw)`, vertically centred, right edge at `4vw`. Caption block left: `left: 6vw`, bottom `16svh`, `max-width: 32vw`. Dots: vertical, right edge, centred. |
| **Short landscape phones** (height `< 500px`) | Desktop layout with square `min(78svh, 50vw)`, mobile caption sizes. |

`100svh` with `100vh` fallback, `env(safe-area-inset-*)` respected, tap targets ≥ 44px, never horizontal page scroll.

### 4.3 Layer order inside every stage

1. `sky` (CSS gradient + paper texture)
2. `far` (wide image: hills, skyline)
3. `mid` (square: buildings, godown, shop, office wall)
4. `chars` (square: puppets, van, props)
5. `fg` (wide image: foreground palms, table edge)
6. `fx` (square: rain, glows, lamp light, headlight beams)
7. `ui` (HTML: floating app cards, callouts, bubbles)

Each wrapper has `data-layer="sky|far|mid|chars|fg|fx|ui"`. Each stage is wrapped in a `StageGrade` container (7.3).

### 4.4 Pointer parallax and drift

Desktop: on `pointermove`, offset layers by pointer position (−1…1) with `gsap.quickTo` (0.6 s, `power3.out`): `far` ±6px, `mid` ±10px, `chars` ±14px, `fg` ±24px. Touch devices and reduced motion: off. Mobile instead: slow ambient drift (`fg` ±6px, 7 s sine).

## 5. Design tokens

### 5.1 UI colours (CSS variables + Tailwind theme)

```
--ledger:   #15160E   main dark, night, text on light
--turmeric: #CFEA3E   lime accent, "good" moments, DockDrop
--chilli:   #C1440E   warnings, dues, paper-day tension
--paper:    #E9EEEA   light background
--ink-2:    #3A3D30   secondary dark
--mute:     #6B6F60   muted text
--white:    #FFFFFF
--whatsapp: #25D366   WhatsApp icon only
```

### 5.2 Art palette (used by the illustrations; see 7)

| Role | Colour |
|---|---|
| Ink lines, darkest shadows | `#15160E` |
| Art paper / highlights | `#F1EDE3` |
| Sepia light / mid / dark | `#C9A97A` / `#9A7550` / `#5E4430` |
| Olive wash | `#5B6B3A` / `#3E4A28` |
| Laterite / terracotta | `#A4553A` / `#B5532F` |
| Skin tones | `#8D5A3B` · `#A86E4B` · `#7A4B30` |
| Cloth white | `#F4F1E6` |
| Lime accent (Part B layers only) | `#CFEA3E` |
| Chilli (dues, red circles) | `#C1440E` |

### 5.3 Sky presets (top → bottom)

```
night:        #0E0F0A → #1E2116
morningDull:  #D9DFCF → #EEF0E8
morning:      #DCEFD0 → #F6F8F1
afternoon:    #F3E6B8 → #EEF1E6
evening:      #EBA56C → #7A4E5E
dusk:         #2B2D4A → #15160E
```

A watercolour paper texture (`/art/texture/paper.webp`, tiled, `mix-blend-mode: multiply`, 35%) sits over every sky.

### 5.4 Typography

| Role | Font | Desktop | Mobile |
|---|---|---|---|
| Caption (ML) | Noto Sans Malayalam 700 | 44px / 1.35 | 28px / 1.4 |
| Caption (EN) | Sora 700 | 44px / 1.15 | 28px / 1.2 |
| Subline | Inter 500 / Noto Sans Malayalam 500 | 18px | 15px |
| Time label | Sora 600, uppercase, 0.08em tracking | 13px | 12px |
| Chips | Inter 600 / Noto Sans Malayalam 600 | 14px | 13px |
| Post-story H2 | Sora 700 / Noto Sans Malayalam 700 | 40px | 28px |
| Body | Inter 400 / Noto Sans Malayalam 500 | 17px / 1.6 | 16px / 1.6 |
| Bill book handwriting | Kalam 400 | in overlay | in overlay |

Malayalam text gets `lang="ml"`. Never letter-space Malayalam.

### 5.5 Shape and motion tokens

- Radius: cards 20px, chips 999px, buttons 14px
- UI shadow: `0 12px 32px rgba(21,22,14,0.18)`
- Contact shadow under puppets and props: blurred ellipse, `#15160E` at 18%
- Durations: `fast 0.25s`, `base 0.5s`, `transition 0.9s`, `rewind 2.0s`
- Eases: `power3.inOut` (transitions), `power2.out` (enters), `back.out(1.6)` (UI pops), `back.out(1.2)` (puppet limbs), `sine.inOut` (idle), `CustomEase "settle"` = `M0,0 C0.2,0 0.2,1.15 0.45,1.05 0.7,0.97 0.85,1 1,1` (landings)

## 6. Global UI

### 6.1 Header (fixed, above the theatre)

- Left: DockDrop logo (lime "D" with black outline + "DockDrop", Sora 700). Wordmark `--paper` on dark stages, `--ledger` on light (0.3 s crossfade).
- Right: **language toggle** `മല | EN` (pill, active side `--turmeric`), **"Skip story"** (text link on desktop, labelled icon button on mobile), **WhatsApp** pill button (`--turmeric` bg, `--ledger` text, WhatsApp icon).
- 64px desktop / 56px mobile, transparent, no border.

### 6.2 Caption block

- Optional **time label**, **main line**, optional **subline**, and (Part B) **feature chips**. Copy in section 14.
- Enter: Motion `y: 24 → 0, opacity 0 → 1`, 0.5 s, starting 0.35 s into the stage transition; children stagger 0.08 s.
- Colour: `--paper` on `night` / `dusk` / `evening` skies, `--ledger` otherwise.

### 6.3 Feature chips (Part B)

- Pill, 1px border `currentColor` at 25%, transparent, small lime dot.
- **Active chip** (synced to what the scene shows now): `--turmeric` bg, `--ledger` text, dot becomes a tick. Scenes call `setActiveChip(id)` from timeline labels.
- Mobile: one scrollable row; the active chip scrolls into view (`scrollIntoView({ inline: 'center', behavior: 'smooth' })`).

### 6.4 Progress dots

9 dots with a thin divider after `t`. Inactive 6px at 35% opacity; active 6×22px `--turmeric` pill; visited Part A dots tinted `--chilli`. Each is a focusable button with `aria-label`.

### 6.5 Language switch (Malayalam default, everything in English on demand)

- **Default: Malayalam.** First visit always opens in Malayalam (unless `?lang=en` is in the URL).
- **One toggle switches the entire site to English**, instantly: captions, sublines, time labels, chips, buttons, header links, scroll hint, phone screens, callouts, chat notifications, receipt, tags, bubbles, the clock-compare strip, calendar month, Van Load rows, dues list, post-story sections, FAQ, footer, WhatsApp prefilled messages, `aria-label`s, SR descriptions, the live-region announcements, and the page `<title>` / meta description. **No Malayalam remains in English mode.**
- **Only exception: the paper bill book page is English in both modes** (that's how real bill books are written).
- Switching back to Malayalam restores everything.
- **Mechanics:** a `LanguageProvider` (React context) exposes `lang` and `t(key)`. Every string comes from `copy.js` as `{ ml, en }`. Changing language crossfades visible text (opacity 0 → 1, 0.2 s, Motion) without restarting the current stage's animation.
- **Persistence:** saved in `localStorage` (try/catch). `?lang=en` / `?lang=ml` in the URL overrides it (useful for sharing an English link). `<html lang>` updates to `ml` or `en`.
- **Fonts:** Malayalam mode uses Noto Sans Malayalam for Malayalam strings; English mode uses Sora / Inter. Font size scales in 5.4 apply per language.
- **Toggle UI:** pill `മല | EN` in the header (6.1), `aria-label="Language: Malayalam / English"`, `aria-pressed` on the active side.

### 6.6 Scroll hint (`a1` only)

Finger/mouse icon + "താഴേക്ക് സ്ക്രോൾ ചെയ്യൂ" / "Scroll", bobbing y ±6px (1.4 s sine), hidden after the first navigation.

## 7. Art direction

### 7.1 Style

- **Ink linework** in `#15160E`, confident, slightly varied weight, light cross-hatching in shadows. No thick cartoon outlines.
- **Watercolour washes**, translucent, with pigment blooms and uneven edges. Highlights are bare paper.
- **Paper grain** visible under washes.
- **Realistic, dignified proportions**, warm and calm. Never caricatured.
- **Light always from the top-left.**
- Detail: high on faces, hands, bill book, phone, van; medium on clothing; looser and paler on backgrounds.
- **Kerala trade life**: tile-roofed small shops, laterite walls, coconut palms, banana bunches, steel tea glasses, tube lights, ceiling fans, mundu, sandals. No houseboats, Kathakali, temples or elephants.

### 7.2 Characters face sideways only

Every character is drawn once in a **three-quarter view facing right**. Facing left = `scaleX(-1)`. No back or front views; walk-outs happen sideways through the office side door.

### 7.3 Part A vs Part B (grading and accents)

- All art is produced **once**, in the neutral art palette (5.2).
- `StageGrade` wraps each stage:
  - **A** (Part A day): `filter: sepia(0.3) saturate(0.82) brightness(0.93)` on the stage container + kraft overlay (`#C9A97A`, `multiply`, 16%).
  - **A-night**: A + ink overlay (`#15160E`, `multiply`, 45%) + warm lamp glow (radial gradient from the light source, `screen`).
  - **B** (Part B): no filter, no overlay; **lime accent layers on**.
- **Accent layers** are mask images (`accent-*.webp`) placed exactly over an area and tinted `#CFEA3E` (`mask-image` + background colour, `mix-blend-mode: multiply`, 85%). Used for: the van cab, the phone screen glow spill, tick highlights.
- **The van:** Part A = the distributor's plain van (sage-grey cab, no emblem). Part B = `accent-cab` and the "D" emblem badge on. Same van, now with DockDrop.
- If the CSS grade drops FPS on low-end phones, use the asset script's baked grades (8.4 `--bake-grade`) and swap `src` instead of filtering.

## 8. Asset system

### 8.1 Folders and naming

```
art-src/                         your cleaned, aligned, full-canvas PNG exports (not shipped)
  characters/<id>/               head-neutral.png, head-tired.png, head-confused.png, head-smile.png,
                                 eyes-closed.png, torso.png, upperArmL.png, forearmL.png,
                                 upperArmR.png, forearmR.png, legs.png, footL.png, footR.png
  hands/<skin>/                  open-R.png, hold-R.png, phone-R.png, point-R.png, cash-R.png, pen-R.png, pat-R.png
  props/<id>/                    parts per Part 2.9
  env/<id>/                      layers per Part 2.10
  texture/paper.png
public/art/                      generated by the script: trimmed WebP at 1x and 2x
src/art/rigs/<id>.json           generated positions + your pivots and anchors
src/art/manifest.json            generated: every asset, sizes, stages using it
```

File names are **exactly** the part ids used by rigs and timelines. Never rename a part once timelines use it. Left-hand files are produced by the script by mirroring `*-R.png` (no need to export `-L`).

### 8.2 Export rules (approved art only, after background removal and cutting)

- Only assets approved under Part 0.4 and logged in `docs/ART_APPROVALS.md` go into `art-src/`.
- Every part of one character / prop exported **on the same full canvas, aligned** (the script trims and stores offsets).
- PNG-24 with transparency, soft wash edges kept.
- Characters: figure height ≈ **1200 px**. Props: long side ≈ **1000 px**. Backgrounds: sizes in Part 2.10.
- Accent masks: the area in solid black on transparent.

### 8.3 What is never generated (built as HTML / SVG)

| Item | Built as |
|---|---|
| Bill book writing, carbon slip writing | HTML text over the blank page image (Inter + Kalam), copy 14.4 |
| Phone screen UI (all screens) | HTML inside the transparent screen area of `phone/frame` |
| Receipt strip | HTML, copy 14.5 (follows the language) |
| Calendar dates | HTML over `calendar/page` |
| Clock hands | SVG over `wallClock/face` |
| Calculator display | HTML over the display area |
| Chips, callouts, buttons, QR, signal bars, "?" bubble, approval bubble, cloud tick, dues meter fill | HTML/SVG, clean brand UI style |
| Rain, sparkles, glows, lamp light, headlight beams, VHS lines | CSS / SVG |
| Lime "D" emblem on the van | SVG ink-wash badge (rough-edge `feTurbulence` + `feDisplacementMap`) |
| Skies | CSS gradients + paper texture |

### 8.4 Asset script (`scripts/build-art.mjs`, `npm run art`)

- Reads every PNG in `art-src/**`.
- Trims transparency; records offset (x, y) and size.
- Writes `public/art/<path>.webp` at 2x (source) and `<path>@1x.webp` at half size (quality 82, alpha quality 90).
- Mirrors `hands/*/*-R.png` into `*-L` files.
- Converts `accent-*.png` into single-channel masks.
- Creates or updates `src/art/rigs/<id>.json` for every folder under `characters/` (and props with moving parts), **preserving pivots and anchors already set**.
- Writes `src/art/manifest.json` (paths, sizes, stage usage, used for preloading).
- `--bake-grade`: also writes `*.a.webp` copies with the Part A grade baked in.
- Prints a per-stage size report and warns when a stage exceeds its budget (15.1).

## 9. Puppet system

### 9.1 Parts

| Part id | Contains | Pivot | Parent |
|---|---|---|---|
| `torso` | neck, chest, clothing down to the knees (full-body characters) | waist centre | — (root) |
| `head` (variants `neutral` / `tired` / `confused` / `smile`) | head, hair, face | base of the neck | torso |
| `eyesClosed` | closed-eyes overlay | — | head |
| `upperArmL` / `upperArmR` | shoulder to elbow incl. sleeve | shoulder | torso |
| `forearmL` / `forearmR` | elbow to wrist | elbow | upperArm |
| `handL` / `handR` (variants by pose) | hand | wrist | forearm |
| `legs` | lower legs + feet (full-body characters) | knee line centre | torso |
| `footL` / `footR` | driver only (walking): shin + foot | knee | torso |

Facing right, `R` is the near (front) arm. Back-to-front order: `upperArmL, forearmL, handL, legs/feet, torso, head, eyesClosed, upperArmR, forearmR, handR`.

### 9.2 Rig JSON (`src/art/rigs/<id>.json`)

```json
{
  "id": "owner",
  "canvas": [800, 1400],
  "parts": [
    { "id": "torso", "parent": null, "src": "characters/owner/torso", "x": 210, "y": 330, "w": 380, "h": 900, "pivot": [190, 620], "z": 40 },
    { "id": "head", "parent": "torso",
      "variants": { "neutral": "characters/owner/head-neutral", "tired": "characters/owner/head-tired",
                    "confused": "characters/owner/head-confused", "smile": "characters/owner/head-smile" },
      "x": 300, "y": 90, "w": 220, "h": 280, "pivot": [110, 262], "z": 50 },
    { "id": "eyesClosed", "parent": "head", "src": "characters/owner/eyes-closed", "x": 330, "y": 190, "w": 120, "h": 40, "pivot": [60, 20], "z": 51 },
    { "id": "upperArmR", "parent": "torso", "src": "characters/owner/upperArmR", "x": 430, "y": 360, "w": 120, "h": 300, "pivot": [60, 30], "z": 60 },
    { "id": "forearmR", "parent": "upperArmR", "src": "characters/owner/forearmR", "x": 440, "y": 620, "w": 100, "h": 260, "pivot": [50, 20], "z": 61 },
    { "id": "handR", "parent": "forearmR",
      "variants": { "open": "hands/skin1/open-R", "hold": "hands/skin1/hold-R", "phone": "hands/skin1/phone-R",
                    "point": "hands/skin1/point-R", "pat": "hands/skin1/pat-R" },
      "x": 440, "y": 850, "w": 120, "h": 150, "pivot": [50, 12], "z": 62 }
  ],
  "anchors": { "handR-hold": { "part": "handR", "x": 70, "y": 80 } }
}
```

`x, y` = trimmed part position in the character canvas. `pivot` = rotation point relative to the part's own top-left. `parent` makes children follow (rotating `upperArmR` carries `forearmR` and `handR`). `anchors` are attach points (local to a part) for the hero object and props.

### 9.3 `Puppet` component (`src/art/Puppet.jsx`)

- Props: `rig`, `expression`, `hands` (`{ L?: pose; R?: pose }`), `mirror?`, `idle?` (default true), `className`, `ref`.
- Renders nested absolutely positioned `<div>`s following `parent`. Each `<img>`: `srcset` 1x/2x WebP, explicit `width`/`height`, `decoding="async"`, `draggable={false}`, `alt=""`.
- Each part div: `data-part="<id>"`, `transform-origin` from its pivot, so timelines use `q('[data-part="upperArmR"]')`.
- Expression / hand-pose changes **crossfade** variants (opacity, 0.2 s). All variants stay mounted (opacity 0), so there's no flash.
- **Idle** (pauses automatically when the stage is inactive): breathing (torso `scaleY 1 → 1.012`, 3.2 s sine), blink (`eyesClosed` 0 → 1 → 0 in 0.12 s, random every 3–6 s), head sway (±1.2°, 4 s sine). Scene timelines may pause idle for specific beats.
- Exposes `getAnchorRect(name)` and `root` (for timelines).
- Scales to its container width, preserving the rig canvas ratio. Adds a contact shadow ellipse under the feet (full-body) when `shadow` prop is true.

### 9.4 Motion guide

| Joint | Range |
|---|---|
| head | −10° … +12° (look down at book / up at a person; add 2px x shift) |
| upperArm | −70° … +40° |
| forearm | −100° … +10° |
| hand | −25° … +25° |
| torso | −4° … +4° |
| legs / feet | −12° … +12° |

- **Puppet feel:** limbs start slightly late and finish with a small overshoot (`back.out(1.2)`); landings use `settle`. Avoid linear motion.
- Motion helpers in `src/art/motions.js`, each returning a timeline for a puppet root:
  - `walk(puppet, { distance, steps })`: torso bob `y ±6px` per step (0.35 s), feet ±10°, lean 2°; mundu characters: bob + small `legs` sway while the whole puppet slides.
  - `shrug(puppet)`: both upperArms −12°, torso `y −8px`, head 6°, hold 0.4 s, release.
  - `rubForehead(puppet)`: upperArmL −55°, forearmL −95°, handL `open` to the head, head −6°.
  - `pat(puppet)`: upperArmR −35°, forearmR −40°, handR `pat`, two pats ±4°.
  - `tap(puppet)`: handR `point`, forearm 3° dips, 0.15 s each.
  - `carry(puppet)`: both arms forward/up (upperArms −40°, forearms −60°), hands `hold`.
  - `lookAt(puppet, direction)`: head turn ±10° with 2px x shift.
  - `handOver(puppet)`: upperArmR −45°, forearmR −20°, hold, return.

### 9.5 Rig editor (`/lab`, development only, not linked)

- Pick a rig; character shown large with part outlines.
- Click a part, drag its pivot crosshair; numeric pivot inputs.
- Joint sliders limited to the ranges in 9.4, to check overlaps.
- Expression and hand-pose dropdowns.
- Buttons for every motion helper.
- "Download JSON" (you commit it to `src/art/rigs/`).
- A second tab: gallery of every asset, plus Part A vs Part B grading side by side.

## 10. Hero object system

The **bill book** (Part A) and the **phone** (Part B) travel between stages as one continuous object.

- `HeroObject` lives in a fixed overlay above all stages (`position: fixed; inset: 0; pointer-events: none`). It renders the bill book (image layers + HTML writing) or the phone (frame image + HTML screen).
- Stages declare **anchors**: invisible elements with `data-anchor="<name>"` (position, size, `data-rotate`), or a puppet anchor via `getAnchorRect`.
- On stage change, the hero object tweens from the current anchor rect to the next (`x, y, width, height, rotation`) over the transition (0.9 s, `power3.inOut`), along a slight arc (MotionPath midpoint 60px above the straight line), landing with a 3–6° wobble (`settle`).
- **Handoff:** when the object must move *with* a character during a loop, the hero object lands, then hides, and an in-scene copy attached to the puppet's hand becomes visible (swap in one frame). Reverse on exit.
- Recompute anchor rects on resize / orientation change (debounced 150 ms).
- Bill book image states: `open-base` + `page` (a1), `closed-thin` (a2), thin → thick with `teaStain`, `slips`, `rubberBand` overlays toggled per shop (a3), `closed-thick` + all overlays (a4, t).

| Stage | Anchor | Object |
|---|---|---|
| a1 | `a1-table` (centre, large, rotate −3°) | open bill book, top-down |
| a2 | owner `handR-hold` | closed thin (in-scene copy flips pages) |
| a3 | driver `handR-hold` | handoff to in-scene copy |
| a4 | `a4-table` | closed thick, messy |
| t | `t-table` | closed thick, next to the phone |
| b1 | `b1-hold` (large, centre) | phone |
| b2 | owner `handR-hold` | phone |
| b3 | driver `handR-hold` | phone (handoff) |
| b4 | owner `handR-hold` | phone |

**Book → phone (rewind only):** the book folds (`scaleY 1 → 0.08` with skewX 6°, 0.4 s), a lime flash (radial `--turmeric`, 0.15 s), the phone unfolds at the same spot (`scaleX 0.08 → 1`, 0.4 s), then flies to `b1-hold`.

## 11. Scene contract

Each stage lives in `src/scenes/<Id>Scene.jsx` and exposes:

```js
/**
 * @typedef {Object} SceneHandle
 * @property {gsap.core.Timeline} intro   plays once on enter (after the transition)
 * @property {gsap.core.Timeline} loop    repeat: -1, starts after intro; paused when inactive
 * @property {() => void} keyFrame        static key-frame state (reduced motion, previews, dot jumps)
 * @property {() => void} reset           back to pre-intro state
 * @property {string[]} assets            manifest keys this stage needs (for preloading)
 */
```

- Built with `useGSAP` scoped to the scene root, exposed via `forwardRef` + `useImperativeHandle`.
- Timeline **labels** match the beat names in section 12; chip changes via `.call(() => setActiveChip('upi'), [], 's2-upi')`.
- `useStageNavigator` owns: index, lock, queue, Observer, preload/decode gate, `reset → transition → intro → loop`, pausing others.
- Loops are **seamless** (last frame = first frame), using explicit reset tweens at the end.
- Shared layouts (godown, office, road) live in `src/scenes/shared/` so Part A and Part B use identical positions.

## 12. Stage specifications

Positions in scene-square units (1200×1200). **Key frame** = the static frame for reduced motion and previews. Puppets: `owner`, `driver`, `shopOld`, `shopWoman`, `shopYoung`. Motions refer to 9.4.

### 12.1 `a1`: Bill book (hero) · 10:30 PM · A-night

- **Feeling:** "That's my book."
- **Layout:** top-down. `mid`: `tabletop` image filling the square. Bill book hero (open, about 640 wide, −3°) centre. `steelGlass` (180, 200). `calculator` (960, 230), display `-2,850`. `phone/frame` (1010, 720) face up, dark screen. Two loose slips (260, 880) and (840, 960). `fx`: ceiling-fan shadow (soft blurred 3-blade shape, 10% black, 900 wide) centred; cool tube-light highlight at the top.
- **Bill book writing:** HTML overlay (14.4). Balance box circled in `--chilli` (SVG path, DrawSVG).
- **Intro (1.2 s):** table fades up; book drops from y −60, scale 1.05 → 1 (`settle`); props stagger in (0.06 s); fan shadow starts rotating.
- **Loop (7 s):**
  - continuous: fan shadow 360° / 4 s linear; slips rotate ±3° (2.5 s sine)
  - 0.0 `flip1`: the `page` image turns over the top binding (`scaleY 1 → −1`, skewX 4°, origin top), revealing the next bill (second HTML page)
  - 1.2 `circle`: red circle draws (0.8 s)
  - 2.4 `buzz1`: phone vibrates (x ±3px × 6, 0.4 s), screen lights, chat banner 1 slides down (14.6)
  - 3.6 `buzz2`, 4.8 `buzz3`: banners stack
  - 5.0: tube-light glow flickers (1 → 0.6 → 1, 0.15 s)
  - 6.2 `reset`: banners fade, phone dims, page flips back, circle fades
- **Key frame:** book open with red circle, three banners on the phone.
- **Caption:** `10:30 PM` · **ഇത് നിങ്ങളുടെ ബിൽ ബുക്ക് അല്ലേ?** · scroll hint.
- **Exit:** book closes (0.3 s, swap `open-base` → `closed-thin`), hero flight to owner `handR-hold`.
- **SR text:** "A paper bill book open on an office table at night, with handwritten bills, a red circled balance, a calculator showing minus 2,850, and a phone receiving messages."

### 12.2 `a2`: Loading, paper way · 6:30 → 7:40 AM · A

- **Feeling:** guesswork; something slips away unnoticed.
- **Layout (shared `GodownLayout`):** `far`: `hillsWide`. `mid`: godown layers x 40–560, y 260–1000 (`wall`, `shutterRoll`, `interior`, `stacksBack`); `wallClock` above the shutter (300, 300). `chars`: `owner` puppet at (520, 560–1000) facing right, hands `{ R: 'hold' }`; `driver` puppet near the godown door (380, 560–1000); van (plain, no accent) x 700–1180, y 640–1000, mirrored to face left, `cargoDoor` open, a few `box` images inside; `sacksFront` layer in front of the stack (so a box can hide behind it). `fg`: `roadPalms` slice at both edges.
- **Intro (1.2 s):** standard; clock sweeps 6:30 → 6:40.
- **Loop (8 s):**
  - 0.0 `ownerFlips`: owner `lookAt(down)`, expression `tired`; in-scene book flips 2 pages
  - 1.4 `carry`: driver `carry` with a `box`, `walk` to the van's door along a MotionPath (1.8 s), places it; van stack grows by one
  - 3.4 `slip`: **while the driver faces the van, one box on the godown stack slides off and slips behind `sacksFront`** (x +40, y +30), a tiny `--chilli` glint (0.2 s). Visible to the viewer; characters don't react.
  - 4.6 `confused`: driver walks back, expression `confused`, "?" bubble pops (`back.out(1.6)`), scratch head (upperArmR −60°, forearmR −80°)
  - 6.0 `ownerFlipsAgain`: owner flips again; clock +20 min
  - 7.4 `reset`: bubble fades, slipped box crossfades back; clock caps at 7:40 then only ticks
- **Key frame:** box half hidden behind sacks, "?" over the driver, owner reading the book, clock 7:10.
- **Caption:** `6:30 AM · ലോഡിങ്` · **ഇന്നലത്തെ ബില്ല് നോക്കി ഇന്നത്തെ ലോഡ്.**
- **SR text:** "At the godown, the owner checks old bills to decide the load while the driver carries boxes to the van. One box slips behind the sacks and nobody notices."

### 12.3 `a3`: Route, paper way · morning → evening · A

- **Feeling:** the same routine again and again; the book gets worse.
- **Layout (shared `RoadSystem`):** `sky` animated `morningDull` → `afternoon` → `evening`. `far`: `roadClouds`, `roadHills`, `roadFields`. `mid`: `road` strip y 860–1000. `chars`: van (plain) at (360–820, 640–960) facing right, driver's head visible in the cab. `fg`: `roadPalms`. Shops slide in from the right on the `mid` layer.
- **Driving:** tiled strips animated with `x` + `modifiers` wrap; speeds per second: clouds 20px, hills 60px, fields 160px, road 320px, palms 520px. Master `drive` timeline; its `timeScale` tweens to 0 (stop, 0.8 s `power2.out`) and back to 1 (go, 0.8 s `power2.in`). `wheel` rotates with speed; van body bobs ±2px.
- **Loop (15 s, 3 shops × 5 s):** per shop:
  - `arrive`: drive stops; shop (`pettiKada`, then `supermarket`, then `bakery`) slides from x 1400 to 780; shopkeeper puppet stands between `shop` and `counterFront`
  - `search`: driver puppet appears beside the van, `walk` to the cargo, cargo door rummage shake (0.5 s), takes a packet
  - `write`: driver at the counter; in-scene book open; handwritten line draws in the HTML page (SVG squiggle, 0.6 s)
  - `tear`: pink slip separates (rotate 6°, x +30) and passes to the shopkeeper (`handOver`)
  - `pay`: shopkeeper `handOver` with `cash` hand; driver scribbles the balance (`--chilli` squiggle)
  - `leave`: driver back to the cab; shop slides out left; drive resumes
  - book overlays after each shop: shop 1 → `teaStain`; shop 2 → + `slips`; shop 3 → `closed-thick` + `rubberBand`
  - sky advances one preset per shop
  - `reset`: soft fade of `chars` (0.4 s) while sky and book reset
- **Hero:** flies from owner (a2) to driver `handR-hold`, then handoff.
- **Key frame:** van stopped at the petti kada, driver writing, shopkeeper holding a pink slip.
- **Caption:** `8:00 AM → 6:00 PM · റൂട്ട്` · **ഓരോ കടയിലും ഇതേ കഥ.**
- **SR text:** "The driver visits three shops. At each one he searches the van, writes a bill by hand, tears off the carbon copy and notes the credit. The bill book gets thicker and messier as the day turns to evening."

### 12.4 `a4`: Night settlement, paper way · 7:00 → 11:40 PM · A-night

- **Feeling:** tired and lost. **Not angry.** No blaming.
- **Layout (shared `OfficeLayout`):** `office/wall`, `door` on the left (x 40–220, doorway transparent → night), `windowFrame` right (sky shows through). `wallClock` (620, 230) with SVG hands, `calendar` (820, 250) with HTML date, `tubeLight` (620, 110) + CSS glow, `ceilingFan` top-centre (hub + 3 rotated `blade`s). `table` front edge y 700–820, x 260–1000; `chair` behind. `owner` puppet seated behind the table (legs hidden by the table), centre (620, 470–820). `driver` puppet standing right (930, 520–1000). On the table: bill book hero `a4-table` (560, 740); `cash` + coins (820, 750); `calculator` (380, 750).
- **Intro (1.6 s):** headlight beams sweep across the doorway (CSS, 0.6 s); driver `walk`s in from the left; hero book flies from driver `handR-hold` to `a4-table`, lands with `settle` + 4° wobble; `cash` drops onto the table; clock 7:00.
- **Loop (6 s):**
  - 0.0 `riffle`: owner hands to the book; 5 quick page flips (0.08 s each) back to page 1
  - 0.8 `calc`: owner `tap` on the calculator; display counts up then shows `-2,850` in `--chilli`
  - 2.2 `look`: owner `lookAt(right)`, expression `confused`; driver `shrug`, expression `confused`
  - 3.4 `riffleAgain`: owner `rubForehead`, expression `tired`, then riffles back to page 1
  - continuous: fan blades rotate; slips flutter; tube light flickers at 4.5 s
  - clock jumps per loop: 8:15 → 9:40 → 11:40, then holds at 11:40 (second hand ticks)
- **Key frame:** owner rubbing his forehead over the open book, calculator `-2,850`, driver shrugging, clock 11:40.
- **Caption:** `11:40 PM` · **ആര് എത്ര തരാനുണ്ട്?**
- **SR text:** "Late at night the owner adds up the bill book again and again. The cash doesn't match. The driver doesn't know either. The clock reaches 11:40."

### 12.5 `t`: Every day · 11:40 PM · A-night

- **Feeling:** weary repetition, then a spark.
- **Layout:** closer framing of the office wall: `calendar` large (360, 330), `wallClock` (760, 300). Behind them, the owner puppet at 35% opacity with 4px blur repeating a slower riffle. Table edge at the bottom with the bill book (`t-table`, 420, 960).
- **Sequence (auto, then idle):**
  - 0.0–2.4 `days`: 6 calendar `page`s tear off (rotate 25°, fly up-left, fade), accelerating 0.5 → 0.25 s; HTML date 5 → 10
  - 2.6 `phoneIn`: phone slides onto the table next to the book (x 1400 → 760, 0.7 s `power3.out`), dark screen
  - 3.4 `logo`: screen lights; lime "D" logo builds (DrawSVG outline then `--turmeric` fill, 0.8 s); lime glow spreads on the table (radial, 0 → 0.5)
  - 4.4 `cta`: rewind button pops in
  - idle (4 s): logo glow pulses; background owner keeps riffling
- **Key frame:** calendar mid-tear, phone with glowing logo, button visible.
- **Caption:** **എല്ലാ ദിവസവും.**
- **Button:** **ഇതേ ദിവസം DockDrop-ൽ കാണാം**: `--turmeric` pill, `--ledger` text, arrow-down icon, lime ring pulse (scale 1 → 1.08, opacity 0.6 → 0, 1.6 s). Click = next stage.
- **SR text:** "Calendar pages tear away, showing this happens every day. A phone appears next to the bill book with the DockDrop logo."

### 12.6 Rewind: `t` → `b1` (2.0 s, input locked)

- 0.00–1.40 s: clock hands spin **backwards** (minute −1440°, hour −120°), landing on 6:30.
- 0.00–1.00 s: torn calendar pages fly back on (reversed tear tweens).
- 0.20–1.40 s: sky `night` → `dusk` → `morning`; `StageGrade` crossfades **A-night → B** (filter and overlays to zero); tube-light glow off; daylight in the window.
- 0.40–1.20 s: **book → phone** (fold, lime flash, unfold, section 10).
- 0.20–1.20 s: background owner silhouette fades out.
- Effect: 3 thin `--turmeric` horizontal lines sweep down the screen (0.12 s each, staggered) + 2% horizontal jitter for 0.4 s. Subtle.
- 1.40–2.00 s: `b1` layers enter (standard, shortened to 0.6 s); phone flies to `b1-hold`.
- Back up from `b1` → `t`: reverse at 1.6× speed.

### 12.7 `b1`: Phone (hero) · 6:30 AM · B

- **Feeling:** fresh start, clarity.
- **Layout (`OfficeLayout`, daylight, tidy: no slips, no cash):** `owner` puppet centre-left (430, 420–1000), expression `smile`, hands `{ R: 'phone' }`; phone hero at `b1-hold` (about (640, 560), 300 wide). Window shows `morning` + `townSkyline`. Clock 6:30.
- **Phone screen (`PhoneScreen` home):** Motion stagger (0.08 s): header "DockDrop" + avatar; card "ഇന്നത്തെ വാൻ · 1"; card "ഇന്നലത്തെ കളക്ഷൻ · ₹18,400"; card "കടം ഉള്ള കടകൾ · 5" with a `--chilli` dot. Screen `--paper`, text `--ledger`, accents `--turmeric`.
- **Loop (5 s):** phone floats (y ±6px sine); cards shimmer once in sequence; puppet idle (blink, breathe).
- **Key frame:** owner holding the phone, home screen visible.
- **Caption:** inline logo (32px) + **ഓരോ വാനും ഓരോ കടയും ഓരോ രൂപയും, ഒരൊറ്റ ആപ്പിൽ.** · subline *One desk for every van, every shop, every rupee.* (EN mode swaps them.)
- **SR text:** "Morning. The owner holds the DockDrop app on his phone, showing today's van, yesterday's collection and shops with dues."

### 12.8 `b2`: Loading, DockDrop way · 6:30 → 6:45 AM · B

- **Feeling:** smooth, satisfying, nothing lost.
- **Layout:** **`GodownLayout` exactly as a2**, grade B, `morning` sky; van with `accent-cab` and emblem; owner hands `{ R: 'phone' }`. `ui`: **Van Load card** (HTML, 300px desktop / 240px mobile) beside the van at about (760, 300): title "വാൻ ലോഡ്", 5 rows with empty check circles: മഞ്ഞൾപ്പൊടി 1kg ×10 · മുളകുപൊടി 500g ×12 · മല്ലിപ്പൊടി 500g ×10 · ഗരം മസാല 100g ×10 · സാമ്പാർ പൊടി 200g ×8 (EN: Turmeric 1kg, Chilli 500g, Coriander 500g, Garam Masala 100g, Sambar Powder 200g).
- **Chips:** `vanLoad` · `stockList` · `challan`
- **Loop (9 s):**
  - 0.0 `tap` (chip `vanLoad`): owner `tap`; tap ripple on the phone; card pops in
  - 0.6–3.6 `load` (chip `stockList`): rows 1–3: a `box` / `sack` flies godown → van along an arc (0.7 s), lands (`settle`), row ticks `--turmeric`
  - 3.8 `catch`: **the same box as a2 starts slipping behind `sacksFront`**; row 4 glows `--chilli` "1 ബാക്കി"; driver `lookAt`, `walk`s over, `carry`, loads it (1.4 s); row 4 ticks
  - 5.6: row 5 loads; card shows "എല്ലാം ലോഡ് ആയി ✓"
  - 6.4 `challan` (chip `challan`): `challan` image slides out of the phone, folds (scaleY 1 → 0.5), flies to the van dashboard, tucks in
  - 7.4 `ready`: van bounces once, headlights blink twice (CSS glow); clock 6:45
  - 8.4 `reset`: soft fade; items back; clock 6:30
- **Key frame:** card fully ticked, challan on the dashboard, clock 6:45.
- **Caption:** `6:30 AM · ലോഡിങ്` · **കയറ്റുമ്പോൾ തന്നെ കണക്ക്.**
- **SR text:** "The owner loads the van from the app. Each item ticks off. The box that went missing before is caught and loaded. A delivery challan is created automatically. The van leaves at 6:45."

### 12.9 `b3`: Route, DockDrop way · morning → late afternoon · B

- **Feeling:** quick, friendly, reliable, even in the hills.
- **Layout:** **`RoadSystem` exactly as a3**, grade B; van with accent + emblem. Sky `morning` → `afternoon` → `afternoon` blended 15% toward `evening` (never full evening). Driver hands `{ R: 'phone' }` (handoff). `ui`: phone **callout card** (HTML, 260px desktop / 200px mobile) near the driver.
- **Chips:** `print` · `cash` · `whatsapp` · `upi` · `returns` · `offline` · `credit`
- **Loop (18 s, 3 shops × 6 s):**
  - **Shop 1, petti kada (`shopOld`)**
    - `s1-order`: callout: 3 items with prices, total ₹1,240; driver `tap`
    - `s1-print` (chip `print`): driver hand pose switches to holding the `printer`; HTML receipt strip feeds out (height 0 → 220, 1 s) with the receipt in the active language (14.5; Malayalam by default); shopkeeper takes it
    - `s1-cash` (chip `cash`): shopkeeper `handOver` with `cash`; callout "₹50 തിരികെ കൊടുക്കുക"; a `coin` flips from driver to shopkeeper
  - **Shop 2, supermarket (`shopWoman`)**
    - `s2-wa` (chip `whatsapp`): chat bubble with PDF icon (WhatsApp icon in `--whatsapp`) arcs from the driver's phone to the shopkeeper's (her hand pose `phone`), which glows
    - `s2-upi` (chip `upi`): callout shows a QR (SVG) with "₹2,140" filled in; her phone scans (lime scan line); big `--turmeric` tick; "പണം ലഭിച്ചു ✓"
    - `s2-return` (chip `returns`): she hands back a crushed `packet`; driver `tap`; a `--chilli` tag "കേടായത്" attaches (HTML/SVG); packet flies into a separate corner of the van
  - **Shop 3, hill bakery (`shopYoung`)**
    - road tilt: `roadHills` +80px up, `roadFields` rotate 4°; `bakery/mistHills` fade in; rain in `fx` (60 thin diagonal lines desktop / 30 mobile, `--paper` 40%)
    - `s3-offline` (chip `offline`): signal-bars badge above the van drops 4 → 0, turns `--chilli`; driver keeps `tap`ping; lime bill cards stack in a "saved" pile, count 1 → 3, "സേവ് ചെയ്തു"
    - `s3-credit` (chip `credit`): dues meter (HTML/SVG) beside the bakery fills to the limit line, turns `--chilli`; callout "ക്രെഡിറ്റ് ലിമിറ്റ് കഴിഞ്ഞു"; inset bubble top-right (owner head image + phone) "അംഗീകരിക്കണോ?" → owner taps → "അംഗീകരിച്ചു ✓"; meter calms
    - `s3-sync`: rain stops; bars refill to `--turmeric`; saved pile flies into a cloud (ink-wash cloud image + SVG tick), each card once
  - `reset`: soft fade of `chars` and `ui`, sky back to morning
- **Key frame:** shop 2 with the UPI callout and tick; chips `whatsapp` + `upi` active.
- **Caption:** `ഇന്ന് · റൂട്ട്` · **നെറ്റ്‌വർക്ക് ഇല്ലെങ്കിലും ബിൽ.** · subline **പ്രിന്റ് ചെയ്യാം, WhatsApp-ൽ അയക്കാം.**
- **SR text:** "At three shops the driver bills from the app: a Malayalam receipt is printed, a bill is sent on WhatsApp, a customer pays by UPI with the amount already filled in, a damaged packet is returned, billing continues with no network in the hills, and the owner approves an order over the credit limit from his phone."
- **Never** a map, GPS dot or live tracking.

### 12.10 `b4`: Settlement, DockDrop way · 7:00 → 7:05 PM · B

- **Feeling:** relief; everything adds up; home on time.
- **Layout:** **`OfficeLayout` exactly as a4**, grade B with warm evening light (window `evening`, warm lamp glow instead of cold tube light), tidy table (no bill book, no slips). Owner standing behind the table, hands `{ R: 'phone' }`.
- **Chips:** `dayEnd` · `dues` · `profit` · `reports`
- **Loop (12 s):**
  - 0.0 `arrive`: headlight beams in the doorway; driver `walk`s in with `cash` hand; clock 7:00
  - 1.2 `expected` (chip `dayEnd`): phone screen "ഇന്നത്തെ കണക്ക്": expected ₹18,400 · collected ₹18,400 ✓ · stock back ✓ · returns 1
  - 2.0 `handover`: driver `handOver` cash to owner
  - 2.6 `scale`: `scale` image pops above the table (pans: small `box` + tagged `packet` left, `cash` right); `beam` wobbles 8° → −6° → 3° → 0 (`settle`, 1.4 s), pans counter-rotate to stay level; soft lime glow
  - 4.4 `dues` (chip `dues`): screen slides to the dues list (5 shops, 2 marked `--chilli` "ശ്രദ്ധ വേണം"); desktop also shows a larger floating `ui` card; mobile scales the phone 1.2×
  - 6.0 `profit` (chip `profit`): profit card (7 bars, last bar `--turmeric`)
  - 7.2 `reports` (chip `reports`): spreadsheet icon flies out and expands into a mini cell grid, then shrinks back
  - 8.4 `home`: owner `pat`s the driver; both expression `smile`; both `walk` out through the door (mirrored, facing left)
  - 10.0 `lightsOff`: room dims (`--ledger` overlay 0 → 0.55, 0.6 s); clock **7:05**; warm glow stays in the window
  - 11.2 `reset`: lights on, characters back (soft fade)
- **Key frame:** scale level, phone on the dues list, both smiling, clock 7:05.
- **Caption:** `7:05 PM` · **ഡേ-എൻഡ് 2 മിനിറ്റിൽ.** · subline **ഓരോ കടയുടെയും കടം ഒറ്റനോട്ടത്തിൽ.**
- **Clock compare strip** under the caption: two mini SVG clocks: `--chilli` "ബിൽ ബുക്ക് · 11:40 PM" and `--turmeric` "DockDrop · 7:05 PM". No other claim.
- **SR text:** "In the evening the driver hands over the cash. The app shows the expected amount, and it matches. The owner checks every shop's dues and the day's profit, and both go home at 7:05."

## 13. Post-story sections (normal scrolling)

Background `--paper` with the paper texture at 20%, text `--ledger`. Calm: no parallax, no loops. Motion `whileInView` reveals (`y: 24 → 0, opacity 0 → 1`, 0.5 s, `viewport: { once: true, amount: 0.3 }`). Max width 1120px, side padding 24px (mobile 20px), section spacing 120px / 80px.

1. **Trust** (`#trust`): H2 **നിങ്ങൾക്ക് വിശ്വസിക്കാം** / *Why you can trust DockDrop*. Optional `handshake` illustration as the section header (full width, max 900px). Four cards (2×2 desktop, stacked mobile), icon = simple line icon in `--turmeric` on a `--ledger` circle:
   - **തൃശൂരിൽ നിർമ്മിച്ചത്** / *Made in Thrissur*: founder photo (`/founder.jpg`, 20px radius), "Arjun · Founder", WhatsApp button
   - **നിങ്ങളുടെ ഡാറ്റ നിങ്ങളുടേത്** / *Your data is yours*: stored in India, daily backups, download everything any time
   - **മലയാളത്തിൽ തന്നെ** / *Fully in Malayalam*: image of a real Malayalam receipt (`/receipt-ml.png`)
   - **ആദ്യ ഉപഭോക്താവ്** / *Our first customer*: "A spice distributor in Thrissur uses DockDrop every day." (no face)
2. **Pricing** (`#pricing`): H2 **ഒരു വില, മുഴുവൻ ബിസിനസിനും** / *One price for your whole business*. Cards: Monthly ₹349 · 6 months ₹1,799 · **Yearly ₹3,199** (highlighted: `--ledger` card, `--turmeric` badge "ഏറ്റവും ലാഭം" / "Best value"). Line below: "3 വാൻ വരെ · ആളെണ്ണം നോക്കി വിലയില്ല · സെറ്റപ്പ് സൗജന്യം · എപ്പോൾ വേണമെങ്കിലും നിർത്താം" / "Up to 3 vans · not charged per person · free setup · cancel any time". Button: free trial.
3. **FAQ** (`#faq`): H2 **സാധാരണ ചോദ്യങ്ങൾ** / *Common questions*. Accordion (Motion height animation, one open at a time, `aria-expanded`, `aria-controls`). Content 14.8. FAQPage JSON-LD (in the active language).
4. **Final CTA** (`#contact`): full-width `--ledger` band with the `ctaScene` illustration (or the van image under palms) on the right. H2 **DockDrop നിങ്ങളുടെ ബിസിനസ്സിൽ സൗജന്യമായി പരീക്ഷിക്കൂ** / *Try DockDrop free in your business* (amended 2026-10-06; phone with the DockDrop splash instead of the van). Buttons: WhatsApp (primary `--turmeric`) and "Free trial" (outline `--paper`). Line: **₹349/മാസം · തൃശൂരിൽ നിർമ്മിച്ചത്**.
5. **Footer:** logo, © 2026 DockDrop, links: Privacy, Terms, Login (admin.dockdrop.in), WhatsApp. `--mute` text.

**WhatsApp links:** `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=` + encoded message ("Hi, I'd like to try DockDrop" / "ഹായ്, DockDrop പരീക്ഷിക്കണം"). Never hard-code the number.

**Free trial:** until self-signup exists, "Free trial" opens WhatsApp with the message "I'd like a free trial of DockDrop" (ML: "DockDrop സൗജന്യ ട്രയൽ വേണം"). Keep it behind one `startTrial()` function so a form can replace it later.

## 14. Copy (all strings in `src/content/copy.js` with `ml` and `en`)

### 14.1 UI

| key | ml | en |
|---|---|---|
| scrollHint | താഴേക്ക് സ്ക്രോൾ ചെയ്യൂ | Scroll |
| skip | കഥ ഒഴിവാക്കുക | Skip the story |
| whatsapp | WhatsApp | WhatsApp |
| freeTrial | സൗജന്യമായി പരീക്ഷിക്കാം | Start free trial |
| rewindBtn | ഇതേ ദിവസം DockDrop-ൽ കാണാം | See the same day with DockDrop |

### 14.2 Stage captions

| stage | time label | ml | en | subline |
|---|---|---|---|---|
| a1 | 10:30 PM | ഇത് നിങ്ങളുടെ ബിൽ ബുക്ക് അല്ലേ? | Isn't this your bill book? | — |
| a2 | 6:30 AM · ലോഡിങ് / Loading | ഇന്നലത്തെ ബില്ല് നോക്കി ഇന്നത്തെ ലോഡ്. | Today's load, by looking at yesterday's bill. | — |
| a3 | 8:00 AM → 6:00 PM · റൂട്ട് / Route | ഓരോ കടയിലും ഇതേ കഥ. | The same story at every shop. | — |
| a4 | 11:40 PM | ആര് എത്ര തരാനുണ്ട്? | Who owes how much? | — |
| t | — | എല്ലാ ദിവസവും. | Every day. | ബിൽ ബുക്ക്, കാൽക്കുലേറ്റർ, ഫോൺ വിളികൾ, ഒത്തുവരാത്ത പണം. എല്ലാ രാത്രിയും ഇതുതന്നെ. / Bill book, calculator, phone calls, cash that doesn't match. The same, every night. (added 2026-10-06) |
| b1 | 6:30 AM | ഓരോ വാനും ഓരോ കടയും ഓരോ രൂപയും, ഒരൊറ്റ ആപ്പിൽ. | One desk for every van, every shop, every rupee. | the other language's line |
| b2 | 6:30 AM · ലോഡിങ് / Loading | കയറ്റുമ്പോൾ തന്നെ കണക്ക്. | The count is right while loading. | — |
| b3 | ഇന്ന് · റൂട്ട് / Today · Route | ഓരോ കടയുടെയും കടം, ഓർഡർ, രസീത്, റിട്ടേൺ. ഒന്നും വിട്ടുപോകില്ല. | Every shop's credit, orders, receipts and returns. Nothing gets missed. | നെറ്റ്‌വർക്ക് ഇല്ലെങ്കിലും ബില്ലിംഗ് നടക്കും. / Billing still works without network. (amended 2026-10-06) |
| b4 | 7:05 PM | ഡേ-എൻഡ് 2 മിനിറ്റിൽ. | Day-end in 2 minutes. | ഓരോ കടയുടെയും കടം ഒറ്റനോട്ടത്തിൽ. / Every shop's dues at a glance. |

### 14.3 Chips

| id | ml | en |
|---|---|---|
| vanLoad | വാൻ ലോഡ് | Van load |
| stockList | സ്റ്റോക്ക് ലിസ്റ്റ് | Stock list |
| challan | ഡെലിവറി ചലാൻ | Delivery challan |
| print | മലയാളം ബിൽ പ്രിന്റ് | Print in Malayalam or English |
| cash | ബാക്കി കണക്ക് | Change calculator |
| whatsapp | WhatsApp ബിൽ | WhatsApp bill |
| upi | UPI QR | UPI QR |
| returns | റിട്ടേൺ | Returns |
| offline | നെറ്റ് ഇല്ലെങ്കിലും | Works offline |
| credit | ക്രെഡിറ്റ് ലിമിറ്റ് | Credit limit |
| dayEnd | ഡേ-എൻഡ് ചെക്ക് | Day-end check |
| dues | കട ബാക്കി | Shop dues |
| profit | ലാഭം | Profit |
| reports | 17 റിപ്പോർട്ടുകൾ (Excel) | 17 reports (Excel) |

### 14.4 Bill book page (always English)

```
SREE DURGA SPICES & DISTRIBUTORS
Market Road, Thrissur · Ph: 94xx xxx xxx
CREDIT BILL                       No. 0347
Date: 04/10/2026
To: Joseph Stores, Ollur
Sl  Item                    Qty  Rate  Amount
1   Turmeric Powder 1kg     10   180   1,800
2   Chilli Powder 500g      12   135   1,620
3   Coriander Powder 500g   10    95     950
4   Garam Masala 100g       10    48     480
                              TOTAL    4,850
                              PAID     2,000
                              BALANCE  2,850   (red circle)
```

Printed parts (header, column titles, TOTAL / PAID / BALANCE) in Inter; handwritten parts (names, quantities, amounts) in Kalam, each line rotated ±1°. Business names are fictional. Second page (revealed by the flip): same layout, No. 0346, "To: Raju Bakery", items Sambar Powder 200g ×8 @ 55 = 440 and Turmeric 1kg ×4 @ 180 = 720, TOTAL 1,160, PAID 0, BALANCE 1,160.

### 14.5 Receipt (b3, shop 1): Malayalam / English

```
ശ്രീ ദുർഗ സ്പൈസസ്
തൃശൂർ
ബിൽ നം. 0348 · 05/10/2026
മഞ്ഞൾപ്പൊടി 1kg   ×4   ₹720
മുളകുപൊടി 500g    ×2   ₹270
മല്ലിപ്പൊടി 500g    ×2   ₹190
ഗരം മസാല 100g     ×1    ₹60
ആകെ               ₹1,240
നന്ദി!
```

English mode:

```
SREE DURGA SPICES
Thrissur
Bill No. 0348 · 05/10/2026
Turmeric Powder 1kg   ×4   ₹720
Chilli Powder 500g    ×2   ₹270
Coriander Powder 500g ×2   ₹190
Garam Masala 100g     ×1    ₹60
Total                 ₹1,240
Thank you!
```

### 14.6 Phone notifications (a1)

| from (ml) | message (ml) | from (en) | message (en) |
|---|---|---|---|
| ഡ്രൈവർ സുനിൽ | ചേട്ടാ, ഇന്നത്തെ കളക്ഷൻ ₹18,400. ബാക്കി നാളെ തരാം. | Driver Sunil | Chetta, today's collection is ₹18,400. I'll give the rest tomorrow. |
| ഷാജി ട്രേഡേഴ്സ് | കഴിഞ്ഞ മാസത്തെ ബിൽ ഞാൻ അടച്ചതാണല്ലോ? | Shaji Traders | I already paid last month's bill, didn't I? |
| ജോസഫ് സ്റ്റോർസ് | ബിൽ കോപ്പി ഒന്ന് അയച്ചു തരാമോ? | Joseph Stores | Can you send me the bill copy? |

### 14.7 In-scene UI strings (phone screens, callouts, bubbles, tags)

| key | ml | en |
|---|---|---|
| home.todayVan | ഇന്നത്തെ വാൻ · 1 | Today's vans · 1 |
| home.yesterday | ഇന്നലത്തെ കളക്ഷൻ · ₹18,400 | Yesterday's collection · ₹18,400 |
| home.duesShops | കടം ഉള്ള കടകൾ · 5 | Shops with dues · 5 |
| vanLoad.title | വാൻ ലോഡ് | Van load |
| vanLoad.row1 | മഞ്ഞൾപ്പൊടി 1kg ×10 | Turmeric Powder 1kg ×10 |
| vanLoad.row2 | മുളകുപൊടി 500g ×12 | Chilli Powder 500g ×12 |
| vanLoad.row3 | മല്ലിപ്പൊടി 500g ×10 | Coriander Powder 500g ×10 |
| vanLoad.row4 | ഗരം മസാല 100g ×10 | Garam Masala 100g ×10 |
| vanLoad.row5 | സാമ്പാർ പൊടി 200g ×8 | Sambar Powder 200g ×8 |
| vanLoad.left | 1 ബാക്കി | 1 left |
| vanLoad.done | എല്ലാം ലോഡ് ആയി ✓ | All loaded ✓ |
| order.total | ആകെ ₹1,240 | Total ₹1,240 |
| cash.change | ₹50 തിരികെ കൊടുക്കുക | Give back ₹50 |
| upi.amount | ₹2,140 | ₹2,140 |
| upi.paid | പണം ലഭിച്ചു ✓ | Paid ✓ |
| return.tag | കേടായത് | Damaged |
| offline.saved | സേവ് ചെയ്തു | Saved |
| credit.over | ക്രെഡിറ്റ് ലിമിറ്റ് കഴിഞ്ഞു | Over credit limit |
| credit.ask | അംഗീകരിക്കണോ? | Approve? |
| credit.ok | അംഗീകരിച്ചു ✓ | Approved ✓ |
| dayEnd.title | ഇന്നത്തെ കണക്ക് | Today's account |
| dayEnd.expected | പ്രതീക്ഷിച്ച തുക · ₹18,400 | Expected · ₹18,400 |
| dayEnd.collected | ലഭിച്ച തുക · ₹18,400 ✓ | Collected · ₹18,400 ✓ |
| dayEnd.stock | സ്റ്റോക്ക് തിരികെ ✓ | Stock back ✓ |
| dayEnd.returns | റിട്ടേൺ · 1 | Returns · 1 |
| dues.title | കട ബാക്കി | Shop dues |
| dues.attention | ശ്രദ്ധ വേണം | Needs attention |
| dues.shop1 | ജോസഫ് സ്റ്റോർസ് · ₹2,850 | Joseph Stores · ₹2,850 |
| dues.shop2 | ഷാജി ട്രേഡേഴ്സ് · ₹3,400 | Shaji Traders · ₹3,400 |
| dues.shop3 | രാജു ബേക്കറി · ₹1,160 | Raju Bakery · ₹1,160 |
| dues.shop4 | ബിന്ദു സൂപ്പർമാർക്കറ്റ് · ₹1,980 | Bindu Supermarket · ₹1,980 |
| dues.shop5 | മണി ടീ സ്റ്റാൾ · ₹640 | Mani Tea Stall · ₹640 |
| profit.title | ഈ ആഴ്ചത്തെ ലാഭം | This week's profit |
| calendar.month | ഒക്ടോ | OCT |
| compare.paper | ബിൽ ബുക്ക് · 11:40 PM | Bill book · 11:40 PM |
| compare.app | DockDrop · 7:05 PM | DockDrop · 7:05 PM |
| pricing.line | 3 വാൻ വരെ · ആളെണ്ണം നോക്കി വിലയില്ല · സെറ്റപ്പ് സൗജന്യം · എപ്പോൾ വേണമെങ്കിലും നിർത്താം | Up to 3 vans · not charged per person · free setup · cancel any time |
| pricing.best | ഏറ്റവും ലാഭം | Best value |
| wa.message | ഹായ്, DockDrop പരീക്ഷിക്കണം | Hi, I'd like to try DockDrop |
| wa.trial | DockDrop സൗജന്യ ട്രയൽ വേണം | I'd like a free trial of DockDrop |

(Dues "needs attention": shop1 and shop2.) Every SR description in section 12 also gets an ML version in `copy.js` (translate with the native reviewer; English versions are in section 12).

### 14.8 FAQ

| q (ml) | a (ml) | q (en) | a (en) |
|---|---|---|---|
| ഇന്റർനെറ്റ് ഇല്ലാതെ പ്രവർത്തിക്കുമോ? | ഉവ്വ്. ഡ്രൈവർ ആപ്പ് നെറ്റ്‌വർക്ക് ഇല്ലാതെയും പ്രവർത്തിക്കും. നെറ്റ് തിരികെ വരുമ്പോൾ തനിയെ അപ്‌ലോഡ് ആകും, ഒന്നും ഇരട്ടിക്കില്ല. | Does it work without internet? | Yes. The driver app works offline and uploads automatically when the signal returns, without duplicates. |
| ബിൽ പ്രിന്റ് ചെയ്യാമോ? | ഉവ്വ്, ബ്ലൂടൂത്ത് റസീറ്റ് പ്രിന്ററിൽ, മലയാളത്തിൽ പോലും. PDF ആയോ WhatsApp-ലോ അയക്കാം. | Can I print bills? | Yes, on Bluetooth receipt printers, even in Malayalam. Bills can also go as PDF or on WhatsApp. |
| Tally-യുമായി ബന്ധിപ്പിക്കാമോ? | ഇപ്പോൾ ഇല്ല. 17 റിപ്പോർട്ടുകളും Excel-ലേക്ക് ഡൗൺലോഡ് ചെയ്യാം. | Does it work with Tally? | Not yet. All 17 reports download to Excel. |
| എന്റെ ഡ്രൈവർമാർക്ക് ഉപയോഗിക്കാൻ പറ്റുമോ? | ഡ്രൈവർ ആപ്പ് ലളിതമാണ്, മലയാളത്തിലാണ്. വാനിലെ സ്റ്റോക്കും റൂട്ടിലെ കടകളും മാത്രം കാണിക്കും. | Will my drivers manage it? | The driver app is simple and in Malayalam. It shows only the van's stock and the route's shops. |
| എത്ര വാൻ ചേർക്കാം? | ഈ പ്ലാനിൽ 3 വാൻ വരെ. | How many vans can I add? | Up to 3 vans on this plan. |
| എന്റെ ഡാറ്റ സുരക്ഷിതമാണോ? | ഡാറ്റ ഇന്ത്യയിൽ സൂക്ഷിക്കുന്നു, ദിവസവും ബാക്കപ്പ് എടുക്കുന്നു, എപ്പോൾ വേണമെങ്കിലും മുഴുവൻ ഡൗൺലോഡ് ചെയ്യാം. | Is my data safe? | Stored in India, backed up daily, and you can download all of it any time. |
| ഡ്രൈവർക്ക് ഏത് ഫോൺ വേണം? | ഒരു Android ഫോൺ മതി. | Which phone does the driver need? | An Android phone. |

`copy.js` starts with `// TODO: native Malayalam review before launch`.

## 15. Performance, accessibility, SEO

### 15.1 Performance

| Item | Budget |
|---|---|
| Images per stage, desktop (2x) | ≤ 650 KB |
| Images per stage, mobile (1x) | ≤ 350 KB |
| All story images, desktop | ≤ 5 MB |
| First view (a1) incl. JS + fonts | ≤ 900 KB |
| JS (gzipped) | ≤ 300 KB |
| LCP on mid-range Android, 4G | < 2.5 s |

- Load the **current and next** stage's assets (from `manifest.json`); preload the next while the current plays; `img.decode()` before its transition.
- `srcset` so phones get 1x. Explicit sizes on every `<img>` (no layout shift).
- Animate only `transform` and `opacity` where possible. `will-change: transform` only on moving layers during their animation.
- One `StageGrade` filter per stage container, never per image. Baked grades if FPS < 50 on a mid-range profile.
- Reuse assets: one wheel, one coin, one fan blade, one calendar page, one bill book page, mirrored hands.
- Lazy-mount stages (active ± 1).
- `gsap.matchMedia` mobile tuning: no pointer parallax, half particles, 0.8 s transitions, 3 road layers on `hardwareConcurrency <= 4`.
- Subset / preload Noto Sans Malayalam; `font-display: swap`.

### 15.2 Accessibility

Each stage: `role="group"`, `aria-roledescription="slide"`, `aria-label` with the stage name, visually hidden SR text (section 12). Captions are real text. A live region announces the stage name on change. All controls keyboard-reachable, visible focus (`--turmeric` 2px outline). Contrast AA. Decorative images `alt=""`.

### 15.3 SEO and analytics

- `<html lang>`, `<title>` and meta description follow the language (6.5). Default `ml`; `localStorage` (try/catch); `?lang=en` / `?lang=ml` overrides. Render only the active language, and declare the two versions as alternates: `<link rel="alternate" hreflang="en" href="https://dockdrop.in/?lang=en">` and `hreflang="ml"` for the default.
- Title: "DockDrop · Van sales app for Kerala distributors, in Malayalam". Meta description, Open Graph image (`/og.png`, 1200×630), favicon (lime "D").
- JSON-LD: `SoftwareApplication` (price 349 INR per month, Android + Web) and `FAQPage`.
- All captions and post-story content are real HTML text. Keywords used naturally in post-story copy: van sales app, van sales software Kerala, distributor billing app, GST billing app for distributors, route sales app, delivery challan software, വാൻ സെയിൽസ് ആപ്പ്, ബില്ലിംഗ് ആപ്പ് മലയാളം.
- **Analytics slots** (the marketing team adds IDs later): `VITE_GA_ID`, `VITE_GTM_ID`, `VITE_META_PIXEL_ID`. Scripts load only when the variable is set. Track events: `story_stage_view` (stage id), `story_complete`, `skip_story`, `whatsapp_click` (location), `trial_click`, `language_switch`.

## 16. Global rules

**Never show or say:**
- live GPS tracking, a map with a moving dot, anything that looks like spying on the driver
- the driver being blamed, shouted at, or looking guilty
- Tally logo or "works with Tally"
- competitor names or logos
- "100% GST compliant", "government approved"
- E-Way Bill (until the founder confirms the live keys)
- features not built yet: photo/OTP proof of delivery, cheques, SMS notifications, e-invoicing, shop login, iPhone driver app, self-signup
- jargon: SaaS, ERP, AI-powered, seamless, digital transformation
- real currency artwork or brand logos (except the WhatsApp icon on WhatsApp buttons/bubbles)

**Code rules:**
- JavaScript only (no TypeScript). Components in `.jsx`, logic in `.js`. JSDoc for shared shapes. ESLint passes with zero warnings.
- GSAP and Motion never animate the same element.
- Every GSAP animation inside `useGSAP` / `gsap.context`, cleaned up.
- All user-facing text from `copy.js` as `{ ml, en }`, read through `t(key)`. No string (Malayalam or English) hard-coded in components or scenes, including phone screens, callouts and SR text.
- UI colours from tokens only; art colours live only in the images.
- Art and puppet components contain no scene choreography; scenes animate them through `data-part` and motion helpers.
- Artwork comes only from FLUX generations the user has explicitly approved (Part 0.4). Claude Code never hand-draws illustrations. Missing art = grey placeholder box of the right size, listed in the phase report.
- FLUX is never used for anything section 8.3 lists as HTML / CSS / SVG.
- Every phase is verified with Playwright (Part 0.7) before its checklist is reported as done.

## 17. Folder structure

```
CLAUDE.md                          short rules + "read docs/BUILD_GUIDE.md first"
docs/BUILD_GUIDE.md                this file
docs/ART_APPROVALS.md              approval log (Part 0.6)
art-review/pending/                unapproved FLUX drafts (git-ignored, never used by the site)
art-src/                           approved, cleaned source PNGs
test-artifacts/                    Playwright screenshots (git-ignored)
scripts/build-art.mjs
public/
  art/                             generated WebP
  founder.jpg  receipt-ml.png  og.png  favicon.svg
src/
  main.jsx  App.jsx
  styles/index.css
  lib/gsap.js  useStageNavigator.js  useLanguage.jsx  useAnchors.js  useReducedMotion.js  preload.js  analytics.js
  content/copy.js  stages.js
  art/Puppet.jsx  motions.js  ArtImage.jsx  AccentMask.jsx  StageGrade.jsx  rigs/*.json  manifest.json
  art/props/        Van.jsx BillBook.jsx Calculator.jsx WallClock.jsx WallCalendar.jsx CeilingFan.jsx Scale.jsx ... (image-based)
  art/environments/ Godown.jsx Office.jsx RoadLayers.jsx ShopPettiKada.jsx ShopSupermarket.jsx ShopBakery.jsx TownSkyline.jsx
  components/layout/ Header.jsx ProgressDots.jsx LanguageToggle.jsx
  components/story/  StoryTheatre.jsx StageFrame.jsx Caption.jsx FeatureChips.jsx Sky.jsx ScrollHint.jsx HeroObject.jsx Rewind.js
  components/phone/  Phone.jsx PhoneScreen.jsx Callout.jsx
  components/ui/     SignalBars.jsx QrCode.jsx DuesMeter.jsx Bubble.jsx Receipt.jsx Emblem.jsx ClockCompare.jsx
  scenes/shared/     GodownLayout.js OfficeLayout.js RoadSystem.jsx
  scenes/            A1Scene.jsx A2Scene.jsx A3Scene.jsx A4Scene.jsx TScene.jsx B1Scene.jsx B2Scene.jsx B3Scene.jsx B4Scene.jsx
  sections/          Trust.jsx Pricing.jsx Faq.jsx FinalCta.jsx Footer.jsx
  pages/Lab.jsx
```

---

# PART 2: ASSET PRODUCTION (Claude Code + FLUX, with your approval)

## 2.1 Tools

- **Cloudflare FLUX MCP** (`mcp__cloudflare-flux__generate_image`, FLUX.1 Schnell) generates all artwork, following Part 0.4 (one asset at a time, explicit approval).
- **Photopea** (free, browser) or Photoshop for cutting characters into puppet parts and fixing joints, unless you approve Claude Code doing a first pass.
- **Optional editing tool** with inpainting, for expression heads if FLUX can't keep the face consistent (Part 0.5).
- Check Cloudflare Workers AI's terms allow commercial use of generated images.

## 2.2 Workflow

1. **Style frame** (P3): Claude Code generates; you approve. This sets the look for everything.
2. **Character masters** (P4): one per character, reusing the approved style wording. The approved master is the only source for that character.
3. **Expressions** (P5) and **hands** (P6): same seed and prompt, only the expression / pose words change; shown side by side with the master for approval (Part 0.5).
4. **Props** (P7) and **environments** (P8).
5. **Background removal**: you, or Claude Code with your OK (Part 0.5), keeping soft wash edges; result approved before saving.
6. **Cut** characters and moving props into parts with joint overlaps (2.11).
7. **Export** aligned full-canvas PNGs into `art-src/` (Part 1, 8.2).
8. Claude Code runs `npm run art`; you **set pivots** in `/lab`.

**Rules for every generation:** P1 first, subject second, P2-inline last. Plain white background, whole subject visible, no ground shadow. Same top-left light. Characters always three-quarter view facing right. Ask for the largest size the tool allows (targets: characters 1536 px tall, props 1024 px, wide backgrounds 3200 px). Every approval logged in `docs/ART_APPROVALS.md`.

## 2.3 P1: Master style prompt (paste first)

```
Hand-drawn ink and watercolour illustration in a refined editorial storybook style. Confident fine ink linework in near-black olive (#15160E) with light cross-hatching in the shadows, soft translucent watercolour washes with natural pigment blooms and uneven edges, visible warm off-white paper grain, highlights left as bare paper. Muted natural palette of warm sepia browns (#C9A97A, #9A7550, #5E4430), olive greens (#5B6B3A), laterite red-brown (#A4553A), terracotta (#B5532F), warm brown Kerala skin tones and off-white cloth (#F4F1E6). Realistic, dignified proportions, calm and warm mood. Soft light from the top-left. Set in a small town in Kerala, India, everyday trade life. Single isolated subject on a plain flat white background, entire subject fully visible and not cropped, no cast shadow on the ground.
```

## 2.4 P2-inline: Negatives written into the prompt (paste last)

FLUX.1 Schnell has no negative-prompt field, so append this sentence to every prompt:

```
No text, letters, numbers, writing, logos, watermark, signature, frame or border anywhere in the image. Not 3D, not photorealistic, not anime, not cartoon, not flat vector art, no thick outlines, no glossy shading. Hands with five natural fingers, no cropped limbs, plain white background, no ground shadow.
```

## 2.5 P3: Style frame (remove the last sentence of P1 for this one)

```
A complete scene: a small distributor's office in Kerala at night. A worn wooden table in the centre with a thick, messy Indian duplicate carbon bill book (bound along its top edge with dark red cloth tape, white pages over pink carbon copies, loose slips sticking out), a grey desk calculator, a steel tea glass, a small pile of folded banknotes and coins. A Kerala man about 45 with a thick moustache, white shirt and white mundu sits behind the table, hand on his forehead, tired. A younger driver in a checked shirt stands to the right, confused. Lime-washed wall behind with a round wall clock and a paper tear-off calendar, a white tube light glowing on the wall, a ceiling fan above, an open side door on the left showing darkness outside. Warm lamp-like glow on the table, deep shadows at the edges. Wide composition.
```

## 2.6 P4: Character masters

**Fixed pose (append to each standing character):**
```
Full-body, standing straight, three-quarter view facing right, arms hanging slightly away from the body with a clear gap between arms and torso, elbows very slightly bent, hands relaxed and open, feet slightly apart, neutral calm expression with mouth closed, looking forward. The figure fills about 85% of the image height.
```
For shopkeepers, replace "Full-body" with "Waist-up".

| id | Subject |
|---|---|
| `owner` | A Kerala man about 45 years old, short neat black hair, thick black moustache, warm brown skin (#8D5A3B), a white half-sleeve cotton shirt with sleeves folded once, a plain white mundu tied at the waist reaching the ankles with a thin lime-yellow border at the hem, simple brown leather sandals. Solid, kind, hard-working. |
| `driver` | A Kerala man about 28 years old, short black hair, light trimmed beard, warm brown skin (#A86E4B), a half-sleeve checked shirt in olive green and pale lime checks, dark grey trousers, black sandals, a slim smartphone in his shirt pocket. Friendly and relaxed. |
| `shopOld` | An older Kerala shopkeeper about 60, short grey hair, grey stubble, darker brown skin (#7A4B30), a white sleeveless cotton vest, a checked mundu in muted red and white. Waist-up, as if standing behind a shop counter. |
| `shopWoman` | A Kerala woman about 45, black hair in a low bun, warm brown skin (#A86E4B), a simple cotton saree in pale mustard with a dark olive border, worn Kerala style over a matching blouse, small gold stud earrings. Waist-up, behind a counter. |
| `shopYoung` | A young Kerala man about 25, short curly black hair, warm brown skin (#8D5A3B), a dark olive polo t-shirt. Waist-up, behind a bakery counter. |

## 2.7 P5: Expressions (same seed + prompt, only the expression words change; or inpaint in another tool)

| file | Edit prompt |
|---|---|
| `head-tired` | Change only the facial expression to tired: inner eyebrows slightly raised and drooping, heavy eyelids, mouth closed with corners slightly down. Keep the same face, hair, moustache, skin, line style and colours exactly. |
| `head-confused` | Change only the facial expression to confused: one eyebrow raised, the other lowered, lips slightly pursed to one side. Keep everything else exactly the same. |
| `head-smile` | Change only the facial expression to a warm, relaxed closed-mouth smile with soft eyes. Keep everything else exactly the same. |
| `eyes-closed` | Change only the eyes to gently closed. Keep everything else exactly the same. (Then cut out just the eye area as the overlay.) |

| Character | neutral | tired | confused | smile | eyes-closed |
|---|---|---|---|---|---|
| owner | ✓ | ✓ | ✓ | ✓ | ✓ |
| driver | ✓ | ✓ | ✓ | ✓ | ✓ |
| shopOld, shopWoman, shopYoung | ✓ | — | — | ✓ | ✓ |

## 2.8 P6: Hands

```
Close-up of a Kerala man's right hand and wrist, [POSE], warm brown skin ([SKIN HEX]), [CUFF], same ink and watercolour style, isolated on white.
```

| pose file | [POSE] | Characters |
|---|---|---|
| `open-R` | relaxed open hand, palm facing down, fingers gently together | all |
| `hold-R` | fingers curled as if holding a small book or box from the side (empty hand) | owner, driver |
| `phone-R` | holding a slim smartphone upright, thumb over the screen, screen flat and blank | owner, driver, shopWoman |
| `point-R` | index finger extended as if tapping a screen | owner, driver |
| `cash-R` | holding a few folded banknotes with plain generic patterns | driver, shopkeepers |
| `pen-R` | holding a ballpoint pen as if writing | driver |
| `pat-R` | open hand slightly cupped, as if patting a shoulder | owner |
| `printer-R` | holding a small handheld receipt printer from below | driver |

Skin groups: `skin1` owner and shopYoung (#8D5A3B, white shirt cuff for owner), `skin2` driver (#A86E4B, checked sleeve edge), `skin3` shopOld (#7A4B30, bare forearm), `woman` shopWoman (#A86E4B, "woman's", thin gold bangle). Left hands are mirrored by the script.

## 2.9 P7: Props

| id | Subject | Files to cut |
|---|---|---|
| `van` | A small Indian mini-truck delivery van, side view facing right, short cab and a boxy closed cargo body, cab painted pale sage grey-green, cargo box dark olive, black tyres with steel hubs, a small rear cargo door. Clean, slightly rounded, friendly proportions. No text or logos. **Second generation:** same van with the rear cargo door swung open showing stacked boxes inside. | `body`, `cargoDoor`, `cargoInside`, `wheel`, `accent-cab` (mask), `headlight` (mask) |
| `billbook` | An Indian duplicate carbon bill book, pad style, bound along its top short edge with dark red cloth tape, grey cardboard back, white pages over pink carbon copies, a thin blue carbon sheet edge, a perforated tear line near the binding, torn-off stubs at the top. Pages completely blank. Versions: lying open seen from above; closed at an angle; closed and very thick with loose pink and white slips and a rubber band. | `open-base`, `page`, `pinkCopy`, `closed-thin`, `closed-thick`, `slips`, `rubberBand`, `teaStain` |
| `phone` | A modern mid-range Android smartphone, dark body, thin bezels, front view, screen flat solid black. | `frame` (screen cut out transparent) |
| `calculator` | A grey plastic desk calculator with chunky keys, small blank pale-green display. | `body`, `display` (mask) |
| `steelGlass` | A Kerala-style steel tea glass with milky tea. | — |
| `cash` | A small pile of folded banknotes with generic muted green and purple patterns (not real currency) and a few steel coins. | `notes`, `coin` |
| `box` | A sealed cardboard carton with brown tape across the top. | — |
| `sack` | A tied jute sack of spices, slightly slumped; also a stack of three. | `sack`, `sackStack` |
| `wallClock` | A simple round white wall clock, black rim, tick marks, NO numerals, NO hands. | `face` |
| `calendar` | A paper tear-off wall calendar on a nail, top page completely blank. | `back`, `page` |
| `ceilingFan` | A ceiling fan seen from slightly below, cream hub and three long cream blades. | `hub`, `blade` |
| `tubeLight` | A wall-mounted white tube light fitting. | — |
| `printer` | A small handheld Bluetooth thermal receipt printer, dark grey, paper slot on top. | — |
| `scale` | An elegant old brass and dark iron balance scale with two shallow pans on chains. | `stand`, `beam`, `panL`, `panR` |
| `packet` | A crushed, damaged snack packet, plain with no printing. | — |
| `challan` | A small folded sheet of paper, blank. | — |
| `tabletop` | A worn wooden table top seen straight from above, warm grain, two faint tea-glass rings, filling the image edge to edge. | — |
| `table` | The same wooden office table seen from the front, slightly above eye level. | — |
| `chair` | A simple wooden office chair, side view facing right. | — |
| `cloud` | A soft rounded watercolour cloud, pale. | — |

## 2.10 P8: Environments

Generate layers separately, each isolated on white; backgrounds paler and looser than characters. Skies are CSS.

| id | Subject | Size | Files |
|---|---|---|---|
| `office` | Interior back wall of a small Kerala distributor's office, lime-washed plaster with a few stains, a wooden-framed window on the right (panes empty white), an open wooden side door on the left (doorway empty white), a concrete floor line at the bottom. Straight-on, no furniture, no people. | 2400×2400 | `wall`, `windowFrame`, `door` (window + doorway transparent) |
| `godown` | A small Kerala warehouse front: laterite block wall, a wide metal rolling shutter fully rolled up, dark interior with neat stacks of cardboard boxes and jute sacks. Straight-on, morning. | 2400×2400 | `wall`, `shutterRoll`, `interior`, `stacksBack`, `sacksFront` |
| `pettiKada` | A small tile-roofed Kerala roadside shop front, wooden counter, glass jars of snacks, banana bunches hanging at the front, a small notebook on a nail. Straight-on, no people. | 2000×2000 | `shop`, `counterFront` |
| `supermarket` | A small neighbourhood grocery store front in Kerala, flat roof, blank signboard, shelves inside, glass door, a front counter. | 2000×2000 | `shop`, `counterFront` |
| `bakery` | A small hill-road bakery in Kerala with a glass display case of snacks and a steel tea urn, misty green hills behind, slightly rain-wet. | 2000×2000 | `shop`, `counterFront`, `mistHills` |
| `roadClouds` | Soft watercolour clouds, very light, horizontally wide. | 3600×800 | tileable |
| `roadHills` | A long low range of green Kerala hills, soft and pale. | 3600×900 | tileable |
| `roadFields` | A long strip of Kerala roadside: paddy fields, laterite compound walls, small tile-roofed houses, distant coconut palms. | 3600×1000 | tileable |
| `road` | A narrow tarred road from the side, soft dirt edge. | 3600×300 | tileable |
| `roadPalms` | Foreground coconut palm trunks and banana plants, large, spaced along a wide strip. | 3600×1600 | tileable |
| `townSkyline` | A quiet Kerala small-town skyline at early morning: coconut palms, terracotta tile roofs, a low green hill. | 3600×1200 | — |
| `hillsWide` | Wide pale morning hills. | 3600×1000 | — |
| `paper` | Seamless warm off-white watercolour paper texture, subtle grain, no marks. | 1024×1024 | `texture/paper` (tileable) |
| `handshake` (optional) | Two hands meeting in a handover: a darker weathered hand on the left passing a few folded banknotes into an open hand on the right, horizontal composition. | 2400×1000 | — |
| `ctaScene` (optional) | The small van parked under coconut palms at golden hour, calm, wide. | 2400×1200 | — |

**Seamless strips:** in Photopea, Filter → Other → Offset by half the width, heal the middle seam, repeat until no seam is visible.

## 2.11 Cutting characters into parts

- Cut into the parts in Part 1, 9.1.
- **Joint overlap rule (most important):** extend every child part into its parent with a **rounded end** about 15–20% of the limb width beyond the joint line (top of upper arm, top of forearm, base of head). Paint the parent **continuing underneath** (torso under the shoulder, neck under the head) so nothing shows through when the child rotates.
- Keep the wash texture continuous across cuts; soft edges.
- Moving props use the same rule: `cargoDoor` hinge (left edge), bill book `page` (top edge), `beam` (centre), `panL`/`panR` (chain top), `blade` (hub centre), calendar `page` (nail).
- After `npm run art`, set pivots in `/lab` and rotate each joint through its full range; fix any seam in the source PNG and re-run.

## 2.12 Style test set (generated first, in Phase 2)

owner (all parts + 4 expressions + eyes-closed) · hands `skin1` (open, hold, point, pat) · `office` (wall, windowFrame, door) · `table` · `chair` · `wallClock` · `calendar` · `ceilingFan` · `tubeLight` · `calculator` · `steelGlass` · `cash` · `billbook` (closed-thick, slips, rubberBand) · `texture/paper`

## 2.13 Asset tracker

| # | Asset | Files | Done |
|---|---|---|---|
| 1 | Style frame | 1 | ☐ |
| 2 | Owner (parts, 4 heads, eyes) | ~12 | ☐ |
| 3 | Driver (parts incl. feet, 4 heads, eyes) | ~14 | ☐ |
| 4 | ShopOld / ShopWoman / ShopYoung (parts, 2 heads, eyes each) | ~24 | ☐ |
| 5 | Hands: skin1, skin2, skin3, woman | ~16 | ☐ |
| 6 | Van set | 6 | ☐ |
| 7 | Bill book set | 8 | ☐ |
| 8 | Phone frame | 1 | ☐ |
| 9 | Small props (calculator, glass, cash, coin, box, sack, sackStack, packet, challan, printer, chair, table, cloud) | ~14 | ☐ |
| 10 | Clock face, calendar (2), fan (2), tube light | 6 | ☐ |
| 11 | Scale (4) | 4 | ☐ |
| 12 | Table top (top-down) | 1 | ☐ |
| 13 | Office (3), godown (5) | 8 | ☐ |
| 14 | Shops (7 files) | 7 | ☐ |
| 15 | Road strips (5, seam-fixed), skyline, hills, paper texture | 8 | ☐ |
| 16 | Optional: handshake, CTA scene | 2 | ☐ |
| 17 | Founder photo, real Malayalam receipt photo, OG image | 3 | ☐ |

About **130 files**.

## 2.14 Tips

- Approve the style frame before anything else; every later prompt copies its wording.
- Never regenerate an approved character from scratch; reuse its seed and prompt for related assets.
- Reject anything with fake letters, extra fingers or a different face right away; ask for a regeneration with the problem named.
- Approve one asset at a time; take your time, every approval goes straight into the site.
- Moderately detailed faces edit more consistently than extremely detailed ones.
- Check thin lines at phone size. If they vanish, ask for "slightly bolder ink lines" and redo that asset.
- Same figure height on canvas and same light direction for every character.

---

# PART 3: CLAUDE CODE PROMPTS (paste one at a time)

Every prompt starts by reading this guide, including Part 0. After each phase, review the Playwright screenshots and check on your own browser and phone before moving on.

## Phase 1: Foundation and stepped story

```
Read docs/BUILD_GUIDE.md fully before starting, including Part 0. It is the single source of truth.

Goal: project setup and a working stepped story with placeholder stages.

Tasks:
1. Create a Vite + React 18 JavaScript project (template `react`, not `react-ts`) with Tailwind CSS v3 and ESLint (react, react-hooks). Install gsap, @gsap/react, motion. Do not install Lenis or a router.
2. Create CLAUDE.md at the repo root with: "Read docs/BUILD_GUIDE.md first (Part 0 governs image generation, approvals and Playwright)", the code rules from section 16, the never-show list, and the approval rule "never use an image the user hasn't explicitly approved".
3. Add .gitignore entries: art-review/, test-artifacts/.
4. Add tokens from sections 5.1, 5.3, 5.4, 5.5 to src/styles/index.css and tailwind.config. Load Sora, Inter, Noto Sans Malayalam and Kalam from Google Fonts (display=swap).
5. src/lib/gsap.js: register ScrollTrigger, Observer, ScrollToPlugin, MotionPathPlugin, DrawSVGPlugin, CustomEase and the "settle" ease.
6. src/content/stages.js (section 3.1) and src/content/copy.js with ALL strings from section 14.
7. LanguageProvider + useLanguage + t(key) per section 6.5 (default ml, ?lang= override, localStorage in try/catch, <html lang>, title/meta switch, text crossfade without restarting animations), useReducedMotion, LanguageToggle.
8. StoryTheatre, StageFrame (sections 4.1–4.3), Sky (presets + paper texture slot), StageGrade (7.3), Caption (6.2), FeatureChips (6.3), ProgressDots (6.4), Header (6.1), ScrollHint (6.6).
9. useStageNavigator per sections 3.2–3.3 (Observer, lock + 1-item queue, parallax transition via data-layer, dots, keyboard, leaving/re-entering, scroll lock, pausing inactive stages, visibilitychange). Leave a hook point for the image-decode gate (Phase 3).
10. Each of the 9 stages renders a PLACEHOLDER: correct sky and grade, labelled grey rectangles on each data-layer, the real caption and (Part B) the real chips. Stage t shows the rewind button (goes to next stage for now).
11. Post-story placeholder sections with ids (#trust, #pricing, #faq, #contact, footer), each 100vh.
12. Reduced motion: normal vertical page (3.4). Pointer parallax and mobile drift (4.4).
13. Run the Playwright checks from Part 0.7 that apply (navigation, dots, leaving/re-entering, language, responsive, reduced motion, console).

Do not change:
- docs/BUILD_GUIDE.md.
- Do not generate any images in this phase (FLUX is only used in Phases 2 and 4, or when I explicitly ask).
- No libraries beyond those listed.

Confirmation checklist (report done / not done for each):
[ ] One wheel notch / swipe / arrow press moves exactly one stage (390×844 and 1440×900)
[ ] Gestures during a transition queue (max 1); stages are never skipped
[ ] Visible parallax: layers move at different speeds
[ ] Dots, keyboard arrows, Home and End work
[ ] b4 → down releases to normal scroll; scrolling back to the top re-enters at b4
[ ] Header colours switch on dark/light stages
[ ] Opens in Malayalam by default; the toggle switches EVERY string to English and back; ?lang=en works; choice persists on reload
[ ] Mobile: square on top, caption below, chips row scrolls, no horizontal page scroll, safe areas respected
[ ] Desktop: square right, caption bottom-left
[ ] Grades A / A-night / B visibly differ on placeholders
[ ] Reduced-motion mode is a normal scrolling page
[ ] CLAUDE.md and .gitignore entries created
[ ] Verified with Playwright (Part 0.7): screenshots of touched stages at 390×844 and 1440×900 in test-artifacts/phase-1/ shown to me; pass/fail list reported
[ ] No ESLint warnings, build errors or console errors
```

## Phase 2: Style frame and style test art (FLUX, with approval)

```
Read docs/BUILD_GUIDE.md fully, especially Part 0 (0.3–0.6) and Part 2.

Goal: generate the style frame and the style test set (Part 2.12) with the Cloudflare FLUX MCP, one asset at a time, each explicitly approved by me.

Tasks:
1. Check that mcp__cloudflare-flux__generate_image is available and tell me the output sizes and options it supports (seed, width/height, steps). Stop if it isn't available.
2. Create docs/ART_APPROVALS.md (Part 0.6) if it doesn't exist.
3. Style frame first (Part 2.5, P3 with P2-inline): follow Part 0.4 steps 1–6. Do not move on until I approve it.
4. Then the style test set in this order, each through Part 0.4: owner master (P4) → owner expressions (P5, side by side with the master, Part 0.5) → owner hands skin1 (P6) → office layers → table → chair → wallClock face → calendar (back, page) → ceilingFan (hub, blade) → tubeLight → calculator → steelGlass → cash (notes, coin) → billbook (closed-thick, slips, rubberBand) → paper texture.
5. For every approved image: ask me whether I'll remove the background and cut it myself, or whether you should do a first pass (Part 0.5). Show any processed result for approval before it goes into art-src/.
6. Keep docs/ART_APPROVALS.md updated after every decision.

Do not change:
- docs/BUILD_GUIDE.md, CLAUDE.md, and all website code (src/, public/, config).
- Do not generate anything section 8.3 says is HTML / CSS / SVG.
- Never assume approval; never put an unapproved image in art-src/, src/ or public/.

Confirmation checklist:
[ ] Tool capabilities reported (sizes, seed support)
[ ] Style frame approved by me (date in ART_APPROVALS.md)
[ ] Every Part 2.12 asset either approved and in art-src/, or listed as pending with the reason
[ ] Expression heads shown side by side with the master; any mismatch flagged to me
[ ] No image in art-src/ that isn't logged as approved
[ ] art-review/pending/ contains only drafts still awaiting my decision
```

**→ You:** cut the owner into parts (Part 2.11) if you chose to, export into `art-src/characters/owner/`.

## Phase 3: Asset pipeline, Puppet system and style test

```
Read docs/BUILD_GUIDE.md fully (Part 0, sections 7, 8, 9, 12.4 and Part 2.12).

Goal: build the asset pipeline and puppet system, and prove the style with the owner in the a4 scene.

The approved style test set is in art-src/. If any file is missing, list it and use a grey placeholder box of the right size.

Tasks:
1. Install sharp (dev). Write scripts/build-art.mjs exactly per section 8.4; add "art": "node scripts/build-art.mjs". Make it warn about any art-src file not listed as approved in docs/ART_APPROVALS.md. Run it.
2. src/art/ArtImage.jsx (srcset 1x/2x, explicit sizes, decoding async), AccentMask.jsx (7.3), Puppet.jsx (9.3), motions.js (all helpers in 9.4).
3. src/lib/preload.js: manifest-based preload + decode; connect it to the navigator's decode gate (3.2) using each scene's `assets` list.
4. /lab (9.5): rig editor with pivot dragging, joint sliders within the 9.4 limits, expression and hand dropdowns, motion buttons, Download JSON; plus an asset gallery tab with Part A vs B grading side by side.
5. Rebuild ONLY stage a4 with real art per section 12.4: OfficeLayout in src/scenes/shared/, owner puppet seated behind the table, driver as a grey placeholder silhouette, bill book closed-thick with slips and rubber band, clock hands (SVG), calendar date and calculator display (HTML), fan blades, tube-light glow, the full loop with motion helpers, A-night grade.
6. SceneHandle contract (section 11) for a4, wired into the navigator.
7. Playwright: open /lab and a4; screenshot the owner at joint extremes and a4 loop moments; check images load.

Do not change:
- docs/BUILD_GUIDE.md, CLAUDE.md, docs/ART_APPROVALS.md.
- Navigator behaviour, Header, Caption, ProgressDots, copy.js.
- Any stage other than a4 (keep placeholders).
- Do not generate any images in this phase (FLUX is only used in Phases 2 and 4, or when I explicitly ask).

Confirmation checklist:
[ ] npm run art trims, writes 1x + 2x WebP, mirrors hands, writes rigs and manifest, keeps existing pivots on re-run, and warns about unapproved files
[ ] /lab: every owner joint rotates through its full range; joints showing a seam or gap listed
[ ] Expressions and hand poses crossfade without flashing; blink and breathing look natural
[ ] a4 loop plays fully; clock 8:15 → 9:40 → 11:40; rubForehead and riffle look like puppet motion
[ ] A-night grade on the stage container only
[ ] a4 image weight reported at 1x and 2x (budget 350 KB / 650 KB)
[ ] FPS reported at 390×844 with CPU 4× slowdown
[ ] Verified with Playwright (Part 0.7): screenshots of touched stages at 390×844 and 1440×900 in test-artifacts/phase-3/ shown to me; pass/fail list reported
[ ] No ESLint warnings, build errors or console errors
```

**→ You:** check a4 on your phone. Fix joints, set pivots in `/lab`, commit the rig JSON. Approve the style before Phase 4.

## Phase 4: Remaining artwork (FLUX, with approval)

```
Read docs/BUILD_GUIDE.md fully, especially Part 0 and Part 2. Read docs/ART_APPROVALS.md and reuse the approved style wording and seeds.

Goal: generate every remaining asset in the Part 2.13 tracker, one at a time, each explicitly approved by me.

Tasks:
1. List the remaining assets from Part 2.13 (skip anything already approved) and the order you'll do them in: driver → shopOld → shopWoman → shopYoung (each: master, expressions, hands) → van set → bill book set → phone frame → small props → scale → table top → godown → shops → road strips → town skyline, hills → optional handshake and CTA scene. Wait for my OK on the order.
2. Generate each asset through Part 0.4 (identify, generate up to 3 variations, show, ask, wait, save only after approval, log).
3. Characters' expressions and hands: same seed and prompt, shown side by side with the approved master; flag mismatches (Part 0.5).
4. Road strips: ask me how to handle width and seamless tiling before generating (Part 0.5 resolution limit; Part 2.10 seam fix).
5. After each approval, ask whether I'll do background removal / cutting or you do a first pass; show processed results for approval.
6. Keep docs/ART_APPROVALS.md and the Part 2.13 tracker status updated (report the tracker at the end of each session).

Do not change:
- docs/BUILD_GUIDE.md, CLAUDE.md, and all website code.
- Do not generate anything section 8.3 says is HTML / CSS / SVG (no text, UI, emblem, logo, skies, effects).
- Never assume approval; never put an unapproved image in art-src/, src/ or public/.

Confirmation checklist:
[ ] Every Part 2.13 asset approved and in art-src/, or listed as pending / blocked with the reason
[ ] Every file in art-src/ appears as approved in docs/ART_APPROVALS.md
[ ] Character consistency issues flagged and resolved with me
[ ] art-review/pending/ contains only drafts awaiting my decision
```

**→ You:** cut characters and moving props into parts if you chose to; export into `art-src/`; set pivots in `/lab` after Phase 5.

## Phase 5: Integrate all assets

```
Read docs/BUILD_GUIDE.md fully (Part 0, sections 7–10, Part 2).

Goal: integrate the complete approved asset set and replace every remaining placeholder art component.

Tasks:
1. Run npm run art; fix any warnings (unapproved files are reported to me, not used).
2. Rigs for driver, shopOld, shopWoman, shopYoung with default pivots at the joints in section 9.1; tell me to review them in /lab.
3. Image-based prop components (section 17 list) with moving parts as separate data-part elements and correct pivots: Van (body, cargoDoor, cargoInside, wheel, accent-cab via AccentMask, emblem via components/ui/Emblem), BillBook (all states and overlays + HTML writing from 14.4, both pages), Calculator, WallClock (SVG hands), WallCalendar (HTML dates), CeilingFan, Scale, and the rest.
4. Environment components: Godown, Office, RoadLayers (tiled), ShopPettiKada, ShopSupermarket, ShopBakery, TownSkyline. Shared layouts in src/scenes/shared/: GodownLayout, OfficeLayout, RoadSystem.
5. UI components from section 8.3: SignalBars, QrCode, DuesMeter, Bubble, Receipt (14.5), Emblem, ClockCompare.
6. HeroObject and useAnchors (section 10), including handoff and the fold-flash-unfold transform (used in Phase 7).
7. Update /lab gallery with every asset, rig and grade.
8. Playwright: /lab gallery screenshots; image-load check across all assets.

Do not change:
- docs/BUILD_GUIDE.md, CLAUDE.md, docs/ART_APPROVALS.md.
- Navigator, Header, Caption, ProgressDots, copy.js.
- a4 choreography (only swap the driver placeholder for the driver puppet).
- Do not generate any images in this phase (FLUX is only used in Phases 2 and 4, or when I explicitly ask).

Confirmation checklist:
[ ] Every asset in Part 2.13 integrated, or listed as missing
[ ] No unapproved image referenced anywhere
[ ] All rigs load in /lab; any seams listed
[ ] Van: no lime or emblem with grade A; both with grade B
[ ] All text is real HTML/SVG, never baked into images
[ ] Bill book writing matches 14.4 exactly on both pages
[ ] Per-stage weight report (section 15.1); stages over budget flagged
[ ] Verified with Playwright (Part 0.7): screenshots of touched stages at 390×844 and 1440×900 in test-artifacts/phase-5/ shown to me; pass/fail list reported
[ ] No ESLint warnings, build errors or console errors
```

## Phase 6: Part A (a1, a2, a3, a4 final)

```
Read docs/BUILD_GUIDE.md (Part 0, sections 10, 11, 12.1–12.4).

Goal: build a1, a2, a3 and finalise a4 with the hero bill book travelling between them.

Tasks:
1. A1Scene, A2Scene, A3Scene exactly per 12.1–12.3 (layout positions, intro, every loop beat with timeline labels, key frame, caption, SR text). a4 per 12.4 with the real driver puppet.
2. Hero bill book flights a1 → a2 → a3 → a4 with handoffs; bill book state changes per stage and per shop.
3. a3: RoadSystem driving with tiled layers, modifiers wrap, master drive timeline with timeScale stops; shopkeeper puppets between shop and counterFront.
4. All loops seamless; only the active stage runs; puppet idle pauses when inactive.
5. Grades A / A-night per section 3.1.
6. Playwright: navigate a1 → a4 and back on desktop and mobile; screenshot each stage's key moments; check resize behaviour of the hero object.

Do not change:
- docs/BUILD_GUIDE.md, CLAUDE.md, art components, rigs (add missing anchors only and tell me).
- Header, Caption, ProgressDots, copy.js.
- Placeholders for t, b1–b4.
- Do not generate any images in this phase (FLUX is only used in Phases 2 and 4, or when I explicitly ask).

Confirmation checklist:
[ ] The bill book is visibly ONE object a1 → a2 (owner) → a3 (driver) → a4 (table), also after resizing and on mobile
[ ] Handoffs are invisible (no flicker, no double book)
[ ] a2: slipping box clearly visible to the viewer, characters don't react, "?" bubble appears
[ ] a3: three shops, book gets messier each time, sky morning → evening, 5 parallax speeds
[ ] a4: confused and tired, never angry; -2,850; clock 11:40
[ ] Seamless loops; only the active stage animates
[ ] 60 fps desktop; smooth at CPU 4× slowdown on 390×844
[ ] Reduced-motion key frames correct for a1–a4
[ ] Verified with Playwright (Part 0.7): screenshots of touched stages at 390×844 and 1440×900 in test-artifacts/phase-6/ shown to me; pass/fail list reported
[ ] No ESLint warnings, build errors or console errors
```

## Phase 7: "Every day", rewind and b1

```
Read docs/BUILD_GUIDE.md (Part 0, sections 10, 12.5–12.7).

Goal: build stage t, the rewind transition t → b1 and stage b1.

Tasks:
1. TScene per 12.5 (calendar tear with HTML dates, faded owner riffling, phone slides in, logo builds, button pulse).
2. components/story/Rewind.js per 12.6; the navigator uses it only for t → b1 and its reverse (1.6×) for b1 → t; input locked for its duration; StageGrade crossfades A-night → B.
3. Book → phone fold-flash-unfold (section 10), then flight to b1-hold.
4. Phone + PhoneScreen 'home' (Motion stagger) and B1Scene per 12.7.
5. The rewind button triggers the same transition as a gesture.
6. Playwright: trigger the rewind by scroll and by button, forward and back; capture a frame sequence of the rewind at 390×844 and 1440×900.

Do not change:
- docs/BUILD_GUIDE.md, CLAUDE.md, a1–a4, art components, rigs.
- Header, Caption, ProgressDots, copy.js.
- Placeholders for b2–b4.
- Do not generate any images in this phase (FLUX is only used in Phases 2 and 4, or when I explicitly ask).

Confirmation checklist:
[ ] Calendar tears with changing dates; phone slides in; logo builds; button pulses
[ ] Rewind within 2.0 s: clock spins back to 6:30, pages return, night → morning, grade A-night → B, book folds into phone
[ ] VHS lines subtle, not glitchy
[ ] Reverse from b1 back to t works
[ ] Button and gesture both trigger the rewind
[ ] Phone lands in the owner's hand with crisp HTML screen
[ ] Works at 390×844, 1440×900 and 844×390
[ ] Verified with Playwright (Part 0.7): screenshots of touched stages at 390×844 and 1440×900 in test-artifacts/phase-7/ shown to me; pass/fail list reported
[ ] No ESLint warnings, build errors or console errors
```

## Phase 8: Part B (b2, b3, b4)

```
Read docs/BUILD_GUIDE.md (Part 0, sections 6.3, 12.8–12.10, 16).

Goal: build b2, b3, b4 with every feature moment and synced chips.

Tasks:
1. Callout component and PhoneScreen views: vanLoad, dayEnd, dues, profit.
2. B2Scene per 12.8 using GodownLayout (identical positions to a2).
3. B3Scene per 12.9 using RoadSystem (identical to a3), all three shops and every beat: receipt print, change, WhatsApp bill, UPI QR, return tag, offline pile, credit-limit approval, sync.
4. B4Scene per 12.10 using OfficeLayout (identical to a4): scale, dues list, profit, reports, pat, walk-out, lights off at 7:05, ClockCompare strip.
5. Chips switch from timeline labels; mobile chip row auto-scrolls.
6. Grade B with accents on throughout.
7. Playwright: screenshot every chip moment in ML and EN mode; verify the active chip matches the beat; check no map/GPS imagery.

Do not change:
- docs/BUILD_GUIDE.md, CLAUDE.md, a1–a4, t, rewind, b1, art components, rigs.
- Navigator, Header, Caption, ProgressDots, copy.js.
- Do not generate any images in this phase (FLUX is only used in Phases 2 and 4, or when I explicitly ask).

Confirmation checklist:
[ ] b2 mirrors a2; slipped box caught via the "1 left" row; challan tucks in; clock 6:30 → 6:45
[ ] b3 shows every chip's moment; the active chip matches what's on screen
[ ] Receipt matches 14.5 exactly in both languages
[ ] NO map, GPS dot or tracking imagery
[ ] b4: scale settles level; 2 "needs attention" shops; lights off at 7:05; clock compare 11:40 PM vs 7:05 PM
[ ] In EN mode every phone screen, callout, bubble, tag, receipt and chip is English (14.7 / 14.5); in ML mode all Malayalam
[ ] Seamless loops; only the active stage runs
[ ] Verified with Playwright (Part 0.7): screenshots of touched stages at 390×844 and 1440×900 in test-artifacts/phase-8/ shown to me; pass/fail list reported
[ ] No ESLint warnings, build errors or console errors
```

## Phase 9: Post-story sections, SEO and analytics

```
Read docs/BUILD_GUIDE.md (Part 0, sections 6.5, 13, 14.8, 15.3).

Goal: Trust, Pricing, FAQ, Final CTA, Footer, SEO, analytics slots.

Tasks:
1. sections/Trust.jsx, Pricing.jsx, Faq.jsx, FinalCta.jsx, Footer.jsx per section 13 (Motion whileInView only). Use the approved handshake / CTA illustrations if they exist in art-src; otherwise leave the slots empty (don't generate).
2. FAQ accordion (AnimatePresence, one open, aria attributes).
3. WhatsApp links and startTrial() per section 13 using VITE_WHATSAPP_NUMBER. Add .env.example with VITE_WHATSAPP_NUMBER, VITE_GA_ID, VITE_GTM_ID, VITE_META_PIXEL_ID.
4. src/lib/analytics.js: load GA / GTM / Meta Pixel only when their env vars are set; track the events in 15.3.
5. Placeholders in public/: founder.jpg, receipt-ml.png, og.png (1200×630), favicon.svg (lime "D"). These are plain placeholders (solid colour + label), not generated art.
6. SEO per 15.3: title, meta, OG, JSON-LD SoftwareApplication + FAQPage, <html lang> switching, hreflang alternates.
7. "Skip story" scrolls to #trust and disables the story Observer correctly.
8. Playwright: skip story, FAQ accordion, WhatsApp hrefs in both languages, language sweep of post-story sections, mobile and desktop screenshots.

Do not change:
- docs/BUILD_GUIDE.md, CLAUDE.md, anything inside the story theatre.
- Do not generate any images in this phase (FLUX is only used in Phases 2 and 4, or when I explicitly ask).

Confirmation checklist:
[ ] All post-story text from copy.js; EN mode shows no Malayalam anywhere on the page; WhatsApp messages follow the language
[ ] Prices ₹349 / ₹1,799 / ₹3,199, yearly highlighted
[ ] FAQ matches 14.8; Tally answer says "not yet"
[ ] No hard-coded phone number or analytics IDs
[ ] Analytics scripts absent when env vars are empty
[ ] JSON-LD passes Google's Rich Results Test (report)
[ ] Skip story works on desktop and mobile; returning to top re-enters the story
[ ] Lighthouse SEO ≥ 95, Accessibility ≥ 95
[ ] Verified with Playwright (Part 0.7): screenshots of touched stages at 390×844 and 1440×900 in test-artifacts/phase-9/ shown to me; pass/fail list reported
[ ] No ESLint warnings, build errors or console errors
```

## Phase 10: Performance, full Playwright test suite and deploy

```
Read docs/BUILD_GUIDE.md (Part 0, sections 3.4, 4, 15, 16).

Goal: fast and solid on real devices, fully verified in the browser, then deployed to Vercel.

Tasks:
1. gsap.matchMedia mobile tuning (15.1). Lazy-mount stages (active ± 1) without breaking anchors.
2. Verify preload/decode gating; no blank frames on slow 4G (throttling).
3. If any stage drops below 50 fps at CPU 4× slowdown, switch that stage to baked grades (npm run art -- --bake-grade).
4. Font subsetting/preload; no layout shift on font load.
5. Lighthouse mobile until Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95.
6. Run the FULL Playwright checklist from Part 0.7 across all 8 viewports, both languages, and reduced motion. Save screenshots to test-artifacts/phase-10/ and show me a summary grid.
7. Optionally save the Playwright checks as a repeatable script (tests/e2e/) so they can be re-run before each deploy; ask me first.
8. iOS Safari behaviour: 100svh, touch Observer, overscroll-behavior none while the theatre is active, no stuck lock (WebKit in Playwright if available, plus my real-device check).
9. Re-check the never-show list (section 16) across every scene and all copy.
10. Confirm every image the site uses is logged as approved in docs/ART_APPROVALS.md.
11. Add vercel.json (SPA fallback, long cache headers for /art/*) and README.md: how to run, npm run art, env vars, MCP servers used, and deploying to Vercel with dockdrop.in (GoDaddy DNS: A record @ → Vercel IP, CNAME www → cname.vercel-dns.com, as shown in Vercel's domain settings).

Do not change:
- Scene choreography, timings, positions or copy (performance and bug fixes only).
- docs/BUILD_GUIDE.md, docs/ART_APPROVALS.md.
- Do not generate any images in this phase (FLUX is only used in Phases 2 and 4, or when I explicitly ask).

Confirmation checklist:
[ ] Lighthouse mobile numbers reported (Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95)
[ ] JS gzipped size reported (≤ 300 KB); per-stage image sizes reported
[ ] Full Playwright suite: all 8 sizes, both languages, reduced motion; pass/fail table and screenshot grid shown
[ ] iOS behaviour: one swipe = one stage, no bounce, no stuck lock
[ ] Never-show list re-checked
[ ] Every image used is approved in ART_APPROVALS.md
[ ] Full language sweep: no string left untranslated (bill book page English in both, by design)
[ ] vercel.json and README deploy steps added
[ ] No ESLint warnings, build errors or console errors
```

---

# PART 4: LAUNCH CHECKLIST (you)

- [ ] Every image on the site approved by you and logged in `docs/ART_APPROVALS.md`
- [ ] `art-review/` and `test-artifacts/` not deployed (git-ignored)
- [ ] Every Malayalam line in `copy.js` reviewed by a native speaker
- [ ] Whole site checked once in English mode for wording and missed strings
- [ ] Real founder photo and real Malayalam receipt photo in `public/`
- [ ] Real OG image (1200×630) with logo and tagline
- [ ] `VITE_WHATSAPP_NUMBER` set in Vercel; WhatsApp button opens the right chat on Android and iPhone
- [ ] Privacy and Terms pages linked (existing DPDP-based privacy policy)
- [ ] First customer's quote approved by them
- [ ] E-Way Bill still absent (unless live keys are confirmed)
- [ ] Tested on a real mid-range Android phone on mobile data
- [ ] Domain dockdrop.in connected in Vercel; HTTPS working; `www` redirects
- [ ] Analytics IDs added once the marketing team creates GA / GTM / Meta Pixel accounts
- [ ] Google Search Console: site verified, sitemap submitted
- [ ] Shared with 2–3 distributors for feedback before running ads
