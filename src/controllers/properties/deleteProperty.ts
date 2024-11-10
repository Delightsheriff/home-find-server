import { Response } from "express"; // Assuming you have a User model
import { AuthenticatedRequest } from "../../middleware/AuthenticatedRequest";
import Property from "../../models/propertyModel";
import User from "../../models/userModel";

export async function deleteProperty(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const propertyId = req.params.id;
    const userId = req.user._id;

    const [property, user] = await Promise.all([
      Property.findById(propertyId),
      User.findById(userId).select("role"),
    ]);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user is the owner of the property or an admin
    if (property.owner !== userId && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You do not have permission to delete this property",
      });
    }

    await Property.findByIdAndDelete(propertyId);

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
