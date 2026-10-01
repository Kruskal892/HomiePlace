# HomiePlace agent guidelines

Read this overview and all three guides before proposing or changing code.

## Current baseline

- `client/`: React 19, TypeScript, Vite 8, Tailwind v4, and React Router v7. BrowserRouter wraps a placeholder.
- `server/`: TypeScript, Node ESM, Express 5, and Mongoose 9. `GET /` and the forgot/reset-password POST endpoints are mounted.
- Registration model/types/controller exist, but registration is not an exposed or complete API.
- Login, profile, and email-verification controllers exist but remain unmounted. Login uses JWT; Socket.io and uploads are not integrated.
- Each package has its own npm manifest and lockfile; there is no root package runner.

## Required guides

1. [Architecture](architecture.md): actual files, data flow, and implementation gaps.
2. [Coding standards](coding-standards.md): client/server conventions and security boundaries.
3. [Workflows](workflows.md): commands, environment variables, and verification.

## Golden rules

1. Never stage or commit dependencies, local environment files, credentials, or generated output. Respect [.gitignore](../.gitignore).
2. Run commands in the appropriate package and keep client/server dependencies separate.
3. Use TypeScript and ES module imports/exports. Do not introduce CommonJS or client `any` types.
4. Reuse existing code; add directories and abstractions only when needed.
5. Validate untrusted input at runtime. Request types do not validate HTTP bodies. Hash passwords and enforce authorization server-side.
6. Keep UI accessible, responsive, and consistent with the existing Tailwind v4 setup.
7. Do not run lint or build unless explicitly requested. Report only checks actually performed.
8. Distinguish installed dependencies, unfinished code, and working features.
