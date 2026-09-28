# Claude Instructions for HomiePlace

Welcome Claude! You are working on the **HomiePlace** full-stack repository.

## Preloaded Guidelines
Before making modifications or answering implementation questions, review and follow the instructions in the [`.agent/`](.agent/) directory:

- [.agent/README.md](.agent/README.md) - Golden rules & quick reference
- [.agent/architecture.md](.agent/architecture.md) - Monorepo architecture & networking
- [.agent/coding-standards.md](.agent/coding-standards.md) - React 19, TypeScript, Express 5, Mongoose rules
- [.agent/workflows.md](.agent/workflows.md) - Scripts, env variables, git commit guidelines

## Key Constraints
- Never commit `node_modules` or `.env` files.
- Client (`client/`) runs on Vite + React 19 + TypeScript + Tailwind v4.
- Server (`server/`) is Node.js ESM (`"type": "module"`) + Express 5 + MongoDB.
