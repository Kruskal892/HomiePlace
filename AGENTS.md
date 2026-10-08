# HomiePlace agent instructions

Read these guides before proposing or changing code:

- [Overview and golden rules](.agent/README.md)
- [Architecture and implementation status](.agent/architecture.md)
- [Coding standards](.agent/coding-standards.md)
- [Workflows and environment](.agent/workflows.md)

## Current baseline and constraints

- Client: React 19, TypeScript, Vite 8, Tailwind v4, and BrowserRouter around a placeholder.
- Server: TypeScript executed directly by Node.js, ESM, Express 5, and Mongoose. The entry is `server/server.ts`; `GET /`, registration, and the forgot/reset-password POST endpoints are mounted.
- Registration is mounted at `POST /api/auth/register` but remains unfinished. Login, verification, and protected profile reads are mounted. `PUT /api/users/profile` supports profile updates and Cloudinary avatar uploads; `GET /api/users/profile/:id` exposes selected public fields. Role middleware remains unattached, and Socket.io is not integrated.
- Use TypeScript and import/export; never CommonJS or client `any`.
- Keep client/server code and npm commands within their respective packages.
- Never stage or commit node_modules, local environment files, credentials, or build output.
- Do not run lint or build unless explicitly requested. Never claim unperformed checks passed.
