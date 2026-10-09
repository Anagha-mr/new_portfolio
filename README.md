# Anagha MR — Portfolio

Personal portfolio of Anagha MR: a dark editorial site whose home hero is a Starry Night-inspired particle painting rendered in WebGL.

## Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS
- Three.js, React Three Fiber, `@react-three/drei`
- GSAP and Lenis for scroll and motion

## Getting started

```bash
npm install
npm run dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start the development server  |
| `npm run build` | Create a production build     |
| `npm run start` | Serve the production build    |
| `npm run lint`  | Run ESLint                    |

## Structure

```
src/
  app/          Routes and global styles
  components/   Layout, navigation, sections, UI primitives
  data/         Site, project (one file per project), experience, education and skills content
  hooks/        Shared client hooks
  three/        WebGL scenes, objects, materials and the hero particle painting
```

Content lives in `src/data`, separate from the components that render it.

## Projects

Each project with a page is a file in `src/data/projects/` (index fields plus a `detail` block). `/work/[slug]` renders the shared page structure in `src/components/projects/page/`; each project's `detail.visual` selects its hero and system diagram from `src/components/projects/worlds/`. Adding a project means adding a data file and, if it needs a new visual language, a world component.

## Notes

- `context.md` is the authoritative design and implementation guide.

- The 3D layer is an enhancement: the site remains fully usable without WebGL.
- `prefers-reduced-motion` is respected throughout.
