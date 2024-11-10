import { Request, Response } from "express";
import Property from "../../models/propertyModel";
import { VerificationStatus } from "../../common/constants";

export async function allProperties(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      isVerified: true,
      verificationStatus: VerificationStatus.Verified,
    };

    const [properties, total] = await Promise.all([
      Property.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select("-ownerShipDocumentUrl"),
      Property.countDocuments(query),
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
    console.error("Error fetching properties:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
