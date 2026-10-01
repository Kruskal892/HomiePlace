# HomiePlace

> Find a place with your homies.

HomiePlace is a full-stack web application for shared housing, room finding, and roommate collaboration. The project aims to help people find a place to live and connect with the people they share it with.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| Backend | Node.js, TypeScript, Express 5, ES modules |
| Database | MongoDB with Mongoose |
| Email delivery | Nodemailer with Gmail transport |
| Development tools | npm, ESLint, Prettier, Nodemon |

## Project structure

```text
HomiePlace/
  client/              React frontend
    public/            Public assets
    src/               Application source and styles
  server/              Express backend
    config/            Database configuration
    controller/        Request handlers and related types
    models/            Mongoose schemas
    utils/             Email delivery, templates, client links, and email validation
    server.ts          Server entry point
  .agent/              Architecture, coding standards, and workflows
  AGENTS.md            AI contributor instructions
  CLAUDE.md            Claude instructions
```

The client and server are separate npm packages, each with its own dependencies and lockfile. The root package starts both through their existing development scripts.

### Code formatting

Install the recommended **Prettier - Code formatter** VS Code extension (`esbenp.prettier-vscode`). Workspace settings enable format on save; **Shift + Alt + F** formats the current document. Both packages use the root `.prettierrc.json`: 100-column target width, two-space indentation, double quotes, and semicolons.

From either `client/` or `server/`, run `npm run format` to format that package or `npm run format:check` to check formatting without changing files. Dependencies, build output, environment files, and lockfiles are excluded.

The client currently displays a placeholder. The backend exposes a health response at `GET /` and the two password-reset endpoints described below. Registration, login, profile, and email-verification controllers exist but are not mounted as API routes.

## Getting started

### Prerequisites

- Node.js 22.13+ on the 22.x release line, or Node.js 24+.
- npm.
- A local MongoDB instance or a MongoDB Atlas connection URI.

### 1. Clone the repository

```bash
git clone https://github.com/Kruskal892/HomiePlace.git
cd HomiePlace
```

### 2. Set up the server

```bash
cd server
npm ci
```

Create a `.env` file in `server/` and add your MongoDB connection URI:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/homieplace
```

For MongoDB Atlas, replace the local URI with your cluster connection string. Keep credentials in your local environment file.

#### Verification email (OTP)

The registration controller sends a six-digit email verification code using **Nodemailer**. Email delivery is implemented in `server/utils/sendEmail.ts`, with the HTML message in `server/utils/emailTemplates.ts`.

The current transport uses Gmail. Add its credentials to `server/.env` to enable email delivery:

```dotenv
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-gmail-app-password
```

Registration and email verification are not yet mounted as API routes. The `verifyEmail` controller checks the OTP and marks the account as verified, but OTP expiry enforcement is not implemented.

#### Password reset

Add the trusted frontend origin to `server/.env` alongside the SMTP settings above:

```dotenv
CLIENT_URL=http://localhost:5173
```

Use an HTTPS origin in production, without a path, query, credentials, or fragment. HTTP loopback URLs are allowed only outside production. The server never builds reset links from request headers.

The reset flow has two steps: `forgotPassword` emails a temporary token, then `resetPassword` accepts that token and a new password. The frontend reset page is deferred, so use Postman to call the backend directly. The client does not need to be running for these API requests.

**1. Request a password-reset email**

Send a `POST` request to `http://localhost:5000/api/auth/forgot-password`, with `Content-Type: application/json` and this JSON body:

```json
{
  "email": "user@example.com"
}
```

Use the email of a user already stored in MongoDB. The controller validates the email with `isValidEmail` and builds the link with `buildClientUrl`, which validates `CLIENT_URL`, then returns the same `202` response for existing and nonexistent accounts:

```json
{
  "message": "If an account exists, password reset instructions will be sent.",
  "success": true
}
```

`202` means the request was accepted, not that an email was delivered. After responding, the controller saves a SHA-256 hash of a random token and its 15-minute expiry for a matching account, then emails the original token. The current password remains unchanged. An unknown account receives no email.

The link has the form `CLIENT_URL/reset-password/<token>`. The page is not implemented yet; copy the token from the link for the next request. If email delivery fails, cleanup removes the saved token only if it still belongs to that request, preserving any newer token. Delivery runs in the Node process and does not survive a restart. Processing errors are logged generically; SMTP delivery failures trigger token cleanup without a separate log.

**2. Submit the token and new password**

Send a `POST` request to `http://localhost:5000/api/auth/reset-password/<token>`, replacing `<token>` with the value from the email. Use `Content-Type: application/json` and this body:

```json
{
  "password": "my new secure password",
  "confirmPassword": "my new secure password"
}
```

Passwords must match, contain at least 15 characters, and fit bcrypt's 72 UTF-8 byte limit. The controller hashes the submitted token to find the account and hashes the new password with bcrypt. One atomic database update checks that the token is unexpired, saves the password hash, and removes the token and expiry. Each token can be used only once.

A successful reset returns `200`:

```json
{
  "message": "Password updated. Sign in with your new password.",
  "success": true
}
```

Resetting does not log the user in or change account approval, verification, or blocked status. The login controller remains unmounted.

| Endpoint | Error status | Meaning |
| --- | --- | --- |
| Forgot password | `400` | Invalid email input |
| Forgot password | `503` | Missing or invalid `CLIENT_URL` |
| Reset password | `400` | Invalid, expired, or used token; invalid password; or mismatched confirmation |
| Reset password | `500` | Password update could not be completed |

Both endpoints send `Cache-Control: no-store`. JSON request bodies are limited to 10 KB. Tokens must contain exactly 40 lowercase hexadecimal characters.

The shared `isValidEmail` helper checks string input, a maximum length of 254 characters, and basic email syntax before queries in registration, login, verification, and forgot-password. It does not normalize addresses or prove mailbox ownership. `buildClientUrl(path)` rejects links outside the configured origin.

Rate limiting is deferred. Add per-IP and per-email limits before exposing the endpoints publicly. There is currently no password-reset test file or frontend reset page.

#### Start the server

```bash
npm start
```

The backend runs at `http://localhost:5000`. MongoDB must be reachable before the server starts listening.

### 3. Set up the client

Open a second terminal at the repository root:

```bash
cd client
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. No client environment configuration is required for local startup.

## Available scripts

### Repository root

Install dependencies once from the repository root:

```bash
npm ci
npm --prefix server ci
npm --prefix client ci
```

After configuring `server/.env`, start both apps with `npm run dev`. Press Ctrl+C to stop both.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the server and client together |
| `npm run dev:server` | Start only the server |
| `npm run dev:client` | Start only the client |

### Client

Run these commands from `client/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Check TypeScript and create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format package files with the shared Prettier configuration |
| `npm run format:check` | Check formatting without changing files |

### Server

Run these commands from `server/`:

| Command | Description |
| --- | --- |
| `npm start` | Run the TypeScript server with Nodemon auto-restart |
| `npm run dev` | Run the same development server as `npm start` |
| `npm run format` | Format package files with the shared Prettier configuration |
| `npm run format:check` | Check formatting without changing files |

## Contributing

Keep frontend changes in `client/` and backend changes in `server/`. Follow the project conventions and include clear verification steps with your changes. Never commit dependencies, local environment files, credentials, or generated build output.

Read the following guides before contributing:

- [Client guide](client/README.md)
- [Architecture](.agent/architecture.md)
- [Coding standards](.agent/coding-standards.md)
- [Development workflows](.agent/workflows.md)

AI coding assistants should also read [AGENTS.md](AGENTS.md) and the [agent guidelines](.agent/README.md).
