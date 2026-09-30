import jwt from "jsonwebtoken";
import bycrypt from "bcryptjs";
import type { Request, Response } from "express";
import User from "../models/user.model";
import sendEmail from "../utils/sendEmail";
import { verificationEmailTemplate } from "../utils/emailTemplates";
import type { AuthenticatedRequest, LoginRequestBody, LoginResponseBody, RegisterRequestBody, RegisterResponseBody } from "./auth.types";

//Register a new user
export const registerUser = async (req: Request<{}, {}, RegisterRequestBody>, res: Response<RegisterResponseBody>): Promise<Response | void> => {
  try {
    const { name, email, password, role } = req.body;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bycrypt.hash(password, 10);

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isApproved: role !== "manager",
      verificationToken,
    });

    try {
      await sendEmail({
        to: email,
        subject: "HomiePlace — Verify Your Email",
        html: verificationEmailTemplate(name, verificationToken),
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      return res.status(500).json({ message: "Error sending verification email" });
    }

    return res.status(201).json({
      message: "User registered. Please check your email for verification.",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login a user
export const loginUser = async (req: Request<{}, {}, LoginRequestBody>, res: Response<LoginResponseBody>): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const isMatched = await bycrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
    }

    //Token expires in 1 hour
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get user profile
export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<Response | void> => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Verify Email
export const verifyEmail = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }
    if (user.verificationToken !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return res.status(200).json({ message: "Email verified successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
