import mongoose, { Model, Schema, Types } from "mongoose";
import { IProperty } from "../common/interfaces/property";
import {
  CommercialSubType,
  Currency,
  IndustrialSubType,
  PropertyType,
  Purpose,
  ResidentialSubType,
  VerificationStatus,
} from "../common/constants";
import { amenitiesSchema } from "./amenitiesSchema";

/**
 * Interface extending IProperty and Document for PropertySchema
 * @interface IPropertyDocument
 * @extends {IProperty}
 * @extends {Document}
 */
export interface IPropertyDocument extends IProperty, Document {
  _id: Types.ObjectId;
}

/**
 * Mongoose schema definition for Property
 * @constant PropertySchema
 */
const PropertySchema = new Schema<IPropertyDocument>(
  {
    // Owner reference
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },

    // Basic property information
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    purpose: {
      type: String,
      enum: Object.values(Purpose),
      required: [true, "Purpose is required"],
    },

    // Property specifications
    propertyType: {
      type: String,
      enum: Object.values(PropertyType),
      required: [true, "Property type is required"],
    },
    subType: {
      type: String,
      required: [true, "Property sub-type is required"],
      validate: {
        validator: function (this: IProperty, v: string) {
          switch (this.propertyType) {
            case PropertyType.RESIDENTIAL:
              return Object.values(ResidentialSubType).includes(
                v as ResidentialSubType,
              );
            case PropertyType.COMMERCIAL:
              return Object.values(CommercialSubType).includes(
                v as CommercialSubType,
              );
            case PropertyType.INDUSTRIAL:
              return Object.values(IndustrialSubType).includes(
                v as IndustrialSubType,
              );
            default:
              return false;
          }
        },
        message: "Invalid property sub-type for the selected property type.",
      },
    },
    size: {
      type: Number,
      required: [true, "Size is required"],
      min: [0, "Size cannot be negative"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
      min: [0, "Number of bedrooms cannot be negative"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: [0, "Number of bathrooms cannot be negative"],
    },
    toilets: {
      type: Number,
      required: [true, "Number of toilets is required"],
      min: [0, "Number of toilets cannot be negative"],
    },
    slots: {
      type: Number,
      required: [true, "Number of slots is required"],
      min: [0, "Number of slots cannot be negative"],
    },

    // Location details
    stateCapital: {
      type: String,
      required: [true, "State Capital is required"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
    },

    // Amenities
    amenities: {
      type: amenitiesSchema,
      required: [true, "Amenities are required"],
    },

    // Verification and status
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      default: VerificationStatus.Pending,
      enum: Object.values(VerificationStatus),
    },

    // Media
    imagesUrl: {
      type: [String],
      required: [true, "At least one image URL is required"],
      validate: [
        (array: string[]) => array.length > 0,
        "At least one image URL is required",
      ],
    },
    videoUrl: {
      type: String,
    },
    ownerShipDocumentUrl: {
      type: String,
      required: [true, "Ownership document URL is required"],
      select: false,
    },

    // Additional fields (suggested additions)
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: Object.values(Currency),
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    reviewComments: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

/**
 * Mongoose model for Property documents
 * @constant Property
 */
const Property: Model<IPropertyDocument> = mongoose.model<IPropertyDocument>(
  "Property",
  PropertySchema,
);

export default Property;
