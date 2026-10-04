import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import type { Request, Response } from "express";

import type {
  AuthenticatedRequest,
  ForgotPasswordRequestBody,
  LoginRequestBody,
  LoginResponseBody,
  PasswordResetResponseBody,
  RegisterRequestBody,
  RegisterResponseBody,
  ResetPasswordRequestBody,
} from "#controller";
import { User } from "#models";
import { buildClientUrl, isValidEmail, sendEmail, verificationEmailTemplate } from "#utils";

//Register a new user
export const registerUser = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response<RegisterResponseBody>,
): Promise<Response | void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "A valid email address is required." });
    }
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
export const loginUser = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response<LoginResponseBody>,
): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email or password" });
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
      return res
        .status(403)
        .json({ message: "Your account has been blocked. Please contact support." });
    }

    //Token expires in 1 hour
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get user profile
export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<Response | void> => {
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
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "A valid email address is required." });
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

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordRequestBody>,
  res: Response<PasswordResetResponseBody>,
): Promise<Response | void> => {
  res.set("Cache-Control", "no-store");

  // 1. Validate the email before using it in a database query.
  const email = req.body?.email;
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "A valid email address is required.", success: false });
  }
  // 2. Build links only from the configured frontend origin.
  const resetToken = crypto.randomBytes(20).toString("hex");
  let resetUrl: string;
  try {
    resetUrl = buildClientUrl(`/reset-password/${resetToken}`);
  } catch {
    console.error("Password reset requires a valid CLIENT_URL.");
    return res
      .status(503)
      .json({ message: "Password reset is temporarily unavailable.", success: false });
  }

  // 3. Acknowledge every valid request before checking whether the account exists.
  res.status(202).json({
    message: "If an account exists, password reset instructions will be sent.",
    success: true,
  });
  try {
    // 4. Email the original token, but store only its hash and a 15-minute expiry.
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          resetPasswordToken: tokenHash,
          resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
      },
      { returnDocument: "after" },
    ).select("email");
    if (!user) return;

    try {
      await sendEmail({
        to: user.email,
        subject: "HomiePlace - Password Reset",
        html: `<h2>Password Reset Request</h2>
          <p>Use the link below to reset your password. It expires in 15 minutes.</p>
          <a href="${resetUrl}" clicktracking="off">Reset password</a>
          <p>If you did not request this, you can ignore this email.</p>`,
      });
    } catch {
      // 5. A failed email must not delete a newer request's token.
      await User.updateOne(
        { _id: user._id, resetPasswordToken: tokenHash },
        { $unset: { resetPasswordToken: "", resetPasswordExpires: "" } },
      );
    }
  } catch {
    console.error("Failed to process password reset request.");
  }
};

export const resetPassword = async (
  req: Request<{ token: string }, {}, ResetPasswordRequestBody>,
  res: Response<PasswordResetResponseBody>,
): Promise<Response | void> => {
  res.set("Cache-Control", "no-store");

  // 1. Read the token from the URL and the new password from the request body.
  const { token } = req.params;
  const password = req.body?.password;
  const confirmPassword = req.body?.confirmPassword;
  // 2. Reject malformed tokens, weak/oversized passwords, and mismatched confirmation.
  if (typeof token !== "string" || !/^[a-f0-9]{40}$/.test(token)) {
    return res.status(400).json({ message: "Invalid or expired reset link.", success: false });
  }
  if (
    typeof password !== "string" ||
    Array.from(password).length < 15 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({
      message: "Password must contain at least 15 characters and at most 72 UTF-8 bytes.",
      success: false,
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords must match.", success: false });
  }
  try {
    // 3. Hash the submitted token for lookup, and hash the password before storing it.
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const hashedPassword = await bycrypt.hash(password, 10);
    // 4. Check expiry, update the password, and remove the token in one database operation.
    const user = await User.findOneAndUpdate(
      { resetPasswordToken: tokenHash, resetPasswordExpires: { $gt: new Date() } },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
      },
      { returnDocument: "after" },
    ).select("_id");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link.", success: false });
    }

    return res
      .status(200)
      .json({ message: "Password updated. Sign in with your new password.", success: true });
  } catch {
    console.error("Failed to reset password.");
    return res
      .status(500)
      .json({ message: "Unable to reset password. Please try again later.", success: false });
  }
};
