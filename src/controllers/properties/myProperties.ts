import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/AuthenticatedRequest";
import User from "../../models/userModel";
import Property from "../../models/propertyModel";

export async function getOwnerProperties(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const userId = req.user?.id;

    // Fetch the user's role from the database
    const user = await User.findById(userId).select("role");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "landlord") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only landlords can access this resource",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      Property.find({ owner: userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select("-ownerShipDocumentUrl"),
      Property.countDocuments({ owner: userId }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        properties,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProperties: total,
      },
    });
  } catch (error) {
    console.error("Error fetching owner properties:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
