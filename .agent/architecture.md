# HomiePlace architecture

## Actual source layout

```text
client/
  public/
  src/
    assets/
    App.tsx                     Placeholder UI
    main.tsx                    React root and BrowserRouter
    index.css                   Tailwind import
  eslint.config.js
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  vite.config.ts
  package.json
  package-lock.json
server/
  config/db.ts                  Mongoose connection
  controller/auth.controller.ts Unmounted registerUser
  controller/auth.types.ts      Request/response interfaces
  models/user.model.ts          User schema
  server.ts                     Express and HTTP bootstrap
  package.json
  package-lock.json
```

Use the singular `server/controller/` path. There are no server routes, middleware, sockets, or utils directories, and no client pages, components, context, hooks, services, or types directories yet.

## Client flow

`index.html` loads `src/main.tsx`, which renders `BrowserRouter > App`. App displays "App"; there are no routes or API requests. Tailwind v4 is imported in CSS and enabled with `@tailwindcss/vite`. Vite normally serves port 5173, with no configured port or proxy override.

## Server flow

`npm start` invokes Nodemon and Node's native TypeScript stripping on `server.ts`. The entry loads dotenv and awaits `connectDB()` before registering CORS, JSON parsing, and `GET /`. An HTTP server listens on hardcoded port 5000.

`connectDB()` requires `MONGO_URI` and awaits `mongoose.connect()`. Missing configuration or a failed connection prevents listening. CORS uses unrestricted `cors()`. No application error middleware or Socket.io initialization exists.

The manifest still declares `main: server.js`; the actual entry is `server.ts`. There is no server tsconfig or typecheck script.

## Registration groundwork

`registerUser` is exported but never imported or mounted by the entry point. It:

1. Reads name, email, password, and role from the request.
2. Returns 400 with `User already exists` for a matching email.
3. Hashes the password with bcrypt using 10 rounds.
4. Generates a six-digit token with Math.random and creates a user.
5. Sets approval false for managers and true otherwise. Caught failures return 500 with `Internal server error`.

The success path sends no response. Runtime validation, role authorization, token delivery/verification, and routing are missing. Relative imports omit extensions needed for direct Node ESM execution. Do not describe this as a ready-to-use endpoint.

The user schema requires name, unique email, and password. Roles are user (default), manager, and admin. It also stores phone, avatar, address, blocked/approved/verified flags, verification/reset tokens, reset expiry, and timestamps. The request interface permits an admin role and an optional isApproved field; the controller ignores the latter and derives approval from role.

JWT, Socket.io, Cloudinary, Multer, and Streamifier are installed but unused. Login, messaging, uploads, and email verification are not implemented.
