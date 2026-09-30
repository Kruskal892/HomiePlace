import type { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { id: string };
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
