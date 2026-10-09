# Anagha MR — Portfolio Context

The authoritative guide for all work on this repository. It describes the
design and implementation as they are now. Where an older note, comment or
memory disagrees with this file, this file wins.

---

## 1. Project identity

A personal portfolio for **Anagha MR**, a final-year Computer Science
student specialising in AI/ML. Her work spans:

- AI/ML and generative AI
- software engineering and full-stack product development
- computer vision
- backend systems
- IoT and security systems
- creative technology and interactive interfaces

Relevant technical areas: Python, TypeScript, Java, C/C++, React, Next.js,
Tailwind CSS, FastAPI, Flask, Supabase, REST APIs, FFmpeg, HLS/HLS.js,
Stable Diffusion, ControlNet, SAM, CLIP, RAG, ChromaDB,
sentence-transformers, TensorFlow, OpenCV, MediaPipe, Groq LLM API, Google
OAuth, DHTMLX Gantt, Git, Docker, Power BI, Tableau.

Do not reduce her identity to a single technology.

**The aesthetic is permanent; the content is replaceable.** Projects live
inside the visual system; they do not define it.

### No architecture theme (hard rule)

The portfolio must not use architecture, construction, blueprints, floor
plans, buildings or architectural metaphors as a visual or conceptual
identity, and must not describe Anagha as an architect or
architecture-focused developer.

One exception: **RoomAI** is an AI interior-design project. Interior or
spatial imagery is allowed only inside RoomAI's own project world, and must
not leak into the global aesthetic.

The cosmic painting in the hero is likewise an artistic expression. The
portfolio is not a space or astronomy project, and must not use space-themed
identity language (NASA, astronauts, spaceships, sci-fi).

---

## 2. Current visual identity

**STARRY NIGHT × PARTICLE ART × DARK EDITORIAL × CREATIVE TECHNOLOGY**

- The home hero is a particle interpretation of a Starry Night-inspired
  painting, rendered live in WebGL.
- Around it, the site is a dark editorial publication: near-black pages,
  large ivory Instrument Serif type, tiny precise mono metadata, generous
  negative space.
- Blue is the interaction accent. Ivory is the text colour.
- The painting is used only in the home hero. It is not a global background.

It should feel intentionally designed, not like a template, a developer
portfolio, a SaaS page, a gaming site or a WebGL demo.

---

## 3. Current palette

Tokens live in `src/app/globals.css` (`@theme`). Use them; do not add new
global tokens when an equivalent exists.

| Token | Value | Purpose |
| --- | --- | --- |
| `--color-void` | `#080807` | Page background (near-black) |
| `--color-ivory` | `#F1EDE5` | Primary text, display type, light highlights |
| `--color-cobalt` | `#5B7FC7` | Interaction accent: hover, active, underline, cursor ring |
| `--color-deep-cobalt` | `#2A4A8F` | Deeper accent: selection, focus on ivory, pressed states |
| `--color-frost` | `#A9BEDD` | Pale blue-white: focus outline on dark, cool highlights |
| `--color-charcoal` | `#181715` | Secondary dark surface |
| `--color-stone` | `#817B73` | Muted text, borders |
| `--color-silver` | `#B5B1AA` | Secondary light text |

Hero-only values (local to the hero, not global tokens):

- Technical eyebrow: `#C8D9F0` (pale frost; brighter than `frost`, still
  below the ivory name).
- Hero atmosphere gradient: `#05070C` → `#06080D` → `#080807`, with a faint
  `rgba(24,40,86,0.26)` radial.
- Painting palette (in `src/three/painting/starryField.ts`): midnight navy,
  deep ultramarine, muted cobalt, blue-white and pale ivory along one ramp;
  muted gold (`GOLD_DEEP` / `GOLD_LIGHT`) only in star cores, the moon and
  lit village windows.

Rules:

- No intentional red accent anywhere.
- No cherry-red interaction states.
- No red thread, filament or trace anywhere.
- No gold-toned Saturn, ringed planet or replacement celestial object.
- No pink, orange-red, purple neon or rainbow effects.
- Gold is restrained and local to the painting; it is never a UI colour.

---

## 4. Typography

The font system is approved and must not be casually changed.

- **Instrument Serif** (`font-display`): the name, section and project
  titles, large editorial statements, existing italic editorial labels.
- **Geist** (`font-sans`): body copy, navigation, buttons, interface text.
- **Geist Mono** (`font-mono`): technical labels, metadata, years,
  categories, section indicators, small system text.

Strong contrast between very large serif type and very small mono metadata
is part of the identity. Typography and copy must not be rewritten without
explicit approval.

### Copy rules (hard constraint)

Short, factual, understated. Text should identify, classify, navigate or
explain, never try to sound profound.

Do not write motivational or generic lines ("Building the future", "Where
creativity meets technology", etc.), slogans, quotes or invented
philosophy. Do not invent locations, employers, traits, goals, hobbies,
achievements or availability. In particular, no location text unless
explicitly requested.

---

## 5. Hero composition

`src/components/sections/Hero.tsx`. **The hero content is approved and
frozen.** Exact text (from `src/data/site.ts` and the component):

- Eyebrow: `AI / SOFTWARE / IoT · CSE — AI/ML` (`site.role · site.program`,
  rendered uppercase, Geist Mono, `#C8D9F0`)
- Name: `ANAGHA MR` (Instrument Serif, ivory)
- Supporting label: `A PERSONAL PORTFOLIO` (`site.heroKicker`, Geist Mono
  uppercase, full ivory `#F1EDE5`)
- Indicator: `SCROLL` with a thin line and dot
- Navigation: `WORK ABOUT PLAY CONTACT`

Composition:

- The Starry Night-inspired artwork is rendered as a particle system. It
  must be recognisable through particle distribution, brush-stroke
  direction, colour and density: the swirling sky, ringed stars and moon,
  the dark cypress silhouette, the hills and the understated village.
- The source image (`public/hero/starry-source.webp`) is only sampled. It is
  never displayed as the hero background.
- The eyebrow and supporting label must keep high contrast against the
  particle field, in the formed, dissociating and reconstructing states.
  Particles are dimmed behind the measured text block (`uTextDim` 0.7); no
  visible label boxes, glows or shadows.
- Desktop/landscape: the painting fills the viewport, type sits left.
  Portrait/mobile: the painting occupies the upper part, type sits below.
- The previous hero directions are retired: no Saturn or ringed body, no red
  filament, no reflective floor, no studio-lit 3D object.

---

## 6. Particle architecture

All files are in `src/three/painting/` unless noted.

- **`starryField.ts`**: source loading and particle generation.
  - `loadStarrySource()` decodes `/hero/starry-source.webp` (360 × 286) to
    pixels once per session; `whenIdle()` defers generation off the critical
    path.
  - `analyse()` derives, per source pixel: a contrast-lifted tone along the
    blue ramp; a `warm` map (stars, moon, lit windows below the horizon); an
    `earth` mask (dark, near-neutral pixels: cypress, roofs, ground);
    stroke direction and coherence from a smoothed structure tensor; and the
    major star clusters (`findStars()`: warm local maxima, rejected if
    elongated, de-duplicated, radius about twice the warm core).
  - `generateStarryField(source, count)` is deterministic (seeded
    `createSeededRandom` from `src/three/utils/random.ts`). It first emits a
    small fixed number of soft halo particles per major star (up to 12
    stars, `HALO_PER_RADIUS` per source pixel of radius). It then rejection
    samples brush flecks: dense in bright bands, sparse in dark gaps, nearly
    empty in `earth` areas so the cypress reads by absence, packed in star
    cores, with extra density in lit windows. Star flecks run tangentially in
    rings around each star with a small ivory/gold core; gold thins toward
    the rim. Particles are sorted dark to bright so stars draw on top.
  - Output (`StarryField`): `home` (u, v, depth), `color`, `shape` (stroke
    angle, size, elongation), `seed` (4 randoms for dissociation) and `glow`
    (0 for a fleck, otherwise a halo particle's peak alpha; halo size is a
    share of painting height).
  - `paintingRect()` places the painting in the viewport (landscape vs
    portrait).
- **`paintingMaterial.ts`**: one `THREE.ShaderMaterial`. The vertex shader
  computes each particle's position as a pure function of its home, seeds
  and `uProgress`. It draws elongated flecks along the stroke, soft Gaussian
  halo sprites for `aGlow > 0`, text-area dimming and the top/bottom fades.
  Normal blending, no depth.
- **`StarryParticles.tsx`**: builds one `BufferGeometry` (`position`,
  `aColor`, `aShape`, `aSeed`, `aGlow`) and renders a single `THREE.Points`
  draw. It runs the short opening assembly, damps toward the scroll
  progress, and disposes geometry and material on unmount.
- **`heroState.ts`**: a tiny store outside React for scroll progress and the
  measured text rect; listeners only request a frame.
- **Scene and canvas:** `src/three/scenes/HeroScene.tsx` (on-demand
  frameloop) inside `src/three/scene/SpatialScene.tsx`; mounted by
  `src/components/three/HeroCanvas.tsx` via `next/dynamic` (`ssr: false`)
  and `src/components/three/WebGLCanvas.tsx`.
- **Quality tiers:** `src/three/hooks/useQualityTier.ts`.
  `heroParticles` is 110,000 (high, > 1024 px), 70,000 (medium, ≤ 1024 px)
  and 36,000 (low, ≤ 640 px). DPR is capped per tier at 1.5, 1.25 and 1.
- **No-WebGL fallback:** `src/components/three/HeroFallback.tsx` draws the
  same deterministic field (60,000 particles, flecks and halos) once onto a
  2D canvas, fully formed.

---

## 7. Scroll interaction

- The hero section is `210svh` with a sticky `100svh` stage (no scroll
  hijack). GSAP ScrollTrigger maps progress through the section to
  `heroState.progress`.
- At progress 0 the painting is fully formed.
- As progress increases, regions release progressively. Flecks peel away
  along their strokes and a shared current, and star halos fade first.
  Part of the field fades and the rest remains as dispersed starlight.
- Scrolling back reconstructs the painting exactly: positions are a pure
  function of progress. There is no accumulated drift and no extra
  animation loop.
- Frames render only during the brief opening assembly and while progress
  changes; idle means no rendering. The canvas pauses when the hero is out
  of view.
- The normal page remains scrollable throughout.

---

## 8. Motion and accessibility

- **Reduced motion:** the hero collapses to one screen, progress stays 0, the
  painting renders still and fully formed, there is no opening assembly, and
  Lenis smooth scroll is disabled.
- **WebGL unavailable:** `HeroFallback` shows the static particle painting;
  all hero text, navigation and content stay in the DOM.
- **Mobile:** low tier particle count and DPR; portrait layout; no pointer
  interaction is needed for the hero.
- **Keyboard focus:** `:focus-visible` uses a 1px `frost` outline (and
  `deep-cobalt` on ivory surfaces). Navigation is keyboard accessible.
- **Cursor (desktop):** a small ivory dot that becomes a cobalt ring over
  interactive elements. No trails.
- **Resource cleanup:** geometry, material, observers, idle callbacks and
  ScrollTrigger contexts are disposed on unmount.
- **Scroll:** Lenis (`src/components/layout/SmoothScroll.tsx`) for smooth
  scroll; GSAP for choreography. Do not let two systems drive the same
  property.

Motion should be physical and purposeful: no constant floating, everything
rotating, excessive parallax or animation for its own sake.

---

## 9. Other portfolio pages

Work (`/work`), About (`/about`), Contact (`/contact`), Play (`/play`),
the Field experiment (`/play/field`) and the project detail pages
(`/work/[slug]`) keep their existing content and approved layouts.

- Blue (`cobalt`, `deep-cobalt`, `frost`) replaces the retired red
  interaction accents where appropriate.
- The Starry Night painting is not applied to these pages.
- Project detail pages use the shared structure in
  `src/components/projects/page/`, and each project's `detail.visual`
  selects its world in `src/components/projects/worlds/` (workflow, spatial,
  timeline, monitoring, gesture).
- Detailed projects: `projectflow`, `roomai`, `temporal-rag`, `gttc`,
  `controlled-interface`. Content lives in `src/data/projects/` (one file
  per project), separate from the UI. Do not invent project facts.
- About content (education, involvement, experience, skills) lives in
  `src/data/`. Skills are typographic groups; never progress bars, ratings
  or scores.
- Play is optional content. Do not manufacture experiments.

---

## 10. Technical constraints

- **Stack:** Next.js 16 (App Router, see `AGENTS.md`: read
  `node_modules/next/dist/docs/` before writing Next.js code), React 19,
  TypeScript, Tailwind CSS 4, Three.js, React Three Fiber,
  `@react-three/drei`, GSAP (ScrollTrigger), Lenis.
- No database, CMS, auth or MCP. Content is local structured data in
  `src/data/`.
- WebGL is isolated in `src/three/` and mounted through `WebGLCanvas` with
  `next/dynamic`. There is no single global scene: the hero
  (`HeroScene`), RoomAI (`RoomScene`) and Field (`FieldScene`) have their
  own.
- Quality tiers scale particles, DPR and interaction together.
- 3D is an enhancement: essential content must never depend on WebGL.
- Performance: lazy-load heavy 3D, keep particle counts within the tiers,
  render on demand where scenes come to rest, pause off-screen scenes, and
  avoid React re-renders in render loops.
- Accessibility: semantic HTML, keyboard navigation, maintained contrast,
  meaningful text outside canvases, `prefers-reduced-motion` respected.
- Do not add dependencies without a clear, necessary purpose.

---

## 11. Change discipline

- Inspect `git status` and the existing diff before changing anything.
- Preserve uncommitted work. Never delete or overwrite it blindly.
- Do not change portfolio copy, hero text, typography or fonts without
  explicit approval.
- Do not reintroduce rejected visual concepts: red thread or filament,
  cherry accent, Saturn or ringed body, architecture theme.
- Treat colour, typography or hero-concept changes as design-system
  decisions, not small styling changes; flag them before implementing.
- Work in scoped sprints. Implement only the requested sprint, then stop.
  Do not plan or begin the next sprint automatically.
- Validate with `npm run lint`, `npx tsc --noEmit` and `npm run build`, and
  check responsive layouts (desktop through 375 px) for overflow.
- The current approved screenshots and this file are the source of truth.
  The user's latest explicit feedback overrides earlier assumptions; never
  silently reintroduce something the user rejected.

---

## 12. Current state and next steps

- The Starry Night particle hero is implemented.
- Scroll dissociation and reverse reconstruction are implemented.
- Current sprint (14.1): refined particle artwork (brushwork contrast,
  ringed stars with restrained local halos, cypress, village and hills
  definition), higher contrast for the hero eyebrow and portfolio label,
  removal of the retired red-thread and Saturn code, and this rewrite.
- No red-thread system is part of the current design; its code has been
  removed.

No future sprint is planned in this file. Wait for the next brief.

---

**Final rule:** do not make the portfolio impressive by adding more things.
Make every thing feel intentional. When in doubt, remove rather than add.
