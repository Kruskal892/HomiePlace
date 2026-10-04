import jwt from "jsonwebtoken";

import type { NextFunction, Response } from "express";

import type { JwtPayload } from "jsonwebtoken";

import { User } from "#models";

import type {
  AuthenticatedRequest,
  AuthErrorResponseBody,
  AuthTokenPayload,
} from "#controller";

const isAuthTokenPayload = (payload: string | JwtPayload): payload is AuthTokenPayload =>
  typeof payload !== "string" && typeof payload.id === "string" && payload.id.length > 0;

export const protect = async (
  req: AuthenticatedRequest,
  res: Response<AuthErrorResponseBody>,
  next: NextFunction,
): Promise<Response<AuthErrorResponseBody> | void> => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "Authentication is not configured",
    });
  }

  try {
    const authorization = req.headers.authorization;
    const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, secret);

    if (!isAuthTokenPayload(decoded)) {
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user not found",
      });
    }
    if (req.user && req.user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
      });
    }
    next();

    req.user = { id: user.id, role: user.role, isBlocked: user.isBlocked };

    next();
  } catch {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

// Role-based access control middleware
export const authorizeRoles = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response<AuthErrorResponseBody>,
    // next: NextFunction,
  ) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have access to this resource" });
    }
  };
};
