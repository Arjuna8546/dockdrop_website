# DockDrop website

**Read `docs/BUILD_GUIDE.md` first.** It is the single source of truth. Part 0 governs the approval workflow and browser testing (Playwright MCP); its FLUX image-generation sections are retired (amendment 2 note). If anything conflicts or isn't covered, stop and ask.

**Design amendments 1–3** (top of the guide, after the roadmap) override parts of the guide. Amendment 3 is the current look: a **photo collage** of approved real photos + real app screenshots, built from `art-src/` with `npm run art`; FLUX tooling was removed on 2026-10-07. Amendment 1 overrides the square scene box, caption placement and the "D" logo: scenes are full-screen on a 1920×1200 camera canvas, captions sit in a bottom band with a highlight sweep, and the logo is the founder's mark in `brand-src/` (`npm run brand`, `BrandMark.jsx`).

## Approval rule
- **Never use an image the user hasn't explicitly approved.** Approval is per asset, logged in `docs/ART_APPROVALS.md` (Part 0.4–0.6). "ok", "nice", "continue" are not approval.
- Unapproved drafts live only in `art-review/pending/` (git-ignored) and are never referenced from `src/`, `public/` or `art-src/`.
- Generated art (FLUX or any other) is never used for anything Part 1 §8.3 lists as HTML / CSS / SVG (text, UI, clock hands, emblem, logo, skies, effects).
- Missing art = grey placeholder box of the right size, listed in the phase report.

## Code rules (§16)
- Vite + React 18 + JavaScript only (no TypeScript). Components `.jsx`, logic `.js`. JSDoc for shared shapes. `npm run lint` passes with zero warnings.
- GSAP and Motion never animate the same element (ownership table §2).
- Every GSAP animation lives inside `useGSAP` / `gsap.context` and is cleaned up. Plugins are registered once in `src/lib/gsap.js`.
- All user-facing text comes from `src/content/copy.js` as `{ ml, en }`, read through `t(key)`. No hard-coded strings in components or scenes (phone screens, callouts and SR text included). The bill book page is English in both modes.
- UI colours from tokens only; art colours live only in the images.
- Art and puppet components contain no scene choreography; scenes animate them through `data-part` and the motion helpers.
- Claude Code never hand-draws illustrations.
- Every phase is verified with Playwright (Part 0.7) before its checklist is reported done. Screenshots go to `test-artifacts/<phase>/` (git-ignored).
- WhatsApp number and analytics IDs come from env vars only (`VITE_WHATSAPP_NUMBER`, `VITE_GA_ID`, `VITE_GTM_ID`, `VITE_META_PIXEL_ID`).

## Never show or say
- live GPS tracking, a map with a moving dot, anything that looks like spying on the driver
- the driver being blamed, shouted at, or looking guilty
- Tally logo or "works with Tally"
- competitor names or logos
- "100% GST compliant", "government approved"
- E-Way Bill (until the founder confirms the live keys)
- features not built yet: photo/OTP proof of delivery, cheques, SMS notifications, e-invoicing, shop login, iPhone driver app, self-signup
- jargon: SaaS, ERP, AI-powered, seamless, digital transformation
- real currency artwork or brand logos (except the WhatsApp icon on WhatsApp buttons/bubbles)

## Repo notes
- `cloudflare-image-mcp/` (the image MCP server) is not part of the website; it is excluded from git, ESLint and Vite.
- Commands: `npm run dev`, `npm run build`, `npm run lint`.
