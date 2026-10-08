# Troubleshooting

## Server does not start

Run server commands from `server/`, or use the root `npm run dev:server` script.
Check `node --version` and dependency engine requirements. The runtime executes TypeScript
directly using `node --experimental-strip-types`; Node type stripping does not typecheck code.
Avoid syntax that needs compilation, such as TypeScript enums or parameter properties.

For `MONGO_URI is missing`, copy `server/.env.example` to `server/.env` and set that exact variable name.
For connection failures, check MongoDB availability, credentials, and Atlas network access.
The server intentionally waits for the connection before listening on 5000.

For a port conflict, stop the process occupying port 5000 or deliberately change the source
and documentation together. Setting `PORT` has no effect on the current implementation.

## npm is blocked in PowerShell

If PowerShell blocks `npm.ps1`, use `npm.cmd` with the same arguments, for example:

```powershell
npm.cmd run dev
```

Keep commands within the relevant package or use the documented root scripts.

## An import alias cannot be resolved

Check the server `package.json` imports mapping and the target file. Bare aliases work only
for the configured barrels. Individual paths omit `.ts`, while relative runtime imports
include `.ts`. Ensure the editor associates server files with `server/tsconfig.json`.
Server aliases do not resolve in the client; do not add a client alias loader to fix a server issue.

## Email or password reset fails

Check `SMTP_USER` and `SMTP_PASS` locally; the transport uses Gmail. Do not print credentials
or tokens while diagnosing delivery. Forgot-password 503 indicates invalid `CLIENT_URL`.
A 202 response does not confirm delivery, and an unknown account intentionally receives no email.

The emailed reset link points to an unimplemented frontend page. Copy its token into the
backend reset request described in [API reference](api.md). A used or expired token returns 400.
For registration SMTP failure, the account already exists even though the response is 500;
there is no resend endpoint yet.

## Auth endpoint returns `Cannot POST` or 404

Use `http://localhost:5000/api/auth/...` and the method in [API reference](api.md).
The router mount must include its leading slash: `app.use("/api/auth", authRouter)`.
Check that the current server process restarted after route changes. Profile reads use GET; updates use PUT at `/api/users/profile`. Public lookup uses GET at `/api/users/profile/:id`.
Mounted routes still have the gaps listed in [Implementation status](implementation-status.md).

## Profile updates or avatar uploads fail

Use `PUT /api/users/profile` with a Bearer token. Missing `JWT_SECRET` returns 500;
absent/invalid tokens return 401 and blocked accounts return 403. For an avatar, use Postman
Body > form-data with a File field named `avatar`; let Postman set the multipart boundary.
Check `CLOUD_NAME`, `CLOUD_KEY`, and `CLOUD_SECRET` locally without printing credentials.
Text-only updates do not need Cloudinary credentials. Invalid profile fields return 400.

To remove an avatar, send the exact string `removeAvatar=true` without a file. JSON boolean
`true` does not trigger removal, and a file takes precedence. Removal only clears the database
URL; old Cloudinary assets remain. Uploads have no size/type limits and middleware errors
may use Express's default response rather than the controller's JSON format.

Both `/api/auth/profile` and `/api/users/profile` currently use the user-module read handler.
Public lookup requires a valid MongoDB ID and exposes only public profile fields; see
[API reference](api.md#public-profile).

## Auth router reports "No overload matches this call"

Check the controller's first parameter. A body interface is not an Express request;
use `Request<{}, {}, VerifyEmailRequestBody>` and read `req.body`.
Use `AuthenticatedRequest extends Request` for middleware-added `req.user`.
See [Express request typing](coding-standards.md#express-request-typing).

## Formatting or lint feedback is missing

Install both recommended VS Code extensions and open the repository as the workspace.
Prettier needs the root configuration; ESLint uses `client/` and `server/` working directories.
Prettier's target width is 90 while editor word wrap is 100. Format on save does not run
ESLint fixes. See [Development workflow](development.md) for available commands; agents must
not run lint or build without an explicit request.
