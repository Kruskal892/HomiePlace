import type { Request, Response } from "express";
import User from "../models/user.model";
import type { RegisterRequestBody, RegisterResponseBody } from "./auth.types";
import bycrypt from "bcryptjs";

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
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
