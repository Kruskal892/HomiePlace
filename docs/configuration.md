# Configuration

## Environment variables

The server entry loads `dotenv/config`. Package development scripts run from `server/`,
so copy [server/.env.example](../server/.env.example) to `server/.env` and fill in the keys required for the features you use. Empty values in the example need your local credentials or secret.

| Variable | Consumer | Requirement |
| --- | --- | --- |
| `MONGO_URI` | `server/config/db.ts` | Required to start; missing or unreachable database prevents listening |
| `SMTP_USER` | `server/utils/sendEmail.ts` | Gmail account used as SMTP identity and sender |
| `SMTP_PASS` | `server/utils/sendEmail.ts` | Gmail app password for email delivery |
| `CLIENT_URL` | `server/utils/buildClientUrl.ts` | Required for forgot-password link generation |
| `JWT_SECRET` | Login controller and `protect` middleware | Required for login and authenticated profile requests |
| `CLOUD_NAME` | `server/config/cloudinary.ts` | Cloudinary cloud name for avatar uploads |
| `CLOUD_KEY` | `server/config/cloudinary.ts` | Cloudinary API key for avatar uploads |
| `CLOUD_SECRET` | `server/config/cloudinary.ts` | Cloudinary API secret for avatar uploads |
| `NODE_ENV` | `server/utils/buildClientUrl.ts` | `production` disables HTTP loopback origins |

Placeholder values for local auth, email, and avatar workflows:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/homieplace
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=replace-with-your-local-app-password
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-local-secret
CLOUD_NAME=replace-with-your-cloud-name
CLOUD_KEY=replace-with-your-cloudinary-api-key
CLOUD_SECRET=replace-with-your-cloudinary-api-secret
```

`CLIENT_URL` must be an HTTPS origin without credentials, a path, query, or fragment.
Outside production, HTTP localhost, 127.0.0.1, and IPv6 loopback origins are allowed.
Reset links never derive their origin from request headers.

Cloudinary configuration loads the three `CLOUD_*` variables above; they are needed when uploading avatars, not for text-only updates. `PORT` and client `VITE_*` variables are not wired up.
The server listens on 5000; Vite normally uses 5173 and has no API proxy configured.
Local environment files are ignored by Git and Prettier; `.env.example` is explicitly allowed by Git and contains no credentials.

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
