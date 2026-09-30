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
| Verification email (OTP) | Nodemailer with Gmail transport |
| Development tools | npm, ESLint, Nodemon |

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
    utils/             Email delivery and email templates
    server.ts          Server entry point
  .agent/              Architecture, coding standards, and workflows
  AGENTS.md            AI contributor instructions
  CLAUDE.md            Claude instructions
```

The client and server are separate npm packages, each with its own dependencies and lockfile. Run package commands from the corresponding directory.

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

Registration is not yet mounted as an API route, and OTP verification and expiry enforcement are not implemented.

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

### Client

Run these commands from `client/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Check TypeScript and create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Server

Run this command from `server/`:

| Command | Description |
| --- | --- |
| `npm start` | Run the TypeScript server with Nodemon auto-restart |

## Contributing

Keep frontend changes in `client/` and backend changes in `server/`. Follow the project conventions and include clear verification steps with your changes. Never commit dependencies, local environment files, credentials, or generated build output.

Read the following guides before contributing:

- [Client guide](client/README.md)
- [Architecture](.agent/architecture.md)
- [Coding standards](.agent/coding-standards.md)
- [Development workflows](.agent/workflows.md)

AI coding assistants should also read [AGENTS.md](AGENTS.md) and the [agent guidelines](.agent/README.md).
