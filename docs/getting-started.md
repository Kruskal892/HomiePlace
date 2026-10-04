# Getting started

## Prerequisites

- Node.js 22.13+ on the 22.x line, or Node.js 24+ as the documented project baseline.
  Check the installed packages' engine requirements if npm reports an engine mismatch.
- npm and Git.
- MongoDB running locally, or a reachable MongoDB Atlas database.
- Gmail credentials if you need registration or password-reset email delivery.

## Install the packages

From the repository root:

```bash
npm ci
npm --prefix client ci
npm --prefix server ci
```

There are three separate package manifests and lockfiles. Root installation does not install
client or server dependencies. Keep dependency changes in the package that consumes them.

## Configure the server

Create `server/.env` locally. There is no `.env.example` to copy.

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/homieplace
```

This is enough to start the server when MongoDB is reachable. Add SMTP credentials and
`CLIENT_URL` for email workflows; see [Configuration](configuration.md). Keep secrets out of Git.
The client currently needs no environment variables.

## Start development

From the repository root:

```bash
npm run dev
```

The root runner starts both package development scripts. Ctrl+C stops both processes.
Use `npm run dev:client` or `npm run dev:server` to run only one package.

| Application | Default address | Expected baseline |
| --- | --- | --- |
| Client | `http://localhost:5173` | A placeholder displaying `App` |
| Server | `http://localhost:5000` | `GET /` returns plain text `Hello World` |

Use the URL printed by Vite if its default port is occupied. The backend port is hardcoded
to 5000. MongoDB must connect before the server listens. These are expected manual checks,
not a claim that this documentation change ran the applications.

## Before your first change

Read [Architecture](architecture.md), [Coding standards](coding-standards.md), and
[Development workflow](development.md). Install the recommended VS Code Prettier and ESLint
extensions. Check [Implementation status](implementation-status.md) before assuming an auth
flow, frontend page, upload, or socket feature is available.
