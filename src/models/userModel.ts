/**
 * @file userModel.ts
 * @description Defines the Mongoose schema and model for User documents in the application.
 */

import mongoose, {
  Schema,
  Model,
  Document,
  CallbackError,
  Types,
} from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { IUser } from "../common/interfaces/user";
import { ENVIRONMENT } from "../common/config/environment";
import { Role } from "../common/constants";
import { generateToken } from "../common/utils/helpers";

/**
 * Interface for User documents in the database.
 * Extends IUser (which defines basic user properties) and Document (for Mongoose document methods)
 */
export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>; // Method to compare passwords
  createPasswordResetToken(): string; // Method to create a password reset token
}

/**
 * Mongoose schema definition for User documents
 */
const UserSchema = new Schema<IUserDocument>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      set: (v: string) => v.toLowerCase(), // Converts to lowercase before saving
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      set: (v: string) => v.toLowerCase(), // Converts to lowercase before saving
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"], // Custom validator
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(Role), // Restricts values to those defined in Role enum
      required: [true, "Role is required"],
    },
    profilePictureUrl: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpiresAt: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    passwordResetAttempts: { type: Number, default: 0, select: false },
    passwordChangedAt: { type: Date, select: false },
    refreshToken: String,
    propertiesToReview: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
        select: false, // Excludes property from being returned when querying documents
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Includes virtual properties when document is converted to JSON
    toObject: { virtuals: true }, // Includes virtual properties when document is converted to a plain object
  },
);

/**
 * Pre-save middleware to handle the propertiesToReview field based on user role
 * Ensures ADMIN users have an array for propertiesToReview, while other roles have it undefined
 */
UserSchema.pre<IUserDocument>("save", function (next) {
  if (this.role === Role.ADMIN) {
    this.propertiesToReview = this.propertiesToReview || [];
  } else {
    this.propertiesToReview = null;
  }
  next();
});

/**
 * Pre-save middleware to hash password before saving
 * Only hashes the password if it has been modified (or is new)
 */
UserSchema.pre("save", async function (this: IUserDocument, next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error as CallbackError);
  }
});

/**
 * Method to compare a given password with the user's hashed password
 * @param candidatePassword - The password to compare
 * @returns A promise that resolves to a boolean indicating whether the passwords match
 */
UserSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string,
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Method to create a password reset token for the user
 * Generates a JWT token with the user's ID and sets it as the passwordResetToken
 * Also sets the passwordResetExpires field to 1 hour from the current time
 * @returns The generated reset token
 */

UserSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = generateToken(
    { id: this._id },
    ENVIRONMENT.JWT.ACCESS_KEY!,
    "1h",
  );
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
  this.passwordResetAttempts = 0;
  return resetToken;
};

/**
 * Mongoose model for User documents
 */
const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  "User",
  UserSchema,
);

export default User;
