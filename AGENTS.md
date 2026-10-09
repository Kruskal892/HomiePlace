# HomiePlace agent instructions

Read these guides before proposing or changing code:

- [Overview and golden rules](.agent/README.md)
- [Architecture and implementation status](.agent/architecture.md)
- [Coding standards](.agent/coding-standards.md)
- [Workflows and environment](.agent/workflows.md)

## Shared project reference

Use [docs/README.md](docs/README.md) as the documentation index.
Read [Architecture](docs/architecture/system-overview.md) and
[Implementation status](docs/implementation-status.md) for the current baseline;
verify relevant claims against source before changing behavior.

System and schema diagrams live in `docs/architecture/`. Request charts live in
[docs/flows/](docs/flows/README.md), one top-down flow per file with labeled decisions.
When behavior changes, update the relevant API, data model, configuration, status, and
diagram guides. Follow the [documentation ownership rules](docs/README.md#documentation-ownership)
and keep implementation details in shared docs rather than duplicating them here.

## Constraints

- Use TypeScript and import/export; never CommonJS or client `any`.
- Keep client/server code and npm commands within their respective packages.
- Never stage or commit node_modules, local environment files, credentials, or build output.
- Do not run lint or build unless explicitly requested. Never claim unperformed checks passed.
