# HomiePlace coding standards

These are implementation rules, not claims that every feature exists. See [architecture](architecture/system-overview.md) for the current baseline.

## Client

- Use functional React components and typed props/state. Never use `any`; narrow `unknown` when needed.
- Keep feature-specific types near consumers. Add shared directories only when there is a shared need.
- Use local state by default and context when state needs sharing.
- Keep client code in `client/`; reuse the existing BrowserRouter when adding routes.
- Use Tailwind v4 through the existing CSS import and Vite plugin. Preserve accessibility and mobile-first layouts.
- If Tailwind Variants is introduced, reserve slots for customizable or variant-controlled classes. Keep static structure, animation, transitions, and interaction classes in JSX. It is not currently installed.
- Use the shared root Prettier configuration and package formatting scripts: 90-column target, two-space indentation, double quotes, semicolons, trailing commas, LF endings, and one JSX attribute per line.
- Match surrounding style. The app TypeScript config does not explicitly enable strict mode; the no-any rule still applies.

## Server

- Use TypeScript and ESM imports/exports, never CommonJS require.
- Node runs TypeScript directly with type stripping. Use erasable syntax, explicit `.ts` extensions for relative runtime imports, and `import type` for types.
- Use native server aliases from `server/package.json`: `#controller`, `#utils`, `#templates`, `#models`, `#middleware`, and `#routes` resolve to their respective `index.ts` barrels. Use named exports and `import type` for types. The wildcard `"#*": "./*.ts"` supports extensionless individual-file imports such as `#middleware/auth.middleware`. TypeScript resolves these through the server's NodeNext configuration; no runtime alias loader is needed. These mappings do not apply to the client.
- Follow the server ESLint flat configuration: recommended JavaScript/TypeScript rules, Node globals, and explicit `any` errors. Use typed values or narrow `unknown`; ESLint is not a substitute for typechecking. Apply the shared root Prettier settings to server files as well.
- Keep handlers in the existing `server/controller/`, models in `server/models/`, and configuration in `server/config/`.
- Add route/middleware files only when needed and mount them explicitly. Exporting a handler does not expose an endpoint.
- Reuse `utils/isValidEmail.ts` for email checks and `utils/buildClientUrl.ts` for trusted frontend links.
- Type request/response bodies, validate input at runtime, and respond on every handled success/error path.
- Use async/await and handle expected errors without exposing secrets. Express 5 forwards rejected handler promises, but no centralized application error middleware currently exists.
- Preserve database constraints and timestamps. Handle duplicate-key races; a pre-insert email lookup alone does not guarantee uniqueness.
- Hash passwords with bcrypt. Enforce roles and approval permissions server-side before exposing registration. Public input must not grant privileged roles.
- Complete secure token generation, expiry, delivery, and verification before exposing token workflows. The registration OTP uses Math.random and has no enforced expiry; password-reset tokens use crypto.randomBytes, hashed storage, and a 15-minute expiry.
- Native type stripping is not typechecking. Starting the server does not verify server type safety.

Registration, login, verification, password reset, and profile are mounted through `authRouter`.
Profile uses `protect`; `authorizeRoles` is not attached to any route. `protect` checks blocked status and attaches `req.user` before continuing once. Remaining
auth gaps are listed in [Implementation status](implementation-status.md).
The user router mounts protected profile updates with Multer memory storage and public profile lookup. Cloudinary avatar uploads are integrated; size/type limits and asset cleanup are not. Sockets remain unimplemented.

## Express request typing

### Controller module exports

Group each module under `server/controller/<module>/`, with a local `index.ts` exporting
its controller and types. The root `server/controller/index.ts` re-exports module barrels:

```ts
// controller/auth/index.ts
export * from "./auth.controller.ts";
export * from "./auth.types.ts";

// controller/index.ts
export * from "./auth/index.ts";

// Routes and other consumers
import { registerUser } from "#controller";
import type { AuthenticatedRequest } from "#controller";
```

Inside a module, import local types directly from `./auth.types.ts`. Relative ESM paths
must name the file, including `.ts`, because Node executes TypeScript directly here;
`./auth` does not resolve to `./auth/index.ts`. Keep exported names distinct across modules.

### Body and request types

Body interfaces describe JSON fields and do not extend `Request`. Supply them as the third
Express `Request` generic (`params`, `response body`, `request body`) and read fields from
`req.body`:

```ts
import type { Request, Response } from "express";
import type { VerifyEmailRequestBody } from "#controller";

const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailRequestBody>,
  res: Response,
) => {
  const { email, otp } = req.body;
  // Validate these values before querying or updating the database.
};
```

Extend `Request` for properties added to the request itself by middleware:

```ts
export interface AuthenticatedRequest extends Request {
  user?: { id: string; isBlocked?: boolean; role: string };
}
```

`getUserProfile` accepts `AuthenticatedRequest` because it retains Express request fields
and adds `req.user`. The optional property also allows requests before authentication.
The `protect` middleware must attach the user before calling `next()` once; interfaces
do not create runtime properties or validate HTTP input.

Typing a handler's `req` directly as `VerifyEmailRequestBody` makes it incompatible with
Express and can produce the misleading `Application` / "No overload matches this call"
error at `authRouter.post(...)`.
