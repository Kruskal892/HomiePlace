# HomiePlace Agent Instructions

This repository contains full-stack code for **HomiePlace**:
- **Client**: `client/` (React 19, TypeScript, Vite, Tailwind CSS v4)
- **Server**: `server/` (Node.js ESM, Express 5, MongoDB / Mongoose, Socket.io)

## 🚨 Instructions for All AI Agents (ChatGPT, Claude, Cursor, Copilot, Gemini)

Before proposing or generating any code changes, **YOU MUST** read and adhere to the guidelines in the [`.agent/`](.agent/) directory:

- 📖 **Overview & Golden Rules**: [.agent/README.md](.agent/README.md)
- 🏗️ **Architecture & Directory Structure**: [.agent/architecture.md](.agent/architecture.md)
- 💻 **Coding Standards (Client & Server)**: [.agent/coding-standards.md](.agent/coding-standards.md)
- 🚀 **Workflows, Environment Variables & Git**: [.agent/workflows.md](.agent/workflows.md)

### Strict Requirements:
1. **Never commit or stage `node_modules` or `.env` files.**
2. **Server uses ES Modules (`import`/`export`), never CommonJS `require()`.**
3. **Client is strictly typed with TypeScript. Do not use `any`.**
4. **Always respect the separation between `client/` and `server/`.**
