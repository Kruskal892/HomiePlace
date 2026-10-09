# HomiePlace agent guidelines

Read this overview and all three guides before proposing or changing code.

The guides below link to the shared [developer documentation](../docs/README.md).
Maintain project details in `docs/` so developers and agents use the same reference.

## Shared project reference

Use [Architecture](../docs/architecture/system-overview.md) for source ownership and runtime behavior,
[Implementation status](../docs/implementation-status.md) for existing features and gaps,
and [Request flows](../docs/flows/README.md) for visual walkthroughs. Verify
relevant claims against the source rather than treating documentation as runtime evidence.

## Required guides

1. [Architecture and implementation status](architecture.md): actual files, data flow, and implementation gaps.
2. [Coding standards](coding-standards.md): client/server conventions and security boundaries.
3. [Workflows](workflows.md): commands, environment variables, and verification.

## Golden rules

1. Never stage or commit dependencies, local environment files, credentials, or generated output. Respect [.gitignore](../.gitignore).
2. Run commands in the appropriate package and keep client/server dependencies separate.
3. Use TypeScript and ES module imports/exports. Do not introduce CommonJS or client `any` types.
4. Reuse existing code; add directories and abstractions only when needed.
5. Validate untrusted input at runtime. Request types do not validate HTTP bodies. Hash passwords and enforce authorization server-side.
6. Keep UI accessible, responsive, and consistent with the existing Tailwind v4 setup.
7. Do not run lint or build unless explicitly requested. Report only checks actually performed.
8. Distinguish installed dependencies, unfinished code, and working features.

## Maintaining documentation

Follow the [documentation ownership rules](../docs/README.md#documentation-ownership).
Keep design and schema docs in `docs/architecture/` and one top-down request chart per
file in `docs/flows/`. Keep these AI guides focused on instructions and links. Update
affected guides and diagrams with behavior changes; label proposed flows and record
only checks actually performed.
