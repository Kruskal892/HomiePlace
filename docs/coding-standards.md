# HomiePlace coding standards

These are implementation rules, not claims that every feature exists. See [architecture](architecture.md) for the current baseline.

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
- Use native server aliases from `server/package.json`: `#controller`, `#utils`, `#templates`, and `#models` resolve to their respective `index.ts` barrels. Use named exports and `import type` for types. The wildcard `"#*": "./*.ts"` supports extensionless individual-file imports such as `#middleware/auth.middleware`. TypeScript resolves these through the server's NodeNext configuration; no runtime alias loader is needed. These mappings do not apply to the client.
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

Password reset and registration are mounted; login, profile, verification, and auth middleware remain unmounted. Sockets and uploads are not implemented. When adding them, enforce authorization at their trust boundaries and reuse installed dependencies where suitable.
