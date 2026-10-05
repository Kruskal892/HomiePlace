# Implementation status

This is a source-based inventory, not evidence of deployment or successful runtime checks.

| Area | Current state |
| --- | --- |
| Frontend | React placeholder wrapped in BrowserRouter; no pages, API calls, or route definitions |
| Styling | Tailwind v4 CSS import and Vite plugin enabled |
| Database | MongoDB connection awaited before listening; User model exists |
| Registration | Mounted; account creation and OTP email exist, validation and authorization incomplete |
| Password reset | Mounted; hashed tokens, 15-minute expiry, atomic consumption, SMTP cleanup |
| Login | Mounted; signs one-hour JWTs |
| Profile | Auth and user profile routes mounted with `protect`; response field filtering incomplete |
| Email verification | Mounted; no enforced OTP expiry |
| Authentication and roles | `protect` attaches the user before continuing and rejects blocked users; `authorizeRoles` unattached |
| Uploads | Cloudinary, Multer, and Streamifier installed; no integration |
| Realtime | Socket.io installed; no initialization or events |
| Housing and roommates | No implemented models, APIs, or UI |
| Verification tooling | Package lint/format scripts; client build; focused profile test, no test scripts or server typecheck script |
| Deployment | No deployment workflow documented or verified |

## Auth work to finish

The mounted auth routes still have these concrete gaps:

- Registration accepts role input without permission checks. Validate all fields, restrict
  privileged roles, and handle duplicate-key races with deliberate responses.
- Registration OTP generation uses `Math.random`, has no enforced expiry, and has no resend
  flow. Email failure leaves the created account in the database.
- The user-module profile controllers select safe profile fields. The older auth-module
  profile controller still exposes token fields by excluding only the password.
- `authorizeRoles` calls `next()` on the allowed path but is not attached to any route.
- Login checks verification and blocked flags but does not enforce `isApproved`.
- Public-profile and profile-update controllers exist in the user module but are unmounted;
  avatar updates require a memory-storage upload middleware when a route is added.
- There is no rate limiter, centralized application error middleware, or durable email queue.
  CORS currently allows all origins.

These are documented implementation gaps; this documentation task does not fix them.

## Suggested integration order

1. Complete registration validation, role authorization, and verification token handling.
2. Define safe profile response fields.
3. Verify the mounted verification, login, and protected profile routes after correcting those gaps.
4. Add client pages and API integration for the mounted flows, including password reset.
5. Add focused automated tests, rate limits, and production configuration before public rollout.
6. Define housing and roommate requirements before introducing their models and APIs.

These steps are a guide for follow-up work, not committed delivery dates or existing features.
