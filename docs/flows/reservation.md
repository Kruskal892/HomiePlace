# Reservation flow

**Status:** Proposed; not implemented. There is no booking endpoint yet.

## Flow

```mermaid
flowchart TD
    A("Guest requests room type, dates, quantity<br/>and headcount") --> Validate
    subgraph Application["Proposed application validation: no endpoint yet"]
        Validate("Check guest, references, published property,<br/>active room type, dates and capacity")
        Valid("Request valid?"):::decision
        Price("Read trusted server price; calculate saved<br/>booking total")
    end
    subgraph Transaction["Proposed MongoDB transaction: all writes share one session"]
        Begin("Start transaction")
        Next("Next occupied night in checkIn inclusive to<br/>checkOut exclusive")
        Decrement[("Update initialized inventory only if remainingUnits is at least quantity")]
        Matched("One inventory row matched?"):::decision
        More("More occupied nights?"):::decision
        Create[("Create confirmed booking with price snapshot")]
        Commit("Commit transaction")
        Abort("Abort transaction; roll back inventory and<br/>booking writes"):::error
    end
    subgraph Recovery["Proposed transaction error handling"]
        Retry("Classify error using MongoDB transaction<br/>retry semantics")
        Whole("Transient transaction error: retry whole<br/>transaction within chosen bounds")
        CommitOnly("Unknown commit result: retry commit; do not<br/>create another booking blindly")
        Stop("Non-retryable or retry limit reached:<br/>surface failure; reconcile uncertain outcome"):::error
    end
    subgraph Outcomes["Proposed outcomes: HTTP contract not defined"]
        Invalid("Reject invalid request"):::error
        Unavailable("Report unavailable; no partial reservation"):::error
        OK("Return confirmed booking after acknowledged<br/>commit"):::success
    end
    Validate --> Valid
    Valid -- No --> Invalid
    Valid -- Yes --> Price --> Begin --> Next --> Decrement
    Decrement --> Matched
    Matched -- No --> Abort --> Unavailable
    Matched -- Yes --> More
    More -- Yes --> Next
    More -- No --> Create --> Commit --> OK
    Decrement -. Operation error .-> Retry
    Create -. Creation error .-> Retry
    Commit -. Commit error .-> Retry
    Retry -- Transient transaction error --> Whole
    Whole -. Abort active transaction before retry .-> Begin
    Retry -- Unknown commit result --> CommitOnly
    CommitOnly --> Commit
    Retry -- Other or retries exhausted --> Stop

    classDef default fill:#062b49,stroke:#245571,color:#a8ddff,rx:14,ry:14;
    classDef decision fill:#061923,stroke:#3892b9,color:#a8ddff,stroke-dasharray:4 3;
    classDef error fill:#351b24,stroke:#ad6579,color:#ffd6df;
    classDef success fill:#103c35,stroke:#4b9987,color:#c7f5e8;
    linkStyle default stroke:#8a98a5,stroke-width:1px;
```

## Behavior and limitations

This design reserves `[checkIn, checkOut)`: checkout does not consume inventory. Each
night's update must require `remainingUnits >= quantity`. Missing inventory rows do not
imply availability. Inventory and booking writes must share a transaction; error and
retry handling must follow MongoDB transaction semantics.

Never accept client-supplied price, status, or inventory values. Cancellation must
transition status and restore inventory exactly once in a separate transaction.
See [accommodation constraints](../architecture/accommodation-schema.md#safe-reservation-flow-still-to-implement),
[schema relationships](../architecture/database-schema.md#schema-relationships), and
[flow index](README.md).

## Transaction boundaries and future acceptance checks

This is a design for future implementation, not a description of existing controllers.
A replica set or sharded MongoDB deployment is needed for transactions. All inventory
updates and booking creation must use the same session. Retry bounds, idempotency keys,
HTTP status codes, and recovery after an uncertain commit are not defined yet.

An unknown commit result is different from a confirmed abort: retry the commit according
to driver semantics, and do not blindly repeat booking creation. A transient transaction
error can require retrying the entire transaction. Choose a driver-supported transaction
API when implementing this flow and test its retry behavior against the deployment.

These are future acceptance checks, not executed tests:

| Scenario | Required result |
| --- | --- |
| Two guests compete for the last unit on an occupied night | Inventory never becomes negative; only the available quantity is confirmed |
| A later night has no inventory or insufficient units | Abort all earlier decrements; no booking persists |
| Booking creation fails after inventory updates | Roll back both inventory and booking writes |
| Commit result is uncertain or a transaction is retried | Resolve commit state without blindly creating duplicate bookings; define idempotency/recovery before rollout |
