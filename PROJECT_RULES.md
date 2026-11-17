# PROJECT CONSTITUTION: Tanish's AI Village

Stack: Vite, React 18, TypeScript (strict), Phaser 3, Zustand, Howler.js, Tailwind CSS, Framer Motion, Supabase (JS client), EmailJS, Playwright, Vercel. Tilemaps authored in Tiled (.tmj). No other major dependencies without asking.

## WORKING RULES
1. Work in small phases. Implement only the phase pasted. Do not build ahead.
2. After each phase: run `npm run build` and `npm run lint`, fix all errors, then summarize what changed and how to test it.
3. All portfolio text lives in `src/data/*.ts`. Phaser and React read from there. Never hard-code content inside scenes or components.
4. Phaser handles the world. React handles every modal, form, menu, HUD and the classic view. Share state through a Zustand store (`src/state/gameStore.ts`). Phaser never renders long text.
5. Everything must work with keyboard only, touch only, and `prefers-reduced-motion`.
6. Mobile first: test 360x640, 390x844, 768x1024, 1440x900. No horizontal page scroll.
7. Performance budget: first interactive < 4s on mid phone over 4G; initial asset payload < 4 MB; stable 60 fps desktop, 30+ fps mid phone.
8. Never expose secrets. Only `VITE_*` public keys in the client. Provide `.env.example`.
9. Do not invent facts about me. If content is missing, leave it out.
10. Original art/code only. Keep `ASSET_LICENSES.md` updated for every third-party asset.

## RESUME & SINGLE SOURCE OF TRUTH
- `public/documents/Tanish_Kumar_Resume.pdf` and `src/data/content.ts` are the strict single source of truth.
- Exact skill categories: "AI & LLM Engineering", "Agentic AI", "Machine Learning", "Backend & Frontend", "Data & Vector Search", "DevOps & Cloud", "Programming Languages".
- Exact projects & dates: QUANTORA (Nov 2026), Pramaan.ai (Oct 2026), WhyTrace.ai (Aug 2026).
- Benchmark context: "Qwen2.5-0.5B on RTX 2050 (4 GB)".
- Projects 4 & 5: One-line descriptions only.
- Achievements: 100+ LeetCode problems solved using C++, Member, Cloud Computing Cell (CCC), AKGEC.
