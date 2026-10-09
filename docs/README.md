# HomiePlace developer documentation

HomiePlace aims to support shared housing, room finding, and roommate collaboration.
The current implementation is a frontend scaffold and a small Express authentication and user-profile backend with Cloudinary avatar uploads.
Accommodation and inquiry schemas exist; booking APIs, inquiry messaging, roommate features, and messaging are not implemented yet.

## Start here

1. Follow [Getting started](getting-started.md) to install dependencies and run locally.
2. Read [Architecture](architecture/system-overview.md) to understand package boundaries and request flow.
3. Read [Coding standards](coding-standards.md) before changing code.
4. Use [Development workflow](development.md) for commands, formatting, and review.

## Architecture and domain

| Guide | What it covers |
| --- | --- |
| [Architecture](architecture/system-overview.md) | Package boundaries, source ownership, runtime, and auth behavior |
| [Database schema](architecture/database-schema.md) | Entity relationship diagram and User, accommodation, and inquiry persistence rules |
| [Accommodation schema](architecture/accommodation-schema.md) | Room pricing, inventory, booking examples, and timezone rationale |
| [Request flows](flows/README.md) | Ownership, decisions, state changes, failure paths, and review scenarios for auth, profiles, and proposed reservations |
| [Implementation status](implementation-status.md) | Existing features, incomplete behavior, and next integration steps |

## Development and API reference

| Guide | What it covers |
| --- | --- |
| [API reference](api.md) | Mounted endpoints, payloads, responses, and manual API checks |
| [Configuration](configuration.md) | Environment variables, ports, and server import aliases |
| [Coding standards](coding-standards.md) | TypeScript, UI, server, security, and request-typing conventions |
| [Development workflow](development.md) | Package commands, verification, and review practices |
| [Troubleshooting](troubleshooting.md) | Startup, database, email, alias, and editor issues |

## Documentation ownership

Keep system design, entity relationships, and persistence rules in `docs/architecture/`.
Keep one request flow per file in `docs/flows/`, using top-down Mermaid charts with short
steps and labeled decisions. System diagrams and entity relationship diagrams stay in
their architecture guide. Keep Mermaid in Markdown fences so GitHub can render it.
Link to diagrams instead of copying them, and label proposed flows explicitly.

```text
docs/
  README.md
  architecture/
    system-overview.md
    database-schema.md
    accommodation-schema.md
  flows/
    README.md
    registration.md
    email-verification.md
    login.md
    protected-profile.md
    forgot-password.md
    reset-password.md
    profile-update.md
    reservation.md
  api.md
  getting-started.md
  configuration.md
  coding-standards.md
  development.md
  implementation-status.md
  troubleshooting.md
```

Documentation stays at the repository root because it covers both client and server.
Keep `api.md` as one contract reference until its size justifies an `api/` directory.
Add `decisions/` when recording an actual architectural decision with its context and
tradeoffs; no empty folders or payment/order docs are needed for the current scope.

The root [README](../README.md) introduces the project and local setup. This index routes
contributors to technical details; [Implementation status](implementation-status.md)
owns the feature inventory and known gaps. AI entry points link to these shared guides
instead of maintaining separate implementation snapshots.

These guides describe the checked-in source and current local changes, not a deployed service.
Route availability comes from [server/server.ts](../server/server.ts) and
[authRouter](../server/routes/auth.routes.ts) and [userRouter](../server/routes/user.routes.ts); exporting a controller
does not create a route. Update the relevant guide whenever routes, configuration, scripts,
schema fields, or implementation status change.

AI contributors must also follow [AGENTS.md](../AGENTS.md). The `.agent/` entry points
link to these developer guides so human and automated contributors share the same reference.
