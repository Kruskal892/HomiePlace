# Implementation status

This is a source-based inventory, not evidence of deployment or successful runtime checks.

| Area | Current state |
| --- | --- |
| Frontend | React placeholder wrapped in BrowserRouter; no pages, API calls, or route definitions |
| Styling | Tailwind v4 CSS import and Vite plugin enabled |
| Database | MongoDB connection awaited before listening; User model exists |
| Registration | Mounted; account creation and OTP email exist, validation and authorization incomplete |
| Password reset | Mounted; hashed tokens, 15-minute expiry, atomic consumption, SMTP cleanup |
| Login | Controller exists and signs one-hour JWTs; unmounted |
| Profile | Controller exists; unmounted and response field filtering incomplete |
| Email verification | Controller exists; unmounted, no enforced OTP expiry |
| Authentication and roles | Middleware exports exist; unmounted and incomplete |
| Uploads | Cloudinary, Multer, and Streamifier installed; no integration |
| Realtime | Socket.io installed; no initialization or events |
| Housing and roommates | No implemented models, APIs, or UI |
| Verification tooling | Package lint/format scripts; client build; no test scripts or server typecheck script |
| Deployment | No deployment workflow documented or verified |

## Auth work to finish

Before integrating auth routes, review these concrete gaps:

- Registration accepts role input without permission checks. Validate all fields, restrict
  privileged roles, and handle duplicate-key races with deliberate responses.
- Registration OTP generation uses `Math.random`, has no enforced expiry, and has no resend
  flow. Email failure leaves the created account in the database.
- `protect` calls `next()` before assigning `req.user`, then calls it again. Its blocked check
  uses `req.user` instead of the just-loaded user. Correct request attachment, blocked checks,
  and middleware control flow before mounting it.
- `authorizeRoles` lacks `next()` on the allowed path. Complete it before attaching it to routes.
- Login checks verification and blocked flags but does not enforce `isApproved`.
- Profile excludes only the password; restrict returned fields so token data stays internal.
- There is no rate limiter, centralized application error middleware, or durable email queue.
  CORS currently allows all origins.

These are documented implementation gaps; this documentation task does not fix them.

## Suggested integration order

1. Complete registration validation, role authorization, and verification token handling.
2. Correct auth middleware and define safe profile response fields.
3. Mount and verify verification, login, and protected profile routes explicitly.
4. Add client pages and API integration for the mounted flows, including password reset.
5. Add focused automated tests, rate limits, and production configuration before public rollout.
6. Define housing and roommate requirements before introducing their models and APIs.

These steps are a guide for follow-up work, not committed delivery dates or existing features.
