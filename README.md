# Escape from Planet X (Vite + Three.js)

A modular Three.js/WebXR scene rebuilt on Vite with TypeScript, loading/error states, caption timeline sequencing, and streaming audio controls.

## Stack

- Vite
- TypeScript
- Three.js + WebXR (`VRButton`)
- ESLint + Prettier

## Project layout

- `index.html` - Vite entry shell
- `src/main.ts` - app bootstrap and system wiring
- `src/scene/planetxScene.ts` - renderer, camera, controls, lights, GLTF loading, animation loop
- `src/systems/timeline.ts` - timed narrative caption system
- `src/systems/audioPlayer.ts` - stream player with fallback station
- `src/ui/dom.ts` - app DOM shell
- `src/config/constants.ts` - schedules, text, station, and asset constants
- `src/styles.css` - application styles
- `public/assets/` - GLTF/GLB and static assets

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - typecheck + production build
- `npm run preview` - preview built output
- `npm run typecheck` - TypeScript validation
- `npm run lint` - ESLint checks
- `npm run format` - format files with Prettier

## Run locally

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open the local URL printed by Vite

## Modernization outcomes

- Removed CDN runtime dependencies in favor of package-managed modules.
- Split scene, UI, timeline, and audio into maintainable modules.
- Added loading progress, asset error reporting, and intro fade sequencing.
- Added explicit renderer setup (color space, DPR cap, resize handling, animation loop).
- Added build/lint/format tooling baseline for CI.

## Next performance pass (recommended)

1. Optimize `public/assets/trench.glb` with glTF-Transform (`dedup`, `prune`, `draco` or `meshopt`).
2. Compress large textures to KTX2/Basis where practical.
3. Re-check startup and interaction FPS on mobile and desktop.

## License

No license file is currently present in this repository.
