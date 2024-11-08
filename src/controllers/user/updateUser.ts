import { Response } from "express";
import User, { IUserDocument } from "../../models/userModel";
import { AuthenticatedRequest } from "../../middleware/AuthenticatedRequest";

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { firstName, lastName } = req.body;
  const userID = req.user?.id;
  // console.log(userID);

  if (!userID) {
    return res.status(401).json({
      statusText: "fail",
      message: "Unauthorized, sign in again",
    });
  }

  try {
    const updateData: Partial<IUserDocument> = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;

    // Only proceed with update if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        statusText: "fail",
        message: "No valid fields to update",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(userID, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        statusText: "fail",
        message: "user not found",
      });
    }
    res.status(200).json({
      statusText: "sucsess",
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.log("Update error: ", error);
    res.status(500).json({
      statusText: "error",
      message: "An error occured while updating user",
    });
  }
};
