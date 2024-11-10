import { Types } from "mongoose";
import User from "../../models/userModel";
import { Role } from "../constants";

interface AssignAdminResponse {
  statusText: string;
  message: string;
}

export async function notifyAdminForApproval(
  propertyId: Types.ObjectId,
): Promise<AssignAdminResponse> {
  try {
    // Find all admin users
    const admins = await User.find({ role: Role.ADMIN });

    if (admins.length === 0) {
      console.warn("No admin users found in the database");
      return {
        statusText: "fail",
        message: "No admin users available for property review",
      };
    }

    // Select a random admin
    const randomAdmin = admins[Math.floor(Math.random() * admins.length)];
    // console.log("Random admin:", randomAdmin);

    // Add the property to the selected admin's review list
    const updatedAdmin = await User.findByIdAndUpdate(
      randomAdmin._id,
      { $push: { propertiesToReview: propertyId } },
      { new: true, runValidators: true },
    );

    if (!updatedAdmin) {
      throw new Error("Failed to update admin with property to review");
    }

    // Return success response
    return {
      statusText: "success",
      message: "Property assigned to admin for review",
    };
  } catch (error) {
    console.error("Error in notifyAdminForApproval:", error);
    if (error instanceof Error) {
      return {
        statusText: "error",
        message: error.message || "An error occurred while assigning admin",
      };
    } else {
      return {
        statusText: "error",
        message: "An unknown error occurred while assigning admin",
      };
    }
  }
}
