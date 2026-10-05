import {
  forgotPassword,
  getUserProfile,
  loginUser,
  registerUser,
  resetPassword,
  verifyEmail,
} from "#controller";

import { protect } from "#middleware";

import express from "express";

export const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

authRouter.get("/profile", protect, getUserProfile);
