import express from "express";

import { getPublicUserProfile, getUserProfile, updateUserProfile } from "#controller";

import { protect, upload } from "#middleware";

export const userRouter = express.Router();

userRouter.get("/profile", protect, getUserProfile);
userRouter.put("/profile", protect, upload.single("avatar"), updateUserProfile);
userRouter.get("/profile/:id", getPublicUserProfile);

export default userRouter;
