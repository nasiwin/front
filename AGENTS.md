# Repository Guidelines

This frontend is a Vite + React + TypeScript app. Core UI lives in `src/components`, shared tokens in `src/styles`, and global styles in `src/index.css`. Entry points are `src/main.tsx` and `src/App.tsx`. Build output goes to `dist/`; design exports stay in `build/`.

## Project Structure & Module Organization
- Source: `src/components` (screens/widgets), `src/styles` (tokens/theme), `src/api` (HTTP helpers).
- Globals: `src/App.tsx`, `src/main.tsx`, `src/index.css`.
- Assets: colocate with components; use kebab-case folders.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start Vite with HMR at `http://localhost:5173`.
- `npm run build`: create production bundle in `dist/`.
- Tests: not wired yet; add Vitest before CI.

## Coding Style & Naming Conventions
- Stack: TypeScript + functional React; prefer hooks.
- Files: PascalCase for components (`MealPlanner.tsx`); kebab-case for asset dirs.
- Indentation: two spaces. Keep Tailwind utilities readable.
- Formatting: run `npx prettier --write src` before committing.

## Testing Guidelines
- Frameworks: Vitest + React Testing Library.
- Location: colocate specs as `Component.test.tsx` next to components.
- Coverage: focus on core flows; document manual steps in PRs until CI runs tests.

## Commit & Pull Request Guidelines
- Commits: short, present-tense subjects (e.g., `feat(home): add subscription card`). Group related changes.
- PRs: include goal summary, bullet list of key changes, screenshots/GIFs for UI, and links to issues/designs.

## Design & Theming
- Align tokens/colors with DietScan Figma. When visuals change, sync `build/` assets and update Radix-based components for consistent light/dark theming. Document new tokens in `src/styles` for reuse.

