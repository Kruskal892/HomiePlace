# HomiePlace client

React 19 + TypeScript + Vite 8 + Tailwind CSS v4. The frontend is currently a scaffold.

## Development

Use Node.js 22.13+ on the 22.x line, or Node.js 24+. From this directory:

```bash
npm ci
npm run dev
```

Open Vite's printed URL, normally `http://localhost:5173`. No environment variables are consumed and no backend requests are made.

## Source map

- `src/main.tsx` mounts `App` inside `BrowserRouter`.
- `src/App.tsx` displays "App" with `text-red-300`.
- `src/index.css` imports Tailwind using `@import "tailwindcss";`.
- `vite.config.ts` enables React and Tailwind plugins; no proxy or custom port is configured.
- `src/assets/` and `public/` contain starter assets.

No route definitions, pages, contexts, hooks, services, or shared types directories exist yet. Add structure only when needed.

## Scripts and checks

| Command | Behavior |
| --- | --- |
| `npm run dev` | Start Vite with HMR |
| `npm run build` | Run `tsc -b`, then build into `dist/` |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve an existing production build |

There is no test script. ESLint includes JavaScript, TypeScript, React Hooks, and React Refresh recommended configurations. The app TypeScript config checks unused locals/parameters and erasable syntax but does not explicitly enable `strict`. Project rules still prohibit `any`.

See the [developer documentation](../docs/README.md) for project architecture, configuration,
API contracts, coding standards, and development workflows. Follow [AGENTS.md](../AGENTS.md)
and the [.agent guides](../.agent/README.md). Agents must not run lint or build unless explicitly requested.
