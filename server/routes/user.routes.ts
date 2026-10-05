import express from "express";
import { getUserProfile } from "#controller/user/user.controller";
import { protect } from "#middleware";

export const userRouter = express.Router();

userRouter.get("/profile", protect, getUserProfile);
