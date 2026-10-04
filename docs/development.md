# HomiePlace workflows

## Setup

Use Node.js 22.13+ on the 22.x line, or Node.js 24+, npm, and MongoDB. The server requires native TypeScript stripping; Vite and ESLint also require a modern Node version.

From the repository root:

```bash
npm ci
npm --prefix client ci
npm --prefix server ci
npm run dev
```

Packages have separate manifests and lockfiles. The root runner starts both apps; Ctrl+C stops both. Use `npm run dev:client` or `npm run dev:server` at the root to start only one. Vite normally uses port 5173; the server uses hardcoded port 5000 after MongoDB connects.

## Environment

Create `server/.env` locally:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/homieplace
```

The entry loads dotenv. The database helper requires `MONGO_URI`, not `MONGODB_URI`. Password-reset email delivery requires `SMTP_USER` and `SMTP_PASS` for the Gmail transport, plus `CLIENT_URL` (for example `http://localhost:5173`). Production requires an HTTPS origin; HTTP loopback is allowed only outside production. The unmounted login controller uses `JWT_SECRET`. PORT, Cloudinary settings, and client VITE_* settings are not wired up.

Neither package includes an `.env.example`. Do not instruct contributors to copy a nonexistent template. When adding configuration, document its real consumer and provide placeholder-only examples where appropriate. Never commit local environment files or secrets.

## Commands and verification

| Directory | Command | Behavior |
| --- | --- | --- |
| root | `npm run dev` | Run client and server together with concurrently |
| root | `npm run dev:client` | Run the client development script |
| root | `npm run dev:server` | Run the server development script |
| client | `npm run dev` | Vite development server |
| client | `npm run build` | TypeScript project checks, then Vite build |
| client | `npm run lint` | ESLint |
| client | `npm run preview` | Preview previously built assets |
| client/server | `npm run format` | Format package files using root Prettier settings |
| client/server | `npm run format:check` | Check formatting without changes |
| server | `npm run dev` | Same development server as `npm start` |
| server | `npm run lint` | ESLint, including errors for explicit `any` types |
| server | `npm start` | Nodemon watches ts/js/json and executes `node --experimental-strip-types server.ts` |

**Do not run lint or build unless explicitly requested.** Listing commands is not authorization to execute them. Neither package has a test script; the server has no build or typecheck script.

For documentation changes, verify links, paths, scripts, and claims against source, then run `git diff --check`. This does not establish runtime correctness. For an already-running application, the client displays "App" and `GET http://localhost:5000/` returns `Hello World`. The password-reset endpoints are mounted; see [API reference](api.md) for Postman requests, response codes, and validation. Registration is mounted but unfinished; login, profile, verification, and auth middleware remain unmounted. No frontend reset page or retained automated reset tests exist.

Install the recommended Prettier and ESLint VS Code extensions. Prettier formats on save using the root configuration: 90-column target, two spaces, double quotes, semicolons, trailing commas, LF endings, and one JSX attribute per line. Editor word wrap remains at 100 columns. ESLint uses separate client/server working directories and validates JavaScript, TypeScript, and TSX; automatic ESLint fixes on save are not configured. Formatting excludes dependencies, build output, lockfiles, and environment files.

Both packages use ESLint flat configurations with recommended JavaScript/TypeScript rules. The client adds React Hooks and React Refresh rules with browser globals; the server uses Node globals, rejects explicit `any`, and ignores `dist` and `coverage`. Neither configuration uses type-aware linting.

## Git and review

- Inspect branch, status, and diff before editing. Preserve unrelated user changes.
- Prefer `<type>: <short description>` commit messages.
- Stage only intended files when requested; never stage dependencies, environment files, secrets, or generated output.
- When refreshing docs against main, check the remote revision where accessible and disclose if it cannot be verified.
- MR descriptions must explain actual changes and reproducible test steps. Use only known tickets and evidence. Mark verification complete only when performed; never invent lint/build/test results.

## Implementing a change

1. Read the architecture and implementation status, then inspect existing consumers before
   adding new modules. Keep changes in the relevant package.
2. For backend changes, define typed contracts, validate runtime input, reuse helpers, and
   mount intended routes explicitly. Complete authorization before exposing protected behavior.
3. For frontend changes, reuse BrowserRouter and Tailwind, and check keyboard interaction,
   responsive layouts, loading states, and errors when adding real screens.
4. Update the API, schema, environment, and status guides when their behavior changes.
5. Perform only the checks appropriate to the task and authorized in the session. Report
   commands run, outcomes, and any runtime or browser checks still outstanding.
6. Review the diff and status before handing off; keep generated files and secrets out of Git.

Package formatting scripts only cover their package directory. They do not format root
documentation. For documentation-only edits, checking links and `git diff --check` is the
documented baseline; do not claim that formatting, lint, build, or runtime checks passed
unless they were actually run.
