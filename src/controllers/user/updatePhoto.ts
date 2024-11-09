import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/AuthenticatedRequest";
import User from "../../models/userModel";
import { deleteFile, uploadImage } from "../../common/utils/upload";

export const updatePhoto = async (req: AuthenticatedRequest, res: Response) => {
  const { file } = req;
  const userID = req.user?.id;

  if (!file) {
    return res.status(404).json({
      statusText: "fail",
      message: "No file uploaded",
    });
  }

  if (!userID) {
    return res.status(401).json({
      statusText: "fail",
      message: "Unauthorized, sign in again",
    });
  }
  try {
    // Find the user and get the current image URL
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        statusText: "fail",
        message: "User not found",
      });
    }
    const oldImageUrl = user.profilePictureUrl;

    // Upload the new image
    const newImageUrl = await uploadImage(file, 800, 800, 85);

    // Update the user with the new image URL
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { profilePictureUrl: newImageUrl },
      { new: true },
    );

    // If update was successful and there was an old image, delete it
    if (updatedUser && oldImageUrl) {
      await deleteFile(oldImageUrl);
    }

    res.status(200).json({
      message: "User image updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Update error: ", error);
    res.status(500).json({
      statusText: "error",
      message: "An error occurred while updating user's photo",
    });
  }
};
