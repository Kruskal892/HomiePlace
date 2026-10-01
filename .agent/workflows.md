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

The entry loads dotenv. The database helper requires `MONGO_URI`, not `MONGODB_URI`. Password-reset email delivery requires `SMTP_USER` and `SMTP_PASS` for the Gmail transport, plus `CLIENT_URL` (for example `http://localhost:5173`). Production requires an HTTPS origin; HTTP loopback is allowed only outside production. The unmounted login controller uses `JWT_SECRET`. PORT, Cloudinary settings, and client VITE_* settings are not wired up.

Neither package includes an `.env.example`. Do not instruct contributors to copy a nonexistent template. When adding configuration, document its real consumer and provide placeholder-only examples where appropriate. Never commit local environment files or secrets.

## Commands and verification

| Directory | Command | Behavior |
| --- | --- | --- |
| client | `npm run dev` | Vite development server |
| client | `npm run build` | TypeScript project checks, then Vite build |
| client | `npm run lint` | ESLint |
| client | `npm run preview` | Preview previously built assets |
| client/server | `npm run format` | Format package files using root Prettier settings |
| client/server | `npm run format:check` | Check formatting without changes |
| server | `npm run dev` | Same development server as `npm start` |
| server | `npm start` | Nodemon watches ts/js/json and executes `node --experimental-strip-types server.ts` |

**Do not run lint or build unless explicitly requested.** Listing commands is not authorization to execute them. Neither package has a test script; the server has no build, lint, or typecheck script.

For documentation changes, verify links, paths, scripts, and claims against source, then run `git diff --check`. This does not establish runtime correctness. For an already-running application, the client displays "App" and `GET http://localhost:5000/` returns `Hello World`. The password-reset endpoints are mounted; see [README password reset instructions](../README.md#password-reset) for Postman requests, response codes, and validation. Registration, login, profile, and verification routes remain unmounted. No frontend reset page or retained automated reset tests exist.

Install the recommended Prettier VS Code extension to use workspace format on save. Formatting excludes dependencies, build output, lockfiles, and environment files.

## Git and review

- Inspect branch, status, and diff before editing. Preserve unrelated user changes.
- Prefer `<type>: <short description>` commit messages.
- Stage only intended files when requested; never stage dependencies, environment files, secrets, or generated output.
- When refreshing docs against main, check the remote revision where accessible and disclose if it cannot be verified.
- MR descriptions must explain actual changes and reproducible test steps. Use only known tickets and evidence. Mark verification complete only when performed; never invent lint/build/test results.
