# Email verification

**Status:** Implemented backend flow with documented gaps.
**Endpoint:** `POST /api/auth/verify-email`

## Flow

```mermaid
flowchart TD
    A("HTTP caller submits email and OTP") --> B
    subgraph Controller["Auth controller: verifyEmail"]
        B("Check email and OTP presence; validate email<br/>syntax") --> C("Input valid?"):::decision
        E("User exists?"):::decision
        F("Already verified?"):::decision
        G("OTP exactly matches stored token?"):::decision
        H("Set isVerified true and clear<br/>verificationToken")
    end
    subgraph Database["MongoDB: User"]
        D[("Find user by email")]
        Save[("Save updated user document")]
    end
    subgraph Responses["HTTP response: terminal outcomes"]
        Invalid("400: Invalid input"):::error
        Missing("404: User not found"):::error
        Verified("400: Already verified"):::error
        Mismatch("400: Invalid OTP"):::error
        Failure("500: Controller failure"):::error
        OK("200: Email verified; success true"):::success
    end
    C -- No --> Invalid
    C -- Yes --> D
    D --> E
    D -. Query failure .-> Failure
    E -- No --> Missing
    E -- Yes --> F
    F -- Yes --> Verified
    F -- No --> G
    G -- No --> Mismatch
    G -- Yes --> H --> Save
    Save -. Save failure .-> Failure
    Save --> OK

    classDef default fill:#062b49,stroke:#245571,color:#a8ddff,rx:14,ry:14;
    classDef decision fill:#061923,stroke:#3892b9,color:#a8ddff,stroke-dasharray:4 3;
    classDef error fill:#351b24,stroke:#ad6579,color:#ffd6df;
    classDef success fill:#103c35,stroke:#4b9987,color:#c7f5e8;
    linkStyle default stroke:#8a98a5,stroke-width:1px;
```

## Behavior and limitations

OTP comparison is exact. The handler does not check OTP expiry, despite the expiry
mentioned in the email template. Unexpected failures return 500.

Next: [Login](login.md).

Source: [controller](../../server/controller/auth/auth.controller.ts). See the
[API reference](../api.md), [implementation gaps](../implementation-status.md),
and [flow index](README.md).

## State changes and review scenarios

Successful verification saves `isVerified: true` and removes `verificationToken` in the
user document. Lookup and save are separate operations; this is not an atomic token
consumption operation like password reset. An unchanged OTP is accepted regardless of age.

Source-based scenarios to verify; these requests were not run as part of this documentation change:

| Scenario | Expected response | Persistent effect |
| --- | --- | --- |
| Matching OTP on unverified account | 200 | Account verified and OTP cleared |
| Incorrect OTP | 400 | Account unchanged |
| Already verified account | 400 | Account unchanged |
| User save fails | 500 | Verification is not confirmed to the caller |
