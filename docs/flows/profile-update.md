# Profile update and avatar upload

**Status:** Implemented backend flow with documented gaps.
**Endpoint:** `PUT /api/users/profile`

## Flow

```mermaid
flowchart TD
    A("HTTP caller submits JSON or multipart<br/>profile update") --> Auth
    subgraph Middleware["Middleware: protect then upload.single avatar"]
        Auth("Authenticate caller and load current user") --> Passed("Authentication passed?"):::decision
        Upload("Multer memory storage; parse optional avatar")
    end
    subgraph Controller["User controller: updateUserProfile"]
        Guard("req.user present?"):::decision
        Valid("Body object, optional name, phone, address<br/>and file buffer valid?"):::decision
        Found("User exists?"):::decision
        File("Avatar file supplied?"):::decision
        Remove("removeAvatar is exactly the string true?"):::decision
        Clear("Set avatar URL to null")
        Keep("Leave avatar unchanged")
        SetURL("Set avatar to uploaded secure URL")
        Text("Trim and apply supplied name, phone and<br/>address")
    end
    subgraph Database["MongoDB: User"]
        Load[("Load selected user fields by req.user.id")]
        Save[("Save updated user document")]
    end
    subgraph Cloud["External service: Cloudinary"]
        Send("Upload avatar buffer to avatars folder")
    end
    subgraph Responses["HTTP response: terminal outcomes"]
        AuthError("401, 403 or 500: Authentication error"):::error
        MultipartError("Express default middleware error response"):::error
        Invalid("400: Invalid profile data or memory buffer"):::error
        Missing("404: User not found"):::error
        Failure("500: Controller failure"):::error
        OK("200: Updated selected profile; success true"):::success
    end
    Passed -- No --> AuthError
    Passed -- Yes --> Upload
    Upload -. Multipart or file-field error .-> MultipartError
    Upload --> Guard
    Guard -- No --> AuthError
    Guard -- Yes --> Valid
    Valid -- No --> Invalid
    Valid -- Yes --> Load
    Load -. Query failure .-> Failure
    Load --> Found
    Found -- No --> Missing
    Found -- Yes --> File
    File -- Yes --> Send
    Send -. Upload failure .-> Failure
    Send --> SetURL --> Text
    File -- No --> Remove
    Remove -- Yes --> Clear --> Text
    Remove -- No --> Keep --> Text
    Text --> Save
    Save -. Save failure; uploaded asset may remain .-> Failure
    Save --> OK

    classDef default fill:#062b49,stroke:#245571,color:#a8ddff,rx:14,ry:14;
    classDef decision fill:#061923,stroke:#3892b9,color:#a8ddff,stroke-dasharray:4 3;
    classDef error fill:#351b24,stroke:#ad6579,color:#ffd6df;
    classDef success fill:#103c35,stroke:#4b9987,color:#c7f5e8;
    linkStyle default stroke:#8a98a5,stroke-width:1px;
```

## Behavior and limitations

The file takes precedence over the exact string `removeAvatar="true"`; a JSON boolean
does not remove an avatar. Text-only updates do not need Cloudinary credentials. Upload
or save failures return 500; Multer can reject before the controller and uses default
Express error handling. See [protected reads](protected-profile.md) for authentication.

Uploads have no size/type limits. Replacing or removing an avatar does not delete its
Cloudinary asset; an upload followed by a failed save can leave an unused asset.

Source: [controller](../../server/controller/user/user.controller.ts). See the
[API reference](../api.md), [implementation gaps](../implementation-status.md),
and [flow index](README.md).

## State changes and review scenarios

MongoDB and Cloudinary are separate write boundaries with no shared transaction. The
controller uploads first and saves the user second. A save failure can leave an orphaned
asset. Replacing/removing the URL does not delete the old asset. This flow does not allow
body fields to change role, email, password, or set an arbitrary avatar URL.

Source-based scenarios to verify; these requests were not run as part of this documentation change:

| Scenario | Expected response | Persistent effect |
| --- | --- | --- |
| Valid text-only update | 200 | Supplied allowed fields trimmed and saved; no upload |
| Avatar file plus removeAvatar string true | 200 if upload/save succeed | Uploaded URL wins; old Cloudinary asset remains |
| Cloudinary upload fails | 500 | Updated profile is not saved |
| Upload succeeds but MongoDB save fails | 500 | Uploaded asset can remain without a saved user reference |
