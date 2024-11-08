import { Request, Response } from "express";
import User from "../../models/userModel";
import { AuthenticatedRequest } from "../../middleware/AuthenticatedRequest";

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<Response | void> => {
  const userId = req.user?.id;
  //   console.log(userId);

  if (!userId) {
    return res.status(400).json({
      statusText: "fail",
      message: "User ID is required for logout",
    });
  }

  try {
    const user = await User.findById(userId).select("+refreshToken");

    if (!user || !user.refreshToken) {
      return res.status(400).json({
        statusText: "fail",
        message: "User is already logged out",
      });
    }

    // Clear the refresh token in the database
    user.refreshToken = null;
    await user.save();

    return res.status(200).json({
      statusText: "success",
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Sign-out error:", error);
    return res.status(500).json({
      statusText: "error",
      message: "An error occurred while signing out",
    });
  }
};
