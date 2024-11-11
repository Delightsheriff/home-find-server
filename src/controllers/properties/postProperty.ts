import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/AuthenticatedRequest";
import User from "../../models/userModel";
import Property from "../../models/propertyModel";

import { validatePropertyData } from "../../common/utils/validateProperty";
import { notifyAdminForApproval } from "../../common/utils/assignAdmin";
import {
  uploadDocument,
  uploadMultipleFiles,
  uploadVideo,
} from "../../common/utils/upload";

export async function postProperty(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const userId = req.user.id;

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
    console.log(req.body);
    // Validate the incoming data
    const validationErrors = validatePropertyData(req.body);
    console.log(validationErrors);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Handle file uploads
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imagesUrls = files.images
      ? await uploadMultipleFiles(files.images)
      : [];
    const ownershipDocumentUrl = files.ownershipDocument
      ? await uploadDocument(files.ownershipDocument[0])
      : "";
    const videoUrl = files.video ? await uploadVideo(files.video[0]) : "";

    // Create a new property object
    const newProperty = new Property({
      ...req.body,
      owner: req.user.id,
      imagesUrl: imagesUrls,
      ownerShipDocumentUrl: ownershipDocumentUrl,
      videoUrl: videoUrl,
      isVerified: false,
      verificationStatus: "pending",
    });

    await newProperty.save();
    await notifyAdminForApproval(newProperty._id);

    return res.status(201).json({
      success: true,
      message: "Property submitted for approval",
      data: {
        propertyId: newProperty._id,
      },
    });
  } catch (error) {
    console.error("Error posting property:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
