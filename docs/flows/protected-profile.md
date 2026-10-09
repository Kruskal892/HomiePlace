# Protected profile reads

**Status:** Implemented backend flow with documented gaps.
**Endpoint:** `GET /api/auth/profile` or `GET /api/users/profile`

## Flow

```mermaid
flowchart TD
    A("HTTP caller requests profile with Bearer<br/>token") --> B
    subgraph Middleware["Authentication middleware: protect"]
        B("JWT_SECRET configured?"):::decision
        C("Bearer token present?"):::decision
        V("Verify JWT signature and expiry")
        P("Payload contains nonempty string id?"):::decision
        E("User exists?"):::decision
        F("Account blocked?"):::decision
        G("Attach database id, role and blocked flag to<br/>req.user; call next once")
    end
    subgraph Database["MongoDB: User"]
        D[("Load user by decoded id")]
        Query[("Reload selected identity, contact, avatar, role and timestamps")]
    end
    subgraph Controller["User controller: getUserProfile"]
        Guard("req.user attached?"):::decision
        Found("User still exists?"):::decision
    end
    subgraph Responses["HTTP response: terminal outcomes"]
        Config("500: Authentication not configured"):::error
        Unauthorized("401: Not authorized"):::error
        Blocked("403: Account blocked"):::error
        Missing("404: User not found"):::error
        Failure("500: Profile query failed"):::error
        OK("200: Selected user fields; success true"):::success
    end
    B -- No --> Config
    B -- Yes --> C
    C -- No --> Unauthorized
    C -- Yes --> V
    V -. Invalid, expired or malformed token .-> Unauthorized
    V --> P
    P -- No --> Unauthorized
    P -- Yes --> D
    D -. Lookup or id-cast failure .-> Unauthorized
    D --> E
    E -- No --> Unauthorized
    E -- Yes --> F
    F -- Yes --> Blocked
    F -- No --> G --> Guard
    Guard -- No --> Unauthorized
    Guard -- Yes --> Query
    Query -. Query failure .-> Failure
    Query --> Found
    Found -- No --> Missing
    Found -- Yes --> OK

    classDef default fill:#062b49,stroke:#245571,color:#a8ddff,rx:14,ry:14;
    classDef decision fill:#061923,stroke:#3892b9,color:#a8ddff,stroke-dasharray:4 3;
    classDef error fill:#351b24,stroke:#ad6579,color:#ffd6df;
    classDef success fill:#103c35,stroke:#4b9987,color:#c7f5e8;
    linkStyle default stroke:#8a98a5,stroke-width:1px;
```

## Behavior and limitations

Both routes use the same user-module controller. `protect` authenticates and rejects
blocked users; it does not enforce roles, verification, or approval. `authorizeRoles`
is not mounted. Middleware lookup/verification errors return 401; controller query
errors return 500. Password and token fields are excluded from the profile response.

Source: [protect middleware](../../server/middleware/auth.middleware.ts).

Source: [controller](../../server/controller/user/user.controller.ts). See the
[API reference](../api.md), [implementation gaps](../implementation-status.md),
and [flow index](README.md).

## State changes and review scenarios

This flow has two database reads and no writes. The second read can return 404 if the
account disappears after authentication. Profile projection prevents credential/token
fields from appearing in the controller response. A token's role is not treated as the
current authorization source; `protect` reloads account state.

Source-based scenarios to verify; these requests were not run as part of this documentation change:

| Scenario | Expected response | Persistent effect |
| --- | --- | --- |
| Valid JWT for existing unblocked user | 200 with selected profile fields | No writes |
| Missing, expired, or invalid JWT | 401 | No writes |
| Account blocked after token issuance | 403 on next request | No writes |
| Middleware database lookup fails | 401 under current catch handling | No writes; error is not distinguished from invalid auth |
