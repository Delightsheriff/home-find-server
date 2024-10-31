import { Request, Response } from "express";
import User from "../../models/userModel";
import { sendVerificationEmail } from "../../common/utils/sendVerificationEmail";

/**
 * Resends the verification email to the user.
 *
 * @param req - Express Request object containing the user's email in the body
 * @param res - Express Response object used to send the result back to the client
 */
export const resendVerificationEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      statusText: "error",
      message: "Please provide an email address.",
    });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        statusText: "error",
        message: "User not found.",
      });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({
        statusText: "error",
        message: "Email is already verified.",
      });
      return;
    }

    const origin = `${req.protocol}://${req.get("host")}`;
    await sendVerificationEmail(user, origin);

    res.status(200).json({
      statusText: "success",
      message: "Verification email resent successfully.",
    });
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({
      statusText: "error",
      message:
        "An error occurred while resending the verification email. Please try again later.",
    });
  }
};
