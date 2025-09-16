# Repository Guidelines

## Project Structure & Module Organization
The app is a Vite + React + TypeScript frontend. Core screens live under `src/components`, with shared styles in `src/styles` and global styles in `src/index.css`. Entry points are `src/main.tsx` and `src/App.tsx`; assets referenced in components are colocated next to their usage. Build artifacts land in `dist/`, while design exports stay in `build/`.

## Build, Test, and Development Commands
Use `npm install` once to pull dependencies. `npm run dev` starts the Vite dev server with hot reload at `http://localhost:5173`. `npm run build` produces a production bundle in `dist/`. No automated test script is wired yet—add one before introducing tests to CI.

## Coding Style & Naming Conventions
Write TypeScript with functional React components, preferring hooks. Keep files in PascalCase when exporting a component (e.g., `MealPlanner.tsx`) and kebab-case for asset folders. Indent with two spaces to match existing files. Run Prettier-compatible formatting (e.g., `npx prettier --write src`) before committing, and keep Tailwind utility groupings readable when used.

## Testing Guidelines
There is no test runner configured today. When adding tests, use Vitest + React Testing Library for component coverage and place specs alongside components as `<Component>.test.tsx`. Document manual verification steps in the pull request until automated coverage exists.

## Commit & Pull Request Guidelines
Recent history mixes English and Russian summaries; moving forward, keep commit subjects short, present-tense, and descriptive (e.g., `feat(home): add subscription card`). Group related changes per commit. Pull requests should include: goal summary, bullet list of key changes, screenshots or GIFs for UI work, and links to tracked issues or design references.

## Design Assets & Theming
UI tokens and color choices mirror the DietScan Figma file. When updating visuals, sync assets in `build/` and update Radix-based components to keep light/dark theming consistent. Document any new tokens in `src/styles` so other contributors can reuse them.
