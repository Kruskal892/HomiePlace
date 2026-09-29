import type { Request, Response } from "express";
import User from "../models/user.model";
import type { RegisterRequestBody, RegisterResponseBody } from "./auth.types";
import bycrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail";
import { verificationEmailTemplate } from "../utils/emailTemplates";

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
      isApproved: role === "manager" ? false : true,
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
