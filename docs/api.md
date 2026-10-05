# API reference

Local base URL: `http://localhost:5000`. [server/server.ts](../server/server.ts) mounts
[authRouter](../server/routes/auth.routes.ts) at `/api/auth`.
JSON requests use `Content-Type: application/json`; the parser limits bodies to 10 KB.
Both profile routes use `protect`; the remaining auth routes do not use authentication middleware.

| Method | Route | Current behavior |
| --- | --- | --- |
| GET | `/` | 200 plain text `Hello World` |
| POST | `/api/auth/register` | Create an account and send a verification OTP |
| POST | `/api/auth/login` | Check credentials and account flags, then issue a one-hour JWT |
| POST | `/api/auth/verify-email` | Compare the OTP and mark the account verified |
| GET | `/api/auth/profile` | Existing auth-module profile handler with `protect` |
| GET | `/api/users/profile` | User-module profile handler with `protect`; returns selected profile fields, 401 without a user, and 404 when not found |
| POST | `/api/auth/forgot-password` | Accept a reset request and attempt email delivery |
| POST | `/api/auth/reset-password/:token` | Consume an unexpired token and replace the password |

Mounted routes still have the gaps documented in [Implementation status](implementation-status.md).
Parser and framework errors have no custom centralized
JSON error envelope; auth controllers also use different response shapes.

## Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Example Developer",
  "email": "developer@example.com",
  "password": "a long example password",
  "role": "user"
}
```

`role` is optional and defaults to `user` in the schema. The current controller passes role
input through, including privileged schema roles, without authorization. Public role handling
and complete name/password validation must be completed before public use. The controller
does not consume the request type's optional `isApproved`; it computes approval from role input.

Successful email delivery returns 201:

```json
{
  "message": "User registered. Please check your email for verification.",
  "user": {
    "email": "developer@example.com",
    "name": "Example Developer",
    "role": "user"
  }
}
```

| Status | Meaning |
| --- | --- |
| 400 | Invalid email or account already exists |
| 500 | Email delivery failed or an unexpected registration error occurred |

The user is saved before SMTP delivery. A delivery failure returns 500 but leaves the account
stored, so retrying registration can return `User already exists`. There is no resend route.
The OTP uses `Math.random`; expiry mentioned in the email is not enforced.

## Verification, login, and profile

1. Submit `POST /api/auth/verify-email` with JSON `{ "email": "developer@example.com", "otp": "123456" }`,
   using the OTP from the registration email. Success returns 200 with `success: true`.
2. Submit `POST /api/auth/login` with JSON `{ "email": "developer@example.com", "password": "a long example password" }`.
   Success returns 200 with a JWT in `token`. Login requires `JWT_SECRET`; unverified or
   blocked accounts return 403, and invalid credentials return 400.
3. Submit `GET /api/auth/profile` with `Authorization: Bearer <token>`.
   The controller returns `{ "success": true, "user": ... }`, excluding only the password.

To test the user-module controller, use `GET http://localhost:5000/api/users/profile` in
Postman, select Authorization ? Bearer Token, and paste the login response token. No request
body is needed. Without a token, expect 401; blocked users receive 403. `JWT_SECRET` must
be configured. The user-module controller returns only identity, contact, avatar, role,
and timestamp fields. The older auth-module controller still excludes only the password.

The user module also contains public-profile and update controllers, which are not mounted
yet. Public lookup validates a MongoDB ID and selects `name`, `avatar`, `role`, and `createdAt`.
Update validates optional string fields `name`, `phone`, and `address`, requires an authenticated
user, and accepts an avatar only through `req.file.buffer` from Multer memory storage.
It does not accept role changes or avatar URLs from the request body.

## Forgot password

```http
POST /api/auth/forgot-password
Content-Type: application/json
```

```json
{ "email": "developer@example.com" }
```

For a valid email and configured client origin, both existing and nonexistent accounts receive 202:

```json
{
  "message": "If an account exists, password reset instructions will be sent.",
  "success": true
}
```

202 acknowledges the request, not email delivery. After responding, the controller stores
a token hash and 15-minute expiry for a matching user, then sends the original token in a link
of the form `CLIENT_URL/reset-password/<token>`. Work runs in the current Node process and
does not survive a restart. An unknown email receives no message.

| Status | Meaning |
| --- | --- |
| 400 | Invalid email input |
| 503 | Missing or invalid `CLIENT_URL` |

## Reset password

Copy the 40-character lowercase hexadecimal token from the email link. The frontend reset
page does not exist yet; submit the token to the backend using Postman.

```http
POST /api/auth/reset-password/<token>
Content-Type: application/json
```

```json
{
  "password": "my new secure password",
  "confirmPassword": "my new secure password"
}
```

Passwords must match, contain at least 15 Unicode code points, and fit within 72 UTF-8 bytes.
A successful reset returns 200:

```json
{
  "message": "Password updated. Sign in with your new password.",
  "success": true
}
```

| Status | Meaning |
| --- | --- |
| 400 | Malformed, expired, or used token; invalid password; mismatched confirmation |
| 500 | Password update failed |

Both password-reset endpoints send `Cache-Control: no-store`. Reset does not issue a login
token or alter approval, verification, or blocked flags. The reset token is single use.

## Manual verification

With MongoDB and the server running, check `GET /` first. For registration, use a disposable
local account and configured SMTP credentials; inspect the response and email. For reset,
request an email for that account, submit its token, then submit it again and expect 400.
Also check invalid email, unknown email, mismatched passwords, and malformed tokens.
These requests mutate local account data and may send email. No retained automated API tests
or test script exist. Record which requests were actually performed in your change description.
