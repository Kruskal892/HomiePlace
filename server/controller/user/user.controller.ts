import type { Request, Response } from "express";

import type {} from "multer";

import { isObjectIdOrHexString } from "mongoose";

import type { AuthenticatedRequest } from "#controller";

import { User } from "#models";

import { uploadToCloudinary } from "#utils";

import type {
  ProfileResponseBody,
  PublicProfileResponseBody,
  UpdateUserProfileRequest,
} from "./user.types.ts";

// Get user profile
export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response<ProfileResponseBody>,
): Promise<Response<ProfileResponseBody>> => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const user = await User.findById(req.user.id).select(
      "name email phone address avatar role createdAt updatedAt",
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get public user profile by ID
export const getPublicUserProfile = async (
  req: Request<{ id: string }, PublicProfileResponseBody>,
  res: Response<PublicProfileResponseBody>,
): Promise<Response<PublicProfileResponseBody>> => {
  if (!isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }
  try {
    const user = await User.findById(req.params.id).select("name avatar role createdAt");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update user profile
export const updateUserProfile = async (
  req: UpdateUserProfileRequest,
  res: Response<ProfileResponseBody>,
): Promise<Response<ProfileResponseBody>> => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ success: false, message: "Invalid profile data" });
  }
  const { name, phone, address } = body;
  if (
    (name !== undefined && (typeof name !== "string" || !name.trim())) ||
    (phone !== undefined && typeof phone !== "string") ||
    (address !== undefined && typeof address !== "string")
  ) {
    return res.status(400).json({ success: false, message: "Invalid profile data" });
  }
  if (req.file && !Buffer.isBuffer(req.file.buffer)) {
    return res
      .status(400)
      .json({ success: false, message: "Upload requires memory storage" });
  }
  try {
    const user = await User.findById(req.user.id).select(
      "name email phone address avatar role createdAt updatedAt",
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Image handling logic
    if (req.file) {
      user.avatar = await uploadToCloudinary(req.file.buffer, "avatars");
    } else if (req.body.removeAvatar === "true") {
      user.avatar = null;
    }

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (address !== undefined) user.address = address.trim();

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: (error as Error).message || "Server Error" });
  }
};
