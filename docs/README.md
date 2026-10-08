# HomiePlace developer documentation

HomiePlace aims to support shared housing, room finding, and roommate collaboration.
The current implementation is a frontend scaffold and a small Express authentication and user-profile backend with Cloudinary avatar uploads.
Housing, roommate, and messaging features are not implemented yet.

## Start here

1. Follow [Getting started](getting-started.md) to install dependencies and run locally.
2. Read [Architecture](architecture.md) to understand package boundaries and request flow.
3. Read [Coding standards](coding-standards.md) before changing code.
4. Use [Development workflow](development.md) for commands, formatting, and review.

## Reference guides

| Guide | What it covers |
| --- | --- |
| [API reference](api.md) | Mounted endpoints, payloads, responses, and manual API checks |
| [Data model](data-model.md) | User fields, defaults, indexes, and token storage |
| [Configuration](configuration.md) | Environment variables, ports, and server import aliases |
| [Implementation status](implementation-status.md) | Existing features, incomplete auth behavior, and next integration steps |
| [Troubleshooting](troubleshooting.md) | Startup, database, email, alias, and editor issues |

These guides describe the checked-in source and current local changes, not a deployed service.
Route availability comes from [server/server.ts](../server/server.ts) and
[authRouter](../server/routes/auth.routes.ts) and [userRouter](../server/routes/user.routes.ts); exporting a controller
does not create a route. Update the relevant guide whenever routes, configuration, scripts,
schema fields, or implementation status change.

AI contributors must also follow [AGENTS.md](../AGENTS.md). The `.agent/` entry points
link to these developer guides so human and automated contributors share the same reference.
