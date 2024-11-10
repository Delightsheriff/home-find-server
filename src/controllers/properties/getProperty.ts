import { Request, Response } from "express";
import Property from "../../models/propertyModel";

export async function getProperty(req: Request, res: Response) {
  try {
    const propertyId = req.params.id; // Assuming the ID is passed as a route parameter

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    const property = await Property.findById(propertyId).select(
      "-ownerShipDocumentUrl",
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
