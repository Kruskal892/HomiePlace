# HomiePlace workflows

## Setup

Use Node.js 22.13+ on the 22.x line, or Node.js 24+, npm, and MongoDB. The server requires native TypeScript stripping; Vite and ESLint also require a modern Node version.

From `client/`:

```bash
npm ci
npm run dev
```

From `server/`, in another terminal:

```bash
npm ci
npm start
```

Packages have separate manifests and lockfiles. There is no root npm runner. Vite normally uses port 5173; the server uses hardcoded port 5000 after MongoDB connects.

## Environment

Create `server/.env` locally:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/homieplace
```

The entry loads dotenv. The database helper requires `MONGO_URI`, not `MONGODB_URI`. No other environment variable is currently consumed by application source. PORT, CLIENT_URL, JWT/Cloudinary settings, and client VITE_* settings are not wired up.

Neither package includes an `.env.example`. Do not instruct contributors to copy a nonexistent template. When adding configuration, document its real consumer and provide placeholder-only examples where appropriate. Never commit local environment files or secrets.

## Commands and verification

| Directory | Command | Behavior |
| --- | --- | --- |
| client | `npm run dev` | Vite development server |
| client | `npm run build` | TypeScript project checks, then Vite build |
| client | `npm run lint` | ESLint |
| client | `npm run preview` | Preview previously built assets |
| server | `npm start` | Nodemon watches ts/js/json and executes `node --experimental-strip-types server.ts` |

**Do not run lint or build unless explicitly requested.** Listing commands is not authorization to execute them. Neither package has a test script; the server has no build, lint, or typecheck script.

For documentation changes, verify links, paths, scripts, and claims against source, then run `git diff --check`. This does not establish runtime correctness. For an already-running application, the client displays "App" and `GET http://localhost:5000/` returns `Hello World`. There is no registration endpoint to test yet.

## Git and review

- Inspect branch, status, and diff before editing. Preserve unrelated user changes.
- Prefer `<type>: <short description>` commit messages.
- Stage only intended files when requested; never stage dependencies, environment files, secrets, or generated output.
- When refreshing docs against main, check the remote revision where accessible and disclose if it cannot be verified.
- MR descriptions must explain actual changes and reproducible test steps. Use only known tickets and evidence. Mark verification complete only when performed; never invent lint/build/test results.
