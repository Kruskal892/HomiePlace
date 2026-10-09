# Submit a new password

**Status:** Implemented backend flow with documented gaps.
**Endpoint:** `POST /api/auth/reset-password/:token`

## Flow

```mermaid
flowchart TD
    A("HTTP caller submits URL token, password and<br/>confirmation") --> B
    subgraph Controller["Auth controller: resetPassword"]
        B("Set Cache-Control no-store") --> Token("Token is 40 lowercase hex characters?"):::decision
        Password("Password is a string, at least 15 code<br/>points and at most 72 UTF-8 bytes?"):::decision
        Confirm("Password and confirmation match?"):::decision
        Hash("Hash token with SHA-256; hash password with<br/>bcrypt")
        Found("Matching user updated?"):::decision
    end
    subgraph Database["MongoDB: one atomic User update"]
        Update[("Match token hash and future expiry; replace password and unset token plus expiry")]
    end
    subgraph Responses["HTTP response: terminal outcomes"]
        Invalid("400: Invalid or expired reset link"):::error
        Weak("400: Password violates length limits"):::error
        Mismatch("400: Passwords must match"):::error
        Failure("500: Password update failed"):::error
        OK("200: Password updated; sign in again"):::success
    end
    Token -- No --> Invalid
    Token -- Yes --> Password
    Password -- No --> Weak
    Password -- Yes --> Confirm
    Confirm -- No --> Mismatch
    Confirm -- Yes --> Hash
    Hash -. Hashing failure .-> Failure
    Hash --> Update
    Update -. Query failure .-> Failure
    Update --> Found
    Found -- No --> Invalid
    Found -- Yes --> OK

    classDef default fill:#062b49,stroke:#245571,color:#a8ddff,rx:14,ry:14;
    classDef decision fill:#061923,stroke:#3892b9,color:#a8ddff,stroke-dasharray:4 3;
    classDef error fill:#351b24,stroke:#ad6579,color:#ffd6df;
    classDef success fill:#103c35,stroke:#4b9987,color:#c7f5e8;
    linkStyle default stroke:#8a98a5,stroke-width:1px;
```

## Behavior and limitations

Passwords require at least 15 Unicode code points and at most 72 UTF-8 bytes. The atomic
update makes the token single use. Unexpected failures return 500. Reset does not issue
a JWT or alter approval, verification, or blocked flags. The frontend reset page is absent.
Both reset endpoints send `Cache-Control: no-store`.

Source: [controller](../../server/controller/auth/auth.controller.ts). See the
[API reference](../api.md), [implementation gaps](../implementation-status.md),
and [flow index](README.md).

## State changes and review scenarios

The password hash replacement and reset-field removal are one atomic update, conditional
on the token hash and a future expiry. Two requests cannot both consume the same stored
token. A separate, newer reset request can replace the hash before consumption.

Source-based scenarios to verify; these requests were not run as part of this documentation change:

| Scenario | Expected response | Persistent effect |
| --- | --- | --- |
| Valid unused token and matching valid passwords | 200 | Password replaced; reset fields removed |
| Expired, replaced, or already-used token | 400 | Password unchanged by this request |
| Concurrent submissions using the same token | At most one 200; others 400 | Only one atomic update matches |
| Invalid password length or mismatched confirmation | 400 | No database update |
