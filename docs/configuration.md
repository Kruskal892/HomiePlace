# Configuration

## Environment variables

The server entry loads `dotenv/config`. Package development scripts run from `server/`,
so place local configuration in `server/.env`.

| Variable | Consumer | Requirement |
| --- | --- | --- |
| `MONGO_URI` | `server/config/db.ts` | Required to start; missing or unreachable database prevents listening |
| `SMTP_USER` | `server/utils/sendEmail.ts` | Gmail account used as SMTP identity and sender |
| `SMTP_PASS` | `server/utils/sendEmail.ts` | Gmail app password for email delivery |
| `CLIENT_URL` | `server/utils/buildClientUrl.ts` | Required for forgot-password link generation |
| `JWT_SECRET` | Login controller and `protect` middleware | Required for login and authenticated profile requests |
| `NODE_ENV` | `server/utils/buildClientUrl.ts` | `production` disables HTTP loopback origins |

Example values for local email workflows:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/homieplace
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=replace-with-your-local-app-password
CLIENT_URL=http://localhost:5173
```

`CLIENT_URL` must be an HTTPS origin without credentials, a path, query, or fragment.
Outside production, HTTP localhost, 127.0.0.1, and IPv6 loopback origins are allowed.
Reset links never derive their origin from request headers.

`PORT`, Cloudinary configuration, and client `VITE_*` variables are not wired up.
The server listens on 5000; Vite normally uses 5173 and has no API proxy configured.
No `.env.example` exists. Environment files are ignored by Git and Prettier.

## Server aliases

[server/package.json](../server/package.json) uses native Node package imports.
[server/tsconfig.json](../server/tsconfig.json) resolves them with `NodeNext`.

| Import | Target relative to `server/` |
| --- | --- |
| `#controller` | `controller/index.ts` |
| `#models` | `models/index.ts` |
| `#middleware` | `middleware/index.ts` |
| `#routes` | `routes/index.ts` |
| `#utils` | `utils/index.ts` |
| `#templates` | `utils/templates/index.ts` |
| `#folder/file` | `folder/file.ts` through the `#*` wildcard |

```ts
import { User } from "#models";
import { isValidEmail } from "#utils/isValidEmail";
import type { AuthenticatedRequest } from "#controller";
```

Aliases omit the `.ts` suffix because the wildcard adds it. Relative runtime imports include
the suffix, for example `./config/db.ts`. `#middleware` and `#routes` resolve to their configured barrels.
These aliases do not apply to the client, and require no runtime alias loader.

## Tool configuration

- Root `.prettierrc.json` and `.prettierignore` control shared formatting.
- `client/eslint.config.js` and `server/eslint.config.js` define package-specific lint rules.
- `.vscode/settings.json` selects Prettier format on save and separate ESLint working directories.
- Client TypeScript uses bundler resolution; server TypeScript uses NodeNext and `noEmit`.

See [Coding standards](coding-standards.md) for rules and
[Development workflow](development.md) for scripts and verification limits.
