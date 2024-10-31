import { Request, Response } from "express";
import User from "../../models/userModel";
import { sendVerificationEmail } from "../../common/utils/sendVerificationEmail";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/helpers";

export const login = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      statusText: "fail",
      message: "Please provide email and password",
    });
  }

  try {
    const user = await User.findOne({ email }).select(
      "+password +isEmailVerified +refreshToken",
    );
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        statusText: "fail",
        message: "Invalid email or password",
      });
    }

    if (!user.isEmailVerified) {
      const origin = `${req.protocol}://${req.get("host")}`;
      await sendVerificationEmail(user, origin);
      return res.status(403).json({
        statusText: "fail",
        message:
          "Email not verified. Please check your email for verification instructions.",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Create a user object without sensitive information
    const userWithoutSensitiveInfo = user.toObject();
    delete userWithoutSensitiveInfo.password;

    return res.status(200).json({
      statusText: "success",
      message: "Sign in successful",
      data: {
        user: userWithoutSensitiveInfo,
        session: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    console.error("Sign-in error:", error);
  }
};
