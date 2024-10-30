import { Request, Response } from "express";
import { Role } from "../../common/constants";
import User, { IUserDocument } from "../../models/userModel";
import { sendVerificationEmail } from "../../common/utils/sendVerificationEmail";
import mongoose from "mongoose";

// Register user
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !role) {
    res.status(400).json({
      statusText: "fail",
      message: "Please provide all required fields",
    });
    return;
  }
  // Validate role
  if (!Object.values(Role).includes(role)) {
    res.status(400).json({
      statusText: "fail",
      message: "Invalid role provided",
    });
    return;
  }
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        statusText: "fail",
        message: "User with this email already exists",
      });
      return;
    }
    // Create new user
    const newUser: IUserDocument = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    //send verification email
    const origin = `${req.protocol}://${req.get("host")}`;
    await sendVerificationEmail(newUser, origin);
    // Successful response
    res.status(201).json({
      statusText: "success",
      message:
        "User created successfully. Please check your email to verify your account.",
      data: { userId: newUser._id },
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle Mongoose validation error
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message,
      );
      res.status(400).json({
        statusText: "fail",
        message: "Validation error",
        errors: errorMessages,
      });
    } else {
      // Log the error for debugging purposes
      console.error("Error during signup:", error);

      // Send generic error response
      res.status(500).json({
        statusText: "error",
        message: "An error occurred during signup. Please try again later.",
      });
    }
  }
};
