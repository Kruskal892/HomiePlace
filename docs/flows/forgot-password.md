# Request a password reset

**Status:** Implemented backend flow with documented gaps.
**Endpoint:** `POST /api/auth/forgot-password`

## Flow

```mermaid
flowchart TD
    A("HTTP caller submits email") --> B
    subgraph Request["Auth controller: before acknowledgement"]
        B("Set Cache-Control no-store; validate email") --> C("Email valid?"):::decision
        Token("Generate random 20-byte token")
        Link("Build reset link from configured CLIENT_URL")
    end
    subgraph Responses["HTTP response"]
        Invalid("400: Invalid email"):::error
        Config("503: Invalid client-origin configuration"):::error
        Accepted("202: Same acknowledgement for existing and<br/>unknown accounts"):::success
    end
    subgraph Work["Same Node process: after response, no durable queue"]
        Hash("Compute SHA-256 token hash")
        Found("Account found?"):::decision
        Stop("Finish without sending email")
        Log("Log processing failure; response is already<br/>sent"):::error
        Done("Processing finished; no second HTTP response")
    end
    subgraph Database["MongoDB: User"]
        Update[("Find by email; atomically store hash and 15-minute expiry")]
        Cleanup[("Clear reset fields only where user id and stored hash still match")]
    end
    subgraph Mail["External service: Gmail SMTP"]
        Send("Email trusted reset URL containing raw token")
    end
    C -- No --> Invalid
    C -- Yes --> Token --> Link
    Link -. Configuration or origin rejected .-> Config
    Link --> Accepted
    Accepted == Continue after acknowledgement ==> Hash
    Hash --> Update
    Update -. Query failure .-> Log
    Update --> Found
    Found -- No --> Stop
    Found -- Yes --> Send
    Send --> Done
    Send -. Delivery failure .-> Cleanup
    Cleanup --> Done
    Cleanup -. Cleanup failure .-> Log

    classDef default fill:#062b49,stroke:#245571,color:#a8ddff,rx:14,ry:14;
    classDef decision fill:#061923,stroke:#3892b9,color:#a8ddff,stroke-dasharray:4 3;
    classDef error fill:#351b24,stroke:#ad6579,color:#ffd6df;
    classDef success fill:#103c35,stroke:#4b9987,color:#c7f5e8;
    linkStyle default stroke:#8a98a5,stroke-width:1px;
```

## Behavior and limitations

The same 202 response is sent before database lookup for existing and unknown accounts.
It does not confirm delivery. Work is not queued durably and does not survive restarts.
Processing failures are logged; they cannot change the response already sent. Both reset
endpoints send `Cache-Control: no-store`.

Next: [Submit a new password](reset-password.md).

Source: [controller](../../server/controller/auth/auth.controller.ts). See the
[API reference](../api.md), [implementation gaps](../implementation-status.md),
and [flow index](README.md).

## State changes and review scenarios

A new request replaces any previous reset hash and expiry. SMTP cleanup includes both
user id and that request's hash, so it does not clear a newer request's token. The raw
token is emailed; only its SHA-256 hash is persisted. A process exit after acknowledgement
can interrupt processing without notifying the caller.

Source-based scenarios to verify; these requests were not run as part of this documentation change:

| Scenario | Expected response | Persistent effect |
| --- | --- | --- |
| Valid known email and successful delivery | 202 before lookup/delivery | New hash and 15-minute expiry stored |
| Valid unknown email | Same 202 | No user update and no email |
| SMTP fails | Already-sent 202 remains | Matching reset fields cleared if cleanup succeeds |
| New request replaces token before old SMTP cleanup | Both callers already received 202 | Old cleanup leaves newer hash intact |
