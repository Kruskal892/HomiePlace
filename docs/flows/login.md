# Login

**Status:** Implemented backend flow with documented gaps.
**Endpoint:** `POST /api/auth/login`

## Flow

```mermaid
flowchart TD
    A("HTTP caller sends email and password") --> B
    subgraph Controller["Auth controller: loginUser"]
        B("Check required fields and email syntax") --> C("Input valid?"):::decision
        E("User found?"):::decision
        F("Email verified?"):::decision
        G("Compare password with bcrypt") --> H("Password matches?"):::decision
        I("Account blocked?"):::decision
        J("Sign JWT with id, role and one-hour expiry")
    end
    subgraph Database["MongoDB: User"]
        D[("Find user by email")]
    end
    subgraph Responses["HTTP response: terminal outcomes"]
        Bad("400: Missing fields or invalid credentials"):::error
        Unverified("403: Email not verified"):::error
        Blocked("403: Account blocked"):::error
        Failure("500: Controller failure"):::error
        OK("200: Login message and JWT"):::success
    end
    C -- No --> Bad
    C -- Yes --> D
    D --> E
    D -. Query failure .-> Failure
    E -- No --> Bad
    E -- Yes --> F
    F -- No --> Unverified
    F -- Yes --> G
    G -. Hash comparison failure .-> Failure
    H -- No --> Bad
    H -- Yes --> I
    I -- Yes --> Blocked
    I -- No --> J
    J -. Signing or configuration failure .-> Failure
    J --> OK

    classDef default fill:#062b49,stroke:#245571,color:#a8ddff,rx:14,ry:14;
    classDef decision fill:#061923,stroke:#3892b9,color:#a8ddff,stroke-dasharray:4 3;
    classDef error fill:#351b24,stroke:#ad6579,color:#ffd6df;
    classDef success fill:#103c35,stroke:#4b9987,color:#c7f5e8;
    linkStyle default stroke:#8a98a5,stroke-width:1px;
```

## Behavior and limitations

The chart follows the current check order: verification precedes password comparison,
and blocked status follows it. `isApproved` is not checked. Signing requires `JWT_SECRET`;
unexpected failures, including signing failures, return 500.

Next: [Protected profile reads](protected-profile.md).

Source: [controller](../../server/controller/auth/auth.controller.ts). See the
[API reference](../api.md), [implementation gaps](../implementation-status.md),
and [flow index](README.md).

## State changes and review scenarios

Login reads account state and creates a signed token; it does not update the user or
persist a session. The JWT carries id and role, but protected requests reload the user
from MongoDB and use its current role and blocked status. No refresh-token flow is mounted.

Source-based scenarios to verify; these requests were not run as part of this documentation change:

| Scenario | Expected response | Persistent effect |
| --- | --- | --- |
| Verified, unblocked account with matching password | 200 with one-hour JWT | No user write |
| Missing user or incorrect password | 400 | No user write |
| Unverified or blocked account | 403, following the check order above | No user write |
| Missing signing secret or database failure | 500 | No session is persisted |
