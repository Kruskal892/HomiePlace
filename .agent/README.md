# HomiePlace Agent Guidelines

Welcome to **HomiePlace**. This directory contains preload instructions, architecture context, and coding rules that ALL AI coding assistants (ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, etc.) must follow.

---

## 📌 Quick Reference

- **Project Type**: Full-stack application (Monorepo)
- **Client**: `client/` — React 19, TypeScript, Vite, Tailwind CSS v4, React Router DOM v7
- **Server**: `server/` — Node.js (ESM), Express 5, Mongoose (MongoDB), Socket.io, JWT, Cloudinary
- **Package Manager**: npm

---

## 📚 Core Documents

Before making any changes, consult the relevant guides:

1. **[Architecture & Structure](architecture.md)**: Repository layout, tech stack, data flow, and port configurations.
2. **[Coding Standards](coding-standards.md)**: TypeScript/React rules, Tailwind CSS v4 usage, Express/MongoDB patterns, and error handling.
3. **[Workflows & Git](workflows.md)**: Running dev servers, handling environment variables, Git commit rules, and security.

---

## ⚠️ Golden Rules for All Agents

1. **Never commit or stage sensitive files**:
   - Never stage `node_modules/`, `.env`, or credential keys.
   - Always ensure changes respect [.gitignore](../.gitignore).

2. **Respect the Monorepo Boundaries**:
   - `client` commands (`npm run dev`, `npm run build`) must run within `client/`.
   - `server` commands (`npm start`) must run within `server/`.
   - Client and server have independent `package.json` files; do not install frontend dependencies into `server/` or backend dependencies into `client/`.

3. **Modern ES Modules & Types**:
   - Server uses `"type": "module"` with modern `import` / `export` syntax.
   - Client is strictly TypeScript. Avoid `any` types; prefer strict interfaces and type definitions.

4. **Style & UI Standards**:
   - Client uses Tailwind CSS v4 (`@tailwindcss/vite`).
   - Keep markup clean, accessible, and responsive (mobile-first).

5. **Security & Validation**:
   - Never trust client input: validate request bodies in Express routes.
   - Protect sensitive routes with JWT authentication middleware.
   - Store passwords hashed using `bcryptjs`.
