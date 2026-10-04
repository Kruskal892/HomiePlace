# Troubleshooting

## Server does not start

Run server commands from `server/`, or use the root `npm run dev:server` script.
Check `node --version` and dependency engine requirements. The runtime executes TypeScript
directly using `node --experimental-strip-types`; Node type stripping does not typecheck code.
Avoid syntax that needs compilation, such as TypeScript enums or parameter properties.

For `MONGO_URI is missing`, create `server/.env` with that exact variable name.
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

## Login, profile, or verification returns 404

These controllers are not mounted. Check [Implementation status](implementation-status.md)
before adding routes; middleware and verification gaps need attention first.

## Formatting or lint feedback is missing

Install both recommended VS Code extensions and open the repository as the workspace.
Prettier needs the root configuration; ESLint uses `client/` and `server/` working directories.
Prettier's target width is 90 while editor word wrap is 100. Format on save does not run
ESLint fixes. See [Development workflow](development.md) for available commands; agents must
not run lint or build without an explicit request.
