import { Request, Response } from "express";
import User from "../../models/userModel";
import { isTokenExpired, verifyEmailToken } from "../../common/utils/helpers";

/**
 * Verifies a user's email address using a token from query parameters.
 *
 * @param req - Express Request object containing the verification token in query params
 * @param res - Express Response object used to send the result back to the client
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    res.status(400).json({
      statusText: "error",
      message: "Invalid or missing token. Please use the link from your email.",
    });
    return;
  }

  try {
    const decoded = verifyEmailToken(token);
    if (!decoded) {
      res.status(400).json({
        statusText: "error",
        message: "Invalid verification link. Please request a new one.",
      });
      return;
    }

    const user = await User.findById(decoded.id).select(
      "+emailVerificationToken +emailVerificationExpiresAt",
    );
    // console.log(user);
    if (!user) {
      res.status(400).json({
        statusText: "error",
        message: "User not found. Please sign up or contact support.",
      });
      return;
    }

    if (user.emailVerificationToken !== token) {
      res.status(400).json({
        statusText: "error",
        message: "Invalid verification link. Please request a new one.",
      });
      return;
    }

    if (
      !user.emailVerificationExpiresAt ||
      isTokenExpired(user.emailVerificationExpiresAt)
    ) {
      res.status(400).json({
        statusText: "error",
        message: "Verification link has expired. Please request a new one.",
      });
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;
    await user.save();

    // Redirect to a success page or render a success message
    res.redirect("/api/v1/auth/email-verified-success");
  } catch (error) {
    // Log the error for debugging
    console.error("Email verification error:", error);

    res.status(500).json({
      statusText: "error",
      message:
        "An error occurred during email verification. Please try again later.",
    });
  }
};
