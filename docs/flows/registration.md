# User registration

**Status:** Implemented backend flow with documented gaps.
**Endpoint:** `POST /api/auth/register`

## Flow

```mermaid
flowchart TD
    A("HTTP caller submits name, email, password<br/>and role") --> B
    subgraph Controller["Auth controller: registerUser"]
        B("Validate email syntax") --> C("Email valid?"):::decision
        E("User already exists?"):::decision
        F("Hash password and generate six-digit OTP")
        G("Prepare unverified account; manager input<br/>sets isApproved false")
    end
    subgraph Database["MongoDB: User"]
        D[("Find user by email")]
        Store[("Create user with password hash and plaintext OTP")]
    end
    subgraph Mail["External service: Gmail SMTP"]
        Send("Send verification email")
    end
    subgraph Responses["HTTP response: terminal outcomes"]
        Invalid("400: Invalid email"):::error
        Exists("400: User already exists"):::error
        Failure("500: Controller failure"):::error
        MailFailure("500: Email delivery failed; user remains<br/>stored"):::error
        OK("201: Registration message; email, name and<br/>role"):::success
    end
    C -- No --> Invalid
    C -- Yes --> D
    D --> E
    D -. Query failure .-> Failure
    E -- Yes --> Exists
    E -- No --> F
    F -. Hashing failure .-> Failure
    F --> G --> Store
    Store -. Validation or duplicate-key race .-> Failure
    Store --> Send
    Send -. Delivery failure .-> MailFailure
    Send --> OK

    classDef default fill:#062b49,stroke:#245571,color:#a8ddff,rx:14,ry:14;
    classDef decision fill:#061923,stroke:#3892b9,color:#a8ddff,stroke-dasharray:4 3;
    classDef error fill:#351b24,stroke:#ad6579,color:#ffd6df;
    classDef success fill:#103c35,stroke:#4b9987,color:#c7f5e8;
    linkStyle default stroke:#8a98a5,stroke-width:1px;
```

## Behavior and limitations

Only email syntax is explicitly validated before the lookup. Complete boundary validation
and privileged-role authorization remain unfinished. OTP generation uses `Math.random`,
expiry is not enforced, and there is no resend route. Unexpected failures return 500.

Next: [Email verification](email-verification.md).

Source: [controller](../../server/controller/auth/auth.controller.ts). See the
[API reference](../api.md), [implementation gaps](../implementation-status.md),
and [flow index](README.md).

## State changes and review scenarios

A successful database insert persists the account before SMTP delivery. There is no
transaction spanning MongoDB and SMTP, and a failed email does not roll back the user.
The pre-insert lookup does not prevent concurrent inserts; the unique email index is
the constraint, and a duplicate-key race currently becomes 500 rather than 400.

Source-based scenarios to verify; these requests were not run as part of this documentation change:

| Scenario | Expected response | Persistent effect |
| --- | --- | --- |
| New email and successful SMTP | 201 | Unverified user and OTP stored; password hashed |
| Email already present at lookup | 400 | No new account |
| SMTP fails after insert | 500 | Account and OTP remain; retry can return already exists |
| Concurrent inserts for same email | One insert can succeed; losing duplicate-key request returns 500 | Unique index must exist in MongoDB to enforce uniqueness |
