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
| Profile | Protected reads and updates mounted with selected fields; public lookup mounted without authentication |
| Email verification | Mounted; no enforced OTP expiry |
| Authentication and roles | `protect` attaches the user before continuing and rejects blocked users; `authorizeRoles` unattached |
| Uploads | Avatar uploads integrated with Multer memory storage, Streamifier, and Cloudinary; no size/type limits or asset cleanup |
| Realtime | Socket.io installed; no initialization or events |
| Housing and roommates | No implemented models, APIs, or UI |
| Verification tooling | Package lint/format scripts; client build; no retained automated tests, test scripts, or server typecheck script |
| Deployment | No deployment workflow documented or verified |

## Auth work to finish

The mounted auth routes still have these concrete gaps:

- Registration accepts role input without permission checks. Validate all fields, restrict
  privileged roles, and handle duplicate-key races with deliberate responses.
- Registration OTP generation uses `Math.random`, has no enforced expiry, and has no resend
  flow. Email failure leaves the created account in the database.
- Both mounted profile-read routes use the user-module handler and select profile fields.
  The renamed `getUserDetail` remains exported but unmounted and excludes only the password.
- `authorizeRoles` calls `next()` on the allowed path but is not attached to any route.
- Login checks verification and blocked flags but does not enforce `isApproved`.
- Public lookup and protected profile updates are mounted. Uploads lack size/type limits,
  asset cleanup, and centralized error responses; update failures return the error message.
  Public lookup does not filter blocked, unapproved, or unverified accounts.
- There is no rate limiter, centralized application error middleware, or durable email queue.
  CORS currently allows all origins.

These are documented implementation gaps; this documentation task does not fix them.

## Suggested integration order

1. Complete registration validation, role authorization, and verification token handling.
2. Add upload limits, file validation, safe error responses, and Cloudinary asset cleanup.
3. Verify the mounted verification, login, and protected profile routes after correcting those gaps.
4. Add client pages and API integration for the mounted flows, including password reset.
5. Add focused automated tests, rate limits, and production configuration before public rollout.
6. Define housing and roommate requirements before introducing their models and APIs.

These steps are a guide for follow-up work, not committed delivery dates or existing features.
