# Coding Standards & Best Practices

## 1. Frontend Standards (`client/`)

### TypeScript & React
- **React 19**: Use modern functional components with hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
- **Strict Typing**:
  - Always define TypeScript types/interfaces for component props, state, and API responses in `src/types/`.
  - Avoid `any`. Use `unknown` with type guards if types are unpredictable.
- **Component Design**:
  - Keep components modular, focused, and organized by feature or shared UI elements.
  - Colocate component-specific styles and subcomponents when appropriate.
- **State Management**:
  - Use React Context for global state (e.g., authenticated user, socket instance).
  - Use local state for UI-specific transient state (e.g., modal open/close, form inputs).

### Styling & Tailwind CSS v4
- **Tailwind v4**: Styles are configured via `@tailwindcss/vite` in `vite.config.ts`.
- **Utility-First**: Use Tailwind utility classes directly in JSX.
- **Responsive Design**: Mobile-first design pattern (`block md:flex`, `p-4 md:p-8`).

---

## 2. Backend Standards (`server/`)

### Node.js & Express 5
- **ES Modules**: Always use `import` and `export` statements (`"type": "module"`). Do NOT use CommonJS `require()`.
- **Layered Architecture**:
  - **Routes**: Define endpoints and mount middlewares.
  - **Controllers**: Handle request extraction, orchestrate operations, and send JSON responses.
  - **Models**: Define Mongoose schemas with proper validations, indexes, and defaults.
  - **Middlewares**: Reusable cross-cutting concerns (auth JWT, error handling, rate limiting).
- **Asynchronous Code & Error Handling**:
  - Use `async/await` for asynchronous code.
  - Express 5 automatically handles rejected promises from async route handlers, but controllers should still handle specific errors or pass them via `next(err)`.
  - Maintain a centralized error-handling middleware at the bottom of the middleware stack.

### Database (Mongoose / MongoDB)
- Define strict schemas with timestamps (`{ timestamps: true }`).
- Index frequently queried fields (e.g., `email`, `userId`, `createdAt`).
- Sanitize inputs to prevent NoSQL injection.

### Real-time Communication (Socket.io)
- Handle connection, disconnection, and authentication on socket events cleanly.
- Organize socket handlers by feature inside `server/sockets/`.

### File Uploads & Cloudinary
- Use `multer` memory storage together with `streamifier` to stream upload buffers directly to Cloudinary without persisting temporary files to disk.
