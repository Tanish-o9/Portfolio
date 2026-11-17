# Tanish's AI Village

An interactive, game-style 2D portfolio of **Tanish Kumar**, AI Engineer (Agentic AI, LLM inference and optimization, RAG).

Walk around a small illustrated village, enter the buildings, and explore my projects, skills, experience and contact details. Prefer a regular page? Hit **Skip the village** for the classic portfolio view.

**Live demo:** `[ADD YOUR VERCEL URL]`
**Screenshot / GIF:** `[ADD docs/preview.gif]`

---

## Features

- Walkable 2D village (keyboard, click-to-move, touch joystick) built with Phaser
- Every building is a part of the portfolio and opens an accessible panel
- Classic scrolling portfolio at `/classic`, using the same data
- Public guestbook with moderation (Supabase, Row Level Security)
- Working contact form (EmailJS)
- Minimap, visited-places progress, sound toggle (muted by default)
- Keyboard-only and screen-reader friendly "Places" menu, `prefers-reduced-motion` support
- Mobile friendly: touch controls and bottom-sheet panels

## The village

| Place | What you find |
|---|---|
| Home | About me and professional summary |
| Project Street (5 houses) | QUANTORA, Pramaan.ai, WhyTrace.ai, LLM Data Engine, Mini Vision-Language Model |
| Library | Technical skills |
| CCC Tower | Experience |
| College | Education and achievements |
| Post Office | Contact form |
| Notice Board | Resume (view / download) |
| Guestbook stand | Sign the guestbook |
| GitHub Workshop | Link to my GitHub profile |

## Featured projects

| Project | What it is | Verified numbers (from my resume) |
|---|---|---|
| **QUANTORA** | GPU benchmarking and optimization platform for LLM inference across precision levels, KV-cache policies and LoRA configs | INT4 NF4 cut peak VRAM by 76% (1,903 MB to 458 MB) on Qwen2.5-0.5B / RTX 2050 (4 GB); FP16 cut memory by 50%; KV-cache 1.19x speedup; 7 metrics, 5 precision levels |
| **Pramaan.ai** | Face + voice biometric attendance and academic governance platform | ROC-AUC 0.942; FAR below 0.4%; 88 automated tests |
| **WhyTrace.ai** | Interpretability-first evaluation harness for tool-calling AI agents | 14 modules; 7 failure categories; 3 integration paths; 18 offline tests in under 1 second |

## Tech stack

**App:** Vite, React 18, TypeScript (strict), Phaser 3, Zustand, Tailwind CSS, Framer Motion, Howler.js
**Backend services:** Supabase (guestbook), EmailJS (contact form)
**Quality:** ESLint, Prettier, Playwright
**Hosting:** Vercel

> These are the tools used to build this site. My professional skills are listed in the Skills panel and in `src/data/content.ts`.

## Getting started

```bash
git clone https://github.com/Tanish-o9/<REPO-NAME>.git
cd <REPO-NAME>
npm install
cp .env.example .env     # then fill in your keys (see below)
npm run dev
```

Open the local URL printed in the terminal. Requires Node 20+.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright tests |

### Environment variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Only public keys go in the client. Never add a Supabase `service_role` key. The site still runs without these; the guestbook and contact form then show a friendly "not configured" message.

## Project structure

```
src/
  app/        routes ("/" village, "/classic" portfolio)
  game/       Phaser scenes, player, NPCs, input, camera, audio
  ui/         React HUD, minimap, modals and panels
  classic/    classic portfolio view
  data/       content.ts and places.ts (all text lives here)
  state/      Zustand store shared by Phaser and React
  lib/        Supabase and EmailJS helpers
public/
  assets/     tilemaps, sprites, audio
  documents/  Tanish_Kumar_Resume.pdf
supabase/
  schema.sql  guestbook table and security policies
```

All portfolio content comes from `src/data/content.ts`, which mirrors my resume. Edit that file to update the site; no text is hard-coded in scenes or components.

## Setup guides

### Resume
Place your PDF at `public/documents/Tanish_Kumar_Resume.pdf`.

### Guestbook (Supabase)
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor. Anonymous visitors can only read approved entries and insert pending ones.
3. Copy the project URL and anon key into `.env`.
4. Approve entries from the Supabase dashboard (`approved = true`).

### Contact form (EmailJS)
Create a service and a template with the variables `from_name`, `from_email`, `subject` and `message`, then add the three EmailJS IDs to `.env`. Restrict allowed origins to your domain.

### Deploy to Vercel
1. Push the repo to GitHub and import it in Vercel.
2. Add the environment variables above.
3. Deploy. Add a custom domain in Project Settings, Domains.

## Accessibility and performance

- Every building is also reachable from a keyboard-accessible Places menu
- Focus-trapped dialogs, visible focus rings, text contrast of 4.5:1 or better
- Reduced-motion mode turns off ambient animation
- Phaser is lazy loaded; the classic view loads without it

## Roadmap

- [ ] Live visitor presence (anonymous ghost avatars and emotes)
- [ ] Day / evening theme with lighting
- [ ] Project screenshots in the project panels
- [ ] Final illustrated art pack

## Credits and licenses

Art, audio and fonts used in this project are listed in [`ASSET_LICENSES.md`](./ASSET_LICENSES.md). Fonts: Fredoka and Nunito (Google Fonts, SIL Open Font License).

Code is released under the MIT License. The portfolio content (text, project descriptions, resume) is (c) Tanish Kumar and is not covered by the license.

## Contact

**Tanish Kumar** - Ghaziabad, Uttar Pradesh, India
Email: tanishrajput673@gmail.com
GitHub: [github.com/Tanish-o9](https://github.com/Tanish-o9)
LinkedIn: [linkedin.com/in/tanish-kumar-61553b385](https://www.linkedin.com/in/tanish-kumar-61553b385/)
