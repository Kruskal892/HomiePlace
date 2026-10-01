# HomiePlace architecture

## Source layout and runtime

`client/src/main.tsx` renders `BrowserRouter > App`; App is a placeholder without routes or API requests. Tailwind v4 is enabled in CSS and Vite. The default client port is 5173.

`server/server.ts` loads dotenv, awaits `config/db.ts`, and starts Express on port 5000. CORS is unrestricted and JSON bodies are limited to 10 KB. A database connection failure prevents startup. No centralized error middleware, rate limiter, or Socket.io initialization exists.

Handlers and request/response interfaces live in `server/controller/`. The user schema in `server/models/user.model.ts` stores identity, unique email, bcrypt password hash, roles, account flags, verification/reset tokens, expiry, and timestamps. `server/utils/` contains Gmail delivery, verification email HTML, trusted client-link construction, and email validation.

Each package has its own npm manifest and lockfile. The private root package uses concurrently to run the existing client/server development scripts with `npm --prefix`, preserving each package's working directory. Root Prettier configuration and VS Code settings provide shared formatting. The server manifest still declares `main: server.js`; the runtime entry is `server.ts`. There is no server tsconfig or typecheck script.

## Mounted routes

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/` | Returns `Hello World` |
| POST | `/api/auth/forgot-password` | Accepts an email and processes reset delivery in the current process |
| POST | `/api/auth/reset-password/:token` | Consumes a valid token and replaces the password hash |

## Password-reset flow

1. Validate email and the configured client origin before acknowledging a request. Return 400 for invalid email or 503 for invalid client configuration.
2. Return the same 202 response for existing and nonexistent accounts before querying MongoDB. This does not confirm email delivery.
3. Generate a 20-byte random token, store its SHA-256 hash with a 15-minute expiry, and email the original token through the Gmail helper. The password remains unchanged.
4. On SMTP failure, remove token fields only if the stored hash still matches that request, preserving a newer request's token. Processing runs in the Node process and does not survive restarts.
5. Reset accepts a 40-character lowercase hexadecimal token and matching passwords of at least 15 Unicode code points and at most 72 UTF-8 bytes. An atomic update checks expiry, saves a bcrypt hash, and removes token fields. Invalid, expired, or used tokens return 400; success returns 200.

Both handlers send `Cache-Control: no-store`. Reset does not issue a login token or change approval, verification, or blocked flags. The frontend reset page and rate limiting are deferred; no automated test files are retained.

## Shared helpers

`isValidEmail(unknown)` narrows valid strings using basic syntax and a 254-character limit. Registration, login, verification, and forgot-password call it before email queries. It does not normalize addresses or verify ownership.

`buildClientUrl(path)` reads `CLIENT_URL`, requires an HTTPS origin without credentials, path, query, or fragment, and rejects resulting links outside that origin. HTTP localhost, 127.0.0.1, and IPv6 loopback are allowed outside production. Request headers never supply the reset-link origin.

## Unmounted auth controllers

Registration validates email, hashes passwords, creates users, sends a six-digit OTP, and responds with user details. Role authorization and complete boundary validation remain unfinished; public registration must not grant privileged roles. Its OTP uses Math.random, and verification does not enforce expiry despite the email template mentioning ten minutes.

Login checks password and account flags and signs a one-hour JWT using `JWT_SECRET`. Profile loads a user by `req.user.id`, excluding the password. Verification compares the stored OTP and marks the account verified. None of these handlers is mounted; no authentication middleware populates `req.user`.

Socket.io, Cloudinary, Multer, and Streamifier are installed but not integrated.
