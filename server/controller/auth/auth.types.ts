import type { Request } from "express";

import type { JwtPayload } from "jsonwebtoken";

export interface AuthTokenPayload extends JwtPayload {
  id: string;
}

export interface AuthErrorResponseBody {
  message: string;
}

export interface AuthenticatedRequest extends Request {
  user?: { id: string; isBlocked?: boolean; role: string };
}

export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role?: "user" | "manager" | "admin";
  isApproved?: boolean;
}

export interface RegisterResponseBody {
  message: string;
  user?: {
    email: string;
    name: string;
    role: string;
  };
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseBody {
  message: string;
  token?: string;
}

export interface VerifyEmailRequestBody {
  email: string;
  otp: string;
}

export interface VerifyEmailResponseBody {
  message: string;
  success?: boolean;
}

export interface ForgotPasswordRequestBody {
  email: string;
}

export interface ResetPasswordRequestBody {
  password: string;
  confirmPassword: string;
}

export interface PasswordResetResponseBody {
  message: string;
  success: boolean;
}
