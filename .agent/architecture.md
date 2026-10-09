# HomiePlace architecture and implementation status

Read [Architecture](../docs/architecture/system-overview.md) and [Implementation status](../docs/implementation-status.md)
before proposing or changing code. Consult the [data model](../docs/architecture/database-schema.md) and
[accommodation rules](../docs/architecture/accommodation-schema.md) when changing persistence.

System and relationship diagrams live with the architecture guides above. Request
flowcharts live in [docs/flows/](../docs/flows/README.md), one flow per file. Use top-down
steps and labeled decisions; update charts with behavior changes and label proposed flows.
Follow the [flow documentation conventions](../docs/flows/README.md#maintaining-charts):
show ownership, state changes, atomic operations, failures, and actual response outcomes.
Keep proposed guarantees separate from implemented behavior and parse-check every diagram.

Developer documentation is maintained in [docs/](../docs/README.md). Update that shared guide when project behavior or conventions change.
