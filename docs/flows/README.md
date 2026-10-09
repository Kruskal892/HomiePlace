# Request flows

Read each chart from top to bottom. Named groups identify ownership: middleware,
controller, MongoDB, external services, and HTTP responses. These are responsibilities
inside the existing application, not additional services or layers to implement.

Rounded blue boxes are steps, dashed boxes are decisions, and cylinders are database
operations. Solid arrows show normal processing; dashed arrows label failures or
recovery. Green boxes show successful responses/outcomes and red boxes show rejected
or failed outcomes. Labels carry the meaning independently of color. In the reset
request chart, the thick arrow marks work continuing after the 202 response, not a queue.

| Flow | Endpoint | Status |
| --- | --- | --- |
| [Registration](registration.md) | `POST /api/auth/register` | Mounted; validation and role authorization incomplete |
| [Email verification](email-verification.md) | `POST /api/auth/verify-email` | Mounted; OTP expiry absent |
| [Login](login.md) | `POST /api/auth/login` | Mounted; issues one-hour JWT |
| [Protected profile reads](protected-profile.md) | `GET /api/auth/profile`, `GET /api/users/profile` | Mounted; uses protect middleware |
| [Request password reset](forgot-password.md) | `POST /api/auth/forgot-password` | Mounted; email runs after acknowledgement |
| [Submit new password](reset-password.md) | `POST /api/auth/reset-password/:token` | Mounted; atomic single-use token consumption |
| [Profile update and avatar upload](profile-update.md) | `PUT /api/users/profile` | Mounted; upload limits and cleanup absent |
| [Reservation](reservation.md) | No endpoint | Proposed; not implemented |

These charts document backend behavior; the React client is still a placeholder. They
are not evidence of successful runtime checks. Exact contracts live in the
[API reference](../api.md) and known gaps in [Implementation status](../implementation-status.md).
System and relationship diagrams live with [architecture](../architecture/system-overview.md)
and the [database schema](../architecture/database-schema.md#schema-relationships).

## Maintaining charts

Keep one request flow per file, with its endpoint/status, ownership groups, top-down
chart, behavior/limitations, source links, and state-change/review scenarios. Use
`flowchart TD`, short rounded steps, labeled branches, and the existing inline styles.
Use entity relationship diagrams for schemas; add sequence diagrams only when timing
or interactions need a separate view.

Each chart should let a reviewer answer:

- Where does the request enter, and which component handles each step?
- Which validation and authentication checks actually run, and in what order?
- What does the database read or write, and which writes are atomic?
- What happens if a database operation or external service fails?
- What response reaches the caller, and what state remains afterward?
- Which behavior is implemented, which is proposed, and which scenarios need verification?

Preserve the current execution order even when it reveals a gap. Keep the successful
path readable, label important failure edges, and describe uncommon exceptions in
prose. Do not invent transactions, queues, authorization, retries, or endpoints to
make an implemented flow appear complete. Proposed designs must identify unresolved
decisions. Review scenarios are expected outcomes, not evidence of executed tests.

Validate all Mermaid blocks with a Mermaid parser after changing diagrams; Markdown
link and code-fence checks do not validate diagram syntax. In `linkStyle`, keep a
property such as `stroke-width` after a hex color before the terminating semicolon.

Return to the [developer documentation](../README.md).
